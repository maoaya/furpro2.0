# Contexto completo del deploy → fuente (Zona Pro)

**Fecha:** 2026-08-08  
**Producto:** `producto-deploy/` = ZIP `deploy-6a7256d5ffd58e44433d5158`  
**Meta:** `futpro-deploy` = `2026-08-04T21:16:30Z`  
**JSON máquina:** `auditoria/CONTEXTO_DEPLOY_A_JSX.json`  
**Comparador:** `npm run compare:fuente-deploy`

---

## Regla crítica: PerfilCard es OBLIGATORIO

**Sí es necesario.** No aparecía en la lista anterior porque **no es un chunk suelto**: está **embebido** dentro de:

`producto-deploy/assets/index-zp-nomenu-Hb7k2m.js`

Evidencia en el bundle:

| Señal | Valor |
|---|---|
| Ruta canónica | `/perfilcard` |
| Alias | `/perfil-card` → redirect a `/perfilcard` |
| Menciones `PerfilCard` | ~70 |
| Lazy/preload key | `perfilcard` |
| Post-login | `Entrando a PerfilCard…` · default `b\|\|"/perfilcard"` |
| Motivos | `login-entry-fast`, `register-form-applied`, `fromAuth`, `profile-complete`, `no-reregister` |
| Cache | `futpro:perfilcard:cache:v1` |
| Métricas | `login → callback → perfilcard` (`perfilcard_mounted`) |

### Flujo que NO se puede romper

**Especificación completa (replicar igual):**  
`auditoria/FLUJO_COMPLETO_DEPLOY_ZONA_PRO.md`

```
/login (loginpagesnew.jsx)
    → email gate → Google OAuth
    → /auth/callback (AuthCallback)
    → SIEMPRE /perfilcard (PerfilCard.jsx)
         ↳ luego /homepages o /perfilpro (desde PerfilCard)

/registro → FormularioRegistroCompleto + pending_profile_data
    → OAuth → /auth/callback
    → SIEMPRE /perfilcard
```

Cualquier atajo que mande login/registro directo a `/home` u omita PerfilCard **rompe el producto**.

---

## Por qué faltaban archivos en la lista

El inventario viejo solo miraba **chunks lazy** (`assets/Foo-HASH.js`).  
Vite mete el núcleo en el **entry** `index-*.js`. Ahí viven, entre otros:

| Módulo (fuente esperado en PC) | Dónde está en deploy | Rol |
|---|---|---|
| **`App.jsx`** (router) | `index-zp-nomenu-*.js` | Rutas SPA |
| **`PerfilCard.jsx`** | `index-zp-nomenu-*.js` | Post-login / post-registro |
| **`PerfilPro.jsx`** | `index-zp-nomenu-*.js` | Perfil público/propio |
| **`AuthCallback.jsx`** | `index-zp-nomenu-*.js` | `/auth/callback` → perfilcard |
| **Home / Homepages** | `index-zp-nomenu-*.js` | `/`, `/home`, `/homepages` |
| **EditarPerfil** | `index-zp-nomenu-*.js` | `/editar-perfil` |
| Providers (Auth, AppState…) | `index-zp-nomenu-*.js` | Sesión / guards |
| `loginpagesnew.jsx` | chunk `loginpagesnew-*.js` | Login ZONA PRO |
| Páginas torneo/equipo/chat… | chunks `*-HASH.js` | Lazy |

**No omitir el entry ni los assets raíz** al extraer/trabajar.

---

## Inventario TOTAL deploy (no omitir)

### Raíz `producto-deploy/`

- `index.html`
- `favicon.ico`, `favicon.svg`, `icons.svg`
- `crear-torneo-premium.jpg`, `crear-torneo-premium.svg`
- `VERSION_LOCK.txt`, `README_PRODUCTO.txt`, `MANIFEST_CANONICO.json`, `SOURCE_ZIP.txt` (meta)

### `assets/` — entry + vendor

| Archivo | Trabajar como |
|---|---|
| `index-zp-nomenu-Hb7k2m.js` | **App.jsx + PerfilCard + PerfilPro + AuthCallback + Home + guards** |
| `index-DoGwQ0mo.css` | estilos globales |
| `vendor-C0jAFBLR.js` | no editar (React…) |
| `supabase-X1tipi0N.js` | cliente Supabase empaquetado |

### `assets/` — chunks UI (lazy → `.jsx`)

`loginpagesnew`, `FormularioRegistroCompleto`, `RegistroEntryRoute`, `CrearTorneo`, `MisTorneos`, `SeguirTorneosPage`, `AceptarTorneo`, `ChatTorneo`, `ChatTorneoPage`, `ChatEquipoPage`, `PanelArbitro`, `EquiposPage`, `EquipoMenu`, `VerEquipos`, `CardEquipo`, `CardFIFA`, `PlantillaEquipo`, `FansEquipo`, `InvitacionesEquipo`, `PermisosEquipo`, `BuscarJugadoresPage`, `BuscarUsuariosPage`, `LiveStreamPages`, `StoriesPage`, `VideoFeed`, `EjerciciosPage`, `Privacidad`, `SoportePage`, `QADashboard`, `NotFoundPage`

### `assets/` — servicios / workers / media

`zonaProTorneoPublishService`, `homeSearchUsersRpc`, `userContentLoadFunctions`, `seguirTorneosTabCache`, `worldTopLeagues`, `framePipeline.worker`, `videoPrefetch.worker`, `futpro-fifa-card-frame.png`, `perfilpro-fifa-template.png`, `notification-fallback-zona-pro.png`, `sprites/*`

---

## Fuente MUST-HAVE al importar `Desktop\futpro2.0`

Prioridad máxima (si faltan, el flujo auth/card está incompleto):

1. `App.jsx` (o equivalente router)
2. `PerfilCard.jsx` (ruta `/perfilcard`)
3. `AuthCallback.jsx` (`/auth/callback`)
4. `loginpagesnew.jsx`
5. `FormularioRegistroCompleto.jsx`
6. `PerfilPro.jsx`
7. `package.json` + configs Vite del PC

Luego el resto de chunks de la tabla UI.

---

## Backend (también del proyecto — no es el ZIP UI)

Editable ya en este repo (no viene del deploy zip):

| Área | Rutas |
|---|---|
| Express | `server.js`, `start.js`, `src/main/expressApp.js`, `src/routes/`, `src/controllers/`, `src/services/` |
| Netlify functions | `functions/` |
| Supabase | `supabase/` |
| Proxy Zona Pro (serve local) | `scripts/serve-producto.mjs` → `POST /api/zona-pro` |

Al importar el fuente del PC, si trae `netlify/functions` o `src` backend propio, se fusiona en `src-zona-pro/` y se revisa contra esto.

---

## Rutas auth / perfil (bundle)

- `/login` → loginpagesnew  
- `/auth/callback`, `/callback` → AuthCallback → **`/perfilcard`**  
- `/registro`, `/register` → registro → callback → **`/perfilcard`**  
- `/perfilcard` (canónica), `/perfil-card` (redirect)  
- `/perfilpro`, `/perfil-pro`, `/perfil`, `/editar-perfil`, `/completar-perfil`  
- `/card-fifa`

---

## Depurar duplicados en futpro2.0

1. Importar ZIP fuente → `src-zona-pro/`  
2. `npm run compare:fuente-deploy`  
3. **KEEP:** todo lo de MUST-HAVE + chunks UI + servicios del deploy  
4. **REVIEW:** `.jsx` sin homónimo en deploy (posible enero/duplicado)  
5. **Nunca** reactivar `_legacy_archivo/src-ui-enero/` como producto  

Nombre igual en enero (`PerfilCard.jsx` existe ahí) **no** significa misma versión que el ZIP. Gana el del Desktop.
