# Fix CORS TheSportsDB + menú Forzar sistema / Recargar completa

Fecha: 2026-08-08

## Menú hamburguesa (ya en el ZIP canónico)

En `producto-deploy/assets/index-DchpCYR3.js` el menú ⋮ incluye:

| Label | Action | Comportamiento |
|---|---|---|
| Forzar sistema | `force-system` | Limpia SW/caches + soft/hard reset (`futpro:force-system`) |
| Recargar completa | `force-reload` | `location.replace` con `?_force=<base36>` (ej. `homepages?_force=msk2ilhb`) |

También: long-press (~900 ms) en Inicio → forzar sistema.

**No hace falta añadirlos de nuevo** — ya existen en el producto canónico.

## Error de consola (CORS / 429)

```
Access to fetch at 'https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=…'
from origin 'http://127.0.0.1:4173' has been blocked by CORS policy
```

Causa:

1. El cliente primero llama `POST /api/zona-pro` con `{ action: "sportsdb", path }`.
2. Si eso falla, hace fallback a TheSportsDB **desde el navegador** → CORS.
3. Muchas ligas en paralelo → a veces `429 Too Many Requests`.

En el repo faltaba la function `zona-pro-ai` (el `netlify.toml` ya reescribía `/api/zona-pro`).

## Fix aplicado

| Pieza | Rol |
|---|---|
| `functions/lib/sportsdb-proxy.mjs` | Proxy + cache 10 min + cola anti-429 |
| `functions/zona-pro-ai.js` | Netlify Function (POST `/api/zona-pro`) |
| `scripts/serve-producto.mjs` | `npm start` local con el mismo proxy |
| `package.json` | `start`/`dev` usan el servidor con proxy (no `serve` puro) |

Acciones soportadas: `sportsdb`, `fixtures`, `live`, `competition`, `team-roster`, `torneos-zp`, `on-follow`, `ping`.

Clave API (opcional): `VITE_THESPORTSDB_KEY` / `THESPORTSDB_KEY` (default `123` free).

## Verificación local

```bash
npm start
curl -s -X POST http://127.0.0.1:4173/api/zona-pro \
  -H 'Content-Type: application/json' \
  -d '{"action":"sportsdb","path":"eventsnextleague.php?id=4505"}' | head -c 200
```

En el navegador, tras abrir Home, **no** deben aparecer fetches a `www.thesportsdb.com` (solo a `/api/zona-pro`).

## Nota sobre `personal_empty`

Los logs `[SESSION][load] personal_empty` son bandeja de chat vacía (0 filas en `mensajes` / sesiones), no el fallo de TheSportsDB. Ver `auditoria/DIAGNOSTICO_ERRORES_SUPABASE_CONSOLA.md`.
