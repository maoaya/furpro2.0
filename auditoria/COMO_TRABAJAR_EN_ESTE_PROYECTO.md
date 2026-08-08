# Cómo trabajar — producto final = ZIP (enero NO)

## El sistema está restaurado como producto

- App: `npm start` → http://127.0.0.1:4173/login (**ZONA PRO**)
- Código de producto en uso: `producto-deploy/` = ZIP `deploy-6a7256d5ffd58e44433d5158`
- UI de enero: **fuera** (`_legacy_archivo/src-ui-enero/`) — **no se restaura**

Detalle: `ESTADO_SISTEMA.md`

---

## Quieres editar muchas funciones — haz esto

El ZIP es el producto, pero es **compilado**. Para editar pantallas/funciones UI necesitas el fuente del PC:

### Paso 1 — Sube el fuente (no el deploy zip)

En Windows, el proyecto bueno:

`Desktop\futpro2.0` (con `src\*.jsx`, `package.json`, etc.)

Súbelo como ZIP **fuente** a este entorno y:

```bash
npm run import:fuente-pc -- ruta/a/futpro2.0-fuente.zip
```

Eso llena `src-zona-pro/`. **Ahí** editas.

### Paso 2 — Editar

Trabaja solo en:

| Editar | Carpeta |
|---|---|
| Pantallas / login / torneos / UI | `src-zona-pro/` (tras importar) |
| API / Express / Supabase | `functions/`, `supabase/`, `src/main`, `server.js` |
| Ver resultado del producto actual | `npm start` → `:4173` |

### Paso 3 — Volver a publicar UI

En el PC o tras build del fuente importado, genera `dist` y:

```bash
node scripts/sync-producto-from-zip.mjs ruta/al/dist-o-deploy.zip
npm run check:producto
git add producto-deploy auditoria && git commit && git push
```

---

## Prohibido (rompe otra vez)

- Restaurar `_legacy_archivo/src-ui-enero/` → `src/pages`
- Editar “el de enero” porque “al menos hay jsx”
- Vite sobre el legado
- Confundir el deploy zip (build) con el zip fuente del PC

---

## Si solo tienes el deploy zip ahora

Puedes **usar y desplegar** Zona Pro, pero **no** editar JSX hasta que subas `Desktop\futpro2.0` fuente.

Eso no es daño del sistema: el producto corre. Falta el fuente en GitHub.
