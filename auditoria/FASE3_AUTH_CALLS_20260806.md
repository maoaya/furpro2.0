# FASE 3 — Autenticación (20260806)

## Totales estáticos (call-sites)
| Método | Conteos |
|--------|---------|
| getSession | 23 |
| getUser | 9 |
| refreshSession | 1 |
| onAuthStateChange | 5 |
| **Total** | **38** |

CSV: `FASE3_AUTH_CALLS_20260806.csv`

## Duplicación / riesgos
1. **Fuente canónica:** `src/context/AuthContext.jsx` ya hace `getSession` + `onAuthStateChange`.
2. **Páginas que vuelven a llamar getSession** (duplicado innecesario vs Context):
   - `LoginPage.jsx`, `Notificaciones.jsx`, `EditarPerfil.jsx`, `PerfilInstagram.jsx`, `RankingJugadoresCompleto.jsx`, `RegistroPerfil.jsx`, `AuthCallback` (x2 archivos), `AuthService.js`, `RealtimeService.js`, `conexionEfectiva.js`, etc.
3. **Health-check agresivo:** `detectSupabaseOnline()` en `src/config/supabase.js` pega a `/auth/v1/health`. En live: **94 respuestas 401** en una pasada de navegación → la app interpreta “offline” / genera ruido y trabajo en cada init.
4. **onAuthStateChange mal usado** en `ArbitroPanelPage.jsx` (destructuring como si devolviera `{data:{user}}`).
5. **Múltiples clientes Supabase:** `src/lib/supabase.js`, `src/config/supabase.js`, `src/supabaseClient.js`, `src/supabaseNodeClient.js` (+ createClient ad-hoc en utils). Riesgo de listeners auth duplicados (`supabaseClient.js` también registra `onAuthStateChange`).

## Runtime
- Sin sesión de usuario en el audit cloud (no hay token script).
- Auth health 401 domina la consola (94×).
