# FASE 1 — Inventario completo (20260806)

**Repo:** github.com/maoaya/furpro2.0 (workspace cloud)
**Nota:** Este árbol NO incluye `AppStateProvider`, `MenuHamburguesa` moderno ni scripts `audit:fase1` del desktop local. Inventario del código presente.

## Conteos
| Tipo | Cantidad |
|------|----------|
| Archivos código src | 653 |
| Pages | 299 |
| Components | 182 |
| Hooks | 8 |
| Services | 66 |
| Contexts | 3 |
| Rutas App.jsx | 68 |
| SQL | 1 |
| Edge/functions candidatos | 5 |
| Engines/Bridges | 3 |
| Eventos CustomEvent | 6 |
| RPCs referenciados | 18 |
| Tablas .from() | 119 |

## Dependencias clave
```
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.23.1",
  "@supabase/supabase-js": "^2.87.1",
  "vite": "^7.2.4"
}
```

## Providers / Contexts
- `src/context/AuthContext.jsx` — AuthContext, AuthProvider, useAuth
- `src/context/NotificationsContext.jsx` — NotificationsProvider, useNotifications
- `src/context/RoleContext.js` — RoleContext, RoleProvider, useRole

## Rutas (App.jsx)
- `/login`
- `/registro`
- `/auth`
- `/registro-nuevo`
- `/registro-perfil`
- `/auth/callback`
- `/perfil-card`
- `/perfil`
- `/perfil/me`
- `/diagnostico-funciones`
- `/`
- `/home`
- `/feed`
- `/perfil/:userId`
- `/notificaciones`
- `/marketplace`
- `/videos`
- `/chat`
- `/penaltis`
- `/card-fifa`
- `/sugerencias-card`
- `/equipos`
- `/crear-equipo`
- `/equipo/:id`
- `/equipo/:teamId/plantilla`
- `/equipo/:teamId/plantilla-mejorada`
- `/mi-equipo/:teamId`
- `/convocar-jugadores/:teamId`
- `/mis-invitaciones`
- `/torneos`
- `/crear-torneo`
- `/crear-torneo-mejorado`
- `/crear-torneo-completo`
- `/torneo/:id`
- `/amistoso`
- `/tarjetas`
- `/ranking`
- `/ranking-clasico`
- `/ranking-jugadores`
- `/ranking-equipos`
- `/buscar-ranking`
- `/estadisticas`
- `/estadisticas-avanzadas`
- `/progreso`
- `/historial-penaltis`
- `/usuario/:id`
- `/estados`
- `/amigos`
- `/transmision-en-vivo`
- `/subir-historia`
- `/crear-torneo-avanzado`
- `/chat-instagram-new`
- `/penaltis-multijugador`
- `/arbitro`
- `/torneo/:tournamentId/standings`
- `/torneo/:tournamentId/brackets`
- `/notificaciones-torneo`
- `/editar-perfil`
- `/configuracion`
- `/logros`
- `/seccion/:slug`
- `/ayuda`
- `/soporte`
- `/privacidad`
- `/comparativas`
- `/compartir`
- `/chat-sql`
- `*`

## RPCs
- `add_user_points`
- `agregar_puntos_card`
- `agregar_puntos_jugador`
- `aplicar_sancion`
- `clean_expired_stories`
- `escanear_palabras_prohibidas`
- `get_admin_stats`
- `get_user_activity_stats`
- `increment_post_view`
- `join_team`
- `obtener_estado_sistema`
- `obtener_ranking_usuarios`
- `obtener_sanciones_activas`
- `puede_usuario_postear`
- `register_team_tournament`
- `run_sql`
- `update_group_standings`
- `verificar_rls_activo`

## Tablas Supabase (.from)
- `amigos`
- `analytics_events`
- `apelaciones_sancion`
- `api.friends`
- `api.user_activities`
- `api.usuarios`
- `arbitros`
- `auditoria`
- `available_players_for_convocation`
- `avatars`
- `blocks`
- `calificaciones_arbitro`
- `card_puntos_historial`
- `carfutpro`
- `chat_conversations`
- `chat_groups`
- `chat_messages`
- `comments`
- `config_moderacion`
- `configuracion`
- `contenido`
- `contenido_inapropiado`
- `contenido_revisar`
- `disciplinary_sanctions`
- `dominios`
- `equipos`
- `feed`
- `followers`
- `follows`
- `formularios`
- `fotos_fingerprint`
- `friend_requests`
- `friends`
- `group_locations`
- `historial_equipo`
- `intentos_login`
- `invitations`
- `jugadores`
- `jugadores_equipos`
- `likes`
- `live_stream_comments`
- `live_stream_likes`
- `live_streams`
- `logros`
- `logros_equipo`
- `marketplace`
- `marketplace_orders`
- `match_participations`
- `matches`
- `media`
- `mensajes`
- `messages`
- `notificaciones`
- `notifications`
- `organizadores`
- `pagos`
- `partidos`
- `penalty_matches`
- `penalty_player_stats`
- `post-media`
- `post_comments`
- `post_likes`
- `post_moments`
- `posts`
- `products`
- `profiles`
- `progreso`
- `promociones`
- `publicaciones`
- `push_tokens`
- `rankings`
- `recuperacion_contrasena`
- `referee_ratings`
- `referees`
- `reportes`
- `reportes_contenido`
- `reportes_generales`
- `reportes_moderacion`
- `reportes_usuarios`
- `sesiones`
- `soporte`
- `status_comments`
- `statuses`
- `stories`
- `story_views`
- `stream_comments`
- `suggestions`
- `tarjetas_fifa`
- `team-logos`
- `team_invitations`
- `team_lineups`
- `team_members`
- `team_rosters`
- `teams`
- `torneos`
- `tournament_brackets`
- `tournament_group_teams`
- `tournament_groups`
- `tournament_inscriptions`
- `tournament_invitations`
- `tournament_matches`
- `tournament_notifications`
- `tournament_player_stats`
- `tournament_referee_reports`
- `tournament_referees`
- `tournament_registrations`
- `tournament_teams`
- `tournaments`
- `transmisiones`
- `user_achievements`
- `user_activities`
- `user_cards`
- `user_locations`
- `user_points`
- `user_stories`
- `users`
- `usuarios`
- `usuarios_bloqueados`
- `valoraciones`

## Eventos
- `authUpdate`
- `autosave:success`
- `futpro:user_id`
- `modal:hidden`
- `modal:shown`
- `user-blocked`

## SQL files (muestra)
- `migrar_user_activities_api.sql`

## Edge/function candidates
- `functions/auto-confirm.js`
- `functions/notifications-subscribe.js`
- `functions/signin-proxy.js`
- `functions/signup-bypass.js`
- `functions/signup-proxy.js`
