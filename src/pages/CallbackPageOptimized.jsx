import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import { authFlowManager, handleAuthenticationSuccess } from '../utils/authFlowManager.js';

export default function CallbackPageOptimized() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [status, setStatus] = useState('');
  const [lang, setLang] = useState('es');

  // Traducciones
  const I18N = {
    es: {
      processing: 'Procesando autenticación...',
      verifying: 'Verificando autenticación...',
      errorAuth: 'Error en autenticación. Redirigiendo...',
      noSession: 'No se pudo completar la autenticación. Redirigiendo...',
      authenticated: 'Usuario autenticado. Configurando perfil...',
      welcomeBack: '¡Bienvenido de vuelta! Redirigiendo...',
      creatingProfile: 'Creando perfil de usuario...',
      success: '¡Éxito! Configurando navegación...',
      redirecting: '¡Redirigiendo a tu dashboard!',
      finalizing: 'Finalizando configuración...'
    },
    en: {
      processing: 'Processing authentication...',
      verifying: 'Verifying authentication...',
      errorAuth: 'Authentication error. Redirecting...',
      noSession: 'Could not complete authentication. Redirecting...',
      authenticated: 'User authenticated. Setting up profile...',
      welcomeBack: 'Welcome back! Redirecting...',
      creatingProfile: 'Creating user profile...',
      success: 'Success! Setting up navigation...',
      redirecting: 'Redirecting to your dashboard!',
      finalizing: 'Finalizing setup...'
    },
    pt: {
      processing: 'Processando autenticação...',
      verifying: 'Verificando autenticação...',
      errorAuth: 'Erro na autenticação. Redirecionando...',
      noSession: 'Não foi possível completar a autenticação. Redirecionando...',
      authenticated: 'Usuário autenticado. Configurando perfil...',
      welcomeBack: 'Bem-vindo de volta! Redirecionando...',
      creatingProfile: 'Criando perfil de usuário...',
      success: 'Sucesso! Configurando navegação...',
      redirecting: 'Redirecionando para seu painel!',
      finalizing: 'Finalizando configuração...'
    }
  };

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.es[key] || key;

  // Auto-detectar idioma
  useEffect(() => {
    try {
      const nav = (navigator.language || 'es').toLowerCase();
      if (nav.startsWith('es')) setLang('es');
      else if (nav.startsWith('pt')) setLang('pt');
      else setLang('en');
    } catch (_) {
      setLang('es');
    }
    setStatus(t('processing'));
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 CallbackPage: Procesando callback OAuth...');
        setStatus(t('verifying'));

        // Obtener la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error obteniendo sesión:', sessionError);
          setStatus(t('errorAuth'));
          setTimeout(() => navigate('/', { replace: true }), 2000);
          return;
        }

        if (!session || !session.user) {
          console.warn('⚠️ No hay sesión válida en callback');
          setStatus(t('noSession'));
          setTimeout(() => navigate('/', { replace: true }), 2000);
          return;
        }

        const user = session.user;
        console.log('✅ Usuario OAuth autenticado:', user.email);
        setStatus(t('authenticated'));

        // Verificar si el usuario ya tiene perfil en la DB
        const { data: existingProfile, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError && existingProfile) {
          console.log('✅ Perfil existente encontrado:', existingProfile.nombre);
          setStatus(t('welcomeBack'));
        } else {
          console.log('📝 Creando nuevo perfil para usuario OAuth...');
          setStatus(t('creatingProfile'));

          // Crear perfil para nuevo usuario OAuth
          const perfilData = {
            id: user.id,
            email: user.email,
            nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
            apellido: '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            rol: 'usuario',
            tipo_usuario: 'jugador',
            estado: 'activo',
            posicion: 'Por definir',
            frecuencia_juego: 1,
            pais: 'España',
            provider: user.app_metadata?.provider || 'oauth',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data: newProfile, error: createError } = await supabase
            .from('usuarios')
            .insert([perfilData])
            .select();

          if (createError) {
            console.error('❌ Error creando perfil:', createError);
            // Continuar sin perfil, el usuario puede completarlo después
          } else {
            console.log('✅ Perfil creado exitosamente para usuario OAuth');
          }
        }

        console.log('🎉 OAuth callback procesado. Usando AuthFlowManager...');
        setStatus(t('success'));

        // Usar el nuevo AuthFlowManager para navegación robusta
        const resultado = await handleAuthenticationSuccess(user, navigate, {
          nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
          provider: user.app_metadata?.provider
        });

        if (resultado.success) {
          console.log('✅ Navegación exitosa con AuthFlowManager');
          setStatus(t('redirecting'));
        } else {
          console.log('⚠️ Problema con AuthFlowManager, usando fallback');
          setStatus(t('finalizing'));
          
          // Fallback al método anterior
          localStorage.setItem('authCompleted', 'true');
          setTimeout(() => {
            try {
              navigate('/home', { replace: true });
            } catch (navError) {
              window.location.href = '/home';
            }
          }, 1000);
        }

      } catch (error) {
        console.error('💥 Error inesperado en callback:', error);
        setStatus('Error inesperado. Redirigiendo...');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      } finally {
        setProcessing(false);
      }
    };

    // Ejecutar callback después de un breve delay para asegurar que todo esté listo
    const timer = setTimeout(handleCallback, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Si el usuario ya está autenticado (desde AuthContext), redirigir inmediatamente
  useEffect(() => {
    if (!loading && user) {
      console.log('✅ Usuario ya autenticado en CallbackPage, redirigiendo...');
      setTimeout(() => {
        try {
          navigate('/home', { replace: true });
        } catch (error) {
          window.location.href = '/home';
        }
      }, 500);
    }
  }, [user, loading, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFD700'
    }}>
      <div style={{
        background: '#222',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        border: '2px solid #FFD700',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          color: '#FFD700', 
          fontSize: '32px', 
          margin: '0 0 20px 0'
        }}>
          ⚽ FutPro
        </h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #FFD700',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>

        <h2 style={{
          color: '#FFD700',
          fontSize: '20px',
          margin: '0 0 15px 0'
        }}>
          {processing ? 'Procesando Autenticación' : 'Autenticación Completa'}
        </h2>

        <p style={{
          color: '#ccc',
          fontSize: '16px',
          margin: '0 0 20px 0',
          lineHeight: '1.5'
        }}>
          {status}
        </p>

        {!processing && (
          <div style={{
            background: '#4CAF50',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '15px'
          }}>
            ✅ ¡Bienvenido a FutPro!
          </div>
        )}

        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#888'
        }}>
          Si no eres redirigido automáticamente,{' '}
          <button
            onClick={() => {
              try {
                navigate('/home', { replace: true });
              } catch (error) {
                window.location.href = '/home';
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD700',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            haz clic aquí
          </button>
        </div>
      </div>
    </div>
  );
}