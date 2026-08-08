# JSX del repo vs ZIP `deploy-6a7256d5ffd58e44433d5158`

**Fecha:** 2026-08-08  
**ZIP revisado:** `deploy-6a7256d5ffd58e44433d5158.zip` (md5 `9ff7aad…` = copia en `auditoria/`)  
**Pregunta:** ¿Los archivos `.jsx` del proyecto están anclados a este ZIP?

---

## Veredicto

**No.** El ZIP **no contiene ningún `.jsx`**. Es un build de producción ya compilado (`index.html` + `assets/*.js|css|png|svg`).

Lo que está anclado al ZIP es:

| Ruta | Rol |
|---|---|
| `auditoria/deploy-6a7256d5ffd58e44433d5158.zip` | Prueba física |
| `producto-deploy/**` | Espejo publicable (mismo contenido, casing Linux) |
| `scripts/ensure-producto-deploy.mjs` | Candado SHA256 |

Los **~330 `.jsx`** del repo (casi todos en `src/`) **no son el fuente de ese ZIP**. Son el árbol legado de enero / experimentos. Servirlos con Vite **no** reproduce Zona Pro del ZIP.

---

## Qué hay dentro del ZIP (sin JSX)

- **63 entradas** totales; **0** archivos `.jsx` / `.tsx` / `.ts` / `.map`
- UI = bundles JS: `index-DchpCYR3.js`, `loginpagesnew-BPP0r_st.js`, `vendor-…`, chunks de páginas, etc.
- El login real del ZIP es el chunk **`loginpagesnew`** con texto **ZONA PRO** (no un `LoginPage.jsx` del repo)

Fuente del ZIP: build en el PC `Desktop\futpro2.0` → `dist` → deploy Netlify. Ese árbol fuente **no está** en este GitHub.

---

## Inventario JSX en este proyecto

| Zona | Cantidad aprox. | ¿Anclado al ZIP? |
|---|---:|---|
| `src/pages/**/*.jsx` | ~212 | **NO** — legado |
| `src/components/**/*.jsx` | ~100 | **NO** — legado |
| `src/*.jsx` (`App`, `main`, rutas…) | ~7 | **NO** — legado |
| `_legacy_archivo/src-ui-impostor/**/*.jsx` | 5 | **NO** — cuarentena (Login/Instagram) |
| `testing/`, `cypress/` | pocos | Tests, no producto |
| `temp_registro_clean.jsx` (raíz) | 1 | Basura / no producto |
| **Dentro del ZIP / `producto-deploy/`** | **0** | El producto son `.js` compilados |

`LoginPage.jsx` del repo está en cuarentena (`_legacy_archivo/src-ui-impostor/`). **No existe** `loginpagesnew.jsx` en este repo.

---

## Cruce chunk ZIP ↔ nombre JSX en `src/`

De los chunks UI del ZIP:

- **~26** no tienen `.jsx` homónimo en este repo (incl. `loginpagesnew`, `SeguirTorneosPage`, `MisTorneos`, `ChatTorneo`, `AceptarTorneo`, …) → prueba de que el fuente del ZIP **no está aquí**.
- **~9** tienen nombre parecido (`CrearTorneo`, `CardFIFA`, `Privacidad`, …) → **solo coincidencia de nombre**; no implica misma versión ni mismo código. El ZIP no se generó compilando este `src/`.

---

## Cómo está “anclado” el proyecto al ZIP (correcto)

```
Desktop\futpro2.0  (JSX reales en el PC)
        │  npm run build
        ▼
     dist/  →  ZIP deploy-6a7256…
        │
        ▼
auditoria/*.zip  =  producto-deploy/  →  npm start :4173
                                              │
                                              ▼
                                         Netlify publish
```

En este repo:

- `npm start` / `npm run dev` → sirven **solo** `producto-deploy` (ZIP)
- `dev:legacy-src` / `build:legacy-src` → **bloqueados**
- Netlify → `publish = "producto-deploy"` + validación de hashes

Por eso editar un `.jsx` de `src/` **no cambia** lo que ves en http://127.0.0.1:4173/login.

---

## Si quieres que los JSX sí estén en el proyecto

Hay que **traer el fuente de `Desktop\futpro2.0`** (el que generó este ZIP) a una carpeta nueva (p. ej. `src-zona-pro/`), no reutilizar el `src/` de enero. Mientras tanto, la única UI anclada al ZIP son los JS de `producto-deploy/`.

---

## Comprobaciones rápidas

```bash
# ZIP sin jsx
unzip -l auditoria/deploy-6a7256d5ffd58e44433d5158.zip | grep -i jsx || echo "OK: sin jsx"

# Producto = ZIP
npm run check:producto

# UI que corre
npm start   # http://127.0.0.1:4173/login  → loginpagesnew / ZONA PRO
```

Ver también: `AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md`, `LISTA_TOTAL_CONSERVAR_ELIMINAR.md`.
