# Cómo trabajar en este proyecto (sin tocar enero)

**Regla de oro:** el producto es el ZIP / `producto-deploy/`.  
El `src/` de enero **no sirve**, **no se edita como UI** y **no se buildea**.

---

## 1. Qué es cada cosa

| Pieza | Dónde | Para qué |
|---|---|---|
| **UI que corre** | `producto-deploy/` (= ZIP `deploy-6a7256…`) | Lo único que se sirve en `:4173` y Netlify |
| **Fuente bueno** | PC: `Desktop\futpro2.0` | Donde sí editas JSX/CSS/lógica de pantalla |
| **Este GitHub `src/`** | `src/` | Legado enero — **no trabajar UI aquí** |
| **Backend / SQL** | `server.js`, `functions/`, `supabase/`, algunos módulos en `src/` no-UI | Sí se puede tocar en este repo |

---

## 2. Flujo diario correcto

### A) Ver / probar la app (este repo o cloud)

```bash
npm run check:producto
npm start
```

Abre: http://127.0.0.1:4173/login  

No uses Vite. No uses puerto 5173. No abras JSX de `src/pages`.

### B) Cambiar pantallas / login / torneos / diseño (UI)

1. En el **PC**, abre el proyecto bueno: `Desktop\futpro2.0`
2. Edita ahí (ese sí tiene los JSX de Zona Pro / `loginpagesnew`, etc.)
3. Prueba en local del PC (`npm run dev` **del PC**, no el de este repo)
4. Cuando esté bien:

```bat
cd Desktop\futpro2.0
npm run build
```

5. Trae el `dist` (o el ZIP de Netlify deploy) a este repo y sincroniza:

```bash
# copia el zip a auditoria/ o pásale la ruta
node scripts/sync-producto-from-zip.mjs ruta\al\nuevo.zip
npm run check:producto
git add producto-deploy auditoria
git commit -m "producto: actualizar Zona Pro desde dist PC"
git push
```

6. Netlify: **Clear cache and deploy** (publish ya apunta a `producto-deploy`)

### C) Cambiar API / Supabase / functions (este repo)

Sí puedes trabajar aquí:

- `functions/`
- `supabase/`
- `server.js` / backend
- scripts de migración

No mezcles eso con “arreglar Home/login editando `src/pages`”.

---

## 3. Qué NO hacer (rompe el sistema otra vez)

| Prohibido | Por qué |
|---|---|
| Editar `src/pages/*.jsx` como si fuera Zona Pro | Es enero; no es el ZIP |
| `npm run dev:legacy-src` / Vite en este repo | Bloqueado a propósito |
| `npm run build` esperando regenerar UI | Aquí no rebuild del producto |
| Restaurar `_legacy_archivo/` | Vuelve Instagram / Vite / TOML malos |
| Usar el `netlify.toml` **dentro** del ZIP | Tiene rutas Windows + `publish=dist` |
| Pedir a un agente “arregla el login en src/” | Reescribe el impostor |

---

## 4. Si quieres que los JSX vivan en GitHub

Hoy **no están**. El ZIP solo trae JS compilado.

Opciones (elige una, no mezcles):

1. **Recomendada ahora:** seguir el flujo PC → build → `sync-producto-from-zip` (arriba).
2. **Más adelante:** copiar el fuente de `Desktop\futpro2.0` a una carpeta nueva (`src-zona-pro/`), apuntar Vite **solo** ahí, y dejar `src/` enero archivado o borrado.  
   **Nunca** “arreglar” el `src/` actual para que parezca el producto.

---

## 5. Checklist mental antes de tocar código

1. ¿Es cambio de **pantalla/UI**? → PC `futpro2.0` → build → sync ZIP.  
2. ¿Es cambio de **API/SQL**? → este repo (`functions` / `supabase` / server).  
3. ¿Estoy en `src/pages` o `LoginPage.jsx`? → **parar**; no es el producto.  
4. ¿`npm start` abre `:4173` con login **ZONA PRO**? → vas bien.

---

## 6. Enlaces

- Producto canónico: `../PRODUCTO_CANONICO.md`
- JSX vs ZIP: `./JSX_VS_ZIP_CANONICO.md`
- Lista keep/delete: `./LISTA_TOTAL_CONSERVAR_ELIMINAR.md`
- Auditoría: `./AUDITORIA_CONTEXTO_PRODUCTO_ZONA_PRO.md`
