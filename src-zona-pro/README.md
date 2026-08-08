# src-zona-pro — aquí se edita el producto (NO enero)

Esta carpeta es el **único lugar** del repo para el fuente editable de Zona Pro.

Hoy está **vacía a propósito**: el ZIP `deploy-6a7256d5ffd58e44433d5158` solo trae el **build** (`producto-deploy/`), no los `.jsx`.

## Para poder editar funciones / pantallas

1. En tu PC, comprime el proyecto bueno (el que genera ese ZIP):

```bat
cd Desktop
tar -a -c -f futpro2.0-fuente.zip futpro2.0
```

(o sube la carpeta `futpro2.0` con `src/`, `package.json`, etc. — **no solo** `dist/`)

2. En este repo / agente: coloca ese ZIP y ejecuta:

```bash
node scripts/import-fuente-pc.mjs ruta/a/futpro2.0-fuente.zip
```

3. Edita dentro de `src-zona-pro/…`
4. Genera de nuevo el producto:

```bash
# cuando el fuente ya esté importado y tenga sus scripts:
npm run build:zona-pro
npm run check:producto
npm start
```

## Qué NO va aquí

- El `src/` de enero (`_legacy_archivo/src-ui-enero/`) — **prohibido**
- Copiar pages de enero “para tener algo que editar”

## Mientras no llegue el fuente

Puedes:

- **Usar** el producto: `npm start` → http://127.0.0.1:4173/login
- **Editar backend/API** en `src/main`, `functions/`, `supabase/`
- **Actualizar UI** solo sustituyendo un nuevo `dist`/ZIP con `sync-producto-from-zip.mjs`
