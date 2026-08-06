# MATRIZ DE PROBLEMAS — Auditoría integral 20260806

**Repo auditado:** `github.com/maoaya/furpro2.0` @ `master` (`80d7863`)  
**Principio:** cero cambios en `src/` hasta aprobación de esta matriz.  
**Runtime:** Vite `:5173` OK; auth de usuario **no disponible** en este checkout.

### Limitación de alcance
El plan se redactó contra un árbol local más moderno (`AppStateProvider`, `MenuHamburguesa`, scripts `audit:fase1`). Este cloud checkout es **otro snapshot** (contexts clásicos, sin esos módulos). Los IDs abajo son evidencia de **este** código. Re-auditar el árbol Windows si es el producto real en uso.

---

## P0 — Congelación / rotura dura

### FP-AUTH-001 — Tormenta `auth/v1/health` 401
- **Síntoma:** consola inundada; trabajo de red en cada pasada de navegación.
- **Causa raíz:** health-check / cliente auth pegando a `/auth/v1/health` con resultado 401 (94× en una pasada live). `detectSupabaseOnline` en [`src/config/supabase.js`](src/config/supabase.js); posible interacción con headers del cliente.
- **Archivos:** `src/config/supabase.js`, `src/context/AuthContext.jsx`, clientes supabase.
- **Métrica:** 94 requests 401 health; 119 console errors totales.
- **Evidencia:** `FASE13_ERRORES_20260806.*`, `FASE4_SUPABASE_RUNTIME_20260806.json`.
- **Fix mínimo propuesto:** dejar de usar `/auth/v1/health` con fetch que dispare 401; un solo probe cacheado (TTL ≥60s) vía REST head/`select=1` o asumir online; silenciar solo tras clasificación.
- **Validación:** nav 10 rutas → health calls ≤1; console 401 health = 0.

### FP-AUTH-002 — getSession/getUser duplicados fuera de AuthProvider
- **Síntoma:** latencia y estados inconsistentes al entrar a páginas.
- **Causa raíz:** 38 call-sites auth; páginas llaman `getSession` aunque `AuthContext` ya es fuente de verdad.
- **Archivos:** ver `FASE3_AUTH_CALLS_20260806.csv` (LoginPage, Notificaciones, EditarPerfil, PerfilInstagram, RankingJugadoresCompleto, AuthService, RealtimeService, …).
- **Métrica:** getSession=23, getUser=9, onAuthStateChange=5.
- **Evidencia:** FASE3.
- **Fix mínimo:** páginas consumen solo `useAuth()`; eliminar getSession locales no esenciales.
- **Validación:** grep getSession en pages → 0 (salvo AuthCallback).

### FP-SB-001 — Schema drift: tablas/RPC 404/400
- **Síntoma:** features vacías / errores al navegar marketplace, rankings, valoraciones.
- **Causa raíz:** queries a recursos inexistentes o joins inválidos.
- **Archivos/endpoints:** `rest/v1/valoraciones` 404; `rest/v1/products` 400 (embed `carfutpro!seller_id`); ranking errors en consola.
- **Métrica:** 12×404, 5×400 en pasada; products error ×5.
- **Evidencia:** FASE13, FASE4 runtime.
- **Fix mínimo:** gate/compat por recurso (no reintentar tras 404/400); corregir select embed o tabla real.
- **Validación:** marketplace y ranking sin 400/404 repetidos.

### FP-NAV-001 — `/perfil` render vacío; `/crear-equipo` abort
- **Síntoma:** pantalla en blanco / navegación abortada.
- **Causa raíz:** `/perfil` rootText=0; `/crear-equipo` `net::ERR_ABORTED` (redirect/remount race).
- **Archivos:** rutas en `src/App.jsx`; `PerfilNuevo` / guards; `CrearEquipo`.
- **Métrica:** 2 blocked, 1 hardFail / 29 rutas.
- **Evidencia:** `FASE2_NAVEGACION_LIVE_20260806.*`.
- **Fix mínimo:** asegurar fallback UI en PerfilNuevo sin sesión; estabilizar redirect de crear-equipo (Navigate explícito, no abort).
- **Validación:** ambas rutas rootText>0 y status 200 sin ERR_ABORTED.

---

## P1 — Lentitud / degradación

### FP-MEM-001 — Crecimiento de heap ~96 MB en navegación
- **Síntoma:** app se pone lenta tras recorrer muchas páginas (reporte usuario: colapso/bloqueo).
- **Causa raíz:** retención tras montar/desmontar (listeners/channels/caches); sin cleanup consistente.
- **Archivos:** channel sites (35), listeners (71), FASE7 risks (95 flags).
- **Métrica:** Δ JSHeapUsedSize ≈ **95.9 MB** (FASE11).
- **Evidencia:** `FASE11_MEMORIA_20260806.*`, FASE7, FASE9.
- **Fix mínimo:** auditar unmount de los 35 `.channel(`; garantizar `subscription.unsubscribe` / `removeChannel`; cortar intervals en cleanup.
- **Validación:** 20 nav stress → Δ heap < 20 MB estabilizado.

### FP-BUNDLE-001 — Chunk App >500 kB; imports eager
- **Síntoma:** TTI alto; jank al primer paint de rutas.
- **Causa raíz:** `App.jsx` importa casi todas las páginas de forma estática; warning Vite.
- **Archivos:** `src/App.jsx`, build output.
- **Métrica:** App chunk 546 kB (gzip 131 kB); build 324 modules.
- **Evidencia:** FASE14.
- **Fix mínimo:** `React.lazy` + `Suspense` por ruta no crítica (login/home eager).
- **Validación:** App chunk <350 kB; nav percibida mejora en preview.

### FP-SB-002 — Múltiples clientes Supabase
- **Síntoma:** listeners auth/realtime duplicados; health/session dobles.
- **Causa raíz:** `lib/supabase.js`, `config/supabase.js` (re-export + side effects), `supabaseClient.js`, utils con `createClient`.
- **Archivos:** listados en FASE3.
- **Métrica:** varios módulos supabase cargados por navegación (dev network).
- **Fix mínimo:** un solo export `getSupabase()`; deprecar los demás a re-export sin side effects (config ya lo advierte).
- **Validación:** un solo `onAuthStateChange` activo.

### FP-UI-001 — Marketplace vacío en preview
- **Síntoma:** `/marketplace` rootText=0 en build preview.
- **Causa raíz:** probable fallo products 400 + handling de error que deja UI en blanco.
- **Archivos:** `MarketplaceCompleto.jsx`, query products.
- **Métrica:** preview smoke text=0; console “Error cargando productos”.
- **Evidencia:** FASE14 preview smoke, FASE13.
- **Fix mínimo:** empty/error state visible; corregir query (SB-001).
- **Validación:** preview marketplace muestra empty state o lista, nunca canvas vacío.

### FP-NAV-002 — Objetivo &lt;1 ms no cumplido (medición)
- **Síntoma:** usuario exige cambio de pantalla &lt;1 ms.
- **Causa raíz:** full document load ~100ms (dev) / ~420ms (preview); sin SPA click-nav autenticada medida.
- **Métrica:** avg navMs dev **100**; preview **~430**.
- **Evidencia:** FASE2, FASE14.
- **Fix mínimo (post-auth):** navegación solo client-side (RR navigate), keep-alive tabs, cero trabajo sync en click; medir `performance.now()` en pointerdown→pathname.
- **Validación:** pathname change &lt;5ms en 95% taps in-app (meta &lt;1ms es aspiracional de event loop; documentar umbral realista).

---

## P2 — Deuda / calidad

### FP-DEAD-001 — Superficie src enorme vs bundle
- **Síntoma:** mantenimiento imposible; auditorías confusas.
- **Causa:** 653 archivos src / 299 pages; build solo 324 modules.
- **Fix mínimo:** inventario de entrypoints no alcanzables; no borrar aún—marcar.
- **Evidencia:** FASE1 vs FASE14.

### FP-EFFECT-001 — 95 flags useEffect de riesgo
- **Síntoma:** posibles bucles/re-fetch.
- **Evidencia:** `FASE7_USEEFFECT_20260806.*`.
- **Fix mínimo:** priorizar archivos con `HIGH_EFFECT_COUNT` y supabase+setState sin deps estables.

### FP-AUTH-003 — onAuthStateChange incorrecto en ArbitroPanelPage
- **Archivo:** `src/pages/ArbitroPanelPage.jsx`.
- **Fix mínimo:** usar `useAuth()` o suscribir y `unsubscribe` correctamente.
- **Evidencia:** FASE3 grep.

### FP-SQL-001 — Casi sin SQL/migrations en checkout
- **Métrica:** 1 `.sql` visible; edge candidates 5; sin `netlify/functions` del árbol moderno.
- **Impacto:** no se puede validar drift SQL↔JS en este repo.
- **Fix mínimo:** sincronizar migrations/SQL reales al repo de deploy.

### FP-REPO-001 — Desalineación plan vs código cloud
- **Síntoma:** plan menciona motores/providers inexistentes aquí.
- **Fix mínimo:** re-ejecutar Gate0–15 sobre el árbol de producto real (desktop/`futpro.vip` build) antes de corregir freezes reportados por el usuario en esa app.

---

## Orden sugerido de corrección (1 cambio a la vez, post-aprobación)

1. FP-AUTH-001 (health storm)  
2. FP-SB-001 (schema gates 404/400)  
3. FP-NAV-001 (perfil / crear-equipo)  
4. FP-SB-002 (cliente único)  
5. FP-AUTH-002 (quitar getSession duplicados)  
6. FP-MEM-001 (cleanup channels)  
7. FP-UI-001 / FP-BUNDLE-001  
8. Resto P2  

**STOP:** no modificar `src/` hasta que se apruebe explícitamente esta matriz.
