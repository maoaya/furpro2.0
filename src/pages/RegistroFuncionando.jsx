import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import FutproLogo from '../components/FutproLogo.jsx';
import { getConfig } from '../config/environment';
import { signUpWithAutoConfirm } from '../utils/autoConfirmSignup';

const gold = '#FFD700';
const black = '#222';

export default function RegistroFuncionando() {
  const navigate = useNavigate();
  const config = getConfig();
  
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hideAutoConfirmBanner, setHideAutoConfirmBanner] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('hideAutoConfirmBanner') === 'true' : false
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Asegurar redirección post-login consistente
      localStorage.setItem('postLoginRedirect', '/home');
      localStorage.setItem('postLoginRedirectReason', 'signup-email');

      // Validaciones básicas
      if (!form.nombre || !form.email || !form.password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (form.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      console.log('🚀 Iniciando registro...');
      setSuccess('Registrando usuario...');

      // Usar utilidad de auto-confirm para manejo inteligente
      const registroData = {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        options: {
          data: {
            nombre: form.nombre.trim(),
            full_name: form.nombre.trim()
          }
        }
      };

      const result = await signUpWithAutoConfirm(registroData);

      if (!result.success) {
        console.error('❌ Error en registro:', result.error);
        
        if (result.error.message?.includes('already registered')) {
          setError('Este email ya está registrado. Ve al login para iniciar sesión.');
          setTimeout(() => navigate('/'), 3000);
          return;
        } else {
          setError(`Error: ${result.error.message}`);
        }
        setLoading(false);
        return;
      }

      console.log('✅ Usuario registrado exitosamente');
      setSuccess(result.message || '¡Registro exitoso! Redirigiendo...');

      // Crear perfil básico en tabla usuarios si tenemos el usuario
      if (result.user) {
        const perfilData = {
          id: result.user.id,
          email: form.email.toLowerCase().trim(),
          nombre: form.nombre.trim(),
          created_at: new Date().toISOString(),
          rol: 'usuario',
          tipo_usuario: 'jugador'
        };

        const { error: perfilError } = await supabase
          .from('usuarios')
          .insert([perfilData]);

        if (perfilError) {
          console.error('⚠️ Error creando perfil:', perfilError);
          // No bloqueamos el flujo por esto
        } else {
          console.log('✅ Perfil creado exitosamente');
        }
      }

      // Guardar metadatos útiles
      if (result.user?.email) {
        localStorage.setItem('lastAuthUserEmail', result.user.email);
      }

      // Auto-confirm está activo, ir directo a /home sin importar si hay sesión
      if (config?.autoConfirmSignup) {
        console.log('🏠 Auto-confirm activo: redirigiendo a /home');
          // Marcar que el registro está completo para que ProtectedRoute no redirija inmediatamente
          localStorage.setItem('registroCompleto', 'true');
          localStorage.setItem('authCompleted', 'true');
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1500);
      } else {
        // Comportamiento normal: ir a login si no hay sesión
        if (result.session) {
          setTimeout(() => {
            navigate('/home', { replace: true });
          }, 1500);
        } else {
          setSuccess('Registro exitoso. Por favor confirma tu email antes de iniciar sesión.');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      }

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      setError(`Error inesperado: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#2a2a2a',
        border: `3px solid ${gold}`,
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: `0 0 30px ${gold}40`
      }}>
        {/* Banner QA: auto-confirm activo */}
        {config?.autoConfirmSignup && !hideAutoConfirmBanner && (
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
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FutproLogo />
          <h1 style={{
            color: gold,
            fontSize: '28px',
            margin: '20px 0 10px 0',
            fontWeight: 'bold'
          }}>
            Crear Cuenta
          </h1>
          <p style={{ color: '#ccc', margin: 0 }}>
            Únete a la comunidad futbolística
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: gold, 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ej: Juan Pérez"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid #444',
                background: '#333',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: gold, 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="tu.email@ejemplo.com"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid #444',
                background: '#333',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              color: gold, 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Mínimo 6 caracteres"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid #444',
                background: '#333',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              color: gold, 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Repite tu contraseña"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid #444',
                background: '#333',
                color: '#fff',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? '#666' : gold,
              color: black,
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Registrando...' : '🚀 Crear Cuenta'}
          </button>
        </form>

        {error && (
          <div style={{
            background: '#ff444430',
            border: '2px solid #ff4444',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '20px',
            color: '#ff4444',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#44ff4430',
            border: '2px solid #44ff44',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '20px',
            color: '#44ff44',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            ✅ {success}
          </div>
        )}

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #444'
        }}>
          <p style={{ color: '#ccc', margin: '0 0 15px 0' }}>
            ¿Ya tienes cuenta?
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={loading}
            style={{
              background: 'transparent',
              color: gold,
              border: `2px solid ${gold}`,
              borderRadius: '10px',
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Ir al Login
          </button>
        </div>
      </div>
    </div>
  );
}