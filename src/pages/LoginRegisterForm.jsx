// ...existing code...
import React, { useState, useEffect, useContext } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { getConfig } from '../config/environment.js';
const gold = '#FFD700';
const black = '#222';

export default function LoginRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // Usar el AuthContext para OAuth
  const { loginWithGoogle, loginWithFacebook } = useContext(AuthContext);
  
  // Obtener configuración dinámica
  const config = getConfig();

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        setLoading(false);

        // Redirigir después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else if (event === 'SIGNED_OUT') {
        setError('Sesión cerrada');
        setTimeout(() => setError(null), 3000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLoginSocial = async (provider) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log(`🚀 Iniciando ${provider} OAuth en LoginRegisterForm`);
      console.log('🌍 Configuración detectada:', config);
      
      let result;
      if (provider === 'google') {
        result = await loginWithGoogle();
      } else if (provider === 'facebook') {
        result = await loginWithFacebook();
      } else {
        throw new Error(`Proveedor ${provider} no soportado`);
      }

      if (result.error) {
        setError(`Error con ${provider}: ${result.error}`);
        setLoading(false);
      } else if (result.redirecting) {
        setSuccess(`Redirigiendo a ${provider}...`);
        // La redirección se maneja automáticamente por Supabase
      }
    } catch (e) {
      console.error(`💥 Error inesperado con ${provider}:`, e);
      setError(`Error inesperado con ${provider}: ${e.message}`);
      setLoading(false);
    }
  };

  const handleEmailForm = () => {
    setShowEmailForm(true);
    setIsRegister(false);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess('¡Ingreso exitoso! Redirigiendo...');
        // La redirección se maneja en el useEffect con onAuthStateChange
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirm: true
          }
        }
      });
      if (error) {
        console.log('🔍 Error de registro detectado:', error.message);
        
        // ACCIÓN EFECTIVA: Detectar el mensaje EXACTO del error
        const errorMsg = error.message;
        if (errorMsg === 'A user with this email address has already been registered' ||
            errorMsg.includes('already been registered') || 
            errorMsg.includes('user already registered') ||
            errorMsg.includes('already exists') ||
            errorMsg.includes('already registered')) {
          
          console.log('✅ DETECTADO: Usuario ya registrado - CAMBIANDO A LOGIN AUTOMÁTICAMENTE');
          
          // CAMBIO INMEDIATO A LOGIN
          setIsRegister(false);
          setError(null);
          setLoading(false);
          
          // MENSAJE CLARO Y DIRECTO
          setSuccess('✅ Email detectado. Ahora puedes ingresar con tu contraseña.');
          
          // LIMPIAR MENSAJE DESPUÉS DE 4 SEGUNDOS
          setTimeout(() => {
            setSuccess(null);
          }, 4000);
          
        } else {
          console.log('❌ Error de registro no manejado:', error.message);
          setError(error.message);
          setLoading(false);
        }
        setLoading(false);
      } else {
        setSuccess('¡Registro exitoso! Revisa tu email para confirmar la cuenta. Redirigiendo...');
        // Para registro, esperamos confirmación de email, pero redirigimos a home
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', minWidth: 320, textAlign: 'center' }}>
        <img src="/logo192.png" alt="FutPro Logo" style={{ width: 80, marginBottom: 24 }} />
        <h1>Acceso FutPro</h1>
        <button
          onClick={() => handleLoginSocial('google')}
          disabled={loading}
          style={{ width: '100%', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <img src="/google-logo.png" alt="Google" style={{ width: 24, height: 24 }} />
          Ingresar con Google
        </button>
        <button
          onClick={() => handleLoginSocial('facebook')}
          disabled={loading}
          style={{ width: '100%', background: '#1877f3', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <img src="/facebook-logo.png" alt="Facebook" style={{ width: 24, height: 24 }} />
          Ingresar con Facebook
        </button>
        <button
          onClick={handleEmailForm}
          disabled={loading}
          style={{ width: '100%', background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'block' }}
        >
          Ingresar con Email
        </button>
        <button
          onClick={() => navigate('/registro')}
          disabled={loading}
          style={{ width: '100%', background: gold, color: black, border: 'none', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16, display: 'block' }}
        >
          📝 Crear Cuenta Completa
        </button>
        {showEmailForm && (
          <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ marginBottom: 16 }}>
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              type="email"
              autoComplete="email"
            />
            <input
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              type="password"
              autoComplete="current-password"
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{ flex: 1, background: black, color: gold, border: '2px solid ' + gold, borderRadius: 8, padding: '10px 0', fontWeight: 'bold', fontSize: 16 }}
              >
                {isRegister ? 'Registrarse' : 'Ingresar'}
              </button>
              <button
                type="button"
                disabled={loading}
                style={{ flex: 1, background: '#fff', color: black, border: '1px solid #ccc', borderRadius: 8, padding: '10px 0', fontWeight: 'bold', fontSize: 16 }}
                onClick={() => setIsRegister(r => !r)}
              >
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              </button>
            </div>
          </form>
        )}
        <a href="/recuperar" style={{ color: black, textDecoration: 'underline', display: 'block', marginBottom: 16 }}>¿Olvidaste tu contraseña?</a>
        {loading && <div style={{ color: gold }}>Procesando...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green', fontWeight: 'bold' }}>{success}</div>}
      </div>
    </div>
  );
}
// ...existing code...
