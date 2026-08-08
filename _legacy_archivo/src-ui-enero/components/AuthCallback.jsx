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
            setStatus(`¡${resultado.message}! Verificando perfil...`);
            
            // Guardar datos del usuario en el contexto
            if (window.localStorage) {
              localStorage.setItem('currentUser', JSON.stringify(resultado.user));
            }
            
            // 🔍 Verificar si usuario tiene card en carfutpro
            try {
              const { data: card, error: cardError } = await supabase
                .from('carfutpro')
                .select('*')
                .eq('user_id', resultado.user.id)
                .maybeSingle();
              
              console.log('📋 Card encontrada:', !!card);
              
              if (cardError && !cardError.message?.includes('not found')) {
                console.warn('⚠️ Error verificando card:', cardError);
              }
              
              // Si tiene card completa
              if (card && card.nombre && card.posicion) {
                setStatus('¡Bienvenido! Redirigiendo al inicio...');
                setTimeout(() => {
                  console.log('🏠 Usuario con card, ir a home');
                  navigate('/home', { replace: true });
                }, 1500);
              }
              // Si tiene card incompleta
              else if (card && (!card.nombre || !card.posicion)) {
                setStatus('Completando tu perfil...');
                setTimeout(() => {
                  console.log('✏️ Usuario con card incompleta, ir a editar');
                  navigate('/editar-perfil', { replace: true });
                }, 1500);
              }
              // Si NO tiene card (nuevo usuario)
              else {
                setStatus('Completando tu registro...');
                setTimeout(() => {
                  console.log('📝 Nuevo usuario, ir a registro');
                  navigate('/registro', { replace: true });
                }, 1500);
              }
            } catch (cardCheckError) {
              console.error('❌ Error verificando card:', cardCheckError);
              // Fallback: ir a registro
              setStatus('Completando registro...');
              setTimeout(() => {
                navigate('/registro', { replace: true });
              }, 1500);
            }
            
          } else {
            setStatus('¡Bienvenido de vuelta! Redirigiendo...');
            setTimeout(() => {
              navigate('/home', { replace: true });
            }, 1500);
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