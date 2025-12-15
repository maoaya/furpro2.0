import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
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
    setSuccess('Google auth...');

    try {
      console.log('🔐 Iniciando autenticación con Google...');
      
      // Si estamos en la ruta específica de Google, ir directo al OAuth
      if (registroTipo === 'google') {
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
      } else {
        // Si no, navegar a la ruta específica
        navigate('/registro-google');
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#222',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        border: '2px solid #FFD700',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#FFD700', 
            fontSize: '32px', 
            fontWeight: 'bold',
            margin: '0 0 10px 0'
          }}>
            ⚽ FutPro
          </h1>
          <h2 style={{ 
            color: '#FFD700', 
            fontSize: '24px',
            margin: '0 0 10px 0'
          }}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: '#F44336',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#4CAF50',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* Formulario de LOGIN/REGISTRO - Siempre visible */}
        {isLogin ? (
          /* MODO LOGIN */
          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '16px',
                background: '#333',
                border: '1px solid #555',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '12px',
                background: '#333',
                border: '1px solid #555',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            />

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setError('Funcionalidad próximamente');
                }}
                style={{ 
                  color: '#FFD700', 
                  fontSize: '14px', 
                  textDecoration: 'none' 
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
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
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '20px'
              }}
            >
              {loading ? '⏳ Iniciando sesión...' : '🔐 Iniciar Sesión'}
            </button>

            {/* Divisor */}
            <div style={{
              textAlign: 'center',
              color: '#999',
              margin: '20px 0',
              position: 'relative',
              fontSize: '14px'
            }}>
              <span style={{ background: '#222', padding: '0 15px', position: 'relative', zIndex: 1 }}>
                O continúa con
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

            {/* Botones OAuth */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                background: '#db4437',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              🔐 Google
            </button>

            <button
              type="button"
              onClick={handleFacebookAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3b5998',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}
            >
              📘 Facebook
            </button>

            {/* Link a registro */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
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
                ¿No tienes cuenta? <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Crea tu cuenta</span>
              </button>
            </div>
          </form>
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
                {loading ? '⏳ Procesando...' : '🏆 Crear mi perfil FutPro completo'}
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
              

              {/* Links de toggle */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {isLogin && (
                  <>
                    <button
                      type="button"
                      onClick={() => alert('Recuperación de contraseña: funcionalidad próximamente')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#FFA500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginBottom: '10px',
                        display: 'block',
                        width: '100%'
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/seleccionar-categoria')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#FFD700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ¿No tienes cuenta? <span style={{ textDecoration: 'underline' }}>Crea tu cuenta</span>
                    </button>
                  </>
                )}
                {!isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setShowEmailForm(false);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FFD700',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ¿Ya tienes cuenta? <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Inicia sesión aquí</span>
                  </button>
                )}
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