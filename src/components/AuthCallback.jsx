import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase.js';
import { getConfig } from '../config/environment.js';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando autenticación...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 PROCESANDO CALLBACK CON CONEXIÓN EFECTIVA...');
        console.log('🌍 URL actual:', window.location.href);
        console.log('📋 Datos en localStorage:', {
          pendingProfile: !!localStorage.getItem('pendingProfileData'),
          progress: !!localStorage.getItem('registroProgreso'),
          temp: !!localStorage.getItem('tempRegistroData')
        });
        
        setStatus('✅ Verificando autenticación y guardando usuario...');
        
        // Procesamiento directo sin import dinámico
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Error obteniendo sesión: ${sessionError.message}`);
        }
        
        const resultado = { success: !!session, user: session?.user, message: 'Usuario autenticado' };
        
        if (resultado.success) {
          console.log('✅ CALLBACK PROCESADO EXITOSAMENTE:', resultado);
          
          if (resultado.user) {
            setStatus(`¡${resultado.message}! Completando registro...`);
            
            // Guardar datos del usuario en el contexto si es necesario
            if (window.localStorage) {
              localStorage.setItem('currentUser', JSON.stringify(resultado.user));
            }
            
            // Redirigir al formulario de registro completo
            setTimeout(() => {
              console.log('📝 Redirigiendo al formulario de registro completo...');
              navigate('/registro', { replace: true });
            }, 2000);
            
          } else {
            setStatus('¡Bienvenido de vuelta! Redirigiendo...');
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          }
          
        } else {
          console.error('❌ ERROR EN CALLBACK:', resultado.error);
          setError(resultado.error);
          setStatus('Error en la autenticación - Por favor intenta de nuevo');
          
          // Redirigir al registro después de mostrar error
          setTimeout(() => {
            navigate('/registro', { replace: true });
          }, 4000);
        }
        
      } catch (err) {
        console.error('💥 ERROR INESPERADO EN CALLBACK:', err);
        setError(err.message || 'Error inesperado');
        setStatus('Error inesperado en la conexión - Redirigiendo...');
        
        // Redirigir al registro en caso de error grave
        setTimeout(() => {
          navigate('/registro', { replace: true });
        }, 3000);
      }
    };

    // Ejecutar después de un breve delay para permitir que la URL se procese
    const timer = setTimeout(handleCallback, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '20px',
          animation: 'spin 1s linear infinite'
        }}>
          ⚽
        </div>
        
        <h2 style={{
          color: '#FFD700',
          marginBottom: '20px',
          fontSize: '1.5rem'
        }}>
          FutPro - Autenticación
        </h2>
        
        <p style={{
          color: '#fff',
          marginBottom: '20px',
          fontSize: '1.1rem'
        }}>
          {status}
        </p>
        
        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #ff4444',
            borderRadius: '8px',
            padding: '15px',
            marginTop: '20px',
            color: '#ff6666'
          }}>
            <strong>Error:</strong> {error}
            <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              <a 
                href="/registro" 
                style={{ color: '#FFD700', textDecoration: 'underline' }}
              >
                Volver al registro
              </a>
            </div>
          </div>
        )}
        
        <div style={{
          marginTop: '30px',
          fontSize: '0.9rem',
          color: '#ccc'
        }}>
          Si esta página no se redirige automáticamente,{' '}
          <a 
            href="/dashboard" 
            style={{ color: '#FFD700', textDecoration: 'underline' }}
          >
            haz clic aquí
          </a>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}