# 📋 LISTA COMPLETA DE PÁGINAS, SUBPÁGINAS, FUNCIONES Y BOTONES

## 1️⃣ AUTENTICACIÓN - /login

### Página: LoginRegisterForm
**Archivo:** `src/pages/LoginRegisterForm.jsx`
**Ruta:** `/login`
**Tipo:** Página de entrada (sin Layout)

#### Funciones Principales:
```javascript
handleEmailChange(e)          → setEmail(e.target.value)
handlePasswordChange(e)       → setPassword(e.target.value)
toggleRegisterMode()          → setIsRegister(!isRegister)
validateEmail(email)          → Valida formato @domain.com
validatePassword(password)    → Valida longitud mín 6
handleLogin()                 → Autentica con Supabase + navigate('/home')
handleRegister()              → Valida + registra usuario + navigate('/seleccionar-categoria')
handleGoogleLogin()           → OAuth Google → navigate('/perfil-card')
handleGoogleRegister()        → OAuth Google → navigate('/perfil-card')
```

#### Botones y Inputs:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Input Email | onChange | handleEmailChange() | setEmail = value |
| Input Password | onChange | handlePasswordChange() | setPassword = value |
| Botón [LOGIN] | onClick | handleLogin() | ✅ /home ❌ Error |
| Botón [REGISTRARSE] | onClick | toggleRegisterMode() | Cambia UI (login→registro) |
| Botón [Google] (Login) | onClick | handleGoogleLogin() | OAuth → /perfil-card |
| Botón [Google] (Registro) | onClick | handleGoogleRegister() | OAuth → /perfil-card |
| Link [¿Olvidaste contraseña?] | onClick | (pendiente) | Modal/Página reset |

#### Estados:
```javascript
email = ''
password = ''
isRegister = false
loading = false
error = null
stepMsg = ''
```

---

## 2️⃣ SELECCIONAR CATEGORÍA - /seleccionar-categoria

### Página: SeleccionCategoria
**Archivo:** `src/pages/SeleccionCategoria.jsx`
**Ruta:** `/seleccionar-categoria`
**Tipo:** Página de entrada (sin Layout)
**Padre:** LoginRegisterForm

#### Funciones Principales:
```javascript
handleSelectCategory(category)    → setSelected(category)
handleConfirm()                   → navigate('/formulario-registro?categoria=' + selected)
handleGoogleAuth()                → OAuth → navigate('/perfil-card')
handleCategoryChange(e)           → setSelected(e.target.value)
```

#### Botones y Inputs:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Botón [Infantil Femenina] | onClick | handleSelectCategory('infantil_femenina') | selected = 'infantil_femenina' |
| Botón [Infantil Masculina] | onClick | handleSelectCategory('infantil_masculina') | selected = 'infantil_masculina' |
| Botón [Femenina] | onClick | handleSelectCategory('femenina') | selected = 'femenina' |
| Botón [Masculina] | onClick | handleSelectCategory('masculina') | selected = 'masculina' |
| Botón [CONFIRMAR] | onClick | handleConfirm() | /formulario-registro?categoria=X |
| Botón [Google] | onClick | handleGoogleAuth() | OAuth → /perfil-card |

#### Estados:
```javascript
selected = null
loading = false
error = null
```

---

## 3️⃣ FORMULARIO DE REGISTRO - /formulario-registro

### Página: FormularioRegistroCompleto
**Archivo:** `src/pages/FormularioRegistroCompleto.jsx`
**Ruta:** `/formulario-registro`
**Tipo:** Página de entrada (sin Layout)
**Padre:** SeleccionCategoria

### Subpágina: Paso 1 - Credenciales
**Paso actual:** 1

#### Funciones:
```javascript
handleEmailChange(e)              → setFormData({...formData, email: e.target.value})
handlePasswordChange(e)           → setFormData({...formData, password: e.target.value})
handlePasswordConfirmChange(e)    → setFormData({...formData, passwordConfirm: e.target.value})
validateStep1()                   → Valida email, password (mín 6), confirmar contraseña
handleNextStep()                  → Valida + setPasoActual(2)
```

#### Botones e Inputs:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Input Email | onChange | handleEmailChange() | formData.email = value |
| Input Password | onChange | handlePasswordChange() | formData.password = value |
| Input Confirmar Contraseña | onChange | handlePasswordConfirmChange() | formData.passwordConfirm = value |
| Botón [SIGUIENTE] | onClick | handleNextStep() | ✅ Paso 2 ❌ Error |
| Botón [Google] | onClick | handleGoogleRegister() | OAuth → /perfil-card |

---

### Subpágina: Paso 2 - Datos Personales
**Paso actual:** 2

#### Funciones:
```javascript
handleNombreChange(e)             → setFormData({...formData, nombre: e.target.value})
handleApellidoChange(e)           → setFormData({...formData, apellido: e.target.value})
handleEdadChange(e)               → setFormData({...formData, edad: e.target.value})
handleGeneroChange(e)             → setFormData({...formData, genero: e.target.value})
handlePaisChange(e)               → setFormData({...formData, pais: e.target.value})
handleCiudadChange(e)             → setFormData({...formData, ciudad: e.target.value})
validateStep2()                   → Valida todos los campos requeridos
handlePreviousStep()              → setPasoActual(1)
handleNextStep()                  → Valida + setPasoActual(3)
```

#### Botones e Inputs:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Input Nombre | onChange | handleNombreChange() | formData.nombre = value |
| Input Apellido | onChange | handleApellidoChange() | formData.apellido = value |
| Input Edad | onChange | handleEdadChange() | formData.edad = value |
| Select Género | onChange | handleGeneroChange() | formData.genero = value |
| Select País | onChange | handlePaisChange() | formData.pais = value |
| Input Ciudad | onChange | handleCiudadChange() | formData.ciudad = value |
| Botón [ANTERIOR] | onClick | handlePreviousStep() | Paso 1 |
| Botón [SIGUIENTE] | onClick | handleNextStep() | ✅ Paso 3 ❌ Error |

---

### Subpágina: Paso 3 - Datos de Jugador
**Paso actual:** 3

#### Funciones:
```javascript
handlePosicionChange(e)           → setFormData({...formData, posicion: e.target.value})
handleNivelChange(e)              → setFormData({...formData, nivelHabilidad: e.target.value})
handleAlternaTChange(e)           → setFormData({...formData, piernaalterna: e.target.value})
handlePesoChange(e)               → setFormData({...formData, peso: e.target.value})
handleAlturaChange(e)             → setFormData({...formData, altura: e.target.value})
validateStep3()                   → Valida posición, nivel
handlePreviousStep()              → setPasoActual(2)
handleSubmit()                    → Valida + Registra en Supabase + navigate('/perfil-card')
```

#### Botones e Inputs:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Select Posición | onChange | handlePosicionChange() | formData.posicion = value |
| Select Nivel Habilidad | onChange | handleNivelChange() | formData.nivelHabilidad = value |
| Select Pierna Alterna | onChange | handleAlternaTChange() | formData.piernaalterna = value |
| Input Peso (kg) | onChange | handlePesoChange() | formData.peso = value |
| Input Altura (cm) | onChange | handleAlturaChange() | formData.altura = value |
| Botón [ANTERIOR] | onClick | handlePreviousStep() | Paso 2 |
| Botón [FINALIZAR] | onClick | handleSubmit() | ✅ /perfil-card ❌ Error |

#### Estados:
```javascript
formData = {
  email: '',
  password: '',
  passwordConfirm: '',
  nombre: '',
  apellido: '',
  edad: null,
  genero: '',
  pais: '',
  ciudad: '',
  posicion: '',
  nivelHabilidad: '',
  piernaalterna: '',
  peso: '',
  altura: ''
}
pasoActual = 1
loading = false
error = null
```

---

## 4️⃣ PERFIL CARD - /perfil-card

### Página: PerfilCard (Transición post-registro)
**Archivo:** `src/pages/PerfilCard.jsx`
**Ruta:** `/perfil-card`
**Tipo:** Página de entrada (sin Layout)
**Padre:** FormularioRegistroCompleto
**Función:** Muestra preview del card FIFA después de completar registro

#### Funciones Principales:
```javascript
loadCardData()                    → Carga datos desde Supabase (stub)
animateCard()                     → setShowAnimation(true) - Animación entrada
handleContinueHome()              → navigate('/') - Va a HomePage
handleViewFullProfile()           → navigate('/perfil/me') - Va a perfil Instagram
generateCardStats()               → Genera stats iniciales para card FIFA
```

#### Vista del Card:
- Muestra preview del card FIFA con stats iniciales
- Animación de aparición (flip card)
- OVR calculado basado en datos de registro
- Posición seleccionada en formulario
- Foto de perfil (si se subió)

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Botón [CONTINUAR AL HOME] | onClick | handleContinueHome() | / (HomePage feed) |
| Botón [VER PERFIL COMPLETO] | onClick | handleViewFullProfile() | /perfil/me (Instagram) |
| Botón [EDITAR CARD] | onClick | navigate('/card-fifa') | /card-fifa (Editar stats) |

#### Estados:
```javascript
cardData = null
showAnimation = false
loading = false
```

**Nota:** Esta página es diferente de:
- `/card-fifa` - Página completa para editar card con calificaciones
- `/perfil/me` - Perfil estilo Instagram con posts y seguidores

---

## 5️⃣ HOMEPAGE - /

### Página: HomePage
**Archivo:** `src/pages/HomePage.jsx`
**Ruta:** `/` (root)
**Tipo:** Página principal (SIN Layout wrapper)

#### Funciones Principales:
```javascript
createMenuActions(navigate)       → Crea objeto con 28 funciones de navegación
handleSearch(e)                   → setSearch(e.target.value)
openMenu()                        → setMenuOpen(true)
closeMenu()                       → setMenuOpen(false)
toggleMenu()                      → setMenuOpen(!menuOpen)
onLike(id)                        → setLikes(prev => ({...prev, [id]: (prev[id]||0)+1}))
onComment(id)                     → setComments(prev => ({...prev, [id]: (prev[id]||0)+1}))
onShare(id)                       → console.log('Compartir post ' + id)
handleStoryClick(user)            → console.log('Ver historia ' + user)
handleFABClick()                  → console.log('Crear post')
handleNotificationClick()         → navigate('/notificaciones')
handleLogoClick()                 → navigate('/')
```

#### Acciones del Menú (28 botones):
```javascript
menuActions = {
  irAPerfil: () => navigate('/perfil/me'),
  verEstadisticas: () => navigate('/estadisticas'),
  verPartidos: () => navigate('/partidos'),
  verLogros: () => navigate('/logros'),
  verTarjetas: () => navigate('/tarjetas'),
  verEquipos: () => navigate('/equipos'),
  crearEquipo: () => navigate('/crear-equipo'),
  verTorneos: () => navigate('/torneos'),
  crearTorneo: () => navigate('/crear-torneo'),
  irAAmistoso: () => navigate('/amistoso'),
  jugarPenaltis: () => navigate('/penaltis'),
  verCardFIFA: () => navigate('/card-fifa'),
  verSugerenciasCard: () => navigate('/sugerencias-card'),
  verNotificaciones: () => navigate('/notificaciones'),
  irAChat: () => navigate('/chat'),
  verVideos: () => navigate('/videos'),
  irAMarketplace: () => navigate('/marketplace'),
  verEstados: () => navigate('/estados'),
  verAmigos: () => navigate('/amigos'),
  verTransmision: () => navigate('/transmision-en-vivo'),
  verRankingJugadores: () => navigate('/ranking-jugadores'),
  verRankingEquipos: () => navigate('/ranking-equipos'),
  buscarRanking: () => navigate('/buscar-ranking'),
  abrirConfiguracion: () => navigate('/configuracion'),
  verSoporte: () => navigate('/soporte'),
  verPrivacidad: () => navigate('/privacidad'),
  logout: () => { localStorage.clear(); sessionStorage.clear(); navigate('/login'); }
}
```

#### Botones e Inputs (en orden de aparición):

**HEADER:**
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Logo | onClick | handleLogoClick() | navigate('/') |
| Input Búsqueda | onChange | handleSearch() | setSearch + filtra posts |
| Botón 🔔 | onClick | handleNotificationClick() | /notificaciones |
| Botón ☰ | onClick | toggleMenu() | setMenuOpen(!menuOpen) |

**MENÚ HAMBURGUESA (28 botones):**
| # | Botón | onClick | Navega a |
|---|-------|---------|----------|
| 1 | 👤 Mi Perfil | menuActions.irAPerfil() | /perfil/me |
| 2 | 📊 Estadísticas | menuActions.verEstadisticas() | /estadisticas |
| 3 | 📅 Partidos | menuActions.verPartidos() | /partidos |
| 4 | 🏆 Logros | menuActions.verLogros() | /logros |
| 5 | 🆔 Tarjetas | menuActions.verTarjetas() | /tarjetas |
| 6 | 👥 Ver Equipos | menuActions.verEquipos() | /equipos |
| 7 | ➕ Crear Equipo | menuActions.crearEquipo() | /crear-equipo |
| 8 | 🏆 Ver Torneos | menuActions.verTorneos() | /torneos |
| 9 | ➕ Crear Torneo | menuActions.crearTorneo() | /crear-torneo |
| 10 | 🤝 Amistoso | menuActions.irAAmistoso() | /amistoso |
| 11 | ⚽ Penaltis | menuActions.jugarPenaltis() | /penaltis |
| 12 | 🆔 Card FIFA | menuActions.verCardFIFA() | /card-fifa |
| 13 | 💡 Sugerencias | menuActions.verSugerenciasCard() | /sugerencias-card |
| 14 | 🔔 Notificaciones | menuActions.verNotificaciones() | /notificaciones |
| 15 | 💬 Chat | menuActions.irAChat() | /chat |
| 16 | 🎥 Videos | menuActions.verVideos() | /videos |
| 17 | 🏪 Marketplace | menuActions.irAMarketplace() | /marketplace |
| 18 | 📋 Estados | menuActions.verEstados() | /estados |
| 19 | 👫 Amigos | menuActions.verAmigos() | /amigos |
| 20 | 📡 Transmisión | menuActions.verTransmision() | /transmision-en-vivo |
| 21 | 📊 Ranking J. | menuActions.verRankingJugadores() | /ranking-jugadores |
| 22 | 📈 Ranking E. | menuActions.verRankingEquipos() | /ranking-equipos |
| 23 | 🔍 Buscar | menuActions.buscarRanking() | /buscar-ranking |
| 24 | 🔧 Configuración | menuActions.abrirConfiguracion() | /configuracion |
| 25 | 🆘 Soporte | menuActions.verSoporte() | /soporte |
| 26 | 🛡️ Privacidad | menuActions.verPrivacidad() | /privacidad |
| 27 | 🚪 Cerrar Sesión | menuActions.logout() | localStorage.clear() + /login |
| 28 | ❌ Cerrar Menú | toggleMenu() | setMenuOpen(false) |

**STORIES (Scroll horizontal):**
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Story [Lucia] | onClick | handleStoryClick('Lucia') | console.log('Ver historia Lucia') |
| Story [Mateo] | onClick | handleStoryClick('Mateo') | console.log('Ver historia Mateo') |
| Story [Sofia] | onClick | handleStoryClick('Sofia') | console.log('Ver historia Sofia') |
| Story [Leo FC] | onClick | handleStoryClick('Leo FC') | console.log('Ver historia Leo FC') |

**FEED (Posts):**

**Post 1 - Lucia (Victoria 3-1):**
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Avatar/Nombre | onClick | (pendiente) | /usuario/lucia |
| Botón ⚽ 120 | onClick | onLike('p1') | likes['p1']++ (121) |
| Botón 💬 12 | onClick | onComment('p1') | comments['p1']++ (13) |
| Botón 📤 | onClick | onShare('p1') | console.log('Compartir post p1') |

**Post 2 - Leo FC (Nuevo fichaje):**
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Avatar/Nombre | onClick | (pendiente) | /usuario/leo |
| Botón ⚽ 85 | onClick | onLike('p2') | likes['p2']++ (86) |
| Botón 💬 9 | onClick | onComment('p2') | comments['p2']++ (10) |
| Botón 📤 | onClick | onShare('p2') | console.log('Compartir post p2') |

**BOTTOM NAVIGATION:**
| # | Botón | onClick | Navega a |
|---|-------|---------|----------|
| 1 | 🏠 Home | navigate('/') | / |
| 2 | 🛒 Market | navigate('/marketplace') | /marketplace |
| 3 | 🎥 Videos | navigate('/videos') | /videos |
| 4 | 🔔 Alertas | navigate('/notificaciones') | /notificaciones |
| 5 | 💬 Chat | navigate('/chat') | /chat |

**BOTÓN FLOTANTE:**
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Botón [+] | onClick | handleFABClick() | console.log('Crear post') |

#### Estados:
```javascript
search = ''
likes = { p1: 120, p2: 85 }
comments = { p1: 12, p2: 9 }
menuOpen = false
```

#### Datos de Seed:
```javascript
seedStories = [
  { user: 'Lucia', avatar: '👤' },
  { user: 'Mateo', avatar: '👤' },
  { user: 'Sofia', avatar: '👤' },
  { user: 'Leo FC', avatar: '🏢' }
]

seedPosts = [
  {
    id: 'p1',
    user: 'Lucia',
    avatar: '👤',
    title: 'Victoria 3-1',
    description: 'Gran partido hoy, seguimos sumando.',
    image: 'url...',
    category: 'Femenino',
    subcategory: 'Sub18'
  },
  {
    id: 'p2',
    user: 'Leo FC',
    avatar: '🏢',
    title: 'Nuevo fichaje',
    description: 'Bienvenido al equipo!',
    image: 'url...',
    category: 'Mixto'
  }
]
```

---

## 6️⃣ PÁGINAS SECUNDARIAS (CON LAYOUT - Sidebar + BottomNav)

### Página: Perfil (Estilo Instagram)
**Archivo:** `src/pages/Perfil.jsx`
**Ruta:** `/perfil/me` (propio) o `/perfil/:userId` (otros)
**Tipo:** Página secundaria (con Layout)
**Estilo:** Instagram - Vista diferenciada según dueño/seguidor

#### Funciones Principales:
```javascript
loadUserProfile(userId)           → Carga datos usuario desde Supabase
loadUserPosts(userId)             → Carga publicaciones del usuario
followUser(userId)                → Registra seguimiento + followers++
unfollowUser(userId)              → Elimina seguimiento + followers--
loadFollowers(userId)             → Carga lista de seguidores
loadFollowing(userId)             → Carga lista de siguiendo
openFollowersModal()              → Muestra modal con seguidores
openFollowingModal()              → Muestra modal con siguiendo
shareProfile()                    → Copy link a clipboard
reportUser(userId)                → Abre modal reporte
blockUser(userId)                 → Bloquea usuario
```

#### Vista del DUEÑO (/perfil/me):
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Foto de perfil | onClick | navigate('/editar-perfil') | Editar foto |
| Botón [Editar Perfil] | onClick | navigate('/editar-perfil') | /editar-perfil |
| Seguidores (120) | onClick | openFollowersModal() | Modal lista seguidores |
| Siguiendo (80) | onClick | openFollowingModal() | Modal lista siguiendo |
| Grid de posts | onClick | openPost(id) | Modal post detalle |
| Tab [📊 Estadísticas] | onClick | navigate('/estadisticas') | /estadisticas |
| Tab [⚽ Partidos] | onClick | navigate('/partidos') | /partidos |
| Tab [🆔 Card FIFA] | onClick | navigate('/card-fifa') | /card-fifa |
| Botón [➕ Crear Post] | onClick | openCreateModal() | Modal crear post |

#### Vista de SEGUIDOR (/perfil/:userId):
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Foto de perfil | onClick | openImageModal() | Ver imagen ampliada |
| Botón [Seguir] | onClick | followUser(userId) | followers++ |
| Botón [Siguiendo] | onClick | unfollowUser(userId) | followers-- |
| Botón [Mensaje] | onClick | navigate('/chat?user=' + userId) | /chat |
| Botón [...] Opciones | onClick | openOptionsMenu() | Compartir/Reportar/Bloquear |
| Seguidores (120) | onClick | openFollowersModal() | Modal lista seguidores |
| Siguiendo (80) | onClick | openFollowingModal() | Modal lista siguiendo |
| Grid de posts | onClick | openPost(id) | Modal post detalle |
| Tab [📊 Stats] | onClick | showStats() | Muestra stats públicas |

#### Estados:
```javascript
userData = null
posts = []
followers = []
following = []
isFollowing = false
followersCount = 0
followingCount = 0
postsCount = 0
isOwner = false
activeTab = 'posts'
```

---

### Página: Card FIFA (Calificación de Jugador)
**Archivo:** `src/pages/CardFIFA.jsx`
**Ruta:** `/card-fifa`
**Tipo:** Página secundaria (con Layout)
**Función:** Asignación de tarjeta para calificación de jugador (tipo FIFA Ultimate Team)

#### Funciones Principales:
```javascript
loadPlayerCard()                  → Carga datos card desde Supabase
calculateOverall()                → Calcula OVR basado en stats
updateStat(statName, value)       → Actualiza stat individual
saveCard()                        → Guarda cambios en Supabase
shareCard()                       → Genera imagen + comparte
downloadCard()                    → Descarga card como PNG
compareWithPlayers()              → navigate('/comparativas')
viewHistory()                     → Muestra evolución histórica
```

#### Estructura del Card:
```javascript
cardData = {
  overall: 85,           // OVR calculado
  position: 'DEL',       // Posición
  pace: 88,              // Velocidad
  shooting: 84,          // Tiro
  passing: 78,           // Pase
  dribbling: 86,         // Regate
  defense: 45,           // Defensa
  physical: 75,          // Físico
  weakFoot: 4,           // Pierna mala (1-5 estrellas)
  skillMoves: 4,         // Habilidad (1-5 estrellas)
  workRate: 'H/M',       // Ritmo trabajo (High/Medium)
  chemistry: 10          // Química equipo
}
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Stat (Pace) | onChange | updateStat('pace', value) | Actualiza + recalcula OVR |
| Stat (Shooting) | onChange | updateStat('shooting', value) | Actualiza + recalcula OVR |
| Stat (Passing) | onChange | updateStat('passing', value) | Actualiza + recalcula OVR |
| Stat (Dribbling) | onChange | updateStat('dribbling', value) | Actualiza + recalcula OVR |
| Stat (Defense) | onChange | updateStat('defense', value) | Actualiza + recalcula OVR |
| Stat (Physical) | onChange | updateStat('physical', value) | Actualiza + recalcula OVR |
| Botón [💾 Guardar] | onClick | saveCard() | Guarda en Supabase |
| Botón [📤 Compartir] | onClick | shareCard() | Genera imagen + comparte |
| Botón [⬇️ Descargar] | onClick | downloadCard() | Descarga PNG |
| Botón [📊 Comparar] | onClick | compareWithPlayers() | /comparativas |
| Botón [📈 Historial] | onClick | viewHistory() | Modal evolución

---

### Página: Estadísticas
**Archivo:** `src/pages/Estadisticas.jsx`
**Ruta:** `/estadisticas`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadStatsData()              → Carga datos desde Supabase
filterByCategory(category)   → setCategory(category)
filterByMonth(month)         → setMonth(month)
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Select [Categoría] | onChange | filterByCategory() | Filtra estadísticas |
| Select [Mes] | onChange | filterByMonth() | Filtra por período |

---

### Página: Partidos
**Archivo:** `src/pages/Partidos.jsx`
**Ruta:** `/partidos`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadMatches()            → Carga partidos desde Supabase
filterByStatus(status)   → setStatus(status)
joinMatch(id)            → Registra usuario en partido
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Botón [Próximos] | onClick | filterByStatus('proximos') | Filtra próximos |
| Botón [Completados] | onClick | filterByStatus('completados') | Filtra completados |
| Botón [➕ Unirse] | onClick | joinMatch(id) | Registra en partido |

---

### Página: Videos (TikTok-style)
**Archivo:** `src/pages/Videos.jsx`
**Ruta:** `/videos`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadVideos()                 → Carga videos desde API
nextVideo()                  → Scroll up → siguiente video
previousVideo()              → Scroll down → video anterior
likeVideo(id)                → setLikes({...likes, [id]: true})
commentVideo(id)             → Abre modal de comentarios
shareVideo(id)               → Abre opciones compartir
playVideo()                  → Reproduce video
pauseVideo()                 → Pausa video
toggleMute()                 → Activa/desactiva sonido
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Video (Deslizar arriba) | onScroll | nextVideo() | Siguiente video |
| Video (Deslizar abajo) | onScroll | previousVideo() | Video anterior |
| Doble tap | onDoubleClick | likeVideo(id) | ❤️ Marca como liked |
| Tap | onClick | playVideo()/pauseVideo() | Play/Pause |
| 💬 Comentarios | onClick | commentVideo(id) | Abre modal |
| 📤 Compartir | onClick | shareVideo(id) | Abre opciones |
| 🔊 Mute/Unmute | onClick | toggleMute() | Activa/desactiva sonido |
| Para ti / Siguiendo | onClick | filterVideos() | Cambia feed |

---

### Página: Marketplace
**Archivo:** `src/pages/Marketplace.jsx`
**Ruta:** `/marketplace`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadProducts()                   → Carga productos desde Supabase
searchProducts(term)             → setSearch(term)
filterByPrice(min, max)          → setPrice({min, max})
filterByCategory(category)       → setCategory(category)
filterByLocation(location)       → setLocation(location)
viewProduct(id)                  → navigate('/producto/:id')
contactSeller(id)                → navigate('/chat?user=' + id)
buyProduct(id)                   → Inicia pago
createListing()                  → navigate('/crear-producto')
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Input [Búsqueda] | onChange | searchProducts() | Filtra productos |
| Range [Precio] | onChange | filterByPrice() | Filtra por precio |
| Select [Categoría] | onChange | filterByCategory() | Filtra categoría |
| Select [Ubicación] | onChange | filterByLocation() | Filtra ubicación |
| Botón [Producto] | onClick | viewProduct(id) | /producto/:id |
| Botón [Contactar] | onClick | contactSeller(id) | /chat?user=X |
| Botón [Comprar] | onClick | buyProduct(id) | Stripe/Pago |
| Botón [➕ Vender] | onClick | createListing() | /crear-producto |

---

### Página: Chat
**Archivo:** `src/pages/Chat.jsx`
**Ruta:** `/chat`
**Tipo:** Página secundaria (con Layout)
**Tiempo real:** Firebase Realtime DB

#### Funciones:
```javascript
loadConversations()        → Carga conversaciones
selectConversation(id)     → setActiveChat(id)
sendMessage(text)          → Firebase RT + UI update
sendFile(file)             → Upload a Storage + Firebase
typingIndicator(userId)    → Muestra "escribiendo..."
markAsRead(id)             → Actualiza en Firebase
deleteConversation(id)     → Elimina chat
blockUser(id)              → Bloquea usuario
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Conversación | onClick | selectConversation(id) | Abre chat |
| Input [Mensaje] | onChange | setMessage() | Escribir |
| Botón [Enviar] | onClick | sendMessage() | Firebase RT |
| Botón [📎 Archivo] | onClick | sendFile() | Abre selector |
| Botón [🖼️ Foto] | onClick | uploadPhoto() | Camera/Galería |
| Botón [❌] | onClick | deleteConversation() | Elimina chat |
| Botón [🚫] | onClick | blockUser() | Bloquea usuario |

---

### Página: Notificaciones
**Archivo:** `src/pages/Notificaciones.jsx`
**Ruta:** `/notificaciones`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadNotifications()      → Carga desde Supabase
markAsRead(id)          → Actualiza en BD
deleteNotification(id)  → Elimina notificación
filterByType(type)      → Filtra por tipo
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Notificación | onClick | Abre detalles | Navega a origen |
| Botón [✓] | onClick | markAsRead(id) | Marca leída |
| Botón [❌] | onClick | deleteNotification(id) | Elimina |
| Filtro [Todas/Comentarios/Likes] | onClick | filterByType() | Filtra |

---

### Página: Ranking Jugadores
**Archivo:** `src/pages/RankingJugadores.jsx`
**Ruta:** `/ranking-jugadores`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadRanking()                   → Carga top 100 desde Supabase
sortBy(field)                   → Ordena por OVR/Goles/Asistencias
filterByCategory(category)      → Filtra categoría
findMyPosition()                → Resalta posición usuario
viewPlayerProfile(userId)       → navigate('/perfil/:userId')
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Jugador | onClick | viewPlayerProfile(id) | /perfil/:id |
| Select [Ordenar por] | onChange | sortBy(field) | Reordena |
| Select [Categoría] | onChange | filterByCategory() | Filtra |
| "Tu posición #45" | onClick | scrollToMe() | Destaca usuario |

---

### Página: Ranking Equipos
**Archivo:** `src/pages/RankingEquipos.jsx`
**Ruta:** `/ranking-equipos`
**Tipo:** Página secundaria (con Layout)

#### Funciones:
```javascript
loadRanking()                  → Carga ranking equipos
filterByCategory(category)     → Filtra categoría
viewTeamProfile(teamId)        → navigate('/equipo/:teamId')
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Equipo | onClick | viewTeamProfile(id) | /equipo/:id |
| Select [Categoría] | onChange | filterByCategory() | Filtra |

---

### Página: Transmisión en Vivo
**Archivo:** `src/pages/TransmisionEnVivo.jsx`
**Ruta:** `/transmision-en-vivo`
**Tipo:** Página secundaria (con Layout)
**Tecnología:** WebRTC

#### Funciones:
```javascript
startStreaming()               → Abre cámara + WebRTC
stopStreaming()                → Cierra stream
shareStreamLink()              → Copy link a clipboard
sendLiveMessage(text)          → Firebase RT
loadViewers()                  → Carga espectadores
toggleChat()                   → Muestra/oculta chat
```

#### Botones:
| Elemento | Evento | Función | Resultado |
|----------|--------|---------|-----------|
| Botón [Iniciar Transmisión] | onClick | startStreaming() | Abre cámara |
| Botón [Terminar] | onClick | stopStreaming() | Cierra stream |
| Botón [📋 Copiar Link] | onClick | shareStreamLink() | Copy to clipboard |
| Botón [💬 Chat] | onClick | toggleChat() | Muestra chat |
| Input [Mensaje] | onChange | setMessage() | Escribir |
| Botón [Enviar] | onClick | sendLiveMessage() | Firebase RT |

---

## 7️⃣ PÁGINAS DE DESARROLLO (En construcción)

Las siguientes páginas existen en rutas pero usan `PageInDevelopment` placeholder:

### Páginas con componentes básicos:
```
/equipos              → Equipos.jsx
/crear-equipo        → CrearEquipo.jsx
/torneos             → Torneos.jsx
/crear-torneo        → CrearTorneo.jsx
/amistoso            → Amistoso.jsx
/penaltis            → Penaltis.jsx
/card-fifa           → CardFIFA.jsx
/sugerencias-card    → SugerenciasCard.jsx
/estados             → Estados.jsx
/amigos              → Amigos.jsx
/buscar-ranking      → BuscarRanking.jsx
/configuracion       → ConfiguracionPage.jsx
/soporte             → Soporte.jsx (PageInDevelopment)
/privacidad          → Privacidad.jsx (PageInDevelopment)
/editar-perfil       → EditarPerfil.jsx
```

### Páginas con Layout placeholders:
```
/feed                → FeedPage
/equipo/:id          → EquipoDetallePage
/torneo/:id          → TorneoDetallePage
/usuario/:id         → UsuarioDetallePage
/ranking             → EstadisticasPage
/progreso            → Progreso
/historial-penaltis  → HistorialPage
/ayuda               → PageInDevelopment
/compartir           → PageInDevelopment
/chat-sql            → PageInDevelopment
/logros              → Logros
/estadisticas-avanzadas → EstadisticasAvanzadasPage
/comparativas        → PageInDevelopment
```

---

## 8️⃣ RESUMEN TOTAL

### Páginas de ENTRADA (sin Layout):
- ✅ **5 páginas completamente implementadas:**
  1. LoginRegisterForm (/login)
  2. SeleccionCategoria (/seleccionar-categoria)
  3. FormularioRegistroCompleto (/formulario-registro)
     - Paso 1: Credenciales
     - Paso 2: Datos personales
     - Paso 3: Datos jugador
  4. PerfilCard (/perfil-card)
  5. HomePage (/)

### Páginas SECUNDARIAS (con Layout):
- ✅ **Implementadas y funcionales:** 8 páginas
  1. Estadísticas
  2. Partidos
  3. Videos (TikTok-style)
  4. Marketplace
  5. Chat (Firebase RT)
  6. Notificaciones
  7. Ranking Jugadores
  8. Ranking Equipos
  9. Transmisión en Vivo (WebRTC)

- ⏳ **En desarrollo/Placeholders:** 30+ páginas más

### Total de Botones Documentados:
- **HeaderPage:** 4 botones
- **Menú Hamburguesa:** 28 botones
- **Stories:** 4 clickables
- **Feed:** 6 botones por post (2 posts = 12 botones)
- **Bottom Nav:** 5 botones
- **FAB:** 1 botón
- **LoginRegisterForm:** 6 botones/inputs principales
- **SeleccionCategoria:** 5 botones
- **FormularioRegistroCompleto:** 20+ inputs/botones (3 pasos)
- **Páginas secundarias:** 50+ botones adicionales

**TOTAL ESTIMADO:** 150+ botones/inputs/interacciones documentadas

---

## 9️⃣ ÍNDICE RÁPIDO POR FUNCIONALIDAD

### 🔐 Autenticación (5 páginas)
1. `/login` - Login/Registro con email
2. `/seleccionar-categoria` - Seleccionar categoría
3. `/formulario-registro` - Registro 3 pasos
4. `/perfil-card` - Card FIFA post-registro
5. `HomePage` - Acceso a app

### 🏠 Contenido Principal (9 páginas)
1. `/` - HomePage (Instagram-style feed)
2. `/videos` - TikTok-style videos
3. `/marketplace` - Facebook Marketplace
4. `/chat` - Chat en tiempo real
5. `/notificaciones` - Notificaciones push
6. `/ranking-jugadores` - Top 100
7. `/ranking-equipos` - Ranking equipos
8. `/transmision-en-vivo` - WebRTC streaming
9. `/estadisticas` - Mis estadísticas

### ⚽ Deportivo (6 páginas)
1. `/partidos` - Mis partidos
2. `/equipos` - Mis equipos
3. `/crear-equipo` - Crear equipo
4. `/torneos` - Torneos
5. `/amistoso` - Jugar amistoso
6. `/penaltis` - Juego penaltis

### 👤 Perfil (4 páginas)
1. `/perfil/me` - Mi perfil estilo Instagram (dueño)
2. `/perfil/:userId` - Perfil otro usuario (seguidor)
3. `/editar-perfil` - Editar información perfil
4. `/card-fifa` - Card FIFA con calificaciones jugador

### ⚙️ Sistema (3 páginas)
1. `/configuracion` - Configuración
2. `/soporte` - Soporte técnico
3. `/privacidad` - Política privacidad

---

**LISTA COMPLETA DE 60+ RUTAS Y FUNCIONES DOCUMENTADAS** ✅
