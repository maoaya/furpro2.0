# 📊 MAPEO DE DEPENDENCIAS - FutPro 2.0

## 🔗 Servicios por Funcionalidad

### 🔐 Autenticación & Autorización
```
AuthService
├── signInWithEmail()          → Supabase Auth
├── signUpWithEmail()          → Supabase Auth, UserService
├── signInWithGoogle()         → OAuth Google
├── signInWithFacebook()       → OAuth Facebook
├── logout()                   → SessionStorage
└── loadUserProfile()          → UserService → Supabase 'users'

UserService
├── checkUserExists()          → Supabase 'usuarios'
├── createUser()               → Supabase 'usuarios'
├── updateUser()               → Supabase 'usuarios'
└── ProfileManager             → Supabase 'profiles'

SecurityService
├── validateToken()            → JWT validation
├── encryptData()              → Crypto
├── checkPermissions()         → Supabase RLS policies
└── blockUser()                → Supabase 'blocked_users'
```

### ⚽ Deportes & Competiciones
```
TournamentManager (Principal)
├── createTournament()         → Supabase 'tournaments'
├── getTournamentTeams()       → Supabase 'tournament_registrations'
├── updateTournament()         → Supabase 'tournaments'
└── BracketManager             → Supabase 'tournament_brackets'

MatchManager
├── createMatch()              → Supabase 'matches'
├── updateMatch()              → Supabase 'matches'
├── getMatchDetails()          → Supabase 'match_details'
├── PartidoService (obsoleto)
└── MatchParticipationService  → Supabase 'match_participants'

TeamManager
├── crearEquipo()              → Supabase 'equipos'
├── editarEquipo()             → Supabase 'equipos'
├── addPlayerToTeam()          → Supabase 'team_members'
├── TeamStatsService           → Supabase 'team_stats'
└── EquipoService (obsoleto)

PenaltyService
├── calculateAccuracy()        → Cálculo local
└── subscribeToPenaltyMatch()  → Firebase Realtime + Supabase 'penalty_matches'
```

### 💬 Comunicación Real-Time
```
ChatManager
├── initializeSocket()         → Socket.io conexión
├── openChat()                 → Supabase 'chat_rooms'
├── sendMessage()              → Supabase 'messages'
├── loadChatMessages()         → Supabase 'messages'
└── markMessagesAsRead()       → Supabase 'messages'

StreamManager
├── initializeSocket()         → Socket.io namespace '/streaming'
├── startStream()              → WebRTC + Supabase 'streams'
├── watchStream()              → WebRTC peer connection
├── createPeerConnection()     → WebRTC PeerConnection API
└── toggleCamera/Microphone    → getUserMedia() API
```

### 📊 Publicaciones & Contenido
```
PostService
├── createPost()               → Supabase 'posts'
├── getPost()                  → Supabase 'posts'
├── likePost()                 → Supabase 'post_likes'
├── updatePost()               → Supabase 'posts'
└── deletePost()               → Supabase 'posts'

StoryService
├── createStory()              → Supabase 'stories'
├── getStories()               → Supabase 'stories'
└── deleteStory()              → Supabase 'stories'

SearchManager
├── searchUsers()              → Supabase Full Text Search 'users'
├── searchTeams()              → Supabase Full Text Search 'equipos'
├── searchMatches()            → Supabase Full Text Search 'partidos'
└── searchTournaments()        → Supabase Full Text Search 'tournaments'
```

### 🏅 Logros & Progresión
```
AchievementManager
├── asignarLogro()             → Supabase 'achievements'
├── listarLogros()             → Supabase 'user_achievements'
├── calcularProgreso()         → Lógica de progresión
└── LogrosService (duplicado)

CardManager / CardService
├── calculateTierFromPoints()  → Lógica de tiers
├── calculateProgress()        → Porcentaje de progreso
├── CARD_TIERS                 → Supabase 'card_tiers'
└── user_cards                 → Supabase 'user_cards'

RatingManager
├── rateUser()                 → Supabase 'user_ratings'
├── getUserRating()            → Supabase 'user_ratings'
└── updateRating()             → Supabase 'user_ratings'
```

### 🛍️ Mercado & Transacciones
```
MarketplaceService
├── listItem()                 → Supabase 'marketplace_items'
├── getItems()                 → Supabase 'marketplace_items'
├── purchaseItem()             → Supabase 'marketplace_transactions'
├── sellItem()                 → Supabase 'marketplace_items'
└── SecurityService            → Validación de transacciones
```

### 👥 Relaciones Sociales
```
AmigosService
├── addFriend()                → Supabase 'friendships'
├── removeFriend()             → Supabase 'friendships'
├── getFriends()               → Supabase 'friendships'
└── blockFriend()              → BlockManager

BlockManager
├── blockUser()                → Supabase 'blocked_users'
├── unblockUser()              → Supabase 'blocked_users'
└── getBlockedUsers()          → Supabase 'blocked_users'

InvitacionesService
├── sendInvitation()           → Supabase 'invitations'
├── acceptInvitation()         → Supabase 'invitations'
├── rejectInvitation()         → Supabase 'invitations'
└── getInvitations()           → Supabase 'invitations'
```

### 📱 Notificaciones
```
NotificationManager
├── sendNotification()         → Firebase Cloud Messaging
├── getNotifications()         → Supabase 'notifications'
└── markAsRead()               → Supabase 'notifications'

NotificacionesService (en expansión)
├── getNotificaciones()        → Supabase 'notificaciones'
└── Necesita: sendNotification, deleteNotification

MobileManager
├── registerServiceWorker()    → Service Worker API
├── sendPushNotification()     → Web Push API
└── initializePWA()            → PWA Manifest
```

### 📊 Analíticas & Tracking
```
AnalyticsManager
├── trackEvent()               → Supabase 'analytics_events'
├── trackMatchEvent()          → Supabase 'analytics_events'
├── trackPageView()            → Supabase 'analytics_events'
├── trackUserInteraction()     → Supabase 'analytics_events'
└── flushEvents()              → Batch insert a Supabase

UserActivityTracker
├── trackActivity()            → Supabase 'user_activity'
└── getActivityLog()           → Supabase 'user_activity'
```

### 🔧 Utilidades
```
UIManager
├── showToast()                → DOM manipulation
├── showModal()                → DOM manipulation
├── showLoading()              → DOM manipulation
└── hideLoading()              → DOM manipulation

CameraService
├── requestCameraPermission()  → MediaDevices API
├── startCamera()              → getUserMedia()
├── capturePhoto()             → Canvas API
└── startVideoRecording()      → MediaRecorder API

ContentModerationService
├── validateContent()          → NLP/Filter
├── reportContent()            → Supabase 'content_reports'
├── blockUser()                → Supabase 'blocked_users'
└── reviewReports()            → Supabase 'content_reports'
```

### 🏥 Árbitros & Referees
```
ArbitroManager (Incompleto)
├── crearArbitro()             → Supabase 'referees' (stub)
├── editarArbitro()            → Supabase 'referees' (stub)
├── eliminarArbitro()          → Supabase 'referees' (stub)
├── listarArbitros()           → Supabase 'referees' (stub)
└── obtenerArbitro()           → Supabase 'referees' (stub)

CalificacionArbitroManager (Incompleto)
├── guardarCalificacionArbitro()  → Supabase 'referee_ratings' (stub)
└── obtenerDatosTorneo()          → Supabase 'tournaments' (stub)
```

---

## 📑 Componentes por Página

### HomePage
```
HomePage.jsx
├── FeedPage (sub-page)
├── PostService       → Cargar posts
├── ChatManager       → Avisos de chat
├── NotificationManager → Mostrar notificaciones
└── AnalyticsManager  → trackPageView('/')
```

### LoginPage
```
LoginPage.jsx
├── AuthService
│   ├── signInWithEmail()
│   ├── signInWithGoogle()
│   └── signInWithFacebook()
├── UserService       → Cargar perfil
├── UIManager         → Toast errores
└── AnalyticsManager  → trackEvent('login')
```

### CrearEquipo
```
CrearEquipo.jsx
├── TeamManager
│   └── crearEquipo()
├── UserService       → ID usuario
├── AnalyticsManager  → trackEvent('team_created')
└── UIManager         → Toast confirmación
```

### Torneos
```
TorneosPage.jsx
├── TournamentManager → getTournaments()
├── BracketManager    → generateBracket()
├── SearchManager     → searchTournaments()
└── AnalyticsManager  → trackPageView('/torneos')
```

### Ranking
```
RankingJugadoresPage.jsx
├── SearchManager     → searchUsers()
├── TeamStatsService  → getTeamRanking()
├── AnalyticsManager  → trackEvent('view_ranking')
└── RatingManager     → getUserRating()
```

### Chat
```
ChatPage.jsx
├── ChatManager
│   ├── initializeChat()
│   ├── openChat()
│   ├── sendMessage()
│   └── loadChatMessages()
├── UserService       → Get user info
└── AnalyticsManager  → trackEvent('chat_message')
```

### Streaming
```
LiveStreamPage.jsx
├── StreamManager
│   ├── startStream()
│   ├── watchStream()
│   └── createPeerConnection()
├── CameraService     → Captura de video
├── UIManager         → Controls
└── AnalyticsManager  → trackEvent('stream_start')
```

### Marketplace
```
Marketplace.jsx
├── MarketplaceService
│   ├── getItems()
│   ├── purchaseItem()
│   └── listItem()
├── SecurityService   → Validar transacción
├── UserService       → Wallet info
└── AnalyticsManager  → trackEvent('purchase')
```

### Penaltis
```
PenaltisPage.jsx
├── PenaltyService
│   ├── calculateAccuracy()
│   └── subscribeToPenaltyMatch()
├── StreamManager     → Multiplayer setup
├── AnalyticsManager  → trackMatchEvent()
└── UIManager         → Game UI
```

### Moderación
```
ModerationPage.jsx
├── ContentModerationService
│   ├── reviewReports()
│   ├── validateContent()
│   └── blockUser()
├── SecurityService   → User permissions
├── UserService       → User data
└── AnalyticsManager  → trackEvent('moderation_action')
```

---

## 📦 Flujos de Datos Principales

### Flujo de Registro
```
FormularioRegistroCompleto
  ↓
AuthService.signUpWithEmail()
  ↓
Supabase Auth (crea usuario)
  ↓
UserService.createUser()
  ↓
Supabase 'usuarios' (perfil)
  ↓
ProfileManager.updateProfile()
  ↓
Supabase 'profiles' (datos adicionales)
  ↓
HomePage (redirect)
```

### Flujo de Creación de Torneo
```
CrearTorneoMejorado.jsx
  ↓
TournamentManager.createTournament()
  ↓
Supabase 'tournaments'
  ↓
BracketManager.generateBracket()
  ↓
Supabase 'tournament_brackets'
  ↓
InvitacionesService.sendInvitation()
  ↓
Supabase 'invitations'
  ↓
NotificationManager.sendNotification()
  ↓
Firebase Cloud Messaging
```

### Flujo de Chat
```
ChatPage.jsx
  ↓
ChatManager.openChat()
  ↓
Socket.io (conexión)
  ↓
ChatManager.sendMessage()
  ↓
Socket.io emit
  ↓
Backend: socket.on('message')
  ↓
Supabase 'messages' (persistencia)
  ↓
Otros usuarios reciben vía Socket.io
  ↓
ChatManager.handleNewMessage()
  ↓
UI actualiza
```

### Flujo de Streaming
```
LiveStreamPage.jsx
  ↓
StreamManager.startStream()
  ↓
CameraService.startCamera()
  ↓
getUserMedia() (captura)
  ↓
WebRTC PeerConnection
  ↓
Socket.io signal (SDP, ICE candidates)
  ↓
Viewers reciben stream
  ↓
Supabase 'streams' (metadata)
```

### Flujo de Marketplace
```
MarketplaceDetalle.jsx
  ↓
MarketplaceService.purchaseItem()
  ↓
SecurityService.validateTransaction()
  ↓
Supabase 'marketplace_transactions'
  ↓
Supabase 'marketplace_items' (actualizar stock)
  ↓
UserService.updateWallet()
  ↓
AnalyticsManager.trackEvent('purchase')
```

---

## 🗄️ Esquema de Base de Datos (Supabase)

### Tablas de Autenticación
```
auth.users (Supabase Auth)
├── id (UUID)
├── email
├── encrypted_password
├── email_confirmed_at
└── last_sign_in_at

public.users
├── id (FK: auth.users.id)
├── email
├── created_at
└── metadata

public.profiles
├── id (FK: users.id)
├── avatar_url
├── full_name
├── bio
└── updated_at
```

### Tablas de Deportes
```
public.equipos
├── id (UUID)
├── nombre
├── owner_id (FK: users.id)
├── descripcion
├── created_at
└── stats (jsonb)

public.team_members
├── id (UUID)
├── team_id (FK: equipos.id)
├── player_id (FK: users.id)
├── position
└── jersey_number

public.partidos / matches
├── id (UUID)
├── home_team_id (FK: equipos.id)
├── away_team_id (FK: equipos.id)
├── date
├── status
├── score_home
├── score_away
└── referee_id (FK: referees.id)

public.tournaments
├── id (UUID)
├── name
├── organizer_id (FK: users.id)
├── status
├── tournament_start
├── tournament_end
└── category

public.tournament_brackets
├── id (UUID)
├── tournament_id (FK: tournaments.id)
├── structure (jsonb)
└── current_round

public.tournament_registrations
├── id (UUID)
├── tournament_id (FK: tournaments.id)
├── team_id (FK: equipos.id)
├── captain_id (FK: users.id)
└── status
```

### Tablas de Comunicación
```
public.messages
├── id (UUID)
├── sender_id (FK: users.id)
├── recipient_id (FK: users.id)
├── content
├── created_at
└── read_at

public.chat_rooms
├── id (UUID)
├── participants (array)
├── created_at
└── last_message_at

public.posts
├── id (UUID)
├── author_id (FK: users.id)
├── content
├── image_url
├── created_at
└── updated_at

public.post_likes
├── id (UUID)
├── post_id (FK: posts.id)
├── user_id (FK: users.id)
└── created_at

public.post_comments
├── id (UUID)
├── post_id (FK: posts.id)
├── author_id (FK: users.id)
├── content
└── created_at

public.stories
├── id (UUID)
├── author_id (FK: users.id)
├── media_url
├── created_at
└── expires_at
```

### Tablas de Streaming
```
public.streams
├── id (UUID)
├── streamer_id (FK: users.id)
├── title
├── status (active/ended)
├── started_at
├── ended_at
└── viewer_count

public.stream_viewers
├── id (UUID)
├── stream_id (FK: streams.id)
├── viewer_id (FK: users.id)
└── joined_at
```

### Tablas de Sistema
```
public.achievements
├── id (UUID)
├── name
├── description
├── icon_url
└── points

public.user_achievements
├── id (UUID)
├── user_id (FK: users.id)
├── achievement_id (FK: achievements.id)
└── unlocked_at

public.card_tiers
├── id (UUID)
├── name
├── min_points
├── max_points
└── rewards (jsonb)

public.user_cards
├── id (UUID)
├── user_id (FK: users.id)
├── card_tier_id (FK: card_tiers.id)
├── current_points
└── updated_at

public.notificaciones
├── id (UUID)
├── user_id (FK: users.id)
├── message
├── type
├── read
└── created_at

public.analytics_events
├── id (UUID)
├── user_id (FK: users.id)
├── event_name
├── properties (jsonb)
├── created_at
└── page

public.user_activity
├── id (UUID)
├── user_id (FK: users.id)
├── action
├── metadata (jsonb)
└── timestamp

public.marketplace_items
├── id (UUID)
├── seller_id (FK: users.id)
├── title
├── description
├── price
├── stock
├── created_at
└── updated_at

public.marketplace_transactions
├── id (UUID)
├── buyer_id (FK: users.id)
├── seller_id (FK: users.id)
├── item_id (FK: marketplace_items.id)
├── amount
├── status
└── created_at

public.blocked_users
├── id (UUID)
├── blocker_id (FK: users.id)
├── blocked_id (FK: users.id)
└── created_at

public.friendships
├── id (UUID)
├── user1_id (FK: users.id)
├── user2_id (FK: users.id)
├── status (pending/accepted)
└── created_at

public.referees
├── id (UUID)
├── user_id (FK: users.id)
├── license_number
├── certifications (array)
├── active
└── created_at

public.referee_ratings
├── id (UUID)
├── referee_id (FK: referees.id)
├── tournament_id (FK: tournaments.id)
├── rating (1-5)
├── feedback
└── created_at

public.invitations
├── id (UUID)
├── sender_id (FK: users.id)
├── recipient_id (FK: users.id)
├── type (team/tournament/friend)
├── target_id (UUID)
├── status (pending/accepted/rejected)
└── created_at

public.content_reports
├── id (UUID)
├── reporter_id (FK: users.id)
├── content_id (UUID)
├── content_type (post/story/comment)
├── reason
├── status
└── created_at
```

---

## 🔐 RLS Policies (Row Level Security)

### En Supabase se debe configurar:

```sql
-- Users tabla
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view public profiles"
  ON profiles FOR SELECT
  USING (true);

-- Messages tabla
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Posts tabla
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Etc...
```

---

## 📋 Checklist de Funcionalidades

- [x] Autenticación email/OAuth
- [x] Perfiles de usuario
- [x] CRUD equipos
- [x] CRUD partidos
- [x] Sistema de torneos
- [x] Chat en tiempo real
- [x] Streaming con WebRTC
- [x] Marketplace
- [x] Logros y tarjetas
- [x] Ranking
- [x] Publicaciones (feed)
- [x] Historias
- [x] Notificaciones
- [x] Analytics
- [x] Moderación
- [x] PWA y Push notifications
- [ ] Árbitros (en desarrollo)
- [ ] Penaltis multiplayer (beta)
- [ ] Pago integrado
- [ ] IA para recomendaciones

---

**Generado**: 16 de enero de 2026
