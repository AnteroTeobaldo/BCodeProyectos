import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  PerspectiveCamera,
  Points,
  RawShaderMaterial,
  Scene,
  WebGLRenderer,
  TextureLoader,
  Sprite,
  SpriteMaterial,
  Group,
  Clock,
  Vector3, 
} from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { TWEEN } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/tween.module.min.js";

console.clear();


const count = 128 ** 2;

const scene = new Scene();

const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2, 3);

const renderer = new WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const orbit = new OrbitControls(camera, canvas);



const ctx = document.createElement("canvas").getContext("2d");
ctx.canvas.width = ctx.canvas.height = 32;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 32, 32);

let grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
grd.addColorStop(0.0, "#fff");
grd.addColorStop(1.0, "#000");
ctx.fillStyle = grd;
ctx.beginPath();
ctx.rect(15, 0, 2, 32);
ctx.fill();
ctx.beginPath();
ctx.rect(0, 15, 32, 2);
ctx.fill();

grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
grd.addColorStop(0.1, "#ffff");
grd.addColorStop(0.6, "#0000");
ctx.fillStyle = grd;
ctx.fillRect(0, 0, 32, 32);

const alphaMap = new CanvasTexture(ctx.canvas);

// ------------------------ //
// GALAXY

const galaxyGeometry = new BufferGeometry();

const galaxyPosition = new Float32Array(count * 3);
const galaxySeed = new Float32Array(count * 3);
const galaxySize = new Float32Array(count);

for (let i = 0; i < count; i++) {
  galaxyPosition[i * 3] = i / count;
  galaxySeed[i * 3 + 0] = Math.random();
  galaxySeed[i * 3 + 1] = Math.random();
  galaxySeed[i * 3 + 2] = Math.random();
  galaxySize[i] = Math.random() * 2 + 0.5;
}

galaxyGeometry.setAttribute(
  "position",
  new BufferAttribute(galaxyPosition, 3)
);
galaxyGeometry.setAttribute("size", new BufferAttribute(galaxySize, 1));
galaxyGeometry.setAttribute("seed", new BufferAttribute(galaxySeed, 3));

const innColor = new Color("#f40");
const outColor = new Color("#a7f");

const galaxyMaterial = new RawShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: renderer.getPixelRatio() },
    uBranches: { value: 2 },
    uRadius: { value: 0 },
    uSpin: { value: Math.PI * 0.25 },
    uRandomness: { value: 0 },
    uAlphaMap: { value: alphaMap },
    uColorInn: { value: innColor },
    uColorOut: { value: outColor },
  },

  vertexShader: `
precision highp float;

attribute vec3 position;
attribute float size;
attribute vec3 seed;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uBranches;
uniform float uRadius;
uniform float uSpin;
uniform float uRandomness;

varying float vDistance;

#define PI  3.14159265359
#define PI2 6.28318530718

#include <random, scatter>



void main() {

  vec3 p = position;
  float st = sqrt(p.x);
  float qt = p.x * p.x;
  float mt = mix(st, qt, p.x);

  // Offset positions by spin (farther wider) and branch num
  float angle = qt * uSpin * (2.0 - sqrt(1.0 - qt));
  float branchOffset = (PI2 / uBranches) * floor(seed.x * uBranches);
  p.x = position.x * cos(angle + branchOffset) * uRadius;
  p.z = position.x * sin(angle + branchOffset) * uRadius;

  // Scatter positions & scale down by Y-axis
  p += scatter(seed) * random(seed.zx) * uRandomness * mt;
  p.y *= 0.5 + qt * 0.5;

  // Rotate (center faster)
  vec3 temp = p;
  float ac = cos(-uTime * (2.0 - st) * 0.5);
  float as = sin(-uTime * (2.0 - st) * 0.5);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;



  vDistance = mt;

  vec4 mvp = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvp;
  gl_PointSize = (10.0 * size * uSize) / -mvp.z;
}
`,

  fragmentShader: `
precision highp float;

uniform vec3 uColorInn;
uniform vec3 uColorOut;
uniform sampler2D uAlphaMap;

varying float vDistance;

#define PI  3.14159265359



void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  vec3 color = mix(uColorInn, uColorOut, vDistance);
  float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
  color = max(color, vec3(c));

  gl_FragColor = vec4(color, a);
}
`,

  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
});

const galaxy = new Points(galaxyGeometry, galaxyMaterial);
galaxy.material.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader.replace(
    "#include <random, scatter>",
    shaderUtils
  );
};
scene.add(galaxy);


const dedicationImages = [
  "1.png", "2.png", "3.png", "4.png", "5.png",
  "6.png", "7.png", "8.png", "9.png", "10.png",
  "1.png", "2.png", "3.png", "4.png", "5.png",
  "6.png", "7.png", "8.png", "9.png", "10.png",
  "1.png", "2.png", "3.png", "4.png", "5.png",
  "6.png", "7.png", "8.png", "9.png", "10.png",
];

const textureLoader = new TextureLoader();
const spriteGroup = new Group();
spriteGroup.visible = false;
scene.add(spriteGroup);

const finalRadius = 1.618;
const finalSpin = Math.PI * 2;
const finalRandomness = 0.5;
const branches = galaxyMaterial.uniforms.uBranches.value; // 2

for (let i = 0; i < dedicationImages.length; i++) {
  const texture = textureLoader.load(
    dedicationImages[i],
    undefined,
    undefined,
    () => {
      console.error(`Error: No se pudo cargar la imagen ${dedicationImages[i]}`);
    }
  );

  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });

  const sprite = new Sprite(material);

  const dist = Math.random() * 0.7 + 0.2;
  const qt = dist * dist;
  const st = Math.sqrt(dist);
  const mt = (st + qt) / 2.0;

  const angle = qt * finalSpin * (2.0 - Math.sqrt(1.0 - qt));
  const branchOffset =
    ((Math.PI * 2) / branches) * Math.floor(Math.random() * branches);

  let x = dist * Math.cos(angle + branchOffset) * finalRadius;
  let z = dist * Math.sin(angle + branchOffset) * finalRadius;

  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const randX = Math.sin(phi) * Math.cos(theta);
  const randY = Math.sin(phi) * Math.sin(theta);
  const randZ = Math.cos(phi);

  const scatterAmount = Math.random() * finalRandomness * mt;
  x += randX * scatterAmount;
  z += randZ * scatterAmount;

  let y = randY * scatterAmount;
  y *= 0.5 + qt * 0.5;

  sprite.position.set(x, y, z);

  const scale = 0.2;
  sprite.scale.set(scale, scale, scale);

  spriteGroup.add(sprite);
}



const universeGeometry = new BufferGeometry();

const universePosition = new Float32Array((count * 3) / 2);
const universeSeed = new Float32Array((count * 3) / 2);
const universeSize = new Float32Array(count / 2);

for (let i = 0; i < count / 2; i++) {
  universeSeed[i * 3 + 0] = Math.random();
  universeSeed[i * 3 + 1] = Math.random();
  universeSeed[i * 3 + 2] = Math.random();
  universeSize[i] = Math.random() * 2 + 0.5;
}

universeGeometry.setAttribute(
  "position",
  new BufferAttribute(universePosition, 3)
);
universeGeometry.setAttribute("seed", new BufferAttribute(universeSeed, 3));
universeGeometry.setAttribute("size", new BufferAttribute(universeSize, 1));

const universeMaterial = new RawShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSize: galaxyMaterial.uniforms.uSize,
    uRadius: galaxyMaterial.uniforms.uRadius,
    uAlphaMap: galaxyMaterial.uniforms.uAlphaMap,
  },

  vertexShader: `
precision highp float;

attribute vec3 seed;
attribute float size;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uRadius;

#define PI  3.14159265359
#define PI2 6.28318530718

#include <random, scatter>

// Universe size factor
const float r = 3.0;
// Scale universe sphere  
const vec3 s = vec3(2.1, 1.3, 2.1);



void main() {

  vec3 p = scatter(seed) * r * s;

  // Sweep to center
  float q = random(seed.zx);
  for (int i = 0; i < 3; i++) q *= q;
  p *= q;

  // Sweep to surface
  float l = length(p) / (s.x * r);
  p = l < 0.001 ? (p / l) : p;

  // Rotate (center faster)
  vec3 temp = p;
  float ql = 1.0 - l;
  for (int i = 0; i < 3; i++) ql *= ql;
  float ac = cos(-uTime * ql);
  float as = sin(-uTime * ql);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;



  vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
  gl_Position = projectionMatrix * mvp;

  // Scale up core stars
  l = (2.0 - l) * (2.0 - l);

  gl_PointSize = (r * size * uSize * l) / -mvp.z;
}
`,

  fragmentShader: `
precision highp float;

uniform sampler2D uAlphaMap;

#define PI 3.14159265359

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  gl_FragColor = vec4(vec3(1.0), a);
}
`,

  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
});

const universe = new Points(universeGeometry, universeMaterial);
universe.material.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader.replace(
    "#include <random, scatter>",
    shaderUtils
  );
};
scene.add(universe);



const shootingStarCount = 200; 
const shootingStarGeometry = new BufferGeometry();

const ssPosition = new Float32Array(shootingStarCount * 3);
const ssVelocity = new Float32Array(shootingStarCount * 3);
const ssStartTime = new Float32Array(shootingStarCount);
const ssSize = new Float32Array(shootingStarCount);
const ssColor = new Float32Array(shootingStarCount * 3); 

function getRandomSpherePoint(radius, innerRadius = 0) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    
    let r = innerRadius + Math.random() * (radius - innerRadius);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    return new Vector3(x, y, z);
}

const ssOuterRadius = 6.0; 
const ssInnerRadius = 0.5; 
const ssLifeSpan = 3.0; 

for (let i = 0; i < shootingStarCount; i++) {
    const startPos = getRandomSpherePoint(ssOuterRadius, ssInnerRadius);
    ssPosition[i * 3 + 0] = startPos.x;
    ssPosition[i * 3 + 1] = startPos.y;
    ssPosition[i * 3 + 2] = startPos.z;
    
    const vel = startPos.clone().normalize().multiplyScalar(1.0 + Math.random() * 0.5); 
    vel.x += (Math.random() - 0.5) * 0.5;
    vel.y += (Math.random() - 0.5) * 0.5;
    vel.z += (Math.random() - 0.5) * 0.5;
    vel.normalize();

    ssVelocity[i * 3 + 0] = vel.x;
    ssVelocity[i * 3 + 1] = vel.y;
    ssVelocity[i * 3 + 2] = vel.z;

    ssStartTime[i] = Math.random() * ssLifeSpan;
    ssSize[i] = Math.random() * 3 + 2.0; 

    
    const color = new Color();
    color.setHSL(Math.random() * 0.2 + 0.6, 0.5 + Math.random() * 0.5, 0.7 + Math.random() * 0.3); 
    ssColor[i * 3 + 0] = color.r;
    ssColor[i * 3 + 1] = color.g;
    ssColor[i * 3 + 2] = color.b;
}

shootingStarGeometry.setAttribute("position", new BufferAttribute(ssPosition, 3));
shootingStarGeometry.setAttribute("aVelocity", new BufferAttribute(ssVelocity, 3));
shootingStarGeometry.setAttribute("aStartTime", new BufferAttribute(ssStartTime, 1));
shootingStarGeometry.setAttribute("size", new BufferAttribute(ssSize, 1));
shootingStarGeometry.setAttribute("aColor", new BufferAttribute(ssColor, 3)); 

const shootingStarMaterial = new RawShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uSize: { value: renderer.getPixelRatio() },
        uAlphaMap: { value: alphaMap },
        uSpeed: { value: 10.0 }, 
        uLifeSpan: { value: ssLifeSpan }
    },
    vertexShader: `
        precision highp float;
        attribute vec3 position;
        attribute vec3 aVelocity;
        attribute float aStartTime;
        attribute float size;
        attribute vec3 aColor; // Recibe el color de la estrella

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float uTime;
        uniform float uSize;
        uniform float uSpeed;
        uniform float uLifeSpan;

        varying float vProgress;
        varying vec3 vColor; // Pasa el color al fragment shader

        void main() {
            float timeInLife = mod(uTime + aStartTime, uLifeSpan);
            vProgress = timeInLife / uLifeSpan; 

            // Simula una "cola" más larga al estirar la posición
            vec3 newPos = position + aVelocity * uSpeed * timeInLife;
            // Para el rastro, se puede hacer que el punto inicial se mueva ligeramente con el tiempo
            // o simplemente que la estrella sea más grande en su punto de máxima intensidad.
            
            vColor = aColor; // Asigna el color variado

            vec4 mvp = modelViewMatrix * vec4(newPos, 1.0);
            gl_Position = projectionMatrix * mvp;
            // Aumenta el tamaño de la estrella al inicio y al final de su vida para un efecto de "fuego"
            float adjustedSize = size * (1.0 + sin(vProgress * PI) * 1.5); // Efecto de pulso de tamaño
            gl_PointSize = (adjustedSize * uSize) / -mvp.z; 
        }
    `,
    fragmentShader: `
        precision highp float;
        uniform sampler2D uAlphaMap;
        varying float vProgress;
        varying vec3 vColor; // Recibe el color variado

        #define PI 3.14159265359

        void main() {
            vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
            float a = texture2D(uAlphaMap, uv).g;
            if (a < 0.1) discard;

            // Fade in y fade out más pronunciado para un rastro más visible
            float fade = pow(sin(vProgress * PI), 2.0); // Cuadrado para un pico más agudo
            
            // Usa el color variado
            gl_FragColor = vec4(vColor, a * fade * 0.9); // Opacidad alta en el centro
        }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
});

const shootingStars = new Points(shootingStarGeometry, shootingStarMaterial);
scene.add(shootingStars);


const u = galaxyMaterial.uniforms;



new TWEEN.Tween({
  radius: 0,
  spin: 0,
  randomness: 0,
  rotate: 0,
})
  .to({
    radius: 1.618,
    spin: Math.PI * 2,
    randomness: 0.5,
    rotate: Math.PI * 4, 
  })
  .duration(5000)
  .easing(TWEEN.Easing.Cubic.InOut)
  .onUpdate(({ radius, spin, randomness, rotate }) => {
    u.uRadius.value = radius;
    u.uSpin.value = spin;
    u.uRandomness.value = randomness;

    galaxy.rotation.y = rotate;
    universe.rotation.y = rotate / 3;
    spriteGroup.rotation.y = rotate; 
  })
  .start();

setTimeout(() => {
  spriteGroup.visible = true;
}, 2000); 


const colorPairs = [
  { inn: new Color("#f40"), out: new Color("#a7f") }, 
  { inn: new Color("#40f"), out: new Color("#f7a") }, 
  { inn: new Color("#0f4"), out: new Color("#7fa") }, 
  { inn: new Color("#ff0"), out: new Color("#f0a") },
  { inn: new Color("#f00"), out: new Color("#00f") }, 
  { inn: new Color("#0ff"), out: new Color("#f0f") }, 
];
let colorIndex = 0;

setInterval(() => {
  colorIndex = (colorIndex + 1) % colorPairs.length;
  const newInn = colorPairs[colorIndex].inn;
  const newOut = colorPairs[colorIndex].out;

  new TWEEN.Tween(u.uColorInn.value)
    .to({ r: newInn.r, g: newInn.g, b: newInn.b }, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  new TWEEN.Tween(u.uColorOut.value)
    .to({ r: newOut.r, g: newOut.g, b: newOut.b }, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();
}, 2000); 



const clock = new Clock(); 

renderer.setAnimationLoop(() => {
  const elapsedTime = clock.getElapsedTime(); 

  galaxyMaterial.uniforms.uTime.value = elapsedTime / 2;
  universeMaterial.uniforms.uTime.value = elapsedTime / 3;
  shootingStarMaterial.uniforms.uTime.value = elapsedTime; 

  TWEEN.update();
  orbit.update();
  renderer.render(scene, camera);
});



addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const shaderUtils = `
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 scatter (vec3 seed) {
  float u = random(seed.xy);
  float v = random(seed.yz);
  float theta = u * 6.28318530718;
  float phi = acos(2.0 * v - 1.0);

  float sinTheta = sin(theta);
  float cosTheta = cos(theta);
  float sinPhi = sin(phi);
  float cosPhi = cos(phi);

  float x = sinPhi * cosTheta;
  float y = sinPhi * sinTheta;
  float z = cosPhi;

  return vec3(x, y, z);
}
`;