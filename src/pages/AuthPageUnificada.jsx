import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase.js';
import { getConfig } from '../config/environment.js';
import { handleSuccessfulAuth } from '../utils/navigationUtils.js';
import { robustSignUp, robustSignIn, createUserProfile } from '../utils/authUtils.js';
import { registrarUsuarioCompleto } from '../utils/registroCompleto.js';
import { authFlowManager, handleAuthenticationSuccess, handleCompleteRegistration } from '../utils/authFlowManager.js';

const AuthPageUnificada = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // TRUE = Mostrar LOGIN por defecto
  const [showEmailForm, setShowEmailForm] = useState(false); // FALSE = Ocultar formulario hasta que se solicite
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Detectar tipo de registro basado en la ruta
  const registroTipo = location.pathname.includes('google') ? 'google' :
                      location.pathname.includes('facebook') ? 'facebook' :
                      location.pathname.includes('email') ? 'email' : 'general';
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    edad: '',
    peso: '',
    altura: '',
    telefono: '',
    posicion: '',
    equipoFavorito: '',
    experiencia: '',
    ubicacion: '',
    pais: '',
    disponibilidad: '',
    vecesJuegaPorSemana: '',
    piernaDominante: 'Derecha',
    foto: null
  });

  // Autocompletar ciudad y país por IP con fallback
  useEffect(() => {
    const fillFromIp = async () => {
      try {
        console.log('🌍 Intentando detectar ubicación por IP...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (data.city || data.country_name) {
              setFormData((prev) => ({
                ...prev,
                ubicacion: prev.ubicacion || data.city || '',
                pais: prev.pais || data.country_name || ''
              }));
              console.log('✅ Ubicación detectada (ipapi.co):', data.city, data.country_name);
              return;
            }
          }
        } catch (e) {
          clearTimeout(timeoutId);
          console.warn('⚠️ ipapi.co no disponible:', e.message);
        }

        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 8000);
        try {
          const res2 = await fetch('https://ipwho.is/?fields=city,country', { signal: controller2.signal });
          clearTimeout(timeoutId2);
          if (res2.ok) {
            const data = await res2.json();
            if (data.city || data.country) {
              setFormData((prev) => ({
                ...prev,
                ubicacion: prev.ubicacion || data.city || '',
                pais: prev.pais || data.country || ''
              }));
              console.log('✅ Ubicación detectada (ipwho.is):', data.city, data.country);
              return;
            }
          }
        } catch (e) {
          clearTimeout(timeoutId2);
          console.warn('⚠️ ipwho.is no disponible:', e.message);
        }
        console.log('⚠️ No se pudo detectar ubicación por IP');
      } catch (error) {
        console.warn('⚠️ Error general en geolocalización:', error);
      }
    };
    fillFromIp();
  }, []);

  // NO redirigir automáticamente - dejar que el usuario use el formulario de login
  // La redirección ocurrirá después del login exitoso en las funciones handleEmailLogin/handleEmailRegister
  useEffect(() => {
    // Limpiar flags de localStorage que podrían causar redirecciones no deseadas
    if (!user) {
      localStorage.removeItem('authCompleted');
      localStorage.removeItem('loginSuccess');
    }
    
    // Solo logging, sin redirección automática
    if (user) {
      const categoria = user?.user_metadata?.categoria || user?.categoria;
      console.log('✅ Usuario ya autenticado detectado:', user.email, 'Categoría:', categoria);
      console.log('ℹ️ Usuario puede estar visitando la página - NO redirigir automáticamente');
    }
  }, [user]);

  // Efecto eliminado - causaba redirecciones automáticas no deseadas
  // La redirección debe ocurrir SOLO después de un login exitoso, no al cargar la página

  // Función ELIMINADA - No debe haber navegación automática
  // La redirección ocurre en handleEmailLogin y handleEmailRegister después del login exitoso

  // Calcular puntaje de card según nivel de habilidad
  // Sistema de puntaje inicial bajo para fomentar progresión
  const calcularPuntaje = (nivel) => {
    const puntajes = {
      'Elite': 45,           // Jugadores de élite empiezan con ventaja pero deben demostrar
      'Profesional': 35,     // Profesionales con experiencia
      'Avanzado': 25,        // Jugadores avanzados
      'Intermedio': 20,      // Nivel intermedio
      'Principiante': 15     // Todos empiezan desde abajo y deben subir jugando
    };
    return puntajes[nivel] || 15;
  };

  // Guardar datos del perfil en draft para usar después de OAuth
  const persistProfileDraft = async () => {
    console.log('💾 persistProfileDraft: iniciando con formData:', { 
      hasFoto: !!formData.foto, 
      nombre: formData.nombre, 
      edad: formData.edad 
    });
    
    // Convertir foto a data URL si existe
    let fotoUrl = '';
    if (formData.foto instanceof File) {
      try {
        const reader = new FileReader();
        fotoUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.foto);
        });
        console.log('📸 Foto convertida a data URL (tamaño:', fotoUrl.length, 'bytes)');
      } catch (e) {
        console.error('❌ Error convirtiendo foto:', e);
      }
    }

    const puntaje = calcularPuntaje(formData.experiencia);
    
    // Guardar CON MÚLTIPLES CLAVES PARA COMPATIBILIDAD
    const draft = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      edad: formData.edad,
      peso: formData.peso,
      altura: formData.altura,
      telefono: formData.telefono,
      posicion: formData.posicion,
      equipoFavorito: formData.equipoFavorito,
      experiencia: formData.experiencia,
      ubicacion: formData.ubicacion,
      pais: formData.pais,
      disponibilidad: formData.disponibilidad,
      vecesJuegaPorSemana: formData.vecesJuegaPorSemana,
      piernaDominante: formData.piernaDominante,
      avatar_url: fotoUrl,
      puntaje: puntaje
    };
    
    try {
      localStorage.setItem('pendingProfileData', JSON.stringify(draft));
      localStorage.setItem('draft_carfutpro', JSON.stringify(draft));
      console.log('✅ Datos guardados en localStorage:', draft);
    } catch (e) {
      console.warn('⚠️ Error guardando en localStorage:', e);
    }
  };

  // REGISTRO CON EMAIL Y PASSWORD
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.email || !formData.password || !formData.nombre || !formData.apellido || 
          !formData.edad || !formData.telefono || !formData.posicion || !formData.experiencia || 
          !formData.ubicacion || !formData.disponibilidad) {
        setError('Por favor completa todos los campos obligatorios marcados con *');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Validaciones específicas adicionales
      if (formData.edad < 16 || formData.edad > 60) {
        setError('La edad debe estar entre 16 y 60 años');
        return;
      }

      if (formData.telefono.length < 10) {
        setError('El teléfono debe tener al menos 10 dígitos');
        return;
      }

      console.log('📝 Iniciando registro con AuthFlowManager mejorado...');
      setSuccess('Creando cuenta...');

      // Convertir foto a data URL si existe
      let fotoUrl = '';
      if (formData.foto instanceof File) {
        try {
          const reader = new FileReader();
          fotoUrl = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(formData.foto);
          });
        } catch (e) {
          console.warn('⚠️ Error convirtiendo foto:', e);
        }
      }

      // Guardar todos los datos en localStorage ANTES de registrar
      const perfilData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido?.trim() || '',
        edad: formData.edad ? Number(formData.edad) : null,
        peso: formData.peso ? Number(formData.peso) : null,
        altura: formData.altura ? Number(formData.altura) : null,
        telefono: formData.telefono.trim(),
        posicion: formData.posicion,
        equipoFavorito: formData.equipoFavorito?.trim() || '',
        experiencia: formData.experiencia,
        ciudad: formData.ubicacion.trim(),
        pais: formData.pais.trim(),
        disponibilidad: formData.disponibilidad,
        piernaDominante: formData.piernaDominante || 'Derecha',
        avatar_url: fotoUrl || ''
      };
      
      try {
        localStorage.setItem('pendingProfileData', JSON.stringify(perfilData));
        localStorage.setItem('draft_carfutpro', JSON.stringify(perfilData));
        console.log('✅ Datos guardados en localStorage:', perfilData);
      } catch (e) {
        console.warn('⚠️ Error guardando en localStorage:', e);
      }

      // Usar el nuevo manager de flujo completo
      const resultado = await handleCompleteRegistration({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido?.trim() || '',
        edad: parseInt(formData.edad),
        telefono: formData.telefono.trim(),
        posicion: formData.posicion,
        equipoFavorito: formData.equipoFavorito?.trim() || '',
        experiencia: formData.experiencia,
        ubicacion: formData.ubicacion.trim(),
        disponibilidad: formData.disponibilidad
      }, navigate);

      if (!resultado.success) {
        console.error('❌ Error en registro completo:', resultado.error);
        setError(`Error en registro: ${resultado.error}`);
        return;
      }

      // Éxito - el manager se encarga de la navegación
      console.log('✅ Registro y navegación completados');
      setSuccess(resultado.message || 'Cuenta creada exitosamente! Redirigiendo...');

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      setError(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON EMAIL Y PASSWORD
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.email || !formData.password) {
        setError('Por favor completa email y contraseña');
        return;
      }

      console.log('🔐 Iniciando sesión con email...');
      setSuccess('Iniciando sesión...');

      // Usar función robusta de login
      const loginResult = await robustSignIn(formData.email, formData.password);

      if (!loginResult.success) {
        console.error('❌ Error en login robusto:', loginResult.error);
        setError(`Error de login: ${loginResult.error}`);
        return;
      }

      console.log('✅ Login exitoso con email/password');
      setSuccess('¡Login exitoso! Redirigiendo...');

      // Usar el nuevo AuthFlowManager para manejo post-login
      const userData = {
        id: loginResult.data.user.id,
        email: loginResult.data.user.email,
        nombre: loginResult.data.user.user_metadata?.nombre || 'Usuario',
        apellido: loginResult.data.user.user_metadata?.apellido || ''
      };

      // Usar el nuevo manager para navegación robusta
      const resultado = await handleAuthenticationSuccess(loginResult.data.user, navigate, userData);
      
      if (!resultado.success) {
        console.log('⚠️ Problema con AuthFlowManager, usando fallback');
        handleSuccessfulAuth(userData, navigate);
      }    } catch (error) {
      console.error('💥 Error inesperado en login:', error);
      setError(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON GOOGLE
  const handleGoogleAuth = async () => {
    console.log('[OAuth] handleGoogleAuth llamado');
    setLoading(true);
    setError('');
    setSuccess('Guardando datos del formulario...');

    try {
      console.log('🔐 Iniciando autenticación con Google...');
      
      // Guardar datos del perfil antes de redirigir a Google (incluyendo foto)
      await persistProfileDraft();
      console.log('✅ Datos del formulario guardados, iniciando OAuth...');
      
      localStorage.setItem('post_auth_origin', 'formulario_registro');
      localStorage.setItem('post_auth_target', '/perfil-card');
      
      setSuccess('Redirigiendo a Google...');
      
      const config = getConfig();
      console.log('[OAuth] redirectTo:', `${window.location.origin}/auth/callback`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ Error OAuth Google:', error);
        setError(`Error Google: ${error.message}`);
      } else {
        console.log('🔄 Redirigiendo a Google...');
        setSuccess('Redirigiendo a Google...');
        // Log extra para depuración
        console.log('[OAuth] Redirección iniciada correctamente');
      }
    } catch (error) {
      console.error('💥 Error inesperado Google:', error);
      setError(`Error Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON FACEBOOK
  const handleFacebookAuth = async () => {
    setLoading(true);
    setError('');
    setSuccess('Facebook auth...');

    try {
      console.log('🔐 Iniciando autenticación con Facebook...');
      
      // Si estamos en la ruta específica de Facebook, ir directo al OAuth
      if (registroTipo === 'facebook') {
        const config = getConfig();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook'
        });

        if (error) {
          console.error('❌ Error OAuth Facebook:', error);
          setError(`Error Facebook: ${error.message}`);
        } else {
          console.log('🔄 Redirigiendo a Facebook...');
          setSuccess('Redirigiendo a Facebook...');
        }
      } else {
        // Si no, navegar a la ruta específica
        navigate('/registro-facebook');
      }
    } catch (error) {
      console.error('💥 Error inesperado Facebook:', error);
      setError(`Error Facebook: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'foto' && files) {
      setFormData({
        ...formData,
        foto: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Pantalla de acceso ZONA PRO (foto producto: camisetas negras/oro + trofeo)
  // Fondo: /zona-pro-bg.jpg si el usuario lo sube; si no, capas CSS + stock (mismo layout de la foto).
  const gold = '#FFD700';
  const zonaProBg = '/zona-pro-bg.jpg';
  const shellBg = {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: '"Montserrat", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    overflow: 'hidden',
    background: '#050505',
  };

  return (
    <div style={shellBg}>
      {/* Plano full-bleed: fila de camisetas (arriba) + trofeo luminoso (abajo) — como la foto */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.9) 100%),` +
            `url(${zonaProBg}),` +
            'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80),' +
            'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover, cover, cover, cover',
          backgroundPosition: 'center, center top, center 10%, center bottom',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(1.1) contrast(1.1)',
          zIndex: 0,
        }}
      />
      {/* Brillo del trofeo — ancla inferior (foto) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-8%',
          transform: 'translateX(-50%)',
          width: '95vmin',
          height: '55vmin',
          background:
            'radial-gradient(ellipse at center, rgba(255,215,0,0.65) 0%, rgba(255,160,0,0.22) 40%, transparent 70%)',
          filter: 'blur(4px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 2,
        background: 'rgba(12, 12, 12, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRadius: 18,
        padding: '36px 28px 28px',
        width: '100%',
        maxWidth: 400,
        border: `1px solid ${gold}66`,
        boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
      }}>
        {/* Brand hero — ZONA PRO */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <h1 style={{
            color: gold,
            fontSize: 'clamp(2rem, 6vw, 2.6rem)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            lineHeight: 1.05,
          }}>
            ZONA PRO
          </h1>
          {!isLogin ? (
            <h2 style={{ color: gold, fontSize: 18, margin: 0, fontWeight: 700 }}>Crear cuenta</h2>
          ) : (
            <p style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: 13,
              margin: 0,
              lineHeight: 1.45,
              maxWidth: 300,
              marginInline: 'auto',
            }}>
              Solo usuarios registrados. Si aún no tienes cuenta, crea tu usuario.
            </p>
          )}
        </div>

        {error && (
          <div style={{
            background: 'rgba(244,67,54,0.2)',
            border: '1px solid #F44336',
            color: '#ffcdd2',
            padding: '12px',
            borderRadius: 10,
            marginBottom: 16,
            textAlign: 'center',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(76,175,80,0.2)',
            border: '1px solid #4CAF50',
            color: '#c8e6c9',
            padding: '12px',
            borderRadius: 10,
            marginBottom: 16,
            textAlign: 'center',
            fontSize: 13,
          }}>
            {success}
          </div>
        )}

        {isLogin ? (
          /* MODO LOGIN — layout ZONA PRO (foto producto) */
          <div>
            <label
              htmlFor="zona-pro-email"
              style={{
                display: 'block',
                color: gold,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.12em',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              GMAIL
            </label>
            <input
              id="zona-pro-email"
              type="email"
              name="email"
              placeholder="tuemail@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                marginBottom: 18,
                background: '#141414',
                border: `1.5px solid ${gold}`,
                borderRadius: 12,
                color: '#fff',
                fontSize: 15,
                outline: 'none',
              }}
            />

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                marginBottom: 12,
                background: gold,
                color: '#0a0a0a',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Conectando…' : 'Continuar con Google'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                color: gold,
                border: `1.5px solid ${gold}`,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Crear usuario
            </button>

            {/* Acceso email/password opcional (no en hero de la foto; colapsado) */}
            <details style={{ marginTop: 18, color: '#888' }}>
              <summary style={{ cursor: 'pointer', fontSize: 12, color: '#aaa' }}>
                Entrar con email y contraseña
              </summary>
              <form onSubmit={handleEmailLogin} style={{ marginTop: 12 }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    marginBottom: 10,
                    background: '#141414',
                    border: '1px solid #444',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 14,
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: gold,
                    border: `1px solid ${gold}88`,
                    borderRadius: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Iniciar sesión
                </button>
              </form>
            </details>
          </div>
        ) : (
          /* MODO REGISTRO - Solo cuando el usuario lo solicita */

          <form onSubmit={handleEmailRegister}>

            {/* Divisor */}
            <div style={{
              textAlign: 'center',
              color: '#999',
              margin: '20px 0',
              position: 'relative',
              fontSize: '14px'
            }}>
              <span style={{ background: '#222', padding: '0 15px', position: 'relative', zIndex: 1 }}>
                O completa el formulario
              </span>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: '#555'
              }} />
            </div>

            {/* REGISTRO COMPLETO: Todos los campos */}
              {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  👤 Información Personal
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre *"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required={!isLogin}
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido *"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required={!isLogin}
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="number"
                    name="edad"
                    placeholder="Edad *"
                    value={formData.edad}
                    onChange={handleInputChange}
                    required
                    min="16"
                    max="60"
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="number"
                    name="peso"
                    placeholder="Peso (kg) *"
                    value={formData.peso}
                    onChange={handleInputChange}
                    required
                    min="40"
                    max="150"
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <input
                  type="number"
                  name="altura"
                  placeholder="📏 Altura (cm) *"
                  value={formData.altura}
                  onChange={handleInputChange}
                  required
                  min="140"
                  max="220"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  Pierna dominante *
                </label>
                <select
                  name="piernaDominante"
                  value={formData.piernaDominante}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="Derecha">🦵 Derecha</option>
                  <option value="Izquierda">🦶 Izquierda</option>
                  <option value="Ambidiestra">🔁 Ambidiestra</option>
                </select>

                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono *"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <div style={{ color: '#999', fontSize: '13px', marginBottom: '8px', marginLeft: '4px' }}>
                  📍 La ubicación se detecta automáticamente por IP, puedes editarla.
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ciudad *"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '2',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="text"
                    name="pais"
                    placeholder="País *"
                    value={formData.pais}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Subir foto */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#FFD700', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    📷 Foto de perfil
                  </label>
                  <input
                    type="file"
                    name="foto"
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              {/* SECCIÓN 2: INFORMACIÓN FUTBOLÍSTICA */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  ⚽ Información Futbolística
                </h3>
                
                <select
                  name="posicion"
                  value={formData.posicion}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona tu posición *</option>
                  <optgroup label="⚽ Fútbol 11">
                    <option value="portero">🥅 Portero</option>
                    <option value="defensa-central">🛡️ Defensa Central</option>
                    <option value="lateral-derecho">➡️ Lateral Derecho</option>
                    <option value="lateral-izquierdo">⬅️ Lateral Izquierdo</option>
                    <option value="libero">🔓 Líbero</option>
                    <option value="mediocentro-defensivo">🔒 Mediocentro Defensivo</option>
                    <option value="mediocentro-central">⚖️ Mediocentro Central</option>
                    <option value="mediocentro-ofensivo">🎯 Mediocentro Ofensivo</option>
                    <option value="extremo-derecho">🏃‍♂️ Extremo Derecho</option>
                    <option value="extremo-izquierdo">🏃‍♂️ Extremo Izquierdo</option>
                    <option value="enganche">✨ Enganche</option>
                    <option value="delantero-centro">⚽ Delantero Centro</option>
                    <option value="segundo-delantero">🔥 Segundo Delantero</option>
                    <option value="falso-nueve">🎭 Falso 9</option>
                  </optgroup>
                  <optgroup label="🏐 Futsal">
                    <option value="portero-futsal">🥅 Portero</option>
                    <option value="ala-derecha">➡️ Ala Derecha</option>
                    <option value="ala-izquierda">⬅️ Ala Izquierda</option>
                    <option value="pivote">🎯 Pivote</option>
                    <option value="cierre">🔒 Cierre</option>
                  </optgroup>
                  <optgroup label="🔄 Flexible">
                    <option value="multiple">🔄 Múltiples posiciones / Polivalente</option>
                  </optgroup>
                </select>

                <select
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Nivel de experiencia *</option>
                  <option value="principiante">🌱 Principiante (0-1 años)</option>
                  <option value="amateur">⚽ Amateur (2-5 años)</option>
                  <option value="intermedio">🏆 Intermedio (5-10 años)</option>
                  <option value="avanzado">🥇 Avanzado (10+ años)</option>
                  <option value="profesional">👑 Profesional/Ex-profesional</option>
                </select>

                <select
                  name="vecesJuegaPorSemana"
                  value={formData.vecesJuegaPorSemana}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">¿Cuántas veces juegas por semana? *</option>
                  <option value="1">1 vez por semana</option>
                  <option value="2">2 veces por semana</option>
                  <option value="3">3 veces por semana</option>
                  <option value="4">4 veces por semana</option>
                  <option value="5">5 veces por semana</option>
                  <option value="6">6 veces por semana</option>
                  <option value="7">7 veces por semana</option>
                  <option value="mas-7">Más de 7 veces por semana</option>
                </select>

                <input
                  type="text"
                  name="equipoFavorito"
                  placeholder="Equipo favorito (opcional)"
                  value={formData.equipoFavorito}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <select
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Disponibilidad de horarios *</option>
                  <option value="mananas">🌅 Mañanas (6:00 - 12:00)</option>
                  <option value="tardes">🌞 Tardes (12:00 - 18:00)</option>
                  <option value="noches">🌙 Noches (18:00 - 23:00)</option>
                  <option value="fines_semana">📅 Solo fines de semana</option>
                  <option value="flexible">🔄 Horario flexible</option>
                </select>
              </div>

              {/* SECCIÓN 3: CREDENCIALES */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  🔐 Credenciales de acceso
                </h3>

                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña *"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña *"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#999' : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#222',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '15px',
                  transition: 'all 0.3s ease'
                }}
              >
                Crear Cuenta
              </button>

              {/* Separador O */}
              <div style={{ textAlign: 'center', marginBottom: '15px', color: '#999', fontSize: '14px' }}>
                ─────  O continúa con  ─────
              </div>

              {/* Botón Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#4285F4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '15px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
              
              {/* Información adicional para registro */}
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid #4CAF50',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: '#4CAF50', 
                  fontSize: '14px', 
                  margin: '0',
                  fontWeight: 'bold'
                }}>
                  ✅ Perfil completo • Mejor matchmaking • Datos seguros
                </p>
              </div>
              

              {/* Link para volver a login */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFD700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  ¿Ya tienes cuenta? <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Inicia sesión</span>
                </button>
              </div>
            </form>
          )}

          {loading && (
            <div style={{
              marginTop: '20px',
              textAlign: 'center',
              color: '#FFD700',
              fontSize: '14px'
            }}>
              <div style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid #FFD700',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <p style={{ margin: '10px 0 0 0' }}>Procesando...</p>
            </div>
          )}
        </div>
      </div>
    );
};

export default AuthPageUnificada;