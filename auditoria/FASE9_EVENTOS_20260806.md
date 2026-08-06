# FASE 9 — Eventos / Realtime (20260806)

Fuente: `FASE9_EVENTOS_20260806.json`

## Conteos estáticos
| Tipo | Sites |
|------|-------|
| addEventListener | 71 |
| setInterval | 7 |
| supabase.channel / .channel( | 35 |
| CustomEvent names únicos | 6 |

## Riesgos
1. **35 channel sites** sin inventario de unsubscribe garantizado en todos los unmounts (ver FASE7 flags `addListener && !hasCleanup`).
2. Auth: `onAuthStateChange` en AuthContext **y** en `supabaseClient.js` → posibles handlers duplicados.
3. Health/online detection + realtime keep patterns pueden competir en main thread al cambiar de ruta.
4. Pocos eventos `futpro:*` en este árbol (6); el diseño de sync por CustomEvent del árbol moderno **no está presente** aquí.

## Evidencia live
- No se observó freeze hard en stress (20 navegaciones, 0 blocked).
- Crecimiento de heap +96 MB sugiere retención (listeners/caches) a validar con sesión real.
