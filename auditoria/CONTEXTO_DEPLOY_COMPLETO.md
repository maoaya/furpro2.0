# Contexto completo del deploy Zona Pro

**Para cruzar con** `Desktop\futpro2.0` cuando llegue el ZIP fuente.

| | |
|---|---|
| ZIP canónico | `deploy-6a7256d5ffd58e44433d5158.zip` |
| MD5 | `9ff7aad60440af4fe2500b3178732ef7` |
| Carpeta | `producto-deploy/` |
| Archivos publicables | **63** |
| Fuente esperado en PC | `C:\Users\lenovo\Desktop\futpro2.0` |
| Generado | `2026-08-08T20:54:47.640014+00:00` |

JSON máquina: `auditoria/CONTEXTO_DEPLOY_COMPLETO.json`

---

## Regla de depuración (cuando llegue el fuente)

1. Un archivo del PC **pertenece al producto** si su nombre (o build) corresponde a un chunk de esta lista.
2. Un `.jsx` de enero con el **mismo nombre** que un chunk **no** es prueba de que sea el mismo código (solo homónimo).
3. Todo lo que esté en `futpro2.0` y **no** alimente estos chunks / `package.json` / configs del build → candidato a basura o duplicado.
4. El deploy **no trae** `.jsx`; el mapeo es: `ChunkLogical-HASH.js` ↔ `ChunkLogical.jsx` en el PC.

---

## JSX confirmados dentro de los bundles

- `loginpagesnew.jsx`

Otros hints de nombre encontrados en bundles:
- `PartidosEnVivo.jsx`
- `loginpagesnew.jsx`

---

## Chunks JS del producto → JSX esperado en el PC

| Chunk (deploy) | Lógico | Tipo | JSX esperado en Desktop\futpro2.0 |
|---|---|---|---|
| `assets/AceptarTorneo-BxYPrUpU.js` | `AceptarTorneo` | page-chunk · ZONA PRO | `AceptarTorneo.jsx` |
| `assets/BuscarJugadoresPage-Ba1XA4PN.js` | `BuscarJugadoresPage` | page-chunk | `BuscarJugadoresPage.jsx` |
| `assets/BuscarUsuariosPage-CXPLZjs9.js` | `BuscarUsuariosPage` | page-chunk | `BuscarUsuariosPage.jsx` |
| `assets/CardEquipo-C2LerRC4.js` | `CardEquipo` | page-chunk | `CardEquipo.jsx` |
| `assets/CardFIFA-JTvbNZ_5.js` | `CardFIFA` | page-chunk · ZONA PRO | `CardFIFA.jsx` |
| `assets/ChatEquipoPage-CFKmchnx.js` | `ChatEquipoPage` | page-chunk | `ChatEquipoPage.jsx` |
| `assets/ChatTorneo-BB__Aj4H.js` | `ChatTorneo` | page-chunk | `ChatTorneo.jsx` |
| `assets/ChatTorneoPage-xTsKPQN4.js` | `ChatTorneoPage` | page-chunk | `ChatTorneoPage.jsx` |
| `assets/CrearTorneo-DemyjbvC.js` | `CrearTorneo` | page-chunk | `CrearTorneo.jsx` |
| `assets/EjerciciosPage-oJUR2TWm.js` | `EjerciciosPage` | page-chunk | `EjerciciosPage.jsx` |
| `assets/EquipoMenu-3er0hKt5.js` | `EquipoMenu` | page-chunk | `EquipoMenu.jsx` |
| `assets/EquiposPage-DCtRuFCl.js` | `EquiposPage` | page-chunk | `EquiposPage.jsx` |
| `assets/FansEquipo-CQreWqVL.js` | `FansEquipo` | page-chunk | `FansEquipo.jsx` |
| `assets/FormularioRegistroCompleto-DdkqOvO-.js` | `FormularioRegistroCompleto` | page-chunk | `FormularioRegistroCompleto.jsx` |
| `assets/InvitacionesEquipo-B93K5ESN.js` | `InvitacionesEquipo` | page-chunk | `InvitacionesEquipo.jsx` |
| `assets/LiveStreamPages-CMpvrrul.js` | `LiveStreamPages` | page-chunk | `LiveStreamPages.jsx` |
| `assets/MisTorneos-C8CdB6gS.js` | `MisTorneos` | page-chunk | `MisTorneos.jsx` |
| `assets/NotFoundPage-DV9Nnc7S.js` | `NotFoundPage` | page-chunk | `NotFoundPage.jsx` |
| `assets/PanelArbitro-DFMVAGW1.js` | `PanelArbitro` | page-chunk | `PanelArbitro.jsx` |
| `assets/PermisosEquipo-CifQVO7h.js` | `PermisosEquipo` | page-chunk | `PermisosEquipo.jsx` |
| `assets/PlantillaEquipo-SlBwgJbY.js` | `PlantillaEquipo` | page-chunk | `PlantillaEquipo.jsx` |
| `assets/Privacidad-DZu-TL35.js` | `Privacidad` | page-chunk | `Privacidad.jsx` |
| `assets/QADashboard-BkVKSD_a.js` | `QADashboard` | page-chunk · ZONA PRO | `QADashboard.jsx` |
| `assets/RegistroEntryRoute-CfFUwRAD.js` | `RegistroEntryRoute` | page-chunk | `RegistroEntryRoute.jsx` |
| `assets/SeguirTorneosPage-CgH_lYdI.js` | `SeguirTorneosPage` | page-chunk · ZONA PRO | `SeguirTorneosPage.jsx` |
| `assets/SoportePage-Cxbv8t2b.js` | `SoportePage` | page-chunk · ZONA PRO | `SoportePage.jsx` |
| `assets/StoriesPage-H_ulay3n.js` | `StoriesPage` | page-chunk | `StoriesPage.jsx` |
| `assets/VerEquipos-Cce5zEuy.js` | `VerEquipos` | page-chunk | `VerEquipos.jsx` |
| `assets/VideoFeed-AcKtyNgF.js` | `VideoFeed` | page-chunk | `VideoFeed.jsx` |
| `assets/framePipeline.worker-CLc9_q77.js` | `framePipeline.worker` | worker | `framePipeline.worker.jsx` |
| `assets/homeSearchUsersRpc-TzKRV4NH.js` | `homeSearchUsersRpc` | service-module | `homeSearchUsersRpc.jsx` |
| `assets/index-zp-nomenu-Hb7k2m.js` | `index-zp-nomenu` | page-chunk · ZONA PRO | `index-zp-nomenu.jsx` |
| `assets/loginpagesnew-BPP0r_st.js` | `loginpagesnew` | auth-page · ZONA PRO | `loginpagesnew.jsx` |
| `assets/seguirTorneosTabCache-D0oCVdgm.js` | `seguirTorneosTabCache` | service-module | `seguirTorneosTabCache.jsx` |
| `assets/supabase-X1tipi0N.js` | `supabase` | vendor | `—(entry/vendor/servicio)` |
| `assets/userContentLoadFunctions-BnpMKj8T.js` | `userContentLoadFunctions` | service-module | `userContentLoadFunctions.jsx` |
| `assets/vendor-C0jAFBLR.js` | `vendor` | vendor | `—(entry/vendor/servicio)` |
| `assets/videoPrefetch.worker-DM62tp9J.js` | `videoPrefetch.worker` | worker | `videoPrefetch.worker.jsx` |
| `assets/worldTopLeagues-CdiL4QUm.js` | `worldTopLeagues` | service-module · ZONA PRO | `worldTopLeagues.jsx` |
| `assets/zonaProTorneoPublishService-Dc9cOp9L.js` | `zonaProTorneoPublishService` | service-module · ZONA PRO | `zonaProTorneoPublishService.jsx` |

---

## Homónimos peligrosos (nombre también en enero)

Estos chunks del deploy tienen un `.jsx` con **nombre parecido** en `_legacy_archivo/src-ui-enero/`.
**No uses el de enero** como fuente del producto; al cruzar el PC, prioriza el archivo que realmente compiló este chunk.

| Chunk deploy | Lógico | Archivo enero (NO producto) |
|---|---|---|
| `assets/CardFIFA-JTvbNZ_5.js` | `CardFIFA` | `_legacy_archivo/src-ui-enero/pages/CardFIFA.jsx` |
| `assets/CrearTorneo-DemyjbvC.js` | `CrearTorneo` | `_legacy_archivo/src-ui-enero/pages/CrearTorneo.jsx` |
| `assets/FormularioRegistroCompleto-DdkqOvO-.js` | `FormularioRegistroCompleto` | `_legacy_archivo/src-ui-enero/pages/FormularioRegistroCompleto.jsx` |
| `assets/NotFoundPage-DV9Nnc7S.js` | `NotFoundPage` | `_legacy_archivo/src-ui-enero/pages/NotFoundPage.jsx` |
| `assets/PlantillaEquipo-SlBwgJbY.js` | `PlantillaEquipo` | `_legacy_archivo/src-ui-enero/pages/PlantillaEquipo.jsx` |
| `assets/Privacidad-DZu-TL35.js` | `Privacidad` | `_legacy_archivo/src-ui-enero/pages/Privacidad.jsx` |

---

## Chunks sin homónimo en enero (señal fuerte de fuente PC)

Si al abrir `Desktop\futpro2.0` **faltan** estos nombres, el zip fuente está incompleto o es otra carpeta:

- `AceptarTorneo.jsx` (o módulo equivalente)
- `BuscarJugadoresPage.jsx` (o módulo equivalente)
- `BuscarUsuariosPage.jsx` (o módulo equivalente)
- `CardEquipo.jsx` (o módulo equivalente)
- `ChatEquipoPage.jsx` (o módulo equivalente)
- `ChatTorneo.jsx` (o módulo equivalente)
- `ChatTorneoPage.jsx` (o módulo equivalente)
- `EjerciciosPage.jsx` (o módulo equivalente)
- `EquipoMenu.jsx` (o módulo equivalente)
- `EquiposPage.jsx` (o módulo equivalente)
- `FansEquipo.jsx` (o módulo equivalente)
- `InvitacionesEquipo.jsx` (o módulo equivalente)
- `LiveStreamPages.jsx` (o módulo equivalente)
- `MisTorneos.jsx` (o módulo equivalente)
- `PanelArbitro.jsx` (o módulo equivalente)
- `PermisosEquipo.jsx` (o módulo equivalente)
- `QADashboard.jsx` (o módulo equivalente)
- `RegistroEntryRoute.jsx` (o módulo equivalente)
- `SeguirTorneosPage.jsx` (o módulo equivalente)
- `SoportePage.jsx` (o módulo equivalente)
- `StoriesPage.jsx` (o módulo equivalente)
- `VerEquipos.jsx` (o módulo equivalente)
- `VideoFeed.jsx` (o módulo equivalente)
- `framePipeline.worker.jsx` (o módulo equivalente)
- `homeSearchUsersRpc.jsx` (o módulo equivalente)
- `index-zp-nomenu.jsx` (o módulo equivalente)
- `loginpagesnew.jsx` (o módulo equivalente)
- `seguirTorneosTabCache.jsx` (o módulo equivalente)
- `userContentLoadFunctions.jsx` (o módulo equivalente)
- `videoPrefetch.worker.jsx` (o módulo equivalente)
- `worldTopLeagues.jsx` (o módulo equivalente)
- `zonaProTorneoPublishService.jsx` (o módulo equivalente)

---

## CSS

- `assets/CrearTorneo-DQgvw16o.css` ← `CrearTorneo`
- `assets/FormularioRegistroCompleto-DOQtZrac.css` ← `FormularioRegistroCompleto`
- `assets/index-DoGwQ0mo.css` ← `index`

## Media / estáticos

- `assets/futpro-fifa-card-frame.png` (179170 bytes)
- `assets/notification-fallback-zona-pro.png` (90301 bytes)
- `assets/perfilpro-fifa-template.png` (190223 bytes)
- `assets/sprites/keeper-dive-left.svg` (674 bytes)
- `assets/sprites/keeper-dive-right.svg` (688 bytes)
- `assets/sprites/keeper-dive-up.svg` (653 bytes)
- `assets/sprites/keeper-idle.svg` (806 bytes)
- `assets/sprites/kicker-idle.svg` (609 bytes)
- `assets/sprites/kicker-runup.svg` (678 bytes)
- `crear-torneo-premium.jpg` (311102 bytes)
- `crear-torneo-premium.svg` (9872 bytes)
- `favicon.ico` (0 bytes)
- `favicon.svg` (9522 bytes)
- `icons.svg` (5031 bytes)

## Entrada HTML

Assets referenciados por `index.html`:

- `assets/index-`
- `assets/index-DoGwQ0mo.css`
- `assets/index-zp-nomenu-Hb7k2m.js`
- `assets/loginpagesnew-BPP0r_st.js`
- `assets/supabase-X1tipi0N.js`
- `assets/vendor-C0jAFBLR.js`

---

## Inventario completo (63 archivos)

| Ruta | Bytes | SHA256 (12) |
|---|---:|---|
| `MANIFEST_CANONICO.json` | 27119 | `318d5980fdd3` |
| `README_PRODUCTO.txt` | 48 | `65271202b471` |
| `SOURCE_ZIP.txt` | 73 | `35a07fa123ac` |
| `VERSION_LOCK.txt` | 196 | `71d954345a44` |
| `assets/AceptarTorneo-BxYPrUpU.js` | 11794 | `28af5d198b7e` |
| `assets/BuscarJugadoresPage-Ba1XA4PN.js` | 13494 | `e73aeada6b32` |
| `assets/BuscarUsuariosPage-CXPLZjs9.js` | 43105 | `87f86d1577db` |
| `assets/CardEquipo-C2LerRC4.js` | 6903 | `60c58214d9f3` |
| `assets/CardFIFA-JTvbNZ_5.js` | 4157 | `655b8ff7a4ac` |
| `assets/ChatEquipoPage-CFKmchnx.js` | 7881 | `4c05e5edad0b` |
| `assets/ChatTorneo-BB__Aj4H.js` | 39406 | `a7a3df100d23` |
| `assets/ChatTorneoPage-xTsKPQN4.js` | 3673 | `83c5647e7f33` |
| `assets/CrearTorneo-DQgvw16o.css` | 264 | `2c5b6c89f277` |
| `assets/CrearTorneo-DemyjbvC.js` | 24068 | `3faee407f9b9` |
| `assets/EjerciciosPage-oJUR2TWm.js` | 2727 | `7b1525dbf33a` |
| `assets/EquipoMenu-3er0hKt5.js` | 7117 | `2ddf3277b9d6` |
| `assets/EquiposPage-DCtRuFCl.js` | 12183 | `ce05409051db` |
| `assets/FansEquipo-CQreWqVL.js` | 3789 | `a05b2fe1abcb` |
| `assets/FormularioRegistroCompleto-DOQtZrac.css` | 2514 | `b5a8644c57c6` |
| `assets/FormularioRegistroCompleto-DdkqOvO-.js` | 39565 | `98432131b188` |
| `assets/InvitacionesEquipo-B93K5ESN.js` | 11591 | `13d126ae4989` |
| `assets/LiveStreamPages-CMpvrrul.js` | 12512 | `406449471ef9` |
| `assets/MisTorneos-C8CdB6gS.js` | 16336 | `3e726698f642` |
| `assets/NotFoundPage-DV9Nnc7S.js` | 1874 | `52d71727d92c` |
| `assets/PanelArbitro-DFMVAGW1.js` | 14245 | `96bec8db52dd` |
| `assets/PermisosEquipo-CifQVO7h.js` | 15259 | `b35e736fcb04` |
| `assets/PlantillaEquipo-SlBwgJbY.js` | 23499 | `7b126ae5c75c` |
| `assets/Privacidad-DZu-TL35.js` | 3546 | `3a5b506c7ae3` |
| `assets/QADashboard-BkVKSD_a.js` | 7458 | `bb9387781e8d` |
| `assets/RegistroEntryRoute-CfFUwRAD.js` | 737 | `ce6bfd006b3d` |
| `assets/SeguirTorneosPage-CgH_lYdI.js` | 78784 | `afa5651e0049` |
| `assets/SoportePage-Cxbv8t2b.js` | 3803 | `30b117d486e5` |
| `assets/StoriesPage-H_ulay3n.js` | 31639 | `e243f4bd77a1` |
| `assets/VerEquipos-Cce5zEuy.js` | 437 | `8fb790276b89` |
| `assets/VideoFeed-AcKtyNgF.js` | 10435 | `8e766d5a097f` |
| `assets/framePipeline.worker-CLc9_q77.js` | 5831 | `69eff8821a7c` |
| `assets/futpro-fifa-card-frame.png` | 179170 | `fc1b26ce13d3` |
| `assets/homeSearchUsersRpc-TzKRV4NH.js` | 3900 | `03b391eee4a4` |
| `assets/index-DoGwQ0mo.css` | 124173 | `72200c27e811` |
| `assets/index-zp-nomenu-Hb7k2m.js` | 4377835 | `c03b843e445d` |
| `assets/loginpagesnew-BPP0r_st.js` | 9744 | `01ba20ccd7b2` |
| `assets/notification-fallback-zona-pro.png` | 90301 | `b1349559a412` |
| `assets/perfilpro-fifa-template.png` | 190223 | `fe48962c6124` |
| `assets/seguirTorneosTabCache-D0oCVdgm.js` | 2937 | `f50607e3a595` |
| `assets/sprites/keeper-dive-left.svg` | 674 | `c9b0359a38db` |
| `assets/sprites/keeper-dive-right.svg` | 688 | `cc0fd9c19ff1` |
| `assets/sprites/keeper-dive-up.svg` | 653 | `07055c42ee63` |
| `assets/sprites/keeper-idle.svg` | 806 | `1271e5c58ff5` |
| `assets/sprites/kicker-idle.svg` | 609 | `3931e8550a7f` |
| `assets/sprites/kicker-runup.svg` | 678 | `a8bce2a89717` |
| `assets/sprites/readme.txt` | 564 | `a768f3097d26` |
| `assets/supabase-X1tipi0N.js` | 190809 | `227aed6d9fb7` |
| `assets/userContentLoadFunctions-BnpMKj8T.js` | 17886 | `6392fe481e45` |
| `assets/vendor-C0jAFBLR.js` | 1010624 | `f245679cedb2` |
| `assets/videoPrefetch.worker-DM62tp9J.js` | 807 | `238ec95d4f12` |
| `assets/worldTopLeagues-CdiL4QUm.js` | 3702 | `69e2b45444a2` |
| `assets/zonaProTorneoPublishService-Dc9cOp9L.js` | 4554 | `b328b2ad82c6` |
| `crear-torneo-premium.jpg` | 311102 | `ff3ed1bf4da1` |
| `crear-torneo-premium.svg` | 9872 | `4d73b16d3b41` |
| `favicon.ico` | 0 | `e3b0c44298fc` |
| `favicon.svg` | 9522 | `61bc9a161de5` |
| `icons.svg` | 5031 | `b45fa506195c` |
| `index.html` | 4807 | `ace966d63b58` |

---

## Checklist al recibir `futpro2.0.zip` fuente

- [ ] Existe `package.json`
- [ ] Existe `src/` con `.jsx`
- [ ] Existe `loginpagesnew.jsx` (o ruta que lo exporte)
- [ ] Existen chunks solo-deploy: `MisTorneos`, `SeguirTorneosPage`, `ChatTorneo`, `AceptarTorneo`, `PanelArbitro`, etc.
- [ ] Contar `.jsx` totales vs esta lista de lógicos
- [ ] Marcar duplicados: mismo nombre en varias carpetas → quedarse con el que matchee el build
- [ ] Apartar todo lo que no esté en esta lista ni sea dependencia de build (`node_modules` fuera)
