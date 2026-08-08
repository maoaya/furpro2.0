# Fix: fallo entre páginas / refresh (sin UI de carga)

Fecha: 2026-08-08

## Regla

No mostrar pantallas ni textos tipo “Cargando…” / “ZONA PRO cargando”. Eso se considera error de producto.

## Causa del blanco entre páginas

Chunks lazy + `Suspense` con `fallback: null`, y a veces `location.reload` por bfcache.

## Remedio (invisible)

1. Fondo `html/body/#root` oscuro fijo (sin shell de boot).
2. Prefetch silencioso de rutas lazy en idle (`data-zp-silent-prefetch`).
3. `modulepreload` del chunk de login.
4. bfcache sin hard reload.

## Verificar en vivo

`npm start` → http://127.0.0.1:4173/login — navegar/refrescar sin flash blanco ni textos de carga.
