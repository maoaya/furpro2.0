import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      console.log('[OAuth] Entrando a /auth/callback');
      try {
        const session = supabase.auth.getSession ? await supabase.auth.getSession() : null;
        console.log('[OAuth] Session:', session);
        if (session && session.data && session.data.session) {
          // Usuario autenticado correctamente
          console.log('[OAuth] Usuario autenticado:', session.data.session.user);
          // Recuperar datos de la card si existen
          const cardDataRaw = localStorage.getItem('futpro_user_card_data');
          if (cardDataRaw) {
            const cardData = JSON.parse(cardDataRaw);
            navigate('/perfil-card', { state: { cardData } });
            setTimeout(() => navigate('/home'), 2500);
          } else {
            navigate('/home');
          }
          // Limpiar borradores y flags
          localStorage.removeItem('draft_registro_completo');
          localStorage.removeItem('oauth_origin');
          localStorage.removeItem('post_auth_target');
        } else {
          console.warn('[OAuth] No se encontró sesión, redirigiendo a login');
          navigate('/login');
        }
      } catch (e) {
        console.error('[OAuth] Error en callback:', e);
        navigate('/login');
      }
    }
    handleCallback();
  }, [navigate]);

  return (
    <div style={{ color: '#FFD700', textAlign: 'center', marginTop: 80 }}>
      <h2>Procesando autenticación...</h2>
      <p>Por favor espera unos segundos.</p>
    </div>
  );
}
