import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const gold = '#FFD700';
const black = '#222';

export default function CallbackPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 Procesando callback OAuth...');
      // Esperar un poco para que el AuthContext procese la sesión
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Logs detallados de localStorage y sesión
      const ls = {
        userRegistrado: localStorage.getItem('userRegistrado'),
        postLoginRedirect: localStorage.getItem('postLoginRedirect'),
        registroCompleto: localStorage.getItem('registroCompleto'),
        authCompleted: localStorage.getItem('authCompleted'),
        loginSuccess: localStorage.getItem('loginSuccess'),
        session: localStorage.getItem('session'),
        userEmail: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId')
      };
      console.log('🗃️ Estado localStorage:', ls);
      console.log('🔑 Estado user:', user);
      console.log('⏳ Estado loading:', loading);

      if (user) {
        console.log('✅ Usuario autenticado via OAuth:', user.email);
        if (ls.postLoginRedirect) {
          console.log('📍 Redirigiendo a:', ls.postLoginRedirect);
          localStorage.removeItem('postLoginRedirect');
          navigate(ls.postLoginRedirect, { replace: true });
        } else {
          console.log('📍 Redirigiendo al Home por defecto');
          navigate('/home', { replace: true });
        }
      } else if (!loading) {
        console.log('❌ No se encontró usuario después del callback');
        navigate('/', { replace: true });
      }
      setProcessing(false);
    };

    if (!loading) {
      handleCallback();
    }
  }, [user, loading, navigate]);

  if (processing || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: '#1a1a1a',
          border: `2px solid ${gold}`,
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'spin 2s linear infinite'
          }}>
            ⚽
          </div>
          <h2 style={{ color: gold, marginBottom: '10px' }}>
            Completando autenticación...
          </h2>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            Te redirigiremos en un momento
          </p>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return null;
}