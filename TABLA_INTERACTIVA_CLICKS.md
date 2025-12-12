# 📊 TABLA INTERACTIVA - CLICK EN CADA FUNCIÓN

## QUICK REFERENCE - Qué pasa al hacer click

### 1. HEADER

```
┌────────────────────────────────────────────────────────┐
│ ELEMENTO          │ CLICK EN             │ QUÉ SUCEDE   │
├────────────────────────────────────────────────────────┤
│ Logo FutPro       │ Logo o área          │ navigate('/') │
│                   │                      │ Recarga home  │
├────────────────────────────────────────────────────────┤
│ Barra Búsqueda    │ Escribe texto        │ setSearch()   │
│                   │                      │ Filtra posts  │
├────────────────────────────────────────────────────────┤
│ 🔔 Notificaciones │ Botón circular       │ navigate()    │
│                   │                      │ Va a /notif.. │
├────────────────────────────────────────────────────────┤
│ ☰ Menú            │ Botón circular       │ setMenuOpen() │
│                   │                      │ Abre/cierra   │
└────────────────────────────────────────────────────────┘
```

---

### 2. MENÚ HAMBURGUESA (28 BOTONES)

```
┌─────────────────────────────────────────────────────────────────┐
│ BOTÓN                 │ CLICK EN              │ VA A RUTA       │
├─────────────────────────────────────────────────────────────────┤
│ 👤 Mi Perfil          │ Botón con texto       │ /perfil/me      │
│ 📊 Estadísticas       │ Botón con texto       │ /estadisticas   │
│ 📅 Mis Partidos       │ Botón con texto       │ /partidos       │
│ 🏆 Mis Logros         │ Botón con texto       │ /logros         │
│ 🆔 Mis Tarjetas       │ Botón con texto       │ /tarjetas       │
│ 👥 Ver Equipos        │ Botón con texto       │ /equipos        │
│ ➕ Crear Equipo       │ Botón con texto       │ /crear-equipo   │
│ 🏆 Ver Torneos        │ Botón con texto       │ /torneos        │
│ ➕ Crear Torneo       │ Botón con texto       │ /crear-torneo   │
│ 🤝 Crear Amistoso     │ Botón con texto       │ /amistoso       │
│ ⚽ Juego de Penaltis  │ Botón con texto       │ /penaltis       │
│ 🆔 Card Futpro        │ Botón con texto       │ /card-fifa      │
│ 💡 Sugerencias Card   │ Botón con texto       │ /sugerencias-.. │
│ 🔔 Notificaciones     │ Botón con texto       │ /notificaciones │
│ 💬 Chat               │ Botón con texto       │ /chat           │
│ 🎥 Videos             │ Botón con texto       │ /videos         │
│ 🏪 Marketplace        │ Botón con texto       │ /marketplace    │
│ 📋 Estados            │ Botón con texto       │ /estados        │
│ 👫 Seguidores         │ Botón con texto       │ /amigos         │
│ 📡 Transmitir en Vivo │ Botón con texto       │ /transmision-.. │
│ 📊 Ranking Jugadores  │ Botón con texto       │ /ranking-jugad. │
│ 📈 Ranking Equipos    │ Botón con texto       │ /ranking-equip. │
│ 🔍 Buscar Ranking     │ Botón con texto       │ /buscar-ranking │
│ 🔧 Configuración      │ Botón con texto       │ /configuracion  │
│ 🆘 Soporte            │ Botón con texto       │ /soporte        │
│ 🛡️ Privacidad         │ Botón con texto       │ /privacidad     │
│ 🚪 Cerrar Sesión      │ Botón con texto       │ localStorage +  │
│                       │                       │ navigate/login  │
└─────────────────────────────────────────────────────────────────┘
```

**Comportamiento común:**
- TODOS los botones ejecutan: `navigate('/ruta')`
- El router renderiza la página correspondiente
- El menú se cierra automáticamente (debería)

**Especial - Cerrar Sesión:**
```javascript
logout: () => {
  localStorage.clear();           // Borra datos locales
  sessionStorage.clear();         // Borra sesión
  navigate('/login');             // Va a login
}
```

---

### 3. STORIES (HISTORIAS)

```
┌──────────────────────────────────────────────────┐
│ HISTORIA      │ CLICK EN AVATAR              │   │
├──────────────────────────────────────────────────┤
│ Lucia (👤)    │ console.log('Ver historia',  │   │
│               │ 'Lucia')                     │   │
│               │ → Aparece en DevTools        │   │
├──────────────────────────────────────────────────┤
│ Mateo (👤)    │ console.log('Ver historia',  │   │
│               │ 'Mateo')                     │   │
│               │ → Aparece en DevTools        │   │
├──────────────────────────────────────────────────┤
│ Sofia (👤)    │ console.log('Ver historia',  │   │
│               │ 'Sofia')                     │   │
│               │ → Aparece en DevTools        │   │
├──────────────────────────────────────────────────┤
│ Leo FC (👤)   │ console.log('Ver historia',  │   │
│               │ 'Leo FC')                    │   │
│               │ → Aparece en DevTools        │   │
└──────────────────────────────────────────────────┘
```

**En DevTools verías:**
```
Ver historia Lucia
Ver historia Mateo
Ver historia Sofia
Ver historia Leo FC
```

---

### 4. FEED DE PUBLICACIONES

#### PUBLICACIÓN 1: LUCIA - Victoria 3-1

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ [Avatar] Lucia                 [Femenino][Sub18]   │
│          Victoria 3-1                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ IMAGEN DE PUBLICACIÓN                               │
│ [Foto 800x500]                                      │
│ → Acción: Ninguna                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ DESCRIPCIÓN                                         │
│ "Gran partido hoy, seguimos sumando."               │
│ → Acción: Ninguna (decorativo)                      │
└─────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬────────────────┐
│ ⚽ 120       │ 💬 12        │ 📤 Compartir   │
│ LIKE         │ COMENTAR     │ COMPARTIR      │
└──────────────┴──────────────┴────────────────┘

ACCIONES:
  • CLICK ⚽ 120    → likes['p1'] = 121   → Muestra ⚽ 121
  • CLICK 💬 12    → comments['p1'] = 13 → Muestra 💬 13
  • CLICK Compartir → console.log('Compartir post', 'p1')
                    → DevTools: "Compartir post p1"
```

#### PUBLICACIÓN 2: LEO FC - Nuevo fichaje

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ [Avatar] Leo FC                           [Mixto]   │
│          Nuevo fichaje                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ IMAGEN DE PUBLICACIÓN                               │
│ [Foto 801x500]                                      │
│ → Acción: Ninguna                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ DESCRIPCIÓN                                         │
│ "Bienvenido al equipo!"                             │
│ → Acción: Ninguna (decorativo)                      │
└─────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬────────────────┐
│ ⚽ 85        │ 💬 9         │ 📤 Compartir   │
│ LIKE         │ COMENTAR     │ COMPARTIR      │
└──────────────┴──────────────┴────────────────┘

ACCIONES:
  • CLICK ⚽ 85     → likes['p2'] = 86   → Muestra ⚽ 86
  • CLICK 💬 9     → comments['p2'] = 10 → Muestra 💬 10
  • CLICK Compartir → console.log('Compartir post', 'p2')
                    → DevTools: "Compartir post p2"
```

---

### 5. BOTTOM NAVIGATION

```
┌─────────────────────────────────────────────────────┐
│ BOTÓN        │ CLICK EN                │ VA A RUTA  │
├─────────────────────────────────────────────────────┤
│ 🏠 Home      │ Ícono + texto "Home"    │ /          │
│              │                         │ Recarga    │
├─────────────────────────────────────────────────────┤
│ 🛒 Market    │ Ícono + texto "Market"  │ /market    │
│              │                         │ place      │
├─────────────────────────────────────────────────────┤
│ 🎥 Videos    │ Ícono + texto "Videos"  │ /videos    │
│              │                         │ Galería    │
├─────────────────────────────────────────────────────┤
│ 🔔 Alertas   │ Ícono + texto "Alertas" │ /notif..   │
│              │                         │ aciones    │
├─────────────────────────────────────────────────────┤
│ 💬 Chat      │ Ícono + texto "Chat"    │ /chat      │
│              │                         │ Chat RT    │
└─────────────────────────────────────────────────────┘
```

---

### 6. BOTÓN FLOTANTE

```
┌────────────────────────────────────┐
│                              [+]   │ ← Circular button
│                                    │   Gold background
│                                    │   bottom: 70px
│                                    │   right: 20px
└────────────────────────────────────┘

ACCIÓN:
  • CLICK [+]   → console.log('Crear post')
                → DevTools: "Crear post"
                → Debería abrir modal (no implementado)
```

---

## 📱 FLUJO COMPLETO DE USUARIO - PASO A PASO

### Escenario 1: Usuario busca "victoria"

```
INICIO: Usuario ve HomePage con 2 publicaciones

PASO 1: Usuario escribe en barra de búsqueda
  • Escribe: "v"
  • Evento: onChange → setSearch('v')
  • Cambio: filteredPosts ahora filtra por búsqueda

PASO 2: Usuario sigue escribiendo
  • Escribe: "vi"
  • Evento: onChange → setSearch('vi')
  • Cambio: filteredPosts se actualiza

PASO 3: Usuario termina
  • Escribe: "victoria"
  • Evento: onChange → setSearch('victoria')
  • Resultado: Solo muestra Publicación 1 (Lucia - "Victoria 3-1")
  • Publicación 2 desaparece de la vista

PASO 4: Usuario borra búsqueda
  • Borra texto
  • Evento: onChange → setSearch('')
  • Resultado: Vuelven a aparecer las 2 publicaciones
```

### Escenario 2: Usuario le da like a una publicación

```
INICIO: Publicación 1 muestra "⚽ 120"

PASO 1: Usuario hace click en ⚽ 120
  • Evento: onClick={onLike('p1')}
  • Ejecución: onLike('p1') se ejecuta
  • Cambio de estado:
    likes = { p1: 120, p2: 85 }  →  { p1: 121, p2: 85 }

PASO 2: Componente re-renderiza
  • El estado cambió
  • React detecta el cambio
  • Vuelve a renderizar el JSX
  
RESULTADO: Publicación 1 ahora muestra "⚽ 121"
```

### Escenario 3: Usuario abre menú y navega

```
INICIO: menuOpen = false (menú cerrado)

PASO 1: Usuario hace click en ☰
  • Evento: onClick={() => setMenuOpen(!menuOpen)}
  • Cambio: menuOpen = true
  • Resultado: El menú se abre (50+ líneas de grid)

PASO 2: Usuario busca "Ranking" en el menú
  • Ve: "📊 Ranking Jugadores"
  • Hace click

PASO 3: Se ejecuta menuActions.rankingJugadores()
  • Llamada: navigate('/ranking-jugadores')
  • Router navega a esa ruta
  • Se carga el componente RankingJugadores
  • Si está en Layout: Se muestra con Sidebar + BottomNav
  • Si NO está en Layout: Se muestra solo

RESULTADO: Usuario ve página de Ranking
```

### Escenario 4: Usuario hace logout

```
INICIO: Usuario logueado, viendo HomePage

PASO 1: Usuario abre menú (☰)
  • Evento: onClick={() => setMenuOpen(!menuOpen)}
  • Estado: menuOpen = true
  
PASO 2: Usuario busca "Cerrar Sesión"
  • Ve: "🚪 Cerrar Sesión"
  • Hace click

PASO 3: Se ejecuta menuActions.logout()
  
  // Internamente:
  localStorage.clear();        // Borra TODO del localStorage
  sessionStorage.clear();      // Borra TODO del sessionStorage
  navigate('/login');          // Navega a página de login

RESULTADO: 
  • Todos los datos del usuario se eliminan
  • Se ve la página de login
  • Usuario debe hacer login de nuevo
```

---

## 🎯 MATRIZ DE RESULTADOS

| Usuario hace click en | Tipo de Acción | Cambio Visual | Navegación | Estado |
|----------------------|----------------|---------------|-----------|--------|
| Logo | Navegación | No | `/` | No |
| Búsqueda | Input | Filtra | No | setSearch |
| 🔔 | Navegación | No | `/notif..` | No |
| ☰ | Toggle | Abre menú | No | setMenuOpen |
| Botón Menú | Navegación | No | `/ruta` | No |
| Historia | Log | No | No | No |
| ⚽ (Like) | Contador | +1 | No | setLikes |
| 💬 (Comentar) | Contador | +1 | No | setComments |
| 📤 (Compartir) | Log | No | No | No |
| Bottom Nav | Navegación | No | `/ruta` | No |
| [+] FAB | Log | No | No | No |

---

## 💾 CAMBIOS DE ESTADO

### setSearch
```
Inicial:  search = ''
Usuario:  Escribe 'victoria'
Cambio:   search = 'victoria'
Efecto:   filteredPosts = [post1] (solo "Victoria 3-1")
```

### setLikes
```
Inicial:  likes = { p1: 120, p2: 85 }
Usuario:  Hace click ⚽ en p1
Cambio:   likes = { p1: 121, p2: 85 }
Efecto:   Renderiza ⚽ 121
```

### setComments
```
Inicial:  comments = { p1: 12, p2: 9 }
Usuario:  Hace click 💬 en p2
Cambio:   comments = { p1: 12, p2: 10 }
Efecto:   Renderiza 💬 10
```

### setMenuOpen
```
Inicial:  menuOpen = false
Usuario:  Hace click ☰
Cambio:   menuOpen = true
Efecto:   Renderiza menú desplegable
```

---

**Documento:** TABLA_INTERACTIVA_CLICKS.md
**Creado:** 12 de diciembre de 2025
**Total de flujos documentados:** 20+
**Total de acciones:** 50+
