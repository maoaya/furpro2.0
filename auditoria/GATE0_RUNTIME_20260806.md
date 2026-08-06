# Gate 0 — Runtime (20260806)

## Acciones
1. `npm install` (node_modules ausente al inicio).
2. Copiado `.env.limpio` → `.env.local` (solo para arrancar Vite; no se editó `src/`).
3. Vite: `npx vite --host 0.0.0.0 --port 5173 --strictPort` → **ready**.
4. HTTP: `GET /login` → **200** (~7ms); `GET /` → **200**.

## Auth
- **No hay** `scripts/open-login-with-token.mjs` en este checkout.
- Pasadas live ejecutadas **sin sesión** (modo invitado / redirecciones a login posibles).
- Bloqueo documentado: Fases 2–12 con sesión autenticada **no completables** aquí; se midió navegación anónima + queries públicas/fallidas.

## Alcance del repo
- Workspace = `github.com/maoaya/furpro2.0` @ `master` (`80d7863`).
- **No** es el árbol Windows local con `AppStateProvider` / `MenuHamburguesa` / `audit:fase1` del plan original.
- Criterio Gate 0 HTTP: **CUMPLIDO**. Criterio sesión autenticada: **NO CUMPLIDO** (limitación del checkout).
