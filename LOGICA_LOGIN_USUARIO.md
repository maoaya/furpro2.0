# 🔐 Lógica de LOGIN y CREACIÓN DE USUARIO en FutPro

## 📊 Resumen Ejecutivo

FutPro implementa un **sistema de autenticación dual** con tres métodos de registro/login:

1. **OAuth Social** (Google/Facebook) → Inmediato
2. **Email/Password Básico** → Con bypass anti-CAPTCHA 
3. **Registro Completo** → Sistema de 5 pasos con perfil detallado

---

## 🚪 Punto de Entrada: `LoginRegisterForm.jsx`

### **Interfaz Principal**
```
┌─────────────────────────────────────┐
│          ⚽ FutPro                   │
│     Plataforma de Fútbol            │
├─────────────────────────────────────┤
│  🌐 Continuar con Google            │
│  📘 Continuar con Facebook          │
│         ─────── o ───────           │
│    📧 Usar Email y Contraseña       │
│    👤 Crear Usuario (Completo)      │
└─────────────────────────────────────┘
```

### **Estados de la Interfaz**
- **Por defecto**: Botones sociales + opciones básicas
- **Email activado**: Formulario email/password + toggle login/registro
- **Siempre visible**: Botón "Crear Usuario" (redirige a registro completo)

---

## 🔄 Flujo de Autenticación Social (OAuth)

### **Google/Facebook Login**
```javascript
const handleLoginSocial = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (!error) {
    setSuccess(`Redirigiendo a ${provider}...`);
    // Redirección automática por Supabase
  }
};
```

### **Flujo OAuth Completo**
1. **Click en botón social** → `handleLoginSocial('google')`
2. **Redirección a provider** → Google/Facebook OAuth
3. **Callback automático** → `/auth/callback` (manejado por router)
4. **AuthContext detecta sesión** → Usuario autenticado
5. **Redirección final** → `/home`

---

## 📧 Flujo de Email/Password

### **Modo Login (Existente)**
```javascript
const handleLogin = async (e) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (!error) {
    setSuccess('¡Ingreso exitoso! Redirigiendo...');
    // Redirección ultra-agresiva con múltiples fallbacks
    setTimeout(() => navigate('/home'), 500);
  }
};
```

### **Modo Registro (Anti-CAPTCHA)**
```javascript
const handleRegister = async (e) => {
  // 🚀 BYPASS ANTI-CAPTCHA usando Netlify Function
  const response = await fetch('/.netlify/functions/signup-bypass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      password,
      nombre: email.split('@')[0]
    })
  });
  
  if (response.ok) {
    // Registro exitoso → /home
  } else {
    // INTERCEPCIÓN NUCLEAR: Cambiar a modo login automáticamente
    setIsRegister(false);
    setSuccess('🎯 ¡Email detectado! Cambiando a modo de ingreso automáticamente...');
  }
};
```

### **Sistema Anti-502 Inteligente**
- **Si el registro falla** → Asume que el usuario ya existe
- **Cambio automático** → De "Registrarse" a "Ingresar"
- **UX fluida** → Sin errores confusos, solo orientación

---

## 🛡️ Netlify Function: `signup-bypass.js`

### **Propósito**
Evitar errores 502 en registro directo usando **Service Role Key**

### **Lógica**
```javascript
exports.handler = async (event) => {
  const { email, password, nombre } = JSON.parse(event.body);
  
  // Usar Service Role para bypass CAPTCHA
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // ✅ Confirma automáticamente
    user_metadata: { nombre }
  });
  
  return {
    statusCode: error ? 400 : 200,
    body: JSON.stringify(error ? { error } : { user: data.user })
  };
};
```

---

## 🎯 Registro Completo: `RegistroNuevo.jsx`

### **Sistema de 5 Pasos**
```
Paso 1: Credenciales      → email, password, confirmPassword
Paso 2: Datos Personales  → nombre, apellido, edad, teléfono, país, ubicación
Paso 3: Info Futbolística → posición, experiencia, equipoFavorito, peso
Paso 4: Disponibilidad    → horarios, frecuencia de juego
Paso 5: Foto de Perfil    → imagen upload + preview
```

### **Características Avanzadas**
- ✅ **Auto-guardado** cada 30 segundos
- ✅ **Validación por paso** con mensajes específicos
- ✅ **Preview de imagen** en tiempo real
- ✅ **Navegación fluida** entre pasos
- ✅ **Upload a Supabase Storage** para fotos

### **Flujo de Creación Completa**
```javascript
const completarRegistro = async () => {
  // 1. Crear cuenta en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: `${formData.nombre} ${formData.apellido}`,
        display_name: formData.nombre
      }
    }
  });
  
  // 2. Si hay usuario, subir foto y crear perfil completo
  if (authData.user) {
    let fotoUrl = null;
    
    // Subir foto si existe
    if (imagenPerfil) {
      const fileName = `${authData.user.id}_${Date.now()}.jpg`;
      const { data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, imagenPerfil);
      
      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path);
        fotoUrl = urlData.publicUrl;
      }
    }
    
    // 3. Crear perfil en tabla usuarios
    const perfilCompleto = {
      id: authData.user.id,
      email: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      // ... todos los campos del formulario
      foto_url: fotoUrl,
      created_at: new Date().toISOString()
    };
    
    await supabase.from('usuarios').insert([perfilCompleto]);
    
    // 4. Redirección a card de perfil
    navigate('/perfil-card', { 
      state: { 
        perfilData: perfilCompleto,
        fromRegistration: true 
      } 
    });
  }
};
```

---

## 🧠 AuthContext: Gestión de Estado

### **Inicialización**
```javascript
useEffect(() => {
  const initAuth = async () => {
    // 1. Verificar localStorage para indicaciones
    const authCompleted = localStorage.getItem('authCompleted') === 'true';
    const loginSuccess = localStorage.getItem('loginSuccess') === 'true';
    
    // 2. Obtener sesión actual de Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      setUser(session.user);
      
      // 3. Cargar perfil desde tabla usuarios
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userData) {
        setRole(userData.rol || 'player');
        setUserProfile(userData);
      }
    }
  };
}, []);
```

### **Auth State Changes**
```javascript
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('🔄 Cambio en autenticación:', event);
  
  if (session?.user) {
    setUser(session.user);
    
    // Verificar datos pendientes del registro completo
    const pendingData = localStorage.getItem('pendingProfileData');
    if (pendingData) {
      const profileData = JSON.parse(pendingData);
      
      // Crear perfil con datos pendientes
      await supabase.from('usuarios').insert([{
        id: session.user.id,
        email: session.user.email,
        ...profileData
      }]);
      
      localStorage.removeItem('pendingProfileData');
    }
  }
});
```

---

## 📊 Tipos de Usuario y Estados

### **Estados de Autenticación**
```
guest        → No autenticado
authenticating → Proceso de login en curso
authenticated  → Sesión válida
profile_complete → Perfil completo en BD
profile_pending  → Auth exitoso, perfil incompleto
```

### **Roles de Usuario**
```
guest   → Visitante sin cuenta
player  → Usuario jugador estándar
admin   → Administrador del sistema
coach   → Entrenador de equipo
owner   → Propietario de equipo
```

---

## 🗄️ Estructura de Base de Datos

### **Tabla `usuarios`**
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,           -- Supabase Auth User ID
  email VARCHAR NOT NULL,        -- Email de autenticación
  nombre VARCHAR,                -- Nombre real
  apellido VARCHAR,              -- Apellido
  edad INTEGER,                  -- Edad del jugador
  telefono VARCHAR,              -- Teléfono de contacto
  pais VARCHAR DEFAULT 'México', -- País de residencia
  ubicacion VARCHAR,             -- Ciudad/ubicación
  posicion VARCHAR,              -- Posición futbolística
  experiencia VARCHAR,           -- Nivel de experiencia
  equipoFavorito VARCHAR,        -- Equipo favorito
  peso VARCHAR,                  -- Peso del jugador
  disponibilidad VARCHAR,        -- Disponibilidad general
  vecesJuegaPorSemana VARCHAR,   -- Frecuencia de juego
  horariosPreferidos VARCHAR,    -- Horarios preferidos
  foto_url VARCHAR,              -- URL de foto de perfil
  rol VARCHAR DEFAULT 'player',  -- Rol del usuario
  equipoId UUID,                 -- ID del equipo actual
  created_at TIMESTAMP,          -- Fecha de creación
  updated_at TIMESTAMP           -- Última actualización
);
```

---

## 🔀 Flujos de Redirección

### **Matriz de Redirección**
```
OAuth Success     → /home
Email Login       → /home (con múltiples fallbacks)
Email Register    → /home (bypass exitoso) | Modo Login (bypass falla)
Registro Completo → /perfil-card (con datos) → /home
Error General     → Mantiene en /login con mensaje
```

### **Redirección Ultra-Agresiva**
```javascript
// Patrón usado en login exitoso
setTimeout(() => {
  try {
    navigate('/home');
  } catch (err) {
    window.location.href = '/home';
  }
  // Fallback definitivo
  setTimeout(() => {
    if (window.location.pathname !== '/home') {
      window.location.href = '/home';
    }
  }, 1000);
}, 500);
```

---

## 🎨 Card de Perfil y Scoring

### **Sistema de Puntuación**
Después del registro completo, se calcula un score de 0-100 basado en:
- **Completitud del perfil** (40 puntos)
- **Información futbolística** (35 puntos)  
- **Disponibilidad clara** (25 puntos)

### **Categorías por Score**
```
90-100: ⭐ ELITE     → "Perfil Excepcional"
80-89:  🔥 PRO      → "Jugador Destacado"  
70-79:  💪 SÓLIDO   → "Buen Jugador"
60-69:  ⚡ PROMESA  → "En Desarrollo"
<60:    🌱 NOVATO   → "Iniciando Camino"
```

---

## 🛡️ Seguridad y Manejo de Errores

### **Validaciones Implementadas**
- ✅ **Email único** (manejado por Supabase)
- ✅ **Contraseña mínima** (6 caracteres)
- ✅ **Edad válida** (16-60 años)
- ✅ **Campos obligatorios** por paso
- ✅ **Upload seguro** de imágenes

### **Manejo de Errores**
- **502 en registro** → Bypass automático con función serverless
- **OAuth fallos** → Mensajes específicos por provider
- **Duplicados** → Cambio inteligente a modo login
- **Validación** → Mensajes contextuales por campo

---

## 🚀 Optimizaciones y UX

### **Performance**
- **Auto-guardado** cada 30 segundos
- **Lazy loading** de componentes
- **Compresión de imágenes** antes de upload
- **Cache de datos** en localStorage

### **Experiencia de Usuario**
- **Progreso visual** en registro de 5 pasos
- **Animaciones fluidas** entre pasos
- **Feedback inmediato** en validaciones
- **Recuperación de sesión** automática
- **Modo offline** para auto-guardado

---

## 📋 Próximos Pasos Técnicos

1. **Implementar recuperación de contraseña**
2. **Añadir verificación de email opcional**
3. **Sistema de invitaciones por referido**
4. **Integración con redes sociales adicionales**
5. **Modo offline completo para registro**

---

> **✅ Estado Actual**: Sistema completamente funcional en producción  
> **🌐 URL**: https://futpro.vip  
> **📊 Deployment**: Netlify con funciones serverless activas
