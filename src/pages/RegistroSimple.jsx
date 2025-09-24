import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function RegistroSimple() {
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
    posicion: '',
    rol: 'usuario'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario escriba
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 INICIANDO REGISTRO SIMPLE:', formData);
    
    // Validaciones básicas
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

    setLoading(true);
    setError('');

    try {
      console.log('📡 Registrando en Supabase Auth...');
      
      // Registro en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre
          }
        }
      });

      if (authError) {
        console.error('❌ Error en Auth:', authError);
        setError(`Error de registro: ${authError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Usuario creado en Auth:', authData.user?.id);

      // Guardar en tabla usuarios
      if (authData.user) {
        console.log('💾 Guardando en tabla usuarios...');
        
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: authData.user.id,
              nombre: formData.nombre,
              email: formData.email,
              edad: parseInt(formData.edad) || null,
              posicion_favorita: formData.posicion || null,
              rol: formData.rol,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (dbError) {
          console.error('❌ Error en BD:', dbError);
          setError(`Error al guardar perfil: ${dbError.message}`);
          setLoading(false);
          return;
        }

        console.log('✅ Usuario guardado en BD correctamente');
        setSuccess('¡Registro exitoso! Redirigiendo...');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/validar-usuario');
        }, 2000);
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
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      color: '#FFD700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#222',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)',
        border: '2px solid #FFD700',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ⚽ FutPro
          </h1>
          <p style={{ color: '#ccc', margin: 0 }}>Registro Rápido</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #555',
                background: '#333',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #555',
                background: '#333',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #555',
                  background: '#333',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Confirmar *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #555',
                  background: '#333',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Edad (opcional)
              </label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="18"
                min="12"
                max="100"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #555',
                  background: '#333',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Posición (opcional)
              </label>
              <select
                name="posicion"
                value={formData.posicion}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #555',
                  background: '#333',
                  color: '#fff',
                  fontSize: '16px'
                }}
              >
                <option value="">Selecciona</option>
                <option value="portero">Portero</option>
                <option value="defensa">Defensa</option>
                <option value="mediocampista">Mediocampista</option>
                <option value="delantero">Delantero</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#ff4444',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#44ff44',
              color: '#000',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#666' : 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: '#000',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ Registrando...' : '🚀 Crear Mi Cuenta'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a 
              href="/"
              style={{
                color: '#FFD700',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              ← Volver al inicio
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
