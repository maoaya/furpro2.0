import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import FutproLogo from '../components/FutproLogo.jsx';

const gold = '#FFD700';
const black = '#222';

export default function RegistroFuncionando() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      // Registro directo en Supabase AUTH - SIN CAPTCHA
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.toLowerCase().trim(),
        password: form.password,
        options: {
          data: {
            nombre: form.nombre.trim(),
            full_name: form.nombre.trim()
          }
        }
      });

      if (authError) {
        console.error('❌ Error en registro:', authError);
        
        if (authError.message?.includes('already registered')) {
          setError('Este email ya está registrado. Ve al login para iniciar sesión.');
          setTimeout(() => navigate('/'), 3000);
          return;
        } else {
          setError(`Error: ${authError.message}`);
        }
        setLoading(false);
        return;
      }

      console.log('✅ Usuario registrado:', authData.user?.email);
      setSuccess('¡Registro exitoso! Redirigiendo...');

      // Crear perfil básico en tabla usuarios
      if (authData.user) {
        const perfilData = {
          id: authData.user.id,
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

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 2000);

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