# Corrección — error al apuntar a homepage-instagram.html

## Error del agente (esta sesión)

Se asumió mal que el Home “real” era `public/homepage-instagram.html` (diseño viejo, ~10 meses).

**Eso también estuvo mal.** No hay que volver a ese HTML.

## Versión correcta a restaurar

La versión **antes del daño de ayer 19:03** es **`master` actual** (`80d7863`):

- `/` sin sesión → `LoginPage`
- `/` con sesión → `HomePage` (React) + `MainLayout`
- Login / PerfilCard “Continuar” → `/home` (`FeedPage`)

## Daño de ayer 19:03 (PR #7)

- Forzó Home guest React en `/` sin login
- **Nunca se mergeó a `master`**
- PR #7 cerrado

## Qué hacer

1. Trabajar en `master` (o mergear solo fixes que no toquen diseño).
2. **No** usar `homepage-instagram.html` como home.
3. Si la preview muestra el diseño falso: salir de la rama `cursor/opt-nav-notif-mercado-f7dd` y volver a `master`.
