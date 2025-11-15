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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 [AuthCallback] Iniciando procesamiento...');
        
        // Obtener sesión INMEDIATAMENTE desde Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error obteniendo sesión:', sessionError);
          setError('Error al verificar autenticación');
          setLoading(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        if (!session?.user) {
          console.warn('⚠️ No hay sesión activa en callback');
          setError('No se pudo establecer la sesión');
          setLoading(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        console.log('✅ Sesión OAuth verificada:', session.user.email);
        
        // Track login exitoso
        userActivityTracker.trackLogin('oauth_callback', true, {
          userId: session.user.id,
          email: session.user.email,
          provider: 'google'
        });

        // Obtener datos guardados
        const draftRaw = localStorage.getItem('draft_carfutpro');
        let draft = null;
        try { draft = draftRaw ? JSON.parse(draftRaw) : null; } catch {}

        // Crear/actualizar registro en carfutpro
        console.log('🛠 Creando perfil de usuario...');
        const payload = {
          user_id: session.user.id,
          categoria: draft?.categoria || 'masculina',
          nombre: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          ciudad: draft?.ciudad || '',
          pais: draft?.pais || '',
          posicion_favorita: draft?.posicion_favorita || 'Flexible',
          nivel_habilidad: draft?.nivel_habilidad || 'Principiante',
          equipo: draft?.equipo || '—',
          avatar_url: session.user.user_metadata?.avatar_url || draft?.avatar_url || '',
          creada_en: new Date().toISOString(),
          estado: 'activa'
        };
        
        const { data, error: upsertError } = await supabase
          .from('carfutpro')
          .upsert(payload, { onConflict: 'user_id' })
          .select()
          .single();
        
        if (!upsertError && data) {
          console.log('✅ Perfil creado/actualizado');
          // Guardar datos para la card
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
            avatar_url: data.avatar_url || session.user.user_metadata?.avatar_url || ''
          };
          localStorage.setItem('futpro_user_card_data', JSON.stringify(cardData));
          localStorage.setItem('show_first_card', 'true');
        } else {
          console.warn('⚠️ Error creando perfil:', upsertError?.message);
        }

        // Limpiar flags temporales
        localStorage.removeItem('post_auth_target');
        localStorage.removeItem('oauth_origin');
        localStorage.removeItem('oauth_state');

        setLoading(false);
        
        // Navegar a perfil-card
        console.log('✅ Redirigiendo a /perfil-card');
        setTimeout(() => {
          try {
            navigate('/perfil-card', { replace: true });
          } catch {
            window.location.href = '/perfil-card';
          }
        }, 500);
        
      } catch (error) {
        console.error('❌ Error en callback:', error);
        setError('Error procesando autenticación');
        userActivityTracker.trackAction('oauth_callback_exception', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
        setLoading(false);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
        
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