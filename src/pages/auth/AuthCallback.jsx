import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '../../config/environment.js';
import { supabase } from '../../supabaseClient.js';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const config = getConfig();
        console.log('[AuthCallback] Inicio procesamiento. Callback esperado:', config.oauthCallbackUrl);

        // Obtener la sesión actual creada por Supabase tras el intercambio OAuth
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[AuthCallback] Error obteniendo sesión:', error);
        }
        console.log('[AuthCallback] Sesión actual:', session);

        // Determinar destino post-auth
        const origin = localStorage.getItem('post_auth_origin') || 'desconocido';
        const target = localStorage.getItem('post_auth_target') || '/perfil-card';
        console.log('[AuthCallback] origin:', origin, 'target:', target);

        // Limpieza básica para no persistir valores obsoletos
        localStorage.removeItem('post_auth_origin');
        localStorage.removeItem('post_auth_target');

        // Redirigir según target
        navigate(target);
      } catch (e) {
        console.error('[AuthCallback] Error inesperado:', e);
        // Fallback seguro
        navigate('/seleccionar-categoria');
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div style={{ color: '#FFD700', textAlign: 'center', marginTop: 80 }}>
      <h2>Procesando autenticación...</h2>
      <p>Por favor espera unos segundos.</p>
    </div>
  );
}
