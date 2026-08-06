# FASE 2 — Navegación live (20260806)

Base: `http://127.0.0.1:5173`
Auth: **sin sesión** en este checkout (no hay script open-login-with-token).

## Por ruta
| Ruta | status | navMs | interactiveMs | blocked | hardFail | buttons | rootText |
|------|--------|-------|---------------|---------|----------|---------|----------|
| /login | 200 | 184 | 686 | no | no | 5 | 211 |
| / | 200 | 185 | 687 | no | no | 5 | 211 |
| /home | 200 | 116 | 620 | no | no | 6 | 408 |
| /feed | 200 | 101 | 604 | no | no | 6 | 408 |
| /videos | 200 | 100 | 602 | no | no | 5 | 43 |
| /estados | 200 | 97 | 599 | no | no | 2 | 122 |
| /subir-historia | 200 | 91 | 592 | no | no | 2 | 83 |
| /transmision-en-vivo | 200 | 96 | 597 | no | no | 1 | 81 |
| /marketplace | 200 | 89 | 591 | no | no | 3 | 48 |
| /perfil | 200 | 16 | 518 | YES | no | 0 | 0 |
| /perfil/me | 200 | 103 | 605 | no | no | 1 | 20 |
| /perfil-card | 200 | 100 | 601 | no | no | 5 | 211 |
| /editar-perfil | 200 | 104 | 606 | no | no | 1 | 25 |
| /equipos | 200 | 88 | 590 | no | no | 41 | 859 |
| /crear-equipo | 0 | 7 |  | YES | YES |  |  |
| /torneos | 200 | 103 | 606 | no | no | 11 | 214 |
| /crear-torneo | 200 | 101 | 603 | no | no | 3 | 343 |
| /amistoso | 200 | 100 | 602 | no | no | 3 | 691 |
| /ranking-equipos | 200 | 90 | 594 | no | no | 1 | 2855 |
| /ranking-jugadores | 200 | 103 | 605 | no | no | 2 | 4559 |
| /ranking | 200 | 92 | 593 | no | no | 4 | 531 |
| /chat | 200 | 122 | 623 | no | no | 2 | 11 |
| /notificaciones | 200 | 94 | 596 | no | no | 1 | 90 |
| /privacidad | 200 | 93 | 596 | no | no | 1 | 10 |
| /configuracion | 200 | 99 | 600 | no | no | 4 | 124 |
| /estadisticas | 200 | 98 | 600 | no | no | 1 | 26 |
| /card-fifa | 200 | 98 | 600 | no | no | 3 | 214 |
| /penaltis | 200 | 128 | 631 | no | no | 3 | 728 |
| /amigos | 200 | 104 | 607 | no | no | 2 | 123 |

## Stress multi-nav
| i | ruta | ms | blocked | hardFail |
|---|------|----|---------|----------|
| 0 | /home | 246 | no | no |
| 0 | /torneos | 239 | no | no |
| 0 | /equipos | 243 | no | no |
| 0 | /marketplace | 244 | no | no |
| 0 | /ranking-jugadores | 248 | no | no |
| 0 | /chat | 256 | no | no |
| 0 | /privacidad | 247 | no | no |
| 0 | /videos | 245 | no | no |
| 0 | /transmision-en-vivo | 245 | no | no |
| 0 | /crear-torneo | 246 | no | no |
| 1 | /home | 274 | no | no |
| 1 | /torneos | 249 | no | no |
| 1 | /equipos | 246 | no | no |
| 1 | /marketplace | 246 | no | no |
| 1 | /ranking-jugadores | 246 | no | no |
| 1 | /chat | 245 | no | no |
| 1 | /privacidad | 251 | no | no |
| 1 | /videos | 272 | no | no |
| 1 | /transmision-en-vivo | 246 | no | no |
| 1 | /crear-torneo | 244 | no | no |

## Objetivo &lt;1ms
Full document navigation no puede ser &lt;1ms. Mediana navMs: **100ms**.
