# 🎨 Cómo Agregar el Logo Real del Colegio

## 📋 Pasos para Implementar el Logo:

### 1. **Extraer el Logo de la Imagen**

Tienes dos opciones:

**Opción A: Usar un editor en línea**
1. Ve a https://www.remove.bg/
2. Sube la imagen del logo
3. Descarga el logo sin fondo (formato PNG)
4. Guárdalo como `logo.png`

**Opción B: Usar Photoshop/GIMP**
1. Abre la imagen en tu editor
2. Selecciona y recorta solo el escudo
3. Elimina el fondo
4. Exporta como PNG transparente
5. Guárdalo como `logo.png`

### 2. **Agregar el Logo al Proyecto**

```bash
# Coloca el archivo en la carpeta public
colegio-cristo-rey/
├── public/
│   ├── images/
│   │   └── logo.png      ← Aquí va tu logo
│   └── favicon.svg
```

### 3. **Actualizar el Código**

Abre `src/App.jsx` y busca estas líneas:

**En el Loading Screen** (línea ~330):
```javascript
// ANTES:
<GraduationCap className="w-16 h-16 text-blue-600" />

// DESPUÉS:
<img src="/images/logo.png" alt="Logo Cristo Rey" className="w-24 h-24 object-contain" />
```

**En el Header** (línea ~370):
```javascript
// ANTES:
<div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
  <GraduationCap className="w-8 h-8 text-white" />
</div>

// DESPUÉS:
<div className="w-full h-full bg-white rounded-full flex items-center justify-center p-2">
  <img src="/images/logo.png" alt="Logo Cristo Rey" className="w-full h-full object-contain" />
</div>
```

**En el Footer** (línea ~1190):
```javascript
// ANTES:
<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
  <GraduationCap className="w-6 h-6 text-white" />
</div>

// DESPUÉS:
<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5">
  <img src="/images/logo.png" alt="Logo Cristo Rey" className="w-full h-full object-contain" />
</div>
```

### 4. **Opción: Usar SVG (Mejor Calidad)**

Si puedes convertir el logo a SVG:

```bash
# Coloca el archivo SVG
public/images/logo.svg
```

Y usa en el código:
```javascript
<img src="/images/logo.svg" alt="Logo Cristo Rey" className="w-24 h-24" />
```

### 5. **Ajustar Tamaños**

Puedes ajustar los tamaños según necesites:

```javascript
// Loading Screen (grande)
className="w-32 h-32 object-contain"

// Header (mediano)
className="w-16 h-16 object-contain"

// Footer (pequeño)
className="w-12 h-12 object-contain"
```

## 🎭 Animación del Logo

La animación ya está lista, solo cambia el ícono por la imagen:

```javascript
<motion.div
  animate={{ 
    rotate: [0, 360],
    scale: [1, 1.1, 1]
  }}
  transition={{ 
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl p-4"
>
  <img 
    src="/images/logo.png" 
    alt="Logo Cristo Rey" 
    className="w-full h-full object-contain" 
  />
</motion.div>
```

## 📱 Favicon

Para cambiar el ícono de la pestaña del navegador:

1. Convierte tu logo a formato ICO o PNG (32x32px)
2. Reemplaza `public/favicon.svg`
3. O actualiza en `index.html`:

```html
<link rel="icon" type="image/png" href="/images/favicon.png" />
```

## 🎨 Colores del Colegio

Si quieres usar los colores oficiales del escudo:

```javascript
// En tailwind.config.js agrega:
theme: {
  extend: {
    colors: {
      'cristo-rey': {
        blue: '#your-blue-hex',
        gold: '#your-gold-hex',
        // ... otros colores del escudo
      }
    }
  }
}

// Luego usa en las clases:
className="bg-cristo-rey-blue text-white"
```

## ✅ Checklist:

- [ ] Logo extraído sin fondo
- [ ] Archivo guardado en `public/images/logo.png`
- [ ] Actualizado en Loading Screen
- [ ] Actualizado en Header
- [ ] Actualizado en Footer
- [ ] Favicon actualizado
- [ ] Probado en el navegador
- [ ] Se ve bien en mobile

## 🚀 Para Probar:

```bash
cd colegio-cristo-rey
npm install
npm run dev
```

Abre http://localhost:3000 y verás:
1. Tu logo animado al cargar
2. Se mueve a la esquina superior izquierda
3. Aparece en el footer también

## 💡 Tip Pro:

Si el logo tiene colores que no se ven bien con ciertos fondos, puedes crear dos versiones:

```
public/images/
├── logo-light.png    ← Para fondos oscuros
└── logo-dark.png     ← Para fondos claros
```

Y usar condicionalmente:
```javascript
<img src="/images/logo-light.png" alt="Logo" /> // En header blanco
<img src="/images/logo-dark.png" alt="Logo" />  // En footer oscuro
```

---

¿Necesitas ayuda con algún paso específico?
