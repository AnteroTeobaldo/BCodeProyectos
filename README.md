# 📘 Documentación Técnica de BCode Pro

Bienvenido a la documentación técnica completa de **BCode Pro**. Este documento detalla la arquitectura, la estructura de archivos y la funcionalidad de cada componente del sistema. Está diseñado para ser comprendido tanto por desarrolladores humanos como por asistentes de Inteligencia Artificial.

---

## 🌟 1. Descripción General

**BCode Pro** es un Entorno de Desarrollo Integrado (IDE) basado en la web, diseñado para ofrecer una experiencia similar a VS Code directamente en el navegador.

**Características Principales:**
*   **Editor de Código:** Basado en Monaco Editor, con soporte para HTML, CSS, JS y Python.
*   **Ejecución en Cliente:** Previsualización en tiempo real (iframe) y ejecución de Python (Pyodide).
*   **Backend Híbrido:** 
    *   **PHP:** Enrutamiento y entrega de vistas.
    *   **Cloudflare Workers:** Gestión de alto rendimiento para archivos en la nube (Backblaze B2) para usuarios PRO.
    *   **Firebase:** Autenticación y base de datos en tiempo real (Firestore).
*   **Ecosistema:** Incluye herramientas como acortador de URLs, generador de QR y portafolio integrado.
*   **Asistente IA:** Integración con modelos LLM para asistencia de código.

---

## 📂 2. Estructura del Backend (Raíz)

El backend maneja el enrutamiento, la entrega de vistas y la API de archivos.

*   **`index.php`**: **Punto de entrada principal.**
    *   Maneja todas las solicitudes HTTP.
    *   Implementa un enrutador simple (`?view=...`).
    *   Sirve archivos estáticos con los tipos MIME correctos.
    *   Proporciona una API REST básica (`?api=upload`, `?api=delete`) como fallback para la gestión de archivos.
*   **`index_module.php`**: **Controlador de Vistas.**
    *   Selecciona el archivo HTML correcto de la carpeta `frontend/` según el parámetro `view`.
    *   **Seguridad:** Inyecta scripts de protección (bloqueo de F12, anti-copia, ofuscación) y configuraciones dinámicas antes de servir el HTML.
    *   Maneja la lógica de las plantillas para la vista previa (`view=preview`).
*   **`contact.php`**: **Procesador de Formularios.**
    *   Recibe datos POST del formulario de contacto.
    *   Valida entradas y envía correos electrónicos mediante la función `mail()` de PHP.
*   **`module_loader.php`**: **Cargador de Datos.**
    *   API auxiliar para cargar listas de proyectos o datos dinámicos para el frontend (ej. `script_proyectss.js`).

---

## 🖥️ 3. Estructura del Frontend (`frontend/`)

Contiene las vistas HTML que se cargan dinámicamente dentro del shell de la aplicación.

*   **`editor.html`**: La interfaz principal del IDE (paneles, pestañas, área de código).
*   **`proyectos.html`**: Galería de proyectos públicos y plantillas.
*   **`portafolio.html`**: Página de presentación personal/profesional.
*   **`documentacion.html`**: Guía de usuario y documentación técnica.
*   **`contacto.html`**: Formulario de contacto dedicado.
*   **`politicas_privacidad.html`**: Documento legal de privacidad.
*   **`terminos_condiciones.html`**: Términos de uso del servicio.
*   **`bc_recorter.html`**: Herramienta de acortamiento de URLs (BC-RECORTER).
*   **`generador_qr.html`**: Herramienta para generar códigos QR personalizados.
*   **`generator_link.html`**: Página intermedia de carga/espera al generar enlaces.
*   **`redirect.html`**: Página que maneja la redirección final de URLs acortadas.
*   **`dashboard.html`**: Panel de control de usuario (estadísticas, gestión).

---

## ⚙️ 4. Núcleo de JavaScript (`coddjs/`)

La lógica del cliente está modularizada en la carpeta `coddjs`.

### 🏗️ **`editor/`** (Lógica del IDE)
*   **`main.js`**: **Cerebro del editor.** Inicializa Monaco, gestiona el estado global, coordina la carga de archivos y conecta todos los módulos.
*   **`configuracion-editor.js`**: Define las opciones de Monaco Editor (tema, fuente, minimapa).
*   **`cargar_srcipts.js`**: Script de arranque que carga dependencias (RequireJS, librerías) y lanza `appInit()`.

### ☁️ **`firebase/`** & **`autenticacion/`**
*   **`firebase-config.js`**: Credenciales de conexión a Firebase.
*   **`autenticacion.js`**: Maneja login (Google/Email), registro y cierre de sesión.
*   **`validacion-acceso.js`**: Protege rutas o funciones que requieren suscripción PRO.

### 🛡️ **`admin/`** (Gestión de Usuarios y Archivos)
*   **`operacione-users-pro.js`**: Gestiona la interacción con **Cloudflare Workers** para subir, listar y eliminar proyectos en la nube (Backblaze B2) de forma segura y rápida para usuarios PRO.
*   **`panel-admin.js`**, **`usuarios-admin.js`**: Lógica para el panel de administración de usuarios (búsqueda, activación de trials, estadísticas).

### 🖼️ **`gallery/`**
*   **`gallery.js`**: Clase `ProjectGallery` que renderiza las tarjetas de proyectos. Implementa `IntersectionObserver` para carga diferida (lazy loading) y animaciones de entrada.

### 👁️ **`preview/`**
*   **`preview-iframe.js`**: **Motor de renderizado.**
    *   Toma el código del editor (HTML/CSS/JS).
    *   Resuelve rutas relativas a archivos en memoria (Blob/Base64).
    *   Inyecta el código en un `iframe` aislado.
    *   Captura logs y errores del iframe para mostrarlos en la consola del editor.

### 🐍 **`python/`**
*   **`python-executor.js`**: Integra **Pyodide** para ejecutar código Python en el navegador (WebAssembly). Captura `stdout` y maneja `input()`.

### 🤖 **`chat/`** (IA)
*   **`chat-ai.js`**: Cliente para interactuar con modelos de IA (Gemini, DeepSeek). Gestiona el historial de chat y el contexto del código.
*   **`modales.js`**: Controla la ventana flotante del chat.

### 🐾 **`pets/`** (Mascotas Virtuales)
*   **`petManager.js`**: Gestiona el ciclo de vida de las mascotas en el editor.
*   **`pet.js`**: Clase base que define el comportamiento de una mascota.
*   **`petAnimations.js`**: Define sprites y secuencias de animación (idle, walk, run).
*   **`petFactory.js`**: Crea instancias de mascotas según configuración.

### 🛠️ **`utilidades/`**
*   **`autocorreccion.js`**: Sistema avanzado que usa TypeScript Worker para detectar errores de sintaxis/semántica en JS en tiempo real.
*   **`helpers.js`**: Funciones auxiliares (formato de fecha, debounce, etc.).
*   **`sincronizacion.js`**: Sincroniza el estado del editor con Firestore (persistencia en la nube).

### 📜 **`scripts/`** (Lógica de Páginas Específicas)
*   **`script_proyectss.js`**: Controla la galería, filtros y paginación en `proyectos.html`.
*   **`scriprecorter.js`**: Lógica del acortador de URLs (interacción con Firestore).
*   **`script_qrbcode.js`**: Lógica de generación y descarga de QRs.
*   **`script_doc.js`**: Funcionalidad de la página de documentación (sidebar pegajoso, búsqueda).
*   **`script_portafolio.js`**: Animaciones (AOS, Three.js) y lógica del portafolio personal.
*   **`scriptredirec.js`**: Maneja la cuenta regresiva y redirección segura en `redirect.html`.
*   **`generator_links.js`**: Lógica para la página de espera `generator_link.html`.
*   **`protect.js`**: Script de seguridad modular que bloquea F12, clic derecho y herramientas de desarrollo.
*   **`adsencemanager.js`**: Gestor inteligente de Google AdSense (carga dinámica, manejo de slots).
*   **`ads_manager.js`**: Integración con IMA SDK para anuncios de video.

### 🔧 **`configuracion/`**
*   **`instructions.json`**: "System Prompt" que define la personalidad y reglas de la IA de BCode.
*   **`config-pro.js`**: Define qué características son exclusivas de usuarios de pago.

---

## 🎨 5. Estilos (`styles/`)

*   **`styles.css`**: Estilos base del editor (tema oscuro, layout flexbox, componentes UI).
*   **`style_portafolio.css`**: Estilos específicos para el portafolio (animaciones, grid).
*   **`style_proyectss.css`**: Estilos para la galería de proyectos (tarjetas, filtros).
*   **`styles_doc.css`**: Estilos para la documentación (sidebar, tipografía).
*   **`redireccion.css`**: Estilos para el acortador y páginas de redirección.
*   **`styles_qrbcode.css`**: Estilos específicos para el generador de QR.
*   **`stylesredirect.css`**: Estilos para la página de redirección.

---

## 🚀 Flujo de Trabajo Típico

1.  **Carga:** El usuario accede a `index.php`. El backend sirve `index.html`.
2.  **Inicialización:** `main.js` arranca, carga Monaco Editor y verifica la sesión de Firebase.
3.  **Edición:** El usuario escribe código. `autocorreccion.js` valida en tiempo real.
4.  **Previsualización:** Al pulsar "Ejecutar", `preview-iframe.js` compila el proyecto en memoria y actualiza el iframe.
5.  **Guardado:** Los cambios se sincronizan con Firestore (`sincronizacion.js`) o se guardan localmente.
6.  **Nube (PRO):** Los usuarios PRO pueden subir proyectos completos a la nube mediante `operacione-users-pro.js`, que se comunica con Cloudflare Workers.

---

*Documentación generada automáticamente para BCode Pro.*
