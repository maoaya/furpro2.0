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
        
        // Esperar un momento para que AuthContext se actualice
        setTimeout(() => {
          if (user) {
            console.log('✅ Usuario autenticado:', user.email);

            // 🔥 TRACK SUCCESSFUL OAUTH LOGIN
            userActivityTracker.trackLogin('oauth_callback', true, {
              userId: user.id,
              email: user.email,
              provider: 'oauth_redirect'
            });

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
                    user_id: user.id,
                    categoria: draft?.categoria || 'infantil_femenina',
                    nombre: draft?.nombre || user.email.split('@')[0],
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

              try {
                navigate(target);
              } catch (navErr) {
                console.warn('⚠️ navigate fallo, usando fallback href:', navErr?.message);
                window.location.href = target;
              }
            })();
          } else {
            console.log('❌ No se encontró usuario después del callback');
            setError('Error en la autenticación');
            
            // 🔥 TRACK FAILED OAUTH CALLBACK
            userActivityTracker.trackAction('oauth_callback_failed', {
              timestamp: new Date().toISOString(),
              error: 'No user found after callback'
            });
            
            // Redireccionar a login después de un error
            setTimeout(() => navigate('/login'), 3000);
          }
          setLoading(false);
        }, 2000);
        
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
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h2 className="text-2xl font-bold text-white mb-2">Completando ingreso...</h2>
          <p className="text-gray-400">Procesando autenticación</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error de Autenticación</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirigiendo a inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;