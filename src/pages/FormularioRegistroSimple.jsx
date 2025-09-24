import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import FutproLogo from '../components/FutproLogo.jsx';

const gold = '#FFD700';
const black = '#222';
const darkCard = '#1a1a1a';

export default function FormularioRegistroSimple() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    edad: '',
    posicion: 'delantero',
    rol: 'jugador',
    terminos: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 INICIANDO REGISTRO SIMPLE:', formData);
    
    // Validaciones
    if (!formData.nombre || !formData.email || !formData.password) {
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
    
    if (!formData.terminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Registro con Supabase Auth
      console.log('📧 Registrando usuario en Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            edad: formData.edad,
            posicion: formData.posicion,
            rol: formData.rol
          }
        }
      });

      if (authError) {
        console.error('❌ Error en Auth:', authError);
        setError(`Error de registro: ${authError.message}`);
        setLoading(false);
        return;
      }

      // Crear perfil en tabla usuarios
      console.log('👤 Creando perfil en base de datos...');
      const { data: perfilData, error: perfilError } = await supabase
        .from('usuarios')
        .insert([{
          id: authData.user.id,
          nombre: formData.nombre,
          email: formData.email,
          edad: parseInt(formData.edad) || null,
          posicion: formData.posicion,
          rol: formData.rol,
          created_at: new Date().toISOString()
        }]);

      if (perfilError) {
        console.error('❌ Error creando perfil:', perfilError);
        // No es crítico, el usuario ya está registrado
        console.log('⚠️ Usuario registrado pero sin perfil completo');
      }

      setSuccess('¡Registro exitoso! Revisa tu email para verificar tu cuenta.');
      console.log('✅ REGISTRO COMPLETADO');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      setError('Error inesperado. Por favor intenta nuevamente.');
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
        maxWidth: '500px',
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5)`
      }}>
        {/* Logo y título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FutproLogo size={80} />
          <h1 style={{ color: gold, marginTop: '20px', marginBottom: '10px' }}>
            Registro FutPro
          </h1>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            Únete a la comunidad de fútbol más grande
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #ff4444',
            color: '#ff8888',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            color: '#88ffaa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
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
              value={formData.email}
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

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                Edad
              </label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
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
                placeholder="25"
                min="13"
                max="60"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                Posición
              </label>
              <select
                name="posicion"
                value={formData.posicion}
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
                <option value="portero">Portero</option>
                <option value="defensa">Defensa</option>
                <option value="mediocampista">Mediocampista</option>
                <option value="delantero">Delantero</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
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
              value={formData.confirmPassword}
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

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#ccc',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="terminos"
                checked={formData.terminos}
                onChange={handleChange}
                style={{ marginRight: '10px' }}
              />
              Acepto los términos y condiciones de uso
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#666' : gold,
              color: black,
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

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