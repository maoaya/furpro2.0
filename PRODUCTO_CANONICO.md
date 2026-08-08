# Versión canónica del sistema — Zona Pro

> Auditoría completa (qué conservar / eliminar / por qué falló):  
> **`auditoria/AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md`**  
> ZIP canónico (archivos vinculados totales): **`auditoria/deploy-6a7256d5ffd58e44433d5158.zip`**  
> Impostores cuarentenados: **`_legacy_archivo/`** (ver `NO_REACTIVAR.md`)

## Esta es LA versión del producto

| | |
|--|--|
| Carpeta | `producto-deploy/` |
| Origen | ZIP `deploy-6a7256d5ffd58e44433d5158` = `Desktop\futpro2.0\dist` |
| Meta | `futpro-deploy` = `2026-08-04T21:16:30Z` |
| Login | `loginpagesnew-BPP0r_st.js` → pantalla **ZONA PRO** |
| Bundle | `index-DchpCYR3.js` |
| Candado | hashes SHA256 en `scripts/ensure-producto-deploy.mjs` + `MANIFEST_CANONICO.json` |

**El `src/` de enero NO es el producto.** La entrada Vite, HTML Instagram, TOML `publish=dist` y demos están en `_legacy_archivo/` para que no vuelvan.  
**El `netlify.toml` dentro del ZIP es del PC Windows — no usarlo.**

## Cómo arrancar (siempre)

```bash
npm start
# o
npm run dev
```

Abre: **http://127.0.0.1:4173/**

## Cómo publicar (Netlify)

- `netlify.toml` → `publish = "producto-deploy"`
- **No** ejecuta `npm run build` del `src` viejo
- Tras cambios: subir un nuevo `dist` del PC a `producto-deploy/` y push a `master`

## Prohibido (causa la falla de “volver a enero”)

1. `git reset --hard` a `80d7863` u otros tips solo-enero  
2. `npm run dev:legacy-src` / Vite sobre `src/` como si fuera producción  
3. Cambiar Netlify `publish` a `dist` generado desde el `src` viejo  
4. Mergear ramas del agente que reescriban Home/login sobre la base enero  

## Actualizar el producto

En el PC donde está el fuente bueno:

```bat
cd Desktop\futpro2.0
npm run build
```

Copia el contenido de `dist\` a `producto-deploy\` en este repo (respetando mayúsculas de archivos), commit y push a `master`.

## Verificación

```bash
npm run check:producto
```
