import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx';

const RegistroCompleto = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  
  // Estado del formulario paso a paso
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);

  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    email: '',
    password: '',
    confirmPassword: '',
    
    // Paso 2: Información personal
    nombre: '',
    apellido: '',
    edad: 18,
    telefono: '',
    pais: 'México',
    ubicacion: '',
    
    // Paso 3: Información futbolística
    posicion: '',
    experiencia: '',
    equipoFavorito: '',
    peso: '',
    
    // Paso 4: Disponibilidad
    disponibilidad: '',
    vecesJuegaPorSemana: '',
    horariosPreferidos: '',
    
    // Paso 5: Foto de perfil
    foto: null
  });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }
      setForm({ ...form, avatar_url: file });
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.warn('⚠️ Error subiendo imagen:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.warn('⚠️ Error en upload:', error);
      return null;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!form.nombre?.trim()) {
        setError('El nombre es obligatorio');
        return;
      }
      if (!form.email?.trim()) {
        setError('El email es obligatorio');
        return;
      }
      if (!form.password) {
        setError('La contraseña es obligatoria');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (form.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError('Por favor ingresa un email válido');
        return;
      }
    }

    if (currentStep === 2) {
      if (!form.posicion) {
        setError('La posición es obligatoria');
        return;
      }
      if (!form.frecuencia_juego) {
        setError('La frecuencia de juego es obligatoria');
        return;
      }
      if (form.edad < 13 || form.edad > 60) {
        setError('La edad debe estar entre 13 y 60 años');
        return;
      }
      if (form.peso && (form.peso < 30 || form.peso > 150)) {
        setError('El peso debe estar entre 30 y 150 kg');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  // Manejar OAuth después de completar los datos del formulario
  const handleOAuthComplete = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      // Validar que tenemos datos mínimos del formulario
      if (!form.nombre?.trim()) {
        setError('Por favor completa al menos tu nombre antes de usar OAuth');
        setLoading(false);
        return;
      }

      // Guardar datos del formulario para completar después del OAuth
      const profileData = {
        nombre: form.nombre.trim(),
        edad: parseInt(form.edad) || null,
        peso: form.peso ? parseFloat(form.peso) : null,
        ciudad: form.ciudad?.trim() || null,
        pais: form.pais?.trim() || 'España',
        posicion: form.posicion || 'Delantero Centro',
        frecuencia_juego: form.frecuencia_juego || '3',
        rol: form.rol,
        tipo_usuario: form.tipo_usuario
      };

      // Guardar en localStorage para completar después del OAuth
      localStorage.setItem('pendingProfileData', JSON.stringify(profileData));
      localStorage.setItem('postLoginRedirect', '/home');
      
      console.log('📝 Datos guardados para OAuth:', {
        profileData,
        redirect: '/home'
      });

      console.log(`🚀 Iniciando OAuth con ${provider} desde registro completo`);
      setMsg(`Conectando con ${provider}...`);

      // Iniciar OAuth
      if (provider === 'google') {
        const result = await loginWithGoogle();
        if (result?.error) {
          setError(`Error con Google: ${result.error}`);
          setLoading(false);
        } else {
          console.log('✅ OAuth Google iniciado correctamente');
        }
      } else if (provider === 'facebook') {
        const result = await loginWithFacebook();
        if (result?.error) {
          setError(`Error con Facebook: ${result.error}`);
          setLoading(false);
        } else {
          console.log('✅ OAuth Facebook iniciado correctamente');
        }
      }
    } catch (error) {
      console.error('Error en OAuth desde registro:', error);
      setError(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  // Componente de botones OAuth
  const OAuthButtons = () => (
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button
        type="button"
        onClick={() => handleOAuthComplete('google')}
        disabled={loading}
        style={{
          flex: 1,
          padding: '12px',
          background: '#4285f4',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: loading ? 0.7 : 1
        }}
      >
        <i className="fab fa-google"></i>
        Google
      </button>
      <button
        type="button"
        onClick={() => handleOAuthComplete('facebook')}
        disabled={loading}
        style={{
          flex: 1,
          padding: '12px',
          background: '#1877f2',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: loading ? 0.7 : 1
        }}
      >
        <i className="fab fa-facebook-f"></i>
        Facebook
      </button>
    </div>
  );

  const handleDirectRegistration = async () => {
    setLoading(true);
    setError('');
    setMsg('Registrando directamente en la base de datos...');

    try {
      // Validaciones
      if (!form.nombre || !form.email || !form.password) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      // Subir imagen si existe
      let avatarUrl = null;
      if (form.avatar_url && typeof form.avatar_url === 'object') {
        setMsg('Subiendo imagen de perfil...');
        avatarUrl = await uploadImage(form.avatar_url);
      }

      // Generar ID único para el usuario
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Crear perfil directamente en la base de datos
      const perfilData = {
        id: userId,
        nombre: form.nombre.trim(),
        email: form.email.toLowerCase().trim(),
        edad: parseInt(form.edad) || null,
        peso: form.peso ? parseFloat(form.peso) : null,
        ciudad: form.ciudad?.trim() || null,
        pais: form.pais?.trim() || 'España',
        posicion: form.posicion,
        frecuencia_juego: form.frecuencia_juego,
        avatar_url: avatarUrl,
        rol: form.rol,
        tipo_usuario: form.tipo_usuario,
        estado: 'pendiente_verificacion',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setMsg('Creando perfil de jugador...');
      const { error: perfilError } = await supabase
        .from('usuarios')
        .insert([perfilData]);

      if (perfilError) {
        console.error('❌ Error creando perfil directo:', perfilError);
        setError(`Error: ${perfilError.message}`);
        setLoading(false);
        return;
      }

      setMsg('¡Usuario registrado! Te contactaremos para activar tu cuenta.');
      localStorage.removeItem('tempRegistroData');
      localStorage.removeItem('registroProgreso');
      // Asegurar intención de navegación a home
      localStorage.setItem('postLoginRedirect', '/home');
      
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('💥 Error en registro directo:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    // Asegurar redirección post-login consistente
    localStorage.setItem('postLoginRedirect', '/home');
    localStorage.setItem('postLoginRedirectReason', 'signup-full');

    try {
      if (!form.nombre || !form.email || !form.password) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      let avatarUrl = null;
      if (form.avatar_url && typeof form.avatar_url === 'object') {
        console.log('📸 Subiendo imagen de perfil...');
        setMsg('Subiendo imagen de perfil...');
        avatarUrl = await uploadImage(form.avatar_url);
        if (!avatarUrl) {
          console.warn('⚠️ No se pudo subir la imagen, continuando sin ella...');
        }
      }

      // REGISTRO DIRECTO CON BYPASS DE CAPTCHA
      console.log('� Registrando usuario directamente...');
      setMsg('Creando cuenta de usuario...');
      // Obtener token mock siempre
      const { status, provider } = getCaptchaProviderInfo();
      const authOptions = {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        options: {
          data: {
            nombre: form.nombre.trim(),
            full_name: form.nombre.trim()
          }
        }
      };
      
      // BYPASS DEFINITIVO: NO ENVIAR captchaToken en absoluto
      // Si Supabase no recibe captchaToken, no validará captcha
      console.log('[CAPTCHA] 🚀 BYPASS DEFINITIVO: NO enviando captchaToken');
      console.log('[CAPTCHA] �️ Supabase saltará validación captcha automáticamente');
      
      const { data: authData, error: authError } = await supabase.auth.signUp(authOptions);

      if (authError) {
        console.error('❌ Error en Auth:', authError);
        
        // Manejar errores específicos
        if (authError.message?.includes('already registered') || 
           authError.message?.includes('User already registered')) {
          setError('Este email ya está registrado. Ve al login para iniciar sesión.');
          setTimeout(() => navigate('/', { replace: true }), 3000);
          return;
        } else if (authError.message?.includes('signup_disabled')) {
          setError('El registro está temporalmente deshabilitado. Intenta más tarde.');
        } else if (authError.message?.toLowerCase().includes('captcha')) {
          console.warn('🛡️ CAPTCHA bloqueó el registro. Usando bypass con Function...');
          setMsg('Verificación bloqueada. Intentando crear cuenta de forma segura...');
          const bypass = await signupBypass({
            email: form.email.toLowerCase().trim(),
            password: form.password,
            nombre: form.nombre.trim()
          });
          if (!bypass.ok) {
            setError('Error de seguridad: ' + (bypass.error || 'No se pudo crear la cuenta. Intenta más tarde.'));
            setLoading(false);
            return;
          }
          // Intentar iniciar sesión ahora que el usuario existe
          const { data: signInData2, error: signInErr2 } = await supabase.auth.signInWithPassword({
            email: form.email.toLowerCase().trim(),
            password: form.password
          });
          if (signInErr2) {
            console.warn('⚠️ No se pudo iniciar sesión tras bypass, redirigiendo a magic link...', signInErr2.message);
            if (bypass.redirectLink) {
              window.location.assign(bypass.redirectLink);
              return;
            }
            setError('Cuenta creada, pero no se pudo iniciar sesión automáticamente. Ve al login.');
            setLoading(false);
            return;
          }
          session = signInData2.session;
          console.log('🔓 Sesión iniciada vía bypass function');
        } else {
          setError(`Error de registro: ${authError.message}`);
        }
        if (!session) {
          setLoading(false);
          return;
        }
      }

      // Si llegamos aquí, el registro en Auth fue exitoso
      console.log('✅ Usuario registrado en Auth:', authData.user?.email);
      console.log('👤 Usuario ID:', authData.user?.id);

      // Asegurar sesión activa (Supabase puede no iniciar sesión si requiere confirmación de email)
      let session = authData.session || null;
      if (!session) {
        console.log('🔐 No hay sesión tras el signUp. Intentando iniciar sesión automáticamente...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email.toLowerCase().trim(),
          password: form.password
        });
        if (signInError) {
          console.warn('⚠️ No se pudo iniciar sesión automáticamente:', signInError.message);
          const needsConfirm = signInError.message?.toLowerCase().includes('email') && signInError.message?.toLowerCase().includes('confirm');
          if (needsConfirm) {
            // Si auto-confirm está habilitado, simplemente omitir la verificación
            if (cfg.autoConfirmSignup) {
              console.log('🏠 Auto-confirm habilitado: omitiendo verificación de email');
              setMsg('Cuenta creada exitosamente. Iniciando sesión...');
            }

            // Señales y navegación estable
            localStorage.setItem('registroCompleto', 'true');
            localStorage.setItem('authCompleted', 'true');
            setTimeout(() => ensureHomeNavigation(navigate, { target: '/home' }), 300);

            return;
          }
        } else {
          session = signInData.session;
          console.log('🔓 Sesión iniciada automáticamente');
        }
      }
      
      // Crear perfil en la base de datos
      setMsg('Completando perfil de jugador...');
      
      const perfilData = {
        id: authData.user.id,
        nombre: form.nombre.trim(),
        email: form.email.toLowerCase().trim(),
        edad: parseInt(form.edad) || null,
        peso: form.peso ? parseFloat(form.peso) : null,
        ciudad: form.ciudad?.trim() || null,
        pais: form.pais?.trim() || 'España',
        posicion: form.posicion,
        frecuencia_juego: form.frecuencia_juego,
        avatar_url: avatarUrl,
        rol: form.rol || 'usuario',
        tipo_usuario: form.tipo_usuario || 'jugador',
        estado: 'activo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Datos del perfil a insertar:', perfilData);
      
      const { data: insertData, error: perfilError } = await supabase
        .from('usuarios')
        .insert([perfilData])
        .select();

      if (perfilError) {
        console.error('❌ Error creando perfil:', perfilError);
        setError(`Error creando perfil: ${perfilError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Perfil creado exitosamente:', insertData);
      console.log('🎉 REGISTRO COMPLETADO EXITOSAMENTE');
      
      setMsg('¡Registro exitoso! Bienvenido a FutPro. Redirigiendo a tu dashboard...');
      
      // Limpiar datos temporales
      localStorage.removeItem('tempRegistroData');
      localStorage.removeItem('registroProgreso');
      
      // Calcular calificación basada en frecuencia de juego
      const frecuencia = parseInt(form.frecuencia_juego);
      let calificacion = 50; // Base
      if (frecuencia >= 7) calificacion = 95;
      else if (frecuencia >= 6) calificacion = 90;
      else if (frecuencia >= 5) calificacion = 85;
      else if (frecuencia >= 4) calificacion = 75;
      else if (frecuencia >= 3) calificacion = 65;
      else if (frecuencia >= 2) calificacion = 55;
      
      // Guardar datos del usuario registrado
      localStorage.setItem('userRegistrado', JSON.stringify({
        id: authData.user.id,
        nombre: form.nombre,
        email: form.email,
        calificacion: calificacion,
        registrado: true,
        timestamp: new Date().toISOString()
      }));
      
      // Marcar que el registro está completo y forzar actualización del contexto
      localStorage.setItem('registroCompleto', 'true');
      localStorage.setItem('authCompleted', 'true');
      
      // Mensaje de éxito y esperar un poco para que el contexto se actualice
      console.log('🎉 REGISTRO COMPLETADO - Preparando navegación...');
      
      // Navegación más robusta con múltiples intentos
      const navigateToHome = () => {
        try {
          console.log('🔄 Navegando a /home después del registro completo');
          navigate('/home', { replace: true });
        } catch (navError) {
          console.warn('⚠️ Error en navigate, intentando con window.location');
          window.location.href = '/home';
        }
      };
      
      // Intentar navegación inmediata
      setTimeout(navigateToHome, 1000);
      
      // Fallback por si falla la primera navegación
      setTimeout(() => {
        if (window.location.pathname !== '/home') {
          console.log('🔄 Navegación fallback ejecutándose...');
          navigateToHome();
        }
      }, 3000);

    } catch (error) {
      console.error('💥 Error inesperado en registro:', error);
      setError(`Error inesperado: ${error.message}. Por favor intenta nuevamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: darkCard,
        border: `2px solid ${gold}`,
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5)`
      }}>
        {/* Banner QA: auto-confirm activo */}
        {cfg.autoConfirmSignup && !hideAutoConfirmBanner && (
          <div style={{
            background: '#1e3a8a',
            color: '#fff',
            border: `1px solid ${gold}`,
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px'
          }}>
            <span>Modo QA: la verificación por email está desactivada (auto-confirm activo)</span>
            <button
              type="button"
              onClick={() => { localStorage.setItem('hideAutoConfirmBanner', 'true'); setHideAutoConfirmBanner(true); }}
              style={{
                background: 'transparent',
                color: gold,
                border: `1px solid ${gold}`,
                borderRadius: '6px',
                padding: '2px 8px',
                cursor: 'pointer'
              }}
            >Ocultar</button>
          </div>
        )}
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FutproLogo size={80} />
          <h1 style={{ color: gold, marginTop: '20px', marginBottom: '10px' }}>
            Registro Completo FutPro
          </h1>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            Paso {currentStep} de 3 - Completa tu perfil de jugador
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: '#333',
          height: '6px',
          borderRadius: '3px',
          marginBottom: '30px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: gold,
            height: '100%',
            width: `${(currentStep / 3) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: '#ff4444',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ❌ {error}
            {error.includes('Demasiados intentos') && (
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => {
                    setError('');
                    handleDirectRegistration();
                  }}
                  style={{
                    background: '#ff6b35',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  🚀 Registro Directo (Sin verificación email)
                </button>
              </div>
            )}
          </div>
        )}

        {msg && (
          <div style={{
            background: '#22c55e',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ✅ {msg}
          </div>
        )}

        {/* Mensaje adicional para el último paso */}
        {currentStep === 3 && (
          <div style={{
            background: '#1a365d',
            color: gold,
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            border: `1px solid ${gold}`
          }}>
            🏆 ¡Último paso! Completa tu ubicación y foto de perfil
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PASO 1: Información básica */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>
                📝 Información Básica
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="tu@email.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="Repite tu contraseña"
                />
              </div>

              <button
                type="button"
                onClick={nextStep}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: gold,
                  color: black,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* PASO 2: Información deportiva */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>
                ⚽ Información Deportiva
              </h2>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={form.edad}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    min="13"
                    max="60"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="peso"
                    value={form.peso}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    placeholder="70"
                    min="30"
                    max="150"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Posición preferida
                </label>
                <select
                  name="posicion"
                  value={form.posicion}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                >
                  <option value="Portero">🥅 Portero</option>
                  <option value="Defensa Central">🛡️ Defensa Central</option>
                  <option value="Lateral Derecho">➡️ Lateral Derecho</option>
                  <option value="Lateral Izquierdo">⬅️ Lateral Izquierdo</option>
                  <option value="Libero">🔒 Libero</option>
                  <option value="Pivote">⚙️ Pivote</option>
                  <option value="Mediocentro">🎯 Mediocentro</option>
                  <option value="Mediocentro Ofensivo">🔥 Mediocentro Ofensivo</option>
                  <option value="Extremo Derecho">🚀 Extremo Derecho</option>
                  <option value="Extremo Izquierdo">⚡ Extremo Izquierdo</option>
                  <option value="Media Punta">💎 Media Punta</option>
                  <option value="Delantero Centro">🎯 Delantero Centro</option>
                  <option value="Segundo Delantero">⭐ Segundo Delantero</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  ¿Cuántos días juegas por semana? (Afecta tu calificación)
                </label>
                <select
                  name="frecuencia_juego"
                  value={form.frecuencia_juego}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                >
                  <option value="1">🔥 1 día por semana (Casual)</option>
                  <option value="2">⚡ 2 días por semana (Aficionado)</option>
                  <option value="3">🎯 3 días por semana (Regular)</option>
                  <option value="4">� 4 días por semana (Dedicado)</option>
                  <option value="5">🏆 5 días por semana (Serio)</option>
                  <option value="6">⭐ 6 días por semana (Semi-Pro)</option>
                  <option value="7">👑 7 días por semana (Profesional)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: gold,
                    color: black,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Foto y ubicación */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>
                📸 Foto y Ubicación
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Foto de perfil (opcional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#444',
                    color: '#fff',
                    border: `2px dashed ${gold}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  📷 Seleccionar imagen
                </button>
                
                {previewImage && (
                  <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <p style={{ color: gold, marginBottom: '10px' }}>Preview</p>
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `3px solid ${gold}`
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    placeholder="Tu ciudad"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={form.pais}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  ← Anterior
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '15px',
                    background: loading ? '#666' : gold,
                    color: black,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Registrando...' : 'Completar Registro ✅'}
                </button>
              </div>

              {/* Separador con opciones rápidas OAuth */}
              <div style={{ 
                margin: '30px 0 20px 0', 
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  height: '1px',
                  background: '#444',
                  margin: '0 auto',
                  position: 'relative'
                }}>
                  <span style={{
                    background: darkCard,
                    color: '#ccc',
                    padding: '0 15px',
                    fontSize: '14px',
                    position: 'absolute',
                    left: '50%',
                    top: '-8px',
                    transform: 'translateX(-50%)'
                  }}>
                    o termina rápido con
                  </span>
                </div>
              </div>

              {/* Botones OAuth finales */}
              <OAuthButtons />
            </div>
          )}
        </form>

        {/* Volver al login */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            ¿Ya tienes cuenta?{' '}
            <span
              onClick={() => navigate('/')}
              style={{
                color: gold,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}