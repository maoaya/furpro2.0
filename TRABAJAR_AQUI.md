# Raíz del proyecto — Zona Pro (furpro2.0)

Esta carpeta **es** el proyecto. Trabaja en esta rama; no en el árbol de enero.

| Qué | Dónde |
|---|---|
| Producto final (lo que corre) | `producto-deploy/` = ZIP `deploy-6a7256d5ffd58e44433d5158` |
| Arranque | `npm start` → http://127.0.0.1:4173/login |
| Editar UI (fuente) | `src-zona-pro/` **después** de importar `Desktop\futpro2.0` |
| Backend / API / SQL | `functions/`, `supabase/`, `src/main`, `server.js` |
| Basura / enero / demos | `_legacy_archivo/` — **NO reactivar** |
| Guía completa | `auditoria/COMO_TRABAJAR_EN_ESTE_PROYECTO.md` |
| Estado del sistema | `auditoria/ESTADO_SISTEMA.md` |

## Por qué “no deja editar de forma segura”

`producto-deploy/` es el **build compilado**. Editar esos `.js` minificados rompe el sistema.

Para editar pantallas/funciones UI con seguridad:

```bat
REM En tu PC Windows (proyecto bueno):
cd Desktop
tar -a -c -f futpro2.0-fuente.zip futpro2.0
```

Sube ese ZIP (con `.jsx`, no solo `dist`) y aquí:

```bash
npm run import:fuente-pc -- ruta/a/futpro2.0-fuente.zip
```

Luego edita solo en `src-zona-pro/`.

## Prohibido

- Usar o restaurar `_legacy_archivo/src-ui-enero/`
- `npm run dev:legacy-src` / Vite como producto
- Tratar `src/` de enero como la app
