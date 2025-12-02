# 🗺️ Mapa Visual de Imágenes

## 📍 Ubicación de TODAS las Imágenes (18 total)

### 🖼️ **Imagen Principal (1)**

**Línea 649** - Hero Section
```
┌────────────────────────────────────┐
│                                    │
│    BIENVENIDOS AL COLEGIO          │
│    [Imagen grande de estudiantes] │
│                                    │
└────────────────────────────────────┘

📝 Reemplazar con: /images/hero-colegio.jpg
📐 Tamaño: 1200x800px
```

---

### 🎓 **Niveles Educativos (3)**

**Línea 257** - Nivel Inicial
```
┌─────────────────┐
│   [Imagen]      │
│   Inicial       │
│   Niños jugando │
└─────────────────┘

📝 Reemplazar con: /images/nivel-inicial.jpg
📐 Tamaño: 800x600px
```

**Línea 263** - Nivel Primario
```
┌─────────────────┐
│   [Imagen]      │
│   Primario      │
│   Aula/Estudio  │
└─────────────────┘

📝 Reemplazar con: /images/nivel-primario.jpg
📐 Tamaño: 800x600px
```

**Línea 269** - Nivel Secundario
```
┌─────────────────┐
│   [Imagen]      │
│   Secundario    │
│   Estudiantes   │
└─────────────────┘

📝 Reemplazar con: /images/nivel-secundario.jpg
📐 Tamaño: 800x600px
```

---

### 📖 **Historia - Timeline (7)**

```
Timeline Horizontal con Scroll ← →
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ 1997 │ 1997 │ 2002 │ 2003 │ 2004 │ 2013 │ 2022 │
│Inicio│Const.│Recog.│Secun.│Centro│Nueva │ 25   │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

**Línea 282** - 1997 Inicios
```
📅 14 de marzo 1997
💬 "Con corazón"
📝 /images/historia/1997-inicio.jpg
📐 800x600px
```

**Línea 289** - 1997 Construcción
```
📅 11 de diciembre 1997
📝 /images/historia/1997-construccion.jpg
📐 800x600px
```

**Línea 296** - 2002 Reconocimiento
```
📅 Julio 2002
📝 /images/historia/2002-reconocimiento.jpg
📐 800x600px
```

**Línea 303** - 2003 Secundaria
```
📅 12 de marzo 2003
📝 /images/historia/2003-secundaria.jpg
📐 800x600px
```

**Línea 309** - 2004 Centro
```
📅 2004
📝 /images/historia/2004-centro.jpg
📐 800x600px
```

**Línea 315** - 2013 Nueva Etapa
```
📅 2013
📝 /images/historia/2013-nueva-etapa.jpg
📐 800x600px
```

**Línea 322** - 2022 - 25 Años
```
📅 2022
💬 "El amor enseña a enseñar"
📝 /images/historia/2022-25-anos.jpg
📐 800x600px
```

---

### 👥 **Equipo Directivo (4)**

```
┌────────┬────────┬────────┬────────┐
│ [Foto] │ [Foto] │ [Foto] │ [Foto] │
│Director│Direc.  │Coord.  │Coord.  │
│General │Académ. │Pastoral│Conviv. │
└────────┴────────┴────────┴────────┘
```

**Línea 364** - Director General
```
👤 Padre Miguel Rodríguez
📝 /images/equipo/director.jpg
📐 400x400px (cuadrada)
```

**Línea 370** - Directora Académica
```
👤 María González
📝 /images/equipo/directora-academica.jpg
📐 400x400px (cuadrada)
```

**Línea 376** - Coordinador Pastoral
```
👤 Carlos Sepúlveda
📝 /images/equipo/coordinador-pastoral.jpg
📐 400x400px (cuadrada)
```

**Línea 382** - Coordinadora Convivencia
```
👤 Ana Martínez
📝 /images/equipo/coordinadora-convivencia.jpg
📐 400x400px (cuadrada)
```

---

### 📰 **Noticias (3)**

```
┌─────────────┬─────────────┬─────────────┐
│  [Imagen]   │  [Imagen]   │  [Imagen]   │
│  Robótica   │ Biblioteca  │  Campaña    │
└─────────────┴─────────────┴─────────────┘
```

**Línea 403** - Torneo de Robótica
```
📰 Logros
📝 /images/noticias/robotica.jpg
📐 800x500px
```

**Línea 410** - Biblioteca Digital
```
📰 Tecnología
📝 /images/noticias/biblioteca.jpg
📐 800x500px
```

**Línea 417** - Campaña Solidaria
```
📰 Pastoral
📝 /images/noticias/campana-solidaria.jpg
📐 800x500px
```

---

## 📊 Resumen por Sección

| Sección | Cantidad | Tamaño | Líneas |
|---------|----------|--------|---------|
| Hero | 1 | 1200x800 | 649 |
| Niveles | 3 | 800x600 | 257, 263, 269 |
| Historia | 7 | 800x600 | 282, 289, 296, 303, 309, 315, 322 |
| Equipo | 4 | 400x400 | 364, 370, 376, 382 |
| Noticias | 3 | 800x500 | 403, 410, 417 |
| **TOTAL** | **18** | - | - |

## 🎯 Proceso Rápido de Reemplazo

### 1. Prepara tus 18 imágenes:

```
public/images/
├── hero-colegio.jpg              (1)
├── nivel-inicial.jpg             (1)
├── nivel-primario.jpg            (1)
├── nivel-secundario.jpg          (1)
├── historia/
│   ├── 1997-inicio.jpg           (1)
│   ├── 1997-construccion.jpg     (1)
│   ├── 2002-reconocimiento.jpg   (1)
│   ├── 2003-secundaria.jpg       (1)
│   ├── 2004-centro.jpg           (1)
│   ├── 2013-nueva-etapa.jpg      (1)
│   └── 2022-25-anos.jpg          (1)
├── equipo/
│   ├── director.jpg              (1)
│   ├── directora-academica.jpg   (1)
│   ├── coordinador-pastoral.jpg  (1)
│   └── coordinadora-convivencia.jpg (1)
└── noticias/
    ├── robotica.jpg              (1)
    ├── biblioteca.jpg            (1)
    └── campana-solidaria.jpg     (1)
                          TOTAL = 18 imágenes
```

### 2. Busca en VS Code:

```
Ctrl + F (Windows) o Cmd + F (Mac)
Buscar: https://images.unsplash.com
```

### 3. Reemplaza cada una según el mapa de arriba

---

## 🔍 Script de Verificación

Después de cambiar todas, verifica con:

```bash
# Debe mostrar 0
grep -c "unsplash.com" src/App.jsx

# Debe mostrar 18
grep -c "/images/" src/App.jsx

# Ver todas las rutas nuevas
grep "/images/" src/App.jsx
```

## ✅ Checklist

- [ ] 1 imagen Hero (línea 649)
- [ ] 3 imágenes Niveles (líneas 257, 263, 269)
- [ ] 7 imágenes Historia (líneas 282-322)
- [ ] 4 fotos Equipo (líneas 364-382)
- [ ] 3 imágenes Noticias (líneas 403-417)
- [ ] Total: 18 imágenes reemplazadas ✅

---

**Tip:** Puedes hacer Ctrl+H (reemplazar) y cambiar todas de una vez, pero es mejor hacerlo una por una para verificar.
