# Auditoría técnica integral — 20260806

## Estado
**COMPLETA (fases 0–15).** Sin ediciones a `src/`.

## Índice de entregables
| Fase | Archivo |
|------|---------|
| Gate 0 | `GATE0_RUNTIME_20260806.md` |
| 1 Inventario | `FASE1_INVENTARIO_20260806.md` / `.json` |
| 2 Navegación | `FASE2_NAVEGACION_LIVE_20260806.md` / `.json`, `FASE2_HTTP_SMOKE_20260806.json` |
| 3 Auth | `FASE3_AUTH_CALLS_20260806.md` / `.csv` / `.json` |
| 4 Supabase | `FASE4_SUPABASE_STATIC_20260806.json`, `FASE4_SUPABASE_RUNTIME_20260806.json` |
| 5 Renders | `FASE5_RENDERS_20260806.md` / `.json` |
| 6 Estado | `FASE6_ESTADO_GLOBAL_20260806.md` / `.json` |
| 7 useEffect | `FASE7_USEEFFECT_20260806.md` / `.json` |
| 8 Botones | `FASE8_BOTONES_20260806.md` / `.json` |
| 9 Eventos | `FASE9_EVENTOS_20260806.md` / `.json` |
| 10 Media | `FASE10_MEDIA_20260806.json` |
| 11 Memoria | `FASE11_MEMORIA_20260806.md` / `.json` |
| 12 Main thread | `FASE12_MAIN_THREAD_20260806.md` / `.json` |
| 13 Errores | `FASE13_ERRORES_20260806.md` / `.json` |
| 14 Build | `FASE14_COMPILACION_20260806.md`, `FASE14_PREVIEW_SMOKE_20260806.json` |
| **15 Matriz** | **`MATRIZ_PROBLEMAS_20260806.md`** |

## Scripts usados (solo `auditoria/`)
- `_run_static_audit.mjs`
- `_run_live_nav_audit.mjs`

## Hallazgo ejecutivo
Runtime local restaurado (`:5173`). Pasada live sin sesión: **avg nav ~100ms**, heap **+96MB**, **94× auth health 401**, schema **404/400** (valoraciones/products). Ver matriz P0/P1.
