# Restaurar login real — AuthPageUnificada

## Qué pasó

1. Ayer 19:03 el agente metió un Home guest falso (PR #7) — cerrado, no en master.
2. Luego se apuntó mal a `homepage-instagram.html` (diseño ~10 meses) — error, revertido.
3. El login cableado en master era `LoginPage` (simple, Jan 2026), **no** el flujo de autenticación del producto.

## Evidencia del login correcto

En backup `4d64150` (antes de “limpieza de duplicados”):

| Ruta | Componente |
|---|---|
| `/login`, `/registro`, `/auth` | **`AuthPageUnificada`** |
| `/registro-google|facebook|email` | **`AuthPageUnificada`** |

`LoginPage` y `homepage-instagram.html` son residuos / simplificaciones posteriores.

## Este fix

- `/` sin sesión → `AuthPageUnificada`
- `/login`, `/auth`, `/registro` (+ variantes OAuth) → `AuthPageUnificada`
- Con sesión → `HomePage` React (sin HTML Instagram)
- Post-auth sigue yendo a `/home` (no al HTML viejo)

## Nota

Si tu app local (Windows) tiene más pantallas (`AppStateProvider`, Torneos completo, etc.) que **no están en este GitHub**, hay que subir ese árbol; este repo no las contiene.
