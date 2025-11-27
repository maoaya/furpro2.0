import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserService } from '../services/UserService';
import { supabase } from '../config/supabase';

const PerfilCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [lang, setLang] = useState('es');

  // Traducciones mínimas
  const I18N = {
    es: {
      loading: '⚽ Cargando tu card de jugador...',
      error: '❌ Error cargando datos',
      newBadge: '¡NUEVA!',
      partidos: 'Partidos',
      goles: 'Goles',
      asist: 'Asist.',
      equipoFavorito: 'Equipo Favorito',
      miembroDesde: 'Miembro desde',
      cardReady: '¡Tu Card de Jugador está lista! 🎉',
      irAlHomepage: 'Continuar',
      verPerfil: '👤 Ver Perfil Completo'
    },
    en: {
      loading: '⚽ Loading your player card...',
      error: '❌ Error loading data',
      newBadge: 'NEW!',
      partidos: 'Matches',
      goles: 'Goals',
      asist: 'Assists',
      equipoFavorito: 'Favorite Team',
      miembroDesde: 'Member since',
      cardReady: 'Your Player Card is ready! 🎉',
      irAlHomepage: 'Continue',
      verPerfil: '👤 View Full Profile'
    },
    pt: {
      loading: '⚽ Carregando seu card de jogador...',
      error: '❌ Erro ao carregar dados',
      newBadge: 'NOVO!',
      partidos: 'Partidas',
      goles: 'Gols',
      asist: 'Assist.',
      equipoFavorito: 'Time Favorito',
      miembroDesde: 'Membro desde',
      cardReady: 'Seu Card de Jogador está pronto! 🎉',
      irAlHomepage: 'Continuar',
      verPerfil: '👤 Ver Perfil Completo'
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
  }, []);

  useEffect(() => {
    // Cargar datos de la card
    const loadCardData = async () => {
      try {
        // Prioridad: datos por estado, luego localStorage, luego Supabase
        let card = location.state?.cardData || null;
        if (!card) {
          const localCardRaw = localStorage.getItem('futpro_user_card_data');
          if (localCardRaw) card = JSON.parse(localCardRaw);
        }
        if (card) {
          setCardData(card);
          setShowAnimation(true);
          setLoading(false);
          return;
        }
        // Si no hay datos locales, intentar cargar desde Supabase
        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;
        if (userId) {
          const perfil = await UserService.getUserProfile(userId);
          setCardData(perfil);
          setShowAnimation(true);
        } else {
          // Si no hay datos, mostrar error en vez de redirigir
          setCardData(null);
        }
      } catch (error) {
        console.error('Error cargando datos de card:', error);
        setCardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
    // Activar listener de autenticación de Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ Usuario autenticado por Google/Supabase:', session.user.email);
      }
    });
    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, [navigate, location.state]);

  const continuarAlHome = () => {
    localStorage.removeItem('show_first_card');
    // Navegar a la homepage de Instagram (SPA route)
    navigate('/home');
  };

  const getColorByCategory = (categoria) => {
    switch(categoria) {
      case 'Élite': return 'linear-gradient(135deg, #ffd700, #ff8c00)';
      case 'Avanzado': return 'linear-gradient(135deg, #c0392b, #e74c3c)';
      case 'Intermedio': return 'linear-gradient(135deg, #27ae60, #2ecc71)';
      case 'Principiante': return 'linear-gradient(135deg, #3498db, #5dade2)';
      default: return 'linear-gradient(135deg, #95a5a6, #bdc3c7)';
    }
  };

  const getIconByPosition = (posicion) => {
    const icons = {
      'Portero': '🥅',
      'Defensa Central': '🛡️',
      'Lateral Derecho': '➡️',
      'Lateral Izquierdo': '⬅️',
      'Mediocampista Defensivo': '🔒',
      'Mediocampista Central': '⚖️',
      'Mediocampista Ofensivo': '🎯',
      'Extremo Derecho': '🏃‍♂️',
      'Extremo Izquierdo': '🏃‍♂️',
      'Delantero Centro': '⚽',
      'Flexible': '🔄'
    };
    return icons[posicion] || '⚽';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{t('error')}</div>
        <div className="text-white mt-4">No se encontraron datos de la card.<br/>Por favor completa el registro o inicia sesión con Google.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className={`card-container ${showAnimation ? 'animate-card-reveal' : ''}`}>
        {/* Card Principal tipo Instagram */}
        <div 
          className="relative w-80 h-96 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: getColorByCategory(cardData.categoria),
            transform: showAnimation ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.8s ease-out'
          }}
        >
          {/* Header de la Card */}
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚽</span>
                <span className="text-white font-bold text-sm">FutPro</span>
              </div>
              <div className="text-white text-xs opacity-80">
                #{cardData.id?.slice(-6)?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Foto de Perfil */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
              {cardData.avatar_url ? (
                <img 
                  src={cardData.avatar_url} 
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
          </div>

          {/* Información Principal */}
          <div className="absolute top-44 left-0 right-0 text-center text-white">
            <h2 className="text-xl font-bold mb-1">{cardData.nombre} {cardData.apellido}</h2>
            <p className="text-sm opacity-90 mb-2">{cardData.ciudad}, {cardData.pais}</p>
            
            {/* Posición y Experiencia */}
            <div className="flex justify-center items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <span className="text-lg">{getIconByPosition(cardData.posicion_favorita)}</span>
                <span className="text-xs">{cardData.posicion_favorita}</span>
              </div>
              <div className="text-xs opacity-80">•</div>
              <div className="text-xs">{cardData.nivel_habilidad}</div>
            </div>

            {/* Puntaje Principal */}
            <div className="bg-black bg-opacity-30 rounded-full px-6 py-2 mx-8 mb-3">
              <div className="text-2xl font-bold">{cardData.puntaje}/100</div>
              <div className="text-xs opacity-90">{cardData.categoria}</div>
            </div>

            {/* Estadísticas */}
            <div className="flex justify-around text-center text-xs px-4">
              <div>
                <div className="font-bold">{cardData.partidos_jugados || 0}</div>
                <div className="opacity-80">{t('partidos')}</div>
              </div>
              <div>
                <div className="font-bold">{cardData.goles || 0}</div>
                <div className="opacity-80">{t('goles')}</div>
              </div>
              <div>
                <div className="font-bold">{cardData.asistencias || 0}</div>
                <div className="opacity-80">{t('asist')}</div>
              </div>
            </div>
          </div>

          {/* Badge de Nueva Card */}
          {cardData.esPrimeraCard && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              {t('newBadge')}
            </div>
          )}

          {/* Footer con Equipo */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-white text-xs opacity-80 mb-2">
              {t('equipoFavorito')}: {cardData.equipo}
            </div>
            <div className="text-white text-xs opacity-60">
              {t('miembroDesde')} {new Date(cardData.fecha_registro).getFullYear()}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 space-y-4 text-center">
          <div className="text-white text-lg font-bold mb-2">
            {t('cardReady')}
          </div>
          
          <button
            onClick={continuarAlHome}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg,#FFD700,#ff8c00)',
              color: '#232323',
              fontWeight: 900,
              border: 'none',
              borderRadius: 18,
              fontSize: 22,
              boxShadow: '0 2px 16px #FFD70044',
              cursor: 'pointer',
              marginTop: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16
            }}
          >
            <span style={{fontSize:28}}>🏠</span>
            {t('irAlHomepage')}
            <span style={{fontSize:28}}>☰</span>
          </button>
          
          <button
            onClick={() => navigate('/perfil')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {t('verPerfil')}
          </button>
        </div>
      </div>

      {/* Estilos CSS embebidos */}
      <style jsx>{`
        .card-container {
          animation: slideInUp 1s ease-out;
        }
        
        .animate-card-reveal {
          animation: cardReveal 1.2s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: scale(0.3) rotateY(180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotateY(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PerfilCard;