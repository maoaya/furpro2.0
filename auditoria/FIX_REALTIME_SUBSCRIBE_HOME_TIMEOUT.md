# Fix: Realtime `after subscribe()` + `page-coordinator:home-page` timeout

Fecha: 2026-08-08

## Errores

1. `cannot add postgres_changes callbacks ... after subscribe()`
2. `runSingleFlight timeout: page-coordinator:home-page`

## Causa

- Supabase JS no permite `.on()` en un canal ya suscrito. Al remount/reusar el mismo nombre de canal (`likes:…`, `social_scope_…`, etc.), `channel(name)` devolvía el canal viejo → `.on()` lanzaba → error boundary → Home no terminaba de cargar → timeout 8s.
- El proxy TheSportsDB serializado también empujaba el load de Home cerca del límite.

## Fix (bundle `index-DchpCYR3.js`)

- `supabase.channel()` parcheado: limpia canales previos del mismo base name y crea topic único (`name::timestamp`).
- Singleton client `V2_RT` (fuerza cliente nuevo tras deploy).
- `getOrSubscribeChannel` (IO): try/catch + remove + retry.
- `runSingleFlight`: timeout 20s y soft-fail (warn, no uncaught reject).
- Proxy SportsDB: gap 120ms, hasta 3 fetches en paralelo.

Hard refresh con `index-DchpCYR3.js?v=fix-realtime-v2-20260808`.
