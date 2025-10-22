import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomeSimple = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirección automática a homepage-instagram.html
  useEffect(() => {
    if (user) {
      console.log('✅ Usuario detectado, redirigiendo a homepage-instagram.html');
      
      // Mostrar mensaje breve antes de redirigir
      const timer = setTimeout(() => {
        window.location.href = '/homepage-instagram.html';
      }, 2000); // 2 segundos para que vean el mensaje de bienvenida
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '3rem',
        width: '100%',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>🎉</h1>
        <h2 style={{ margin: '0 0 1rem 0' }}>¡Bienvenido a FutPro 2.0!</h2>
        
        {user && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '15px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>👤 Información del Usuario</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Último acceso:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
            <p style={{ 
              color: '#10B981', 
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '8px',
              borderRadius: '8px',
              margin: '1rem 0'
            }}>
              ✅ Usuario guardado en base de datos
            </p>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h3>🚀 Funcionalidades Disponibles</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            margin: '1rem 0'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚽</div>
              <div>Partidos</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <div>Ranking</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
              <div>Equipos</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
              <div>Stats</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(45deg, #EF4444, #DC2626)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🚪 Cerrar Sesión
        </button>

        <div style={{
          marginTop: '2rem',
          fontSize: '14px',
          opacity: 0.7
        }}>
          <p>✅ Autenticación funcionando</p>
          <p>✅ Usuario en base de datos</p>
          <p>✅ Rutas protegidas activas</p>
        </div>
      </div>
    </div>
  );
};

export default HomeSimple;