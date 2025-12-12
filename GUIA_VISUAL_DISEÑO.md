# 🎨 GUÍA VISUAL - DISEÑO DE CADA SECCIÓN

## ColorPaleta Global

```javascript
const gold = '#FFD700'           // Texto/bordes principales
const black = '#0a0a0a'          // Fondo principal
const darkCard = '#1a1a1a'       // Fondos de cards/header
const lightGold = '#FFA500'      // Acentos secundarios
```

---

## 1️⃣ HEADER - Diseño Detallado

### Estructura HTML/CSS
```
┌────────────────────────────────────────────────────────┐
│ ┌─ 16px padding ─────────────────────────┐             │
│ │                                         │             │
│ │  [LOGO] "FutPro"      [Búsqueda]  🔔 ☰ │             │
│ │          Bienvenido                     │             │
│ │                                         │             │
│ └─────────────────────────────────────────┘             │
│                                                         │
│ Altura total: 88px                                      │
└────────────────────────────────────────────────────────┘
```

### Componentes Específicos

**Logo + Texto:**
```
┌──────────────────┐
│ [42x42 Logo] FutPro  │
│           Bienvenido │
└──────────────────┘
```
- Logo size: 42px (cuadrado)
- Título: fontSize 20, fontWeight 800, color gold
- Subtítulo: fontSize 12, color #ccc

**Barra de Búsqueda:**
```
┌────────────────────────────────────┐
│ 🔍 Buscar jugadores, equipos...   │
└────────────────────────────────────┘
```
- Ancho: 240px
- Padding: 10px left, 38px right (para icono)
- Altura: ~40px
- borderRadius: 20px (redondeada)
- border: 1px solid gold
- background: #111
- color: gold

**Botones Circulares:**
```
┌──────┐  ┌──────┐
│ 🔔   │  │ ☰    │
└──────┘  └──────┘
  40x40     40x40
```
- Tamaño: 40x40px
- borderRadius: '50%' (circular)
- border: 1px solid gold
- background: transparent
- color: gold

---

## 2️⃣ MENÚ HAMBURGUESA - Grid Layout

### Estructura
```
Cuando menuOpen === true:

┌──────────────────────────────────────────────────┐
│  Columna 1        Columna 2        Columna 3    │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │ 👤 Perfil│   │📊 Stats  │   │📅 Partid │    │
│  └──────────┘   └──────────┘   └──────────┘    │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │🏆 Logros │   │🆔 Tarjet │   │👥 Equipo │    │
│  └──────────┘   └──────────┘   └──────────┘    │
│  ...más botones... (28 total)                   │
└──────────────────────────────────────────────────┘

Altura total: Auto (varía según contenido)
Ancho: 100%
Padding: 16px
Gap entre botones: 8px
Columnas: 4 (auto-fit, mínimo 160px)
```

### Cada Botón Individual
```
┌────────────────────┐
│ 👤 Mi Perfil      │  ← Icono + Texto
│                    │
│ 160px mínimo       │
└────────────────────┘
```

---

## 3️⃣ STORIES - Scroll Horizontal

### Estructura
```
┌─────────────────────────────────────────────────┐
│ [Avatar1] [Avatar2] [Avatar3] [Avatar4] → →   │
│ Lucia    Mateo     Sofia      Leo FC           │
│                                                │
│ Scroll horizontal (overflow-x: auto)           │
│ Altura total: ~100px                           │
└─────────────────────────────────────────────────┘
```

### Avatar de Historia
```
      Gradient border (rosa-naranja)
         ↓
    ┌─────────┐
    │ padding │
    │ ┌─────┐ │
    │ │ IMG │ │  ← Imagen actual
    │ └─────┘ │
    └─────────┘
      64x64px (border)
      58x58px (imagen dentro)
      borderRadius: 50%
      gradient: linear-gradient(135deg, #ff0080, #ff8c00)
```

---

## 4️⃣ FEED - Card de Publicación

### Estructura Completa
```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ ┌──────────────────────────────────────────────┐   │
│ │ [Avatar40x40]  Nombre         [Tags]         │   │
│ │ 40x40px        fontWeight: 700 fontSize: 12  │   │
│ │ borderRadius   "Victoria 3-1"  [Femenino]    │   │
│ │ 50%            fontSize: 12    [Sub18]       │   │
│ │                color: #ccc     bg: #222      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ IMAGEN                                              │
│ ┌──────────────────────────────────────────────┐   │
│ │                                               │   │
│ │        [Foto 800x500px]                       │   │
│ │        width: 100%                            │   │
│ │                                               │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ DESCRIPCIÓN                                         │
│ ┌──────────────────────────────────────────────┐   │
│ │ Gran partido hoy, seguimos sumando.          │   │
│ │ padding: 12px                                │   │
│ │ color: #ddd                                  │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ FOOTER (ACCIONES)                                   │
│ ┌──────────┬──────────┬──────────────────┐         │
│ │ ⚽ 120   │ 💬 12    │ 📤 Compartir     │         │
│ │ flex: 1  │ flex: 1  │ flex: 1          │         │
│ └──────────┴──────────┴──────────────────┘         │
│ padding: 12px (top/bottom), 0 12px (left/right)    │
│                                                      │
└─────────────────────────────────────────────────────┘

Estilos globales de card:
  background: #1a1a1a (darkCard)
  borderRadius: 16px
  border: 1px solid gold
  overflow: hidden
  margin-bottom: 16px
```

### Avatar Header
```
┌────────┐
│        │  40x40px
│ [IMG]  │  borderRadius: 50%
│        │  
└────────┘
```

### Botones de Acción
```
┌──────────┬──────────┬──────────────────┐
│ ⚽ 120   │ 💬 12    │ 📤 Compartir     │
└──────────┴──────────┴──────────────────┘
  ↑          ↑          ↑
  flex:1    flex:1      flex:1
  (igual ancho)
```

---

## 5️⃣ BOTTOM NAVIGATION - Barra Inferior

### Estructura
```
┌─────────────────────────────────────────────────┐
│ 🏠 Home │ 🛒 Market │ 🎥 Videos │ 🔔 Alertas │ 💬 Chat │
│  flex:1  │   flex:1   │  flex:1   │   flex:1   │ flex:1 │
└─────────────────────────────────────────────────┘

Posición: fixed
  bottom: 0
  left: 0
  right: 0
  
Altura: ~50px
Ancho: 100vw
Display: flex
  justifyContent: space-around
  
Padding: 10px 0
  
Estilos:
  background: #111
  borderTop: 1px solid gold
```

### Cada Botón
```
┌──────────────┐
│ 🏠 Home      │  ← Ícono (20px) + Texto
│              │
│  flex: 1     │
│  center      │
└──────────────┘
```

---

## 6️⃣ BOTÓN FLOTANTE (FAB)

### Diseño
```
                          ┌─────┐
                          │  +  │
                          │     │
                          └─────┘
                          
Posición: fixed
  right: 20px
  bottom: 70px (encima del bottom nav)
  
Tamaño: 56x56px
borderRadius: 50% (circular perfecto)

Estilos:
  background: gold (#FFD700)
  color: black (#0a0a0a)
  fontWeight: 800 (muy bold)
  fontSize: 28px (el "+" se ve grande)
  border: none
  boxShadow: 0 6px 18px rgba(0,0,0,0.4)
  cursor: pointer
  
Hover (no implementado pero debería):
  transform: scale(1.1)
  boxShadow: 0 8px 24px rgba(0,0,0,0.6)
```

---

## 📐 DIMENSIONES Y ESPACIADO

### Padding/Margin
```
Header:       padding: 16px 24px
Stories:      padding: 12px 16px
Feed:         padding: 0 16px 80px (espacio para bottom nav)
Menu:         padding: 16px
Card:         padding: 12px (header), 0 (imagen), 12px (desc)
Bottom Nav:   padding: 10px 0
```

### Gaps (espacios entre elementos)
```
Header:       gap: 12px (entre logo y texto, etc)
Stories:      gap: 12px (entre avatares)
Menu:         gap: 8px (entre botones)
Feed:         gap: 16px (entre publicaciones)
Footer card:  gap: 12px (entre botones de acción)
```

### Bordes y Radios
```
Input:            borderRadius: 20px
Cards:            borderRadius: 16px
Avatares:         borderRadius: 50% (circular)
Botones circulares: borderRadius: 50%
Tags:             borderRadius: 12px
```

---

## 🎨 COLORES POR SECCIÓN

| Sección | Fondo | Texto | Borde | Hover |
|---------|-------|-------|-------|-------|
| Header | #1a1a1a | #FFD700 | #FFD700 | rgba(255,215,0,0.1) |
| Menu | #111 | - | #FFD700 | - |
| Cards | #1a1a1a | #ddd/#FFD700 | #FFD700 | - |
| Bottom Nav | #111 | #FFD700 | #FFD700 | - |
| FAB | #FFD700 | #0a0a0a | none | shadow |

---

## 📱 RESPONSIVE (Mobile-First)

```
Mobile (< 480px):
  Header: Stacked layout
  Búsqueda: 100% ancho
  Menu: Full screen
  Feed: Single column
  
Tablet (480px - 768px):
  Header: Normal
  Menu: 2 columnas
  Feed: Single column
  
Desktop (> 768px):
  Todos los elementos normal
  Menu: 4 columnas (actual)
```

---

## 🔍 Zoom en Elementos Clave

### Input Búsqueda Focus/Blur
```
Blur: background: 'rgba(255, 255, 255, 0.1)'
Focus: background: 'rgba(255, 255, 255, 0.15)'
```

### Botón Notificación Hover
```
onMouseOver:
  background: gold
  color: black
  
onMouseOut:
  background: transparent
  color: gold
```

### Tags en Publicación
```
background: #222 (gris oscuro)
padding: 4px 8px
borderRadius: 12px
fontSize: 12px
color: gold
```

---

**Documento:** GUÍA_VISUAL_DISEÑO.md
**Creado:** 12 de diciembre de 2025
**Elementos documentados:** 30+
**Dimensiones incluidas:** Sí
**Colores mapeados:** Sí
