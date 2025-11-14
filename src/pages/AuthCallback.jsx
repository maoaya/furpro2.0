/**
 * 🔐 CALLBACK PARA OAUTH (GOOGLE/FACEBOOK)
 * Maneja la redirección después del login social
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userActivityTracker from '../services/UserActivityTracker';
import supabase from '../supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Procesando callback de OAuth...');
        
        // Verificar estado OAuth guardado
        const oauthStateRaw = localStorage.getItem('oauth_state');
        let oauthState = null;
        try {
          oauthState = oauthStateRaw ? JSON.parse(oauthStateRaw) : null;
        } catch {}
        
        if (oauthState) {
          const elapsed = Date.now() - oauthState.timestamp;
          console.log(`⏱️ Estado OAuth encontrado (${Math.round(elapsed/1000)}s desde inicio)`);
          console.log(`📍 Provider: ${oauthState.provider}, Origin: ${oauthState.origin}`);
          
          // Limpiar estado usado
          localStorage.removeItem('oauth_state');
          
          // Verificar si el estado es muy antiguo (más de 10 minutos)
          if (elapsed > 10 * 60 * 1000) {
            console.warn('⚠️ Estado OAuth expirado, continuando de todos modos...');
          }
        }
        
        // Obtener sesión de Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error obteniendo sesión:', sessionError);
          setError('Error al verificar autenticación. Por favor, intenta nuevamente.');
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.warn('⚠️ No hay sesión activa en callback');
          setError('No se pudo establecer la sesión. Por favor, intenta iniciar sesión nuevamente.');
          setLoading(false);
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            navigate('/');
          }, 3000);
          return;
        }
        
        console.log('✅ Sesión OAuth verificada:', session.user.email);
        
        // 🔥 TRACK SUCCESSFUL OAUTH LOGIN
        userActivityTracker.trackLogin('oauth_callback', true, {
          userId: session.user.id,
          email: session.user.email,
          provider: 'oauth_redirect'
        });

        // Usar sesión directamente sin esperar contexto
        (async () => {
          // Cambiar target por defecto a perfil-card para flujo OAuth desde formulario
          let target = localStorage.getItem('post_auth_target') || '/perfil-card';
          const origin = localStorage.getItem('oauth_origin');
          const draftRaw = localStorage.getItem('draft_carfutpro');
          let draft = null;
          try { draft = draftRaw ? JSON.parse(draftRaw) : null; } catch {}

          // Si el origen es formulario_registro, ir directo a /perfil-card
          if (target === '/perfil-card' && origin === 'formulario_registro') {
            console.log('🛠 Creando/upsert carfutpro antes de mostrar Card (flujo directo)...');
            try {
              const payload = {
                user_id: session.user.id,
                categoria: draft?.categoria || 'infantil_femenina',
                nombre: draft?.nombre || session.user.email.split('@')[0],
                ciudad: draft?.ciudad || '',
                pais: draft?.pais || '',
                posicion_favorita: draft?.posicion_favorita || 'Flexible',
                nivel_habilidad: draft?.nivel_habilidad || 'Principiante',
                equipo: draft?.equipo || '—',
                avatar_url: draft?.avatar_url || '',
                creada_en: new Date().toISOString(),
                estado: 'activa'
              };
              const { data, error } = await supabase
                .from('carfutpro')
                .upsert(payload, { onConflict: 'user_id' })
                .select()
                .single();
              if (!error && data) {
                console.log('✅ carfutpro upsert OK antes de Card');
                // Guardar datos para Card reales
                const cardData = {
                  id: data.id,
                  categoria: data.categoria,
                  nombre: data.nombre,
                  ciudad: data.ciudad,
                  pais: data.pais,
                  posicion_favorita: data.posicion_favorita,
                  nivel_habilidad: data.nivel_habilidad,
                  puntaje: data.puntaje || 50,
                  equipo: data.equipo || '—',
                  fecha_registro: new Date().toISOString(),
                  esPrimeraCard: true,
                  avatar_url: data.avatar_url || ''
                };
                try {
                  localStorage.setItem('futpro_user_card_data', JSON.stringify(cardData));
                  localStorage.setItem('show_first_card', 'true');
                } catch {}
              }
            } catch (prepErr) {
              console.warn('⚠️ Error preparando carfutpro antes de Card:', prepErr?.message);
            }
          }

          // Limpiar indicadores temporales
          localStorage.removeItem('post_auth_target');
          localStorage.removeItem('oauth_origin');

          setLoading(false);
          
          try {
            navigate(target);
          } catch (navErr) {
            console.warn('⚠️ navigate fallo, usando fallback href:', navErr?.message);
            window.location.href = target;
          }
        })();
        
      } catch (error) {
        console.error('Error en callback:', error);
        setError('Error procesando autenticación');
        
        // 🔥 TRACK OAUTH CALLBACK EXCEPTION
        userActivityTracker.trackAction('oauth_callback_exception', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        setLoading(false);
        setTimeout(() => {
          try { navigate('/login'); } catch { window.location.href = '/login'; }
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h2 className="text-2xl font-bold text-white mb-2">Completando ingreso con Google...</h2>
          <p className="text-gray-400 mb-4">Procesando autenticación y preparando tu perfil</p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error de Autenticación con Google</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300 mb-2">💡 Posibles soluciones:</p>
            <ul className="text-xs text-gray-400 text-left space-y-1">
              <li>• Verifica tu conexión a internet</li>
              <li>• Intenta cerrar y volver a iniciar sesión</li>
              <li>• Asegúrate de permitir ventanas emergentes</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">Redirigiendo a inicio de sesión en 3 segundos...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;