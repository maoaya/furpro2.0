import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';
import { handleSuccessfulAuth } from '../utils/navigationUtils.js';
import { robustSignUp, robustSignIn, createUserProfile } from '../utils/authUtils.js';

const AuthPageUnificada = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: ''
  });

  // Si el usuario ya está autenticado, redirigir a home
  useEffect(() => {
    if (user) {
      console.log('✅ Usuario ya autenticado, redirigiendo a home...');
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  // Función para navegar a HomePage después del éxito
  const navigateToHome = () => {
    console.log('🎉 Autenticación exitosa! Navegando a HomePage...');
    
    // Marcar autenticación completa
    localStorage.setItem('authCompleted', 'true');
    localStorage.setItem('loginSuccess', 'true');
    
    // Múltiples intentos de navegación para asegurar éxito
    setTimeout(() => {
      try {
        navigate('/home', { replace: true });
      } catch (error) {
        console.log('🔄 Fallback: navegando con window.location');
        window.location.href = '/home';
      }
    }, 500);
    
    // Fallback adicional
    setTimeout(() => {
      if (window.location.pathname !== '/home') {
        window.location.href = '/home';
      }
    }, 2000);
  };

  // REGISTRO CON EMAIL Y PASSWORD
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.email || !formData.password || !formData.nombre) {
        setError('Por favor completa todos los campos obligatorios');
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

      console.log('📝 Registrando usuario con email...');
      setSuccess('Creando cuenta...');

      // Usar función robusta de signup que maneja errores 502
      const signupResult = await robustSignUp(
        formData.email,
        formData.password,
        {
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim()
        }
      );

      if (!signupResult.success) {
        console.error('❌ Error en signup robusto:', signupResult.error);
        setError(`Error en registro: ${signupResult.error}`);
        return;
      }

      console.log(`✅ Signup exitoso con método: ${signupResult.method}`);
      
      if (signupResult.message) {
        setSuccess(signupResult.message);
      } else {
        setSuccess('Cuenta creada. Configurando perfil...');
      }

      const userData = signupResult.data.user;

      // Crear perfil usando función robusta
      if (signupResult.method === 'signup' || signupResult.method === 'simple-signup') {
        const profileResult = await createUserProfile({
          id: userData.id,
          email: userData.email,
          nombre: formData.nombre.trim(),
          apellido: formData.apellido?.trim() || ''
        });

        if (!profileResult.success) {
          console.warn('⚠️ Error creando perfil:', profileResult.error);
          // Continuar aunque falle el perfil
        } else {
          console.log('✅ Perfil creado exitosamente');
        }
      }

      // Preparar datos del usuario para navegación
      const userDataForNav = {
        id: userData.id,
        email: userData.email,
        nombre: formData.nombre,
        apellido: formData.apellido
      };

      console.log('✅ Registro completado, iniciando navegación...');
      setSuccess('¡Registro exitoso! Bienvenido a FutPro...');
      
      // Guardar datos del usuario
      localStorage.setItem('userRegistrado', JSON.stringify({
        id: userData.id,
        email: userData.email,
        nombre: formData.nombre,
        registrado: true,
        timestamp: new Date().toISOString()
      }));

      // Usar función de navegación robusta
      handleSuccessfulAuth(userDataForNav, navigate);

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

      console.log('✅ Login exitoso:', loginResult.data.user?.email);
      setSuccess('¡Login exitoso! Bienvenido de vuelta...');
      
      const userData = {
        id: loginResult.data.user.id,
        email: loginResult.data.user.email,
        nombre: loginResult.data.user.user_metadata?.nombre || 'Usuario',
        apellido: loginResult.data.user.user_metadata?.apellido || ''
      };

      // Usar función de navegación robusta
      handleSuccessfulAuth(userData, navigate);

    } catch (error) {
      console.error('💥 Error inesperado en login:', error);
      setError(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON GOOGLE
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    setSuccess('Google auth...');

    try {
      console.log('🔐 Iniciando autenticación con Google...');
      
      const config = getConfig();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${config.baseUrl}/auth/callback`,
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
        // La navegación la manejará el callback
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
      
      const config = getConfig();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${config.baseUrl}/auth/callback`
        }
      });

      if (error) {
        console.error('❌ Error OAuth Facebook:', error);
        setError(`Error Facebook: ${error.message}`);
      } else {
        console.log('🔄 Redirigiendo a Facebook...');
        setSuccess('Redirigiendo a Facebook...');
        // La navegación la manejará el callback
      }
    } catch (error) {
      console.error('💥 Error inesperado Facebook:', error);
      setError(`Error Facebook: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            margin: '0 0 20px 0'
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

        {/* Botones OAuth */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: '#db4437',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            🔐 {isLogin ? 'Entrar' : 'Registrarse'} con Google
          </button>

          <button
            onClick={handleFacebookAuth}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3b5998',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            📘 {isLogin ? 'Entrar' : 'Registrarse'} con Facebook
          </button>
        </div>

        {/* Divisor */}
        <div style={{
          textAlign: 'center',
          color: '#FFD700',
          margin: '20px 0',
          position: 'relative'
        }}>
          <span style={{
            background: '#222',
            padding: '0 15px',
            fontSize: '14px'
          }}>
            o continúa con email
          </span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            background: '#FFD700',
            zIndex: '-1'
          }} />
        </div>

        {/* Formulario */}
        <form onSubmit={isLogin ? handleEmailLogin : handleEmailRegister}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre *"
                value={formData.nombre}
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
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
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
            </>
          )}

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

          {!isLogin && (
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
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#FFD700',
              color: '#222',
              border: 'none',
              borderRadius: '6px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px'
            }}
          >
            {loading ? '⏳ Procesando...' : 
             isLogin ? '🔐 Iniciar Sesión' : '📝 Crear Cuenta'}
          </button>
        </form>

        {/* Toggle entre login y registro */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                nombre: '',
                apellido: ''
              });
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD700',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 
              '¿No tienes cuenta? Regístrate aquí' : 
              '¿Ya tienes cuenta? Inicia sesión aquí'
            }
          </button>
        </div>

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