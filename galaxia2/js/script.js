
let escena, camara, renderizador, saturno, controles, fuente;
let lluviaCorazonesActiva = false, contadorToques = 0;
let objetosMensaje = [];
let objetosTextoAnillo = [];
let audioHabilitado = false;
let audioReproducido = false;

const cargadorTexturas = new THREE.TextureLoader();
const cargadorFuentes = new THREE.FontLoader();

const URL_TEXTURA_SATURNO = 'https://bcodestorague.anteroteobaldob.workers.dev/share/anteroteobaldob_gmail_com/TEXTURAS/textura_sat.jpg';

const textoAnillo = "TE AMO CON TODO MI CORAZÓN Y ALMA PARA SIEMPRE MI AMOR ETERNO";

const mensajesAmor = [
    "TE AMOO", "TE QUIERO", "MI REINA", "MI AMOR", "ERES ÚNICA",  
    "PARA SIEMPRE", "MI VIDA", "MI CORAZÓN", "MI ALMA", "MI LUZ",  
    "MI RAZÓN", "MI FELICIDAD", "MI SUEÑO", "MI DESEO", "MI PASIÓN",  
    "MI TESORO", "MI ÁNGEL", "MI SOL", "MI ESTRELLA", "MI DESTINO",  
    "MI SUERTE", "MI COMPAÑERA", "MI AMIGA", "MI APOYO", "MI REFUGIO",  
    "MI PAZ", "MI CALMA", "MI FUERZA", "MI DEBILIDAD", "MI SONRISA",  
    "MI RISITA", "MI LOCURA", "MI SERENIDAD", "MI EQUILIBRIO",  
    "MI COMPLEMENTO", "MI NARANJA", "MI GEMELA", "MI TODO",  
    "MI ETERNA", "MI INFINITO", "MI PRESENTE", "MI FUTURO", "MI PASADO",  
    "MI HOY", "MI MAÑANA", "MI SIEMPRE", "MI NUNCA", "MI AHORA"

];

const mensajesImagen = [
    "Eres la luz que ilumina mi vida cada día",
    "Cada momento a tu lado es un regalo del universo",
    "Tu sonrisa es mi mayor tesoro",
    "Contigo he encontrado el amor verdadero"
];

function crearEstrellasCSS(cantidad) {
    const cielo = document.getElementById('cielo-estrellas');
    for (let i = 0; i < cantidad; i++) {
        const estrella = document.createElement('div');
        estrella.classList.add('estrella');
        const tamaño = Math.random() * 2 + 1;
        estrella.style.width = tamaño + 'px';
        estrella.style.height = tamaño + 'px';
        estrella.style.left = Math.random() * 100 + 'vw';
        estrella.style.top = Math.random() * 100 + 'vh';
        estrella.style.setProperty('--retraso', Math.random() * 5 + 's');
        estrella.style.setProperty('--duracion', (Math.random() * 4 + 2) + 's');
        cielo.appendChild(estrella);
    }
}

function cargarRecursos() {
    return Promise.all([
        new Promise((resolver) => {
            cargadorFuentes.load(
                'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
                (fuenteCargada) => {
                    fuente = fuenteCargada;
                    resolver();
                },
                undefined,
                (error) => {
                    console.error('Error cargando la fuente:', error);
                    resolver();
                }
            );
        })
    ]);
}

function simularCarga() {
    const cargadorReloj = document.getElementById('cargador-reloj');
    const textoProgreso = document.getElementById('texto-progreso');
    let progreso = 0;
    
    const intervalo = setInterval(() => {
        progreso += 1;
        if (progreso <= 100) {
            cargadorReloj.style.setProperty('--progreso', progreso + '%');
            textoProgreso.textContent = progreso + '%';
        } else {
            clearInterval(intervalo);
        }
    }, 30);
}

function inicializar() {
    simularCarga();
    
    setTimeout(() => {
        document.getElementById('cargando').style.display = 'none';
        
        escena = new THREE.Scene();
        escena.background = null;
        
        camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camara.position.set(0, 8, 30);
        
        renderizador = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance" 
        });
        renderizador.setSize(window.innerWidth, window.innerHeight);
        renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderizador.shadowMap.enabled = true;
        renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
        renderizador.toneMapping = THREE.ACESFilmicToneMapping;
        renderizador.toneMappingExposure = 1.2;
        renderizador.setClearColor(0x000000, 0);
        
        document.getElementById('contenedor-escena').appendChild(renderizador.domElement);
        
        controles = new THREE.OrbitControls(camara, renderizador.domElement);
        controles.enableDamping = true;
        controles.dampingFactor = 0.05;
        controles.rotateSpeed = 0.5;
        controles.enableZoom = true;
        controles.autoRotate = true;
        controles.autoRotateSpeed = 0.2;
        controles.minDistance = 20;
        controles.maxDistance = 60;
        
        controles.addEventListener('change', manejarMovimientoCamara);
        
        const luzAmbiental = new THREE.AmbientLight(0x444477, 0.4);
        escena.add(luzAmbiental);
        
        const luzDireccional = new THREE.DirectionalLight(0xffffff, 1.5);
        luzDireccional.position.set(10, 10, 5);
        luzDireccional.castShadow = true;
        escena.add(luzDireccional);
        
        const luzPunto = new THREE.PointLight(0xff69b4, 0.6, 50);
        luzPunto.position.set(0, 0, 10);
        escena.add(luzPunto);
        
        const luzTrasera = new THREE.DirectionalLight(0x4466aa, 0.6);
        luzTrasera.position.set(-5, -5, -5);
        escena.add(luzTrasera);
        
        crearSaturno();
        crearAnilloTexto();
        crearCampoEstrellas();
        crearMensajesAmor();
        crearParticulasFlotantes();
        
        configurarEventos();
        
        animar();
    }, 3500);
}

function crearSaturno() {
    const geometria = new THREE.SphereGeometry(4, 128, 128);
    const materialTemporal = new THREE.MeshPhongMaterial({ color: 0xddaa77, shininess: 10 });
    
    saturno = new THREE.Mesh(geometria, materialTemporal);
    saturno.castShadow = true;
    saturno.receiveShadow = true;
    escena.add(saturno);
    
    cargadorTexturas.load(URL_TEXTURA_SATURNO, 
        (textura) => {
            textura.anisotropy = renderizador.capabilities.getMaxAnisotropy();
            const material = new THREE.MeshPhongMaterial({ 
                map: textura, bumpScale: 0.05, specular: new THREE.Color(0x333333), shininess: 15
            });
            saturno.material = material;
        },
        undefined,
        (error) => {
            console.error('Error cargando textura de Saturno:', error);
        }
    );
    
    const geometriaAtmosfera = new THREE.SphereGeometry(4.15, 64, 64);
    const materialAtmosfera = new THREE.MeshPhongMaterial({
        color: 0x88aaff, transparent: true, opacity: 0.08, side: THREE.BackSide
    });
    const atmosfera = new THREE.Mesh(geometriaAtmosfera, materialAtmosfera);
    saturno.add(atmosfera);
}

function crearAnilloTexto() {
    const radio = 7;
    const totalLetras = textoAnillo.length;
    const pasoAngulo = (Math.PI * 2) / totalLetras;
    
    const geometriaAnilloInterno = new THREE.RingGeometry(4.8, 5.2, 64);
    const materialAnilloInterno = new THREE.MeshPhongMaterial({
        color: 0xffccff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        emissive: 0x330022
    });
    const anilloInterno = new THREE.Mesh(geometriaAnilloInterno, materialAnilloInterno);
    anilloInterno.rotation.x = Math.PI / 2 + 0.1;
    escena.add(anilloInterno);
    
    const geometriaAnilloExterno = new THREE.RingGeometry(8.8, 9.2, 64);
    const materialAnilloExterno = new THREE.MeshPhongMaterial({
        color: 0xffccff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        emissive: 0x330022
    });
    const anilloExterno = new THREE.Mesh(geometriaAnilloExterno, materialAnilloExterno);
    anilloExterno.rotation.x = Math.PI / 2 + 0.1;
    escena.add(anilloExterno);
    
    if (fuente) {
        for (let i = 0; i < totalLetras; i++) {
            const letra = textoAnillo[i];
            
            const geometriaTexto = new THREE.TextGeometry(letra, {
                font: fuente,
                size: 0.4,
                height: 0.05,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.02,
                bevelSegments: 3
            });
            
            const materialTexto = new THREE.MeshPhongMaterial({
                color: 0xffccff,
                emissive: 0x550044,
                specular: 0xffaaff,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
            
            const mallaTexto = new THREE.Mesh(geometriaTexto, materialTexto);
            
            const angulo = -i * pasoAngulo;
            mallaTexto.position.x = Math.cos(angulo) * radio;
            mallaTexto.position.z = Math.sin(angulo) * radio;
            mallaTexto.position.y = 0;
            
            mallaTexto.rotation.y = angulo + Math.PI;
            mallaTexto.rotation.x = Math.PI / 2;
            
            escena.add(mallaTexto);
            objetosTextoAnillo.push(mallaTexto);
        }
    } else {
        crearAnilloRespaldo();
    }
}

function crearAnilloRespaldo() {
    const radio = 7;
    const totalEsferas = textoAnillo.length * 2;
    const pasoAngulo = (Math.PI * 2) / totalEsferas;
    
    for (let i = 0; i < totalEsferas; i++) {
        const geometriaEsfera = new THREE.SphereGeometry(0.1, 8, 8);
        const materialEsfera = new THREE.MeshPhongMaterial({
            color: 0xffccff,
            emissive: 0x550044,
            transparent: true,
            opacity: 0.9
        });
        
        const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
        
        const angulo = i * pasoAngulo;
        esfera.position.x = Math.cos(angulo) * radio;
        esfera.position.z = Math.sin(angulo) * radio;
        esfera.position.y = 0;
        
        escena.add(esfera);
        objetosTextoAnillo.push(esfera);
    }
}

function crearCampoEstrellas() {
    const geometriaEstrellas = new THREE.BufferGeometry();
    const materialEstrellas = new THREE.PointsMaterial({
        color: 0xffffff, size: 0.2, transparent: true, sizeAttenuation: true
    });
    
    const verticesEstrellas = [];
    for (let i = 0; i < 10000; i++) {
        verticesEstrellas.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
    }
    
    geometriaEstrellas.setAttribute('position', new THREE.Float32BufferAttribute(verticesEstrellas, 3));
    const campoEstrellas = new THREE.Points(geometriaEstrellas, materialEstrellas);
    escena.add(campoEstrellas);
}

function crearMensajesAmor() {
    const mensajesMezclados = [...mensajesAmor].sort(() => Math.random() - 0.5);
    const mensajesAUsar = mensajesMezclados.slice(0, 50);
    
    mensajesAUsar.forEach((mensaje, i) => {
        let mallaTexto;
        
        if (fuente) {
            const geometriaTexto = new THREE.TextGeometry(mensaje, {
                font: fuente, 
                size: 0.4, 
                height: 0.1, 
                curveSegments: 8,
                bevelEnabled: true, 
                bevelThickness: 0.02, 
                bevelSize: 0.03, 
                bevelSegments: 3
            });
            
            geometriaTexto.computeBoundingBox();
            geometriaTexto.center();
            
            mallaTexto = new THREE.Mesh(geometriaTexto, crearMaterialTexto());
        } else {
            mallaTexto = crearTextoRespaldo(mensaje);
        }
        
        const distancia = 10 + Math.random() * 8;
        const angulo = Math.random() * Math.PI * 2;
        const altura = (Math.random() - 0.5) * 10;
        
        mallaTexto.position.set(Math.cos(angulo) * distancia, altura, Math.sin(angulo) * distancia);
        
        escena.add(mallaTexto);
        objetosMensaje.push({
            malla: mallaTexto,
            alturaOriginal: altura,
            velocidad: 0.2 + Math.random() * 0.3,
            angulo: angulo,
            distancia: distancia
        });
    });
}

function crearMaterialTexto() {
    return new THREE.MeshStandardMaterial({
        color: 0xff69b4, 
        emissive: 0x550033,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true, 
        opacity: 0.9
    });
}
    

function crearTextoRespaldo(mensaje) {
    const grupo = new THREE.Group();
    
    for (let i = 0; i < mensaje.length; i++) {
        const geometriaEsfera = new THREE.SphereGeometry(0.1, 6, 6);
        const materialEsfera = crearMaterialTexto();
        const esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
        esfera.position.x = i * 0.3;
        grupo.add(esfera);
    }
    
    return grupo;
}

function crearParticulasFlotantes() {
    const geometriaParticulas = new THREE.BufferGeometry();
    const cantidadParticulas = 1500;
    
    const posiciones = new Float32Array(cantidadParticulas * 3);
    const colores = new Float32Array(cantidadParticulas * 3);
    
    for (let i = 0; i < cantidadParticulas * 3; i += 3) {
        posiciones[i] = (Math.random() - 0.5) * 200;
        posiciones[i + 1] = (Math.random() - 0.5) * 200;
        posiciones[i + 2] = (Math.random() - 0.5) * 200;
        
        colores[i] = Math.random() * 0.5 + 0.5;
        colores[i + 1] = Math.random() * 0.3 + 0.3;
        colores[i + 2] = Math.random() * 0.7 + 0.3;
    }
    
    geometriaParticulas.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    geometriaParticulas.setAttribute('color', new THREE.BufferAttribute(colores, 3));
    
    const materialParticulas = new THREE.PointsMaterial({
        size: 0.1, 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.7
    });
    
    const particulas = new THREE.Points(geometriaParticulas, materialParticulas);
    escena.add(particulas);
}

function configurarEventos() {
    document.addEventListener('click', manejarInteraccion);
    document.addEventListener('touchstart', manejarInteraccion);
    
    document.addEventListener('click', mostrarEfectoToque);
    document.addEventListener('touchstart', mostrarEfectoToque);
    
    document.querySelectorAll('.elemento-galeria').forEach(elemento => {
        elemento.addEventListener('click', abrirModal);
    });
    
    document.querySelector('.boton-cerrar').addEventListener('click', cerrarModal);
    
    document.getElementById('alternar-audio').addEventListener('click', alternarAudio);
    
    window.addEventListener('resize', manejarRedimensionamiento);
    window.addEventListener('wheel', manejarDesplazamiento);
}

function manejarMovimientoCamara() {
    if (audioHabilitado && !audioReproducido) {
        reproducirAudio();
    }
}

function manejarDesplazamiento() {
    if (audioHabilitado && !audioReproducido) {
        reproducirAudio();
    }
}

function alternarAudio() {
    audioHabilitado = !audioHabilitado;
    const botonAudio = document.getElementById('alternar-audio');
    
    if (audioHabilitado) {
        botonAudio.textContent = 'ON';
        botonAudio.style.background = 'rgba(255, 105, 180, 0.3)';
        reproducirAudio();
    } else {
        botonAudio.textContent = 'OFF';
        botonAudio.style.background = 'rgba(255, 255, 255, 0.15)';
        pausarAudio();
    }
}

function reproducirAudio() {
    const audio = document.getElementById('audio-fondo');
    if (audioHabilitado) {
        audio.play().then(() => {
            audioReproducido = true;
        }).catch(e => {
            console.log("Audio requiere interacción del usuario primero para reproducirse.");
        });
    }
}

function pausarAudio() {
    const audio = document.getElementById('audio-fondo');
    audio.pause();
}

function manejarInteraccion(e) {
    if (e.target.closest('.elemento-galeria') || e.target.closest('.modal') || e.target.closest('#alternar-audio') || document.getElementById('cargando').style.display !== 'none') return;
    
    if (!audioReproducido) {
        audioHabilitado = true;
        document.getElementById('alternar-audio').textContent = 'ON';
        document.getElementById('alternar-audio').style.background = 'rgba(255, 105, 180, 0.3)';
        reproducirAudio();
    }
    
    crearExplosionTexto(e);
    crearLluviaCorazones();
    
    contadorToques++;
    if (contadorToques === 5) {
        document.getElementById('instrucciones').textContent = "¡Eres increíble! Cada toque es un latido de mi corazón ❤️";
    } else if (contadorToques === 10) {
        document.getElementById('instrucciones').textContent = "Eres el amor de mi vida 💖";
    } else if (contadorToques >= 15) {
        const mensajes = ["Mi corazón late por ti", "Eres mi sueño hecho realidad", "Eres mi todo", "Te amo más cada día", "Eres mi razón de ser"];
        document.getElementById('instrucciones').textContent = mensajes[Math.floor(Math.random() * mensajes.length)];
    }
}

function crearExplosionTexto(e) {
    const x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const y = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    const textosAmor = ["TE AMO", "ERES MÍA", "MI AMOR", "PARA SIEMPRE", "MI VIDA", "MI TODO", "MI CORAZÓN", "MI ALMA"];
    const textoAleatorio = textosAmor[Math.floor(Math.random() * textosAmor.length)];
    
    const explosionTexto = document.createElement('div');
    explosionTexto.innerHTML = textoAleatorio;
    explosionTexto.style.position = 'absolute';
    explosionTexto.style.left = x + 'px';
    explosionTexto.style.top = y + 'px';
    explosionTexto.style.fontSize = '24px';
    explosionTexto.style.color = '#ff69b4';
    explosionTexto.style.fontWeight = 'bold';
    explosionTexto.style.textShadow = '0 0 10px #ff1493';
    explosionTexto.style.zIndex = '20';
    explosionTexto.style.pointerEvents = 'none';
    explosionTexto.style.transform = 'translate(-50%, -50%)';
    explosionTexto.style.animation = 'animacionExplosionTexto 1.5s ease-out forwards';
    
    document.getElementById('superposicion-ui').appendChild(explosionTexto);
    
    setTimeout(() => {
        if (explosionTexto.parentNode) explosionTexto.parentNode.removeChild(explosionTexto);
    }, 1500);
}

const estilo = document.createElement('style');
estilo.textContent = `
    @keyframes animacionExplosionTexto {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
        }
    }
`;
document.head.appendChild(estilo);

function mostrarEfectoToque(e) {
    if (e.target.closest('.elemento-galeria') || e.target.closest('.modal') || e.target.closest('#alternar-audio') || document.getElementById('cargando').style.display !== 'none') return;
    
    const indicador = document.getElementById('indicador-toque');
    const x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const y = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    indicador.style.left = x + 'px';
    indicador.style.top = y + 'px';
    indicador.style.opacity = '1';
    
    setTimeout(() => { indicador.style.opacity = '0'; }, 300);
}

function crearLluviaCorazones() {
    if (lluviaCorazonesActiva) return;
    
    lluviaCorazonesActiva = true;
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => crearCorazon(), i * 80);
    }
    
    crearCorazones3D();
    
    setTimeout(() => { lluviaCorazonesActiva = false; }, 3000);
}

function crearCorazon() {
    const corazon = document.createElement('div');
    corazon.innerHTML = '❤️';
    corazon.classList.add('corazon');
    corazon.style.left = Math.random() * 100 + 'vw';
    corazon.style.fontSize = (Math.random() * 20 + 18) + 'px';
    corazon.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    document.getElementById('superposicion-ui').appendChild(corazon);
    
    setTimeout(() => {
        if (corazon.parentNode) corazon.parentNode.removeChild(corazon);
    }, 5000);
}

function crearCorazones3D() {
    for (let i = 0; i < 10; i++) {
        const geometriaCorazon = new THREE.SphereGeometry(0.15, 8, 8);
        const materialCorazon = new THREE.MeshPhongMaterial({ color: 0xff69b4, emissive: 0x990044 });
        
        const corazon = new THREE.Mesh(geometriaCorazon, materialCorazon);
        corazon.position.set((Math.random() - 0.5) * 20, 10 + Math.random() * 5, (Math.random() - 0.5) * 20);
        
        escena.add(corazon);
        animarCorazon3D(corazon);
    }
}

function animarCorazon3D(corazon) {
    const velocidadCaida = Math.random() * 0.05 + 0.02;
    const velocidadRotacion = Math.random() * 0.1 + 0.05;
    
    function animar() {
        corazon.position.y -= velocidadCaida;
        corazon.rotation.x += velocidadRotacion;
        corazon.rotation.z += velocidadRotacion;
        
        if (corazon.position.y > -10) {
            requestAnimationFrame(animar);
        } else {
            escena.remove(corazon);
        }
    }
    
    animar();
}

function abrirModal(e) {
    const indice = parseInt(e.currentTarget.getAttribute('data-indice'));
    const modal = document.getElementById('modal-imagen');
    const imagenModal = document.getElementById('imagen-modal');
    const mensajeModal = document.getElementById('mensaje-modal');
    
    imagenModal.src = e.currentTarget.querySelector('img').src;
    mensajeModal.textContent = mensajesImagen[indice];
    
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-imagen').style.display = 'none';
}

function manejarRedimensionamiento() {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
}

function animar() {
    requestAnimationFrame(animar);
    
    saturno.rotation.y += 0.001;
    
    objetosTextoAnillo.forEach((obj, i) => {
        obj.rotation.y += 0.001;
        obj.position.y = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.2;
        
        obj.lookAt(camara.position);
    });
    
    const tiempo = Date.now() * 0.001;
    
    objetosMensaje.forEach((obj, i) => {
        obj.malla.position.y = obj.alturaOriginal + Math.sin(tiempo * obj.velocidad + i) * 1.5;
        obj.angulo += 0.001 * obj.velocidad;
        obj.malla.position.x = Math.cos(obj.angulo) * obj.distancia;
        obj.malla.position.z = Math.sin(obj.angulo) * obj.distancia;
        
        obj.malla.lookAt(camara.position);
    });
    
    controles.update();
    renderizador.render(escena, camara);
}

cargarRecursos().then(() => {
    crearEstrellasCSS(150);
    inicializar();
});
