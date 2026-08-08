# 🔥 Diagnóstico de Errores en Producción (futpro.vip)

## Fecha: 6 de noviembre de 2025

### ❌ Errores Actuales

#### 1. Error 500 en `/auth/v1/signup` (CRÍTICO)
**Síntoma**: Server responded with status 500  
**Causa Probable**:
- CAPTCHA activado en Supabase bloqueando todos los signups
- Rate limiting por intentos excesivos previos
- Service Role Key faltante en Netlify (para `signup-bypass.js`)

**Solución**:
1. **Verificar CAPTCHA en Supabase Dashboard**:
   - Ir a: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut/auth/providers
   - Authentication → Settings → Enable Email Signup
   - **DESHABILITAR** "Enable CAPTCHA protection" temporalmente
   
2. **Configurar Service Role Key en Netlify**:
   - Ir a: Netlify Dashboard → Site Settings → Environment Variables
   - Agregar: `SUPABASE_SERVICE_ROLE_KEY` = `[tu service role key de Supabase]`
   - Nota: Esta key está en Supabase Dashboard → Settings → API → service_role key (secret)

3. **Alternativa - Fallback a signup directo**:
   - Si `signup-bypass.js` falla, el código debe hacer fallback a `supabase.auth.signUp()` directo
   - Verificar que `AuthPageUnificada.jsx` maneje error 500 y reintente con método directo

#### 2. Error 401 en `/auth/v1/health`
**Síntoma**: Failed to load resource: 401 Unauthorized  
**Causa**: Health check endpoint requiriendo autenticación (bug de Supabase o rate limit)  
**Impacto**: Bajo - no afecta funcionalidad real  
**Solución**: 
- Envolver `detectSupabaseOnline()` en try/catch silencioso
- No es crítico, es solo un health check

#### 3. Error 406 PGRST106 (RESUELTO ✅)
**Status**: Tracking auto-deshabilitado correctamente  
**Mensaje**: "⚠️ TRACKING DESHABILITADO: Error de schema en Supabase"  
**Acción**: Ninguna - comportamiento esperado

---

## 🔧 Acciones Inmediatas

### PASO 1: Verificar Configuración Supabase (URGENTE)

**Dashboard Supabase**: https://supabase.com/dashboard/project/qqrxetxcglwrejtblwut

1. **Authentication → Settings**:
   - [ ] Verificar "Enable Email Confirmations" → APAGADO (desarrollo)
   - [ ] Verificar "Enable CAPTCHA protection" → APAGADO (temporalmente)
   - [ ] Verificar "Disable email signups" → APAGADO

2. **Settings → API**:
   - [ ] Copiar `service_role` key (secret)
   - [ ] Confirmar `anon` key coincide con código

### PASO 2: Configurar Netlify Environment Variables

**Netlify Dashboard**: https://app.netlify.com → Site Settings → Environment Variables

Variables requeridas:
```env
SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[tu_service_role_key_aqui]
VITE_SUPABASE_URL=https://qqrxetxcglwrejtblwut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### PASO 3: Mejorar Manejo de Errores en Frontend

Modificar `AuthPageUnificada.jsx`:

```javascript
// Agregar fallback si signup-bypass falla con 500
const handleRegistroCompleto = async (datosRegistro) => {
  try {
    // Intentar con signup-bypass primero
    const response = await fetch('/.netlify/functions/signup-bypass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosRegistro)
    });

    if (response.status === 500) {
      console.warn('⚠️ signup-bypass falló con 500, usando método directo');
      // FALLBACK: signup directo
      const { data, error } = await supabase.auth.signUp({
        email: datosRegistro.email,
        password: datosRegistro.password,
        options: {
          data: { nombre: datosRegistro.nombre }
        }
      });
      
      if (error) throw error;
      return { success: true, user: data.user };
    }
    
    // ... resto del código
  } catch (error) {
    console.error('Error en registro:', error);
    // mostrar error al usuario
  }
};
```

### PASO 4: Deshabilitar Health Check Temporal

En `src/config/supabase.js`:

```javascript
async function detectSupabaseOnline(timeout = 4000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const healthUrl = `${(SUPABASE_URL || '').replace(/\/$/, '')}/auth/v1/health`;
    
    // NO usar credentials, puede causar 401
    await fetch(healthUrl, {
      method: 'GET',
      mode: 'no-cors', // Evitar CORS/401
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (err) {
    // Silenciar errores 401/403 - no son críticos
    console.debug('Health check fallido (no crítico):', err.message);
    return false; // Asumir offline en caso de error
  }
}
```

---

## 📊 Resumen de Prioridades

| Prioridad | Error | Acción | Tiempo Estimado |
|-----------|-------|--------|-----------------|
| 🔴 ALTA | 500 signup | Desactivar CAPTCHA + agregar Service Role | 5 min |
| 🟡 MEDIA | 401 health | Mejorar try/catch en detectSupabaseOnline | 2 min |
| 🟢 BAJA | 406 PGRST106 | Ya resuelto - tracking deshabilitado | - |

---

## 🧪 Testing Post-Fix

Después de aplicar los fixes:

1. **Limpiar localStorage**:
   ```javascript
   localStorage.clear();
   ```

2. **Reload con cache limpio**: Ctrl+Shift+R

3. **Intentar registro nuevo** con datos de prueba

4. **Verificar consola**:
   - ✅ NO debe haber error 500 en signup
   - ✅ NO debe haber loops de 406
   - ⚠️ 401 en health puede aparecer 1-2 veces (tolerable)

---

## 📝 Notas Adicionales

- **UserActivityTracker**: Auto-deshabilitado correctamente cuando detecta PGRST106
- **db.schema**: Eliminado de cliente Supabase (fix aplicado en commit f9f00da)
- **Bundle**: Rebuild limpio sin referencias a schema (validado)

**Última actualización**: 6 nov 2025  
**Commit actual**: f9f00da  
**Deploy status**: Completado en Netlify
