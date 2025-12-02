# 🖼️ Guía Completa para Cambiar las Imágenes

## 📋 Índice de Imágenes en la Web

### 1. **Hero Section (Inicio)**
**Ubicación en código:** Línea ~650
**Imagen actual:** Estudiantes generales
**Cómo cambiar:**

```javascript
// BUSCAR en App.jsx:
<img 
  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop" 
  alt="Estudiantes del Colegio Cristo Rey" 
  className="w-full h-full object-cover"
/>

// REEMPLAZAR con tu imagen:
<img 
  src="/images/hero-colegio.jpg" 
  alt="Estudiantes del Colegio Cristo Rey" 
  className="w-full h-full object-cover"
/>
```

### 2. **Niveles Educativos (3 imágenes)**

#### Nivel Inicial - Línea ~234
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/nivel-inicial.jpg'
```

#### Nivel Primario - Línea ~241
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/nivel-primario.jpg'
```

#### Nivel Secundario - Línea ~248
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/nivel-secundario.jpg'
```

### 3. **Historia - Timeline (7 imágenes)**

#### 1997 - Inicios - Línea ~260
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/1997-inicio.jpg'
```

#### 1997 - Construcción - Línea ~268
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/1997-construccion.jpg'
```

#### 2002 - Reconocimiento - Línea ~274
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/2002-reconocimiento.jpg'
```

#### 2003 - Secundaria - Línea ~280
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/2003-secundaria.jpg'
```

#### 2004 - Centro Educativo - Línea ~286
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/2004-centro.jpg'
```

#### 2013 - Nueva Etapa - Línea ~292
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/2013-nueva-etapa.jpg'
```

#### 2022 - 25 Años - Línea ~298
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop'

// REEMPLAZAR:
image: '/images/historia/2022-25-anos.jpg'
```

### 4. **Equipo Directivo (4 imágenes)**

#### Director General - Línea ~308
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'

// REEMPLAZAR:
image: '/images/equipo/director.jpg'
```

#### Directora Académica - Línea ~314
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'

// REEMPLAZAR:
image: '/images/equipo/directora-academica.jpg'
```

#### Coordinador Pastoral - Línea ~320
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'

// REEMPLAZAR:
image: '/images/equipo/coordinador-pastoral.jpg'
```

#### Coordinadora Convivencia - Línea ~326
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'

// REEMPLAZAR:
image: '/images/equipo/coordinadora-convivencia.jpg'
```

### 5. **Noticias (3 imágenes)**

#### Noticia 1 - Robótica - Línea ~360
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop'

// REEMPLAZAR:
image: '/images/noticias/robotica.jpg'
```

#### Noticia 2 - Biblioteca - Línea ~367
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop'

// REEMPLAZAR:
image: '/images/noticias/biblioteca.jpg'
```

#### Noticia 3 - Campaña - Línea ~374
```javascript
// BUSCAR:
image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop'

// REEMPLAZAR:
image: '/images/noticias/campana-solidaria.jpg'
```

---

## 📁 Estructura de Carpetas Recomendada

Organiza tus imágenes así:

```
colegio-cristo-rey/
└── public/
    └── images/
        ├── logo.png                      ← Logo del colegio
        ├── hero-colegio.jpg              ← Imagen principal
        ├── nivel-inicial.jpg             ← Niveles
        ├── nivel-primario.jpg
        ├── nivel-secundario.jpg
        ├── historia/                     ← Timeline
        │   ├── 1997-inicio.jpg
        │   ├── 1997-construccion.jpg
        │   ├── 2002-reconocimiento.jpg
        │   ├── 2003-secundaria.jpg
        │   ├── 2004-centro.jpg
        │   ├── 2013-nueva-etapa.jpg
        │   └── 2022-25-anos.jpg
        ├── equipo/                       ← Staff
        │   ├── director.jpg
        │   ├── directora-academica.jpg
        │   ├── coordinador-pastoral.jpg
        │   └── coordinadora-convivencia.jpg
        └── noticias/                     ← News
            ├── robotica.jpg
            ├── biblioteca.jpg
            └── campana-solidaria.jpg
```

## 🛠️ Método Rápido: Buscar y Reemplazar

### Opción 1: Editor de Código (VS Code)

1. **Abre App.jsx**
2. **Presiona** `Ctrl + F` (Windows) o `Cmd + F` (Mac)
3. **Busca:** `https://images.unsplash.com`
4. **Verás todas las imágenes** subrayadas
5. **Reemplaza una por una** con tus rutas

### Opción 2: Buscar y Reemplazar Masivo

```bash
# En la terminal (Mac/Linux):
cd colegio-cristo-rey/src

# Ver todas las URLs de imágenes
grep -n "https://images.unsplash.com" App.jsx

# Reemplazar todas las de Unsplash (NO RECOMENDADO - hazlo manual)
# sed -i 's|https://images.unsplash.com/photo-[^?]*|/images/|g' App.jsx
```

## 📐 Tamaños Recomendados

### Hero Section (Principal):
- **Ancho:** 1200px
- **Alto:** 800px
- **Formato:** JPG
- **Peso:** < 500KB

### Niveles (3 cards):
- **Ancho:** 800px
- **Alto:** 600px
- **Formato:** JPG
- **Peso:** < 300KB cada una

### Historia Timeline (7 cards):
- **Ancho:** 800px
- **Alto:** 600px
- **Formato:** JPG
- **Peso:** < 300KB cada una

### Equipo (4 fotos):
- **Ancho:** 400px
- **Alto:** 400px (cuadradas)
- **Formato:** JPG
- **Peso:** < 150KB cada una

### Noticias (3 cards):
- **Ancho:** 800px
- **Alto:** 500px
- **Formato:** JPG
- **Peso:** < 300KB cada una

## 🎨 Optimizar Imágenes

### Herramientas Online (Gratis):

1. **TinyPNG** - https://tinypng.com/
   - Comprime sin perder calidad
   - Reduce peso hasta 70%

2. **Squoosh** - https://squoosh.app/
   - De Google
   - Control total de compresión

3. **ImageOptim** - https://imageoptim.com/ (Mac)
   - App de escritorio
   - Batch processing

### Comando (si tienes ImageMagick):

```bash
# Redimensionar imagen
convert imagen-original.jpg -resize 800x600^ -gravity center -extent 800x600 imagen-optimizada.jpg

# Comprimir
convert imagen.jpg -quality 85 imagen-comprimida.jpg
```

## ✅ Checklist de Reemplazo

- [ ] 1. Crear carpeta `public/images/`
- [ ] 2. Organizar imágenes en subcarpetas
- [ ] 3. Optimizar todas las imágenes
- [ ] 4. Cambiar imagen Hero
- [ ] 5. Cambiar 3 imágenes de Niveles
- [ ] 6. Cambiar 7 imágenes de Historia
- [ ] 7. Cambiar 4 fotos de Equipo
- [ ] 8. Cambiar 3 imágenes de Noticias
- [ ] 9. Cambiar logo (ver COMO-AGREGAR-LOGO.md)
- [ ] 10. Probar en navegador
- [ ] 11. Verificar que todas cargan correctamente

## 🚀 Proceso Completo Paso a Paso

### 1. Preparar las Imágenes

```bash
# En tu computadora:
1. Reúne todas las fotos del colegio
2. Renómbralas según la estructura de arriba
3. Optimízalas con TinyPNG
4. Guárdalas en las carpetas correspondientes
```

### 2. Copiar al Proyecto

```bash
# Copia toda la carpeta de imágenes:
cp -r mis-imagenes/* colegio-cristo-rey/public/images/
```

### 3. Editar App.jsx

```bash
# Abre el archivo:
cd colegio-cristo-rey/src
code App.jsx  # o el editor que uses
```

### 4. Buscar y Reemplazar

Busca cada URL de Unsplash y reemplázala con la ruta local.

**Ejemplo:**
```javascript
// Antes:
image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop'

// Después:
image: '/images/nivel-inicial.jpg'
```

### 5. Guardar y Probar

```bash
npm run dev
```

Abre http://localhost:3000 y verifica que todas las imágenes carguen.

## 🔍 Verificar que Todo Funciona

```bash
# Ver si las imágenes existen
ls -la public/images/
ls -la public/images/historia/
ls -la public/images/equipo/
ls -la public/images/noticias/

# Buscar referencias a Unsplash (deben ser 0)
grep -c "unsplash.com" src/App.jsx
# Debe mostrar: 0
```

## ⚠️ Errores Comunes

### ❌ Imagen no se ve (404)
**Causa:** Ruta incorrecta
**Solución:** 
```javascript
// Mal:
src="images/foto.jpg"  // ❌ Falta el /

// Bien:
src="/images/foto.jpg" // ✅ Con / al inicio
```

### ❌ Imagen muy pesada (carga lenta)
**Causa:** No está optimizada
**Solución:** Usar TinyPNG para comprimir

### ❌ Imagen distorsionada
**Causa:** Proporciones incorrectas
**Solución:** Recortar a las medidas recomendadas

## 💡 Tips Profesionales

1. **Usa JPG para fotos**, PNG para logos con transparencia
2. **Mantén nombres en minúsculas** sin espacios: `nivel-inicial.jpg`
3. **Organiza por carpetas** para mantener orden
4. **Optimiza antes de subir** - no después
5. **Prueba en mobile** - las imágenes se ven diferentes
6. **Usa fotos reales del colegio** - da más autenticidad

## 🎓 Recursos Útiles

- **Bancos de imágenes gratis:** Unsplash, Pexels, Pixabay
- **Optimizadores:** TinyPNG, Squoosh
- **Editores:** Photopea (online, gratis)
- **Redimensionadores:** Canva, GIMP

---

¿Necesitas ayuda con algún paso específico?
