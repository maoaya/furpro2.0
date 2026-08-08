# Cómo volver — guía operativa

## Por qué se rompió (en una frase)

El Cloud Agent del **6 ago ~19:03** (`fe76f3d`) reescribió Home/nav/notif sobre un GitHub **ya mezclado** con HTML Instagram de 2025; el **7 ago** (`bab2667`) reforzó ese HTML viejo. `master` **no** recibió esos merges; el daño está en ramas/PRs y en clones que las checkoutearon.

## Qué tiene este proyecto remoto ahora

| Pieza | Estado |
|-------|--------|
| `origin/master` (`80d7863`, ene 2026) | SPA React + redirects `/home` → `homepage-instagram.html` (residuo 2025) |
| `AuthPageUnificada.jsx` | Archivo existe; rutas usan `LoginPage` desde ene 2026 |
| Ramas agente P0/P1 | Hasta `4f98d93` (último bueno de esa cadena) |
| Ramas rotas | `fe76f3d+` (PR #7), `bab2667` (PR #10) — **no mergear** |
| UI ZONA PRO del PC (jersey/trofeo) | **No está en GitHub** |

## Elegir a qué volver

| Quieres… | Usa esto |
|----------|----------|
| GitHub limpio, sin commits del agente | **`master`** = `80d7863` |
| Mismo día 6 ago, **antes** del rediseño (con fixes P0/P1) | **`cursor/volver-antes-rotura-f7dd`** = `4f98d93` |
| Diseño ZONA PRO real del escritorio | Solo en tu PC → Local History / Timeline / `git reflog` y **push** |

---

## Pasos en tu máquina (recomendado: pre-rotura)

```bash
cd /ruta/a/furpro2.0
git fetch origin

# Opción recomendada si estabas en la cadena del agente el 6 ago:
git checkout cursor/volver-antes-rotura-f7dd
git reset --hard origin/cursor/volver-antes-rotura-f7dd
# tip debe ser: 4f98d93

# Instalar y arrancar
npm ci   # o npm install
npm run dev
```

### Si quieres solo `master` (sin fixes del 6 ago)

```bash
git fetch origin
git checkout master
git reset --hard origin/master
# tip debe ser: 80d7863
npm ci
npm run dev
```

### Si tu carpeta local está “sucia” o mezclada

```bash
git fetch origin
git stash push -u -m "backup-antes-de-volver"   # por si acaso
git checkout cursor/volver-antes-rotura-f7dd
git reset --hard origin/cursor/volver-antes-rotura-f7dd
```

### Verificar que volviste bien

```bash
git rev-parse --short HEAD
# Esperado: 4f98d93  (o 80d7863 si elegiste master)

git log -1 --oneline
# 4f98d93 test(audit): validate FP-AUTH-002 and FP-MEM-001
```

**No** hagas checkout de:
- `cursor/opt-nav-notif-mercado-f7dd` (rotura)
- `cursor/restore-homepage-instagram-f7dd` (HTML viejo)

---

## Archivos que el agente rompió (y que `4f98d93` restaura)

`App.jsx`, `BottomNav.jsx`, `NotificationsContext.jsx`, `main.jsx`, `HomePage.jsx`, `MarketplaceCompleto.jsx`, `Notificaciones.jsx`, `NotificacionesService.js`, `NotificationManager.js`

## Si el diseño bueno solo está en Windows

1. Abre esa carpeta del 6 ago en Cursor/VS Code.  
2. Timeline / Local History de `App.jsx`, login, assets.  
3. O `git reflog` si era un repo.  
4. Cuando lo tengas:

```bash
git checkout -b cursor/producto-real-6ago-f7dd
git add -A
git commit -m "restore: producto real 6 ago desde escritorio"
git push -u origin cursor/producto-real-6ago-f7dd
```

Cloud no puede recuperar lo que nunca se subió a `maoaya/furpro2.0`.

## Docs relacionados

- Forense completo: `AUDITORIA_FORENSE_DESCONFIGURACION_20260806.md`
- Momentos de mezcla: `RECUPERACION_CODIGO_PERDIDO_20260808.md`
