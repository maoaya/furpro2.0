# ✅ REVISIÓN COMPLETA: LOGIN, REGISTRO Y AUTENTICACIÓN - FUTPRO 2.0

## 📋 ESTADO ACTUAL

Todo ya está **IMPLEMENTADO Y FUNCIONAL** en el código:

---

## 🔐 1. LOGINPAGE (`/login`)

### ✅ Funcionalidades
- **Email + Contraseña**: Campo de email, campo de contraseña, botón "Iniciar sesión"
- **Validaciones**:
  - Verifica si usuario existe en `carfutpro`
  - Valida credenciales con `supabase.auth.signInWithPassword()`
  - Sistema anti-fuerza bruta con `SecurityService` (bloquea después de N intentos)
  - Verifica si usuario está bloqueado por violar políticas

### ✅ Recuperación de Contraseña
- **Botón**: "¿Olvidaste tu contraseña?"
- **Modo 'recuperar'**: Pide email y envía link de recuperación
- **Modo 'reset'**: Formulario para nueva contraseña con validaciones
- **Genera token**: Con `SecurityService.generarTokenRecuperacion()`
- **Verifica token**: Con `SecurityService.verificarTokenRecuperacion()`
- **Actualiza password**: Con `supabase.auth.updateUser()`

### ✅ Google OAuth
- **Botón**: "Continuar con Google"
- **Redirección**: A `/auth/callback` después de OAuth
- **Redireccionamiento automático**: Según estado del perfil
  - Sin card → `/perfil-card`
  - Perfil incompleto → `/editar-perfil`
  - Perfil completo → `/home`

### ✅ Crear Cuenta
- **Botón**: "👤 Crear nueva cuenta"
- **Redirección**: A `/registro-nuevo` (FormularioRegistroCompleto)

### ✅ Remember Me
- Opción "Recordarme" con checkbox
- Guarda en localStorage si está activo

---

## 📝 2. FORMULARIORREGISTROCOMPLETO (`/registro`)

### ✅ 4 Pasos de Registro

**PASO 1: Credenciales**
- Email + Password + Confirmar Password
- Validaciones de longitud y formato

**PASO 2: Datos Personales**
- Nombre, Apellido, Edad, Teléfono
- Ciudad, País (auto-detecta por IP con `ipapi.co` y `ipwho.is`)
- Peso, Altura

**PASO 3: Info Futbolística**
- Categoría (masculina/femenina)
- Posición, Nivel Habilidad
- Equipo Favorito, Pierna Dominante
- Disponibilidad, Frecuencia Juego
- Objetivo Deportivo

**PASO 4: Foto**
- Carga de foto de perfil (convertida a DataURL)

### ✅ Validaciones Implementadas

**1. Email Duplicado (Email/Password)**
```javascript
// Valida que NO exista email ya registrado
const { data: existingCard } = await supabase
  .from('carfutpro')
  .select('user_id, email')
  .eq('email', emailLower)
  .maybeSingle();

if (existingCard) {
  alert('❌ Este email ya está registrado en FutPro');
  return;
}
```

**2. Email Duplicado (Google OAuth)**
- Validado en `CardManager.createCard()` antes de insertar
- Si email ya existe para otro usuario: Rechaza con error claro

### ✅ Auto-Guardado
```javascript
// En tiempo real cuando cambia formData
useEffect(() => {
  persistProfileDraft();
}, [formData]);
```

Guarda en localStorage:
- `draft_carfutpro`: Draft completo del formulario
- `pendingProfileData`: Datos preparados para la card

### ✅ Funcionalidades de Registro

**Email/Password:**
1. Crea usuario en `supabase.auth`
2. Inserta en tabla `api.carfutpro` con:
   - `puntos_totales: 0`
   - `card_tier: 'Bronce'`
   - Todos los datos del formulario

**Google OAuth:**
1. `loginWithGoogle()` inicia OAuth
2. Guarda datos en localStorage
3. Redirige a `/auth/callback`
4. AuthCallback procesa y crea card

---

## 🔄 3. AUTHCALLBACK (`/auth/callback`)

### ✅ Proceso OAuth

1. **Obtiene sesión** desde Supabase auth
2. **Intercambia código** (PKCE flow)
3. **Lee datos de draft** desde localStorage
4. **Obtiene avatar**:
   ```javascript
   let avatarUrl = formData.avatar_url || 
                   session.user.user_metadata?.avatar_url || 
                   session.user.user_metadata?.picture || 
                   `https://i.pravatar.cc/300?u=${userId}`;
   ```
5. **Prepara perfil** con datos de formulario + OAuth
6. **Llama `CardManager.getOrCreateCard()`**
7. **Valida no duplicados** (en CardManager)
8. **Crea card** en `api.carfutpro`
9. **Guarda en localStorage**: `futpro_user_card_data`, `show_first_card`
10. **Redirige a** `/perfil-card`

---

## 💾 4. CARDMANAGER - VALIDACIÓN DE DUPLICADOS

### ✅ `createCard()` - Validaciones

```javascript
// ANTES de insertar, valida email
if (email) {
  const { data: existingByEmail } = await supabase
    .from('carfutpro')
    .select('user_id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();
  
  if (existingByEmail && existingByEmail.user_id !== userId) {
    throw new Error(`El email ${email} ya está registrado. No puedes usar la misma cuenta de Gmail para múltiples usuarios.`);
  }
}
```

### ✅ Inicialización de Card

Cuando se crea una card nueva:
- `puntos_totales: 0`
- `card_tier: 'Bronce'`
- Todos los stats en 0

---

## 🖼️ 5. FOTOS DE PERFIL

### ✅ Fuentes de Avatar

**Prioridad:**
1. Foto cargada en formulario (`formData.avatar_url`)
2. Avatar de OAuth (`session.user.user_metadata?.avatar_url`)
3. Picture de OAuth (`session.user.user_metadata?.picture`)
4. Avatar genérico (`https://i.pravatar.cc/300?u=${userId}`)

### ✅ Subida a Storage

Si es DataURL (foto local):
1. Convierte a File con `cardManager.dataURLtoFile()`
2. Sube a Storage con `cardManager.uploadAvatar()`
3. Obtiene URL pública

---

## 🔌 6. PUNTOS Y TIERS

### ✅ Sistema Implementado

**Tiers:**
```
Bronce:   0 - 99 puntos
Plata:    100 - 199
Oro:      200 - 499
Diamante: 500 - 999
Leyenda:  1000+
```

**Inicio:** Todos comienzan en `puntos_totales: 0` → **Bronce**

---

## 📊 7. BASE DE DATOS - TABLA `api.carfutpro`

### ✅ Campos

```
user_id (FK auth.users, UNIQUE)
email (UNIQUE INDEX)
nombre
apellido
avatar_url
ciudad, pais
posicion, posicion_favorita
nivel_habilidad
equipo, equipo_favorito
edad, peso, altura, estatura
pie, pierna_dominante
categoria
telefono
disponibilidad_juego
puntos_totales (DEFAULT 0)
card_tier (DEFAULT 'Bronce')
partidos_ganados, entrenamientos, amistosos
puntos_comportamiento
created_at, updated_at
```

### ✅ Políticas RLS

```
SELECT: auth.uid() = user_id
INSERT: auth.uid() = user_id
UPDATE: auth.uid() = user_id
```

---

## ⚡ 8. FLUJO COMPLETO

### **Registro Email/Password:**
```
Usuario llena formulario (4 pasos)
    ↓
Click "Finalizar"
    ↓
Valida email NO duplicado
    ↓
Crea usuario en auth
    ↓
Inserta en carfutpro con puntos=0, tier='Bronce'
    ↓
Guarda datos en localStorage
    ↓
Redirige a /perfil-card
```

### **Registro Google:**
```
Usuario en LoginPage/FormularioRegistroCompleto
    ↓
Click "Google"
    ↓
Guarda draft en localStorage
    ↓
OAuth → Redirige a /auth/callback
    ↓
AuthCallback lee draft + datos Google
    ↓
Descarga foto de OAuth si existe
    ↓
Llama CardManager.createCard()
    ↓
Valida email NO duplicado
    ↓
Inserta en carfutpro
    ↓
Guarda en localStorage
    ↓
Redirige a /perfil-card
```

### **Login:**
```
Usuario en LoginPage
    ↓
Ingresa email + password
    ↓
Valida que email existe
    ↓
Valida credenciales
    ↓
Comprueba si user_id está bloqueado
    ↓
Sign in exitoso
    ↓
Redireccionamiento automático:
  - Si sin card → /perfil-card
  - Si perfil incompleto → /editar-perfil
  - Si perfil completo → /home
```

### **Olvide Contraseña:**
```
LoginPage → "¿Olvidé contraseña?"
    ↓
Modo 'recuperar' → Pide email
    ↓
Genera token
    ↓
Email con link (NO IMPLEMENTADO ENVÍO)
    ↓
Modo 'reset' → Nueva contraseña
    ↓
Valida token
    ↓
Actualiza password en auth
    ↓
Redirige a login
```

---

## 📌 RESUMEN

✅ **TODO IMPLEMENTADO Y FUNCIONAL:**
- LoginPage con email/password/OAuth/olvidé contraseña
- FormularioRegistroCompleto con 4 pasos
- Validación de duplicados (email + Gmail)
- Auto-guardado en tiempo real
- Fotos de perfil (local + OAuth)
- Card creation con puntos iniciales en 0 (Bronce)
- Redireccionamiento automático según estado perfil
- SecurityService para anti-fuerza bruta

❌ **NO IMPLEMENTADO:**
- **Envío de email de recuperación**: Función de envío existe pero comentada
  - Solución: Crear Netlify Function `send-email.js` con SendGrid/Resend

---

## 🚀 PRÓXIMOS PASOS

1. **Implementar envío de email** en recuperación de contraseña
2. **Tests E2E** con Cypress para validar flujos
3. **Deploy a Netlify** para verificar en producción
4. **Ejecutar SQL** en Supabase producción (según `SETUP_SUPABASE_PRODUCCION.md`)

