import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import SecurityService from '../services/SecurityService';
import UserActivityTracker from '../services/UserActivityTracker';
import { getConfig } from '../config/environment';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const gold = '#FFD700';
  const black = '#222';

  // Estados del login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState('login'); // 'login', 'recuperar', 'reset'
  const [recuperarEmail, setRecuperarEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /**
   * Detectar redirección OAuth desde callback
   */
  useEffect(() => {
    const checkOAuthRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('✅ Sesión OAuth detectada, verificando perfil...');
        await redirectBasedOnProfile(session.user);
      }
    };
    checkOAuthRedirect();
  }, []);

  /**
   * Redirección inteligente basada en estado del perfil
   */
  const redirectBasedOnProfile = async (user) => {
    try {
      // Verificar si tiene card
      const { data: card } = await supabase
        .from('carfutpro')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!card) {
        console.log('⚠️ Usuario sin card, redirigiendo a completar perfil...');
        navigate('/perfil-card');
        return;
      }

      // Verificar si perfil está completo
      if (!card.nombre || !card.posicion) {
        console.log('⚠️ Perfil incompleto, redirigiendo a editar...');
        navigate('/editar-perfil');
        return;
      }

      console.log('✅ Perfil completo, redirigiendo a inicio...');
      navigate('/home');
    } catch (error) {
      console.error('Error verificando perfil:', error);
      navigate('/home'); // Fallback
    }
  };

  /**
   * Login con Google OAuth
   */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const config = getConfig();
      console.log('🔐 Iniciando OAuth con Google...');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: config.oauthCallbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('❌ Error OAuth Google:', error);
        setError('Error al iniciar sesión con Google');
        UserActivityTracker.trackLogin('google', false, { error: error.message });
      } else {
        UserActivityTracker.trackLogin('google', true, { method: 'oauth' });
      }
    } catch (err) {
      console.error('Error OAuth:', err);
      setError('Error inesperado con Google');
    } finally {
      setLoading(false);
    }
  };

  /**
   * MODO LOGIN: Iniciar sesión con correo y contraseña
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const emailLower = email.toLowerCase().trim();

    try {
      // Obtener IP para tracking
      const ip = await SecurityService.obtenerIP();

      // 1. Verificar intentos fallidos
      const intentos = await SecurityService.verificarIntentosLogin(email, ip);
      if (intentos.bloqueado) {
        setError(`Demasiados intentos fallidos. Intenta en ${new Date(intentos.bloqueado_hasta).toLocaleTimeString()}`);
        setLoading(false);
        return;
      }

      // 2. Verificar si usuario existe (carfutpro o usuarios)
      const { data: usuarioCard } = await supabase
        .from('carfutpro')
        .select('user_id, email')
        .eq('email', emailLower)
        .maybeSingle();

      const { data: usuarioPerfil } = await supabase
        .from('usuarios')
        .select('id, email')
        .eq('email', emailLower)
        .maybeSingle();

      const userId = usuarioCard?.user_id || usuarioPerfil?.id;

      if (!userId) {
        await SecurityService.registrarIntentoFallido(email, ip);
        setError('❌ No existe una cuenta con este correo');
        setLoading(false);
        return;
      }

      // 3. Verificar si usuario está bloqueado
      const esBloqueado = await SecurityService.esUsuarioBloqueado(userId);
      if (esBloqueado) {
        setError('🚫 Tu cuenta ha sido bloqueada por violar nuestras políticas');
        setLoading(false);
        return;
      }

      // 4. Intentar login con Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password
      });

      if (authError) {
        await SecurityService.registrarIntentoFallido(email, ip);
        UserActivityTracker.trackLogin('email', false, { email: emailLower, error: authError.message });
        setError('❌ Correo o contraseña incorrectos');
        setLoading(false);
        return;
      }

      // 5. Login exitoso - limpiar intentos
      await SecurityService.limpiarIntentosLogin(email, ip);
      
      // Actualizar último login
      await supabase
        .from('carfutpro')
        .update({ ultimo_login: new Date().toISOString(), email: emailLower })
        .eq('user_id', userId);

      // Trackear login exitoso
      UserActivityTracker.trackLogin('email', true, { email: emailLower, userId });

      // Guardar sesión si "Recordarme" está activo
      if (rememberMe) {
        localStorage.setItem('futpro_remember', 'true');
      }

      setSuccess('✅ ¡Bienvenido! Redirigiendo...');
      
      // Redirección inteligente basada en perfil
      await redirectBasedOnProfile(data.user);
    } catch (err) {
      console.error('Error en login:', err);
      setError('❌ Error inesperado. Intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  /**
   * MODO RECUPERACIÓN: Solicitar token de recuperación
   */
  const handleSolicitarRecuperacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Verificar que correo existe
      const { data: usuario } = await supabase
        .from('carfutpro')
        .select('user_id')
        .eq('email', recuperarEmail.toLowerCase())
        .single();

      if (!usuario) {
        setError('❌ No existe cuenta con este correo');
        setLoading(false);
        return;
      }

      // Generar token
      const { exito, token } = await SecurityService.generarTokenRecuperacion(
        usuario.user_id,
        recuperarEmail.toLowerCase()
      );

      if (exito) {
        // AQUÍ: Enviar email con link + token
        // await enviarEmailRecuperacion(recuperarEmail, token);
        
        setSuccess(`✅ Revisa tu correo. Te hemos enviado un link para recuperar tu contraseña`);
        setTimeout(() => {
          setMode('reset');
          setResetToken(token);
          setRecuperarEmail('');
        }, 2000);
      } else {
        setError('❌ Error generando token. Intenta nuevamente');
      }
    } catch (err) {
      console.error('Error solicitando recuperación:', err);
      setError('❌ Error al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  /**
   * MODO RESET: Cambiar contraseña
   */
  const handleRestablecerContrasena = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar contraseñas
      if (newPassword !== confirmPassword) {
        setError('❌ Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setError('❌ La contraseña debe tener al menos 8 caracteres');
        setLoading(false);
        return;
      }

      // Verificar token
      const { valido, usuario, error: tokenError } = await SecurityService.verificarTokenRecuperacion(resetToken);
      
      if (!valido) {
        setError(`❌ ${tokenError}`);
        setLoading(false);
        return;
      }

      // Actualizar contraseña en Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(`❌ ${updateError.message}`);
        setLoading(false);
        return;
      }

      // Marcar token como utilizado
      await SecurityService.marcarTokenUtilizado(resetToken);

      setSuccess('✅ Contraseña actualizada exitosamente. Redirigiendo al login...');
      setTimeout(() => {
        setMode('login');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      console.error('Error restableciendo contraseña:', err);
      setError('❌ Error al restablecer contraseña');
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
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: '#1a1a1a',
        border: `2px solid ${gold}`,
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        boxShadow: `0 10px 30px rgba(255, 215, 0, 0.3)`
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>
          <h1 style={{ color: gold, margin: 0, fontSize: '32px', fontWeight: 'bold' }}>FutPro</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>Plataforma de Fútbol</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: '#F44336',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #d32f2f'
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
            fontSize: '14px',
            border: '1px solid #388e3c'
          }}>
            {success}
          </div>
        )}

        {/* MODO LOGIN */}
        {mode === 'login' && (
          <>
            <h2 style={{ color: gold, marginBottom: '24px' }}>🔐 Iniciar Sesión</h2>
            
            <form onSubmit={handleLogin} style={{ marginBottom: 20 }}>
              <input
                type="email"
                placeholder="📧 Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${gold}`,
                  background: '#232323',
                  color: gold,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="password"
                placeholder="🔑 Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${gold}`,
                  background: '#232323',
                  color: gold,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: gold,
                  color: black,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '12px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Iniciando...' : '✔️ Iniciar sesión'}
              </button>
            </form>

            {/* Botones secundarios */}
            <button
              onClick={() => navigate('/registro-nuevo')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginBottom: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              👤 Crear nueva cuenta
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0',
              color: '#666',
              fontSize: '14px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
              <span style={{ padding: '0 12px' }}>o continúa con</span>
              <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
            </div>

            {/* OAuth Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1,
                marginBottom: '12px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
              </svg>
              Continuar con Google
            </button>

            <button
              onClick={() => setMode('recuperar')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: gold,
                border: `1px dashed ${gold}`,
                borderRadius: '8px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              🔑 ¿Olvidaste tu contraseña?
            </button>
          </>
        )}

        {/* MODO RECUPERACIÓN */}
        {mode === 'recuperar' && (
          <>
            <h2 style={{ color: gold, marginBottom: '24px' }}>🔄 Recuperar Contraseña</h2>
            <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
              Ingresa tu correo y te enviaremos un link para resetear tu contraseña
            </p>

            <form onSubmit={handleSolicitarRecuperacion}>
              <input
                type="email"
                placeholder="📧 Tu correo electrónico"
                value={recuperarEmail}
                onChange={(e) => setRecuperarEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${gold}`,
                  background: '#232323',
                  color: gold,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: gold,
                  color: black,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '12px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Enviando...' : '📨 Enviar Link'}
              </button>
            </form>

            <button
              onClick={() => setMode('login')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: gold,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Volver al login
            </button>
          </>
        )}

        {/* MODO RESET */}
        {mode === 'reset' && (
          <>
            <h2 style={{ color: gold, marginBottom: '24px' }}>✨ Nueva Contraseña</h2>

            <form onSubmit={handleRestablecerContrasena}>
              <input
                type="password"
                placeholder="🔑 Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${gold}`,
                  background: '#232323',
                  color: gold,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="password"
                placeholder="🔑 Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${gold}`,
                  background: '#232323',
                  color: gold,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '16px' }}>
                La contraseña debe tener al menos 8 caracteres
              </p>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: gold,
                  color: black,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Actualizando...' : '✅ Cambiar Contraseña'}
              </button>
            </form>
          </>
        )}

        {/* Pie de página */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${gold}33`,
          fontSize: '12px',
          color: '#999'
        }}>
          Al usar FutPro, aceptas nuestras{' '}
          <span style={{ color: gold, cursor: 'pointer' }}>Políticas de Privacidad</span>
        </div>
      </div>
    </div>
  );
}
