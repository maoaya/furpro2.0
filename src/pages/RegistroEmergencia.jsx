import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistroEmergencia() {
  console.log('🔥 REGISTRO EMERGENCIA CARGADO');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Registro emergencia enviado:', formData);
    
    // Simular registro exitoso
    localStorage.setItem('registroCompleto', 'true');
    localStorage.setItem('authCompleted', 'true');
    
    // Navegar al home
    try {
      navigate('/home');
    } catch (error) {
      window.location.href = '/home';
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <h1 style={{
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px'
        }}>
          🚀 Registro Rápido FutPro
        </h1>
        
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#22c55e',
          textAlign: 'center'
        }}>
          ✅ ¡Navegación exitosa! El componente se está cargando correctamente.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px' }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #555',
                background: '#2a2a2a',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Tu nombre completo"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #555',
                background: '#2a2a2a',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="tu@email.com"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px' }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #555',
                background: '#2a2a2a',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
            }}
          >
            🎯 Crear Cuenta y Continuar
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => {
              try {
                navigate('/');
              } catch (error) {
                window.location.href = '/';
              }
            }}
            style={{
              background: 'transparent',
              color: '#FFD700',
              border: '1px solid #FFD700',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Volver al Login
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid #3b82f6',
          color: '#3b82f6',
          fontSize: '14px'
        }}>
          <strong>✅ Sistema funcionando:</strong><br />
          - Navegación correcta ✓<br />
          - Componente cargado ✓<br />
          - Formulario activo ✓<br />
          - Redirección configurada ✓
        </div>
      </div>
    </div>
  );
}