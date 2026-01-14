#!/usr/bin/env node

# ================================================================
# LISTA DE TAREAS Y ACCIONES - FUTPRO 2.0
# Prioridad: INMEDIATA (Semana 1)
# ================================================================

## 1. INVITACIONES A EQUIPOS ✅ CÓDIGO LISTO
- [x] Crear tabla `team_invitations` en Supabase
- [x] Crear componente `ConvocarJugadores.jsx` (búsqueda por nombre/ubicación)
- [x] Implementar filtros por campeonato, categoría, edad máxima
- [x] Interfaz de selección y envío de invitaciones
- [ ] Crear página "Mis Invitaciones" para que usuarios vean solicitudes recibidas
- [ ] Implementar aceptar/rechazar invitaciones
- [ ] Notificaciones cuando recibe invitación
- [ ] Actualizar automaticamente `team_rosters` al aceptar

**ARCHIVOS:**
- SCHEMA_INVITACIONES_PLANTILLA.sql (crear tablas)
- src/components/ConvocarJugadores.jsx (listo)

---

## 2. VER MI PLANTILLA ✅ CÓDIGO LISTO
- [x] Crear tabla `team_rosters` en Supabase
- [x] Crear página `VerMiPlantilla.jsx`
- [x] Mostrar campo de fútbol visual (distribución por posiciones)
- [x] Configuraciones por tipo: futsal 5, fútbol 5/6/7/8/9/10/11, penaltis
- [ ] Arrastrar y soltar jugadores en el campo
- [ ] Cambiar número y posición de cada jugador
- [ ] Exportar plantilla como imagen
- [ ] Ver historial de cambios en plantilla

**ARCHIVOS:**
- SCHEMA_INVITACIONES_PLANTILLA.sql (team_rosters)
- src/pages/VerMiPlantilla.jsx (listo)

---

## 3. TRANSMISIÓN EN VIVO ⚠️ PARCIAL
- [x] Integrar Supabase en LiveStreamPage
- [x] Registrar transmisión con título y descripción
- [x] Crear tabla `live_stream_scores` para marcadores
- [x] Crear tabla `stream_notifications` para notificaciones
- [ ] Agregar INPUT para marcador en tiempo real (ej: 1-0 en minuto 25)
- [ ] Sistema de likes/comentarios EN VIVO durante transmisión
- [ ] Mostrar contador de espectadores conectados
- [ ] Notificar automáticamente a seguidores que estamos en vivo
- [ ] Sugerencias de transmisiones populares en feed
- [ ] Chat en vivo durante transmisión (usar Firebase Realtime)
- [ ] Grabar transmisión y guardar video

**FALTA HACER:**
1. Componente para actualizar marcador (equipo A/B, goles, minuto)
2. Endpoint para traer transmisiones en vivo y notificar
3. Integración de chat Firebase en LiveStreamPage
4. View de transmisiones sugeridas

**ARCHIVOS:**
- SCHEMA_INVITACIONES_PLANTILLA.sql (live_stream_scores, stream_notifications)
- src/pages/LiveStreamPage.jsx (básico, listo)

---

## 4. NOMBRE Y FOTO EN PUBLICACIONES ✅ ACTUALIZADO
- [x] Corregir para traer nombre/apellido desde `carfutpro`
- [x] Corregir para traer foto desde `carfutpro`
- [x] Sincronizar con `futpro_publicaciones_globales` en localStorage (para homepage)
- [x] Agregar publicación a tabla `post_moments` (momentos del usuario)
- [ ] Mostrar página de perfil con momentos del usuario (galería)
- [ ] Permitir ocultar/eliminar publicaciones
- [ ] Permitir compartir publicación a historias

**ARCHIVOS:**
- src/components/UploadContenidoComponent.jsx (actualizado)

---

## 5. TERMINAR CREACIÓN DE EQUIPO ⚠️ EN PROGRESO
- [x] Crear tabla `teams` (ya existe)
- [x] Crear tabla `team_rosters` (para agregar jugadores)
- [ ] Verificar flujo: CrearEquipo → Redirigir a "Mis Equipos"
- [ ] Mostrar botón "Ver Mi Equipo" en homepage después de crear
- [ ] Mostrar confirmación visual "Equipo creado exitosamente"
- [ ] Permitir editar datos del equipo después de crear
- [ ] Agregar foto/escudo del equipo (ya está en código)
- [ ] Crear card del equipo en `carfutpro` con `es_equipo: true`

**VERIFICA EN:**
- src/pages/CrearEquipo.jsx (revisar últimas líneas)

---

## 6. SUBIR HISTORIAS ✅ CÓDIGO LISTO
- [x] Crear tabla `stories` en Supabase
- [x] Crear componente `HistoriasComponent.jsx`
- [x] Interfaz para subir foto/video
- [x] Establecer expiración automática (24 horas)
- [ ] Ver historias de otros usuarios
- [ ] Indicador de historias nuevas en navbar
- [ ] Guardar visualizaciones de historias
- [ ] Permitir responder a historias privadamente
- [ ] Stickers y textos en historias (editor básico)

**ARCHIVOS:**
- SCHEMA_INVITACIONES_PLANTILLA.sql (stories)
- src/components/HistoriasComponent.jsx (listo)

---

## 7. INTEGRACIÓN EN COMPONENTES PRINCIPALES
- [ ] Agregar `ConvocarJugadores` a página del equipo
- [ ] Agregar `VerMiPlantilla` a rutas en App.jsx
- [ ] Agregar `HistoriasComponent` a BottomNavBar.jsx
- [ ] Integrar vista de "Mis Invitaciones" en navbar
- [ ] Mostrar "Ver Mis Momentos" en perfil de usuario

**RUTAS A AGREGAR EN src/App.jsx:**
```jsx
<Route path="/equipo/:teamId/plantilla/:championship" element={<VerMiPlantilla />} />
<Route path="/mis-invitaciones" element={<MisInvitaciones />} />
<Route path="/usuario/:userId/momentos" element={<UsuarioMomentos />} />
```

---

## 8. PÁGINA: MIS INVITACIONES (POR HACER)
Mostrar:
- Invitaciones pendientes (equipo, campeonato, quien invita)
- Botones: Aceptar / Rechazar
- Invitaciones aceptadas (con fecha)
- Botón para ver plantilla del equipo

---

## 9. PÁGINA: USUARIO - MOMENTOS (POR HACER)
Mostrar:
- Galería de publicaciones del usuario
- Ordenadas por fecha (más reciente primero)
- Contar likes, comentarios
- Botón para editar/eliminar propia publicación

---

## 10. MEJORAS AL FLUJO DE EQUIPO
- [ ] Dashboard del capitán (gestionar equipo)
- [ ] Estadísticas del equipo (partidos, victorias, promedio edad)
- [ ] Comunicación interna (grupo WhatsApp o chat)
- [ ] Publicar convocatorias en feed de equipo
- [ ] Ver calendario de partidos del equipo

---

# ================================================================
# SQL A EJECUTAR EN SUPABASE
# ================================================================

## PRIMERO: Ejecutar el archivo completo
```bash
# Copiar y pegar en Supabase SQL Editor:
SCHEMA_INVITACIONES_PLANTILLA.sql
```

## O PASO A PASO:

### 1. Team Invitations
```sql
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  championship_type VARCHAR(50) NOT NULL,
  category VARCHAR(50),
  max_age INT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);
```

### 2. Team Rosters
```sql
CREATE TABLE IF NOT EXISTS team_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  championship_type VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position VARCHAR(50),
  number INT,
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Stories
```sql
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_url VARCHAR(500) NOT NULL,
  media_type VARCHAR(20),
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
  views INT DEFAULT 0
);
```

### 4. Post Moments
```sql
CREATE TABLE IF NOT EXISTS post_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Live Stream Scores
```sql
CREATE TABLE IF NOT EXISTS live_stream_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  team_a_id UUID REFERENCES teams(id),
  team_b_id UUID REFERENCES teams(id),
  team_a_name VARCHAR(100),
  team_b_name VARCHAR(100),
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  current_time INT DEFAULT 0,
  period INT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Stream Notifications
```sql
CREATE TABLE IF NOT EXISTS stream_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# ================================================================
# COMPONENTES CREADOS Y LISTOS PARA USAR
# ================================================================

✅ ConvocarJugadores.jsx
   - Búsqueda por nombre/ubicación
   - Filtros campeonato/categoría/edad
   - Seleccionar múltiples jugadores
   - Enviar invitaciones masivas

✅ VerMiPlantilla.jsx
   - Vista del campo de fútbol
   - Mostrar jugadores por número
   - Selector de campeonato
   - Lista de plantilla

✅ HistoriasComponent.jsx
   - Upload foto/video
   - Expiración 24h automática
   - Preview antes de publicar

---

# ================================================================
# PASOS INMEDIATOS (ESTA SEMANA)
# ================================================================

1. [ ] Copiar SCHEMA_INVITACIONES_PLANTILLA.sql a Supabase
2. [ ] Crear página MisInvitaciones.jsx
3. [ ] Agregar rutas en App.jsx
4. [ ] Agregar botones en EquipoDetallePage.jsx
5. [ ] Crear página UsuarioMomentos.jsx
6. [ ] Integrar HistoriasComponent en navbar
7. [ ] Probar flujo completo: crear equipo → convocar → aceptar → ver plantilla
8. [ ] Testing en producción (futpro.vip)

---

# NOTAS TÉCNICAS:
- Todas las invitaciones llevan timestamp de respuesta
- Las plantillas se pueden crear múltiples (una por campeonato)
- Las historias se eliminan automáticamente después de 24h (usar trigger en Supabase)
- Los momentos se agregan automaticamente a post_moments

