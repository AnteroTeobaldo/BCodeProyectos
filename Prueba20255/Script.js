"use strict";
console.clear();

const IS_MOBILE = window.innerWidth <= 640;
const IS_DESKTOP = window.innerWidth > 800;
const IS_HEADER = IS_DESKTOP && window.innerHeight < 300;
// Detect high end devices. This will be a moving target.
const IS_HIGH_END_DEVICE = (() => {
  const hwConcurrency = navigator.hardwareConcurrency;
  if (!hwConcurrency) {
    return false;
  }
  // Large screens indicate a full size computer, which often have hyper threading these days.
  // So a quad core desktop machine has 8 cores. We'll place a higher min threshold there.
  const minCount = window.innerWidth <= 1024 ? 4 : 8;
  return hwConcurrency >= minCount;
})();

const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;
const GRAVITY = 0.9; // Acceleration in px/s
let simSpeed = 1;

function getDefaultScaleFactor() {
  if (IS_MOBILE) return 0.9;
  if (IS_HEADER) return 0.75;
  return 1;
}

let stageW, stageH;

// All quality globals will be overwritten and updated via `configDidUpdate`.
let quality = 1;
let isLowQuality = false;
let isNormalQuality = true;
let isHighQuality = false;

const QUALITY_LOW = 1;
const QUALITY_NORMAL = 2;
const QUALITY_HIGH = 3;

const SKY_LIGHT_NONE = 0;
const SKY_LIGHT_DIM = 1;
const SKY_LIGHT_NORMAL = 2;

const COLOR = {
  Red: "#ff0043",
  Green: "#14fc56",
  Blue: "#1e7fff",
  Purple: "#e60aff",
  Gold: "#ffbf36",
  White: "#ffffff",
};

// Special invisible color (not rendered, and therefore not in COLOR map)
const INVISIBLE = "_INVISIBLE_";

const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

// Stage.disableHighDPI = true;
const trailsStage = new Stage("trails-canvas");
const mainStage = new Stage("main-canvas");
const stages = [trailsStage, mainStage];

// Fullscreen helpers, using Fscreen for prefixes.
function fullscreenEnabled() {
  return fscreen.fullscreenEnabled;
}

function isFullscreen() {
  return !!fscreen.fullscreenElement;
}

// Attempt to toggle fullscreen mode.
function toggleFullscreen() {
  if (fullscreenEnabled()) {
    if (isFullscreen()) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(document.documentElement);
    }
  }
}

fscreen.addEventListener("fullscreenchange", () => {
  store.setState({ fullscreen: isFullscreen() });
});

// Simple state container; the source of truth.
const store = {
  _listeners: new Set(),
  _dispatch(prevState) {
    this._listeners.forEach((listener) => listener(this.state, prevState));
  },

  state: {
    // will be unpaused in init()
    paused: true,
    soundEnabled: false,
    menuOpen: false,
    openHelpTopic: null,
    fullscreen: isFullscreen(),
    // Note that config values used for <select>s must be strings, unless manually converting values to strings
    // at render time, and parsing on change.
    config: {
      quality: String(IS_HIGH_END_DEVICE ? QUALITY_HIGH : QUALITY_NORMAL), //
      shell: "Random",
      size: IS_DESKTOP
        ? "3" // Desktop default
        : IS_HEADER
        ? "1.2" // Profile header default (doesn't need to be an int)
        : "2", // Mobile default
      autoLaunch: true,
      finale: false,
      skyLighting: SKY_LIGHT_NORMAL + "",
      hideControls: IS_HEADER,
      longExposure: false,
      scaleFactor: getDefaultScaleFactor(),
    },
  },

  setState(nextState) {
    const prevState = this.state;
    this.state = Object.assign({}, this.state, nextState);
    this._dispatch(prevState);
    this.persist();
  },

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.remove(listener);
  },

  load() {
    const serializedData = localStorage.getItem("cm_fireworks_data");
    if (serializedData) {
      const { schemaVersion, data } = JSON.parse(serializedData);

      const config = this.state.config;
      switch (schemaVersion) {
        case "1.1":
          config.quality = data.quality;
          config.size = data.size;
          config.skyLighting = data.skyLighting;
          break;
        case "1.2":
          config.quality = data.quality;
          config.size = data.size;
          config.skyLighting = data.skyLighting;
          config.scaleFactor = data.scaleFactor;
          break;
        default:
          throw new Error("version switch should be exhaustive");
      }
      console.log(`Loaded config (schema version ${schemaVersion})`);
    }
    // Deprecated data format. Checked with care (it's not namespaced).
    else if (localStorage.getItem("schemaVersion") === "1") {
      let size;
      // Attempt to parse data, ignoring if there is an error.
      try {
        const sizeRaw = localStorage.getItem("configSize");
        size = typeof sizeRaw === "string" && JSON.parse(sizeRaw);
      } catch (e) {
        console.log("Recovered from error parsing saved config:");
        console.error(e);
        return;
      }
      // Only restore validated values
      const sizeInt = parseInt(size, 10);
      if (sizeInt >= 0 && sizeInt <= 4) {
        this.state.config.size = String(sizeInt);
      }
    }
  },

  persist() {
    const config = this.state.config;
    localStorage.setItem(
      "cm_fireworks_data",
      JSON.stringify({
        schemaVersion: "1.2",
        data: {
          quality: config.quality,
          size: config.size,
          skyLighting: config.skyLighting,
          scaleFactor: config.scaleFactor,
        },
      })
    );
  },
};

if (!IS_HEADER) {
  store.load();
}

// Actions
// ---------

function togglePause(toggle) {
  const paused = store.state.paused;
  let newValue;
  if (typeof toggle === "boolean") {
    newValue = toggle;
  } else {
    newValue = !paused;
  }

  if (paused !== newValue) {
    store.setState({ paused: newValue });
  }
}

function toggleSound(toggle) {
  if (typeof toggle === "boolean") {
    store.setState({ soundEnabled: toggle });
  } else {
    store.setState({ soundEnabled: !store.state.soundEnabled });
  }
}

function toggleMenu(toggle) {
  if (typeof toggle === "boolean") {
    store.setState({ menuOpen: toggle });
  } else {
    store.setState({ menuOpen: !store.state.menuOpen });
  }
}

function updateConfig(nextConfig) {
  nextConfig = nextConfig || getConfigFromDOM();
  store.setState({
    config: Object.assign({}, store.state.config, nextConfig),
  });

  configDidUpdate();
}

// Map config to various properties & apply side effects
function configDidUpdate() {
  const config = store.state.config;

  quality = qualitySelector();
  isLowQuality = quality === QUALITY_LOW;
  isNormalQuality = quality === QUALITY_NORMAL;
  isHighQuality = quality === QUALITY_HIGH;

  if (skyLightingSelector() === SKY_LIGHT_NONE) {
    appNodes.canvasContainer.style.backgroundColor = "#000";
  }

  Spark.drawWidth = quality === QUALITY_HIGH ? 0.75 : 1;
}

// Selectors
// -----------

const isRunning = (state = store.state) => !state.paused && !state.menuOpen;

const soundEnabledSelector = (state = store.state) => state.soundEnabled;

const canPlaySoundSelector = (state = store.state) =>
  isRunning(state) && soundEnabledSelector(state);
// Convert quality to number.
const qualitySelector = () => +store.state.config.quality;
const shellNameSelector = () => store.state.config.shell;
// Convert shell size to number.
const shellSizeSelector = () => +store.state.config.size;
const finaleSelector = () => store.state.config.finale;
const skyLightingSelector = () => +store.state.config.skyLighting;
const scaleFactorSelector = () => store.state.config.scaleFactor;

// Help Content
const helpContent = {
  shellType: {
    header: "Shell Type",
    body: 'The type of firework that will be launched. Select "Random" for a nice assortment!',
  },
  shellSize: {
    header: "Shell Size",
    body: "The size of the fireworks. Modeled after real firework shell sizes, larger shells have bigger bursts with more stars, and sometimes more complex effects. However, larger shells also require more processing power and may cause lag.",
  },
  quality: {
    header: "Quality",
    body: "Overall graphics quality. If the animation is not running smoothly, try lowering the quality. High quality greatly increases the amount of sparks rendered and may cause lag.",
  },
  skyLighting: {
    header: "Sky Lighting",
    body: 'Illuminates the background as fireworks explode. If the background looks too bright on your screen, try setting it to "Dim" or "None".',
  },
  scaleFactor: {
    header: "Scale",
    body: "Allows scaling the size of all fireworks, essentially moving you closer or farther away. For larger shell sizes, it can be convenient to decrease the scale a bit, especially on phones or tablets.",
  },
  autoLaunch: {
    header: "Auto Fire",
    body: "Launches sequences of fireworks automatically. Sit back and enjoy the show, or disable to have full control.",
  },
  finaleMode: {
    header: "Finale Mode",
    body: 'Launches intense bursts of fireworks. May cause lag. Requires "Auto Fire" to be enabled.',
  },
  hideControls: {
    header: "Hide Controls",
    body: "Hides the translucent controls along the top of the screen. Useful for screenshots, or just a more seamless experience. While hidden, you can still tap the top-right corner to re-open this menu.",
  },
  fullscreen: {
    header: "Fullscreen",
    body: "Toggles fullscreen mode.",
  },
  longExposure: {
    header: "Open Shutter",
    body: "Experimental effect that preserves long streaks of light, similar to leaving a camera shutter open.",
  },
};

const nodeKeyToHelpKey = {
  shellTypeLabel: "shellType",
  shellSizeLabel: "shellSize",
  qualityLabel: "quality",
  skyLightingLabel: "skyLighting",
  scaleFactorLabel: "scaleFactor",
  autoLaunchLabel: "autoLaunch",
  finaleModeLabel: "finaleMode",
  hideControlsLabel: "hideControls",
  fullscreenLabel: "fullscreen",
  longExposureLabel: "longExposure",
};

const appNodes = {
  stageContainer: ".stage-container",
  canvasContainer: ".canvas-container",
  controls: ".controls",
  menu: ".menu",
  menuInnerWrap: ".menu__inner-wrap",
  pauseBtn: ".pause-btn",
  pauseBtnSVG: ".pause-btn use",
  soundBtn: ".sound-btn",
  soundBtnSVG: ".sound-btn use",
  shellType: ".shell-type",
  shellTypeLabel: ".shell-type-label",
  shellSize: ".shell-size",
  shellSizeLabel: ".shell-size-label",
  quality: ".quality-ui",
  qualityLabel: ".quality-ui-label",
  skyLighting: ".sky-lighting",
  skyLightingLabel: ".sky-lighting-label",
  scaleFactor: ".scaleFactor",
  scaleFactorLabel: ".scaleFactor-label",
  autoLaunch: ".auto-launch",
  autoLaunchLabel: ".auto-launch-label",
  finaleModeFormOption: ".form-option--finale-mode",
  finaleMode: ".finale-mode",
  finaleModeLabel: ".finale-mode-label",
  hideControls: ".hide-controls",
  hideControlsLabel: ".hide-controls-label",
  fullscreenFormOption: ".form-option--fullscreen",
  fullscreen: ".fullscreen",
  fullscreenLabel: ".fullscreen-label",
  longExposure: ".long-exposure",
  longExposureLabel: ".long-exposure-label",

  // Help UI
  helpModal: ".help-modal",
  helpModalOverlay: ".help-modal__overlay",
  helpModalHeader: ".help-modal__header",
  helpModalBody: ".help-modal__body",
  helpModalCloseBtn: ".help-modal__close-btn",
};

// Convert appNodes selectors to dom nodes
Object.keys(appNodes).forEach((key) => {
  appNodes[key] = document.querySelector(appNodes[key]);
});

// Remove fullscreen control if not supported.
if (!fullscreenEnabled()) {
  appNodes.fullscreenFormOption.classList.add("remove");
}

function renderApp(state) {
  const pauseBtnIcon = `#icon-${state.paused ? "play" : "pause"}`;
  const soundBtnIcon = `#icon-sound-${soundEnabledSelector() ? "on" : "off"}`;
  appNodes.pauseBtnSVG.setAttribute("href", pauseBtnIcon);
  appNodes.pauseBtnSVG.setAttribute("xlink:href", pauseBtnIcon);
  appNodes.soundBtnSVG.setAttribute("href", soundBtnIcon);
  appNodes.soundBtnSVG.setAttribute("xlink:href", soundBtnIcon);
  appNodes.controls.classList.toggle(
    "hide",
    state.menuOpen || state.config.hideControls
  );
  appNodes.canvasContainer.classList.toggle("blur", state.menuOpen);
  appNodes.menu.classList.toggle("hide", !state.menuOpen);
  appNodes.finaleModeFormOption.style.opacity = state.config.autoLaunch
    ? 1
    : 0.32;

  appNodes.quality.value = state.config.quality;
  appNodes.shellType.value = state.config.shell;
  appNodes.shellSize.value = state.config.size;
  appNodes.autoLaunch.checked = state.config.autoLaunch;
  appNodes.finaleMode.checked = state.config.finale;
  appNodes.skyLighting.value = state.config.skyLighting;
  appNodes.hideControls.checked = state.config.hideControls;
  appNodes.fullscreen.checked = state.fullscreen;
  appNodes.longExposure.checked = state.config.longExposure;
  appNodes.scaleFactor.value = state.config.scaleFactor.toFixed(2);

  appNodes.menuInnerWrap.style.opacity = state.openHelpTopic ? 0.12 : 1;
  appNodes.helpModal.classList.toggle("active", !!state.openHelpTopic);
  if (state.openHelpTopic) {
    const { header, body } = helpContent[state.openHelpTopic];
    appNodes.helpModalHeader.textContent = header;
    appNodes.helpModalBody.textContent = body;
  }
}

store.subscribe(renderApp);

// Perform side effects on state changes
function handleStateChange(state, prevState) {
  const canPlaySound = canPlaySoundSelector(state);
  const canPlaySoundPrev = canPlaySoundSelector(prevState);

  if (canPlaySound !== canPlaySoundPrev) {
    if (canPlaySound) {
      soundManager.resumeAll();
    } else {
      soundManager.pauseAll();
    }
  }
}

store.subscribe(handleStateChange);

function getConfigFromDOM() {
  return {
    quality: appNodes.quality.value,
    shell: appNodes.shellType.value,
    size: appNodes.shellSize.value,
    autoLaunch: appNodes.autoLaunch.checked,
    finale: appNodes.finaleMode.checked,
    skyLighting: appNodes.skyLighting.value,
    longExposure: appNodes.longExposure.checked,
    hideControls: appNodes.hideControls.checked,
    // Store value as number.
    scaleFactor: parseFloat(appNodes.scaleFactor.value),
  };
}

const updateConfigNoEvent = () => updateConfig();
appNodes.quality.addEventListener("input", updateConfigNoEvent);
appNodes.shellType.addEventListener("input", updateConfigNoEvent);
appNodes.shellSize.addEventListener("input", updateConfigNoEvent);
appNodes.autoLaunch.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.finaleMode.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.skyLighting.addEventListener("input", updateConfigNoEvent);
appNodes.longExposure.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.hideControls.addEventListener("click", () =>
  setTimeout(updateConfig, 0)
);
appNodes.fullscreen.addEventListener("click", () =>
  setTimeout(toggleFullscreen, 0)
);
// Changing scaleFactor requires triggering resize handling code as well.
appNodes.scaleFactor.addEventListener("input", () => {
  updateConfig();
  handleResize();
});

Object.keys(nodeKeyToHelpKey).forEach((nodeKey) => {
  const helpKey = nodeKeyToHelpKey[nodeKey];
  appNodes[nodeKey].addEventListener("click", () => {
    store.setState({ openHelpTopic: helpKey });
  });
});

appNodes.helpModalCloseBtn.addEventListener("click", () => {
  store.setState({ openHelpTopic: null });
});

appNodes.helpModalOverlay.addEventListener("click", () => {
  store.setState({ openHelpTopic: null });
});

// Constant derivations
const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map((colorName) => COLOR[colorName]);
// Invisible stars need an indentifier, even through they won't be rendered - physics still apply.
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];
// Map of color codes to their index in the array. Useful for quickly determining if a color has already been updated in a loop.
const COLOR_CODE_INDEXES = COLOR_CODES_W_INVIS.reduce((obj, code, i) => {
  obj[code] = i;
  return obj;
}, {});
// Tuples is a map keys by color codes (hex) with values of { r, g, b } tuples (still just objects).
const COLOR_TUPLES = {};
COLOR_CODES.forEach((hex) => {
  COLOR_TUPLES[hex] = {
    r: parseInt(hex.substr(1, 2), 16),
    g: parseInt(hex.substr(3, 2), 16),
    b: parseInt(hex.substr(5, 2), 16),
  };
});

// Get a random color.
function randomColorSimple() {
  return COLOR_CODES[(Math.random() * COLOR_CODES.length) | 0];
}

// Get a random color, with some customization options available.
let lastColor;
function randomColor(options) {
  const notSame = options && options.notSame;
  const notColor = options && options.notColor;
  const limitWhite = options && options.limitWhite;
  let color = randomColorSimple();

  // limit the amount of white chosen randomly
  if (limitWhite && color === COLOR.White && Math.random() < 0.6) {
    color = randomColorSimple();
  }

  if (notSame) {
    while (color === lastColor) {
      color = randomColorSimple();
    }
  } else if (notColor) {
    while (color === notColor) {
      color = randomColorSimple();
    }
  }

  lastColor = color;
  return color;
}

function whiteOrGold() {
  return Math.random() < 0.5 ? COLOR.Gold : COLOR.White;
}

// Shell helpers
function makePistilColor(shellColor) {
  return shellColor === COLOR.White || shellColor === COLOR.Gold
    ? randomColor({ notColor: shellColor })
    : whiteOrGold();
}

// Unique shell types
const crysanthemumShell = (size = 1) => {
  const glitter = Math.random() < 0.25;
  const singleColor = Math.random() < 0.72;
  const color = singleColor
    ? randomColor({ limitWhite: true })
    : [randomColor(), randomColor({ notSame: true })];
  const pistil = singleColor && Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(color);
  const secondColor =
    singleColor && (Math.random() < 0.2 || color === COLOR.White)
      ? pistilColor || randomColor({ notColor: color, limitWhite: true })
      : null;
  const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
  let starDensity = glitter ? 1.1 : 1.25;
  if (isLowQuality) starDensity *= 0.8;
  if (isHighQuality) starDensity = 1.2;
  return {
    shellSize: size,
    spreadSize: 300 + size * 100,
    starLife: 900 + size * 200,
    starDensity,
    color,
    secondColor,
    glitter: glitter ? "light" : "",
    glitterColor: whiteOrGold(),
    pistil,
    pistilColor,
    streamers,
  };
};

const ghostShell = (size = 1) => {
  // Extend crysanthemum shell
  const shell = crysanthemumShell(size);
  // Ghost effect can be fast, so extend star life
  shell.starLife *= 1.5;
  // Ensure we always have a single color other than white
  let ghostColor = randomColor({ notColor: COLOR.White });
  // Always use streamers, and sometimes a pistil
  shell.streamers = true;
  const pistil = Math.random() < 0.42;
  const pistilColor = pistil && makePistilColor(ghostColor);
  // Ghost effect - transition from invisible to chosen color
  shell.color = INVISIBLE;
  shell.secondColor = ghostColor;
  // We don't want glitter to be spewed by invisible stars, and we don't currently
  // have a way to transition glitter state. So we'll disable it.
  shell.glitter = "";

  return shell;
};

const strobeShell = (size = 1) => {
  const color = randomColor({ limitWhite: true });
  return {
    shellSize: size,
    spreadSize: 280 + size * 92,
    starLife: 1100 + size * 200,
    starLifeVariation: 0.4,
    starDensity: 1.1,
    color,
    glitter: "light",
    glitterColor: COLOR.White,
    strobe: true,
    strobeColor: Math.random() <