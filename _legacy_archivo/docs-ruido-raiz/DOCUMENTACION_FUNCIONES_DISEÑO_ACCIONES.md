# 📖 DOCUMENTACIÓN COMPLETA - FUNCIONES, DISEÑO Y ACCIONES POR PÁGINA

**Fecha:** 12 de diciembre de 2025
**Versión:** FutPro 2.0
**Estado:** Documentación exhaustiva de UX/UI y flujos

---

## 📑 ÍNDICE

1. [HomePage](#homepage---ruta-raíz-/)
2. [Menú Hamburguesa](#menú-hamburguesa)
3. [Stories Section](#stories-section)
4. [Feed de Publicaciones](#feed-de-publicaciones)
5. [Bottom Navigation](#bottom-navigation)
6. [Flujos de Autenticación](#flujos-de-autenticación)
7. [Tabla Resumen Acciones](#tabla-resumen-acciones)

---

# HomePage - Ruta `/`

## 📍 SECCIONES Y COMPONENTES

### 1. HEADER (Encabezado Sticky)

#### Diseño Visual
```
┌─────────────────────────────────────────────────────┐
│ [Logo] FutPro        [Search...]  [🔔] [☰]          │
│        Bienvenido de vuelta                          │
└─────────────────────────────────────────────────────┘
```

**Altura:** 88px
**Color:** `#1a1a1a` (darkCard) con borde dorado
**Posición:** sticky top (z-index: 20)

#### Funciones/Componentes:

##### A) FutproLogo
- **Tipo:** Componente React
- **Props:** `size={42}`
- **Función:** Mostrar logo de la app
- **Acción al click:** Navega a `/` (recarga home)
- **Comportamiento:** Decorativo/Navegación principal

##### B) Título y Subtítulo
```jsx
<div>
  <div style={{ fontWeight: 800, fontSize: 20 }}>FutPro</div>
  <div style={{ color: '#ccc', fontSize: 12 }}>Bienvenido de vuelta</div>
</div>
```
- **Texto:** "FutPro" + "Bienvenido de vuelta"
- **Color:** Gold (#FFD700) + Gris (#ccc)
- **Acción al click:** Ninguna (decorativo)

##### C) Barra de Búsqueda
```jsx
<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Buscar jugadores, equipos..."
/>
```
- **Ancho:** 240px
- **Altura:** ~40px
- **Placeholder:** "Buscar jugadores, equipos..."
- **Comportamiento:** Filtra publicaciones en tiempo real
- **Cambio de estado:** `setSearch(e.target.value)`
- **Efecto:** Llama `useMemo` que filtra `seedPosts` por:
  - Nombre de usuario (toLowerCase)
  - Título de publicación
  - Descripción de publicación

**Función asociada:**
```javascript
const filteredPosts = useMemo(() => {
  if (!search) return seedPosts;
  const term = search.toLowerCase();
  return seedPosts.filter(p =>
    p.user.toLowerCase().includes(term) ||
    p.title.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
}, [search]);
```

##### D) Botón Notificaciones 🔔
- **Tamaño:** 40x40px
- **Forma:** Circular
- **Icono:** 🔔
- **Borde:** Gold (#FFD700)
- **Acción al click:**
  ```javascript
  onClick={goAlerts}
  // Equivale a: menuActions.verNotificaciones()
  // Navega a: /notificaciones
  ```
- **Comportamiento:** Abre página de notificaciones

##### E) Botón Menú Hamburguesa ☰
- **Tamaño:** 40x40px
- **Forma:** Circular
- **Icono:** ☰
- **Acción al click:**
  ```javascript
  onClick={() => setMenuOpen(!menuOpen)}
  ```
- **Cambio de estado:** Toggle `menuOpen` boolean
- **Efecto:** Abre/cierra menú desplegable

---

### 2. MENÚ HAMBURGUESA (Desplegable)

#### Diseño Visual
```
┌─────────────────────────────────────────────────────┐
│ Cuando menuOpen === true:                           │
│                                                      │
│  👤 Mi Perfil    | 📊 Estadísticas | 📅 Mis Partidos│
│  🏆 Mis Logros   | 🆔 Mis Tarjetas | 👥 Ver Equipos │
│  ➕ Crear Equipo | 🏆 Ver Torneos  | ➕ Crear Torneo│
│  🤝 Amistoso     | ⚽ Penaltis      | 🆔 Card Futpro│
│  💡 Sugerencias  | 🔔 Notificaciones| 💬 Chat        │
│  🎥 Videos       | 🏪 Marketplace   | 📋 Estados     │
│  👫 Seguidores   | 📡 Transmisión   | 📊 Ranking J.  │
│  📈 Ranking E.   | 🔍 Buscar Ranking| 🔧 Configuración│
│  🆘 Soporte      | 🛡️ Privacidad    | 🚪 Cerrar      │
└─────────────────────────────────────────────────────┘
```

**Condición de visualización:** `{menuOpen && (...)}`
**Grid:** 4 columnas (`gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))'`)
**Ancho:** 100% (fullwidth cuando se abre)
**Altura:** Auto (contenido)
**Fondo:** #111 con borde dorado inferior

#### Funciones por Botón:

##### Botones del Menú (28 total)

Cada botón tiene esta estructura:
```jsx
<button onClick={menuActions.ACCION_ESPECIFICA}>
  {ICONO} {ETIQUETA}
</button>
```

| # | Botón | Icono | Función | Navega a | Acción Usuario |
|----|-------|-------|---------|----------|---|
| 1 | Mi Perfil | 👤 | `menuActions.irAPerfil()` | `/perfil/me` | Ver su perfil personal |
| 2 | Mis Estadísticas | 📊 | `menuActions.verEstadisticas()` | `/estadisticas` | Ver estadísticas personales (goles, asistencias, etc.) |
| 3 | Mis Partidos | 📅 | `menuActions.verPartidos()` | `/partidos` | Lista de todos sus partidos |
| 4 | Mis Logros | 🏆 | `menuActions.verLogros()` | `/logros` | Ver logros desbloqueados |
| 5 | Mis Tarjetas | 🆔 | `menuActions.verTarjetas()` | `/tarjetas` | Gestiona sus tarjetas de jugador |
| 6 | Ver Equipos | 👥 | `menuActions.verEquipos()` | `/equipos` | Catálogo de equipos disponibles |
| 7 | Crear Equipo | ➕ | `menuActions.crearEquipo()` | `/crear-equipo` | Abre formulario para crear equipo |
| 8 | Ver Torneos | 🏆 | `menuActions.verTorneos()` | `/torneos` | Catálogo de torneos disponibles |
| 9 | Crear Torneo | ➕ | `menuActions.crearTorneo()` | `/crear-torneo` | Abre formulario para crear torneo |
| 10 | Crear Amistoso | 🤝 | `menuActions.crearAmistoso()` | `/amistoso` | Crear partido amistoso |
| 11 | Juego de Penaltis | ⚽ | `menuActions.jugarPenaltis()` | `/penaltis` | Minijuego de penaltis interactivo |
| 12 | Card Futpro | 🆔 | `menuActions.verCardFIFA()` | `/card-fifa` | Ver/editar card de jugador estilo FIFA |
| 13 | Sugerencias Card | 💡 | `menuActions.sugerenciasCard()` | `/sugerencias-card` | Mejoras sugeridas para la card |
| 14 | Notificaciones | 🔔 | `menuActions.verNotificaciones()` | `/notificaciones` | Centro de notificaciones |
| 15 | Chat | 💬 | `menuActions.abrirChat()` | `/chat` | Chat en tiempo real |
| 16 | Videos | 🎥 | `menuActions.verVideos()` | `/videos` | Galería de videos de partidos |
| 17 | Marketplace | 🏪 | `menuActions.abrirMarketplace()` | `/marketplace` | Tienda de items y upgrades |
| 18 | Estados | 📋 | `menuActions.verEstados()` | `/estados` | Estados de amigos y comunidad |
| 19 | Seguidores | 👫 | `menuActions.verAmigos()` | `/amigos` | Lista de amigos/seguidores |
| 20 | Transmitir en Vivo | 📡 | `menuActions.abrirTransmisionEnVivo()` | `/transmision-en-vivo` | Streaming WebRTC de partidos |
| 21 | Ranking Jugadores | 📊 | `menuActions.rankingJugadores()` | `/ranking-jugadores` | Leaderboard global |
| 22 | Ranking Equipos | 📈 | `menuActions.rankingEquipos()` | `/ranking-equipos` | Leaderboard de equipos |
| 23 | Buscar Ranking | 🔍 | `menuActions.buscarRanking()` | `/buscar-ranking` | Búsqueda avanzada en rankings |
| 24 | Configuración | 🔧 | `menuActions.abrirConfiguracion()` | `/configuracion` | Ajustes de cuenta y privacidad |
| 25 | Soporte | 🆘 | `menuActions.contactarSoporte()` | `/soporte` | Centro de ayuda y tickets |
| 26 | Privacidad | 🛡️ | `menuActions.verPrivacidad()` | `/privacidad` | Política de privacidad y legal |
| 27 | Cerrar Sesión | 🚪 | `menuActions.logout()` | `/login` | Limpia localStorage y sesión, navega a login |

**Qué genera cada click:**
```javascript
const createMenuActions = (navigate) => ({
  // Cada una ejecuta: navigate('/ruta-destino')
  // Excepto logout que también ejecuta:
  logout: () => {
    localStorage.clear();      // Borra todo el almacenamiento local
    sessionStorage.clear();    // Borra sesión temporal
    navigate('/login');        // Navega a login
  }
});
```

---

### 3. STORIES SECTION (Strip de Historias)

#### Diseño Visual
```
┌─────────────────────────────────────────────────────┐
│ [👤] [👤] [👤] [👤] → (scroll horizontal)           │
│ Lucia Mateo Sofia Leo FC                            │
└─────────────────────────────────────────────────────┘
```

**Altura:** ~100px (64px avatar + texto)
**Overflow:** Horizontal scrollable (`overflowX: 'auto'`)
**Padding:** 12px 16px

#### Función:

```jsx
{seedStories.map(story => (
  <div key={story.id} style={{ textAlign: 'center' }}>
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      background: 'linear-gradient(135deg, #ff0080, #ff8c00)',
      padding: 3, display: 'flex', alignItems: 'center', 
      justifyContent: 'center',
      cursor: 'pointer'
    }}
      onClick={() => console.log('Ver historia', story.name)}
    >
      <img src={story.avatar} alt={story.name} 
        style={{ width: 58, height: 58, borderRadius: '50%' }} />
    </div>
    <div style={{ fontSize: 12, marginTop: 4 }}>{story.name}</div>
  </div>
))}
```

**Datos de ejemplo:**
```javascript
const seedStories = [
  { id: 1, name: 'Lucia', avatar: 'https://placekitten.com/80/80' },
  { id: 2, name: 'Mateo', avatar: 'https://placekitten.com/81/81' },
  { id: 3, name: 'Sofia', avatar: 'https://placekitten.com/82/82' },
  { id: 4, name: 'Leo FC', avatar: 'https://placekitten.com/83/83' }
];
```

#### Qué pasa al hacer click:
- **Acción:** `console.log('Ver historia', story.name)`
- **Efecto visual:** Ninguno (solo log en consola)
- **Navegación:** Ninguna
- **Comportamiento esperado:** Debería abrir modal de historia (en desarrollo)

---

### 4. FEED DE PUBLICACIONES (Main Content)

#### Diseño Visual
```
┌─────────────────────────────────────────────────────┐
│ PUBLICACIÓN 1                                       │
│ ┌──────────────────────────────────────────────┐   │
│ │ [Avatar] Lucia     [Femenino] [Sub18]        │   │
│ │ Victoria 3-1                                  │   │
│ ├──────────────────────────────────────────────┤   │
│ │ [Imagen 800x500]                             │   │
│ ├──────────────────────────────────────────────┤   │
│ │ Gran partido hoy, seguimos sumando.          │   │
│ ├──────────────────────────────────────────────┤   │
│ │ ⚽ 120 | 💬 12 | 📤 Compartir               │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ PUBLICACIÓN 2                                       │
│ ┌──────────────────────────────────────────────┐   │
│ │ [Avatar] Leo FC    [Mixto]                   │   │
│ │ Nuevo fichaje                                 │   │
│ ├──────────────────────────────────────────────┤   │
│ │ [Imagen 801x500]                             │   │
│ ├──────────────────────────────────────────────┤   │
│ │ Bienvenido al equipo!                        │   │
│ ├──────────────────────────────────────────────┤   │
│ │ ⚽ 85 | 💬 9 | 📤 Compartir                 │   │
│ └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Grid:** display: grid, gap: 16px
**Padding:** 0 16px 80px (para dejar espacio al bottom nav)
**Ancho máximo:** Responsive

#### Funciones:

##### A) Filtrado de Publicaciones
```javascript
const filteredPosts = useMemo(() => {
  if (!search) return seedPosts;
  const term = search.toLowerCase();
  return seedPosts.filter(p =>
    p.user.toLowerCase().includes(term) ||
    p.title.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
}, [search]);
```
**Acción:** Se actualiza en tiempo real según búsqueda

##### B) Mapa de Publicaciones
```jsx
{filteredPosts.map(post => (...))}
```
**Función:** Renderiza cada publicación dinámicamente

##### C) Estructura de cada Publicación

**Header de Publicación:**
```jsx
<header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
  <img src={post.avatar} alt={post.user} 
    style={{ width: 40, height: 40, borderRadius: '50%' }} />
  <div>
    <div style={{ fontWeight: 700 }}>{post.user}</div>
    <div style={{ fontSize: 12, color: '#ccc' }}>{post.title}</div>
  </div>
  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, fontSize: 12 }}>
    {post.tags.map(tag => <span ...>{tag}</span>)}
  </div>
</header>
```
**Componentes:**
- Avatar (40x40px, circular)
- Nombre de usuario (fontWeight: 700)
- Título de publicación
- Tags (Femenino, Sub18, Mixto, etc.)

**Imagen de Publicación:**
```jsx
<div>
  <img src={post.image} alt={post.title} 
    style={{ width: '100%', display: 'block' }} />
</div>
```
**Ancho:** 100%
**Acción al click:** Ninguna (decorativo)

**Descripción:**
```jsx
<div style={{ padding: 12, color: '#ddd' }}>{post.description}</div>
```

**Footer (Acciones):**
```jsx
<footer style={{ display: 'flex', gap: 12, padding: '0 12px 12px' }}>
  <button onClick={() => onLike(post.id)} style={{ flex: 1 }}>
    ⚽ {likes[post.id] || 0}
  </button>
  <button onClick={() => onComment(post.id)} style={{ flex: 1 }}>
    💬 {comments[post.id] || 0}
  </button>
  <button onClick={() => onShare(post.id)} style={{ flex: 1 }}>
    📤 Compartir
  </button>
</footer>
```

---

### 5. BOTONES DE PUBLICACIÓN

#### A) Botón Like ⚽
```javascript
const onLike = (id) => {
  setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
};
```

**Qué pasa al click:**
1. Obtiene el ID de la publicación
2. Incrementa el contador de likes en 1
3. Actualiza el estado `likesState`
4. Re-renderiza el componente
5. Muestra nuevo número de likes

**Ejemplo:**
- Antes: `⚽ 120`
- Usuario hace click
- Después: `⚽ 121`

#### B) Botón Comentar 💬
```javascript
const onComment = (id) => {
  setComments(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
};
```

**Qué pasa al click:**
1. Obtiene el ID de la publicación
2. Incrementa el contador de comentarios en 1
3. Actualiza el estado `commentsState`
4. Re-renderiza el componente
5. Muestra nuevo número de comentarios

**Ejemplo:**
- Antes: `💬 12`
- Usuario hace click
- Después: `💬 13`

#### C) Botón Compartir 📤
```javascript
const onShare = (id) => {
  console.log('Compartir post', id);
};
```

**Qué pasa al click:**
1. Ejecuta `console.log('Compartir post', id)`
2. En consola aparece el ID de la publicación
3. Debería abrir modal de compartir (en desarrollo)

**Ejemplo:**
- Usuario hace click en "Compartir"
- Consola: `Compartir post p1`

---

### 6. BOTTOM NAVIGATION (Barra Inferior)

#### Diseño Visual
```
┌─────────────────────────────────────────────────────┐
│ 🏠 Home | 🛒 Market | 🎥 Videos | 🔔 Alertas | 💬 Chat│
└─────────────────────────────────────────────────────┘
```

**Posición:** fixed, bottom: 0
**Altura:** ~50px
**Ancho:** 100%
**Fondo:** #111 con borde superior dorado
**Display:** flex, justifyContent: 'space-around'

#### Funciones:

```jsx
<nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ... }}>
  <button onClick={goHome}>🏠 Home</button>
  <button onClick={goMarket}>🛒 Market</button>
  <button onClick={goVideos}>🎥 Videos</button>
  <button onClick={goAlerts}>🔔 Alertas</button>
  <button onClick={goChat}>💬 Chat</button>
</nav>
```

| Botón | Función | Navega a | Acción |
|-------|---------|----------|--------|
| 🏠 Home | `goHome()` → `navigate('/')` | `/` | Vuelve al home |
| 🛒 Market | `goMarket()` → `menuActions.abrirMarketplace()` | `/marketplace` | Abre marketplace |
| 🎥 Videos | `goVideos()` → `menuActions.verVideos()` | `/videos` | Abre galería de videos |
| 🔔 Alertas | `goAlerts()` → `menuActions.verNotificaciones()` | `/notificaciones` | Abre notificaciones |
| 💬 Chat | `goChat()` → `menuActions.abrirChat()` | `/chat` | Abre chat |

---

### 7. BOTÓN FLOTANTE (FAB)

#### Diseño Visual
```
┌─────────────────┐
│                 │
│              [+]│  ← Circular, Gold background
│ bottom: 70px    │
│ right: 20px     │
└─────────────────┘
```

**Posición:** fixed, right: 20px, bottom: 70px
**Tamaño:** 56x56px
**Forma:** Circular (borderRadius: '50%')
**Color fondo:** #FFD700 (gold)
**Color texto:** #0a0a0a (black)
**Tamaño fuente:** 800 (fontWeight)

#### Función:

```jsx
<button
  onClick={() => console.log('Crear post')}
  style={{ position: 'fixed', right: 20, bottom: 70, ... }}
>+
</button>
```

**Qué pasa al click:**
1. Ejecuta `console.log('Crear post')`
2. En consola aparece: `Crear post`
3. Debería abrir modal para crear publicación (en desarrollo)

---

# FLUJOS DE AUTENTICACIÓN

## 1. LoginRegisterForm (Ruta: `/login` y `/`)

### Diseño:
- Campo Email
- Campo Password (contraseña)
- Botón "Continuar con Google"
- Toggle Login/Registro

### Funciones:

```javascript
const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
const validatePassword = (pw) => pw.length >= 6;

const handleSubmit = async (e) => {
  // Validar email y password
  // Si es registro: AuthService.register(email, password)
  // Si es login: AuthService.login(email, password)
  // Navega a /seleccionar-categoria o /home
};

const handleGoogle = async () => {
  // AuthService.signInWithGoogle()
  // Navega a /perfil-card
};
```

---

## 2. SeleccionCategoria (Ruta: `/seleccionar-categoria`)

### Diseño:
- Título: "Selecciona tu categoría"
- Botones: Infantil Femenina, Infantil Masculina, Femenina, Masculina

### Funciones:

```javascript
const handleSelect = (value) => {
  setSelected(value);
  // Guarda categoría en estado
};

const handleConfirm = async () => {
  // Navega a /formulario-registro?categoria=valor
};

const handleGoogleLogin = async () => {
  // Usa OAuth de Google
};
```

---

## 3. FormularioRegistroCompleto (Ruta: `/formulario-registro`)

### Diseño:
- Paso 1: Credenciales (email, password)
- Paso 2: Datos personales (nombre, apellido, edad)
- Paso 3: Datos de jugador (posición, nivel)

### Funciones:

```javascript
const siguientePaso = () => {
  if (pasoActual < 3) setPasoActual(pasoActual + 1);
};

const pasoAnterior = () => {
  if (pasoActual > 1) setPasoActual(pasoActual - 1);
};

const handleGoogleSignup = async () => {
  await loginWithGoogle();
  // Navega a /perfil-card
};
```

---

## 4. PerfilCard (Ruta: `/perfil-card`)

### Diseño:
- Card estilo FIFA con datos del jugador
- Estadísticas (partidos, goles, asistencias)
- Botón "Continuar"

### Funciones:

```javascript
const loadCardData = async () => {
  // Carga datos del usuario desde Supabase
  // Muestra animación
  // Setea cardData en estado
};

const continuarAlHome = async () => {
  // Navega a /home
};
```

---

# TABLA RESUMEN DE ACCIONES Y FLUJOS

## ACCIONES POR SECCIÓN

### Header (5 elementos interactivos)
| Elemento | Acción al Click | Resultado | Navegación |
|----------|-----------------|-----------|-----------|
| Logo FutPro | Navega a home | Vuelve a home | `/` |
| Barra Búsqueda | `onChange` | Filtra publicaciones en tiempo real | - |
| 🔔 Notificaciones | Navega | Abre notificaciones | `/notificaciones` |
| ☰ Menú | `setMenuOpen(!menuOpen)` | Toggle menú hamburguesa | - |

### Menú Hamburguesa (28 botones)
| Botón | Acción | Resultado | Ruta |
|-------|--------|-----------|------|
| Mi Perfil | `navigate('/perfil/me')` | Ver perfil personal | `/perfil/me` |
| [... (26 más)] | (ver tabla anterior) | (ver tabla anterior) | (ver tabla anterior) |
| Cerrar Sesión | `localStorage.clear()` + `navigate('/login')` | Limpia datos y va a login | `/login` |

### Stories (4 historias)
| Historia | Acción | Resultado |
|----------|--------|-----------|
| Lucia | `console.log('Ver historia', 'Lucia')` | Log en consola |
| Mateo | `console.log('Ver historia', 'Mateo')` | Log en consola |
| Sofia | `console.log('Ver historia', 'Sofia')` | Log en consola |
| Leo FC | `console.log('Ver historia', 'Leo FC')` | Log en consola |

### Feed de Publicaciones (2 publicaciones x 3 botones)
| Acción | Función | Cambio de Estado | Resultado |
|--------|---------|------------------|-----------|
| Like | `onLike(id)` | `likes[id]++` | Incrementa contador |
| Comentar | `onComment(id)` | `comments[id]++` | Incrementa contador |
| Compartir | `onShare(id)` | `console.log('Compartir post', id)` | Log en consola |

### Bottom Navigation (5 botones)
| Botón | Acción | Resultado | Ruta |
|-------|--------|-----------|------|
| 🏠 Home | `navigate('/')` | Vuelve a home | `/` |
| 🛒 Market | `navigate('/marketplace')` | Abre marketplace | `/marketplace` |
| 🎥 Videos | `navigate('/videos')` | Abre videos | `/videos` |
| 🔔 Alertas | `navigate('/notificaciones')` | Abre notificaciones | `/notificaciones` |
| 💬 Chat | `navigate('/chat')` | Abre chat | `/chat` |

### Botón Flotante
| Elemento | Acción | Resultado |
|----------|--------|-----------|
| Botón + | `console.log('Crear post')` | Log en consola + debería abrir modal |

---

## FLUJO COMPLETO DE USUARIO

### 1. Usuario sin autenticar
```
Abre app
    ↓
Navega a / (HomePage)
    ↓
Ve header, pero puede ver feed público
    ↓
Si intenta hacer click en menú → Debería pedir login
```

### 2. Usuario hace login
```
Va a /login
    ↓
Ingresa email y password (o usa Google OAuth)
    ↓
Va a /seleccionar-categoria
    ↓
Elige categoría (Masculina, Femenina, etc.)
    ↓
Va a /formulario-registro (multi-paso)
    ↓
Completa datos personales
    ↓
Va a /perfil-card
    ↓
Ve su card de jugador
    ↓
Hace click en "Continuar"
    ↓
Navega a /home (HomePage)
```

### 3. Usuario en HomePage
```
Ve feed de publicaciones
    ↓
Puede:
  - Buscar en la barra
  - Hacer like (incrementa contador)
  - Comentar (incrementa contador)
  - Compartir (log en consola)
  - Ver historias (log en consola)
  - Abrir menú hamburguesa
  - Navegar con bottom nav
```

### 4. Usuario hace click en "Mi Perfil"
```
Click en "👤 Mi Perfil"
    ↓
Menú se cierra (menuOpen = false)
    ↓
navigate('/perfil/me')
    ↓
Router navega a página de perfil
    ↓
Ve Layout con Sidebar
    ↓
Carga componente Perfil
```

---

## ESTADOS REACTIVOS (useState)

```javascript
const [search, setSearch] = useState('')                // Búsqueda
const [likes, setLikes] = useState({})                 // {p1: 121, p2: 86}
const [comments, setComments] = useState({})           // {p1: [..], p2: [..]}
const [menuOpen, setMenuOpen] = useState(false)        // Menú abierto/cerrado
```

---

## CONTEXTOS Y HOOKS

```javascript
const navigate = useNavigate()                // Del router
const menuActions = createMenuActions(navigate)   // Funciones mapeadas
const filteredPosts = useMemo(...)            // Publicaciones filtradas
```

---

## RESUMEN FINAL

| Métrica | Cantidad |
|---------|----------|
| Funciones en HomePage | 8+ |
| Botones del menú | 28 |
| Botones del bottom nav | 5 |
| Historias | 4 |
| Publicaciones | 2 (escalable) |
| Botones por publicación | 3 (like, comentar, compartir) |
| **Total interacciones posibles** | **50+** |
| Estados (useState) | 4 |
| Rutas disponibles | 7+ |

---

**Documento creado:** 12 de diciembre de 2025
**Última actualización:** Completo y detallado
**Estado:** Listo para desarrollo e implementación
