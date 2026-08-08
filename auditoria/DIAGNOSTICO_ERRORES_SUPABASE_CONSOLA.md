# Diagnóstico: errores Supabase en consola (Zona Pro)

Fecha: 2026-08-08  
Proyecto: `qqrxetxcglwrejtblwut`  
Producto: `producto-deploy` (bundle `index-DchpCYR3.js`)

## Veredicto

No es un fallo del zip ni del servidor local `:4173`.  
La app llama a tablas/RPCs/columnas que **no coinciden** con el schema real de Postgres.

## Errores → causa real

| Llamada | HTTP | Causa verificada |
|---|---|---|
| `rpc/rpc_ranking_equipos` | 400 | Función existe pero usa `e.deporte_nombre`; `equipos` solo tiene `deporte` |
| `rpc/fp_obtener_bandeja_chat` | 404 | Función **no existe** |
| `GET mensajes?...&destinatario=eq...` | 400 | Tabla existe; columna `destinatario` **no** |
| `GET futpro_chat_sessions?...conversation_id,owner_id...` | 400 | Tabla legacy con `conversacion_id`, `peer_id`, `usuario_id`, `last_message`, `tipo` |
| `rpc/obtener_sugerencias_usuarios` | 400 | Función usa `am.id`; `amistades` **no tiene** `id` (`usuario_id`/`amigo_id`) |
| `GET historias?...expires_at=gt...` | 400 | Columna ausente; existen `fecha_vencimiento` / `expira_en` |
| `runSingleFlight timeout: page-coordinator:home-page` | — | Cascada: home espera datos que fallan arriba |
| `[SESSION][load] personal_empty` | — | Inbox vacío porque bandeja/RPC/tablas fallan |

## Fix

SQL listo (idempotente):

`auditoria/sql/2026-08-08_fix_schema_drift_chat_ranking_historias.sql`

### Cómo aplicarlo (obligatorio en Dashboard)

Este entorno cloud **no puede autenticar Supabase MCP** ni tiene `service_role`. Hay que ejecutar el SQL a mano:

1. Abrir [SQL Editor](https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/sql/new)
2. Pegar el contenido completo del archivo SQL
3. Run
4. Hard refresh de la app (`Ctrl+Shift+R`)

### Verificación rápida (después del SQL)

```bash
node auditoria/sql/verify-schema-fix.mjs
```

Esperado: todos los probes en verde / HTTP 200 (o 200 con `[]` vacío).

## Nota sobre editar UI

Estos errores son de **base de datos**.  
Para cambiar pantallas/JSX hace falta subir la fuente real del PC a `src-zona-pro/` (ver `auditoria/COMO_SUBIR_FUENTE_PARA_EDITAR.md`).
