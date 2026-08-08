# Auditoría de contexto — Zona Pro (ZIP canónico = sistema total)

**Fecha:** 2026-08-08  
**ZIP vinculado (archivos totales del producto):** `deploy-6a7256d5ffd58e44433d5158.zip`  
**Copia en repo:** `auditoria/deploy-6a7256d5ffd58e44433d5158.zip`  
**Publicación:** carpeta `producto-deploy/` (mismo contenido; casing Linux)  
**Meta:** `futpro-deploy=2026-08-04T21:16:30Z`  
**Bundle:** `assets/index-DchpCYR3.js` · **Login:** `assets/loginpagesnew-BPP0r_st.js`

Este documento es el **contexto obligatorio**. El ZIP es la versión del sistema; todo lo demás del repo que simule UI es impostor o legado.

Inventario tabular del ZIP: [`INVENTARIO_ZIP_TABLA.md`](./INVENTARIO_ZIP_TABLA.md)  
**Lista total keep/delete del repo:** [`LISTA_TOTAL_CONSERVAR_ELIMINAR.md`](./LISTA_TOTAL_CONSERVAR_ELIMINAR.md)  
Manifiesto JSON (hashes): [`MANIFEST_DEPLOY_ZIP.json`](./MANIFEST_DEPLOY_ZIP.json) · `producto-deploy/MANIFEST_CANONICO.json`

---

## 1. Veredicto

| Pregunta | Respuesta |
|---|---|
| ¿Cuál es LA versión? | El contenido del ZIP `deploy-6a7256d5ffd58e44433d5158` servido desde `producto-deploy/` |
| ¿Cómo se corre? | `npm start` → **http://127.0.0.1:4173/** |
| ¿Cómo se publica? | Netlify `publish = "producto-deploy"` + `node scripts/ensure-producto-deploy.mjs` |
| ¿Qué hay que eliminar/aislar? | Entrada Vite enero, Instagram HTML, TOML `publish=dist`, demos, SW viejos → `_legacy_archivo/` |
| ¿Qué del ZIP NO se publica? | `netlify.toml` (Windows PC) y `__tmp_measure_home.js` |

**Verificación hecha:** 59 archivos publicables del ZIP = `producto-deploy/` (0 mismatches de SHA256). Solo difería el casing de nombres (Windows lower vs Linux mixed).

---

## 2. Cómo dejar esta versión en el sistema “totalmente”

1. `producto-deploy/` = contenido del ZIP (ya verificado).
2. `netlify.toml` del **repo** (no el del ZIP) con `publish = "producto-deploy"`.
3. Merge a `master` + **Clear cache & deploy** en Netlify.
4. Local solo puerto **4173**. Nunca 5173 como producto.
5. Actualizaciones futuras: nuevo `dist` del PC → ZIP →  
   `node scripts/sync-producto-from-zip.mjs ruta.zip` → commit → push.
6. Candado: `npm run check:producto` valida hashes del ZIP.

---

## 3. Archivos vinculados totales del ZIP (qué es el producto)

El ZIP trae **63 entradas** (61 archivos + dirs). Publicables: **59**.

### 3.1 Raíz del deploy

| Archivo | Rol | ¿Publicar? |
|---|---|---|
| `index.html` | SPA Zona Pro + meta `futpro-deploy` + scripts `index-DchpCYR3.js` | **SÍ** |
| `favicon.ico` / `favicon.svg` / `icons.svg` | Iconos | **SÍ** |
| `crear-torneo-premium.jpg` / `.svg` | Arte crear torneo | **SÍ** |
| `netlify.toml` | Config **Windows PC** (`publish=C:\Users\...\dist`, `npm run build`) | **NO** — ver §5 |
| `__tmp_measure_home.js` | Basura de medición | **NO** |

### 3.2 `assets/` (chunks de la app real)

Estos nombres en el ZIP vienen en **minúsculas**; en Linux/Netlify deben existir con el **casing** que pide `index.html` y el bundle (ya corregido en `producto-deploy/`).

| Chunk (casing Linux en producto-deploy) | Función |
|---|---|
| `index-DchpCYR3.js` + `index-DoGwQ0mo.css` | App principal |
| `vendor-C0jAFBLR.js` / `supabase-X1tipi0N.js` | Vendor + Supabase |
| `loginpagesnew-BPP0r_st.js` | Login **ZONA PRO** |
| `RegistroEntryRoute-CfFUwRAD.js` | Entrada registro |
| `FormularioRegistroCompleto-*` | Registro completo |
| `CrearTorneo-*` | Crear torneo |
| `SeguirTorneosPage-*` / `seguirTorneosTabCache-*` / `MisTorneos-*` / `AceptarTorneo-*` | Torneos |
| `EquiposPage-*` / `EquipoMenu-*` / `PlantillaEquipo-*` / `InvitacionesEquipo-*` / `PermisosEquipo-*` / `FansEquipo-*` / `VerEquipos-*` / `CardEquipo-*` | Equipos |
| `ChatTorneo-*` / `ChatTorneoPage-*` / `ChatEquipoPage-*` | Chats |
| `BuscarUsuariosPage-*` / `BuscarJugadoresPage-*` / `homeSearchUsersRpc-*` | Búsqueda |
| `StoriesPage-*` / `VideoFeed-*` / `LiveStreamPages-*` | Stories / video / live |
| `PanelArbitro-*` / `CardFIFA-*` / `EjerciciosPage-*` / `Privacidad-*` / `SoportePage-*` / `QADashboard-*` / `NotFoundPage-*` | Paneles / util |
| `zonaProTorneoPublishService-*` / `userContentLoadFunctions-*` / `worldTopLeagues-*` | Servicios |
| `framePipeline.worker-*` / `videoPrefetch.worker-*` | Workers |
| `futpro-fifa-card-frame.png` / `perfilpro-fifa-template.png` / `notification-fallback-zona-pro.png` | Imágenes producto |
| `assets/sprites/*` | Sprites penales (keeper/kicker) |

Lista completa con bytes y hash: `INVENTARIO_ZIP_TABLA.md`.

### 3.3 Huellas críticas (candado)

| Archivo | SHA256 |
|---|---|
| `index.html` | `1151fe8f29f7ade97471370b5a218a719b4fab71245869c1fc5de76aedc137e3` |
| `assets/index-DchpCYR3.js` | `c5f6a2a97061bb5127f0aec1719ffea443103c97e820f7f0f1edfcae221cfe8d` |
| `assets/loginpagesnew-BPP0r_st.js` | `532cbe1a8d0b34f760a6e465b4d6553c0cf79702aa9e98019dd78b148a470cbe` |
| `assets/index-DoGwQ0mo.css` | `72200c27e811051fd7851e4473dd3987d6655659870b47c993fad8955f66069e` |

Si cambian → **ya no es este ZIP**. Hay que regenerar manifiesto a propósito.

---

## 4. Auditoría del resto del proyecto (qué conservar / eliminar)

### 4.1 CONSERVAR (núcleo)

| Ruta | Por qué |
|---|---|
| `producto-deploy/**` | UI canónica (= ZIP) |
| `auditoria/deploy-6a7256d5ffd58e44433d5158.zip` | Prueba física de los archivos vinculados |
| `auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md` | Este contexto |
| `auditoria/MANIFEST_DEPLOY_ZIP.json` / `INVENTARIO_ZIP_TABLA.md` | Inventario |
| `netlify.toml` (raíz del repo) | `publish=producto-deploy` + redirects API |
| `scripts/ensure-producto-deploy.mjs` | Candado hashes |
| `scripts/sync-producto-from-zip.mjs` | Actualizar desde un ZIP nuevo |
| `PRODUCTO_CANONICO.md` | Resumen corto |
| `package.json` scripts `start`/`dev`/`check:producto` | Sirven 4173 |
| `server.js` / `start.js` / `src/main` / `src/modules` (API) | Backend; **no es la UI** |
| `functions/` | Netlify functions referenciadas por redirects |
| `supabase/` | SQL / schema |

### 4.2 ELIMINAR o dejar en cuarentena (causa de la falla)

Ya movidos a `_legacy_archivo/` (ver `NO_REACTIVAR.md`):

| Origen | Destino | Riesgo si vuelve |
|---|---|---|
| `index.html` + `vite.config.js` raíz | `vite-entry/` | Arranca SPA enero → **5173** |
| `legacy-html-stubs/*instagram*` | `legacy-html-stubs/` | Homepage/perfil Instagram |
| `LoginPage.jsx`, `*Instagram*`, `AuthPageUnificada.jsx` | `src-ui-impostor/` | Login/UI falsa |
| `netlify-emergency.toml`, `netlify.deploy-local.toml`, backups | `netlify-alt/` | `publish=dist` + `npm run build` |
| `netlify.toml` **dentro del ZIP** | `netlify-alt/netlify.from-deploy-zip-PC-WINDOWS.toml` | Rutas `C:\Users\lenovo\...`, rebuild Vite |
| `deploy.sh`, `quick-deploy.sh`, force-deploy*, etc. | `deploy-scripts/` | Republican `dist` enero |
| Demos HTML raíz (`login-demo`, `futpro-auth`, dashboards…) | `html-demos/` | Confunden con producto |
| `public/*.html` + `sw.js` + `service-worker.js` | `public-stubs/` | Cachean UI vieja |

### 4.3 Aún en el árbol — NO es producto (alto riesgo residual)

No borrar a ciegas (backend/tests pueden referenciar), **pero prohibido servir como UI**:

- `src/pages/HomePage.jsx`, routers, componentes del SPA enero
- Cientos de `GUIA_*.md`, `INVENTARIO_*.md`, HTML guías en raíz
- Tests `testing/perfil_instagram.test.js` etc.
- Archivos basura (`console.log('...')`, `({`, etc.) → candidatos a borrado limpio

Marcado: `src/LEGACY_NO_ES_PRODUCTO.md`

### 4.4 Commits / refs prohibidos

| Ref | No usar como producto |
|---|---|
| `80d7863` | Master enero |
| `fe76f3d` | Rotura UI 6 ago |
| `6cf5173` | Auth aproximada sobre enero |

---

## 5. El `netlify.toml` del ZIP — peligro

El ZIP incluye un `netlify.toml` del PC con:

- `publish = "C:\\Users\\lenovo\\Desktop\\futpro2.0\\dist"`
- `command = "npm run build"`
- Rutas absolutas Windows a functions
- Variables `VITE_*` embebidas

**Nunca** copiar ese archivo a la raíz del repo.  
El del repo debe ser siempre:

```toml
[build]
  publish = "producto-deploy"
  command = "node scripts/ensure-producto-deploy.mjs"
```

Copia archivada: `_legacy_archivo/netlify-alt/netlify.from-deploy-zip-PC-WINDOWS.toml`

---

## 6. Por qué ocurrió la falla (y cómo el ZIP lo corta)

1. El producto real estaba en el PC/`dist`/Netlify; GitHub tenía `src/` de enero.
2. Agentes sirvieron Vite **5173** o resetearon a `80d7863`.
3. HTML Instagram y TOML `publish=dist` reactivaban impostores.

**Corte definitivo:** el sistema = archivos del ZIP en `producto-deploy/` + hashes en candado + impostores en `_legacy_archivo/` + Netlify sin rebuild del `src` enero.

---

## 7. Reglas permanentes

1. Producto = ZIP → `producto-deploy/` (hashes).
2. Puerto canónico **4173**.
3. Prohibido `git reset --hard` a enero.
4. Prohibido restaurar `_legacy_archivo/` a la raíz.
5. Prohibido usar el `netlify.toml` del ZIP Windows.
6. Antes de tocar UI: leer este archivo.
7. Verificar: `npm run check:producto`.

---

## 8. Checklist

- [x] ZIP vinculado en `auditoria/`
- [x] `producto-deploy/` = 59 archivos del ZIP (hashes OK)
- [x] Casing Linux de assets
- [x] `MANIFEST_CANONICO.json` + inventario
- [x] `ensure-producto-deploy` valida SHA256 críticos
- [x] Cuarentena impostores
- [x] Workflow Netlify → solo `producto-deploy`
- [x] `LISTA_TOTAL_CONSERVAR_ELIMINAR.md` + basura raíz en cuarentena
- [ ] Merge a `master` + redeploy Netlify (Clear cache)

---

## 9. Comandos

```bash
npm run check:producto
npm start
# http://127.0.0.1:4173/  → login ZONA PRO

# Si llega un ZIP nuevo del PC:
node scripts/sync-producto-from-zip.mjs /ruta/nuevo.zip
# luego regenerar manifiesto y actualizar CRITICAL_SHA256 en ensure-producto-deploy.mjs
```

---

*Fuente de verdad de UI: el ZIP. Fuente de verdad de publicación: `producto-deploy/` + `netlify.toml` del repo.*
