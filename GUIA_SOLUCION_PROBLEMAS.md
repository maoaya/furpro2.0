# 🛠️ Guía de Solución de Problemas - FutPro 2.0

## 📋 Índice Rápido
- [Error CAPTCHA en Registro](#error-captcha)
- [UserActivityTracker Deshabilitado](#tracker-deshabilitado)
- [Navegación no funciona después de seleccionar categoría](#navegacion-categoria)
- [Warning: deprecated parameters (feature_collector.js)](#warning-deprecated)

---

## 🔐 Error CAPTCHA en Registro {#error-captcha}

### Síntoma
Al intentar registrarse con email/contraseña, aparece el error:
```
captcha verification process failed
```

### Causa
Supabase tiene la protección CAPTCHA activada pero el bypass del servidor no está configurado.

### Solución 1: Configurar Service Role Key (Recomendado para Producción)

1. **Ir al Dashboard de Netlify**
   - Accede a https://app.netlify.com
   - Selecciona tu proyecto FutPro

2. **Configurar variable de entorno**
   - Ve a `Site configuration` → `Environment variables`
   - Añade nueva variable:
     - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
     - **Value**: (tu service role key de Supabase)
   
3. **Obtener Service Role Key**
   - Ve a tu proyecto en Supabase
   - Settings → API
   - Copia el **service_role key** (¡NO la anon key!)

4. **Redesplegar**
   ```bash
   npm run deploy
   ```

### Solución 2: Desactivar CAPTCHA temporalmente (Desarrollo)

1. **Dashboard de Supabase**
   - Ve a Authentication → Settings
   - Sección "Bot Protection"
   - Desactiva "Enable Captcha protection"

2. **Confirmar cambios**
   - Espera 1-2 minutos para que se aplique
   - Intenta registrarte de nuevo

### Alternativa: Usar Google OAuth
El registro con Google funciona sin problemas de CAPTCHA. Click en "Continuar con Google".

---

## ⚠️ UserActivityTracker Deshabilitado {#tracker-deshabilitado}

### Síntoma
En consola del navegador ves:
```
⚠️ UserActivityTracker deshabilitado por error de schema
```

### Causa
El sistema detectó un error de schema (PGRST106) en Supabase y deshabilitó el tracking automáticamente para evitar bucles de reintentos.

### Solución

#### Opción 1: Reactivación Automática (Recomendado)
Si ya corregiste el schema en Supabase, ejecuta en la consola del navegador:

```javascript
// Verifica si el schema está OK y reactiva automáticamente
window.futproReactivateTracking()
```

#### Opción 2: Reactivación Forzada (Debug)
Si estás seguro que quieres reactivar sin verificar:

```javascript
// Fuerza la reactivación sin verificar schema
window.futproForceReactivateTracking()
```

#### Opción 3: Limpieza Manual
```javascript
// Limpiar el flag manualmente
localStorage.removeItem('futpro_tracking_disabled')
// Luego recargar la página
window.location.reload()
```

### Verificar que está funcionando
Después de reactivar, deberías ver en consola:
```
🔥 UserActivityTracker iniciado - Modo Red Social
```

---

## 🔄 Navegación no funciona después de seleccionar categoría {#navegacion-categoria}

### Síntoma
Después de seleccionar una categoría y hacer click en "Crear usuario con categoría seleccionada", no pasa nada o da error.

### Causa
Error en react-router navigation o falta de permisos de navegación.

### Solución

El sistema ahora tiene **fallback automático**. Si `navigate()` falla, usa `window.location.href`.

**Para verificar que funciona:**

1. Abre DevTools (F12)
2. Ve a Console
3. Selecciona una categoría
4. Click en "Crear usuario..."
5. Deberías ver uno de estos logs:
   ```
   Navegando con react-router...
   ```
   o
   ```
   Fallback a navegación directa (window.location) por error en navigate: [error]
   ```

**La navegación SIEMPRE funcionará** con uno de los dos métodos.

### Verificar localStorage
La categoría se guarda automáticamente:

```javascript
// Ver categoría guardada
const draft = JSON.parse(localStorage.getItem('draft_carfutpro'))
console.log('Categoría guardada:', draft.categoria)
```

---

## 📦 Warning: deprecated parameters (feature_collector.js) {#warning-deprecated}

### Síntoma
```
feature_collector.js:23 using deprecated parameters for the initialization function; 
pass a single object instead
```

### Causa
Un módulo externo (probablemente un paquete WebAssembly o script de terceros) está usando una API obsoleta.

### Estado
Este warning **NO afecta la funcionalidad** de FutPro. Es generado por una dependencia externa empaquetada.

### Solución Temporal
Puedes ignorar este warning de forma segura. No impacta:
- ✅ Registro de usuarios
- ✅ Login
- ✅ Navegación
- ✅ Tracking

### Solución Definitiva (Opcional)
Si deseas eliminarlo completamente:

1. Identificar el paquete que genera el warning:
   ```bash
   npm ls | grep feature
   ```

2. Buscar actualizaciones:
   ```bash
   npm outdated
   ```

3. Actualizar paquetes:
   ```bash
   npm update
   ```

---

## 🧪 Ejecutar Tests

### Test de Navegación (Selección de Categoría)
```bash
npx jest --config jest.frontend.config.cjs src/pages/__tests__/SeleccionCategoria.test.jsx --runInBand
```

### Test de Manejo de CAPTCHA
```bash
npx jest --config jest.frontend.config.cjs src/pages/__tests__/FormularioRegistroCompleto.captcha.test.jsx --runInBand
```

### Todos los tests frontend
```bash
npx jest --config jest.frontend.config.cjs --runInBand
```

---

## 📞 Soporte Adicional

Si después de seguir estas guías aún tienes problemas:

1. **Revisa logs de consola** (F12 → Console)
2. **Revisa logs de Netlify** (Dashboard → Functions → Logs)
3. **Verifica variables de entorno** en Netlify
4. **Comprueba RLS policies** en Supabase (debe permitir insert en `carfutpro` y `user_activities`)

### Comandos de Diagnóstico Rápido

```javascript
// En consola del navegador:

// 1. Ver configuración actual
console.log('Config:', window.location.hostname, 
  localStorage.getItem('futpro_tracking_disabled'))

// 2. Ver categoría guardada
console.log('Categoría:', 
  JSON.parse(localStorage.getItem('draft_carfutpro') || '{}'))

// 3. Estado del tracker
console.log('Tracker disabled:', 
  localStorage.getItem('futpro_tracking_disabled') === 'true')

// 4. Limpiar todo y empezar de nuevo
localStorage.clear()
window.location.reload()
```

---

## ✅ Checklist de Deploy

Antes de hacer deploy a producción:

- [ ] SUPABASE_SERVICE_ROLE_KEY configurado en Netlify
- [ ] CAPTCHA desactivado o bypass funcionando
- [ ] Tests pasando: `npm test`
- [ ] Build exitoso: `npm run build`
- [ ] Variables de entorno validadas en `.env.netlify`
- [ ] RLS policies configuradas en Supabase
- [ ] OAuth callbacks actualizados en Supabase dashboard

---

**Última actualización:** 6 de noviembre de 2025
**Versión:** FutPro 2.0
