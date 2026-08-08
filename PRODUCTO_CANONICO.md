# Versión canónica del sistema — Zona Pro

## Esta es LA versión del producto

| | |
|--|--|
| ZIP vinculado | `auditoria/deploy-6a7256d5ffd58e44433d5158.zip` |
| Carpeta publicada | `producto-deploy/` |
| Origen | Build del PC `Desktop\futpro2.0\dist` (Netlify deploy zip) |
| Meta | `futpro-deploy` = `2026-08-04T21:16:30Z` |
| Bundle | `assets/index-DchpCYR3.js` |
| Login | `loginpagesnew-BPP0r_st.js` → pantalla **ZONA PRO** |
| Contexto / auditoría | `auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md` |
| Lista keep/delete | `auditoria/LISTA_TOTAL_CONSERVAR_ELIMINAR.md` |

**El `src/` de enero NO es el producto.** Está marcado legado; Vite/build legacy están bloqueados.

**Cómo trabajar (UI en el PC, no en `src/`):**  
→ `auditoria/COMO_TRABAJAR_EN_ESTE_PROYECTO.md`

## Cómo arrancar (siempre)

```bash
npm run check:producto
npm start
```

Abre: **http://127.0.0.1:4173/** · Login: **http://127.0.0.1:4173/login**

## Cómo publicar (Netlify)

- `netlify.toml` → `publish = "producto-deploy"`
- `command = "node scripts/ensure-producto-deploy.mjs"` (valida SHA256 del ZIP)
- **No** ejecuta `npm run build` del `src` viejo
- Tras merge: **Clear cache and deploy** en Netlify

## Actualizar el producto (solo desde el PC bueno)

```bat
cd Desktop\futpro2.0
npm run build
```

Empaqueta/`dist` → ZIP → en este repo:

```bash
node scripts/sync-producto-from-zip.mjs ruta/al.zip
npm run check:producto
git add producto-deploy auditoria && git commit && git push
```

## Prohibido (causa “volver a enero”)

1. `git reset --hard` a `80d7863` u otros tips solo-enero
2. Restaurar `_legacy_archivo/` a la raíz
3. Usar el `netlify.toml` **dentro del ZIP** (rutas Windows + `npm run build`)
4. Servir Vite/`src` como si fuera producción (puerto 5173)
5. Cambiar Netlify `publish` a `dist`

## Verificación

```bash
npm run check:producto
```
