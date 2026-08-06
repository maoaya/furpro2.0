# FASE 6 — Estado global (20260806)

## Árbol de providers (App.jsx)
`AuthProvider → NotificationsProvider → Router`

## Contexts
- src/context/AuthContext.jsx
- src/context/NotificationsContext.jsx
- src/context/RoleContext.js

## localStorage keys detectadas
- `amistosoPoints`
- `arbitroPerfil`
- `authCompleted`
- `authTimestamp`
- `card_futpro_borrador`
- `currentUser`
- `draft_carfutpro`
- `equipo_tecnico`
- `futpro-theme`
- `futpro_cards`
- `futpro_historial`
- `futpro_historial_completo`
- `futpro_pending_actions`
- `futpro_publicaciones_globales`
- `futpro_push_subscription`
- `futpro_remember`
- `futpro_search_history`
- `futpro_session_id`
- `futpro_session_start`
- `futpro_token`
- `futpro_tracking_disabled`
- `futpro_user`
- `futpro_user_card_data`
- `futpro_video_likes`
- `grupos`
- `lastPath`
- `loginSuccess`
- `navigationLogs`
- `patrocinios`
- `penaltyGoals`
- `penaltyPoints`
- `penalty_achievements`
- `penalty_best`
- `penalty_games`
- `penalty_goals`
- `penalty_shots`
- `pendingProfileData`
- `perfil`
- `postLoginRedirect`
- `postLoginRedirectReason`
- `post_auth_origin`
- `post_auth_target`
- `publicaciones`
- `registroCompleto`
- `registroExitoso`
- `registroProgreso`
- `selectedCategoria`
- `session`
- `show_first_card`
- `tempRegistroData`
- `token`
- `torneos`
- `userEmail`
- `userId`
- `userLoggedIn`
- `userRegistrado`
- `usuarioActivo`
- `usuarios`

## sessionStorage keys
- `lastPath`
- `navigationLogs`

## Riesgos
- Auth + Notifications son las únicas fuentes Context; mucho estado vive en páginas (useState local) → riesgo de inconsistencia al navegar.
- Duplicación probable de sesión: AuthContext + llamadas getSession/getUser en páginas.
