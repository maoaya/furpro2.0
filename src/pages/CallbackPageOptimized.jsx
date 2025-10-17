import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase, { supabaseAuth } from '../supabaseClient'; // Importar ambos clientes
import { authFlowManager, handleAuthenticationSuccess } from '../utils/authFlowManager.js';
import getConfig from '../config/environment.js';

export default function CallbackPageOptimized() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [status, setStatus] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 CallbackPage: Procesando callback OAuth...');
        setStatus('Verificando autenticación...');

        // 0) Si viene con error en la URL, intentar un reintento seguro UNA sola vez
        const searchParams = new URLSearchParams(window.location.search);
        const hashParamsRaw = window.location.hash?.startsWith('#') ? window.location.hash.substring(1) : '';
        const hashParams = new URLSearchParams(hashParamsRaw);
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const errorCode = searchParams.get('error_code') || hashParams.get('error_code');

        if (errorParam) {
          const errorDescription = searchParams.get('error_description') || hashParams.get('error_description') || 'Sin descripción';
          console.warn('⚠️ Error recibido en callback:', { 
            errorParam, 
            errorCode, 
            errorDescription: decodeURIComponent(errorDescription),
            fullURL: window.location.href 
          });
          const alreadyRetried = sessionStorage.getItem('oauth_retry_once') === 'true';
          if (!alreadyRetried && (
            errorParam.includes('server_error') ||
            (errorCode && errorCode.includes('unexpected_failure')) ||
            decodeURIComponent((searchParams.get('error_description') || hashParams.get('error_description') || '')).toLowerCase().includes('exchange')
          )) {
            sessionStorage.setItem('oauth_retry_once', 'true');
            setStatus('Hubo un problema intercambiando el código. Reintentando login de forma segura...');
            const config = getConfig();
            try {
              const { error } = await supabaseAuth.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: config.oauthCallbackUrl,
                  queryParams: { prompt: 'select_account' }
                }
              });
              if (error) {
                console.error('❌ Reintento OAuth falló:', error);
                setTimeout(() => navigate('/?error=' + encodeURIComponent('No se pudo completar la autenticación'), { replace: true }), 1500);
                return;
              }
              // Supabase redirigirá, detener flujo actual
              return;
            } catch (e) {
              console.error('💥 Excepción en reintento OAuth:', e);
              setTimeout(() => navigate('/?error=' + encodeURIComponent('No se pudo completar la autenticación'), { replace: true }), 1500);
              return;
            }
          }
        }

  // Esperar un poco para que Supabase procese el callback
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Obtener la sesión actual usando el cliente Auth (sin restricción de schema)
        const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession();
        
        console.log('📊 Estado de sesión:', { session: !!session, user: !!session?.user, error: sessionError });
        
        if (sessionError) {
          console.error('❌ Error obteniendo sesión:', sessionError);
          setStatus('Error en autenticación. Redirigiendo...');
          setTimeout(() => navigate('/', { replace: true }), 2000);
          return;
        }

        if (!session || !session.user) {
          console.warn('⚠️ No hay sesión válida en callback');
          console.log('🔍 Intentando recuperar sesión desde URL...');
          // 1) Si viene flujo con code/state (PKCE), intentar intercambio explícito
          const urlHasCode = window.location.search.includes('code=') && window.location.search.includes('state=');
          if (urlHasCode) {
            try {
              setStatus('Intercambiando código por sesión...');
              const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(window.location.href);
              if (error) {
                console.error('❌ exchangeCodeForSession error:', error);
              } else if (data?.session?.user) {
                console.log('✅ Sesión establecida vía exchangeCodeForSession');
                await processUserProfile(data.session.user);
                return;
              }
            } catch (ex) {
              console.error('💥 Excepción en exchangeCodeForSession:', ex);
            }
          }
          
          // Intentar obtener sesión desde el hash de la URL
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            console.log('✅ Token encontrado en URL, estableciendo sesión...');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || ''
            });
            
            if (error || !data.session) {
              console.error('❌ Error estableciendo sesión:', error);
              setStatus('No se pudo completar la autenticación. Redirigiendo a tu dashboard...');
              setTimeout(() => navigate('/home', { replace: true }), 1500);
              return;
            }
            
            // Usar la sesión establecida
            const user = data.session.user;
            console.log('✅ Sesión establecida correctamente para:', user.email);
            await processUserProfile(user);
            return;
          }
          
          setStatus('No se pudo completar la autenticación. Redirigiendo...');
          setTimeout(() => navigate('/home', { replace: true }), 1500);
          return;
        }

        const user = session.user;
        console.log('✅ Usuario OAuth autenticado:', user.email);
        await processUserProfile(user);

      } catch (error) {
  console.error('💥 Error inesperado en callback:', error);
  setStatus('Error inesperado. Redirigiendo a tu dashboard...');
  setTimeout(() => navigate('/home', { replace: true }), 1500);
      } finally {
        setProcessing(false);
      }
    };

    // Función auxiliar para procesar el perfil del usuario
    const processUserProfile = async (user) => {
      try {
        setStatus('Usuario autenticado. Configurando perfil...');

        // Verificar si el usuario ya tiene perfil en la DB
        const { data: existingProfile, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError && existingProfile) {
          console.log('✅ Perfil existente encontrado:', existingProfile.nombre);
          setStatus('¡Bienvenido de vuelta! Redirigiendo...');
        } else {
          console.log('📝 Creando nuevo perfil para usuario OAuth...');
          setStatus('Creando perfil de usuario...');

          // NUEVO: Verificar si hay draft del registro
          const draftString = localStorage.getItem('futpro_registro_draft');
          let draftData = null;
          
          if (draftString) {
            try {
              draftData = JSON.parse(draftString);
              console.log('📝 Draft de registro encontrado:', draftData);
            } catch (e) {
              console.error('Error parseando draft:', e);
            }
          }

          // Crear perfil para nuevo usuario OAuth - Con datos del draft si existen
          const perfilData = {
            id: user.id,
            email: user.email,
            nombre: draftData?.nombre || user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
            apellido: draftData?.apellido || '',
            telefono: draftData?.telefono || '',
            edad: draftData?.edad ? parseInt(draftData.edad) : null,
            pais: draftData?.pais || 'Colombia',
            ciudad: draftData?.ciudad || '',
            posicion: draftData?.posicion || [],
            experiencia: draftData?.experiencia || '',
            dias_disponibles: draftData?.diasDisponibles || [],
            horarios_entrenamiento: draftData?.horariosEntrenamiento || '',
            equipo_favorito: draftData?.equipoFavorito || '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            rol: 'usuario',
            tipo_usuario: 'jugador',
            estado: 'activo',
            frecuencia_juego: 1,
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
            setStatus('Error creando perfil, pero tu sesión está activa. Redirigiendo...');
            setTimeout(() => navigate('/home', { replace: true }), 1200);
          } else {
            console.log('✅ Perfil creado exitosamente para usuario OAuth con datos completos');
            // Limpiar draft si se usó
            if (draftData) {
              localStorage.removeItem('futpro_registro_draft');
              localStorage.setItem('registroCompleto', 'true');
            }
          }
        }

        console.log('🎉 OAuth callback procesado. Guardando sesión y navegando...');
        setStatus('¡Éxito! Configurando navegación...');

        // CRÍTICO: Establecer indicadores de auth ANTES de navegar
        localStorage.setItem('authCompleted', 'true');
        localStorage.setItem('loginSuccess', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.id);

        // Esperar un momento para que AuthContext procese la sesión
        await new Promise(resolve => setTimeout(resolve, 800));

        // Usar el nuevo AuthFlowManager para navegación robusta
        const resultado = await handleAuthenticationSuccess(user, navigate, {
          nombre: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
          provider: user.app_metadata?.provider
        });

        if (resultado.success) {
          console.log('✅ Navegación exitosa con AuthFlowManager');
          setStatus('¡Redirigiendo a tu dashboard!');
        } else {
          console.log('⚠️ Problema con AuthFlowManager, usando fallback directo');
          setStatus('Finalizando configuración...');
          
          // Fallback: forzar navegación con window.location para recargar contexto
          console.log('🔄 Forzando recarga completa para actualizar contexto...');
          setTimeout(() => {
            window.location.href = '/home';
          }, 500);
        }
      } catch (error) {
  console.error('💥 Error procesando perfil:', error);
  setStatus('Error configurando perfil. Redirigiendo a tu dashboard...');
  setTimeout(() => navigate('/home', { replace: true }), 1200);
      }
    };

    // Ejecutar callback si no está cargando
    if (!loading) {
      handleCallback();
    }
  }, [navigate, loading]);

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