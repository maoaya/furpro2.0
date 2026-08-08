# Estado del sistema — restaurado / no dañado

**Fecha:** 2026-08-08

## Veredicto

El **producto final NO está dañado**.

| Comprobación | Estado |
|---|---|
| ZIP `deploy-6a7256d5ffd58e44433d5158` | Intactos hashes SHA256 |
| `producto-deploy/` | = ZIP (Zona Pro) |
| http://127.0.0.1:4173/login | **200** · login **ZONA PRO** |
| UI enero en `src/pages` | **Eliminada del árbol activo** (correcto) |
| Cuarentena | `_legacy_archivo/src-ui-enero/` (no reactivar) |

Lo que se quitó fue el **impostor de enero**, no Zona Pro. Restaurar enero sería volver a romper el sistema.

## Qué significa “restaurar” aquí

| Pedido | Acción correcta |
|---|---|
| Restaurar la app que funciona | Ya está: `npm start` → `:4173` |
| Restaurar enero en `src/` | **NO** — prohibido |
| Poder editar muchas funciones | Subir el **fuente** del PC a `src-zona-pro/` |

## Para editar el proyecto (orden de trabajo)

1. **Correr producto:** `npm start` → http://127.0.0.1:4173/login  
2. **Editar UI:** sube `Desktop\futpro2.0` (fuente con `.jsx`) →  
   `node scripts/import-fuente-pc.mjs ruta.zip` → edita en `src-zona-pro/`  
3. **Publicar cambios UI:** build → sync a `producto-deploy` → push  
4. **Editar API/SQL:** `functions/`, `supabase/`, `src/main` (backend)

Sin el fuente del PC, este repo solo tiene el **build** compilado: se puede usar y desplegar, pero no editar pantallas como JSX.

## Errores de consola Supabase (chat / ranking / historias)

Diagnóstico: `auditoria/DIAGNOSTICO_ERRORES_SUPABASE_CONSOLA.md`  
SQL fix: `auditoria/sql/2026-08-08_fix_schema_drift_chat_ranking_historias.sql`

Hay que **ejecutar el SQL en el Dashboard de Supabase** (este agente no tiene `service_role` / MCP auth).
