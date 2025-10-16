import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function CallbackPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 Procesando callback OAuth...');
      // Esperar un poco para que el AuthContext procese la sesión
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Logs detallados de localStorage y sesión
      const ls = {
        userRegistrado: localStorage.getItem('userRegistrado'),
        postLoginRedirect: localStorage.getItem('postLoginRedirect'),
        registroCompleto: localStorage.getItem('registroCompleto'),
        authCompleted: localStorage.getItem('authCompleted'),
        loginSuccess: localStorage.getItem('loginSuccess'),
        session: localStorage.getItem('session'),
        userEmail: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId'),
        draft: localStorage.getItem('futpro_registro_draft')
      };
      console.log('🗃️ Estado localStorage:', ls);
      console.log('🔑 Estado user:', user);
      console.log('⏳ Estado loading:', loading);

      if (user) {
        console.log('✅ Usuario autenticado via OAuth:', user.email);
        
        // NUEVO: Verificar si hay draft del registro y crear perfil completo
        if (ls.draft) {
          try {
            const draftData = JSON.parse(ls.draft);
            console.log('📝 Draft encontrado, creando perfil completo:', draftData);
            
            // Crear perfil en la tabla usuarios
            const perfilData = {
              id: user.id,
              email: user.email,
              nombre: draftData.nombre || user.user_metadata?.full_name?.split(' ')[0] || '',
              apellido: draftData.apellido || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              telefono: draftData.telefono || '',
              edad: draftData.edad ? parseInt(draftData.edad) : null,
              pais: draftData.pais || 'Colombia',
              ciudad: draftData.ciudad || '',
              posicion: draftData.posicion || [],
              experiencia: draftData.experiencia || '',
              dias_disponibles: draftData.diasDisponibles || [],
              horarios_entrenamiento: draftData.horariosEntrenamiento || '',
              equipo_favorito: draftData.equipoFavorito || '',
              foto_url: user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
              .from('usuarios')
              .upsert(perfilData, { onConflict: 'id' });

            if (error) {
              console.error('❌ Error creando perfil en usuarios:', error);
            } else {
              console.log('✅ Perfil creado exitosamente en usuarios:', data);
              localStorage.setItem('registroCompleto', 'true');
              localStorage.removeItem('futpro_registro_draft');
            }
          } catch (err) {
            console.error('❌ Error procesando draft:', err);
          }
        }

        // Establecer todos los indicadores de autenticación exitosa
        localStorage.setItem('authCompleted', 'true');
        localStorage.setItem('loginSuccess', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('session', JSON.stringify(user));
        
        console.log('🚀 CALLBACK: Forzando redirección ultra-agresiva a /home');
        const targetRoute = ls.postLoginRedirect || '/home';
        if (ls.postLoginRedirect) {
          localStorage.removeItem('postLoginRedirect');
        }
        
        // Redirección ultra-agresiva
        setTimeout(() => {
          try {
            navigate(targetRoute, { replace: true });
          } catch (err) {
            console.warn('⚠️ navigate falló, usando window.location.href');
            window.location.href = targetRoute;
          }
          setTimeout(() => {
            if (window.location.pathname !== targetRoute) {
              window.location.href = targetRoute;
            }
          }, 1000);
        }, 500);
      } else if (!loading) {
        console.log('❌ No se encontró usuario después del callback');
        navigate('/', { replace: true });
      }
      setProcessing(false);
    };

    if (!loading) {
      handleCallback();
    }
  }, [user, loading, navigate]);

  if (processing || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: '#1a1a1a',
          border: `2px solid ${gold}`,
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'spin 2s linear infinite'
          }}>
            ⚽
          </div>
          <h2 style={{ color: gold, marginBottom: '10px' }}>
            Completando autenticación...
          </h2>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            Te redirigiremos en un momento
          </p>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return null;
}