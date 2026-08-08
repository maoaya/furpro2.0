# 📋 INVENTARIO COMPLETO DEL PROYECTO FUTPRO 2.0
**Fecha**: 17 de enero de 2026 | **Estado**: Completo sin nuevos archivos, solo wiring

---

## 🔐 FLUJO DE AUTENTICACIÓN (SIN LAYOUT)

### 1️⃣ **LoginPage** 
- **Ruta**: `/login` (excluida de layout)
- **Archivo**: `src/pages/LoginPage.jsx`
- **Función**: Login con email/contraseña
- **Botones**:
  - 🔑 "Iniciar Sesión"
  - 👤 "¿No tienes cuenta? Regístrate"
  - 🔄 "Olvidé contraseña"
  - 🌐 "Continuar con Google"
- **Datos guardados**: Email, contraseña (Firebase Auth + Supabase)
- **Validación**: Email único en auth.users (Supabase Auth)
- **Redirige a**: HomePage si login es exitoso

### 2️⃣ **FormularioRegistroCompleto**
- **Ruta**: `/registro` (excluida de layout)
- **Archivo**: `src/pages/FormularioRegistroCompleto.jsx`
- **Función**: Registro de usuario con 3 pasos
- **Paso 1 - Datos básicos**:
  - Email (validación única)
  - Contraseña
  - Confirmación contraseña
- **Paso 2 - Perfil**:
  - Nombre
  - Apellido
  - Edad (int)
  - Ciudad/Ubicación (string con precisión geográfica)
  - País
  - Foto de perfil (upload a `avatars` bucket)
- **Paso 3 - Tipo de usuario**:
  - ✅ Jugador (positions: Portero, Defensa, Centrocampista, Delantero)
  - ✅ Árbitro (positions: Principal, Asistente, Cuarto Árbitro) **[FALTA: Agregar opción]**
  - ✅ Organizador (tournaments_created: int)
  - ✅ Patrocinador (company_name: string)
- **Campos adicionales si Árbitro**:
  - Certificación (select/upload documento)
  - Experiencia años (int)
  - Especialidad torneo (select categorías)
  - Disponibilidad (select días/horarios)
  - **[FALTA: Estos campos no existen en el formulario]**
- **Validación**: 
  - Email único (Supabase Auth)
  - **[FALTA: Validar no duplicados]**
  - Edad >= 12, <= 80
  - Ciudad/País válidos
- **Guardado**: 
  - `auth.users` (email, password)
  - `usuarios` tabla (nombre, apellido, edad, ciudad, país, avatar_url, role)
  - **[FALTA: Campos de árbitro en tabla usuarios]**
- **Botones**:
  - ➡️ "Siguiente"
  - ⬅️ "Atrás"
  - ✅ "Finalizar Registro"
  - 🔗 "¿Ya tienes cuenta? Inicia Sesión"

### 3️⃣ **AuthCallback**
- **Ruta**: `/auth/callback`
- **Archivo**: `src/pages/auth/AuthCallback.jsx`
- **Función**: Manejo de OAuth redirect (Google, GitHub, etc.)
- **Operación**: Verifica token, crea/actualiza usuario en `usuarios` tabla
- **Redirige a**: HomePage si exitoso, `/login` si falla

---

## 📱 LAYOUT PRINCIPAL (MainLayout + BottomNav + TopNav)
**Archivos**: `src/components/MainLayout.jsx`, `src/components/TopNav.jsx`, `src/components/BottomNav.jsx`

### Estructura:
```
┌─────────────────────────────┐
│      TopNav (barra top)     │  - Logo FutPro, Búsqueda, Notificaciones
├─────────────────────────────┤
│                             │
│   PÁGINA ACTIVA (Router)    │  - Contenido dinámico
│                             │
├─────────────────────────────┤
│    BottomNav (menú fijo)    │  - 31 opciones (ver detalles abajo)
└─────────────────────────────┘
```

---

## 🏠 PÁGINA PRINCIPAL: HomePage
- **Ruta**: `/` (home)
- **Archivo**: `src/pages/HomePage.jsx`
- **Función**: Feed principal con acciones rápidas, historias, posts, menú hamburguesa

### 📊 Secciones:
1. **Historias (Stories)**
   - Mostrar: historias activas 24h de usuarios seguidos
   - Crear: botón "Añadir Historia" → `/subir-historia`
   - Ver: click en historia → modal fullscreen
   - **Datos**: tabla `user_stories` (user_id, content_url, created_at, expires_at)
   - **Vista**: vista `v_active_stories` (solo < 24h)

2. **Feed de Posts**
   - Mostrar: posts de usuarios seguidos con:
     - ✅ Foto de usuario (avatar_url)
     - ✅ Nombre y Apellido (usuarios.nombre, usuarios.apellido)
     - ✅ Card FIFA si existe (card_id)
     - ✅ Contenido (posts.content)
     - ✅ Imagen/Video (posts.image_url)
     - ✅ Likes, comentarios, compartir
   - Crear: botón "📸 Nueva Publicación" → formulario o cámara
   - Like: corazón clickeable → `post_likes` tabla
   - Comentar: modal comentarios → `post_comments` tabla
   - **Datos**: tabla `posts`, vista `v_feed_posts` (ordenado por fecha)

3. **Menú Hamburguesa (31 opciones)**
   ```
   👤 Mi Perfil              → /perfil/me
   📊 Mis Estadísticas       → /estadisticas
   📅 Mis Partidos           → /partidos
   🏆 Mis Logros             → /logros
   🆔 Mis Tarjetas           → /tarjetas
   👥 Ver Equipos            → /equipos
   ➕ Crear Equipo           → /crear-equipo
   🏆 Ver Torneos            → /torneos
   ➕ Crear Torneo           → /crear-torneo
   🤝 Crear Amistoso         → /amistoso
   ⚽ Juego de Penaltis       → /penaltis
   ⚽ Penaltis PvP            → /penalty-pvp  [NUEVO - Conectado ✅]
   🆔 Card Futpro            → /card-fifa
   💡 Sugerencias Card       → /sugerencias-card
   🔔 Notificaciones         → /notificaciones
   💬 Chat                   → /chat
   🎥 Videos                 → /videos
   🏪 Marketplace            → /marketplace
   📋 Estados                → /estados
   👫 Seguidores             → /amigos
   📡 Transmitir en Vivo      → /transmision-en-vivo [NUEVO - Conectado ✅]
   📊 Ranking Jugadores      → /ranking-jugadores
   📈 Ranking Equipos        → /ranking-equipos
   🔍 Buscar Ranking         → /buscar-ranking
   🔧 Configuración          → /configuracion
   🆘 Soporte                → /soporte
   🛡️ Privacidad             → /privacidad
   🚪 Cerrar Sesión          → logout (localStorage.clear())
   ```

4. **Acciones de Usuario (todas deben mostrar en Momentos - Ver sección abajo)**
   - 📸 Subir historia
   - 📝 Crear publicación
   - ⚽ Crear partido amistoso
   - 🏆 Crear torneo
   - ⚽ Jugar penaltis
   - 💬 Enviar mensaje
   - 📡 Transmitir en vivo
   - ❤️ Dar like a post
   - 💬 Comentar post
   - 👥 Seguir/dejar de seguir
   - 🎯 Invitar a equipos/torneos

### 🔍 Barra de Búsqueda (TopNav)
- **Busca**: Equipos, Usuarios, Partidos
- **Campos**: nombre, edad, ciudad, ubicación
- **Tabla usada**: `equipos`, `usuarios`, `tournament_matches`
- **Visualización**: dropdown con resultados en tiempo real
- **[FALTA: Implementar búsqueda completa con filtros]**

---

## 👤 PÁGINAS DE PERFIL (SIN LAYOUT)

### 4️⃣ **PerfilCard / CardFIFA**
- **Ruta**: `/card-fifa` → `/perfil-card` (¿cuál es correcta?)
- **Archivos**: `src/pages/CardFIFA.jsx`, `src/pages/PerfilCard.jsx`
- **Función**: Mostrar card FIFA del usuario con stats personalizadas
- **Datos mostrados**:
  - Foto (avatar_url)
  - Nombre/Apellido
  - Edad
  - Posición jugador
  - Stats: Pace, Shooting, Passing, Dribbling, Defense, Physical
  - Overall rating (calculado de stats)
  - Club/Equipo actual
- **Botones**:
  - 🔄 "Actualizar Card" → `/sugerencias-card`
  - 🖼️ "Ver en galería"
  - 📤 "Compartir"
  - ← "Atrás"
- **Datos**: tabla `usuarios` (stats), tabla `cards` (general)
- **[PROBLEMA ACTUAL: Rutas inconsistentes/sin conexión]**

### 5️⃣ **EditarPerfil / PerfilNuevo / PerfilInstagram**
- **Rutas**: `/perfil/me`, `/perfil/editar`, `/perfil/:id`
- **Archivos**: `src/pages/EditarPerfil.jsx`, `src/pages/PerfilNuevo.jsx`, `src/pages/PerfilInstagram.jsx`
- **Función**: Ver y editar perfil de usuario
- **Datos mostrados**:
  - Avatar (foto de perfil)
  - Nombre/Apellido
  - Edad
  - Ciudad/País
  - Bio
  - Equipos (team_members.team_id)
  - Estadísticas totales
  - Posts recientes
  - Logros
  - Seguidores/Siguiendo (followers tabla)
- **Edición**:
  - ✏️ Cambiar foto
  - ✏️ Cambiar nombre/apellido
  - ✏️ Cambiar bio
  - ✏️ Cambiar ciudad/país
- **Botones**:
  - 💾 "Guardar cambios"
  - 👥 "Seguir/Dejar de Seguir"
  - 💬 "Enviar mensaje"
  - ⚙️ "Editar perfil" (si es tu perfil)

### 6️⃣ **SugerenciasCard**
- **Ruta**: `/sugerencias-card`
- **Archivo**: `src/pages/SugerenciasCard.jsx`
- **Función**: Mejorar stats de card FIFA
- **Operación**: Sugerir mejoras en Pace, Shooting, etc. basadas en desempeño
- **Datos**: tabla `card_suggestions` (user_id, suggestions_json, status)
- **Botones**:
  - ✅ "Aplicar mejoras"
  - ❌ "Rechazar"

---

## ⚽ EQUIPOS

### 7️⃣ **CrearEquipo**
- **Ruta**: `/crear-equipo`
- **Archivo**: `src/pages/CrearEquipo.jsx`
- **Función**: Crear nuevo equipo
- **Formulario**:
  - Nombre equipo
  - **[FALTA: Categoría (Sub-13, Sub-17, Adulto, etc.)]**
  - Ubicación (ciudad, país)
  - **[FALTA: Precisión geográfica (municipio, sector)]**
  - Logo (upload)
  - **[FALTA: Crear card del equipo como FIFA]**
- **Guardar**: tabla `equipos` (name, location, country, logo_url, creator_id)
- **Botones**:
  - ✅ "Crear Equipo"
  - ❌ "Cancelar"
- **Redirige a**: `/equipos/:id` después de crear

### 8️⃣ **Equipos (Ver Equipos)**
- **Ruta**: `/equipos`
- **Archivo**: `src/pages/Equipos.jsx`
- **Función**: Listar todos los equipos
- **Filtros**: 
  - Por ubicación (city, country)
  - Por categoría
  - **[FALTA: Implementar filtros avanzados]**
- **Visualización**: Grid de tarjetas de equipos
- **Botones en cada equipo**:
  - 👁️ "Ver equipo" → `/equipos/:id`
  - ➕ "Solicitar unirse"
  - ♥️ "Favorito"

### 9️⃣ **EquipoDetallePage**
- **Ruta**: `/equipos/:equipoId`
- **Archivo**: `src/pages/EquipoDetallePage.jsx`
- **Función**: Ver detalles del equipo
- **Pestañas**:
  - **Información**:
    - Nombre, logo, ubicación, creador, fecha creación
    - Membresía: X jugadores
  - **Plantilla** (como FIFA):
    - Mostrar: lista de jugadores con posiciones
    - **[FALTA: Vista tipo formación FIFA 4-3-3, etc.]**
    - Columnas: nombre, posición, overall, edad
  - **Partidos/Torneos**: historial de participaciones
  - **Estadísticas**: stats agregadas del equipo
- **Botones**:
  - 👥 "Ver Plantilla" → `/equipos/:id/plantilla`
  - ➕ "Convocar Jugadores" → `/equipos/:id/convocar`
  - 👨‍💼 "Nombrar Presidente" (si es admin)
  - **[FALTA: Opciones de presidente]**
  - ⚙️ "Editar" (si es admin) → `/equipos/:id/editar`
  - 📊 "Ver Estadísticas"
- **Datos**: tabla `equipos`, tabla `team_members` (players), tabla `team_staff`

### 🔟 **PlantillaEquipo**
- **Ruta**: `/equipos/:equipoId/plantilla`
- **Archivo**: `src/pages/PlantillaEquipo.jsx`
- **Función**: Ver plantilla completa con formación FIFA
- **Visualización**:
  - Formación seleccionable (4-3-3, 4-2-4, 3-5-2, etc.)
  - Jugadores posicionados en cancha
  - **[FALTA: Implementar vista visual tipo FIFA]**
- **Datos**: tabla `team_members` + tabla `usuarios` (stats)
- **Botones**:
  - 🔄 "Cambiar Formación"
  - ➕ "Agregar Jugador" (si admin)
  - ❌ "Remover Jugador" (si admin)

### 1️⃣1️⃣ **ConvocarJugadores**
- **Ruta**: `/equipos/:equipoId/convocar` o `/convocar-jugadores`
- **Archivo**: `src/pages/ConvocarJugadores.jsx`
- **Función**: Invitar jugadores al equipo
- **Búsqueda**: Por edad, ciudad, posición, habilidad
- **Operación**:
  - Seleccionar jugadores
  - Enviar invitación (tabla `team_invitations`)
  - Notificar usuario (tabla `notifications`)
- **Datos**: tabla `usuarios`, tabla `team_members`, tabla `team_invitations`
- **Botones**:
  - 🔍 "Buscar Jugadores"
  - ✅ "Enviar Invitaciones"
  - ❌ "Cancelar"

---

## 🏆 TORNEOS

### 1️⃣2️⃣ **CrearTorneo / CrearTorneoAvanzado / CrearTorneoCompleto**
- **Ruta**: `/crear-torneo`
- **Archivos**: `src/pages/CrearTorneo.jsx`, `src/pages/CrearTorneoAvanzado.jsx`, `src/pages/CrearTorneoCompleto.jsx`
- **Función**: Crear torneo completo con todas las opciones
- **Formulario**:
  - Nombre torneo
  - Descripción
  - **Categoría**: Masculino, Femenino, Mixto, Sub-13, Sub-15, Sub-17, Sub-20, Libre, Veteranos, Amateur, Profesional ✅
  - Edad: mínima, máxima
  - Máximo equipos
  - Máximo jugadores por equipo
  - Ubicación (city, country, **[FALTA: municipio]**)
  - **Inscripción**:
    - Tipo: Gratuita / De pago
    - Monto (si de pago)
    - Moneda (USD, EUR, COP, ARS, MXN, etc.)
  - **Formato**:
    - League (todos vs todos)
    - Knockout (eliminación)
    - Group+Knockout (grupos + fase final)
    - Repechaje (segundos juegan repechaje)
    - Sudden Death ✅
  - **Sistema de puntos**:
    - Estándar: Victoria 3, Empate 1, Derrota 0
    - Sin empates: Penaltis si empate (Victoria 2, Derrota 1, Ganador penaltis +1)
  - **Transmisión**: ¿Obligatoria?
  - Fechas: inicio, fin
  - Reglas (texto libre)
- **Validación**: 
  - Equipos >= 2
  - Jugadores >= 5
  - Fechas válidas
- **Guardado**: tabla `tournaments` (name, category, min_age, max_age, location, country, registration_fee, tournament_format, playoff_type, is_live_required, creator_id)
- **Botones**:
  - ✅ "Crear Torneo"
  - ❌ "Cancelar"
- **Redirige a**: `/torneos/:id` después de crear

### 1️⃣3️⃣ **Torneos (Ver Torneos)**
- **Ruta**: `/torneos`
- **Archivo**: `src/pages/Torneos.jsx` o `src/pages/TorneosPage.jsx`
- **Función**: Listar todos los torneos disponibles
- **Filtros**:
  - Por categoría
  - Por ubicación
  - Por estado (abiertos, en progreso, finalizados)
  - **[FALTA: Implementar filtros completos]**
- **Visualización**: Grid de tarjetas de torneos
- **Botones en cada torneo**:
  - 👁️ "Ver torneo" → `/torneos/:id`
  - ✅ "Registrarse"
  - ❌ "Cancelar registro"

### 1️⃣4️⃣ **TorneoDetalleCompleto**
- **Ruta**: `/torneos/:torneoId`
- **Archivo**: `src/pages/TorneoDetalleCompleto.jsx` ✅ [NUEVO - IMPLEMENTADO]
- **Función**: Ver detalles completos del torneo
- **Pestañas**:
  - **Información**: name, category, dates, location, rules, format
  - **Equipos Registrados**: lista con estado (aceptado, pendiente, pagado)
  - **Partidos**: calendario de partidos con resultados (si finalizados)
  - **Sanciones**: lista de tarjetas/suspensiones disciplinarias
- **Botones** (si es creador):
  - 📧 "Invitar Equipos" → modal con búsqueda por ubicación
  - 🎲 "Generar Grupos" (cuando está lleno)
  - ✏️ "Editar" → `/torneos/:id/editar`
- **Invitaciones**:
  - Busca equipos por `location`
  - Envía invitaciones (tabla `tournament_invitations`)
  - Notifica capitanes (tabla `notifications`)
- **Auto-grupos**:
  - Llama `TournamentService.generateGroups()`
  - Crea grupos A, B, C, D (serpenteo de equipos)
  - Distribuye en `tournament_group_teams`
- **Datos**: tabla `tournaments`, `tournament_registrations`, `tournament_matches`, `disciplinary_sanctions`

### 1️⃣5️⃣ **PartidoArbitroPanel**
- **Ruta**: `/partidos/:partidoId/arbitro`
- **Archivo**: `src/pages/PartidoArbitroPanel.jsx` ✅ [NUEVO - IMPLEMENTADO]
- **Función**: Panel para árbitros registrar resultados y sanciones
- **Pestañas**:
  - **Registrar Resultado**:
    - Goles local
    - Goles visitante
    - ¿Penaltis? Sí/No
    - Si penaltis: goles penaltis local, goles penaltis visitante
    - Cálculo automático de puntos (TournamentService.calculatePoints)
    - Actualización de tabla posiciones
    - Notificaciones a capitanes
  - **Registrar Sanción**:
    - Seleccionar equipo (local/visitante)
    - Seleccionar jugador (dropdown con team_members)
    - Tipo: Tarjeta Amarilla, Roja, Suspensión 1/2/3/4, Expulsión
    - Minuto del incidente
    - Razón
    - Descripción detallada
    - Guarda en `disciplinary_sanctions`
    - Notifica al jugador
- **Permisos**: Solo árbitro asignado o creador torneo
- **Botones**:
  - 💾 "Guardar Resultado"
  - ⚠️ "Registrar Sanción"
  - ← "Atrás"
- **Datos**: tabla `tournament_matches`, `disciplinary_sanctions`, tabla `usuarios`

---

## ⚽ PENALTIS

### 1️⃣6️⃣ **Penaltis (Individual)**
- **Ruta**: `/penaltis`
- **Archivo**: `src/pages/Penaltis.jsx`
- **Función**: Juego individual contra IA
- **Modo**: 5 penaltis (tira usuario, guarda IA)
- **Mecanismo**:
  - Usuario selecciona dirección (izq, centro, dch)
  - Usuario selecciona potencia (slider 0-100%)
  - Probabilidad gol: 50% + (potencia/200)
  - IA "guarda" aleatoriamente
- **Score**: contador de goles x 5 disparos
- **Botones**:
  - 🎯 "Disparar"
  - 🔄 "Juego Nueva"
  - ← "Atrás"

### 1️⃣7️⃣ **PenaltyGamePvP / PenaltisMultijugador**
- **Ruta**: `/penalty-pvp`
- **Archivo**: `src/pages/PenaltyGamePvP.jsx` ✅ [NUEVO - IMPLEMENTADO]
- **Función**: Juego PvP entre usuarios
- **Modos**:
  - **Menú**: crear match o listar matches disponibles
  - **Waiting**: esperar a que otro usuario se una
  - **Playing**: turnos alternados (dirección + potencia)
  - **Finished**: resultado (ganador/perdedor)
- **Mecánica**:
  - 5 disparos por jugador (10 total)
  - Turnos alternados
  - Realtime con Supabase channels
  - Ganador: quien más goles después de 5
- **Funciones usadas**:
  - `createPenaltyMatch(player1_id, null, 'pvp', difficulty)`
  - `joinPenaltyMatch(match_id, player2_id)`
  - `recordPenaltyShot(match_id, player_id, isGoal, direction, power)`
- **Datos**: tabla `penalty_matches`, suscripción realtime
- **Botones**:
  - ➕ "Crear Match"
  - ➕ "Unirse a Match"
  - 🎯 "Disparar"
  - 🏠 "Volver al menú"

---

## 💬 CHAT Y COMUNICACIÓN

### 1️⃣8️⃣ **ChatInstagramNew**
- **Ruta**: `/chat` o `/chat/:conversationId`
- **Archivo**: `src/pages/ChatInstagramNew.jsx` ✅ [NUEVO - IMPLEMENTADO]
- **Función**: Chat tipo Instagram con conversaciones en tiempo real
- **Funcionalidad**:
  - **Lista de conversaciones**:
    - Mostrar última conversación
    - Indicador "online/offline"
    - Indicador "no leído"
  - **Detalles de conversación**:
    - Mensajes en tiempo real
    - Indicador de "escribiendo"
    - Marcas de lectura (✓, ✓✓)
    - Eliminación de mensajes (su own messages)
  - **Realtime**: Supabase `chat_conversations` channel
- **Botones**:
  - ➕ "Nueva conversación"
  - 🔍 "Buscar contactos"
  - 📱 "Ver perfil"
  - 🚫 "Bloquear usuario"
- **Datos**: tabla `chat_conversations`, `chat_messages`, tabla `usuarios`

---

## 📺 TRANSMISIÓN EN VIVO

### 1️⃣9️⃣ **TransmisionEnVivo**
- **Ruta**: `/transmision-en-vivo`
- **Archivo**: `src/pages/TransmisionEnVivo.jsx` ✅ [NUEVO - IMPLEMENTADO]
- **Función**: Transmitir en vivo desde cámara o URL externa
- **Modos**:
  - **Configuración**: título, URL externa (opcional), ID partido (opcional)
  - **En vivo**: video, contador espectadores, chat en vivo
- **Captura**: `navigator.mediaDevices.getUserMedia()`
- **Guardado**: tabla `live_streams` (stream_id, host_id, title, status, viewer_count)
- **Realtime**: Supabase Presence para contar espectadores
- **Botones**:
  - 🎥 "Iniciar Transmisión"
  - ⏹️ "Detener Transmisión"
  - 📱 "Compartir stream"
  - 💬 "Chat"
- **Datos**: tabla `live_streams`

---

## 🤝 AMISTOSOS

### 2️⃣0️⃣ **Amistoso (Crear/Participar)**
- **Ruta**: `/amistoso`
- **Archivo**: `src/pages/Amistoso.jsx`
- **Función**: Crear y participar en partidos amistosos
- **Formulario crear**:
  - Fecha/hora
  - Ubicación
  - Tipo: Usuario vs Usuario, Equipo vs Equipo
  - **[FALTA: Búsqueda por ubicación de usuarios/equipos disponibles]**
  - **[FALTA: Sistema de convocar]**
- **Listado**:
  - Mostrar amistosos disponibles por ubicación
  - Buscar por proximidad
- **Botones**:
  - ➕ "Crear Amistoso"
  - ✅ "Confirmar asistencia"
  - ❌ "Cancelar asistencia"
  - 👁️ "Ver detalles"
- **Datos**: tabla `friendly_matches` (user1_id, user2_id, team1_id, team2_id, location, date, status)

---

## 📊 RANKINGS Y ESTADÍSTICAS

### 2️⃣1️⃣ **RankingJugadoresCompleto**
- **Ruta**: `/ranking-jugadores`
- **Archivo**: `src/pages/RankingJugadoresCompleto.jsx`
- **Función**: Ranking de jugadores con filtros
- **Filtros**:
  - Por categoría (jugador, árbitro, organizador)
  - Por edad
  - Por equipo
  - **[FALTA: Implementar filtros avanzados]**
  - **[FALTA: Mostrar árbitros]**
- **Columnas**: nombre, overall, edad, posición, equipo, goles/asistencias, puntos torneo
- **Datos**: tabla `usuarios`, tabla `tournament_standings`, tabla `player_stats`

### 2️⃣2️⃣ **RankingEquiposCompleto**
- **Ruta**: `/ranking-equipos`
- **Archivo**: `src/pages/RankingEquiposCompleto.jsx`
- **Función**: Ranking de equipos
- **Filtros**:
  - Por ubicación
  - Por categoría
  - Por torneo
- **Columnas**: nombre equipo, partidos jugados, victorias, empates, derrotas, goles, puntos
- **Datos**: tabla `equipos`, tabla `tournament_standings`, tabla `team_stats`

### 2️⃣3️⃣ **BuscarRanking**
- **Ruta**: `/buscar-ranking`
- **Archivo**: `src/pages/BuscarRanking.jsx`
- **Función**: Búsqueda general de rankings
- **Búsqueda**: nombre usuario, nombre equipo, ubicación
- **Resultados**: mostrar en tabs (Jugadores, Equipos, Torneos)

---

## 📸 MOMENTOS / HISTORIAS

### 2️⃣4️⃣ **SubirHistoria**
- **Ruta**: `/subir-historia`
- **Archivo**: `src/pages/SubirHistoria.jsx`
- **Función**: Crear historias (fotos/videos 24h)
- **Captura**: cámara o galería
- **Guardado**: tabla `user_stories` (user_id, content_url, created_at, expires_at)
- **Storage**: `stories` bucket
- **Botones**:
  - 📸 "Tomar foto"
  - 🎥 "Grabar video"
  - 🖼️ "Galería"
  - ✅ "Publicar"
  - ❌ "Cancelar"

### 2️⃣5️⃣ **Momentos (Vista)**
- **Ubicación**: HomePage o sección dedicada
- **Función**: Ver historias de usuarios seguidos
- **Restricción**: ✅ **Solo mostrar fotos/videos que el usuario subió directamente**
  - NO mostrar: acciones (likes, comentarios, follows)
  - Solo mostrar: `user_stories` creadas por el usuario
- **Datos**: tabla `user_stories`, vista `v_active_stories`

---

## 🛍️ MARKETPLACE

### 2️⃣6️⃣ **MarketplaceCompleto**
- **Ruta**: `/marketplace`
- **Archivo**: `src/pages/MarketplaceCompleto.jsx`
- **Función**: Comprar/vender equipamiento
- **Categorías**: equipamiento, uniformes, accesorios, servicios
- **Datos**: tabla `marketplace_items` (name, price, description, seller_id, image_url)
- **Botones**:
  - 🛒 "Agregar al carrito"
  - 💳 "Comprar"
  - ➕ "Crear anuncio"
  - ❤️ "Favorito"

---

## 📽️ VIDEOS

### 2️⃣7️⃣ **VideosFeed**
- **Ruta**: `/videos`
- **Archivo**: `src/pages/VideosFeed.jsx`
- **Función**: Feed de videos de usuarios
- **Datos**: tabla `videos` (user_id, video_url, title, description, created_at)
- **Botones**:
  - ▶️ "Reproducir"
  - ❤️ "Like"
  - 💬 "Comentar"
  - 📤 "Compartir"

---

## 📝 OTROS

### 2️⃣8️⃣ **Notificaciones**
- **Ruta**: `/notificaciones`
- **Archivo**: `src/pages/Notificaciones.jsx`
- **Función**: Ver todas las notificaciones
- **Tipos**: torneo_invitacion, match_result, sanction, follow, like, comment, message
- **Datos**: tabla `notifications` (user_id, type, title, message, data, read_at)
- **Botones**:
  - ✓ "Marcar como leído"
  - 🗑️ "Eliminar"
  - 👁️ "Ver detalles"

### 2️⃣9️⃣ **Estados (Social Media)**
- **Ruta**: `/estados`
- **Archivo**: `src/pages/Estados.jsx`
- **Función**: Estados de WhatsApp-style (texto/foto)
- **Duración**: 24h
- **Datos**: tabla `status_updates` (user_id, content, created_at, expires_at)

### 3️⃣0️⃣ **Amigos / Seguidos**
- **Ruta**: `/amigos`
- **Archivo**: `src/pages/Amigos.jsx`
- **Función**: Ver seguidores y siguiendo
- **Datos**: tabla `followers` (follower_id, following_id, created_at)
- **Botones**:
  - 👤 "Seguir/Dejar de Seguir"
  - 💬 "Enviar mensaje"
  - 👁️ "Ver perfil"

### 3️⃣1️⃣ **Configuración**
- **Ruta**: `/configuracion`
- **Archivo**: `src/pages/ConfiguracionPage.jsx`
- **Función**: Ajustes de cuenta
- **Opciones**:
  - 📧 Cambiar email
  - 🔐 Cambiar contraseña
  - 🔔 Notificaciones
  - 🌙 Tema oscuro/claro
  - 🗑️ Eliminar cuenta
- **Botones**:
  - 💾 "Guardar"
  - ❌ "Cancelar"

---

## 🔴 PROBLEMAS DETECTADOS

### ❌ **CardFIFA - Rutas inconsistentes**
- Archivo 1: `src/pages/CardFIFA.jsx` (ruta `/card-fifa`)
- Archivo 2: `src/pages/PerfilCard.jsx` (ruta `/perfil-card`)
- **[NECESITA]: Unificar ruta y archivo, usar una sola versión**

### ❌ **Registro - Falta posición de Árbitro**
- Paso 3 solo tiene: Jugador, Organizador, Patrocinador
- **[NECESITA]: Agregar opción "Árbitro" con campos:**
  - Certificación (upload)
  - Experiencia (años)
  - Especialidad (categorías)
  - Disponibilidad (horarios)

### ❌ **Búsqueda - No implementada**
- TopNav tiene input pero sin funcionalidad
- **[NECESITA]: Buscar equipos, usuarios, partidos por nombre/ubicación/edad**

### ❌ **Amistosos - Sin convocar**
- Página existe pero sin función de convocar jugadores/equipos
- **[NECESITA]: Sistema de invitaciones como torneos**

### ❌ **Plantilla - Sin vista FIFA**
- Existe pero sin visualización de formación
- **[NECESITA]: Vista tipo formación 4-3-3 con jugadores posicionados**

### ❌ **Momentos - Mostrando todo**
- Actualmente muestra todas las acciones de usuarios
- **[CORRECCIÓN SOLICITADA]: Solo mostrar fotos/videos que subió directamente**

### ❌ **Email Único - No validado**
- Formulario permite crear múltiples cuentas con el mismo email
- **[NECESITA]: Validación en AuthService.signUpWithEmail()**

### ❌ **Ubicación - Muy genérica**
- Solo city/country, sin municipio/sector
- **[NECESITA]: Agregar campos geográficos más precisos**

---

## ✅ NUEVAS FUNCIONALIDADES IMPLEMENTADAS

- ✅ **Chat Instagram** (`ChatInstagramNew.jsx` → `/chat`)
- ✅ **Penaltis PvP** (`PenaltyGamePvP.jsx` → `/penalty-pvp`)
- ✅ **Transmisión en Vivo** (`TransmisionEnVivo.jsx` → `/transmision-en-vivo`)
- ✅ **Detalle Torneo Completo** (`TorneoDetalleCompleto.jsx` → `/torneos/:id`)
  - Invitaciones a equipos
  - Generar grupos automáticos
- ✅ **Panel Árbitro** (`PartidoArbitroPanel.jsx` → `/partidos/:id/arbitro`)
  - Registrar resultados
  - Registrar sanciones disciplinarias
- ✅ **SQL Sanciones** (DISCIPLINARY_SANCTIONS.sql)
  - Tabla disciplinary_sanctions
  - Vista v_suspended_players
  - Función is_player_suspended()

---

## 📦 TABLAS SQL PRINCIPALES

```
auth.users                     # Autenticación Supabase
├─ id (UUID)
├─ email (unique)
├─ password_hash
├─ created_at

usuarios                       # Perfil usuario
├─ id (UUID, FK auth.users)
├─ nombre, apellido
├─ edad, ciudad, país
├─ avatar_url
├─ role (jugador, árbitro, organizador, patrocinador)
├─ meta_data JSON (stats)

equipos                        # Equipos
├─ id, name, logo_url
├─ location, country, category
├─ creator_id (FK usuarios)

team_members                   # Jugadores en equipo
├─ id, team_id (FK), user_id (FK)
├─ position, shirt_number, role (captain, player, staff)

tournaments                    # Torneos
├─ id, name, category
├─ location, country
├─ min_age, max_age
├─ registration_fee, currency
├─ tournament_format, playoff_type
├─ is_live_required, status

tournament_registrations       # Inscripción equipo a torneo
├─ id, tournament_id (FK), team_id (FK)
├─ status (pending, accepted, paid)

tournament_matches             # Partidos torneo
├─ id, tournament_id (FK)
├─ home_team_id, away_team_id (FK)
├─ home_score, away_score
├─ status (scheduled, in_progress, finished)
├─ stream_id (FK live_streams)

disciplinary_sanctions         # Sanciones
├─ id, tournament_id (FK)
├─ player_id (FK), team_id (FK)
├─ sanction_type (yellow_card, red_card, ban, expulsion)
├─ status (active, appealed, suspended, lifted)

posts                          # Publicaciones
├─ id, user_id (FK)
├─ content, image_url
├─ created_at

post_likes                     # Likes
├─ id, post_id (FK), user_id (FK)

post_comments                  # Comentarios
├─ id, post_id (FK), user_id (FK)
├─ content, created_at

user_stories                   # Historias
├─ id, user_id (FK)
├─ content_url, created_at, expires_at

chat_conversations             # Conversaciones
├─ id, user1_id (FK), user2_id (FK)
├─ last_message_at

chat_messages                  # Mensajes
├─ id, conversation_id (FK)
├─ sender_id (FK), content
├─ read_at, created_at

live_streams                   # Transmisiones
├─ id, stream_id, host_id (FK)
├─ title, status, viewer_count

notifications                 # Notificaciones
├─ id, user_id (FK)
├─ type, title, message, data
├─ read_at, created_at

followers                      # Seguidos
├─ id, follower_id (FK), following_id (FK)

marketplace_items              # Items marketplace
├─ id, seller_id (FK)
├─ name, price, description, image_url

cards                          # Cards FIFA
├─ id, user_id (FK)
├─ overall, pace, shooting, passing, dribbling, defense, physical
```

---

**Estado del Proyecto**: 🟢 **FUNCIONAL CON CORRECCIONES PENDIENTES**
**Último actualizado**: 17 de enero de 2026
