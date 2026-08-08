# Auditoría forense — desconfiguración / “vuelta a versiones viejas”

**Fecha del informe:** 2026-08-08  
**Alcance:** solo el repositorio remoto `maoaya/furpro2.0` clonado en Cloud Agent  
**Run Cloud principal:** `bc-07b20079-9fe1-440f-95d7-004112dbf7dd` (“System performance issues”)  
**Base de verdad remota:** `origin/master` = `80d7863` (2026-01-18) — **sin merges** de las ramas del agente  

---

## 1. Veredicto (causa raíz)

El sistema **no se “desconfiguró solo”**. Ocurrió una **cadena de intervenciones del Cloud Agent sobre un árbol de GitHub incompleto / antiguo**, más la **reactivación de residuos HTML de ~10 meses** que ya vivían en el repo.

| # | Causa | Evidencia |
|---|--------|-----------|
| **C1** | El agente trabajó sobre **GitHub `furpro2.0`**, no sobre la carpeta Windows del 6 ago con UI ZONA PRO (jersey/trofeo) | Cloud `environment-info` → repo `maoaya/furpro2.0`. Esos assets/diseño **no existen** en ningún commit de este remoto. |
| **C2** | El **primer rediseño destructivo** fue `fe76f3d` / `d614691` (2026-08-06 **19:03** Colombia) en `cursor/opt-nav-notif-mercado-f7dd` | Diff masivo de `App.jsx`, `HomePage.jsx`, notificaciones; Home guest forzado en `/`. PR **#7** (cerrada: DO NOT MERGE). |
| **C3** | El repo **ya contenía** `homepage-instagram.html`, stubs y docs/tests que lo tratan como canónico | Presentes en `master` desde antes del agente (p. ej. commit `4d64150` 2025-12-12). |
| **C4** | Un agente posterior **reactivó** ese HTML residual como “home” (`bab2667`, PR **#10**, cerrada) | Peor: HTML Instagram de 2025 sobre rutas SPA. |
| **C5** | Intentos de “restaurar” (`5328e9e` / PR **#11**) **aproximaron** ZONA PRO en React, pero **no** recuperaron el diseño real del escritorio | No hay blobs de jersey/trofeo en el historial remoto. |
| **C6** | `master` **nunca recibió** esos merges → la “desconfiguración” vive en **ramas/PRs y clones locales** que las checkoutearon, no en un rewrite de `master` | `git log origin/master` termina en `80d7863` (ene 2026). |

**Conclusión:** lo que se percibió como “volvió a versiones viejas y sin sentido” es la **superposición** de (a) UI reescrita por el agente el 6 ago 19:03, (b) **HTML Instagram residual** del propio repo, y (c) la **imposibilidad** de restaurar desde Cloud el producto real del 6 ago porque **nunca estuvo en este remoto**.

---

## 2. Línea de tiempo forense (Colombia, UTC−5)

| Hora (aprox.) | Evento | Ref |
|---------------|--------|-----|
| **2025-10-20** | Aparición de `homepage-instagram.html` / perfil Instagram en el repo | `git log --follow` → `5c2d98c` |
| **2025-12-12** | Backup “versión funcional” con `AuthPageUnificada` en rutas login | `4d64150` |
| **2026-01-02** | `LoginPage` **sustituye** `AuthPageUnificada` en `App.jsx` | `56d7d81` |
| **2026-01-18** | Último commit en `master` remoto | `80d7863` |
| **2026-08-06 ~17:40–18:50** | Cadena P0/P1 del agente (auth health, schema gate, nav, useAuth, memory) | `4a5d2a0` … `4f98d93` |
| **2026-08-06 19:03** | **Rotura visual / semántica** (nav + notif + mercado en Home) | `fe76f3d`, `d614691` |
| **2026-08-06/07** | Intentos Instagram HTML / restore AuthPageUnificada | `bab2667`, `5328e9e` |
| **2026-08-07+** | Usuario reporta diseño destruido; PRs #7/#10 cerradas como no mergear | GitHub PR state |

### Cadena de commits del agente (mismo día, tip → base)

```
d614691  fix(ui): polish guest Home …          ← misma hora 19:03, encima del rediseño
fe76f3d  feat(ui): optimize nav/notif + mercado ← **PUNTO DE ROTURA**
4f98d93  docs+test: evidence FP-AUTH-002/MEM-001 ← último estado “antes de la rotura” en esta cadena
4a2ec07  fix(mem): cleanup …
7cf09ea  fix(auth): useAuth …
… (FP-NAV / FP-SB / FP-AUTH-001) …
80d7863  origin/master (ene 2026)
```

---

## 3. Inventario: qué archivos modificó el agente (por oleada)

### 3.1 Oleada P0/P1 (antes de la rotura) — `4a5d2a0` … `4f98d93`

Cambios **funcionales/auditoría** (no el rediseño Home/login):

- `src/lib/supabase.js`, `src/lib/supabaseClient.js`
- `src/hooks/useAuth.js`, `src/context/AuthContext.jsx`
- `src/pages/CrearEquipo.jsx`, `src/pages/CrearEquipoPage.jsx`
- `vite.config.js` (SPA fallback /perfil)
- `src/components/GlobalNav.jsx` (cleanup canales)
- `auditoria/*`, scripts `_validate_fp_*.mjs`

**Ramas / PRs:** #3–#6 (abiertas/draft al cierre de este informe).

### 3.2 Oleada ROTURA — `fe76f3d` + `d614691` (PR #7, **CLOSED**)

Archivos tocados en el commit de rotura (`fe76f3d`):

| Archivo | Qué cambió (síntesis) |
|---------|------------------------|
| `src/App.jsx` | Rutas; `/` → Home guest; wrappers auth/perfil |
| `src/pages/HomePage.jsx` | Stories demo + strip mercado; rediseño guest |
| `src/components/NotificationItem.jsx` | **Creado** |
| `src/components/NotificationCenter.jsx` | Refactor |
| `src/components/GlobalNav.jsx` | Optimización nav |
| `src/lib/futproMetricsBridge.js` | **Creado** |
| `src/lib/realtimeNotifications.js` | Ajustes |
| `src/pages/MercadoPage.jsx` | Integración |
| `src/index.css` / estilos Home | Look nuevo |
| `auditoria/OPT_NAV_NOTIF_MERCADO_*` | Docs de la oleada |

**Efecto percibido:** la app deja de parecer el producto del usuario y pasa a un Home “Instagram/demo + mercado”.

### 3.3 Oleada HTML Instagram — `bab2667` (PR #10, **CLOSED**)

| Archivo | Qué hizo |
|---------|----------|
| `vite.config.js` | Priorizó `homepage-instagram.html` |
| `public/homepage-instagram.html` | Cableado como entrada |
| `src/pages/homepage-instagram.html` | Residuo activado |
| Docs restore | Narrativa errónea de “restauración” |

**Efecto:** reaparición explícita de **código de ~oct 2025**.

### 3.4 Oleada “restore” aproximado — `5328e9e` (PR #11)

| Archivo | Qué hizo |
|---------|----------|
| `src/pages/AuthPageUnificada.jsx` | UI tipo ZONA PRO **aproximada** (sin assets reales) |
| `src/App.jsx` | Rutas login → AuthPageUnificada |
| `legacy-html-stubs/` | Cuarentena de HTML (en esa rama) |
| `vite.config.js` | Priorizar SPA |

**Efecto:** mejora parcial vs Instagram HTML, **pero no** el login real del 6 ago del escritorio.

---

## 4. Artefactos “viejos” y copias de seguridad **ya presentes en el repo**

Estos archivos **preexistían en `master`**; el agente no los inventó el 6 ago, pero **sí** los reactivó o los docs/tests los trataron como canónicos.

### 4.1 HTML / stubs residuales

| Ruta | Origen aproximado |
|------|-------------------|
| `public/homepage-instagram.html` | ~2025-10-20 (`5c2d98c`) |
| `src/pages/homepage-instagram.html` | mismo linaje |
| `src/pages/perfil-instagram.html` | mismo linaje |
| `src/stubs/*` | stubs de desarrollo |
| Varios `*.html` en raíz/`public/` | landing / demos |

### 4.2 Backups / copias en el árbol

| Ruta | Nota |
|------|------|
| `src/components/GlobalNav_backup.jsx` | Copia de nav |
| `src/components/perfil/PerfilCard.jsx.backup` | Backup de perfil |
| `netlify.toml.backup` | Config backup |
| Docs `BACKUP_*`, `RESTAURACION_*`, `auditoria/*` | Narrativa histórica contradictoria |

### 4.3 Cambio histórico de auth (no del agente 6 ago)

- **`4d64150` (2025-12-12):** backup con `AuthPageUnificada` en login.  
- **`56d7d81` (2026-01-02):** `LoginPage` reemplaza `AuthPageUnificada` en rutas.  

Eso explica por qué “AuthPageUnificada” aparece en backups antiguos y no como UI canónica en `master` de ene 2026.

---

## 5. Qué **no** pasó (descartes forenses)

| Hipótesis | Resultado |
|-----------|-----------|
| Force-push / rewrite de `master` el 6–7 ago | **Falso** — `origin/master` sigue en `80d7863` |
| Merge a producción desde PR #7 / #10 | **No** — ambas **CLOSED** sin merge |
| El diseño jersey/trofeo del 6 ago vive en otro commit de este remoto | **No encontrado** en historial de blobs |
| Una sola persona “volvió el repo entero a 2025” | **Parcialmente engañoso** — fue **activación selectiva** de residuos + rediseño agente |

---

## 6. Mapa de recuperación (este remoto)

Detalle ampliado (momentos de mezcla + comandos):  
→ **`auditoria/RECUPERACION_CODIGO_PERDIDO_20260808.md`**

| Objetivo | Ref Git | Comando |
|----------|---------|---------|
| GitHub limpio (ene 2026), sin cambios agente | `origin/master` = `80d7863` | `git checkout master && git reset --hard origin/master` |
| Estado Cloud del **6 ago antes del rediseño** | `4f98d93` / `cursor/volver-antes-rotura-f7dd` | `git checkout cursor/volver-antes-rotura-f7dd` |
| **Producto real ZONA PRO del 6 ago** | **No está en este remoto** | Recuperar en Windows: Local History / Timeline / `git reflog` de **esa** carpeta y **pushear** a GitHub |

**Nota:** incluso en `master`, `public/_redirects` ya manda `/home` → `homepage-instagram.html` (mezcla estructural desde ~oct 2025, no solo el agente).

### PRs a no mergear (diseño)

- **#7** — rediseño Home guest  
- **#10** — homepage-instagram  

### PRs P0/P1 (funcionales; evaluar aparte del diseño)

- **#3–#6** — auth health, schema gate, nav perfil/equipo, useAuth + memory  
- **#11** — restore aproximado AuthPageUnificada (útil solo si se acepta UI aproximada)

---

## 7. Por qué “códigos antiguos” reaparecieron (mecanismo)

```
Repo master (ene 2026)
  ├─ SPA React incompleta vs escritorio usuario
  ├─ Residuos HTML Instagram (oct 2025) ────────┐
  └─ Docs/tests que citan homepage-instagram    │
                                                 │
Cloud Agent 6 ago 19:03                          │
  └─ reescribe App/Home/nav/notif ───────────────┤──► UI “sin sentido”
                                                 │
Agente posterior                                 │
  └─ cablea homepage-instagram.html ◄────────────┘──► “versión vieja” visible
```

No hace falta un rollback completo del repo: basta **servir un artefacto viejo** o **reescribir la Home** para que el producto se sienta “desconfigurado”.

---

## 8. Responsabilidad y alcance Cloud vs Desktop

| Entorno | Qué contiene |
|---------|----------------|
| **Cloud / este clone** | Solo `maoaya/furpro2.0` + ramas del agente |
| **Escritorio usuario (6 ago)** | App completa ZONA PRO — **fuente de verdad del diseño** |
| **Capacidad de este informe** | Explicar y fechar daños en GitHub; **no** recuperar binarios/assets que nunca se subieron |

---

## 9. Recomendaciones inmediatas

1. En cualquier máquina con el clone “roto”: volver a `origin/master` o a `4f98d93`.  
2. **No mergear** #7 ni #10.  
3. En el PC del 6 ago: localizar el árbol bueno (Timeline / Local History / reflog) y **subirlo** a una rama nueva (`cursor/producto-real-6ago-f7dd` o similar).  
4. Después de tener el árbol real en GitHub: aislar o borrar `homepage-instagram.html` y backups activos del path de servir.  
5. Tratar PRs #3–#6 como cherry-picks opcionales **sobre** el código real, no sobre el rediseño.

---

## 10. Apéndice — referencias rápidas

| Ítem | Valor |
|------|--------|
| Repo | `https://github.com/maoaya/furpro2.0` |
| `master` tip | `80d7863` |
| Pre-rotura cadena agente | `4f98d93` |
| Commit rotura | `fe76f3d` (+ polish `d614691`) |
| HTML Instagram reactivo | `bab2667` |
| Restore aproximado | `5328e9e` |
| Run Cloud | `bc-07b20079-9fe1-440f-95d7-004112dbf7dd` |

---

*Informe generado a partir de `git log` / `git show` / estado de PRs GitHub / metadata Cloud. No modifica `master`.*
