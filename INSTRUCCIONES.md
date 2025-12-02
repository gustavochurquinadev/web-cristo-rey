# 📚 Guía de Instalación y Uso - Colegio Cristo Rey

## 🎯 Introducción

Este documento te guiará paso a paso para instalar y ejecutar el sitio web del Colegio Católico Cristo Rey en tu computadora.

## ✅ Paso 1: Verificar Node.js

Antes de comenzar, necesitas tener Node.js instalado. Abre una terminal o símbolo del sistema y ejecuta:

```bash
node --version
```

Si ves algo como `v18.0.0` o superior, ¡genial! Si no:

### Instalar Node.js

1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión **LTS** (recomendada)
3. Instala siguiendo las instrucciones
4. Reinicia tu terminal
5. Verifica de nuevo con `node --version`

## 📦 Paso 2: Instalar Dependencias

1. **Abre tu terminal** (CMD en Windows, Terminal en Mac/Linux)

2. **Navega a la carpeta del proyecto:**
   ```bash
   cd /Users/dario/Desktop/WEB_CRISTO_REY
   ```

3. **Instala todas las dependencias:**
   ```bash
   npm install
   ```
   
   Esto descargará todas las librerías necesarias. Puede tardar 1-2 minutos.

## 🚀 Paso 3: Ejecutar el Proyecto

Una vez instaladas las dependencias, ejecuta:

```bash
npm run dev
```

Verás algo como:

```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

¡Tu sitio web ya está corriendo! Abre tu navegador y ve a `http://localhost:3000`

## 🛑 Detener el Servidor

Para detener el servidor de desarrollo, presiona `Ctrl + C` en la terminal.

## 📝 Paso 4: Editar el Contenido

### Cambiar Textos

Todos los textos están en el archivo `src/App.jsx`. Busca las siguientes secciones:

**Niveles educativos:**
```javascript
const levels = [
  {
    title: 'Inicial',
    description: 'Tu texto aquí...',
    // ...
  }
]
```

**Información de pagos:**
```javascript
const paymentInfo = [
  { level: 'Inicial', amount: '$120.000', dueDate: '10 de cada mes' },
  // Cambia los montos aquí
]
```

**Contacto:**
Busca la sección `Contact Section` y actualiza:
- Dirección
- Teléfonos
- Emails

### Cambiar Imágenes

1. **Guarda tus imágenes** en la carpeta `public/images/`
   - Ejemplo: `public/images/inicial.jpg`

2. **Actualiza las URLs** en `src/App.jsx`:
   ```javascript
   image: '/images/inicial.jpg'
   ```

### Cambiar Colores

Edita el archivo `tailwind.config.js` o cambia directamente las clases en `App.jsx`:

- `bg-blue-600` → Color de fondo azul
- `text-blue-600` → Texto azul
- `hover:bg-blue-700` → Color al pasar el mouse

Colores disponibles: `blue`, `red`, `green`, `yellow`, `purple`, `pink`, `indigo`, `gray`

## 🌐 Paso 5: Compilar para Publicar

Cuando estés listo para publicar tu sitio:

```bash
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos optimizados listos para subir a un servidor.

## 📤 Paso 6: Subir a Internet

### Opción A: Netlify (Gratis y Fácil)

1. Ve a [netlify.com](https://www.netlify.com/)
2. Regístrate gratis
3. Arrastra la carpeta `dist/` a Netlify
4. ¡Listo! Tu sitio está en línea

### Opción B: Vercel (Gratis y Fácil)

1. Ve a [vercel.com](https://vercel.com/)
2. Regístrate gratis
3. Importa tu proyecto
4. Vercel lo publicará automáticamente

### Opción C: Hosting tradicional

1. Compila el proyecto: `npm run build`
2. Sube la carpeta `dist/` a tu hosting por FTP
3. Configura tu dominio

## 🔧 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza la versión compilada |
| `npm install` | Instala dependencias |

## ❓ Problemas Comunes

### "npm no se reconoce como comando"
- Node.js no está instalado o no está en el PATH
- Solución: Reinstala Node.js y reinicia la terminal

### "Puerto 3000 en uso"
- Otro programa está usando el puerto 3000
- Solución: Cierra otros servidores o cambia el puerto en `vite.config.js`

### "Cannot find module"
- Faltan dependencias
- Solución: Ejecuta `npm install` de nuevo

### Los cambios no se reflejan
- El navegador tiene caché
- Solución: Presiona `Ctrl + F5` para recargar

### Errores de Tailwind CSS
- Los estilos no se aplican correctamente
- Solución: Verifica que `index.css` esté importado en `main.jsx`

## 📧 Integrar Formulario de Contacto

El formulario actualmente simula el envío. Para hacerlo funcional:

### Opción 1: EmailJS (Sin backend)

1. **Regístrate en [EmailJS](https://www.emailjs.com/)**

2. **Instala EmailJS:**
   ```bash
   npm install @emailjs/browser
   ```

3. **Modifica `src/App.jsx`:**
   ```javascript
   import emailjs from '@emailjs/browser';
   
   const handleSubmit = async (e) => {
     e.preventDefault();
     if (!validateForm()) return;
     
     setFormLoading(true);
     
     try {
       await emailjs.send(
         'TU_SERVICE_ID',
         'TU_TEMPLATE_ID',
         formData,
         'TU_PUBLIC_KEY'
       );
       setFormSubmitted(true);
       // Limpiar formulario...
     } catch (error) {
       console.error('Error:', error);
     } finally {
       setFormLoading(false);
     }
   };
   ```

### Opción 2: Backend PHP

Puedes crear un archivo `contact.php` en tu servidor y enviar los datos por POST.

## 🎨 Personalización Avanzada

### Agregar nueva sección

1. Crea el JSX en `App.jsx`:
```javascript
<section id="mi-seccion" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <h2>Mi Nueva Sección</h2>
    {/* Tu contenido */}
  </div>
</section>
```

2. Agrega a la navegación:
```javascript
const sections = [
  // ... otras secciones
  { id: 'mi-seccion', label: 'Mi Sección', icon: Star }
]
```

### Cambiar fuente

En `index.html`, agrega:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

En `tailwind.config.js`:
```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
}
```

## 📱 Redes Sociales

Para conectar los íconos de redes sociales en el footer:

1. Busca la sección `Footer` en `App.jsx`
2. Reemplaza `href="#"` con tus URLs reales:
   ```javascript
   <a href="https://facebook.com/tupage" ...>
   <a href="https://instagram.com/tuperfil" ...>
   ```

## ✨ Consejos Finales

- 💾 **Guarda cambios frecuentemente** con `Ctrl + S`
- 🔄 **El navegador se recarga automáticamente** cuando guardas
- 📱 **Prueba en móvil** usando las herramientas de desarrollo (F12)
- 🎨 **Experimenta** - si algo sale mal, siempre puedes volver atrás
- 📖 **Consulta el README.md** para información más técnica

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Lee los mensajes de error en la terminal
2. Busca el error en Google
3. Revisa la [documentación de Vite](https://vitejs.dev/)
4. Consulta la [documentación de React](https://react.dev/)
5. Pregunta en comunidades como Stack Overflow

## 🎓 Recursos de Aprendizaje

- [Tutorial de React](https://react.dev/learn)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de Framer Motion](https://www.framer.com/motion/)

---

¡Éxito con tu proyecto! 🚀





