# 🎯 GUÍA DE VALIDACIÓN Y TESTING - FutPro 2.0

## Estado Actual del Proyecto

### ✅ Cambios Implementados

1. **Flujo OAuth mejorado**
   - `FormularioRegistroCompleto.jsx`: Establece `post_auth_target='/registro-perfil'`
   - Guarda drafts completos antes de redirigir a Google OAuth
   - Calcula puntaje inicial basado en datos del formulario

2. **AuthCallback robusto**
   - Respeta `post_auth_target` y redirige correctamente
   - Crea/upsert en `carfutpro` cuando es necesario
   - Limpia flags temporales (`post_auth_target`, `oauth_origin`)
   - Fallback a `window.location.href` si `navigate` falla

3. **PerfilCard actualizado**
   - Botón "Continuar" redirige a `/home-instagram`
   - Muestra datos reales o temporales de `futpro_user_card_data`
   - Badge "NUEVA" para primera card

4. **Configuración Babel**
   - Añadido `@babel/plugin-syntax-dynamic-import` para soportar imports dinámicos
   - Configurado tanto en modo desarrollo como test

### 🧪 Tests Creados

1. **FormularioRegistroCompleto.oauth.test.jsx**
   - Verifica establecimiento de `post_auth_target`
   - Valida cálculo de puntaje inicial
   - Confirma persistencia de drafts

2. **AuthCallback.oauth.test.jsx**
   - Prueba redirección a `/registro-perfil`
   - Valida creación de `carfutpro` cuando aplica
   - Verifica limpieza de flags
   - Testea fallback de navegación

3. **PerfilCard.test.jsx**
   - Carga y visualización de datos
   - Navegación a homepage
   - Badge de primera card
   - Degradados por categoría

## 📋 Comandos de Testing

### Tests Completos
```cmd
npm test
```

### Tests Backend
```cmd
npm run test:backend
```

### Tests Frontend Específicos
```cmd
npx jest --config jest.frontend.config.cjs
```

### Tests Individuales
```cmd
npx jest src/pages/__tests__/FormularioRegistroCompleto.oauth.test.jsx --config jest.frontend.config.cjs
npx jest src/pages/__tests__/AuthCallback.oauth.test.jsx --config jest.frontend.config.cjs
npx jest src/pages/__tests__/PerfilCard.test.jsx --config jest.frontend.config.cjs
```

### Build de Producción
```cmd
npm run build
```

### Validación Completa Automatizada
```cmd
node scripts/validate-all.js
```

## 🔄 Flujo Completo del Usuario

### 1. Inicio de Sesión / Registro
**Ruta**: `/` o `/login`  
**Componente**: `LoginRegisterFormClean.jsx` / `AuthPageUnificada.jsx`

### 2. Selección de Categoría
**Ruta**: `/seleccionar-categoria`  
**Componente**: `SeleccionCategoria.jsx`  
**Acciones**:
- Usuario elige categoría (infantil femenina/masculina, femenina, masculina)
- Se guarda draft en `localStorage.draft_carfutpro`
- Redirección a `/formulario-registro?categoria=X`

### 3. Formulario de Registro Completo
**Ruta**: `/formulario-registro`  
**Componente**: `FormularioRegistroCompleto.jsx`  
**Pasos**:
1. Credenciales (email, password)
2. Datos personales (nombre, apellido, edad, teléfono, país, ciudad)
3. Info futbolística (posición, nivel, equipo, peso, altura, pie)
4. Disponibilidad (frecuencia, horario, objetivos)
5. Foto de perfil (upload con preview)

**Al hacer click en "Continuar con Google"**:
- Se establece `post_auth_target='/registro-perfil'`
- Se establece `oauth_origin='formulario_registro'`
- Se guarda `futpro_user_card_data` con datos preliminares
- Se guarda `futpro_registro_draft` completo
- Se guarda `draft_carfutpro` para continuidad
- Se inicia OAuth con Google

### 4. OAuth Google
**Flujo externo**: Google Accounts  
**Redirección**: `${baseUrl}/auth/callback`

### 5. Callback de Autenticación
**Ruta**: `/auth/callback`  
**Componente**: `AuthCallback.jsx`  
**Acciones**:
- Lee `post_auth_target` de localStorage
- Lee `oauth_origin` de localStorage
- Si `post_auth_target === '/perfil-card'` y `oauth_origin === 'formulario_registro'`:
  - Crea/upsert en tabla `carfutpro`
  - Actualiza `futpro_user_card_data` con datos reales
- Limpia flags temporales
- Redirige a la ruta indicada (default: `/seleccionar-categoria`)

### 6. Pantalla Intermedia de Perfil
**Ruta**: `/registro-perfil`  
**Componente**: `RegistroPerfil.jsx`  
**Acciones**:
- Permite completar/editar datos del perfil
- Campos: nombre, ciudad, país, posición favorita, nivel, equipo, avatar
- Autoguardado en localStorage y Firebase
- Al hacer "Guardar y finalizar":
  - Upsert en `carfutpro` (Supabase)
  - Genera `futpro_user_card_data` real
  - Limpia autosave en Firebase
  - Redirige a `/perfil-card`

### 7. Visualización de Card
**Ruta**: `/perfil-card`  
**Componente**: `PerfilCard.jsx`  
**Muestra**:
- Card visual tipo FIFA/Instagram
- Datos: nombre, ciudad, país, posición, nivel, puntaje, equipo
- Estadísticas: partidos, goles, asistencias
- Badge "NUEVA" si `esPrimeraCard === true`
- Degradado de color según categoría

**Botones**:
- **"Continuar"**: Redirige a `/home-instagram` (limpia `show_first_card`)
- **"Ver Perfil Completo"**: Redirige a `/perfil` (React)

### 8. Homepage Feed
**Archivo**: `src/pages/HomeInstagram.jsx`
**Tipo**: Página estática (HTML + CSS + JS inline)  
**Features**:
- Feed estilo Instagram
- Stories
- Notificaciones en tiempo real
- Chat integrado
- Menú hamburguesa con navegación completa

### 9. Otras Secciones
- `/feed`: Feed React dinámico
- `/notificaciones`: Centro de notificaciones
- `/marketplace`: Tienda de productos
- `/chat-sql`: Chat con IA
- `/perfil/:userId`: Perfil completo del usuario
- `/equipos`, `/torneos`, etc.

## 🛠️ Validaciones Críticas

### 1. LocalStorage Keys
```javascript
// Post-OAuth
post_auth_target: '/registro-perfil'
oauth_origin: 'formulario_registro'

// Datos de Card
futpro_user_card_data: JSON (objeto con estructura completa)
show_first_card: 'true' | null

// Drafts
futpro_registro_draft: JSON (formulario completo)
draft_carfutpro: JSON (datos básicos para perfil)

// Auth
authCompleted: 'true'
loginSuccess: 'true'
session: JSON (usuario autenticado)
```

### 2. Supabase Tables
```sql
-- carfutpro
user_id: UUID (FK → auth.users)
categoria: TEXT
nombre: TEXT
ciudad: TEXT
pais: TEXT
posicion_favorita: TEXT
nivel_habilidad: TEXT
equipo: TEXT
avatar_url: TEXT
puntaje: INTEGER (50-100)
creada_en: TIMESTAMP
estado: TEXT ('activa', 'borrador_perfil', etc.)
```

### 3. Firebase Realtime
```
autosave/
  carfutpro/
    {userId}/
      categoria: "..."
      nombre: "..."
      ...
      updatedAt: "2025-11-12T..."
```

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module '@babel/plugin-syntax-dynamic-import'"
**Solución**: 
```cmd
npm install --save-dev @babel/plugin-syntax-dynamic-import
```

### Error: Build de Vite falla
**Solución**:
```cmd
npm install
npm run clean
npm run build
```

### Tests fallan por timeouts
**Solución**: Aumentar timeout en los tests
```javascript
jest.setTimeout(10000);
```

### OAuth redirige a categoría en lugar de perfil
**Verificar**:
1. `post_auth_target` se establece correctamente antes de OAuth
2. `AuthCallback.jsx` lee correctamente de localStorage
3. No hay errores en consola que impidan la ejecución

### Card no muestra datos
**Verificar**:
1. `futpro_user_card_data` existe en localStorage
2. Estructura del objeto es correcta
3. Usuario autenticado tiene registro en `carfutpro`

## 📊 Métricas de Calidad

### Cobertura de Tests
- Formulario OAuth: 3 tests
- AuthCallback: 4 tests
- PerfilCard: 5 tests
- **Total**: 12+ tests nuevos

### Performance
- Build time: ~30-60s
- Test execution: ~10-30s
- Page load: <2s (Vite HMR)

### Compatibilidad
- Node: >=20.0.0
- NPM: >=10.0.0
- Browsers: Chrome, Firefox, Safari, Edge (últimas 2 versiones)

## 🚀 Próximos Pasos Recomendados

1. **Cobertura adicional**: Tests E2E con Cypress para flujo completo
2. **Validación de formulario**: Validaciones más estrictas antes de OAuth
3. **Limpieza de drafts**: Auto-limpieza después de 7 días
4. **Sincronización**: Validar sincronización Firebase ↔ Supabase
5. **Optimización**: Code splitting para reducir bundle size
6. **Monitoreo**: Integrar Sentry o similar para tracking de errores en producción

## 📞 Soporte

Para problemas o preguntas:
1. Revisar logs de consola del navegador
2. Verificar logs del servidor (si aplica)
3. Ejecutar `node scripts/validate-all.js`
4. Revisar este documento
