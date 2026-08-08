🚀 GUÍA DE DESPLIEGUE - CAMBIOS FUTPRO 2.0
=========================================

📋 CHECKLIST DE IMPLEMENTACIÓN

PASO 1: EJECUTAR SQL (CRÍTICO)
================================

1.1 Abrir Supabase Dashboard
   - URL: https://app.supabase.com
   - Seleccionar proyecto futpro

1.2 Ir a SQL Editor
   - Crear nueva query
   - Copiar contenido de: STREAMING_TABLES.sql
   - Ejecutar

1.3 Verificar creación:
   ✓ Tabla live_streams
   ✓ Tabla stream_comments
   ✓ Tabla stream_reactions
   ✓ Tabla stream_events
   ✓ Columnas en tournament_matches (stream_id, is_streaming, etc.)
   ✓ Índices creados
   ✓ RLS policies activas
   ✓ Triggers activos

1.4 Si hay errores:
   - Verificar que tournament_matches existe
   - Verificar que usuarios tabla existe
   - Si hay error de RLS, ejecutar sin RLS primero y agregarlo después

---

PASO 2: CREAR/ACTUALIZAR COMPONENTES (FRONTEND)
================================================

2.1 Componente CrearTorneoMejorado
   ARCHIVOS:
   - src/components/CrearTorneoMejorado.jsx ✅ CREADO
   - src/components/CrearTorneoMejorado.css ✅ CREADO
   
   VERIFICAR:
   - Importa TournamentService
   - Contiene 4 pasos
   - CSS con animaciones

2.2 Componente RankingMejorado
   ARCHIVOS:
   - src/components/RankingMejorado.jsx ✅ CREADO
   - src/components/RankingMejorado.css ✅ CREADO
   
   VERIFICAR:
   - Importa TournamentService y RefereeService
   - Tab de equipos con filtros
   - Tab de árbitros

2.3 StreamingService
   ARCHIVO:
   - src/services/StreamingService.js ✅ ACTUALIZADO
   
   VERIFICAR:
   - 11 funciones disponibles
   - Importa supabaseClient
   - Sin errores de sintaxis

2.4 FormularioRegistroCompleto (MODIFICADO)
   ARCHIVO:
   - src/components/FormularioRegistroCompleto.jsx ✅ ACTUALIZADO
   
   VERIFICAR:
   - Opción "Árbitro" REMOVIDA
   - Campos de documentación de árbitro REMOVIDOS
   - Compilación sin errores

---

PASO 3: AGREGAR RUTAS (ROUTER)
==============================

3.1 Encontrar archivo de rutas
   - Típicamente: src/routes.jsx o src/App.jsx o src/pages.jsx

3.2 Agregar rutas para nuevos componentes:

```jsx
// Agregar imports
import CrearTorneoMejorado from './components/CrearTorneoMejorado';
import RankingMejorado from './components/RankingMejorado';

// Agregar rutas
{
  path: '/crear-torneo',
  element: <CrearTorneoMejorado />
}

{
  path: '/ranking',
  element: <RankingMejorado />
}
```

3.3 Verificar navegación:
   - Botón en menú principal → /crear-torneo
   - Botón en menú principal → /ranking

---

PASO 4: TESTING BÁSICO (LOCAL)
=============================

4.1 Iniciar servidor de desarrollo:
   npm run dev

4.2 Probar CrearTorneoMejorado:
   - Navegar a /crear-torneo
   - Completar 4 pasos
   - Verificar que se crea en BD

4.3 Probar RankingMejorado:
   - Navegar a /ranking
   - Tab Equipos: aplicar filtros
   - Tab Árbitros: ver listado

4.4 Probar Streaming (si hay partidos):
   - Iniciar stream desde partido
   - Ver contador de espectadores
   - Enviar comentarios
   - Verificar que se guardan

---

PASO 5: VERIFICAR INTEGRACIONES (BACKEND)
==========================================

5.1 TournamentService
   ✓ Importado en CrearTorneoMejorado
   ✓ createTournament() funciona
   ✓ getTournamentById() funciona
   ✓ getTeamRankings() funciona
   ✓ getGroupStandings() funciona

5.2 RefereeService
   ✓ Importado en RankingMejorado
   ✓ getAvailableReferees() funciona

5.3 StreamingService
   ✓ startLiveStream() funciona
   ✓ getActiveStreams() funciona
   ✓ getLiveComments() funciona

---

PASO 6: DEPLOY A PRODUCCIÓN
===========================

6.1 Antes de deploy:
   npm run build          # Verificar que compila
   npm test              # Ejecutar tests (si existen)

6.2 Deploy:
   - Con Netlify: npm run deploy
   - Manual: git push

6.3 Verificar en producción:
   - https://futpro.vip/crear-torneo
   - https://futpro.vip/ranking
   - Probar funcionalidades críticas

---

⚠️ CONSIDERACIONES IMPORTANTES

INCOMPATIBILIDADES CONOCIDAS:
- FormularioRegistroCompleto sin rol "Árbitro"
  → Los árbitros se crean desde panel de organizador
  → No está la UI para crearlos automáticamente

TESTING NECESARIO:
- Streaming con >100 espectadores
- Chat en tiempo real (Realtime de Supabase)
- Filtros en Ranking con >1000 equipos
- Performance de tablas grandes

BACKUPS:
- Hacer backup de BD antes de ejecutar SQL
- Mantener versión anterior de componentes

---

📱 SOPORTE A MÓVIL

CrearTorneoMejorado:
✅ Responsive (CSS con @media)
✅ Steps se apilan en móvil
✅ Inputs ocupan ancho completo

RankingMejorado:
✅ Tabla scrollea horizontal en móvil
✅ Filtros se apilan en móvil
✅ Cards de árbitros en columna única

---

🔒 SEGURIDAD

Verificar RLS policies:
✓ live_streams: Anyone can view active
✓ stream_comments: Anyone can read, authenticated can insert
✓ tournament_matches: Aplicar según necesidad

---

📞 TROUBLESHOOTING

Error: "Tabla no existe"
→ Ejecutar STREAMING_TABLES.sql nuevamente

Error: "RLS policy error"
→ Verificar que usuario está autenticado
→ Revisar permisos en Supabase auth

Error: "TournamentService is not defined"
→ Verificar import en componente
→ Verificar que archivo existe en src/services/

Error: "Stream no actualiza"
→ Verificar que Supabase Realtime está habilitado
→ Revisar firewall/proxy

---

📊 MONITOREO POST-DEPLOY

Métricas a verificar:
- ✓ Creación de torneos (>0 por día)
- ✓ Uso de ranking (>10 visitas por día)
- ✓ Streams activos (>1 por semana)
- ✓ Comentarios en vivo (>10 por stream)
- ✓ Disponibilidad de árbitros (>5 activos)

Logs a revisar:
- Errores de Supabase
- Performance de queries SQL
- Realtime subscriptions activas

---

✅ CHECKLIST FINAL

Antes de considerar "Listo":

Backend:
☑️ STREAMING_TABLES.sql ejecutado sin errores
☑️ Todas las 4 tablas creadas
☑️ RLS policies activas
☑️ Triggers funcionan
☑️ Índices creados

Frontend:
☑️ CrearTorneoMejorado compila y funciona
☑️ RankingMejorado compila y funciona
☑️ Rutas agregadas y accesibles
☑️ Estilos CSS se cargan correctamente
☑️ Componentes se integran con servicios

Testing:
☑️ Crear torneo end-to-end
☑️ Ver ranking con filtros
☑️ Panel de árbitros muestra datos
☑️ Streaming básico funciona

Production:
☑️ Build compila sin warnings
☑️ Deploy exitoso a Netlify
☑️ URLs accesibles
☑️ BD conecta correctamente

---

📝 Fecha de implementación: ${new Date().toLocaleDateString('es-ES')}
📝 Versión: FutPro 2.0 - Sprint 2
📝 Estado: LISTO PARA DEPLOY

Contactar a desarrollador si hay problemas.
