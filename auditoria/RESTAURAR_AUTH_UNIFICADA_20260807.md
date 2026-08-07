# Restaurar login real — ZONA PRO / AuthPageUnificada

## Qué pasó (grave)

1. Agentes trabajaron sobre **`github.com/maoaya/furpro2.0`**, un árbol **más viejo / incompleto** respecto a la app Windows moderna (`AppStateProvider`, `Torneos.jsx` grande, etc.).
2. Se reactivó por error el residuo **`homepage-instagram.html`** (diseño ~10 meses) — **revertido / cerrado** (PR #10).
3. El login cableado no era el de producto (**ZONA PRO** de la foto).

## Este fix

| Ítem | Acción |
|---|---|
| Login `/`, `/login`, `/auth`, `/registro` | `AuthPageUnificada` con UI **ZONA PRO** (foto) |
| `homepage-instagram.html`, `perfil*.html` | Movidos a `legacy-html-stubs/` (no runtime) |
| Vite | Plugin `fp-spa-route-priority` bloquea stubs HTML |
| Post-auth | `/home` React (`HomePage` / `FeedPage`) — **nunca** el HTML Instagram |

## Tu app Windows (consola 400/503)

Los stack traces con `AppStateProvider`, `NotificationItem.jsx`, `futproMetricsBridge.js`, `Torneos.jsx:2117` **no existen en este repo GitHub**.  
Para que los agentes no vuelvan a tocar el árbol equivocado: **sube/pushea ese proyecto real** a GitHub (o apunta el cloud agent a ese remoto).

## Validación

- `/login` muestra **ZONA PRO**, Gmail, Continuar con Google, Crear usuario
- `/homepage-instagram.html` no sirve el HTML viejo (cae a SPA)
