# Auditoría de contexto — Zona Pro (versión canónica permanente)

**Fecha:** 2026-08-08  
**Repo:** `maoaya/furpro2.0`  
**Tip de producto en master (antes de esta rama):** `6f3af13`  
**Producto bloqueado:** carpeta `producto-deploy/` (meta `futpro-deploy=2026-08-04T21:16:30Z`)

Este archivo es el **contexto obligatorio** para humanos y agentes: qué es el sistema, qué archivos existen, cuáles hay que eliminar/ignorar, y cómo impedir que vuelva la falla de “enero / Instagram / Vite 5173”.

---

## 1. Veredicto (léelo primero)

| Pregunta | Respuesta |
|---|---|
| ¿Cuál es LA versión del sistema? | **`producto-deploy/`** — build real Zona Pro (login jersey/trofeo, `loginpagesnew`) |
| ¿Qué NO es el producto? | El árbol Vite `src/` de enero (`80d7863`), HTML Instagram, demos raíz, `dist` generado desde ese `src` |
| ¿Cómo se corre? | `npm start` → **http://127.0.0.1:4173/** |
| ¿Cómo se publica? | Netlify `publish = "producto-deploy"` (ver `netlify.toml`) |
| ¿Cómo se actualiza? | En el PC bueno: `npm run build` → copiar `dist\` a `producto-deploy\` → push `master` |
| ¿Qué nunca hacer? | `git reset --hard 80d7863`, Vite/`npm run dev` en 5173 como producto, `publish=dist` desde src enero |

---

## 2. Cómo ocurrió la falla (para que no se repita)

1. El producto real vivía en el PC Windows (`Desktop\futpro2.0`) y en Netlify; el GitHub quedó meses sin el fuente bueno.
2. Agentes trabajaron sobre el `src/` de **enero 2026** (`80d7863`) y reescribieron UI (~`fe76f3d`).
3. Intentos de “restaurar” hicieron `reset` a enero o aproximaron Instagram / login a mano.
4. El usuario veía **5173** (Vite enero) mientras la versión correcta es el **deploy empaquetado** (`producto-deploy`, puerto **4173**).

**Causa raíz:** múltiples entradas (Vite `index.html`, `publish=dist`, HTML stubs, scripts de deploy) podían convertirse en “el sistema” sin pasar por el build canónico.

---

## 3. Archivos que DEBEN permanecer (núcleo del sistema)

### 3.1 Producto (intocable salvo actualización consciente del dist del PC)

| Ruta | Rol |
|---|---|
| `producto-deploy/` | **Única UI de producción** |
| `producto-deploy/index.html` | Meta `futpro-deploy`, bootstrap SPA |
| `producto-deploy/assets/` | Chunks: `loginpagesnew-*`, `CrearTorneo-*`, `perfilpro-*`, etc. |
| `producto-deploy/VERSION_LOCK.txt` | Candado de versión |
| `producto-deploy/README_PRODUCTO.txt` | Nota corta del deploy |

### 3.2 Candados operativos

| Ruta | Rol |
|---|---|
| `netlify.toml` | `publish = "producto-deploy"`, command = `ensure-producto-deploy` |
| `scripts/ensure-producto-deploy.mjs` | Falla el build/arranque si no hay Zona Pro / loginpagesnew / publish correcto |
| `PRODUCTO_CANONICO.md` | Resumen operativo |
| `auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md` | Este archivo (contexto completo) |
| `package.json` scripts `start` / `dev` / `check:producto` / `build` | Sirven o validan `producto-deploy`, no reconstruyen enero |

### 3.3 Backend / datos (no son la UI, se conservan)

El backend Express **sí** importa `src/main/expressApp.js` y módulos API. Por eso **no se borra todo `src/`**.

Conservar con criterio:

- `server.js`, `start.js`
- `src/main/`, `src/modules/` (API), `src/controllers/`, `src/middleware/`, `src/services/` usados por API
- `supabase/`, `functions/`, `db/`, `config/` (si aplica a backend)
- `.env.example` y secretos fuera de git

---

## 4. Archivos / rutas a ELIMINAR o dejar en cuarentena (ya movidos)

Todo lo siguiente está en **`_legacy_archivo/`**. No restaurar a la raíz ni publicarlo.

### 4.1 Impostores de producto (riesgo máximo)

| Origen | Destino cuarentena | Contenido / riesgo |
|---|---|---|
| `index.html` (raíz Vite) | `_legacy_archivo/vite-entry/` | Arranca React enero → puerto 5173 |
| `vite.config.js` | `_legacy_archivo/vite-entry/` | Build que genera `dist` falso-producto |
| `legacy-html-stubs/*` | `_legacy_archivo/legacy-html-stubs/` | `*instagram*.html` homepage/perfil |
| `src/pages/LoginPage.jsx` | `_legacy_archivo/src-ui-impostor/pages/` | Login no-Zona-Pro del árbol enero |
| `src/pages/ChatInstagram.jsx` | idem | UI Instagram |
| `src/pages/ChatInstagramNew.jsx` | idem | UI Instagram |
| `src/pages/PerfilInstagram.jsx` | idem | Perfil Instagram |
| `src/pages/AuthPageUnificada.jsx` | idem | Auth unificada aproximada, no deploy real |

### 4.2 Deploy que republica enero

| Origen | Destino | Riesgo |
|---|---|---|
| `netlify-emergency.toml` | `_legacy_archivo/netlify-alt/` | `publish=dist` + `npm run build` |
| `netlify.deploy-local.toml` | idem | `publish=dist` |
| `netlify-anti-502.toml` | idem | Config alternativa peligrosa |
| `netlify.toml.backup` / `.fixed` | idem | Pueden sobrescribir mentalmente el canónico |
| `deploy.sh`, `quick-deploy.sh`, `deploy-api.js`, `deploy-manual.js`, `trigger-deploy.js`, `pre-deploy-validation.js`, bats de force-deploy | `_legacy_archivo/deploy-scripts/` | Reconstruyen/publican `dist` Vite |

### 4.3 HTML / SW que confunden o cachean UI vieja

| Origen | Destino |
|---|---|
| Demos raíz (`login-demo.html`, `futpro-auth.html`, dashboards HTML, tests OAuth HTML, etc.) | `_legacy_archivo/html-demos/` |
| `public/*.html` stubs | `_legacy_archivo/public-stubs/` |
| `public/sw.js`, `public/service-worker.js` | `_legacy_archivo/public-stubs/` |

### 4.4 Aún en el árbol — alto riesgo residual (no borrar a ciegas; no usar como producto)

Estos siguen existiendo porque el backend u otros scripts pueden referenciarlos. **Prohibido tratarlos como UI de producción:**

| Ruta | Motivo |
|---|---|
| `src/pages/HomePage.jsx`, `src/HomePage.js` | Home del árbol enero |
| `src/pages/*` (resto UI React enero) | Páginas legacy; el producto real está en chunks de `producto-deploy/assets` |
| `src/components/*` (UI) | Componentes del SPA enero |
| `src/App*.jsx` / routers Vite | Entrada SPA enero |
| `.github/workflows/netlify-deploy.yml` | Antes hacía `npm run build` → deploy `dist` (debe quedar neutralizado) |
| Centenares de `*.md` / HTML guías en raíz | Ruido documental; no son producto |
| Archivos basura (`console.log('...')`, `({`, etc.) | Residuos; candidatos a borrado limpio |

### 4.5 Referencias git prohibidas

| Ref | Significado |
|---|---|
| `80d7863` | Master enero — **nunca** resetear el producto aquí |
| `fe76f3d` | Rotura UI 6 ago ~19:03 |
| `4f98d93` | Tip pre-rotura del agente (aún no es el deploy del PC) |
| `6cf5173` | Parche auth aproximado sobre base enero — insuficiente |
| Canónico | Contenido de `producto-deploy/` + commits `7f41589` / `f65394f` / `6f3af13`+ |

---

## 5. Inventario por tipo (auditoría del proyecto)

### 5.1 Debe vivir en producción (Netlify publish)

Solo el contenido de `producto-deploy/` (HTML + assets + favicons/imágenes del deploy).

### 5.2 Debe vivir en el repo como candado

- `netlify.toml` (único TOML activo)
- `scripts/ensure-producto-deploy.mjs`
- `PRODUCTO_CANONICO.md`
- Esta auditoría
- `_legacy_archivo/NO_REACTIVAR.md`

### 5.3 Backend (opcional según hosting API)

- Express + `src/main` + módulos API + Supabase SQL

### 5.4 Ruido / legado (no bloquea si está cuarentenado)

- `_legacy_archivo/**`
- Docs históricas en raíz (`GUIA_*`, `INVENTARIO_*`, `RESUMEN_*`, …)
- Cypress/Jest/Playwright orientados al SPA enero
- `testing/perfil_instagram.test.js` y similares

---

## 6. Reglas permanentes (para agentes y humanos)

1. **Producto = `producto-deploy/`.** Si una pantalla no sale de ahí, no es el sistema.
2. **Puerto canónico = 4173.** Si ves 5173, estás en el impostor Vite.
3. **`npm start` / `npm run dev`** solo sirven `producto-deploy`.
4. **`npm run build`** no reconstruye enero; solo valida el candado.
5. **Prohibido** `git reset --hard` a commits solo-enero.
6. **Prohibido** cambiar `netlify.toml` `publish` a `dist` o `public`.
7. **Prohibido** restaurar archivos desde `_legacy_archivo/` a la raíz “para probar”.
8. **Actualizar producto:** reemplazar archivos dentro de `producto-deploy/` con un nuevo `dist` del PC (respetar mayúsculas de assets en Linux).
9. **Verificar siempre:** `npm run check:producto` y abrir login ZONA PRO.
10. Ante duda, leer este archivo + `PRODUCTO_CANONICO.md` antes de tocar UI.

---

## 7. Checklist “jamás vuelva a suceder”

- [x] `producto-deploy/` en el repo con meta `futpro-deploy` + `loginpagesnew`
- [x] `netlify.toml` → `publish = "producto-deploy"`
- [x] Script `ensure-producto-deploy.mjs` en prestart/predev/build Netlify
- [x] Cuarentena de Vite entry, Instagram stubs, TOML alt, deploy scripts, SW
- [x] Cuarentena de páginas impostor Login/Instagram en `src/pages`
- [x] Workflow GitHub Netlify neutralizado (no deploy `dist` Vite)
- [x] Scripts `dev:legacy-src` / `build:legacy-src` fallan a propósito
- [ ] En Netlify UI: confirmar que el site usa este `netlify.toml` de `master` y redeploy
- [ ] En el PC: el fuente bueno (`Desktop\futpro2.0`) es el único lugar donde se edita UI y se genera `dist`
- [ ] (Opcional futuro) Subir el **fuente** real al repo en carpeta separada (`app-fuente/`) sin mezclarlo con `src/` enero

---

## 8. Cómo dejar esta versión “en el sistema totalmente”

1. Mergear esta rama a `master` (o ya estar en `master` con estos candados).
2. En Netlify: Deploy de `master` (Clear cache + deploy si hace falta).
3. Abrir el dominio: debe verse login **ZONA PRO** (no Instagram, no home enero).
4. Local: solo `npm start` → 4173.
5. No abrir/usar 5173. No restaurar `_legacy_archivo`.

---

## 9. Comandos de verificación

```bash
npm run check:producto
npm start
# Navegador: http://127.0.0.1:4173/
# Debe existir meta futpro-deploy y chunk loginpagesnew en Network
```

```bash
# Candados
rg 'publish\s*=\s*"producto-deploy"' netlify.toml
test ! -f index.html && test ! -f vite.config.js && echo 'Vite entry ausente OK'
test -d _legacy_archivo && test -f producto-deploy/VERSION_LOCK.txt && echo 'Cuarentena + lock OK'
```

---

## 10. Mapa mental

```
                    ┌─────────────────────────┐
                    │   PRODUCTO REAL         │
                    │   producto-deploy/      │
                    │   Netlify publish       │
                    │   npm start → :4173     │
                    └───────────▲─────────────┘
                                │
                     SOLO esta ruta es "el sistema"
                                │
     ┌──────────────────────────┼──────────────────────────┐
     │                          │                          │
     ▼                          ▼                          ▼
 src/ enero (UI)         HTML Instagram              TOML/scripts
 Vite 5173               legacy stubs                publish=dist
 → CUARENTENA            → CUARENTENA                → CUARENTENA
 _legacy_archivo/        _legacy_archivo/            _legacy_archivo/
```

---

*Fin del contexto. Cualquier cambio de UI de producto debe entrar como nuevo contenido en `producto-deploy/`, nunca reactivando el árbol enero.*
