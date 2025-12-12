# 🗺️ MAPA VISUAL DE CLICKS - FUTPRO 2.0

## 1️⃣ ÁRBOL DE NAVEGACIÓN COMPLETO

```
FUTPRO 2.0
│
├── 🔐 AUTENTICACIÓN
│   ├── LOGIN (/login)
│   │   ├── [Email input] → setEmail
│   │   ├── [Password input] → setPassword
│   │   ├── [Botón Login]
│   │   │   └── ✅ → /seleccionar-categoria
│   │   │   └── ❌ → Mostrar error
│   │   ├── [Botón Registrarse]
│   │   │   └── Cambia a modo registro
│   │   └── [Google OAuth]
│   │       └── ✅ → /perfil-card → /home
│   │       └── ❌ → Mostrar error
│   │
│   ├── SELECCIONAR CATEGORÍA (/seleccionar-categoria)
│   │   ├── [Infantil Femenina] → selected='infantil_femenina'
│   │   ├── [Infantil Masculina] → selected='infantil_masculina'
│   │   ├── [Femenina] → selected='femenina'
│   │   ├── [Masculina] → selected='masculina'
│   │   ├── [Botón Confirmar]
│   │   │   └── /formulario-registro?categoria=X
│   │   └── [Google OAuth]
│   │       └── → /perfil-card
│   │
│   ├── FORMULARIO REGISTRO (/formulario-registro)
│   │   ├── PASO 1 (Credenciales)
│   │   │   ├── [Email] → formData.email
│   │   │   ├── [Password] → formData.password
│   │   │   ├── [Google OAuth] → /perfil-card
│   │   │   └── [Siguiente] → Paso 2
│   │   │
│   │   ├── PASO 2 (Datos Personales)
│   │   │   ├── [Nombre] → formData.nombre
│   │   │   ├── [Apellido] → formData.apellido
│   │   │   ├── [Edad] → formData.edad
│   │   │   ├── [Anterior] → Paso 1
│   │   │   └── [Siguiente] → Paso 3
│   │   │
│   │   └── PASO 3 (Datos Jugador)
│   │       ├── [Posición] → formData.posicion
│   │       ├── [Nivel] → formData.nivelHabilidad
│   │       ├── [Anterior] → Paso 2
│   │       └── [Finalizar] → /perfil-card
│   │
│   └── PERFIL CARD (/perfil-card)
│       ├── [Continuar al Home] → /
│       └── [Ver Perfil Completo] → /perfil/me
│
├── 🏠 HOMEPAGE (/)
│   ├── HEADER
│   │   ├── [Logo] → /
│   │   ├── [Barra Búsqueda] → Filtra posts (setState)
│   │   ├── [🔔 Notificaciones] → /notificaciones
│   │   └── [☰ Menú] → Abre/cierra menú
│   │
│   ├── MENÚ HAMBURGUESA (28 botones)
│   │   ├── 👤 Mi Perfil → /perfil/me
│   │   ├── 📊 Estadísticas → /estadisticas
│   │   ├── 📅 Partidos → /partidos
│   │   ├── 🏆 Logros → /logros
│   │   ├── 🆔 Tarjetas → /tarjetas
│   │   ├── 👥 Ver Equipos → /equipos
│   │   ├── ➕ Crear Equipo → /crear-equipo
│   │   ├── 🏆 Ver Torneos → /torneos
│   │   ├── ➕ Crear Torneo → /crear-torneo
│   │   ├── 🤝 Amistoso → /amistoso
│   │   ├── ⚽ Penaltis → /penaltis
│   │   ├── 🆔 Card FIFA → /card-fifa
│   │   ├── 💡 Sugerencias → /sugerencias-card
│   │   ├── 🔔 Notificaciones → /notificaciones
│   │   ├── 💬 Chat → /chat
│   │   ├── 🎥 Videos → /videos
│   │   ├── 🏪 Marketplace → /marketplace
│   │   ├── 📋 Estados → /estados
│   │   ├── 👫 Amigos → /amigos
│   │   ├── 📡 Transmisión → /transmision-en-vivo
│   │   ├── 📊 Ranking J. → /ranking-jugadores
│   │   ├── 📈 Ranking E. → /ranking-equipos
│   │   ├── 🔍 Buscar → /buscar-ranking
│   │   ├── 🔧 Configuración → /configuracion
│   │   ├── 🆘 Soporte → /soporte
│   │   ├── 🛡️ Privacidad → /privacidad
│   │   └── 🚪 Cerrar Sesión → /login (clear storage)
│   │
│   ├── STORIES (Scroll horizontal)
│   │   ├── [Lucia] → console.log('Ver historia Lucia')
│   │   ├── [Mateo] → console.log('Ver historia Mateo')
│   │   ├── [Sofia] → console.log('Ver historia Sofia')
│   │   └── [Leo FC] → console.log('Ver historia Leo FC')
│   │
│   ├── FEED (Posts)
│   │   ├── POST 1 (Lucia - Victoria 3-1)
│   │   │   ├── [Avatar/Nombre] → /usuario/lucia (pendiente)
│   │   │   ├── [⚽ 120] → likes['p1']++ (121)
│   │   │   ├── [💬 12] → comments['p1']++ (13)
│   │   │   └── [📤 Compartir] → console.log('Compartir post p1')
│   │   │
│   │   └── POST 2 (Leo FC - Nuevo fichaje)
│   │       ├── [Avatar/Nombre] → /usuario/leo (pendiente)
│   │       ├── [⚽ 85] → likes['p2']++ (86)
│   │       ├── [💬 9] → comments['p2']++ (10)
│   │       └── [📤 Compartir] → console.log('Compartir post p2')
│   │
│   ├── BOTTOM NAVIGATION
│   │   ├── 🏠 Home → /
│   │   ├── 🛒 Market → /marketplace
│   │   ├── 🎥 Videos → /videos
│   │   ├── 🔔 Alertas → /notificaciones
│   │   └── 💬 Chat → /chat
│   │
│   └── BOTÓN FLOTANTE [+]
│       └── console.log('Crear post')
│
├── 🎥 VIDEOS (/videos)
│   ├── [Deslizar abajo] → Siguiente video
│   ├── [Deslizar arriba] → Video anterior
│   ├── [Doble tap] → Like
│   ├── [Tap] → Pausar/Reproducir
│   ├── [Comentarios] → Abre panel
│   ├── [Compartir] → Opciones
│   └── [Para ti/Siguiendo] → Filtra videos
│
├── 🛒 MARKETPLACE (/marketplace)
│   ├── [Búsqueda] → Filtra productos
│   ├── [Filtros]
│   │   ├── [Precio] → mín-máx
│   │   ├── [Ubicación] → ciudad
│   │   ├── [Categoría] → tipo producto
│   │   └── [Ordenar] → Recientes/Precio
│   ├── [Ver producto] → Abre detalle
│   │   ├── [Contactar] → /chat
│   │   └── [Comprar] → Proceso pago
│   └── [Vender algo] → Formulario crear producto
│
├── 💬 CHAT (/chat)
│   ├── [Seleccionar conversación] → Abre mensajes
│   ├── [Escribir mensaje] → Envía (Firebase RT)
│   ├── [Enviar foto/video] → Upload
│   └── [Buscar conversación] → Filtra
│
├── 📡 TRANSMISIÓN EN VIVO (/transmision-en-vivo)
│   ├── [Iniciar transmisión] → Abre cámara (WebRTC)
│   ├── [Compartir link] → Copy to clipboard
│   ├── [Chat en vivo] → Mensajes tiempo real
│   └── [Terminar] → Cierra stream
│
└── 📊 RANKINGS
    ├── Ranking Jugadores (/ranking-jugadores)
    │   ├── [Top 100] → Lista ordenada
    │   ├── [Ordenar por] → OVR/Goles/Asist
    │   ├── [Categoría] → Filtra
    │   └── [Tu posición] → Destacada
    │
    └── Ranking Equipos (/ranking-equipos)
        ├── [Top equipos] → Puntos
        ├── [Categoría] → Filtra
        └── [Historial] → Torneos anteriores
```

---

## 2️⃣ FLOWCHART - FLUJO DE USUARIO NUEVO

```
┌─────────────────────┐
│   USUARIO NUEVO     │
│   Abre App (/)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│     LOGIN/REGISTRO (/login)         │
│  Escribe email y password           │
└──────────┬──────────────────────────┘
           │
           ├─ [Registrarse]
           │  │
           │  ▼
           │ ┌───────────────────────────────────┐
           │ │ SELECCIONA CATEGORÍA              │
           │ │ (/seleccionar-categoria)          │
           │ │ Elige: Masculina/Femenina/...    │
           │ └──────────┬────────────────────────┘
           │            │
           │            ▼
           │ ┌───────────────────────────────────┐
           │ │ FORMULARIO REGISTRO (3 PASOS)    │
           │ │ (/formulario-registro)            │
           │ │ • Paso 1: Credenciales            │
           │ │ • Paso 2: Datos personales        │
           │ │ • Paso 3: Datos jugador           │
           │ └──────────┬────────────────────────┘
           │            │
           │            ▼
           └─→ ┌───────────────────────────────────┐
               │ PERFIL CARD (/perfil-card)       │
               │ Muestra card FIFA estilo         │
               │ [Continuar al Home]              │
               └──────────┬────────────────────────┘
                          │
                          ▼
       ┌──────────────────────────────────────────┐
       │         HOMEPAGE (/)                     │
       │  • Feed de publicaciones                 │
       │  • Stories                               │
       │  • 28 opciones en menú                   │
       │  • 5 botones bottom nav                  │
       └──────────┬───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬──────────────┬───────────────┐
    │             │             │              │               │
    ▼             ▼             ▼              ▼               ▼
┌────────────┐ ┌────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────┐
│ Ver Perfil │ │ Videos │ │ Marketplace │ │ Chat     │ │ Notif.   │
│ /perfil/me │ │/videos │ │/marketplace │ │/chat     │ │/notif    │
└────────────┘ └────────┘ └─────────────┘ └──────────┘ └──────────┘
    │             │             │              │           │
    │ [Like]      │ [Desliza]   │ [Compra]     │ [Escribe] │ [Lee]
    │ [Comentar]  │ [Comparte]  │ [Vende]      │ [Envía]   │ [Marca]
    │ [Compartir] │ [Mira En    │ [Busca]      │ [Upload]  │ [Ve]
    │             │  Vivo]      │ [Filtra]     │           │
```

---

## 3️⃣ MAPA DE CLICKS - HOMEPAGE (Detallado)

```
┌─────────────────────────────────────────────────────────────────┐
│                           HOMEPAGE                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────── HEADER ─────────────────────────┐
│                                                     │
│  [Logo]  Búsqueda [...]  [🔔]  [☰]                │
│  FutPro  ↓                 ↓     ↓                 │
│          • Filtra posts    • /notif...    • menuOpen
│          • En tiempo real  • Abre         • toggle
│          • setState        • notificaciones
│                                                     │
└──────────────────────────────────────────────────────┘

┌──────────────────── MENÚ HAMBURGUESA (cuando menuOpen=true) ─────────────────┐
│                                                                               │
│  GRID 4 COLUMNAS, 28 BOTONES                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ 👤 Perfil    │ │ 📊 Estadísticas│ │ 📅 Partidos  │ │ 🏆 Logros    │      │
│  │ /perfil/me   │ │ /estadisticas  │ │ /partidos    │ │ /logros      │      │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ 🆔 Tarjetas  │ │ 👥 Equipos   │ │ ➕ Crear Eq.  │ │ 🏆 Torneos   │      │
│  │ /tarjetas    │ │ /equipos     │ │ /crear-equipo│ │ /torneos     │      │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
│  ... (más 20 botones)                                                       │
│  ┌──────────────┐                                                           │
│  │ 🚪 Cerrar    │ ← ESPECIAL                                               │
│  │  localStorage.clear()                                                    │
│  │  sessionStorage.clear()                                                  │
│  │  /login                                                                  │
│  └──────────────┘                                                           │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘

┌──────────────── STORIES (Scroll horizontal) ─────────────┐
│                                                           │
│  [👤]  [👤]  [👤]  [👤]     →  scroll                   │
│  Lucia Mateo Sofia Leo FC      ↓                         │
│  console.log('Ver historia')   Sin navegación            │
│                                                           │
└───────────────────────────────────────────────────────────┘

┌─────────────────── FEED DE PUBLICACIONES ───────────────────────┐
│                                                                 │
│  POST 1: Lucia - Victoria 3-1                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ [Avatar] Lucia    Victoria 3-1  [Femenino][Sub18]     │   │
│  │ [Imagen 800x500]                                       │   │
│  │ "Gran partido hoy, seguimos sumando."                  │   │
│  │ ┌──────────────┬───────────────┬──────────────────┐   │   │
│  │ │ ⚽ 120       │ 💬 12         │ 📤 Compartir     │   │   │
│  │ │ onLike('p1') │ onComment('p1')│ console.log()   │   │   │
│  │ │ likes++      │ comments++     │ (sin nav)       │   │   │
│  │ │ 121          │ 13             │                 │   │   │
│  │ └──────────────┴───────────────┴──────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  POST 2: Leo FC - Nuevo fichaje                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ [Avatar] Leo FC   Nuevo fichaje [Mixto]               │   │
│  │ [Imagen 801x500]                                       │   │
│  │ "Bienvenido al equipo!"                                │   │
│  │ ┌──────────────┬───────────────┬──────────────────┐   │   │
│  │ │ ⚽ 85        │ 💬 9          │ 📤 Compartir     │   │   │
│  │ │ onLike('p2') │ onComment('p2')│ console.log()   │   │   │
│  │ │ likes++      │ comments++     │ (sin nav)       │   │   │
│  │ │ 86           │ 10             │                 │   │   │
│  │ └──────────────┴───────────────┴──────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────── BOTTOM NAVIGATION ─────────────────┐
│                                                    │
│  🏠 Home  │ 🛒 Market │ 🎥 Videos │ 🔔 Alertas │ 💬 Chat│
│  /        │ /marketplace│ /videos  │ /notif    │ /chat  │
│                                                    │
└────────────────────────────────────────────────────┘

┌──────────────── BOTÓN FLOTANTE ───────────┐
│                                            │
│                              [+]           │
│                         console.log()      │
│                                            │
└────────────────────────────────────────────┘
```

---

## 4️⃣ MAPA DE ESTADOS (useState)

```
HomePage:
  ├── search = '' 
  │   └── onChange barra búsqueda → setSearch(valor)
  │       └── Filtra filteredPosts
  │
  ├── likes = { p1: 120, p2: 85 }
  │   └── onClick ⚽ → setLikes({ ...prev, [id]: prev[id]++ })
  │       └── Incrementa contador en UI
  │
  ├── comments = { p1: 12, p2: 9 }
  │   └── onClick 💬 → setComments({ ...prev, [id]: prev[id]++ })
  │       └── Incrementa contador en UI
  │
  └── menuOpen = false
      └── onClick ☰ → setMenuOpen(!menuOpen)
          └── Muestra/oculta menú

LoginRegisterForm:
  ├── email = ''
  ├── password = ''
  ├── isRegister = false
  ├── loading = false
  ├── error = null
  ├── stepMsg = ''
  └── Navegaciones condicionadas por validaciones

SeleccionCategoria:
  ├── selected = null
  │   └── onClick categoría → setSelected(value)
  └── Confirmar → navigate('/formulario-registro?categoria=X')

FormularioRegistroCompleto:
  ├── pasoActual = 1
  │   ├── [Siguiente] → setPasoActual(2)
  │   ├── [Siguiente] → setPasoActual(3)
  │   └── [Anterior] → setPasoActual(pasoActual-1)
  │
  └── formData = { email, password, nombre, apellido, etc }
      └── onChange inputs → setFormData({...prev, field: value})

PerfilCard:
  ├── cardData = null (cargado con stub)
  ├── showAnimation = false → true
  └── Botones navegan a /home o /perfil/me
```

---

## 5️⃣ MAPA DE NAVEGACIONES

```
Rutas de ENTRADA (sin Layout):
  /login → LoginRegisterForm
  / → HomePage (ahora sin Layout también)
  /seleccionar-categoria → SeleccionCategoria
  /formulario-registro → FormularioRegistroCompleto
  /auth/callback → AuthCallback
  /perfil-card → PerfilCard

Rutas PRINCIPALES (con Layout - Sidebar + BottomNav):
  /feed → FeedPage
  /perfil/:userId → Perfil
  /notificaciones → Notificaciones
  /equipo/:id → EquipoDetallePage
  /torneo/:id → TorneoDetallePage
  /usuario/:id → UsuarioDetallePage
  /ranking → EstadisticasPage
  /progreso → Progreso
  /penaltis → Penaltis
  /historial-penaltis → HistorialPage
  /ayuda → PageInDevelopment
  /configuracion → ConfiguracionPage
  /compartir → PageInDevelopment
  /chat-sql → PageInDevelopment
  /logros → Logros
  /estadisticas-avanzadas → EstadisticasAvanzadasPage
  /comparativas → PageInDevelopment
  /editar-perfil → EditarPerfil
  /estadisticas → Estadisticas
  /partidos → Partidos
  /tarjetas → Tarjetas
  /equipos → Equipos
  /crear-equipo → CrearEquipo
  /torneos → Torneos
  /crear-torneo → CrearTorneo
  /amistoso → Amistoso
  /card-fifa → CardFIFA
  /sugerencias-card → SugerenciasCard
  /chat → Chat
  /videos → Videos
  /marketplace → Marketplace
  /estados → Estados
  /amigos → Amigos
  /transmision-en-vivo → TransmisionEnVivo
  /ranking-jugadores → RankingJugadores
  /ranking-equipos → RankingEquipos
  /buscar-ranking → BuscarRanking
  /configuracion → Configuracion
  /soporte → Soporte
  /privacidad → Privacidad

Ruta CATCH-ALL:
  * → NotFoundPage

Total: 60+ rutas documentadas
```

---

## 6️⃣ MAPA RÁPIDO - BÚSQUEDA DE FUNCIONES

```
¿Quiero ir a...?

Videos tipo TikTok          → /videos
Marketplace (compra/venta)  → /marketplace
Chat en tiempo real         → /chat
Transmisión en vivo         → /transmision-en-vivo
Rankings/Leaderboard        → /ranking-jugadores, /ranking-equipos
Hacer like/comentar         → HomePage (feed)
Ver perfil                  → /perfil/me
Estadísticas               → /estadisticas
Mis partidos               → /partidos
Mis logros                 → /logros
Crear equipo               → /crear-equipo
Crear torneo               → /crear-torneo
Jugar penaltis             → /penaltis
Ver mi card FIFA           → /card-fifa
Notificaciones             → /notificaciones
Configurar cuenta          → /configuracion
Cerrar sesión              → Menú hamburguesa → 🚪 Cerrar sesión
```

---

## 7️⃣ MATRIZ DE CLICK → ACCIÓN

```
╔═══════════════════╦════════════════════╦═════════════════╦════════════════╗
║ ELEMENTO          ║ EVENTO             ║ ACCIÓN          ║ RESULTADO      ║
╠═══════════════════╬════════════════════╬═════════════════╬════════════════╣
║ Logo              ║ onClick            ║ navigate('/')   ║ Va a home      ║
║ Búsqueda          ║ onChange           ║ setSearch()     ║ Filtra posts   ║
║ 🔔 Notificaciones ║ onClick            ║ navigate()      ║ Va a /notif    ║
║ ☰ Menú            ║ onClick            ║ setMenuOpen()   ║ Abre/cierra    ║
║ [28 Botones]      ║ onClick (c/u)      ║ navigate()      ║ Va a /ruta     ║
║ Stories           ║ onClick            ║ console.log()   ║ Sin navegación ║
║ ⚽ Like            ║ onClick            ║ setLikes()      ║ Contador ++    ║
║ 💬 Comentar       ║ onClick            ║ setComments()   ║ Contador ++    ║
║ 📤 Compartir      ║ onClick            ║ console.log()   ║ Sin navegación ║
║ Bottom nav (5)    ║ onClick (c/u)      ║ navigate()      ║ Va a /ruta     ║
║ [+] FAB           ║ onClick            ║ console.log()   ║ Sin navegación ║
╚═══════════════════╩════════════════════╩═════════════════╩════════════════╝
```

---

## 8️⃣ RESUMEN DE TECLAS/ACCIONES

```
AUTENTICACIÓN
  • Email + Password + [Login] → Valida → /home
  • Email + Password + [Registrarse] → Valida → /seleccionar-categoria
  • [Google OAuth] → Autentica → /perfil-card → /home

HOMEPAGE - BÚSQUEDA
  • Escribir "victoria" → Filtra posts con ese término
  • Escribir "leo" → Filtra posts de ese usuario
  • Borrar → Muestra todos los posts

HOMEPAGE - ACCIONES
  • Click Like → likes['p1'] incrementa
  • Click Like varias veces → Puede llegar a 150+
  • Click Comentar → comments['p1'] incrementa
  • Click Compartir → Abre opciones (pendiente)

NAVEGACIÓN
  • Click cualquier botón menú → navigate() a su ruta
  • Click bottom nav → navigate() a su ruta
  • Click logo → navigate('/') (home)

ESPECIAL
  • Click Cerrar Sesión → localStorage.clear() + sessionStorage.clear() + /login
```

---

**Tipo de mapas incluidos:**
1. ✅ Árbol de navegación completo
2. ✅ Flowchart de usuario nuevo
3. ✅ Mapa detallado de Homepage
4. ✅ Mapa de estados (useState)
5. ✅ Mapa de rutas
6. ✅ Búsqueda rápida
7. ✅ Matriz de click → acción
8. ✅ Resumen de teclas

**Total:** 50+ elementos mapeados visualmente
