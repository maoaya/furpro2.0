# Contexto completo del deploy → JSX esperado (Zona Pro)

**Fecha:** 2026-08-08  
**Producto:** `producto-deploy/` = ZIP `deploy-6a7256d5ffd58e44433d5158`  
**Meta:** `futpro-deploy` = `2026-08-04T21:16:30Z`  
**Entrada:** `assets/index-zp-nomenu-Hb7k2m.js` + CSS `index-DoGwQ0mo.css`  
**Datos máquina:** `auditoria/CONTEXTO_DEPLOY_A_JSX.json`

## Para qué sirve

Cuando llegue el ZIP de `Desktop\futpro2.0`, este inventario dice **qué archivos del fuente son del producto real** (los que generaron estos chunks JS) y cuáles son **duplicados / basura / no-proyecto** (enero, demos, restos).

Regla:

| Si en el PC… | Entonces… |
|---|---|
| Existe un `.jsx`/`.js` con el mismo nombre base que un chunk del deploy | **Candidato del producto** — conservar y editar |
| Hay cientos de `.jsx` que no aparecen en esta lista | **Sospechosos** — probablemente enero/duplicados |
| Solo hay `dist/` sin estos nombres en `src/` | Subiste el build otra vez, no el fuente |

---

## Totales del deploy

| Tipo | Cantidad |
|---|---:|
| Archivos en `producto-deploy/` | 63 |
| Chunks `.js` (assets) | ~36 UI + vendor/supabase/workers |
| Chunks `.css` | varios (index + páginas) |
| Rutas SPA detectadas en el bundle | 75 |
| `.jsx` dentro del ZIP | **0** (solo compilado) |

---

## Mapa chunk JS → fuente esperado en `Desktop\futpro2.0`

### UI / pantallas (buscar como `.jsx`)

| Chunk en deploy | Fuente esperado en el PC | Notas |
|---|---|---|
| `loginpagesnew-BPP0r_st.js` | `loginpagesnew.jsx` | Login **ZONA PRO** (confirmado en bundle: `[DEBUG][loginpagesnew.jsx]`) |
| `FormularioRegistroCompleto-*.js` | `FormularioRegistroCompleto.jsx` | Registro |
| `RegistroEntryRoute-*.js` | `RegistroEntryRoute.jsx` | Entrada registro |
| `CrearTorneo-*.js` | `CrearTorneo.jsx` | |
| `MisTorneos-*.js` | `MisTorneos.jsx` | |
| `SeguirTorneosPage-*.js` | `SeguirTorneosPage.jsx` | |
| `AceptarTorneo-*.js` | `AceptarTorneo.jsx` | |
| `ChatTorneo-*.js` / `ChatTorneoPage-*.js` | `ChatTorneo.jsx` / `ChatTorneoPage.jsx` | |
| `ChatEquipoPage-*.js` | `ChatEquipoPage.jsx` | |
| `PanelArbitro-*.js` | `PanelArbitro.jsx` | |
| `EquiposPage-*.js` | `EquiposPage.jsx` | |
| `EquipoMenu-*.js` | `EquipoMenu.jsx` | |
| `VerEquipos-*.js` | `VerEquipos.jsx` | |
| `CardEquipo-*.js` | `CardEquipo.jsx` | |
| `CardFIFA-*.js` | `CardFIFA.jsx` | |
| `PlantillaEquipo-*.js` | `PlantillaEquipo.jsx` | |
| `FansEquipo-*.js` | `FansEquipo.jsx` | |
| `InvitacionesEquipo-*.js` | `InvitacionesEquipo.jsx` | |
| `PermisosEquipo-*.js` | `PermisosEquipo.jsx` | |
| `BuscarJugadoresPage-*.js` | `BuscarJugadoresPage.jsx` | |
| `BuscarUsuariosPage-*.js` | `BuscarUsuariosPage.jsx` | |
| `LiveStreamPages-*.js` | `LiveStreamPages.jsx` | |
| `StoriesPage-*.js` | `StoriesPage.jsx` | |
| `VideoFeed-*.js` | `VideoFeed.jsx` | |
| `EjerciciosPage-*.js` | `EjerciciosPage.jsx` | |
| `Privacidad-*.js` | `Privacidad.jsx` | |
| `SoportePage-*.js` | `SoportePage.jsx` | |
| `QADashboard-*.js` | `QADashboard.jsx` | |
| `NotFoundPage-*.js` | `NotFoundPage.jsx` | |

### Servicios / util (suelen ser `.js` o `.ts`, no página)

| Chunk | Fuente probable |
|---|---|
| `zonaProTorneoPublishService-*.js` | `zonaProTorneoPublishService.js` (o `.ts`) |
| `homeSearchUsersRpc-*.js` | `homeSearchUsersRpc.js` |
| `userContentLoadFunctions-*.js` | `userContentLoadFunctions.js` |
| `seguirTorneosTabCache-*.js` | `seguirTorneosTabCache.js` |
| `worldTopLeagues-*.js` | `worldTopLeagues.js` |

### Núcleo / vendor (no editar a mano en deploy)

| Archivo | Rol |
|---|---|
| `index-zp-nomenu-Hb7k2m.js` | App shell / router (incluye rutas) |
| `index-DoGwQ0mo.css` | Estilos globales |
| `vendor-*.js` | React y deps |
| `supabase-*.js` | Cliente Supabase |
| `*.worker-*.js` | Workers (frame pipeline, video prefetch) |

También en raíz del deploy: `index.html`, `favicon.*`, `icons.svg`, `crear-torneo-premium.jpg/.svg`.

---

## Rutas que el producto conoce (del bundle)

`/`, `/login`, `/registro`, `/register`, `/home`, `/homepage`, `/crear-torneo`, `/mis-torneos`, `/seguir-torneos`, `/aceptar-torneo`, `/equipos`, `/equipo-menu`, `/ver-equipos`, `/mi-equipo`, `/chat`, `/panel-arbitro`, `/partidos-en-vivo`, `/en-vivo`, `/live`, `/livestream`, `/stories`, `/video-feed`, `/card-fifa`, `/perfil`, `/perfil-pro`, `/perfil-card`, `/privacidad`, `/soporte`, `/ranking`, `/marketplace`, `/penaltis`, `/ejercicios`, `/formulario-registro-completo`, …

Lista completa en el JSON (`routes` se puede regenerar; ver bundle `index-zp-nomenu-*.js`).

---

## Cruce con enero (para depurar duplicados)

Los ~327 `.jsx` de `_legacy_archivo/src-ui-enero/` **no** son este deploy.

| Coincidencia solo de nombre con enero | **NO implica** mismo código |
|---|---|
| `CardFIFA.jsx`, `CrearTorneo.jsx`, `FormularioRegistroCompleto.jsx`, `NotFoundPage.jsx`, `PlantillaEquipo.jsx`, `Privacidad.jsx` | Pueden existir en enero **y** en el PC bueno; al importar, gana el del Desktop |

**Del deploy y NO están en enero (prueba de que el fuente bueno es otro árbol):**  
`loginpagesnew.jsx`, `MisTorneos.jsx`, `SeguirTorneosPage.jsx`, `AceptarTorneo.jsx`, `ChatTorneo.jsx`, `PanelArbitro.jsx`, `EquiposPage.jsx`, … (ver JSON `deploy_expected_jsx_NOT_in_enero`).

Al depurar `futpro2.0` del PC:

1. Marcar **KEEP** todo lo que matchee esta tabla de chunks.  
2. Marcar **REVIEW/DELETE** lo que solo exista en copias enero / Instagram / demos y no tenga chunk.  
3. No mezclar `_legacy_archivo` con el import.

---

## Cómo usarlo cuando llegue tu ZIP

```bash
# 1) Importar fuente del PC
npm run import:fuente-pc -- /ruta/futpro2.0.zip

# 2) Comparar contra este contexto
node scripts/compare-fuente-vs-deploy.mjs
```

El script listará: presentes en deploy, faltantes, y sobrantes sospechosos.
