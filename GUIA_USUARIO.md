# 📘 Guía de Usuario - Sitio Web Colegio Católico Cristo Rey

Bienvenido a la guía oficial de uso del sitio web institucional. Este documento está diseñado para ayudar al equipo directivo, administrativo y docente a comprender el funcionamiento de la plataforma digital, facilitando su gestión y aprovechamiento.

---

## 📑 Índice de Contenidos

1. [Visión General](#1-visión-general)
2. [Sitio Web Público](#2-sitio-web-público)
3. [Portal Docente](#3-portal-docente)
4. [Sistema de Nómina (Administración)](#4-sistema-de-nómina-administración)
5. [Gestión Técnica Básica](#5-gestión-técnica-básica)

---

## 1. Visión General

El sitio web está construido con tecnologías modernas (**React** y **Vite**) que garantizan una navegación rápida, segura y adaptable a cualquier dispositivo (móviles, tablets y computadoras).

### Funcionalidades Principales:
- **Pública:** Información institucional, noticias, niveles educativos y contacto.
- **Privada:** Portal para docentes con acceso a recibos de haberes y documentos.
- **Administrativa:** Herramienta interna para procesar y distribuir recibos de sueldo digitalmente.

---

## 2. Sitio Web Público

Esta es la cara visible para padres, alumnos y futuros ingresantes. Se accede a través de la dirección web principal.

### 🧭 Navegación
La página utiliza un sistema de "página única" (Single Page Application), lo que significa que al hacer clic en el menú, el sitio se desliza suavemente hacia la sección correspondiente sin recargar la página.

### 📍 Secciones Interactiva
1.  **Inicio:** Presentación visual con el escudo y lema del colegio.
2.  **Historia:** Línea de tiempo interactiva con los hitos de la institución.
3.  **Niveles:** Tarjetas informativas sobre Nivel Inicial, Primario y Secundario. Al pasar el mouse, muestran detalles adicionales.
4.  **Pastoral:** Información sobre actividades religiosas y sacramentales.
5.  **Noticias:** Novedades recientes.
6.  **Aranceles:** Información clara sobre matrículas y cuotas mensuales.
7.  **Contacto:**
    - Formulario de "Trabaja con Nosotros" (Para envío de CVs).
    - Mapas y datos de contacto directo.

---

## 3. Portal Docente

Zona exclusiva para el personal del colegio.

### 🔗 Cómo Ingresar
1.  Diríjase a la sección **"Portal"** o agregue `/portal` a la dirección web.
2.  Verá dos opciones:
    - **Iniciar Sesión:** Si ya tiene cuenta.
    - **Crear Cuenta:** Para nuevos usuarios.

### ®️ Registro de Nuevos Docentes
El docente debe seleccionar "Crear cuenta aquí" y completar:
- **Nombre Completo**.
- **DNI** (Sin puntos).
- **Contraseña** (Personal e intransferible).
- **Código de Invitación:** Este código lo provee la Administración para asegurar que solo personal autorizado se registre.

### 🖥️ Panel del Docente
Una vez dentro, el docente tiene acceso a dos columnas principales:
1.  **Recibos de Haberes:** Lista cronológica de sus recibos de sueldo. Puede descargarlos en PDF haciendo clic en el botón "Descargar".
2.  **Documentación Institucional:** Acceso a reglamentos, circulares y formularios oficiales del colegio.

> **Nota de Seguridad:** El sistema verifica automáticamente el DNI del usuario para mostrar ÚNICAMENTE sus propios recibos. Ningún docente puede ver recibos de otros colegas.

---

## 4. Sistema de Nómina (Administración)

Herramienta interna para el equipo administrativo encargada de digitalizar los sueldos.
**Acceso:** Ruta `/admin` (Requiere autorización).

### ⚙️ Procesador de Recibos
Esta herramienta toma el PDF único que emite el sistema contable (donde están todos los recibos juntos) y lo separa automáticamente para enviarlo a cada docente.

#### Paso a Paso:
1.  **Seleccionar Destino:**
    - Elija una carpeta existente (ej: `OCTUBRE_2024`) del menú desplegable.
    - O cree una nueva escribiendo el nombre (ej: `NOVIEMBRE_2025`) y haciendo clic en el botón azul de carpeta.

2.  **Cargar Archivo Maestro:**
    - Haga clic en el recuadro **"Subir PDF Maestro"**.
    - Seleccione el archivo PDF que contiene todos los sueldos del mes.

3.  **Procesamiento Automático:**
    - El sistema leerá cada página.
    - Identificará el **DNI** y **Legajo** de cada docente automáticamente.
    - "Recortará" cada recibo individualmente.
    - Lo subirá a la nube (Google Drive) en la carpeta seleccionada.
    - Renombrará el archivo como: `CARPETA_DNI_LEG_LEGAJO.pdf`.

4.  **Resultado:**
    - Al finalizar, verá un registro (log) en pantalla verde confirmando cada subida exitosa.
    - Los docentes podrán ver sus recibos inmediatamente en su Portal.

---

## 5. Gestión Técnica Básica

Información para el encargado técnico o administrador del sitio.

### 📂 Estructura de Archivos
Si necesita solicitar cambios a un desarrollador, esta referencia le será útil:

-   **Textos y Contenidos:** La mayoría de los textos editables están en:
    -   `src/components/sections/`: Carpetas con cada sección (Staff, Levels, etc.).
    -   `src/pages/Landing.jsx`: Página principal.
-   **Imágenes:** Se guardan en la carpeta `public/images/`.
-   **Configuración:** Los colores y estilos bases están en `tailwind.config.js`.

### ☁️ Conexión con Google
El sistema utiliza Google Apps Script como "backend" para conectar el sitio con Google Sheets y Google Drive.
-   **Script URL:** Se encuentra configurada en `Staff.jsx` y `ReceiptProcessor.jsx`. No debe modificarse salvo que cambie el script en Google.

---

**Soporte Técnico**
Ante cualquier duda o error en el sistema, contacte al desarrollador responsable o consulte el archivo `README.md` para detalles técnicos de instalación.

---
*© 2024 Colegio Católico Cristo Rey - Documentación Interna*
