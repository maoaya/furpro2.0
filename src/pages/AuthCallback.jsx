import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Procesando autenticación...');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Procesando callback de OAuth...');
        
        // Obtener la sesión del callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error en callback:', error);
          setStatus('error');
          setMessage(`Error de autenticación: ${error.message}`);
          return;
        }

        if (data.session && data.session.user) {
          console.log('✅ Usuario autenticado:', data.session.user.email);
          
          // Verificar si el usuario ya existe en la base de datos
          const { data: existingUser, error: dbError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (dbError && dbError.code !== 'PGRST116') {
            console.error('❌ Error verificando usuario:', dbError);
            setStatus('error');
            setMessage('Error verificando usuario en la base de datos');
            return;
          }

          if (!existingUser) {
            // Usuario nuevo - crear perfil básico
            console.log('👤 Creando perfil básico para usuario nuevo...');
            
            const userMetadata = data.session.user.user_metadata || {};
            const email = data.session.user.email;
            const nombre = userMetadata.full_name || userMetadata.name || email.split('@')[0];
            
            const { error: insertError } = await supabase
              .from('usuarios')
              .insert([
                {
                  id: data.session.user.id,
                  nombre: nombre,
                  email: email,
                  avatar_url: userMetadata.avatar_url || userMetadata.picture,
                  rol: 'usuario',
                  provider: data.session.user.app_metadata?.provider || 'oauth',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  // Datos pendientes de completar
                  needs_profile_completion: true
                }
              ]);

            if (insertError) {
              console.error('❌ Error creando perfil:', insertError);
              setStatus('error');
              setMessage('Error creando perfil de usuario');
              return;
            }

            console.log('✅ Perfil básico creado');
            setStatus('success');
            setMessage('¡Bienvenido! Completando tu perfil...');
            
            // Redirigir al formulario de completar perfil
            setTimeout(() => {
              navigate('/validar-usuario');
            }, 2000);
          } else {
            // Usuario existente - ir al dashboard
            console.log('✅ Usuario existente encontrado');
            setStatus('success');
            setMessage('¡Bienvenido de vuelta!');
            
            setTimeout(() => {
              navigate('/home');
            }, 2000);
          }
        } else {
          console.log('⚠️ No se encontró sesión activa');
          setStatus('error');
          setMessage('No se pudo completar la autenticación');
          
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (err) {
        console.error('💥 Error inesperado en callback:', err);
        setStatus('error');
        setMessage('Error inesperado durante la autenticación');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return '#FFD700';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#FFD700';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#222',
        padding: '48px 32px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: `2px solid ${getStatusColor()}`
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '24px'
        }}>
          {getStatusIcon()}
        </div>
        
        <h2 style={{
          color: getStatusColor(),
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          {status === 'loading' && 'Procesando...'}
          {status === 'success' && '¡Éxito!'}
          {status === 'error' && 'Error'}
        </h2>
        
        <p style={{
          color: '#ccc',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '24px'
        }}>
          {message}
        </p>
        
        {status === 'loading' && (
          <div style={{
            width: '100%',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '30%',
              height: '100%',
              background: getStatusColor(),
              borderRadius: '2px',
              animation: 'loading 2s ease-in-out infinite'
            }} />
          </div>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#FFD700',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#FFA500'}
            onMouseOut={(e) => e.target.style.background = '#FFD700'}
          >
            Volver al Inicio
          </button>
        )}
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}