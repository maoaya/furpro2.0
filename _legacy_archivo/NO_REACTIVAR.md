# NO REACTIVAR — cuarentena de impostores

Todo lo que está en `_legacy_archivo/` **NO es el producto Zona Pro**.

Fue movido aquí para que jamás vuelva a publicarse ni a servirse como la app.

| Subcarpeta | Por qué está aquí |
|---|---|
| `vite-entry/` | `index.html` + `vite.config.js` que arrancaban el `src/` de enero (puerto 5173) |
| `legacy-html-stubs/` | HTML Instagram (homepage/perfil) reactivado por agentes |
| `html-demos/` | Demos/HTML sueltos en la raíz que confunden con el producto |
| `public-stubs/` | HTML stubs + service workers que cachean UI vieja |
| `netlify-alt/` | TOML con `publish = "dist"` / `npm run build` del src enero |
| `deploy-scripts/` | Scripts que reconstruyen y publican `dist` Vite |
| `src-ui-impostor/` | Login/Instagram pages del árbol enero |

**Producto canónico:** `producto-deploy/`  
**Documentación:** `auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md`  
**Arranque:** `npm start` → http://127.0.0.1:4173/

| `basura-raiz/` | Archivos basura con nombres rotos (`console.log(...)`, `vite`, `{`, etc.) |
| `deploy-manual/` | Carpeta de deploy manual que no es producto-deploy |
