# Restaurar Home real — sin rediseño

## Qué pasó

Agentes cambiaron la entrada de la app y mostraron un **HomePage React** (stories demo Lucia/Mateo, mercado guest, widget Contenido) que **no es el Home creado**.

El Home del producto documentado y existente en el repo es:

**`public/homepage-instagram.html`** (~5100 líneas, HTML definitivo)

## Qué NO se toca en este fix

- No se rediseña UI
- No se reescribe homepage-instagram.html
- No se mete mercado/guest en `/`

## Qué se restaura

| Flujo | Antes (roto por agente) | Ahora |
|---|---|---|
| `/` sin sesión | Home guest React | Login |
| `/` con sesión | HomePage React | `homepage-instagram.html` |
| Login OK | `/home` (FeedPage) | `homepage-instagram.html` |
| PerfilCard “Continuar” | `/home` | `homepage-instagram.html` |

## PRs de agentes a NO mergear por diseño

- PR #7 (`cursor/opt-nav-notif-mercado-f7dd`) — fuerza Home guest en `/`
- Cualquier PR que reemplace homepage-instagram por otro layout
