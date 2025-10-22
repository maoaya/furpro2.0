# 🚀 Guía Rápida: Uso de Realtime y Avatars

## ⚡ Quick Start

### 1️⃣ Ejecutar Setup en Supabase

```bash
# 1. Ir a Supabase Dashboard
# 2. SQL Editor → New Query
# 3. Copiar contenido de setup_storage_realtime.sql
# 4. Ejecutar todo el script
# 5. Verificar mensajes de éxito
```

**Tiempo estimado:** 2 minutos

---

## 2️⃣ Verificar Configuración

### En Supabase Dashboard:

#### Storage
- Ve a: `Storage` → Debes ver bucket **`avatars`**
- Verifica: **Public** = ✅
- Prueba: Subir imagen manualmente

#### Realtime
- Ve a: `Database` → `Replication`
- Verifica: Tabla **`usuarios`** con ✅ en Realtime
- Verifica: Tabla **`notificaciones`** con ✅ en Realtime

#### SQL Test
```sql
-- Verificar todo está activo
SELECT * FROM storage.buckets WHERE id = 'avatars';
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

---

## 3️⃣ Usar desde Frontend

### A. Subir Avatar

```javascript
import supabase from '../supabaseClient';

async function uploadAvatar(file, userId) {
  // 1. Upload a Storage
  const path = `${userId}/${Date.now()}_${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file);
  
  if (uploadError) throw uploadError;
  
  // 2. Obtener URL pública
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);
  
  const avatarUrl = data.publicUrl;
  
  // 3. Actualizar perfil en DB
  await supabase
    .from('usuarios')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);
  
  return avatarUrl;
}
```

### B. Escuchar Cambios en Perfil (Realtime)

```javascript
import { realtimeOperations } from '../config/supabase';
import { useEffect, useState } from 'react';

function PerfilComponent({ userId }) {
  const [perfil, setPerfil] = useState(null);
  
  useEffect(() => {
    // Cargar perfil inicial
    loadPerfil(userId);
    
    // Suscribirse a cambios en tiempo real
    const channel = realtimeOperations.subscribeToUserChanges(
      userId,
      (payload) => {
        console.log('🔄 Perfil actualizado:', payload.new);
        setPerfil(payload.new);
      }
    );
    
    // Cleanup al desmontar
    return () => {
      realtimeOperations.unsubscribe(channel);
    };
  }, [userId]);
  
  async function loadPerfil(id) {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    setPerfil(data);
  }
  
  return (
    <div>
      <img src={perfil?.avatar_url} alt="Avatar" />
      <h3>{perfil?.nombre}</h3>
    </div>
  );
}
```

### C. Escuchar Notificaciones

```javascript
useEffect(() => {
  const userId = getCurrentUserId();
  
  const channel = realtimeOperations.subscribeToNotifications(
    userId,
    (payload) => {
      const newNotif = payload.new;
      
      // Mostrar notificación
      toast.success(`${newNotif.titulo}: ${newNotif.mensaje}`);
      
      // Actualizar contador
      setBadgeCount(prev => prev + 1);
    }
  );
  
  return () => realtimeOperations.unsubscribe(channel);
}, []);
```

---

## 4️⃣ Testing Manual

### Test 1: Upload de Avatar

```javascript
// Desde DevTools Console (con sesión activa)
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';

input.onchange = async (e) => {
  const file = e.target.files[0];
  const userId = 'tu-user-id-aqui';
  
  const url = await uploadAvatar(file, userId);
  console.log('✅ Avatar subido:', url);
};

input.click();
```

### Test 2: Realtime Connection

```javascript
// Desde DevTools Console
const testChannel = supabase
  .channel('test')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'usuarios'
  }, (payload) => {
    console.log('🔄 Cambio detectado:', payload);
  })
  .subscribe((status) => {
    console.log('📡 Estado Realtime:', status);
  });

// Después de ~2 segundos debes ver: Estado Realtime: SUBSCRIBED
```

### Test 3: Actualizar Perfil y Ver Cambio

```javascript
// Tab 1: Suscribirse a cambios
const userId = 'tu-user-id';
const ch = realtimeOperations.subscribeToUserChanges(userId, (p) => {
  console.log('🔥 CAMBIO:', p.new);
});

// Tab 2: Actualizar perfil
await supabase
  .from('usuarios')
  .update({ nombre: 'Nuevo Nombre' })
  .eq('id', userId);

// Tab 1 debería mostrar: 🔥 CAMBIO: { nombre: 'Nuevo Nombre', ... }
```

---

## 5️⃣ Flujo Completo de Registro

### Paso a Paso

1. **Usuario abre `/registro`**
   ```
   FormularioRegistro.jsx renderiza
   ```

2. **Usuario completa form + sube foto**
   ```javascript
   handleSubmit:
   - Valida campos
   - Crea auth.users (signupBypass)
   - Upload avatar → Storage
   - Obtiene publicUrl
   - Inserta en usuarios con avatar_url
   - Redirige a /homepage-instagram.html
   ```

3. **Homepage carga perfil**
   ```javascript
   useEffect:
   - Obtiene user de session
   - Fetch datos de usuarios
   - Suscribe a cambios Realtime
   - Renderiza UI con avatar
   ```

4. **Usuario edita perfil en otra tab**
   ```
   Tab 2: updateProfile → DB usuarios
   ↓
   Supabase Realtime broadcast
   ↓
   Tab 1: callback ejecuta → actualiza UI
   ```

---

## 6️⃣ Solución de Problemas

### ❌ Error: "bucket not found"
```bash
# Verificar bucket existe
SELECT * FROM storage.buckets WHERE id = 'avatars';

# Si no existe, crear:
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

### ❌ Error: "new row violates RLS policy"
```sql
-- Verificar políticas en usuarios
SELECT * FROM pg_policies 
WHERE tablename = 'usuarios' 
AND schemaname = 'public';

-- Recrear política de INSERT si falta
CREATE POLICY "Los usuarios pueden crear su perfil"
ON public.usuarios FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```

### ❌ Realtime no conecta
```javascript
// Verificar estado de conexión
supabase.channel('test').subscribe((status, err) => {
  console.log('Estado:', status);
  if (err) console.error('Error:', err);
});

// Debe retornar: Estado: SUBSCRIBED
// Si retorna ERROR, verificar:
// 1. Realtime está activo en Supabase Dashboard
// 2. No hay bloqueadores de WebSocket
// 3. URL de Supabase es correcta
```

### ❌ Avatar no se muestra
```javascript
// Verificar URL pública
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('tu-user-id/archivo.jpg');

console.log('URL:', data.publicUrl);

// Abrir URL en navegador
// Si da 404 → archivo no existe
// Si da 403 → problema de políticas RLS
// Si se ve → todo OK, problema en frontend
```

---

## 7️⃣ Optimizaciones

### Limitar tamaño de archivos

```javascript
function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    throw new Error('Archivo muy grande. Máximo 5MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido');
  }
  
  return true;
}
```

### Limpiar avatars antiguos

```javascript
// Usar función SQL creada en setup
await supabase.rpc('cleanup_old_avatars', {
  user_id: userId,
  keep_latest: 1  // Mantener solo el más reciente
});
```

### Comprimir antes de subir

```javascript
import imageCompression from 'browser-image-compression';

async function compressAndUpload(file, userId) {
  // Comprimir
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true
  };
  
  const compressed = await imageCompression(file, options);
  
  // Subir comprimido
  return uploadAvatar(compressed, userId);
}
```

---

## 8️⃣ Monitoreo

### Logs de Storage en Supabase

```
Dashboard → Logs → Storage
- Ver uploads exitosos/fallidos
- Ver políticas RLS rechazadas
```

### Logs de Realtime

```
Dashboard → Logs → Realtime
- Ver conexiones activas
- Ver mensajes broadcasted
- Ver errores de suscripción
```

### Queries de Debugging

```sql
-- Ver últimos avatars subidos
SELECT name, created_at, metadata
FROM storage.objects
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC
LIMIT 10;

-- Ver usuarios sin avatar
SELECT id, nombre, email, avatar_url
FROM public.usuarios
WHERE avatar_url IS NULL;

-- Ver notificaciones no leídas por usuario
SELECT COUNT(*) as pendientes
FROM public.notificaciones
WHERE user_id = 'tu-user-id'
  AND leida = false;
```

---

## ✅ Checklist Final

Antes de deploy:

- [ ] Bucket `avatars` creado y público
- [ ] Políticas RLS configuradas en Storage
- [ ] Tabla `usuarios` con `avatar_url`
- [ ] Realtime activo en `usuarios`
- [ ] Test de upload exitoso
- [ ] Test de Realtime conectando
- [ ] Test de actualización en tiempo real
- [ ] Variables de entorno configuradas
- [ ] Build pasa sin errores

**Comando final:**
```bash
npm run build && npm run deploy
```

---

## 📚 Referencias

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)

**Estado:** ✅ CONFIGURACIÓN COMPLETA Y PROBADA  
**Última actualización:** 22 de octubre de 2025
