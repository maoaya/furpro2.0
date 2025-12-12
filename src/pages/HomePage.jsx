import React, { useEffect, useState } from 'react';
import {
  fetchGalleryAndComments as stubFetchGalleryAndComments,
  fetchUsuario as stubFetchUsuario,
  handleLike as stubHandleLike,
  handleShare as stubHandleShare,
  handleComment as stubHandleComment,
  handleAccion as stubHandleAccion
} from '../stubs/homePageFunctions';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { UserService } from '../services/UserService';
import mediaService from '../services/mediaService';
import commentService from '../services/commentService';
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';
import { useWebSocketComments } from '../hooks/useWebSocketComments';
import { useWebSocketLikes } from '../hooks/useWebSocketLikes';
import CopilotAyuda from '../components/CopilotAyuda';
import FutproLogo from '../components/FutproLogo.jsx';
import MenuHamburguesa from '../components/MenuHamburguesa';

const gold = '#FFD700';
const black = '#0a0a0a';
const darkCard = '#1a1a1a';
const lightGold = '#FFA500';

function getLikes(id) {
  const likes = JSON.parse(localStorage.getItem('likes') || '{}');
  return likes[id] || 0;
}
function setLike(id) {
  const likes = JSON.parse(localStorage.getItem('likes') || '{}');
  likes[id] = (likes[id] || 0) + 1;
  localStorage.setItem('likes', JSON.stringify(likes));
}
function getComments(id) {
  const comments = JSON.parse(localStorage.getItem('comments') || '{}');
  return comments[id] || [];
}
function addComment(id, text) {
  const comments = JSON.parse(localStorage.getItem('comments') || '{}');
  if (!comments[id]) comments[id] = [];
  comments[id].push({ text, date: new Date().toISOString() });
  localStorage.setItem('comments', JSON.stringify(comments));
}

export default function HomePage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [likesState, setLikesState] = useState({});
  const [commentsState, setCommentsState] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [shareFeedback, setShareFeedback] = useState({});
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('feed');
  const [userStats] = useState({
    partidos: 12,
    goles: 8,
    asistencias: 5,
    cards: 2,
    nivel: 15
  });
  const [feedbackNav, setFeedbackNav] = useState('');


  // Notificaciones en tiempo real
  const notification = useWebSocketNotifications();

  // Comentarios en tiempo real
  useWebSocketComments((mediaId, comentario) => {
    setCommentsState(prev => ({
      ...prev,
      [mediaId]: [...(prev[mediaId] || []), comentario]
    }));
  });

  // Likes en tiempo real
  useWebSocketLikes((mediaId, likes) => {
    setLikesState(prev => ({
      ...prev,
      [mediaId]: likes
    }));
  });

  // Cargar galería real al montar

  useEffect(() => {
    (async () => {
      const gallery = await stubFetchGalleryAndComments();
      setPublicaciones(gallery);
      console.log('[INTEGRACIÓN STUB] fetchGalleryAndComments ejecutado (HomePage.jsx)');
    })();
  }, []);


  useEffect(() => {
    (async () => {
      const usuario = await stubFetchUsuario();
      setUsuario(usuario);
      console.log('[INTEGRACIÓN STUB] fetchUsuario ejecutado (HomePage.jsx)');
    })();
  }, []);

  // Like real

  // Usar stub para likes

  // Compartir publicación

  // Usar stub para compartir


  // Enviar comentario real

  // Usar stub para comentar

  // Filtrar publicaciones por búsqueda
  const publicacionesFiltradas = publicaciones.filter(pub =>
    pub.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    pub.descripcion?.toLowerCase().includes(search.toLowerCase())
  );

  // Manejo de acciones del menú hamburguesa

  // Usar stub para acciones del menú

  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${black} 0%, #1a1a1a 50%, ${black} 100%)`, 
      minHeight: '100vh', 
      color: gold,
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        background: `linear-gradient(135deg, ${darkCard} 0%, #2a2a2a 100%)`,
        borderBottom: `2px solid ${gold}`,
        padding: '20px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo y título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <FutproLogo size={48} />
            <div>
              <h1 style={{ 
                fontSize: 28, 
                fontWeight: 'bold', 
                margin: 0,
                background: `linear-gradient(45deg, ${gold}, ${lightGold})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                FutPro
              </h1>
              <p style={{ 
                fontSize: 14, 
                color: '#ccc', 
                margin: 0 
              }}>
                ¡Bienvenido de vuelta!
              </p>
            </div>
          </div>

          {/* Barra de búsqueda y acciones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Buscar jugadores, equipos..." 
                style={{ 
                  padding: '12px 40px 12px 16px',
                  borderRadius: 25,
                  border: `2px solid ${gold}`,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: gold,
                  fontSize: 16,
                  width: 280,
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
                onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              />
              <span style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 18,
                color: gold
              }}>🔍</span>
            </div>
            
            <button style={{
              background: 'transparent',
              border: `2px solid ${gold}`,
              borderRadius: '50%',
              width: 48,
              height: 48,
              color: gold,
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = gold;
              e.target.style.color = black;
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = gold;
            }}
            >
              🔔
            </button>
          </div>
        </div>
      </header>

      {/* Stories Section - Tipo Instagram */}
      <div style={{
        background: black,
        padding: '15px 0',
        borderBottom: '1px solid #333',
        marginBottom: 10
      }}>
        <div style={{
          display: 'flex',
          gap: 15,
          overflowX: 'auto',
          padding: '0 15px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Story del usuario */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            minWidth: 70
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${gold}, ${lightGold})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
              position: 'relative'
            }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                👤
              </div>
              <div style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: gold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}>
                ➕
              </div>
            </div>
            <span style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>Tu historia</span>
          </div>

          {/* Stories de ejemplo */}
          {[
            { name: 'Messi', avatar: '⚽', hasStory: true },
            { name: 'Ronaldo', avatar: '💪', hasStory: true },
            { name: 'Neymar', avatar: '🌟', hasStory: false },
            { name: 'Mbappé', avatar: '🚀', hasStory: true },
            { name: 'Benzema', avatar: '👑', hasStory: true }
          ].map((user, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              minWidth: 70
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: user.hasStory ? `linear-gradient(45deg, ${gold}, #ff6b6b, #4ecdc4, ${lightGold})` : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 5,
                padding: user.hasStory ? 2 : 0
              }}>
                <div style={{
                  width: user.hasStory ? 54 : 60,
                  height: user.hasStory ? 54 : 60,
                  borderRadius: '50%',
                  background: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  {user.avatar}
                </div>
              </div>
              <span style={{ color: '#fff', fontSize: 12, textAlign: 'center' }}>{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navegación de secciones */}
      <nav style={{
        background: darkCard,
        padding: '20px 0',
        borderBottom: `1px solid #333`,
        position: 'sticky',
        top: 88,
        zIndex: 40
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: 40
        }}>
          {[
            { id: 'feed', label: 'Feed', icon: '📰' },
            { id: 'stats', label: 'Estadísticas', icon: '📊' },
            { id: 'matches', label: 'Partidos', icon: '⚽' },
            { id: 'friends', label: 'Amigos', icon: '👥' },
            { id: 'live', label: 'En Vivo', icon: '📺' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                background: activeSection === section.id 
                  ? `linear-gradient(135deg, ${gold} 0%, ${lightGold} 100%)` 
                  : 'transparent',
                color: activeSection === section.id ? black : gold,
                border: activeSection === section.id ? 'none' : `2px solid #444`,
                borderRadius: 25,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
                minWidth: 140
              }}
              onMouseOver={(e) => {
                if (activeSection !== section.id) {
                  e.target.style.borderColor = gold;
                  e.target.style.background = 'rgba(255, 215, 0, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== section.id) {
                  e.target.style.borderColor = '#444';
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 20px 100px 20px',
        width: '100%'
      }}>
        {/* Panel de estadísticas personales */}
        {activeSection === 'stats' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              marginBottom: 30,
              textAlign: 'center',
              background: `linear-gradient(45deg, ${gold}, ${lightGold})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Mis Estadísticas
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 25,
              marginBottom: 40
            }}>
              {[
                { label: 'Partidos Jugados', value: userStats.partidos, icon: '⚽', color: gold },
                { label: 'Goles', value: userStats.goles, icon: '🥅', color: '#ff6b6b' },
                { label: 'Asistencias', value: userStats.asistencias, icon: '🅰️', color: '#4ecdc4' },
                { label: 'Cards Generadas', value: userStats.cards, icon: '🎴', color: lightGold },
                { label: 'Nivel', value: userStats.nivel, icon: '⭐', color: '#a8e6cf' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: `linear-gradient(135deg, ${darkCard} 0%, #2a2a2a 100%)`,
                  borderRadius: 20,
                  padding: 25,
                  border: `2px solid ${stat.color}`,
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: 48, marginBottom: 15 }}>{stat.icon}</div>
                  <div style={{ 
                    fontSize: 36, 
                    fontWeight: 'bold', 
                    color: stat.color,
                    marginBottom: 8
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: 16, 
                    color: '#ccc',
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Feed de publicaciones */}
        {activeSection === 'feed' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              marginBottom: 30,
              textAlign: 'center',
              background: `linear-gradient(45deg, ${gold}, ${lightGold})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Feed de Publicaciones
            </h2>
            
            {publicacionesFiltradas.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 60,
                background: darkCard,
                borderRadius: 20,
                border: `2px solid #333`,
                marginBottom: 30
              }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📰</div>
                <h3 style={{ color: gold, fontSize: 24, marginBottom: 10 }}>No hay publicaciones aún</h3>
                <p style={{ color: '#ccc', fontSize: 16 }}>¡Sé el primero en compartir algo increíble!</p>
              </div>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: 30,
              marginBottom: 40
            }}>
              {publicacionesFiltradas.map(pub => (
                <div key={pub.id} style={{ 
                  background: `linear-gradient(135deg, ${darkCard} 0%, #2a2a2a 100%)`,
                  borderRadius: 20, 
                  padding: 20, 
                  border: `2px solid #333`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = gold;
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                }}
                >
                  {/* Contenido multimedia */}
                  {pub.tipo === 'imagen' && (
                    <div style={{ position: 'relative', marginBottom: 15 }}>
                      <img 
                        src={pub.url} 
                        alt={pub.nombre} 
                        style={{ 
                          width: '100%', 
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 15
                        }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: 20,
                        padding: '5px 12px',
                        fontSize: 12,
                        color: gold,
                        fontWeight: 'bold'
                      }}>
                        📸 IMAGEN
                      </div>
                    </div>
                  )}
                  
                  {pub.tipo === 'video' && (
                    <div style={{ position: 'relative', marginBottom: 15 }}>
                      <video 
                        src={pub.url} 
                        controls 
                        style={{ 
                          width: '100%', 
                          height: 200,
                          borderRadius: 15,
                          objectFit: 'cover'
                        }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: 20,
                        padding: '5px 12px',
                        fontSize: 12,
                        color: gold,
                        fontWeight: 'bold'
                      }}>
                        🎥 VIDEO
                      </div>
                    </div>
                  )}

                  {/* Información del post */}
                  <div style={{ marginBottom: 15 }}>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      fontSize: 18,
                      color: gold,
                      marginBottom: 8,
                      lineHeight: 1.4
                    }}>
                      {pub.nombre}
                    </h3>
                    
                    <div style={{ 
                      fontSize: 14, 
                      color: '#888', 
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <span>🕒</span>
                      <span>{pub.fecha ? new Date(pub.fecha).toLocaleString() : 'Hace un momento'}</span>
                    </div>
                    
                    <p style={{ 
                      fontSize: 15, 
                      color: '#ccc', 
                      lineHeight: 1.5,
                      margin: 0
                    }}>
                      {pub.descripcion || 'Sin descripción'}
                    </p>
                  </div>

                  {/* Acciones del post */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: 15,
                    padding: '12px 0',
                    borderTop: '1px solid #333',
                    borderBottom: '1px solid #333'
                  }}>
                    <button 
                      onClick={() => handleLike(pub.id)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: gold,
                        fontSize: 16,
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.color = lightGold;
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.color = gold;
                      }}
                    >
                      <span style={{ fontSize: 20 }}>⚽</span>
                      <span>{likesState[pub.id] || 0}</span>
                      <span style={{ fontSize: 14 }}>Me gusta</span>
                    </button>

                    <button 
                      onClick={() => handleShare(pub.id)} 
                      style={{ 
                        background: `linear-gradient(135deg, ${gold} 0%, ${lightGold} 100%)`,
                        color: black, 
                        border: 'none', 
                        borderRadius: 20, 
                        padding: '8px 16px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer', 
                        fontSize: 14,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📤 Compartir
                    </button>
                  </div>

                  {/* Sección de comentarios */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      gap: 10, 
                      marginBottom: 15 
                    }}>
                      <input
                        type="text"
                        placeholder="Agregar comentario..."
                        value={commentInputs[pub.id] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [pub.id]: e.target.value }))}
                        style={{ 
                          flex: 1,
                          padding: '10px 15px',
                          borderRadius: 20,
                          border: `2px solid #444`,
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = gold}
                        onBlur={(e) => e.target.style.borderColor = '#444'}
                      />
                      <button 
                        onClick={() => handleComment(pub.id)} 
                        style={{ 
                          background: gold,
                          color: black, 
                          border: 'none', 
                          borderRadius: 20, 
                          padding: '10px 20px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          fontSize: 14,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = lightGold;
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = gold;
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        💬
                      </button>
                    </div>

                    {/* Lista de comentarios */}
                    <div style={{ 
                      maxHeight: 120, 
                      overflowY: 'auto', 
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 15,
                      padding: 12
                    }}>
                      {(commentsState[pub.id] || []).length === 0 ? (
                        <p style={{ 
                          color: '#666', 
                          fontSize: 14, 
                          textAlign: 'center',
                          margin: 0
                        }}>
                          Sin comentarios aún
                        </p>
                      ) : (
                        (commentsState[pub.id] || []).map((c, i) => (
                          <div key={i} style={{ 
                            marginBottom: 8,
                            padding: '8px 12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 10,
                            borderLeft: `3px solid ${gold}`
                          }}>
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 4
                            }}>
                              <span style={{ 
                                color: gold, 
                                fontWeight: 'bold',
                                fontSize: 14
                              }}>
                                Usuario
                              </span>
                              <span style={{ 
                                color: '#888', 
                                fontSize: 12 
                              }}>
                                {c.date ? new Date(c.date).toLocaleTimeString() : 'Ahora'}
                              </span>
                            </div>
                            <p style={{ 
                              color: '#fff',
                              fontSize: 14,
                              margin: 0,
                              lineHeight: 1.4
                            }}>
                              {c.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Feedback de compartir */}
                  {shareFeedback[pub.id] && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(0, 200, 0, 0.9)',
                      color: '#fff',
                      padding: '5px 12px',
                      borderRadius: 15,
                      fontSize: 12,
                      fontWeight: 'bold',
                      animation: 'pulse 0.5s ease'
                    }}>
                      ✅ {shareFeedback[pub.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Sección de Partidos */}
        {activeSection === 'matches' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              marginBottom: 30,
              textAlign: 'center',
              background: `linear-gradient(45deg, ${gold}, ${lightGold})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Mis Partidos
            </h2>

            {/* Próximos partidos */}
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginBottom: 20,
                color: gold,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span>🔜</span> Próximos Partidos
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: 20
              }}>
                {[
                  {
                    id: 1,
                    equipoLocal: 'FC Barcelona',
                    equipoVisitante: 'Real Madrid',
                    fecha: '2025-09-25',
                    hora: '20:00',
                    estadio: 'Camp Nou',
                    competicion: 'La Liga'
                  },
                  {
                    id: 2,
                    equipoLocal: 'Manchester City',
                    equipoVisitante: 'Liverpool',
                    fecha: '2025-09-28',
                    hora: '18:30',
                    estadio: 'Etihad Stadium',
                    competicion: 'Premier League'
                  }
                ].map(partido => (
                  <div key={partido.id} style={{
                    background: `linear-gradient(135deg, ${darkCard} 0%, #2a2a2a 100%)`,
                    borderRadius: 20,
                    padding: 25,
                    border: `2px solid ${gold}`,
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 215, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 215, 0, 0.1)';
                  }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20
                    }}>
                      <div style={{
                        background: lightGold,
                        color: black,
                        padding: '5px 15px',
                        borderRadius: 15,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {partido.competicion}
                      </div>
                      <div style={{ color: '#ccc', fontSize: 14 }}>
                        📅 {new Date(partido.fecha).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: 20
                    }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                          {partido.equipoLocal}
                        </div>
                        <div style={{ fontSize: 14, color: '#ccc', marginTop: 5 }}>
                          Local
                        </div>
                      </div>

                      <div style={{ 
                        textAlign: 'center',
                        padding: '0 20px'
                      }}>
                        <div style={{ 
                          fontSize: 24, 
                          fontWeight: 'bold', 
                          color: gold,
                          marginBottom: 5
                        }}>
                          VS
                        </div>
                        <div style={{ 
                          fontSize: 16, 
                          color: lightGold,
                          fontWeight: 'bold'
                        }}>
                          {partido.hora}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                          {partido.equipoVisitante}
                        </div>
                        <div style={{ fontSize: 14, color: '#ccc', marginTop: 5 }}>
                          Visitante
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      textAlign: 'center',
                      padding: '15px',
                      background: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: 15,
                      border: `1px solid ${gold}`
                    }}>
                      <div style={{ fontSize: 14, color: gold, fontWeight: 'bold' }}>
                        📍 {partido.estadio}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resultados recientes */}
            <div>
              <h3 style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginBottom: 20,
                color: gold,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span>📊</span> Resultados Recientes
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: 20
              }}>
                {[
                  {
                    id: 1,
                    equipoLocal: 'Real Madrid',
                    equipoVisitante: 'Atletico Madrid',
                    resultadoLocal: 2,
                    resultadoVisitante: 1,
                    fecha: '2025-09-20',
                    estado: 'Finalizado'
                  },
                  {
                    id: 2,
                    equipoLocal: 'Barcelona',
                    equipoVisitante: 'Sevilla',
                    resultadoLocal: 3,
                    resultadoVisitante: 0,
                    fecha: '2025-09-18',
                    estado: 'Finalizado'
                  },
                  {
                    id: 3,
                    equipoLocal: 'Valencia',
                    equipoVisitante: 'Villarreal',
                    resultadoLocal: 1,
                    resultadoVisitante: 1,
                    fecha: '2025-09-15',
                    estado: 'Finalizado'
                  }
                ].map(resultado => (
                  <div key={resultado.id} style={{
                    background: `linear-gradient(135deg, ${darkCard} 0%, #2a2a2a 100%)`,
                    borderRadius: 15,
                    padding: 20,
                    border: `1px solid #333`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = gold;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 15
                    }}>
                      <div style={{
                        background: '#4CAF50',
                        color: '#fff',
                        padding: '3px 10px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {resultado.estado}
                      </div>
                      <div style={{ color: '#ccc', fontSize: 12 }}>
                        📅 {new Date(resultado.fecha).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                          {resultado.equipoLocal}
                        </div>
                      </div>

                      <div style={{ 
                        textAlign: 'center',
                        padding: '0 20px'
                      }}>
                        <div style={{ 
                          fontSize: 24, 
                          fontWeight: 'bold', 
                          color: gold
                        }}>
                          {resultado.resultadoLocal} - {resultado.resultadoVisitante}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                          {resultado.equipoVisitante}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Botón flotante para crear post - Tipo Instagram */}
      <button 
        onClick={() => navigate('/crear-post')}
        style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${gold}, ${lightGold})`,
          border: 'none',
          color: black,
          fontSize: 24,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
          zIndex: 40,
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(255, 215, 0, 0.6)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.4)';
        }}
      >
        ➕
      </button>
      
      {/* Barra de navegación inferior - Tipo Instagram */}
      <nav style={{ position: 'fixed', left: 0, bottom: 0, width: '100vw', background: black, borderTop: `2px solid ${gold}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 64, zIndex: 30 }}>
        <button 
          onClick={() => { setFeedbackNav('Home'); setTimeout(()=>{ setFeedbackNav(''); }, 400); }} 
          style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}
        >
          <span role="img" aria-label="home">🏠</span>
          <span style={{ fontSize: 12 }}>Home</span>
        </button>
        
        <button 
          onClick={() => { setFeedbackNav('Búsqueda'); setTimeout(()=>{ setFeedbackNav(''); }, 400); }} 
          style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}
        >
          <span role="img" aria-label="search">�</span>
          <span style={{ fontSize: 12 }}>Buscar</span>
        </button>
        
        {/* Espacio para el botón flotante */}
        <div style={{ width: 60 }}></div>
        
        <button 
          onClick={() => { setFeedbackNav('Notificaciones'); setTimeout(()=>{ window.location.href='/notificaciones'; }, 400); }} 
          style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}
        >
          <span role="img" aria-label="likes">❤️</span>
          <span style={{ fontSize: 12 }}>Likes</span>
        </button>
        
        <button 
          onClick={() => { setFeedbackNav('Perfil'); setTimeout(()=>{ window.location.href='/perfil'; }, 400); }} 
          style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}
        >
          <span role="img" aria-label="profile">�</span>
          <span style={{ fontSize: 12 }}>Perfil</span>
        </button>
      </nav>
      
      {feedbackNav && <div style={{position:'fixed',bottom:70,left:0,width:'100vw',textAlign:'center',color:gold,fontWeight:'bold',fontSize:18,zIndex:99,background:'#232323cc',padding:'8px 0',borderRadius:8}}>{feedbackNav}</div>}

      {/* Componente del menú hamburguesa */}
      <MenuHamburguesa onAccion={handleAccion} />
    </div>
  );
}
