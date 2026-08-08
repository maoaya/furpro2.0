## 📋 FLUJO DE AUTENTICACIÓN Y CREACIÓN DE CARD - ANÁLISIS COMPLETO

### ✅ PASO 1: USUARIO ACCEDE A https://futpro.vip/

**URL: /** → **RootRoute()**
```javascript
function RootRoute() {
  if (loading) return "Cargando...";
  if (user && user.email) return <MainLayout><HomePage /></MainLayout>;
  return <LoginPage />;
}
```

**Resultado**: Si no hay usuario, muestra LoginPage

---

### ✅ PASO 2: USUARIO ELIGE OPCIÓN EN LoginPage

**URL: /login**

Opciones disponibles:
1. **Email/Password Login** → handleLogin()
2. **Google OAuth** → handleGoogleLogin()
3. **Link a Registro** → Navega a /registro

---

### ✅ PASO 3A: GOOGLE OAUTH FLOW (si elige Google)

**En LoginPage.handleGoogleLogin():**

```javascript
// 1. Inicializar BD
fetch('/.netlify/functions/db-init') 

// 2. Iniciar OAuth
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://futpro.vip/auth/callback' // IMPORTANTE
  }
})

// Resultado: Redirige a https://futpro.vip/auth/callback
```

**En /auth/callback → AuthCallback.jsx:**

```javascript
// 1. Obtiene sesión del URL hash
const { session } = await supabase.auth.getSession()

// 2. Si nuevo usuario (sin card):
if (!tieneCard) {
  // Guardar datos del usuario en localStorage
  localStorage.setItem('currentUser', JSON.stringify(usuario))
  // Redirigir a formulario para completar perfil
  navigate('/registro') 
}

// 3. Si usuario existente:
// Redirigir a /home
```

**PROBLEMA ACTUAL**: El AuthCallback redirige a `/registro` SIEMPRE, incluso si el usuario ya tiene card.

---

### ✅ PASO 3B: EMAIL/PASSWORD LOGIN FLOW (si elige Email)

**En LoginPage.handleLogin():**

```javascript
// 1. Verificar si existe usuario en BD
const usuarioCard = await supabase
  .from('carfutpro')
  .select('user_id, email')
  .eq('email', emailLower)

// 2. Si existe y no está bloqueado:
const loginResult = await supabase.auth.signInWithPassword({
  email: emailLower,
  password: password
})

// 3. Verificar estado del perfil
if (usuarioCard.user_id) {
  const perfil = await supabase
    .from('carfutpro')
    .select('*')
    .eq('user_id', usuarioCard.user_id)
  
  // Si no tiene card: navigate('/perfil-card')
  // Si incompleto: navigate('/editar-perfil')
  // Si completo: navigate('/home')
}
```

---

### ✅ PASO 4: REGISTRO EN FormularioRegistroCompleto (/registro)

**4 PASOS:**

**PASO 1**: Email, Password
**PASO 2**: Nombre, Apellido, Edad, Ciudad, País, Peso, Altura
**PASO 3**: Categoría, Posición, Nivel, Equipo, Pierna Dominante
**PASO 4**: Foto Avatar

**En FormularioRegistroCompleto.handleFinalizarRegistro():**

```javascript
// 1. Inicializar BD
fetch('/.netlify/functions/db-init')

// 2. Crear usuario en auth.users
const { user: authUser } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: { data: { nombre, apellido } }
})

// 3. INSERTAR PERFIL EN api.carfutpro
const payload = {
  user_id: authUser.id,
  nombre, apellido, email,
  ciudad, pais, posicion,
  nivel_habilidad, equipo,
  avatar_url,
  edad, peso, pie, estatura,
  categoria,
  
  // STATS INICIALES (IMPORTANTE)
  puntos_totales: 0,      // Empieza con 0 puntos
  card_tier: 'Bronce',    // Tier inicial
  partidos_ganados: 0,
  entrenamientos: 0,
  amistosos: 0,
  puntos_comportamiento: 0,
  ultima_actualizacion: NOW()
}

const { profileData } = await supabase
  .from('carfutpro')
  .upsert(payload, { onConflict: 'user_id' })

// 4. Guardar en localStorage
localStorage.setItem('futpro_user_card_data', JSON.stringify(cardData))
localStorage.setItem('show_first_card', 'true')

// 5. Redirigir a ver la CARD
navigate('/perfil-card', { 
  state: { cardData, fromRegistro: true } 
})
```

---

### ✅ PASO 5: MOSTRAR CARD EN PerfilCard (/perfil-card)

**Muestra la card del jugador con:**
- Foto (avatar_url)
- Nombre + Apellido
- Posición
- Nivel Habilidad
- Puntos: 0 (inicial)
- Tier: Bronce (inicial)
- Ciudad, País

**Opciones:**
- Editar perfil → /editar-perfil
- Ir a home → /home

---

### ✅ PASO 6: FEED PRINCIPAL EN HomePage (/home)

User está autenticado y tiene card completa.

---

## 🗄️ SQL - BASE DE DATOS

### TABLA: api.carfutpro

**Estructura correcta (FIX_PRODUCCION_AHORA.sql):**

```sql
CREATE TABLE IF NOT EXISTS api.carfutpro (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  
  -- Datos personales
  nombre VARCHAR(255),
  apellido VARCHAR(255),
  email VARCHAR(255),
  avatar_url VARCHAR(500),
  ciudad VARCHAR(100),
  pais VARCHAR(100),
  edad INTEGER,
  peso NUMERIC,
  altura NUMERIC,
  
  -- Fútbol
  posicion VARCHAR(50),
  posicion_favorita VARCHAR(50),
  nivel_habilidad VARCHAR(50),
  equipo VARCHAR(100),
  equipo_favorito VARCHAR(100),
  pie VARCHAR(20),
  pierna_dominante VARCHAR(20),
  categoria VARCHAR(50),
  
  -- STATS DE CARD (MUY IMPORTANTE)
  puntos_totales INTEGER DEFAULT 0,
  card_tier VARCHAR(50) DEFAULT 'Bronce',
  partidos_ganados INTEGER DEFAULT 0,
  entrenamientos INTEGER DEFAULT 0,
  amistosos INTEGER DEFAULT 0,
  puntos_comportamiento INTEGER DEFAULT 0,
  
  -- Timestamps
  ultima_actualizacion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 NETLIFY FUNCTION: db-init.js

**Qué hace:**
- Se llama ANTES de signup/OAuth
- Verifica si tabla api.carfutpro existe
- Si no existe, la CREA automáticamente
- Crea schema api si no existe
- Crea políticas RLS
- Crea vista api.usuarios

**Dónde se llama:**
- LoginPage.handleGoogleLogin() ← Antes de OAuth
- FormularioRegistroCompleto.handleGoogleSignup() ← Antes de OAuth  
- FormularioRegistroCompleto.handleFinalizarRegistro() ← Antes de signup

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### PROBLEMA 1: AuthCallback incorrecto
- **Actual**: Redirige SIEMPRE a `/registro` después de OAuth
- **Correcto**: Debería verificar si usuario tiene card
  - Si no → `/registro` para completar perfil
  - Si sí → `/home` o `/perfil-card`

### PROBLEMA 2: Tabla en schema equivocado
- Se crea en `api.carfutpro` ✅ (correcto)
- Pero algunos imports buscan en `public.carfutpro` ❌ (incorrecto)

### PROBLEMA 3: Vista api.usuarios no se actualiza
- La vista es READ-ONLY
- Si se intenta INSERT/UPDATE en api.usuarios, falla
- Debe hacerse INSERT/UPDATE en api.carfutpro

---

## 📌 PRÓXIMOS PASOS

1. ✅ Verificar que db-init.js crea tabla correctamente
2. ✅ Corregir AuthCallback para verificar si tiene card
3. ✅ Asegurar que FormularioRegistroCompleto inserta en api.carfutpro
4. ✅ Verificar que todas las páginas usen api.carfutpro (no public.carfutpro)
5. ✅ Build y redeploy a Netlify
