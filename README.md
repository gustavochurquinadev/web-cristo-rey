# Colegio Católico Cristo Rey - Website

Sitio web institucional del Colegio Católico Cristo Rey, desarrollado con React, Vite, Tailwind CSS y Framer Motion.

## 🚀 Características

- ✅ Diseño responsive y moderno
- ✅ Navegación con scroll spy automático
- ✅ Formulario de contacto con validación avanzada
- ✅ Animaciones suaves con Framer Motion
- ✅ Accesibilidad mejorada (ARIA labels)
- ✅ Secciones: Inicio, Niveles, Pastoral, Logros, Equipo, Calendario, Noticias, Administración, Carreras, Contacto

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm (viene con Node.js)

## 🔧 Instalación

1. **Navega a la carpeta del proyecto:**
   ```bash
   cd colegio-cristo-rey
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

## 🎯 Uso

### Modo Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

### Compilar para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa de Producción

Para previsualizar la versión de producción localmente:

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
colegio-cristo-rey/
├── public/              # Archivos estáticos
├── src/
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales con Tailwind
├── index.html          # HTML principal
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind
├── postcss.config.js   # Configuración de PostCSS
└── README.md          # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS utility-first
- **Framer Motion** - Librería de animaciones
- **Lucide React** - Iconos
- **ESLint** - Linter de código

## 🛠️ Personalización

### Colores y Estilos

Los colores principales se pueden modificar en `tailwind.config.js`. El esquema actual usa:
- Azul primario: `blue-600`
- Gris para texto: `gray-800`
- Fondo: `gray-50`

### Contenido

Todo el contenido está en el archivo `src/App.jsx` en forma de arrays y objetos:
- `levels` - Información de niveles educativos
- `pastoralActivities` - Actividades pastorales
- `achievements` - Logros del colegio
- `staffMembers` - Equipo directivo
- `calendarEvents` - Eventos del calendario
- `newsItems` - Noticias
- `paymentInfo` - Información de pagos

### Imágenes

Actualmente las imágenes vienen de Unsplash. Para usar tus propias imágenes:

1. Coloca las imágenes en la carpeta `public/images/`
2. Cambia las URLs en `src/App.jsx`, por ejemplo:
   ```javascript
   image: '/images/inicial.jpg'
   ```

## 📧 Integración de Formulario

El formulario de "Trabaja con Nosotros" actualmente simula el envío. Para integrarlo con un backend real:

1. **Opción 1: EmailJS** (sin backend)
   ```bash
   npm install @emailjs/browser
   ```
   
2. **Opción 2: Backend propio**
   Modifica la función `handleSubmit` en `src/App.jsx` para hacer una llamada a tu API:
   ```javascript
   const response = await fetch('https://tu-api.com/contact', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(formData)
   });
   ```

## 🚀 Deploy

### Opción 1: Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Conecta tu repositorio de GitHub
3. Netlify detectará automáticamente Vite y hará el deploy

### Opción 2: Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/)
2. Importa tu proyecto desde GitHub
3. Vercel hará el deploy automáticamente

### Opción 3: GitHub Pages

```bash
npm install gh-pages --save-dev
```

Agrega en `package.json`:
```json
"homepage": "https://tuusuario.github.io/colegio-cristo-rey",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Luego ejecuta:
```bash
npm run deploy
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### El puerto 3000 está en uso
Cambia el puerto en `vite.config.js`:
```javascript
server: {
  port: 3001,
  open: true
}
```

### Errores de Tailwind
Asegúrate de que `index.css` esté importado en `main.jsx`

## 📝 Licencia

© 2024 Colegio Católico Cristo Rey. Todos los derechos reservados.

## 👥 Soporte

Para preguntas o soporte:
- Email: info@colegiocristorey.cl
- Teléfono: +56 2 1234 5678

---

Desarrollado con ❤️ para el Colegio Católico Cristo Rey
