# 🚀 REFERENCIA RÁPIDA - FutPro 2.0

## Acceso Rápido a Servicios

### Por Funcionalidad

**Autenticación**
- `AuthService.signInWithEmail()` - Login email/contraseña
- `AuthService.signUpWithEmail()` - Registro nuevo usuario
- `AuthService.signInWithGoogle()` - OAuth Google
- `SecurityService.validateToken()` - Validar JWT

**Usuarios**
- `UserService.createUser()` - Crear perfil usuario
- `UserService.updateUser()` - Actualizar perfil
- `ProfileManager.getProfile()` - Obtener perfil
- `ProfileManager.uploadProfilePicture()` - Subir avatar

**Equipos**
- `TeamManager.crearEquipo()` - Crear equipo
- `TeamManager.addPlayerToTeam()` - Agregar jugador
- `TeamStatsService.getTeamStats()` - Obtener estadísticas
- `SearchManager.searchTeams()` - Buscar equipos

**Partidos**
- `MatchManager.createMatch()` - Crear partido
- `MatchManager.updateMatch()` - Actualizar score
- `MatchParticipationService.registerPlayerInMatch()` - Registrar jugador
- `PenaltyService.calculateAccuracy()` - Calcular precisión

**Torneos**
- `TournamentManager.createTournament()` - Crear torneo
- `TournamentService.registerTeamInTournament()` - Inscribir equipo
- `BracketManager.generateBracket()` - Generar bracket

**Chat & Comunicación**
- `ChatManager.openChat()` - Abrir chat privado
- `ChatManager.sendMessage()` - Enviar mensaje
- `StreamManager.startStream()` - Iniciar transmisión
- `StreamManager.watchStream()` - Ver transmisión

**Contenido**
- `PostService.createPost()` - Crear publicación
- `PostService.likePost()` - Dar like
- `StoryService.createStory()` - Crear historia
- `SearchManager.searchUsers()` - Buscar usuarios

**Notificaciones**
- `NotificationManager.sendNotification()` - Enviar notificación
- `MobileManager.sendPushNotification()` - Push notification
- `NotificacionesService.getNotificaciones()` - Obtener notificaciones

**Logros & Puntos**
- `AchievementManager.asignarLogro()` - Desbloquear logro
- `CardManager.calculateTierFromPoints()` - Calcular tier
- `RatingManager.rateUser()` - Calificar usuario

**Moderación**
- `ContentModerationService.validateContent()` - Validar contenido
- `ContentModerationService.reportContent()` - Reportar contenido
- `BlockManager.blockUser()` - Bloquear usuario

**Social**
- `AmigosService.addFriend()` - Agregar amigo
- `InvitacionesService.sendInvitation()` - Enviar invitación
- `BlockManager.getBlockedUsers()` - Ver bloqueados

**Marketplace**
- `MarketplaceService.listItem()` - Listar item
- `MarketplaceService.purchaseItem()` - Comprar item

**Analytics**
- `AnalyticsManager.trackEvent()` - Registrar evento
- `AnalyticsManager.trackPageView()` - Registrar vista de página
- `UserActivityTracker.trackActivity()` - Registrar actividad

**Multimedia**
- `CameraService.startCamera()` - Acceder a cámara
- `CameraService.capturePhoto()` - Capturar foto

---

## Atajos de Implementación

### Login OAuth
```javascript
import { AuthService } from '@/services/AuthService';
const auth = new AuthService();
await auth.signInWithGoogle();
```

### Crear Equipo
```javascript
import { TeamManager } from '@/services/TeamManager';
const manager = new TeamManager();
await manager.crearEquipo({
  nombre: 'Mi Equipo',
  descripcion: '...'
});
```

### Enviar Mensaje
```javascript
import { ChatManager } from '@/services/ChatManager';
const chat = new ChatManager();
await chat.sendMessage({
  chatId: 'chat-123',
  content: 'Hola',
  userId: 'user-456'
});
```

### Crear Torneo
```javascript
import { TournamentManager } from '@/services/TournamentManager';
const tournament = new TournamentManager();
await tournament.createTournament({
  name: 'Campeonato 2026',
  category: 'profesional'
});
```

### Trackear Evento
```javascript
import { AnalyticsManager } from '@/services/AnalyticsManager';
const analytics = new AnalyticsManager();
analytics.trackEvent('tournament_created', {
  tournamentId: 'tour-123',
  category: 'profesional'
});
```

---

## Mapeo de Tablas → Servicios

| Tabla | Servicios | Operaciones |
|-------|-----------|------------|
| users | AuthService, UserService | ✓ CRUD |
| equipos | TeamManager, EquipoService | ✓ CRUD |
| partidos | MatchManager, PartidoService | ✓ CRUD |
| tournaments | TournamentManager, TournamentService | ✓ CRUD |
| messages | ChatManager | ✓ CRD |
| posts | PostService | ✓ CRUD |
| stories | StoryService | ✓ CRD |
| streams | StreamManager | ✓ CR |
| achievements | AchievementManager | ✓ CR |
| notificaciones | NotificacionesService | ✓ CR |
| marketplace_items | MarketplaceService | ✓ CRUD |
| blocked_users | BlockManager | ✓ CRD |
| friendships | AmigosService | ✓ CRUD |
| invitations | InvitacionesService | ✓ CRUD |
| analytics_events | AnalyticsManager | ✓ C |
| referee_ratings | CalificacionArbitroManager | ⚠ (stub) |
| referees | ArbitroManager | ⚠ (stub) |

---

## Estado por Módulo

### ✅ Completamente Funcional
- AuthService (email + OAuth)
- UserService (CRUD usuarios)
- TeamManager (CRUD equipos)
- TournamentManager (CRUD torneos)
- ChatManager (chat realtime)
- StreamManager (streaming WebRTC)
- PostService (CRUD posts)
- AnalyticsManager (tracking completo)
- MarketplaceService (compra/venta)
- NotificationManager (notificaciones)
- AchievementManager (logros)
- SearchManager (búsqueda global)

### ⚠️ Parcialmente Funcional
- NotificacionesService (solo lectura)
- ArbitroManager (solo stubs)
- CalificacionArbitroManager (solo stubs)
- PartidoService (solo getPartidos)

### 🔄 En Mejora
- CardManager/CardService (sistema de tarjetas)
- PenaltyService (multiplayer beta)
- ContentModerationService (moderación avanzada)

---

## URLs de Configuración Importantes

### Supabase
```
URL: https://qqrxetxcglwrejtblwut.supabase.co
Key: eyJ... (en .env)
```

### Firebase
```
projectId: futpro-xxxxx
apiKey: AIza... (en .env)
```

### OAuth Callbacks
```
Google: https://futpro.vip/auth/callback
Facebook: https://futpro.vip/auth/callback
Netlify: https://futpro-vip.netlify.app/auth/callback
```

### Socket.io
```
Desarrollo: http://localhost:8080
Producción: https://futpro.vip
Namespace Chat: /chat
Namespace Stream: /streaming
```

---

## Llamadas Comunes a Supabase

### Obtener datos
```javascript
const { data, error } = await supabase
  .from('tabla')
  .select('*')
  .eq('id', userId);
```

### Insertar
```javascript
const { data, error } = await supabase
  .from('tabla')
  .insert([{ campo: valor }])
  .select()
  .single();
```

### Actualizar
```javascript
const { data, error } = await supabase
  .from('tabla')
  .update({ campo: nuevo_valor })
  .eq('id', id);
```

### Eliminar
```javascript
const { data, error } = await supabase
  .from('tabla')
  .delete()
  .eq('id', id);
```

### Suscripción Realtime
```javascript
supabase
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tabla' },
    payload => console.log(payload)
  )
  .subscribe();
```

---

## Rutas Principales

| Ruta | Componente | Auth |
|------|-----------|------|
| / | HomePage | ✓ |
| /auth/login | LoginPage | ✗ |
| /equipos | Equipos | ✓ |
| /equipos/:id | EquipoDetallePage | ✓ |
| /equipos/crear | CrearEquipo | ✓ |
| /torneos | TorneosPage | ✓ |
| /torneos/:id | TorneoDetailPage | ✓ |
| /torneos/crear | CrearTorneo | ✓ |
| /partidos | PartidosPage | ✓ |
| /ranking | RankingJugadoresPage | ✓ |
| /chat | ChatPage | ✓ |
| /chat/:id | ChatPage | ✓ |
| /streaming | LiveStreamPage | ✓ |
| /marketplace | Marketplace | ✓ |
| /penaltis | PenaltisPage | ✓ |
| /perfil/:id | PerfilAvanzado | ✓ |
| /admin | AdminDashboard | ✓ (admin) |
| /moderacion | ModerationPage | ✓ (mod) |

---

## Comandos Útiles

### Desarrollo
```bash
npm run dev          # Vite dev server (5173)
npm start           # Backend Express (8080)
npm test            # Jest tests
```

### Build
```bash
npm run build       # Vite build
netlify deploy      # Deploy a Netlify
```

### Testing
```bash
npm test -- --watch
npx jest -c jest.backend.config.cjs
npx jest -c jest.frontend.config.cjs
```

---

## Certificados/Credenciales Necesarios

- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] VITE_GOOGLE_CLIENT_ID
- [ ] VITE_FACEBOOK_CLIENT_ID
- [ ] FIREBASE_API_KEY
- [ ] FIREBASE_PROJECT_ID
- [ ] NETLIFY_AUTH_TOKEN

---

## Checklist de Setup Nuevo Dev

- [ ] Clonar repo
- [ ] `npm install`
- [ ] Copiar `.env.example` → `.env`
- [ ] Actualizar variables de entorno
- [ ] `npm run dev`
- [ ] Verificar Supabase conecta
- [ ] Verificar Firebase conecta
- [ ] Login test
- [ ] Ver página de inicio

---

## Documentación Rápida

- **Servicios**: [INVENTARIO_FUTPRO_2.0.md](./INVENTARIO_FUTPRO_2.0.md)
- **Dependencias**: [MAPEO_DEPENDENCIAS_FUTPRO.md](./MAPEO_DEPENDENCIAS_FUTPRO.md)
- **JSON Completo**: [INVENTARIO_FUTPRO_2.0.json](./INVENTARIO_FUTPRO_2.0.json)

---

**Last Updated**: 16 de enero de 2026  
**Versión**: 2.0.1
