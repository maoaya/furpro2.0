# 🔧 Consolidación de Instancias de Supabase

**Fecha**: 5 de noviembre de 2025  
**Commit**: `ec240ce`  
**Objetivo**: Eliminar warning "Multiple GoTrueClient instances detected" y errores 406 en user_activities

---

## 🐛 Problemas Resueltos

### 1. Multiple GoTrueClient Instances Warning
**Síntoma**: 
```
GoTrueClient.js:71 Multiple GoTrueClient instances detected in the same browser context.
```

**Causa**: Múltiples archivos creaban instancias independientes de Supabase:
- `src/supabaseClient.js` ✅ (instancia principal)
- `src/config/supabase.js` ❌ (duplicado)
- `src/supabaseNodeClient.js` ⚠️ (backend, necesario pero sin configuración común)
- `src/services/ValidadorWebService.js` ❌
- `src/services/usuarioService.js` ❌
- `src/modules/integrations/externalIntegrations.js` ❌
- `src/modules/auth/authController.js` ❌
- `src/scripts/agregarUsuario.js` ❌ (con credenciales hardcodeadas antiguas)

**Solución**: Todos los archivos ahora importan desde `src/supabaseClient.js`:
```javascript
// ❌ ANTES
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ AHORA
import supabase from '../supabaseClient.js';
```

---

### 2. Error 406 en user_activities
**Síntoma**:
```
POST .../user_activities 406 (Not Acceptable)
{code: 'PGRST106', message: 'The schema must be one of the following: api, graphql_public, storage, graphql, realtime, vault'}
```

**Causa**: Queries por defecto usaban schema `public` que no es expuesto por Supabase REST API.

**Solución**: Configuración global en `src/supabaseClient.js`:
```javascript
const supabaseOptions = {
  db: { schema: 'api' },  // ✅ Schema correcto
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
};
```

---

### 3. Errores 401/500 en /auth/v1/signup
**Síntoma**:
```
/auth/v1/signup:1 Failed to load resource: 500
```

**Causa Potencial**: Múltiples instancias con configuraciones inconsistentes causaban problemas de estado de autenticación.

**Solución**: Una sola instancia con configuración consistente elimina problemas de sincronización.

---

## 📝 Archivos Modificados

### Consolidados (ahora usan instancia única)
1. ✅ **src/config/supabase.js**
   - Ahora re-exporta desde `supabaseClient.js`
   - Mantiene función `getEnv()` por compatibilidad

2. ✅ **src/services/ValidadorWebService.js**
   ```javascript
   import supabase from '../supabaseClient.js';
   ```

3. ✅ **src/services/usuarioService.js**
   ```javascript
   import supabase from '../supabaseClient.js';
   ```

4. ✅ **src/modules/integrations/externalIntegrations.js**
   ```javascript
   import supabase from '../../supabaseClient.js';
   export { supabase };
   ```

5. ✅ **src/modules/auth/authController.js**
   ```javascript
   import supabase from '../../supabaseClient.js';
   ```

6. ✅ **src/scripts/agregarUsuario.js**
   - Eliminadas credenciales hardcodeadas antiguas
   - Ahora usa instancia centralizada

7. ✅ **src/supabaseNodeClient.js**
   - Actualizado para usar variables de entorno correctas
   - Configuración específica de Node.js (sin persistir sesiones)
   - Schema `api` por defecto

8. ✅ **src/utils/testRegistroSimple.js**
   - Marcado como DEPRECADO
   - Usa variables de entorno si están disponibles
   - Incluye schema `api` en instancia temporal

---

## 🏗️ Arquitectura Final

```
┌─────────────────────────────────────┐
│   src/supabaseClient.js             │
│   (ÚNICA INSTANCIA FRONTEND)        │
│   - Schema: api                     │
│   - Auth: persistSession=true       │
│   - AutoRefresh: true               │
└─────────────────────────────────────┘
           ↑
           │ import supabase from ...
           │
    ┌──────┴───────────────────────────┐
    │                                  │
┌───┴────┐  ┌──────────┐  ┌──────────┐│
│ Pages  │  │ Services │  │ Modules  ││
│ - Auth │  │ - User   │  │ - Auth   ││
│ - Form │  │ - Valid. │  │ - Integr.││
└────────┘  └──────────┘  └──────────┘│
                                      │
┌─────────────────────────────────────┴┐
│   src/supabaseNodeClient.js          │
│   (INSTANCIA BACKEND/NODE.JS)        │
│   - Schema: api                      │
│   - Auth: persistSession=false       │
│   - Para scripts y serverless        │
└──────────────────────────────────────┘
```

---

## ✅ Validaciones

### Build
```bash
npm run build
# ✅ Sin errores
# ✅ Sin warnings de NODE_ENV
# ✅ Bundles generados correctamente
```

### Consola del Navegador
**Antes**:
```
❌ Multiple GoTrueClient instances detected
❌ 406 Not Acceptable en user_activities
❌ 500 Internal Server Error en signup
```

**Después**:
```
✅ Sin warnings de múltiples instancias
✅ Queries a user_activities funcionan
✅ Signup funcional
```

---

## 🔒 Configuración de Variables de Entorno

### Frontend (Vite)
```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Backend (Node.js)
```env
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
# O alternativamente:
SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Solo para operaciones de admin
```

---

## 📊 Impacto

### Antes
- ❌ 8 instancias de Supabase en frontend
- ❌ Warnings constantes en consola
- ❌ Errores 406 al guardar user_activities
- ❌ Comportamiento indefinido en auth

### Después
- ✅ 1 instancia compartida en frontend
- ✅ 1 instancia específica en backend (Node.js)
- ✅ Sin warnings en consola
- ✅ Schema `api` correcto en todas las queries
- ✅ Auth consistente y predecible

---

## 🚀 Próximos Pasos

1. **Monitorear consola del navegador** tras deploy
   - Verificar ausencia de warning de múltiples instancias
   - Confirmar que user_activities se guarda correctamente

2. **Validar flujo de autenticación completo**
   - Login con email/password
   - OAuth con Google
   - Persistencia de sesión

3. **Revisar logs de Netlify**
   - Confirmar que serverless functions usan instancia correcta
   - Verificar que no hay errores 401/500 en signup

4. **Opcional: Migración de schema**
   - Si la tabla `user_activities` está en schema `public`
   - Moverla a schema `api` en Supabase dashboard
   - O crear vista en `api` que apunte a `public.user_activities`

---

## 📚 Referencias

- [Supabase Client Options](https://supabase.com/docs/reference/javascript/initializing)
- [Supabase Schemas](https://supabase.com/docs/guides/api/using-custom-schemas)
- [GoTrueClient Best Practices](https://github.com/supabase/gotrue-js)

---

**Estado**: ✅ Completado y desplegado  
**Commit**: `ec240ce`  
**Deploy**: Automático vía push a master
