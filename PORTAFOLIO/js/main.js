// Importaciones de Three.js y sus addons desde el import map
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --- Configuración básica de la escena ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// --- Configuración de sombras (MUY IMPORTANTE para el realismo) ---
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras más suaves y realistas

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Controles de órbita ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Efecto de suavizado
controls.minDistance = 10; // Evita que la cámara entre en el planeta
controls.maxDistance = 100; // Limita el alejamiento

// --- Luces ---
// Luz ambiental para rellenar la escena y que no haya negros absolutos
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Luz direccional para simular el Sol. Esta es la que proyectará sombras.
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 5, 15);
directionalLight.castShadow = true; // ¡Activamos las sombras en la luz!
scene.add(directionalLight);

// Configuración de la calidad de la sombra
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// --- Fondo de galaxia (Partículas) ---
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });
const starVertices = [];
for (let i = 0; i < 15000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    if (Math.sqrt(x*x + y*y + z*z) > 100) {
        starVertices.push(x, y, z);
    }
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// --- Creación de Saturno (Con texturas de alta calidad) ---
const textureLoader = new THREE.TextureLoader();

// Planeta
const saturnTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_saturn.jpg');
const saturnGeometry = new THREE.SphereGeometry(3, 64, 64); // Mayor detalle en la esfera
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.castShadow = true; // El planeta proyecta sombras (sobre los anillos)
saturn.receiveShadow = true; // El planeta también puede recibir sombras
scene.add(saturn);

// Anillos
const ringTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_saturn_ring_alpha.png');
const ringGeometry = new THREE.RingGeometry(4, 6, 128); // Mayor detalle en los anillos
// Usamos MeshStandardMaterial para que los anillos puedan recibir sombras
const ringMaterial = new THREE.MeshStandardMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.receiveShadow = true; // ¡Los anillos reciben la sombra del planeta!
ring.rotation.x = -0.5 * Math.PI; // Rotar para que queden horizontales
scene.add(ring);

// --- Creación de Textos 3D ---
const fontLoader = new FontLoader();
const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xaa8800 }); // Color dorado con un poco de emisión
const textGroup = new THREE.Group();
scene.add(textGroup);

fontLoader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const texts = ["Te Amo", "Mi Universo", "Para Siempre"];
    const textOptions = {
        font: font,
        size: 0.5,
        height: 0.1,
    };

    texts.forEach((text, index) => {
        const textGeom = new TextGeometry(text, textOptions);
        const textMesh = new THREE.Mesh(textGeom, textMaterial);
        const angle = (index / texts.length) * Math.PI * 2;
        const radius = 8;
        textMesh.position.x = Math.cos(angle) * radius;
        textMesh.position.z = Math.sin(angle) * radius;
        textMesh.geometry.center();
        textGroup.add(textMesh);
    });
});

// --- Posición inicial de la cámara ---
camera.position.set(0, 10, 20);
camera.lookAt(scene.position);

// --- Bucle de Animación ---
function animate() {
    requestAnimationFrame(animate);

    // Rotación de los objetos para darles vida
    saturn.rotation.y += 0.001;
    ring.rotation.z += 0.0005;
    textGroup.rotation.y += 0.003;

    // Los textos siempre miran a la cámara para ser legibles
    textGroup.children.forEach(text => {
        text.lookAt(camera.position);
    });

    controls.update(); // Actualizar controles
    renderer.render(scene, camera);
}

// --- Manejo de redimensionamiento de la ventana ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();