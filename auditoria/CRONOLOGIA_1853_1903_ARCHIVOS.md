# Cronología forense de archivos — 18:53 vs 19:03 (Colombia, UTC−5)

**Fecha del evento:** 2026-08-06  
**Zona horaria:** America/Bogota (UTC−5)  
**Versión exacta a recuperar (última buena):** `4f98d93` — **18:55:46**  
**Punto de rotura:** `fe76f3d` — **19:03:10**

---

## 1. Resumen ejecutivo

| Hora (Colombia) | Commit | Qué es |
|-----------------|--------|--------|
| **18:52:57** | `1f441f0` | FP-AUTH-002 — páginas a `useAuth` |
| **18:53:00** | `e252b46` | FP-MEM-001 — cleanup canales/intervals |
| **18:55:46** | `4f98d93` | Evidencia/tests — **última versión buena** |
| **19:03:10** | `fe76f3d` | **ROTURA** — rediseño nav/notif/mercado Home |
| **19:03:32** | `d614691` | Polish Home guest + mercado |
| **19:03:47** | `5151358` | Docs/validación de esa oleada |

**Recuperación exacta:** checkout `4f98d93` / rama `cursor/volver-antes-rotura-f7dd` o `cursor/recuperar-exacta-1855-f7dd`.

---

## 2. Ventana 18:53 — archivos tocados

### 2.1 Commit `1f441f0` — 18:52:57  
`fix(auth): FP-AUTH-002 pages use useAuth instead of getSession/getUser`

| Estado | Archivo |
|--------|---------|
| A | `auditoria/_validate_fp_auth_002.mjs` |
| M | `src/pages/ConfiguracionCuenta.jsx` |
| M | `src/pages/EditarPerfil.jsx` |
| M | `src/pages/FeedPage.jsx` |
| M | `src/pages/LoginPage.jsx` |
| M | `src/pages/Notificaciones.jsx` |
| M | `src/pages/PartidoArbitroPanel.jsx` |
| M | `src/pages/PerfilInstagram.jsx` |
| M | `src/pages/RankingJugadoresCompleto.jsx` |
| M | `src/pages/RegistroPerfil.jsx` |
| M | `src/pages/TorneoDetalleCompleto.jsx` |
| M | `src/pages/TransmisionEnVivo.jsx` |

**12 archivos** (1 alta + 11 páginas).

### 2.2 Commit `e252b46` — 18:53:00 (minuto exacto 18:53)  
`fix(mem): FP-MEM-001 cleanup realtime channels and intervals`

| Estado | Archivo |
|--------|---------|
| A | `auditoria/_validate_fp_mem_001.mjs` |
| A | `src/utils/realtimeCleanup.js` |
| M | `src/components/CommentsModal.jsx` |
| M | `src/context/NotificationsContext.jsx` |
| M | `src/pages/Amigos.jsx` |
| M | `src/pages/Estados.jsx` |
| M | `src/pages/HomePage.jsx` |
| M | `src/pages/MarketplaceCompleto.jsx` |
| M | `src/pages/NotificacionesTorneoPage.jsx` |
| M | `src/pages/Perfil.jsx` |
| M | `src/pages/TorneoBracketPage.jsx` |
| M | `src/pages/TorneoStandingsPage.jsx` |
| M | `src/services/AnalyticsManager.js` |
| M | `src/services/AutoSaveService.js` |

**14 archivos** — cleanup de memoria/realtime (no rediseño visual).

### 2.3 Commit `4f98d93` — 18:55:46 (cierre ventana buena)  
`test(audit): validate FP-AUTH-002 and FP-MEM-001`

| Estado | Archivo |
|--------|---------|
| A | `auditoria/VALIDACION_FP_AUTH_002.json` |
| A | `auditoria/VALIDACION_FP_AUTH_002.md` |
| A | `auditoria/VALIDACION_FP_MEM_001.json` |
| A | `auditoria/VALIDACION_FP_MEM_001.md` |
| M | `auditoria/_validate_fp_mem_001.mjs` |
| M | `src/config/supabase.js` |
| M | `src/services/RealtimeService.js` |

**Este commit es la versión exacta a restaurar.**

### 2.4 Lista unificada — código `src/` vivo a las 18:53–18:55 (sin docs)

Unión de cambios de producto en la ventana 18:52–18:55:

```
src/components/CommentsModal.jsx
src/config/supabase.js
src/context/NotificationsContext.jsx
src/pages/Amigos.jsx
src/pages/ConfiguracionCuenta.jsx
src/pages/EditarPerfil.jsx
src/pages/Estados.jsx
src/pages/FeedPage.jsx
src/pages/HomePage.jsx
src/pages/LoginPage.jsx
src/pages/MarketplaceCompleto.jsx
src/pages/Notificaciones.jsx
src/pages/NotificacionesTorneoPage.jsx
src/pages/PartidoArbitroPanel.jsx
src/pages/Perfil.jsx
src/pages/PerfilInstagram.jsx
src/pages/RankingJugadoresCompleto.jsx
src/pages/RegistroPerfil.jsx
src/pages/TorneoBracketPage.jsx
src/pages/TorneoDetalleCompleto.jsx
src/pages/TorneoStandingsPage.jsx
src/pages/TransmisionEnVivo.jsx
src/services/AnalyticsManager.js
src/services/AutoSaveService.js
src/services/RealtimeService.js
src/utils/realtimeCleanup.js          (nuevo)
```

---

## 3. Ventana 19:03 — archivos usados / modificados (ROTURA)

### 3.1 Commit `fe76f3d` — 19:03:10 ← **punto de rotura**  
`feat: fast SPA nav, fix realtime notifications, mercado on home`

| Estado | Archivo | Rol en la rotura |
|--------|---------|------------------|
| M | `src/App.jsx` | Rutas / RootRoute / Home guest |
| M | `src/components/BottomNav.jsx` | Nav SPA |
| A | `src/components/HomeMercadoFichajes.jsx` | Strip mercado nuevo |
| M | `src/context/NotificationsContext.jsx` | Realtime notif (reescrito) |
| M | `src/main.jsx` | Bootstrap |
| M | `src/pages/HomePage.jsx` | Home rediseñado |
| M | `src/pages/MarketplaceCompleto.jsx` | Integración mercado |
| M | `src/pages/Notificaciones.jsx` | UI notificaciones |
| M | `src/services/NotificacionesService.js` | Servicio |
| M | `src/services/NotificationManager.js` | Manager |

**10 archivos** — **905 inserciones / 420 eliminaciones** en este commit.

### 3.2 Commit `d614691` — 19:03:32  
`fix(home): show mercado de fichajes for guests on /`

| Estado | Archivo |
|--------|---------|
| A | `auditoria/_validate_nav_notif_mercado.mjs` |
| M | `src/App.jsx` |
| M | `src/pages/HomePage.jsx` |

### 3.3 Commit `5151358` — 19:03:47  
`test(audit): validate nav, notifications, home mercado`

| Estado | Archivo |
|--------|---------|
| A | `auditoria/VALIDACION_NAV_NOTIF_MERCADO.json` |
| A | `auditoria/VALIDACION_NAV_NOTIF_MERCADO.md` |

### 3.4 Lista unificada — `src/` tocado en el cluster 19:03 (`4f98d93` → `5151358`)

```
src/App.jsx                              ← crítico
src/components/BottomNav.jsx             ← crítico
src/components/HomeMercadoFichajes.jsx   ← NUEVO (solo existe post-rotura)
src/context/NotificationsContext.jsx     ← crítico
src/main.jsx                             ← crítico
src/pages/HomePage.jsx                   ← crítico
src/pages/MarketplaceCompleto.jsx
src/pages/Notificaciones.jsx
src/services/NotificacionesService.js
src/services/NotificationManager.js
```

---

## 4. Comparativa directa 18:53 → 19:03

| Archivo | A las 18:53 (e252b46/ventana) | A las 19:03 (fe76f3d+) |
|---------|-------------------------------|-------------------------|
| `App.jsx` | Sin cambio en esta ventana | **Reescrito** |
| `BottomNav.jsx` | Sin cambio | **Reescrito** |
| `HomeMercadoFichajes.jsx` | No existía | **Creado** |
| `HomePage.jsx` | Solo cleanup mem | **Rediseño guest/mercado** |
| `NotificationsContext.jsx` | Cleanup canales | **Refactor grande** |
| `main.jsx` | Sin cambio | **Modificado** |
| `Notificaciones.jsx` | useAuth (18:52) | **Otra vez modificado** |
| `MarketplaceCompleto.jsx` | Cleanup mem | **Integración mercado** |
| `NotificacionesService.js` | Sin cambio | **Modificado** |
| `NotificationManager.js` | Sin cambio | **Modificado** |
| Páginas useAuth (Feed, Login, Perfil…) | Cambiadas 18:52 | **No tocadas** en 19:03 |
| `realtimeCleanup.js` | Creado 18:53 | Sigue |

**Conclusión:** a las 18:53 el agente hacía fixes P0/P1 (auth/memoria). A las 19:03 **cambió de objetivo** y reescribió la cáscara de navegación/Home — ahí se percibe la “versión sin sentido”.

---

## 5. Minutos siguientes (contexto, no 19:03)

| Hora | Commit | Notas |
|------|--------|-------|
| 19:05:50 | `a905d97` | Otra rama: schema/nav, crea `NotificationItem.jsx` |
| 19:10:07 | `2e7ff71` | Schema 400 / softs API |

Estas **no** son el cluster de rotura visual de `fe76f3d`, pero también son del mismo día.

---

## 6. Cómo recuperar la versión exacta

```bash
git fetch origin
git checkout cursor/recuperar-exacta-1855-f7dd
# o:
git checkout cursor/volver-antes-rotura-f7dd
git reset --hard 4f98d93

git rev-parse --short HEAD   # debe: 4f98d93
npm ci && npm run dev
```

Para ver solo el diff de la rotura:

```bash
git diff --stat 4f98d93 fe76f3d
git diff --name-status 4f98d93 fe76f3d
```

---

## 7. Referencias Git

| Ref | SHA |
|-----|-----|
| Exacta buena | `4f98d93a85c6e9f0cc4d45ff0ff54eb1a9a76b21` |
| Minuto 18:53 | `e252b4671f23edf5009b3a30f98376c7fa81819d` |
| Rotura 19:03 | `fe76f3d23542ab0d7139c70ca2e44ae1de0d9151` |
| Tip rama rotura | `5151358` (`cursor/opt-nav-notif-mercado-f7dd`) |

*Generado desde `git show` / `git log` con `TZ=America/Bogota`.*
