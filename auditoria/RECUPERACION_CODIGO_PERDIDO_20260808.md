# Recuperación desde historial Git — qué se mezcló y qué se puede recuperar

**Fecha:** 2026-08-08  
**Repo:** `maoaya/furpro2.0`  
**Pregunta:** ¿En qué momento se mezcló código antiguo? ¿Se puede recuperar lo perdido?

---

## 1. Momentos exactos de mezcla (commits)

No hubo un solo “merge mágico”. Hubo **cuatro capas**:

### Capa A — Coexistencia estructural (oct 2025) — ya en `master`

| Fecha | Commit | Qué pasó |
|-------|--------|----------|
| ~2025-10-10 | `f976676` | Aparece / se trabaja `homepage-instagram` como home post-login |
| 2025-10-26…30 | `d68ef2f`, `037ddb4`, `cc323c0` | Se trata como **“homepage definitiva”** |
| Sigue en `master` hoy | `public/_redirects` | **`/home` → `/homepage-instagram.html` (200)** |

Evidencia en tip actual de `master` (`80d7863`):

```
/home                 /homepage-instagram.html   200
/home/*               /homepage-instagram.html   200
```

**Conclusión:** el HTML Instagram **nunca salió del producto remoto**; convivía con la SPA React. Eso es la “versión vieja” embebida **antes** del agente de agosto.

### Capa B — Swap de login (2 ene 2026) — en `master`

| Fecha | Commit | Qué pasó |
|-------|--------|----------|
| 2025-12-12 | `4d64150` | Backup: rutas `/login` → `AuthPageUnificada` |
| **2026-01-02** | **`56d7d81`** | **`LoginPage` reemplaza `AuthPageUnificada` en rutas** |
| 2026-01-18 | `80d7863` | Tip de `master` (sin más merges de diseño) |

`AuthPageUnificada.jsx` **sigue en el árbol**, pero **deja de ser la entrada** de `/login` / `/` guest.

### Capa C — Rediseño agente (6 ago 2026 ~19:03 Colombia) — **NO mergeado a master**

| Commit | Rama / PR | Efecto |
|--------|-----------|--------|
| **`fe76f3d`** | `cursor/opt-nav-notif-mercado-f7dd` / PR **#7 CLOSED** | Reescribe `App.jsx`, `HomePage.jsx`, nav, notificaciones; Home guest + mercado |
| `d614691` | misma rama | Polish encima |

Archivos tocados (recuperables desde `4f98d93`):

- `src/App.jsx`
- `src/components/BottomNav.jsx`
- `src/context/NotificationsContext.jsx`
- `src/main.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/Notificaciones.jsx`
- `src/services/NotificacionesService.js`
- `src/services/NotificationManager.js`
- (+ alta de `HomeMercadoFichajes.jsx` en el commit de rotura)

### Capa D — Reactivación explícita del HTML viejo (7 ago 2026) — **NO mergeado**

| Commit | Rama / PR | Efecto |
|--------|-----------|--------|
| **`bab2667`** | `cursor/restore-homepage-instagram-f7dd` / PR **#10 CLOSED** | `RootRoute`: sesión → `window.location.replace('/homepage-instagram.html')` |
| `ad0922d` | misma rama | Revert parcial del redirect |

Aquí el agente **confundió** el residuo Instagram con “el home real del producto”.

---

## 2. ¿Se puede recuperar el código perdido?

### Sí — desde este remoto GitHub

| Qué recuperar | Punto Git | Cómo |
|---------------|-----------|------|
| Estado remoto limpio (ene 2026), sin ramas agente | `origin/master` = `80d7863` | `git checkout master && git reset --hard origin/master` |
| Cadena P0/P1 del 6 ago **antes** del rediseño | `4f98d93` / rama `cursor/volver-antes-rotura-f7dd` | `git checkout cursor/volver-antes-rotura-f7dd` |
| Archivos concretos pisados por `fe76f3d` | tree de `4f98d93` | `git checkout 4f98d93 -- src/App.jsx src/pages/HomePage.jsx …` |
| Login `AuthPageUnificada` en rutas (backup dic 2025) | `4d64150` | checkout selectivo de `App.jsx` / página |
| Aproximación ZONA PRO del agente (sin assets reales) | `5328e9e` / PR #11 | ya en rama `cursor/restore-auth-unificada-f7dd` |

### No — no existe en este remoto

| Qué | Por qué |
|-----|---------|
| UI ZONA PRO del **6 ago en Windows** (jersey / trofeo reales) | Nunca se pusheó; no hay blobs ni assets en historial |
| `AppStateProvider`, Torneos “grande”, bridge metrics del escritorio | No aparecen en `git rev-list --all --objects` como producto completo |
| Historial anterior a sep 2025 | `86c1726` (“history rewritten”) — raíz huérfana; lo anterior a ese squash **no está** en este clone |

---

## 3. Comandos de recuperación recomendados

### Opción A — Volver al GitHub “oficial” (sin cambios agente)

```bash
git fetch origin
git checkout master
git reset --hard origin/master
```

### Opción B — Volver al estado Cloud del 6 ago **antes** de `fe76f3d`

```bash
git fetch origin
git checkout cursor/volver-antes-rotura-f7dd
# tip = 4f98d93
```

### Opción C — Restaurar solo los 10 archivos pisados por el rediseño (sobre master)

```bash
git fetch origin
git checkout master
git checkout 4f98d93 -- \
  src/App.jsx \
  src/components/BottomNav.jsx \
  src/context/NotificationsContext.jsx \
  src/main.jsx \
  src/pages/HomePage.jsx \
  src/pages/MarketplaceCompleto.jsx \
  src/pages/Notificaciones.jsx \
  src/services/NotificacionesService.js \
  src/services/NotificationManager.js
# Nota: HomeMercadoFichajes.jsx NO existía antes; no restaurar desde fe76f3d
```

### Opción D — Producto real del escritorio (única fuente)

En la carpeta Windows del 6 ago:

1. Cursor / VS Code → **Local History / Timeline** de `App.jsx`, login, assets.  
2. O `git reflog` / stash si esa carpeta era un repo.  
3. Subir ese árbol a una rama nueva y abrir PR.

Cloud **no puede** inventar esos archivos si nunca estuvieron en `origin`.

---

## 4. Advertencia: “recuperar master” ≠ quitar Instagram

Aunque vuelvas a `80d7863`, **`/home` sigue apuntando a `homepage-instagram.html`** vía `_redirects`.  
Eso no lo introdujo el agente de agosto; ya era configuración de producción remota desde ~oct 2025.

Para aislar ese residuo hace falta un cambio **nuevo** (cuarentena como en `5328e9e` / `legacy-html-stubs/`, y corregir `_redirects` / `netlify.toml`) **después** de tener claro cuál es el home React canónico del producto real.

---

## 5. Diagrama de mezcla

```
sep 2025  86c1726  history rewritten (raíz actual del remoto)
    │
oct 2025  homepage-instagram.html = “home definitiva” + redirects /home
    │
dic 2025  4d64150  backup AuthPageUnificada en rutas
    │
ene 2026  56d7d81  LoginPage sustituye Auth en rutas
    │
ene 2026  80d7863  tip master (aún con redirects Instagram)
    │
6 ago     4f98d93  P0/P1 agente (último bueno de esa cadena)
    │
6 ago 19:03  fe76f3d  REDISEÑO (mezcla semántica / UI nueva “sin sentido”)
    │
7 ago     bab2667  REACTIVA HTML oct-2025 como home “canónico”
    │
7 ago     5328e9e  aproximación ZONA PRO (no es el escritorio real)
```

---

## 6. Respuesta directa

| Pregunta | Respuesta |
|----------|-----------|
| ¿Cuándo se mezcló código antiguo? | **Estructuralmente desde oct 2025** (Instagram HTML + redirects). **Agudizado** el **6 ago 19:03** (`fe76f3d`) y **7 ago** (`bab2667`). |
| ¿Se puede recuperar lo que el agente pisó el 6 ago? | **Sí** → `4f98d93` / `cursor/volver-antes-rotura-f7dd`. |
| ¿Se puede recuperar el diseño ZONA PRO del PC? | **No desde este GitHub.** Solo desde el escritorio (Local History / reflog local) y luego push. |

*Complementa: `AUDITORIA_FORENSE_DESCONFIGURACION_20260806.md`.*
