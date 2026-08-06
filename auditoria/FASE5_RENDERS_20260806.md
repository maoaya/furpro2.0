# FASE 5 — Renderizado (20260806)

**Método:** proxy estático (conteo de hooks/queries). React Profiler no disponible de forma fiable en headless sin instrumentar `src/`.

## Pantallas pesadas

| Archivo | líneas | useState | useEffect | useMemo | .from | .rpc |
|---------|--------|----------|-----------|---------|-------|------|
| HomePage.jsx | 877 | 20 | 1 | 3 | 19 | 0 |
| PerfilInstagram.jsx | 748 | 10 | 2 | 0 | 7 | 0 |
| VideosFeed.jsx | 649 | 7 | 2 | 0 | 5 | 1 |
| MarketplaceCompleto.jsx | 606 | 13 | 1 | 0 | 1 | 0 |
| AuthContext.jsx | 605 | 6 | 1 | 0 | 7 | 0 |
| FeedPage.jsx | 319 | 16 | 1 | 1 | 7 | 1 |
| RankingJugadoresCompleto.jsx | 313 | 6 | 2 | 0 | 1 | 0 |

## Cascadas probables
1. `AuthProvider` re-renderiza todo el árbol al cambiar `user/loading/userProfile`.
2. `NotificationsProvider` envuelve rutas y puede invalidar UI en cada poll/query.
3. HomePage con **20 useState** + **19 .from** en un solo módulo: alto riesgo de cascada tras cada fetch.
4. Sin `React.memo` / code-splitting agresivo en rutas (imports eager en `App.jsx`).

## Evidencia live correlacionada
- Heap JS +~96 MB tras ~29 rutas + stress (FASE11).
- 94× `auth/v1/health` 401 durante la pasada (FASE4/13) → trabajo de red + posible re-render/auth mode guest.
