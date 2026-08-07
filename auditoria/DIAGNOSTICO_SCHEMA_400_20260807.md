# Diagnóstico — 400/404/503 Torneos + Mensajes (2026-08-07)

Proyecto Supabase: `qqrxetxcglwrejtblwut`

## Hallazgo raíz

Hay **dos** fallos distintos mezclados en la consola:

1. **Schema incorrecto en el cliente local**  
   Errores del tipo `relation "api.mensajes" does not exist` implican `db.schema = 'api'`.  
   En este repo el cliente usa `public`. En `public` sí existen `mensajes`, `torneos`, `torneos_partidos`, `torneos_participantes`.

2. **Columnas que el front pide y la DB no tiene** (probado con anon key + `Accept-Profile: public`):

| Recurso | Columnas OK | Columnas que rompen (400 / 42703) |
|---|---|---|
| `mensajes` | `id, contenido, mensaje, remitente, usuario_id, chat_id, conversacion_id, leido, tipo, created_at, updated_at` | `destinatario`, `destinatario_id`, `user_id`, `texto` |
| `torneos_partidos` | `id, torneo_id, fecha_partido, estado_partido, equipo_a_id, equipo_b_id, arbitro_id, ubicacion, fase_torneo, goles_equipo_a, goles_equipo_b` | `estado`, `token_qr`, `nonce_uso`, `expira_en`, `usado` |
| `torneos_participantes` | `torneo_id, equipo_id, updated_at` | `usuario_id`, `user_id`, `auth_user_id`, `id` |
| `torneos` | `id, nombre, creador_id, estado, descripcion, deporte, ubicacion, fecha_inicio, gestion_cerrada, updated_at` | (depende del PATCH: no asumir `gestion`, `logo`, etc.) |

## RPCs ausentes (PGRST202)

- `obtener_torneos_usuario`
- `guardar_gestion_torneo`
- `cerrar_gestion_torneo_forever`

El loader de Torneos que llama al RPC y trata el fallo como `NETWORK_ERROR`/`503` está **mal clasificando** un 404 de función. Debe degradar a `select` sobre `torneos` (`creador_id`) y **no reintentar en loop**.

## APIs locales 404

Con Vite puro (sin `netlify dev`):

- `POST /api/gestion-torneo` → 404
- `POST /.netlify/functions/configurar-jugadores-torneo` → 404
- `POST /api/configurar-jugadores-torneo` → 404

`netlify.toml` ya reescribe `/api/*` → `/.netlify/functions/:splat` en deploy; en `vite` hay que stubear o usar `netlify dev`.

## Otros (fuera de schema)

- `Solo el creador puede borrar este torneo` — ownership (`creador_id`), no schema.
- `blob:… ERR_FILE_NOT_FOUND` — object URL revocado tras navegación; no persistir blob URLs en estado/cache.
- Uncaught `Failed to fetch` en `safeRequest` — promesas sin `catch` en session/messaging loaders del árbol local (no en este repo).

## Acción en este PR

- Selects/filtros alineados al schema real de `public`.
- Circuit-breaker: **no** deshabilitar tabla entera por columna faltante (solo por relación inexistente).
- Stubs Vite + Netlify Functions para gestión/config jugadores (soft-OK) para cortar 404 spam en local.
