# 📱 ESTRATEGIA DE MIGRACIÓN: CHAT INSTAGRAM → CHAT_CONVERSATIONS

## 🔍 ANÁLISIS DE SITUACIÓN ACTUAL

### Schema Actual (ChatInstagramNew.jsx)
El componente actualmente usa tablas **NO ESTÁNDAR**:
```sql
-- Tablas que USA actualmente el componente:
conversations (participant_1_id, participant_2_id, last_message_at)
messages (conversation_id, sender_id, content, message_type)
users (nombre, apellido, avatar_url) -- tabla existente
```

### Schema Objetivo (SCHEMA_CHAT_PENALTIS.sql)
Tablas definidas en el schema correcto:
```sql
chat_conversations (id, type, participants UUID[], group_name, group_avatar_url, is_active)
chat_messages (id, conversation_id, sender_id, content, message_type, media_url, reactions JSONB[], read_by UUID[], delivered_to UUID[], is_edited, is_deleted)
chat_typing_indicators (conversation_id, user_id, is_typing, started_at)
```

### ⚠️ DIFERENCIAS CRÍTICAS

| Característica | Schema Actual | Schema Objetivo |
|---------------|---------------|-----------------|
| **Participantes** | 2 columnas (participant_1_id, participant_2_id) | Array UUID[] (participants) |
| **Tipo de conversación** | Solo directas (1-1) | Directas + grupales (type: 'direct', 'group') |
| **Lectura de mensajes** | ❌ NO existe | ✅ read_by UUID[] |
| **Entrega de mensajes** | ❌ NO existe | ✅ delivered_to UUID[] |
| **Reacciones** | ❌ NO existe | ✅ reactions JSONB[] |
| **Indicadores de escritura** | ❌ NO existe | ✅ Tabla dedicada |
| **Edición/eliminación** | ❌ NO existe | ✅ is_edited, is_deleted, edited_at, deleted_at |
| **Multimedia** | Solo text | text, image, video, audio + media_url |
| **Grupos** | ❌ NO soporta | ✅ group_name, group_avatar_url, created_by |

---

## 🎯 ESTRATEGIAS DE MIGRACIÓN

### **OPCIÓN 1: MIGRACIÓN COMPLETA (RECOMENDADA)** ✅

**Descripción:** Reemplazar componente existente para usar el schema correcto con ChatService.

**Ventajas:**
- ✅ Acceso a todas las funcionalidades modernas (reacciones, grupos, lectura tracking)
- ✅ Código consistente con resto del proyecto
- ✅ Escalable a largo plazo
- ✅ ChatService ya implementado (20+ funciones)

**Desventajas:**
- ⚠️ Requiere migración de datos existentes
- ⚠️ Componente debe ser reescrito (~60% del código)

**Pasos de Implementación:**

#### 1. Migrar Datos Existentes (SQL)
```sql
-- Paso 1: Crear conversaciones con nuevo formato
INSERT INTO chat_conversations (type, participants, created_at, last_message_at, is_active)
SELECT 
  'direct' as type,
  ARRAY[participant_1_id, participant_2_id] as participants,
  created_at,
  last_message_at,
  true as is_active
FROM conversations;

-- Paso 2: Mapear IDs viejos → nuevos
CREATE TEMP TABLE conversation_mapping AS
SELECT 
  old_conv.id as old_id,
  new_conv.id as new_id
FROM conversations old_conv
JOIN chat_conversations new_conv 
  ON (old_conv.participant_1_id = ANY(new_conv.participants) 
      AND old_conv.participant_2_id = ANY(new_conv.participants));

-- Paso 3: Migrar mensajes
INSERT INTO chat_messages (conversation_id, sender_id, content, message_type, created_at)
SELECT 
  cm.new_id,
  m.sender_id,
  m.content,
  COALESCE(m.message_type, 'text'),
  m.created_at
FROM messages m
JOIN conversation_mapping cm ON m.conversation_id = cm.old_id;

-- Paso 4: Opcional - Renombrar tablas antiguas para backup
ALTER TABLE conversations RENAME TO conversations_old_backup;
ALTER TABLE messages RENAME TO messages_old_backup;
```

#### 2. Actualizar Componente ChatInstagramNew.jsx

**Cambios Principales:**

A. **Importar ChatService**
```javascript
// ANTES
import { supabase } from '../config/supabase';

// DESPUÉS
import ChatService from '../services/ChatService';
import { supabase } from '../config/supabase'; // Solo para Realtime
```

B. **Reemplazar loadConversations()**
```javascript
// ANTES
const { data, error } = await supabase
  .from('conversations')
  .select('*, participant_1:users!participant_1_id(...), participant_2:users!participant_2_id(...)')
  .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
  .order('last_message_at', { ascending: false });

// DESPUÉS
const data = await ChatService.getUserConversations(user.id);
```

C. **Reemplazar loadMessages()**
```javascript
// ANTES
const { data, error } = await supabase
  .from('messages')
  .select('*, sender:sender_id(nombre, apellido, avatar_url)')
  .eq('conversation_id', selectedConversation.id)
  .order('created_at', { ascending: true });

// DESPUÉS
const data = await ChatService.getConversationMessages(selectedConversation.id, 50);
```

D. **Reemplazar sendMessage()**
```javascript
// ANTES
await supabase.from('messages').insert([{
  conversation_id: selectedConversation.id,
  sender_id: user.id,
  content: newMessage.trim(),
  message_type: 'text'
}]);

// DESPUÉS
await ChatService.sendMessage(
  selectedConversation.id,
  user.id,
  newMessage.trim(),
  'text',
  null
);
```

E. **Reemplazar startNewConversation()**
```javascript
// ANTES
const { data: existing } = await supabase
  .from('conversations')
  .select('*')
  .or(`and(participant_1_id.eq.${user.id},...)`);

// Crear nueva conversación
const { data: newConv } = await supabase
  .from('conversations')
  .insert([{ participant_1_id: user.id, participant_2_id: userId }])
  .select();

// DESPUÉS
const existing = await ChatService.findDirectConversation(user.id, userId);
if (existing) {
  setSelectedConversation(existing);
  return;
}

const newConv = await ChatService.createConversation(
  [user.id, userId],
  'direct'
);
```

F. **Actualizar Suscripción Realtime**
```javascript
// ANTES
const channel = supabase
  .channel(`messages-${selectedConversation.id}`)
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'messages',
    filter: `conversation_id=eq.${selectedConversation.id}`
  }, (payload) => {
    setMessages((prev) => [...prev, payload.new]);
  })
  .subscribe();

// DESPUÉS
const unsubscribe = ChatService.subscribeToConversation(
  selectedConversation.id,
  (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
  },
  (typingPayload) => {
    // Manejar indicadores de escritura
    console.log('Usuario escribiendo:', typingPayload);
  }
);

return () => unsubscribe();
```

G. **Actualizar Lógica de Participantes**
```javascript
// ANTES
const otherParticipant = (conv) => {
  return conv.participant_1_id === user?.id ? conv.participant_2 : conv.participant_1;
};

// DESPUÉS
const otherParticipant = (conv) => {
  if (conv.type === 'direct') {
    const otherUserId = conv.participants.find(id => id !== user?.id);
    // Necesitarás cargar datos del usuario desde carfutpro
    return userCache[otherUserId]; // Implementar cache de usuarios
  }
  return null; // Para grupos manejar diferente
};
```

#### 3. Agregar Funcionalidades Nuevas (Opcional)

Una vez migrado, puedes agregar:

**A. Indicadores de Escritura**
```javascript
// En input onChange
const handleTyping = (e) => {
  setNewMessage(e.target.value);
  
  if (!typingTimeout) {
    ChatService.setTypingIndicator(selectedConversation.id, user.id, true);
  }
  
  clearTimeout(typingTimeout);
  setTypingTimeout(setTimeout(() => {
    ChatService.setTypingIndicator(selectedConversation.id, user.id, false);
  }, 3000));
};
```

**B. Marcar como Leído**
```javascript
useEffect(() => {
  if (selectedConversation?.id) {
    ChatService.markMessagesAsRead(selectedConversation.id, user.id);
  }
}, [selectedConversation?.id, messages]);
```

**C. Reacciones Emoji**
```javascript
const handleReaction = async (messageId, emoji) => {
  await ChatService.addReactionToMessage(messageId, user.id, emoji);
};
```

**D. Editar/Eliminar Mensajes**
```javascript
const handleEditMessage = async (messageId, newContent) => {
  await ChatService.editMessage(messageId, newContent, user.id);
};

const handleDeleteMessage = async (messageId) => {
  if (confirm('¿Eliminar mensaje?')) {
    await ChatService.deleteMessage(messageId, user.id);
  }
};
```

---

### **OPCIÓN 2: MANTENER AMBOS ESQUEMAS (TEMPORAL)** ⚠️

**Descripción:** Mantener el componente actual funcionando mientras desarrollas el nuevo chat en paralelo.

**Ventajas:**
- ✅ Sin interrupciones en funcionalidad existente
- ✅ Tiempo para desarrollar nuevo componente
- ✅ Testing exhaustivo antes de cambiar

**Desventajas:**
- ❌ Código duplicado
- ❌ Confusión sobre qué schema usar
- ❌ Migración de datos eventual de todas formas

**Implementación:**
```javascript
// Crear nuevo componente: ChatInstagramV2.jsx
// Importar ChatService
// Desarrollar con schema correcto

// Mantener ChatInstagramNew.jsx con tablas antiguas
// Agregar ruta /chat-v2 para testing

// Cuando esté listo, reemplazar /chat → /chat-v2
```

---

### **OPCIÓN 3: ADAPTAR SCHEMA A COMPONENTE EXISTENTE (NO RECOMENDADA)** ❌

**Descripción:** Modificar el schema nuevo para mantener estructura antigua.

**Ventajas:**
- ✅ Sin cambios en componente

**Desventajas:**
- ❌ Pierdes funcionalidades modernas
- ❌ Schema inconsistente con documentación
- ❌ No escalable
- ❌ Desperdicia trabajo de ChatService

**Conclusión:** ❌ NO USAR

---

## 📋 PLAN DE IMPLEMENTACIÓN RECOMENDADO

### Fase 1: Preparación (1-2 horas)
- [ ] Backup de tablas actuales (`conversations`, `messages`)
- [ ] Verificar que schema CHAT_PENALTIS está ejecutado en Supabase
- [ ] Revisar ChatService.js y confirmar todas las funciones

### Fase 2: Migración de Datos (30 min)
- [ ] Ejecutar SQL de migración (ver Paso 1 arriba)
- [ ] Verificar integridad de datos
- [ ] Probar consultas básicas en nueva estructura

### Fase 3: Actualizar Componente (2-3 horas)
- [ ] Importar ChatService
- [ ] Reemplazar loadConversations con ChatService.getUserConversations
- [ ] Reemplazar loadMessages con ChatService.getConversationMessages
- [ ] Reemplazar sendMessage con ChatService.sendMessage
- [ ] Actualizar startNewConversation con ChatService.createConversation
- [ ] Actualizar suscripción Realtime con ChatService.subscribeToConversation
- [ ] Ajustar lógica de participantes para array en lugar de 2 columnas

### Fase 4: Testing (1-2 horas)
- [ ] Testing de carga de conversaciones
- [ ] Testing de envío de mensajes
- [ ] Testing de Realtime (múltiples pestañas)
- [ ] Testing de creación de nuevas conversaciones
- [ ] Verificar performance

### Fase 5: Funcionalidades Adicionales (Opcional, 2-4 horas)
- [ ] Implementar indicadores de escritura
- [ ] Implementar marcado de mensajes como leídos
- [ ] Agregar reacciones emoji
- [ ] Agregar edición/eliminación de mensajes
- [ ] Agregar soporte para grupos (futuro)

### Fase 6: Cleanup (30 min)
- [ ] Eliminar código antiguo comentado
- [ ] Renombrar/eliminar tablas backup si todo funciona
- [ ] Actualizar documentación
- [ ] Commit y deploy

---

## ⏱️ ESTIMACIÓN TOTAL

| Fase | Tiempo Estimado |
|------|-----------------|
| Preparación | 1-2 horas |
| Migración datos | 30 min |
| Actualizar componente | 2-3 horas |
| Testing | 1-2 horas |
| Funcionalidades extra (opcional) | 2-4 horas |
| Cleanup | 30 min |
| **TOTAL BÁSICO** | **5-8 horas** |
| **TOTAL CON EXTRAS** | **7-12 horas** |

---

## 🎯 CRITERIOS DE ÉXITO

- [x] ✅ Todas las conversaciones existentes migradas sin pérdida
- [x] ✅ Componente carga conversaciones del nuevo schema
- [x] ✅ Envío de mensajes funciona correctamente
- [x] ✅ Realtime funciona (múltiples usuarios)
- [x] ✅ Creación de nuevas conversaciones funciona
- [x] ✅ Performance igual o mejor que antes
- [x] ✅ Sin errores en consola
- [x] ✅ UX mantiene fluidez

---

## 🚨 RIESGOS Y MITIGACIONES

### Riesgo 1: Pérdida de mensajes durante migración
**Mitigación:** 
- Hacer backup completo antes de migrar
- Mantener tablas antiguas como `_old_backup`
- Rollback plan: restaurar desde backup

### Riesgo 2: Usuarios activos durante migración
**Mitigación:**
- Migrar en horario de baja actividad
- Mensaje de mantenimiento temporal
- Migración rápida (< 5 minutos downtime)

### Riesgo 3: Incompatibilidad con otros componentes
**Mitigación:**
- Revisar si otros componentes usan `conversations` o `messages`
- Buscar en código: `grep -r "from('conversations')" src/`
- Actualizar todos los puntos de acceso

### Riesgo 4: Performance degradada
**Mitigación:**
- Índices ya definidos en schema (conversation_id, sender_id)
- Testing de carga antes de deploy
- Monitoreo post-migración

---

## 📊 COMPARACIÓN DE OPCIONES

| Criterio | Opción 1: Migración Completa | Opción 2: Ambos Esquemas | Opción 3: Adaptar Schema |
|----------|----------------------------|-------------------------|-------------------------|
| Tiempo inicial | 5-8 horas | 2 horas | 1 hora |
| Deuda técnica | Ninguna | Media | Alta |
| Funcionalidades | Todas | Limitadas (actual) | Limitadas |
| Escalabilidad | Excelente | Pobre | Pobre |
| Mantenimiento | Fácil | Difícil | Difícil |
| **RECOMENDACIÓN** | ✅ **SÍ** | ⚠️ Temporal | ❌ **NO** |

---

## 🔄 ROLLBACK PLAN

En caso de problemas críticos durante la migración:

```sql
-- 1. Restaurar tablas originales
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;

ALTER TABLE conversations_old_backup RENAME TO conversations;
ALTER TABLE messages_old_backup RENAME TO messages;

-- 2. Restaurar código del componente (Git)
git checkout HEAD~1 -- src/pages/ChatInstagramNew.jsx

-- 3. Reiniciar servicios
npm run dev
```

---

## 📝 SIGUIENTE PASO INMEDIATO

**ACCIÓN RECOMENDADA:** Ejecutar migración completa (Opción 1)

**Comando para empezar:**
```bash
# 1. Crear branch para migración
git checkout -b feature/chat-migration

# 2. Backup de componente actual
cp src/pages/ChatInstagramNew.jsx src/pages/ChatInstagramNew.backup.jsx

# 3. Ejecutar SQL de migración en Supabase SQL Editor
# (copiar contenido de "Paso 1: Migrar Datos Existentes" arriba)

# 4. Empezar cambios en componente
# Seguir pasos de "Fase 3: Actualizar Componente"
```

---

**Fecha de Creación:** 12 Enero 2026  
**Autor:** FutPro Development Team  
**Estado:** 📋 PLAN LISTO PARA EJECUCIÓN
