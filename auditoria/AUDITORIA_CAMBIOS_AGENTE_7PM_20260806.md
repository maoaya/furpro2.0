# Auditoría — cambios del agente ~19:00 (ayer)

Zona horaria de referencia: **UTC-5** (≈ Colombia) → los commits de `2026-08-07 00:03 UTC` son **2026-08-06 19:03** local.

Agente: https://cursor.com/agents/bc-07b20079-9fe1-440f-95d7-004112dbf7dd  
Repo GitHub: `maoaya/furpro2.0`  
**Importante:** estos commits están en ramas `cursor/*` y PRs. **NO están mergeados en `master`.**

---

## El daño de diseño (el que viste)

| Hora local UTC-5 | Commit | Qué hizo mal |
|---|---|---|
| 19:03 | `fe76f3d` | Reescribió `App.jsx`, metió lazy routes, cambió notificaciones, agregó `HomeMercadoFichajes` |
| 19:03 | `d614691` | **Forzó HomePage React en `/` para guests** (sin login) — diseño falso |
| 19:03 | `5151358` | Tests del mercado guest |

Eso muestra:
- “Iniciar sesión” en un Home que no es el tuyo  
- Stories demo Lucia/Mateo/Sofia  
- Widget Contenido  
- Franja Mercado  

Tu Home real: **`public/homepage-instagram.html`**

PR culpable: https://github.com/maoaya/furpro2.0/pull/7 → **NO MERGEAR / cerrar**

---

## Otros cambios del mismo agente (misma noche, no rediseño visual)

| Hora UTC-5 | PR | Tema |
|---|---|---|
| ~18:32 | #2 | Solo docs auditoría |
| ~18:41 | #3 | Auth health 401 |
| ~18:45 | #4 | Schema gate products |
| ~18:48 | #5 | /perfil SPA |
| ~18:53 | #6 | useAuth + cleanup canales |
| ~19:05 | #8 | Schema 400 + create nav |
| ~19:16 | #9 | Invitaciones realtime (cerrado) |

---

## Estado de `master` ahora

`master` = `80d7863` — **sin** los commits de rediseño guest.  
Si la preview muestra el Home falso, está corriendo una rama `cursor/opt-nav-notif-mercado-f7dd` (u otra), **no** master limpio.

---

## Restauración

PR #10: https://github.com/maoaya/furpro2.0/pull/10  
- Login / sesión → `homepage-instagram.html`  
- Sin rediseñar UI  

---

## Acción pedida

1. Cerrar PR #7 (rediseño).  
2. No mergear #7/#8 si tocan Home visual sin tu OK.  
3. Usar master o mergear solo #10 para restaurar entrada al Home real.  
4. Si tu app local (Windows) tiene otro árbol, ese código **no está** en este GitHub — hay que subirlo aparte.
