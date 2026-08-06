# FASE 14 — Compilación (20260806)

## Dev (`:5173`)
- Vite 7.3.0 ready ~148ms.
- Nav full-load mediana ~100ms (domcontentloaded + 500ms settle).
- Transform on-demand; más módulos en red (incluye paths `/src/*`).

## Production build
- `npm run build` → **exit 0** en 2.89s.
- 324 modules transformed (mucho código en `src/` **no entra** al grafo de `App` → deuda/muerto o entry incompleta).
- Warning: chunk `App-*.js` **546 kB** (gzip ~131 kB) > 500 kB.
- Otros: vendor 162 kB, supabase 169 kB, firebase 80 kB.

## Preview (`:4173`)
| Ruta | status | ms | rootText | buttons |
|------|--------|----|----------|---------|
| /login | 200 | 445 | 211 | 5 |
| /home | 200 | 424 | 408 | 6 |
| /torneos | 200 | 426 | 214 | 11 |
| /marketplace | 200 | 444 | **0** | 10 |
| /ranking-jugadores | 200 | 424 | 4556 | 2 |

## Diffs relevantes
1. Preview marketplace con **rootText=0** (UI vacía) vs dev con texto parcial — bug de contenido/env en prod bundle.
2. Preview más lento en cold goto (~420ms) vs dev (~100ms) en esta VM (sin HMR cache de módulos).
3. No se auditó `https://futpro.vip` en esta corrida (opcional del plan); base local priorizada tras `ERR_CONNECTION_REFUSED` original.
