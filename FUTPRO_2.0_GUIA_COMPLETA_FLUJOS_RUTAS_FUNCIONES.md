# 📱 FUTPRO 2.0 - GUÍA COMPLETA DE FLUJOS, RUTAS Y FUNCIONES

## 🎯 RESUMEN EJECUTIVO
Esta es la documentación completa de FutPro 2.0, incluyendo:
- ✅ Flujo completo de usuario (login → homepage)
- ✅ 26 rutas principales mapeadas
- ✅ 27 opciones de menú hamburguesa funcionales
- ✅ 5 opciones de configuración de cuenta
- ✅ Qué sucede en cada página cuando el usuario hace clic

---

## 🏠 FLUJO PRINCIPAL DE USUARIO (Inicio a Fin)

### 1️⃣ PANTALLA DE LOGIN
**Archivo:** `LoginRegisterForm.jsx` / `LoginRegisterFormClean.jsx`  
**Ruta:** `/` (página inicial)  
**Tipo:** Componente unificado de autenticación

**Elementos en pantalla:**
- Campo de email
- Campo de contraseña
- Botón: "Registrarse" → Ir a `/formulario-registro`
- Botón: "Continuar con Google" → Iniciar OAuth con Google
- Opción: "Recuperar contraseña" → Ir a `/recuperar-password`

**Validaciones:**
- Email válido (formato @)
- Contraseña mínimo 6 caracteres
- Sin espacios en blanco

**Qué sucede al hacer clic:**
- "Registrarse": Navega a `/formulario-registro`
- "Continuar con Google": Redirige a Google, luego a `/auth/callback`
- Iniciar sesión: Valida en Supabase, crea sesión, redirige a `/home`

---

### 2️⃣ SELECCIÓN DE CATEGORÍA
**Archivo:** `SeleccionCategoria.jsx`  
**Ruta:** `/seleccionar-categoria`  
**Tipo:** Selector de categoría

**Opciones disponibles:**
- ⚽ Fútbol Masculino
- ⚽ Fútbol Femenino
- ⚽ Fútbol Mixto

**Qué sucede:**
- Usuario selecciona categoría
- Se guarda en `localStorage` bajo `categoriaSeleccionada`
- Botón "Siguiente" navega a `/formulario-registro`

---

### 3️⃣ FORMULARIO DE REGISTRO
**Archivo:** `FormularioRegistroCompleto.jsx`  
**Ruta:** `/formulario-registro`  
**Tipo:** Formulario multipasos

**Campos recopilados:**
- Nombre completo
- Email (validado)
- Posición en el campo (Portero, Defensa, Centrocampista, Delantero)
- Nivel de juego (Principiante, Intermedio, Avanzado, Profesional)
- Equipo actual (opcional)
- Ubicación (país, ciudad)
- Foto de perfil
- Teléfono (opcional)
- Fecha de nacimiento

**Qué sucede al hacer clic:**
- "Siguiente": Valida campos, guarda en `localStorage`
- "Continuar con Google": Inicia OAuth
- "Atrás": Regresa a `/seleccionar-categoria`

---

### 4️⃣ AUTENTICACIÓN GOOGLE
**Archivos:** 
- `auth-callback.html` (manejo de callback)
- Configuración en Supabase OAuth

**Ruta:** `/auth/callback`  
**Componente:** `AuthCallback.jsx`

**Flujo de OAuth:**
1. Usuario hace clic en "Continuar con Google"
2. Redirige a Google (login.microsoftonline.com)
3. Usuario autoriza FutPro para acceder a su perfil
4. Google redirige a `/auth/callback` con código de autorización
5. Netlify procesa callback → crea perfil en BD
6. Redirige automáticamente a `/perfil-card`

**Datos capturados de Google:**
- Nombre
- Email
- Foto de perfil
- ID de Google

---

### 5️⃣ ASIGNACIÓN DE TARJETA (PERFIL)
**Archivo:** `PerfilCard.jsx`  
**Ruta:** `/perfil-card`  
**Tipo:** Visualización de perfil estilo Instagram

**Elementos mostrados:**
- Avatar circular con foto
- Nombre del jugador
- Posición
- Nivel
- Estadísticas (partidos jugados, goles, asistencias)
- Botón flotante: "Continuar" → Va a `/home`
- Opción: "Editar perfil" → Va a `/editar-perfil`

**Qué sucede:**
- Se muestran datos obtenidos del registro + Google
- Al hacer clic "Continuar": Sesión confirmada, redirige a `/home`

---

### 6️⃣ HOMEPAGE INSTAGRAM
**Archivo:** `homepage-instagram.html` (página principal completa)  
**Ruta:** `/home`  
**Tipo:** Página HTML + JavaScript (Instagram-like)

**Secciones principales:**

#### A. Búsqueda y Filtros
- Barra de búsqueda: Buscar equipos o usuarios
- Filtros:
  - 📂 Por categoría (Masculino, Femenino, Mixto)
  - 📍 Por ubicación
  - 🎯 Por edad
  - ⭐ Por nivel

#### B. Feed de Publicaciones (Muro)
- Grid de posts de otros jugadores
- Cada post contiene:
  - Foto del usuario
  - Nombre y ubicación
  - Texto de la publicación
  - Imagen/video del post
  - Botones: ⚽ Like (Balón), 💬 Comentario, 📤 Compartir
  - Contador de likes

**Qué sucede al hacer clic:**
- **Foto de usuario**: Navega a perfil del usuario
- **Like (⚽)**: Suma like a la publicación, se guarda en BD
- **Comentario (💬)**: Abre modal para escribir comentario
- **Compartir (📤)**: Abre opciones de compartir

#### C. Sección Historias (Stories)
- Avatares circulares de usuarios seguidos
- Gradientes de colores
- Al hacer clic: Ver historia del usuario (tipo Instagram Stories)
- Deslizar hacia arriba: Siguiente historia
- Deslizar hacia abajo: Historia anterior

#### D. Marketplace
- Grid de productos/servicios en venta
- Categorías: Equipamiento, Coaching, Tours, Partidos
- Cada ítem tiene:
  - Foto
  - Precio
  - Descripción
  - Botón: "Comprar" o "Ver más"

**Qué sucede:** Al hacer clic en un producto → Modal de detalle con opción de compra

#### E. Sección de Videos (TikTok-style)
- Scroll vertical de videos cortos
- Cada video:
  - Usuario creador
  - Descripción
  - Botones: Like, Compartir, Comentar
  - Velocidad de reproducción ajustable

**Qué sucede:** Deslizar hacia abajo → Siguiente video, Deslizar hacia arriba → Video anterior

#### F. Sección de Alertas/Notificaciones
- Centro de notificaciones consolidadas
- Tipos: Partidos cercanos, Campeonatos, Likes, Comentarios, Mensajes
- Cada notificación es clickeable
- Badge con número de alertas no leídas

**Qué sucede:** Al hacer clic → Ver detalle de notificación

#### G. Chat y Grupos
- Lista de conversaciones activas
- Grupos de amigos
- Cada chat tiene:
  - Avatar del usuario/grupo
  - Nombre
  - Último mensaje
  - Hora del último mensaje
  - Badge con mensajes no leídos

**Qué sucede:** Al hacer clic → Abrir conversación

---

## 🍔 MENÚ HAMBURGUESA - 27 OPCIONES FUNCIONALES

**Ubicación:** Botón 🍔 en esquina superior de homepage-instagram.html  
**Archivo:** `MenuHamburguesa.jsx`  
**Estado:** Abierto/Cerrado con toggle

### 📱 SECCIÓN 1: PERFIL & ESTADÍSTICAS (7 opciones)

| Opción | Icono | Función | Ruta | Qué sucede |
|--------|-------|---------|------|-----------|
| Inicio | 🏠 | `irAInicio()` | `/home` | Recarga el feed principal |
| Mi Perfil | 👤 | `irAPerfil()` | `/perfil` | Muestra perfil completo del usuario autenticado |
| Editar Perfil | ✏️ | `editarPerfil()` | `/editar-perfil` | Abre formulario para editar datos personales |
| Mis Estadísticas | 📊 | `verEstadisticas()` | `/estadisticas` | Muestra gráficos: goles, asistencias, partidos |
| Mis Partidos | 📅 | `verPartidos()` | `/partidos` | Lista de partidos jugados con histórico |
| Mis Logros | 🏆 | `verLogros()` | `/logros` | Badges y logros desbloqueados |
| Mis Tarjetas | 🆔 | `verTarjetas()` | `/tarjetas` | Galería de tarjetas FIFA del jugador |

---

### 👥 SECCIÓN 2: EQUIPOS & TORNEOS (5 opciones)

| Opción | Icono | Función | Ruta | Qué sucede |
|--------|-------|---------|------|-----------|
| Ver Equipos | 👥 | `verEquipos()` | `/equipos` | Lista todos los equipos registrados |
| Crear Equipo | ➕ | `crearEquipo()` | `/crear-equipo` | Formulario para crear nuevo equipo |
| Ver Torneos | 🏆 | `verTorneos()` | `/torneos` | Lista de torneos activos y próximos |
| Crear Torneo | ➕ | `crearTorneo()` | `/crear-torneo` | Formulario para organizar torneo |
| Crear Amistoso | 🤝 | `crearAmistoso()` | `/amistoso` | Crear partido amistoso rápido |

---

### 🎮 SECCIÓN 3: JUEGOS & TARJETAS (2 opciones)

| Opción | Icono | Función | Ruta | Qué sucede |
|--------|-------|---------|------|-----------|
| Penaltis | ⚽ | `jugarPenaltis()` | `/penaltis` | Minijuego de penaltis interactivo |
| Card Futpro | 🆔 | `verCardFIFA()` | `/card-fifa` | Muestra tarjeta de jugador estilo FIFA |

---

### 💬 SECCIÓN 4: SOCIAL (7 opciones)

| Opción | Icono | Función | Ruta | Qué sucede |
|--------|-------|---------|------|-----------|
| Notificaciones | 🔔 | `verNotificaciones()` | `/notificaciones` | Centro de notificaciones (likes, comentarios, mensajes) |
| Chat | 💬 | `abrirChat()` | `/chat` | Mensajería privada y grupos |
| Videos | 🎥 | `verVideos()` | `/videos` | Galería de videos tipo TikTok |
| Marketplace | 🏪 | `abrirMarketplace()` | `/marketplace` | Tienda de equipamiento y servicios |
| Estados | 📋 | `verEstados()` | `/estados` | Ver estados de otros usuarios |
| Amigos | 👫 | `verAmigos()` | `/amigos` | Lista de amigos y solicitudes |
| Transmitir en Vivo | 📡 | `abrirTransmisionEnVivo()` | `/transmision-vivo` | Streaming en directo de partidos |

---

### 🏅 SECCIÓN 5: RANKINGS (3 opciones)

| Opción | Icono | Función | Ruta | Qué sucede |
|--------|-------|---------|------|-----------|
| Ranking Jugadores | 📊 | `rankingJugadores()` | `/ranking` | Clasificación mundial de jugadores |
| Ranking Equipos | 📈 | `rankingPartidos()` | `/ranking-equipos` | Clasificación de equipos por partidos ganados |
| Buscar Ranking | 🔍 | `buscarRanking()` | `/buscar-ranking` | Búsqueda avanzada de rankings por criterios |

---

### ⚙️ SECCIÓN 6: ADMINISTRACIÓN (3 opciones)

| Opción | Icono | Función | Ruta | Qué sucede |
|--------|-------|---------|------|-----------|
| Configuración | 🔧 | `abrirConfiguracion()` | `/configuracion-cuenta` | Panel de configuración de cuenta |
| Soporte | 🆘 | `contactarSoporte()` | `/soporte` | Centro de ayuda y contacto |
| Privacidad | 🛡️ | `verPrivacidad()` | `/privacidad` | Políticas de privacidad y términos |

---

## ⚙️ CONFIGURACIÓN DE CUENTA - 5 OPCIONES PRINCIPALES

**Ruta:** `/configuracion-cuenta`  
**Archivo:** `ConfiguracionCuenta.jsx`  
**Estado:** Componente React completamente funcional

### 1️⃣ Cambiar Contraseña
**Botón:** 🔐 Cambiar Contraseña

**Qué sucede:**
1. Click expande formulario
2. Pide: Contraseña actual, Nueva, Confirmar
3. Valida que coincidan y tengan mín. 6 caracteres
4. Actualiza en Supabase Auth
5. Muestra mensaje de éxito ✅

**Campos:**
- Contraseña actual (password)
- Contraseña nueva (password)
- Confirmar contraseña (password)

---

### 2️⃣ Cambiar Ubicación
**Botón:** 📍 Cambiar Ubicación

**Qué sucede:**
1. Click expande formulario
2. Muestra ubicación actual
3. Campo de texto para nueva ubicación (Ej: Madrid, España)
4. Click "Guardar": Actualiza en BD Supabase
5. Muestra confirmación ✅

**Campos:**
- Ubicación actual (readonly)
- Nueva ubicación (texto editable)

---

### 3️⃣ Cambiar Privacidad
**Botón:** 🔒 Cambiar Privacidad

**Qué sucede:**
1. Click expande formulario
2. Muestra privacidad actual
3. Dropdown con opciones:
   - 🌍 Pública (cualquiera te puede ver)
   - 🔒 Privada (solo amigos)
4. Click "Guardar": Actualiza en BD
5. Muestra confirmación ✅

**Campos:**
- Privacidad actual (readonly)
- Selector privacidad (dropdown)

---

### 4️⃣ Eliminar Cuenta
**Botón:** 🗑️ Eliminar Cuenta (rojo peligro)

**Qué sucede:**
1. Click abre modal de confirmación
2. Muestra advertencia: ⚠️ "Acción irreversible"
3. Pide escribir "ELIMINAR" para confirmar
4. Verifica texto exacto
5. Elimina usuario de tabla `usuarios`
6. Elimina cuenta de Supabase Auth
7. Redirige a `/` (logout automático)
8. Muestra mensaje ✅ durante 2 segundos

**Validación:** Texto exacto "ELIMINAR" (sensible a mayúsculas)

---

### 5️⃣ Cerrar Sesión
**Botón:** 🚪 Cerrar Sesión (naranja)

**Qué sucede:**
1. Click inmediato
2. Ejecuta `supabase.auth.signOut()`
3. Limpia sesión en cliente
4. Redirige a `/` (login)
5. Usuario debe volver a autenticarse

---

## 📊 TABLA DE RUTAS COMPLETA (26 RUTAS)

| # | Ruta | Archivo | Componente | Descripción |
|---|------|---------|-----------|-------------|
| 1 | `/` | LoginRegisterForm.jsx | HomePage | Página de login/registro |
| 2 | `/seleccionar-categoria` | SeleccionCategoria.jsx | SeleccionCategoria | Selector de categoría |
| 3 | `/formulario-registro` | FormularioRegistroCompleto.jsx | FormularioRegistroCompleto | Registro completo |
| 4 | `/auth/callback` | auth/AuthCallback.jsx | AuthCallback | Manejo de OAuth callback |
| 5 | `/perfil-card` | PerfilCard.jsx | PerfilCard | Tarjeta de perfil |
| 6 | `/home` | HomePage.jsx | HomePage | Feed principal (Instagram) |
| 7 | `/perfil` | Perfil.jsx | Perfil | Perfil completo del usuario |
| 8 | `/editar-perfil` | EditarPerfil.jsx | EditarPerfil | Edición de datos personales |
| 9 | `/estadisticas` | Estadisticas.jsx | Estadisticas | Estadísticas y gráficos |
| 10 | `/partidos` | Partidos.jsx | Partidos | Histórico de partidos |
| 11 | `/logros` | Logros.jsx | Logros | Badges y logros |
| 12 | `/tarjetas` | Tarjetas.jsx | Tarjetas | Galería de tarjetas |
| 13 | `/equipos` | Equipos.jsx | Equipos | Lista de equipos |
| 14 | `/crear-equipo` | CrearEquipo.jsx | CrearEquipo | Crear nuevo equipo |
| 15 | `/torneos` | Torneos.jsx | Torneos | Lista de torneos |
| 16 | `/crear-torneo` | CrearTorneo.jsx | CrearTorneo | Crear torneo |
| 17 | `/amistoso` | Amistoso.jsx | AmistososPanel | Partidos amistosos |
| 18 | `/penaltis` | PenaltisPage.jsx | PenaltisPage | Minijuego penaltis |
| 19 | `/card-fifa` | CardFIFA.jsx | CardFIFA | Tarjeta FIFA |
| 20 | `/notificaciones` | NotificacionesPanel.jsx | NotificacionesPanel | Centro notificaciones |
| 21 | `/chat` | ChatPage.jsx | ChatPage | Mensajería |
| 22 | `/videos` | VideosPage.jsx | VideosPage | Galería videos |
| 23 | `/marketplace` | MarketplacePanel.jsx | MarketplacePanel | Tienda |
| 24 | `/estados` | Estados.jsx | Estados | Estados usuarios |
| 25 | `/amigos` | AmigosPanel.jsx | AmigosPanel | Lista amigos |
| 26 | `/ranking` | RankingPage.jsx | RankingPage | Rankings |
| 27 | `/configuracion-cuenta` | ConfiguracionCuenta.jsx | ConfiguracionCuenta | Configuración cuenta |

---

## 🔄 DIAGRAMA DE FLUJO COMPLETO

```
USUARIO NUEVO
      ↓
   [/] LOGIN
      ↓
   Clic "Registrarse"
      ↓
[/formulario-registro] REGISTRO COMPLETO
      ↓
   Clic "Google OAuth"
      ↓
[/auth/callback] CALLBACK GOOGLE
      ↓
BD: Crear usuario + perfil
      ↓
[/perfil-card] ASIGNAR TARJETA
      ↓
   Clic "Continuar"
      ↓
[/home] HOMEPAGE INSTAGRAM ← PUNTO CENTRAL
      ↓
   🍔 MENÚ HAMBURGUESA (27 opciones)
      ├─→ [/perfil] Mi Perfil
      ├─→ [/editar-perfil] Editar
      ├─→ [/estadisticas] Mis Estadísticas
      ├─→ [/equipos] Ver Equipos
      ├─→ [/torneos] Ver Torneos
      ├─→ [/penaltis] Jugar Penaltis
      ├─→ [/chat] Chat
      ├─→ [/videos] Videos
      ├─→ [/marketplace] Marketplace
      ├─→ [/ranking] Rankings
      ├─→ [/configuracion-cuenta] Configuración
      └─→ [/soporte] Soporte

USUARIO EXISTENTE
      ↓
   [/] LOGIN
      ↓
   Valida en Supabase
      ↓
[/home] HOMEPAGE ← DIRECTO
```

---

## 🎬 QUÉ SUCEDE EN CADA PÁGINA (Acciones por clic)

### [/] Login
- **Clic "Registrarse"** → Navigate `/formulario-registro`
- **Clic "Google"** → Supabase OAuth redirect
- **Clic "Recuperar password"** → Navigate `/recuperar-password`
- **Enter en email+pass** → Valida en Supabase, sesión activa, Navigate `/home`

### [/formulario-registro] Registro
- **Clic "Siguiente"** → Valida campos, localStorage, siguiente paso
- **Clic "Atrás"** → Navigate `/seleccionar-categoria`
- **Clic "Google"** → Oauth redirect
- **Enviar form** → POST a Supabase, Navigate `/perfil-card`

### [/perfil-card] Tarjeta
- **Clic "Continuar"** → Navigate `/home`
- **Clic "Editar"** → Navigate `/editar-perfil`

### [/home] Homepage
- **Clic foto usuario (post)** → Navigate `/perfil` + usuario_id
- **Clic ⚽ Like** → POST like a BD, actualiza contador
- **Clic 💬 Comentario** → Modal de comentario, POST a BD
- **Clic 📤 Compartir** → Abre opciones compartir
- **Clic historia (avatar)** → Modal fullscreen story
- **Deslizar down (stories)** → Story siguiente
- **Deslizar up (stories)** → Story anterior
- **Clic video marketplace** → Modal producto detalle
- **Scroll down (videos)** → Siguiente video, play automático
- **Clic chat** → Navigate `/chat` + usuario_id
- **Clic notificación** → Navigate `/notificaciones`
- **Clic 🍔** → Toggle menú hamburguesa

### [/chat] Chat
- **Clic usuario en lista** → Abre conversación
- **Escribir mensaje + Enter** → POST mensaje, scroll down auto
- **Clic foto usuario** → Navigate `/perfil` + usuario_id
- **Clic video/imagen** → Modal fullscreen

### [/marketplace] Marketplace
- **Clic producto** → Navigate `/marketplace/detalle` + producto_id
- **Clic "Comprar"** → Modal pago, POST transacción
- **Clic "Vendedor"** → Navigate `/perfil` + vendedor_id
- **Filtro categoría** → Query BD, refiltra grid

### [/videos] Videos
- **Scroll down** → Carga video siguiente automáticamente
- **Clic ⚽ Like** → POST like, actualiza contador
- **Clic 💬 Comentario** → Modal comentario
- **Clic usuario creador** → Navigate `/perfil` + usuario_id
- **Play/Pause** → Pausa video

### [/penaltis] Minijuego Penaltis
- **Clic zona field** → Disparo hacia ese lugar
- **Si gol** → +1 punto, siguiente tiro
- **Si fallo** → Game Over, muestra score
- **Clic "Reiniciar"** → Reset contador, nueva partida

### [/configuracion-cuenta] Configuración
- **Clic 🔐 Contraseña** → Expande formulario
  - **Clic "Guardar"** → Valida, actualiza Auth, muestra ✅
- **Clic 📍 Ubicación** → Expande formulario
  - **Clic "Guardar"** → Valida, actualiza BD, muestra ✅
- **Clic 🔒 Privacidad** → Expande formulario
  - **Clic "Guardar"** → Valida, actualiza BD, muestra ✅
- **Clic 🗑️ Eliminar** → Expande modal
  - **Escribe "ELIMINAR"** → Activa botón eliminar
  - **Clic "Eliminar"** → Elimina usuario, redirige `/`
- **Clic 🚪 Cerrar Sesión** → Logout inmediato, Navigate `/`

---

## 🎯 RESUMEN DE CAMBIOS REALIZADOS

✅ **Eliminado:** Duplicado "Sugerencias Card" en menú (estaba 2 veces)  
✅ **Creado:** Componente `ConfiguracionCuenta.jsx` con 5 opciones funcionales  
✅ **Actualizado:** `MenuHamburguesa.jsx` (sin duplicados)  
✅ **Añadida Ruta:** `/configuracion-cuenta` en `AppRouter.jsx`  
✅ **Documentado:** Flujo completo de usuario y 27 funciones del menú

---

## 🚀 PRÓXIMOS PASOS (Recomendaciones)

1. **Validar OAuth Google** - Asegúrate que las URLs de callback estén bien en Google Console
2. **Implementar WebSockets** - Para chat y notificaciones en tiempo real
3. **Agregar Fotos** - Subida de perfiles a storage Supabase
4. **Implementar Pagos** - Integración Stripe/PayPal para marketplace
5. **Agregar Analytics** - Trackear eventos importantes

---

**Última actualización:** 12 de diciembre de 2025  
**Versión:** FutPro 2.0 - Build Completo
