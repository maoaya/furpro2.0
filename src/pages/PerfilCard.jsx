import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PerfilCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Cargar datos de la card
    const loadCardData = () => {
      try {
        // Datos desde localStorage o estado de navegación
        const storedData = localStorage.getItem('futpro_user_card_data');
        const stateData = location.state?.cardData;
        
        const data = stateData || (storedData ? JSON.parse(storedData) : null);
        
        if (data) {
          setCardData(data);
          setShowAnimation(true);
        } else {
          // Si no hay datos, ir al home
          navigate('/home');
        }
      } catch (error) {
        console.error('Error cargando datos de card:', error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, [navigate, location.state]);

  const continuarAlHome = () => {
    localStorage.removeItem('show_first_card');
    // Navegar a homepage-instagram.html (página estática)
    window.location.href = '/homepage-instagram.html';
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
        <div className="text-yellow-400 text-xl">⚽ Cargando tu card de jugador...</div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-xl">❌ Error cargando datos</div>
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
            <h2 className="text-xl font-bold mb-1">{cardData.nombre}</h2>
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
                <div className="opacity-80">Partidos</div>
              </div>
              <div>
                <div className="font-bold">{cardData.goles || 0}</div>
                <div className="opacity-80">Goles</div>
              </div>
              <div>
                <div className="font-bold">{cardData.asistencias || 0}</div>
                <div className="opacity-80">Asist.</div>
              </div>
            </div>
          </div>

          {/* Badge de Nueva Card */}
          {cardData.esPrimeraCard && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              ¡NUEVA!
            </div>
          )}

          {/* Footer con Equipo */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-white text-xs opacity-80 mb-2">
              Equipo Favorito: {cardData.equipo}
            </div>
            <div className="text-white text-xs opacity-60">
              Miembro desde {new Date(cardData.fecha_registro).getFullYear()}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 space-y-4 text-center">
          <div className="text-white text-lg font-bold mb-2">
            ¡Tu Card de Jugador está lista! 🎉
          </div>
          
          <button
            onClick={continuarAlHome}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🏠 Ir al Homepage
          </button>
          
          <button
            onClick={() => navigate('/perfil')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            👤 Ver Perfil Completo
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