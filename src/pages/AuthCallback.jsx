/**
 * 🔐 CALLBACK PARA OAUTH (GOOGLE/FACEBOOK)
 * Maneja la redirección después del login social
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔐 [CALLBACK] Iniciando...');
      
      try {
        // Paso 1: Obtener sesión
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          console.error('❌ Sin sesión:', sessionError);
          window.location.href = '/?error=auth_failed';
          return;
        }
        
        console.log('✅ Sesión OK:', session.user.email);
        
        // Paso 2: Crear perfil básico
        const { error: profileError } = await supabase
          .from('carfutpro')
          .upsert({
            user_id: session.user.id,
            nombre: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url || '',
            categoria: 'masculina',
            posicion_favorita: 'Flexible',
            nivel_habilidad: 'Principiante',
            equipo: '—',
            estado: 'activa',
            creada_en: new Date().toISOString()
          }, { onConflict: 'user_id' });
        
        if (profileError) {
          console.warn('⚠️ Error perfil:', profileError.message);
        } else {
          console.log('✅ Perfil guardado');
        }
        
        // Paso 3: Guardar datos para card
        localStorage.setItem('futpro_user_card_data', JSON.stringify({
          nombre: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url || '',
          categoria: 'masculina',
          posicion_favorita: 'Flexible',
          nivel_habilidad: 'Principiante',
          esPrimeraCard: true
        }));
        localStorage.setItem('show_first_card', 'true');
        
        // Paso 4: Redirigir INMEDIATAMENTE
        console.log('✅ Redirigiendo a /perfil-card');
        window.location.href = '/perfil-card';
        
      } catch (error) {
        console.error('❌ Error callback:', error);
        setError('Error procesando autenticación');
        setLoading(false);
        window.location.href = '/?error=callback_failed';
      }
    };

    handleAuthCallback();
  }, [navigate]);

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