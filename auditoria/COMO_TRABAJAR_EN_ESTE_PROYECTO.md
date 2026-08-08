# Cómo trabajar — el producto final es el ZIP

**Orden clara:**  
`deploy-6a7256d5ffd58e44433d5158` / `producto-deploy/` = **el sistema**.  
La UI de **enero ya no está en el árbol activo** (fue a `_legacy_archivo/src-ui-enero/`). **No se trabaja ahí.**

---

## Producto final (único)

| Qué | Dónde |
|---|---|
| ZIP | `auditoria/deploy-6a7256d5ffd58e44433d5158.zip` |
| App publicada | `producto-deploy/` |
| Login | http://127.0.0.1:4173/login → **ZONA PRO** (`loginpagesnew`) |
| Candado | `npm run check:producto` (hashes SHA256) |

```bash
npm start
# → http://127.0.0.1:4173/login
```

---

## Qué hay en `src/` ahora

Solo **backend/API** (`main/`, `modules/`, `routes/`, `controllers/`, …).  
**Cero** `pages/`, `components/`, `App.jsx`, `main.jsx`.  
Si vuelven, `check:producto` **falla a propósito**.

---

## Cómo cambiar la UI (pantallas)

Los JSX reales del producto **no viven en este repo** (el ZIP es compilado).  
Se editan en el PC donde se generó el build:

1. PC: `Desktop\futpro2.0` → editar → `npm run build`
2. Traer ZIP/`dist` a este repo:

```bash
node scripts/sync-producto-from-zip.mjs ruta/al.zip
npm run check:producto
git add producto-deploy auditoria && git commit && git push
```

3. Netlify: **Clear cache and deploy** (`publish = producto-deploy`)

---

## Cómo cambiar API / SQL

Sí, en este repo: `functions/`, `supabase/`, `server.js`, `src/main`, etc.  
Sin tocar UI de enero ni restaurar `_legacy_archivo/`.

---

## Prohibido

- Restaurar `_legacy_archivo/src-ui-enero/` a `src/`
- Vite / puerto 5173 / `build:legacy-src`
- Usar el `netlify.toml` de dentro del ZIP (Windows)
- Tratar docs/HTML viejos como la app

---

## Estado del sistema (no dañado)

El producto ZIP sigue con hashes canónicos y responde en `:4173`.  
Lo que se eliminó del flujo activo es el **impostor de enero**, no Zona Pro.
