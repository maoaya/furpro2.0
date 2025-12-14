import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { MatchParticipationService } from '../services/MatchParticipationService';
import TournamentInviteBanner from '../components/TournamentInviteBanner.jsx';
import NotificationsBell from '../components/NotificationsBell.jsx';
import { NotificationsProvider } from '../context/NotificationsContext.jsx';

export default function Perfil() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tarjetas');
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    partidos: 0,
    equipos: 0,
    torneos: 0,
    seguidores: 0,
    siguiendo: 0
  });
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadUserData();
    loadStats();
    loadContent();
    // Realtime counters for followers/following
    const channelFriends = supabase
      .channel('perfil:friends')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'friends' }, (payload) => {
        const f = payload.new
        if (!f) return
        if (f.friend_email === user?.email) {
          setStats(prev => ({ ...prev, seguidores: (prev.seguidores || 0) + 1 }))
        }
        if (f.user_email === user?.email) {
          setStats(prev => ({ ...prev, siguiendo: (prev.siguiendo || 0) + 1 }))
        }
      })
      .subscribe()

    return () => { channelFriends.unsubscribe() }
  }, [user, activeTab]);

  const loadUserData = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (data) {
        setUserData(data);
      }
    } catch (err) {
      console.error('Error cargando usuario:', err);
    }
  };

  const loadStats = async () => {
    if (!user?.email) return;

    try {
      // Partidos jugados
      const participationStats = await MatchParticipationService.getPlayerStats(user.email);

      // Equipos
      const { data: teamsData } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_email', user.email);

      // Torneos organizados
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('id')
        .eq('organizer_email', user.email);

      setStats({
        partidos: participationStats.totalMatches || 0,
        equipos: teamsData?.length || 0,
        torneos: tournamentsData?.length || 0,
        seguidores: Math.floor(Math.random() * 50) + 10,
        siguiendo: Math.floor(Math.random() * 30) + 5
      });
    } catch (err) {
      console.error('Error cargando stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    if (!user?.email) return;

    if (activeTab === 'tarjetas') {
      // Cargar tarjetas del usuario (simulado)
      setCards([
        { id: 1, type: 'gold', ovr: 85 },
        { id: 2, type: 'rare', ovr: 88 },
        { id: 3, type: 'legend', ovr: 92 }
      ]);
    } else if (activeTab === 'equipos') {
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_email', user.email)
        .limit(6);
      setTeams(data || []);
    } else if (activeTab === 'partidos') {
      const history = await MatchParticipationService.getPlayerHistory(user.email, 6);
      setMatches(history || []);
    }
  };

  const FIFACard = ({ ovr, type, name, position }) => {
    const cardGradients = {
      gold: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
      rare: 'linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
      legend: 'linear-gradient(135deg, #8B4513 0%, #CD7F32 50%, #8B4513 100%)'
    };

    return (
      <div style={{
        width: '180px',
        height: '260px',
        background: cardGradients[type] || cardGradients.gold,
        borderRadius: '12px',
        padding: '16px',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '2px solid rgba(255,215,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%'
        }}>
          {/* OVR */}
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#000',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '8px'
          }}>
            {ovr}
          </div>

          {/* Position */}
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '16px'
          }}>
            {position}
          </div>

          {/* Avatar placeholder */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.2)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            ⚽
          </div>

          {/* Name */}
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            {name}
          </div>

          {/* Stats mini */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px',
            marginTop: 'auto',
            width: '100%',
            fontSize: '10px',
            color: '#000'
          }}>
            <div><strong>PAC</strong> 85</div>
            <div><strong>SHO</strong> 82</div>
            <div><strong>PAS</strong> 88</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}>
        <div style={{ fontSize: '24px' }}>⏳ Cargando perfil...</div>
      </div>
    );
  }

  return (
    <NotificationsProvider>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: '#fff'
    }}>
      {/* Header Profile - Estilo Instagram */}
      <div style={{
        background: '#181818',
        borderBottom: '1px solid #333',
        padding: '32px 0'
      }}>
        <div style={{
          maxWidth: '935px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <NotificationsBell />
          </div>
          <div style={{
            display: 'flex',
            gap: '60px',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            {/* FIFA Card como foto de perfil */}
            <div style={{
              flexShrink: 0
            }}>
              <FIFACard 
                ovr={userData?.ovr || 85}
                type="gold"
                name={userData?.nombre || user?.email?.split('@')[0] || 'Jugador'}
                position="CAM"
              />
            </div>

            {/* Info del usuario */}
            <div style={{
              flex: 1
            }}>
              {/* Username y botones */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '300',
                  margin: 0
                }}>
                  {userData?.nombre || user?.email?.split('@')[0]}
                </h1>
                <button
                  onClick={() => navigate('/editar-perfil')}
                  style={{
                    background: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px 24px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Editar perfil
                </button>
                <button
                  onClick={() => navigate('/configuracion')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️
                </button>
              </div>

              {/* Stats - Estilo Instagram */}
              <div style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '20px',
                fontSize: '16px'
              }}>
                <div>
                  <strong>{stats.partidos}</strong> partidos
                </div>
                <div>
                  <strong>{stats.equipos}</strong> equipos
                </div>
                <div>
                  <strong>{stats.torneos}</strong> torneos
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => navigate('/amigos')}>
                  <strong>{stats.seguidores}</strong> seguidores
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => navigate('/amigos')}>
                  <strong>{stats.siguiendo}</strong> siguiendo
                </div>
              </div>

              {/* Bio */}
              <div style={{
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {userData?.nombre || 'Jugador FutPro'} ⚽
                </div>
                <div style={{ color: '#aaa' }}>
                  {userData?.bio || '🏆 Apasionado del fútbol | 🎮 Gaming | ⚡ Siempre listo para un amistoso'}
                </div>
                <div style={{ color: '#FFD700', marginTop: '8px' }}>
                  📍 {userData?.ciudad || 'Ciudad'}, {userData?.pais || 'País'}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Estilo Instagram */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            borderTop: '1px solid #333',
            paddingTop: '0'
          }}>
            <button
              onClick={() => setActiveTab('tarjetas')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'tarjetas' ? '#FFD700' : '#aaa',
                borderTop: activeTab === 'tarjetas' ? '2px solid #FFD700' : '2px solid transparent',
                padding: '16px 0',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '-1px'
              }}
            >
              <span style={{ fontSize: '16px' }}>🎴</span>
              TARJETAS
            </button>
            <button
              onClick={() => setActiveTab('equipos')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'equipos' ? '#FFD700' : '#aaa',
                borderTop: activeTab === 'equipos' ? '2px solid #FFD700' : '2px solid transparent',
                padding: '16px 0',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '-1px'
              }}
            >
              <span style={{ fontSize: '16px' }}>👥</span>
              EQUIPOS
            </button>
            <button
              onClick={() => setActiveTab('partidos')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'partidos' ? '#FFD700' : '#aaa',
                borderTop: activeTab === 'partidos' ? '2px solid #FFD700' : '2px solid transparent',
                padding: '16px 0',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '-1px'
              }}
            >
              <span style={{ fontSize: '16px' }}>⚽</span>
              PARTIDOS
            </button>
            <button
              onClick={() => setActiveTab('logros')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'logros' ? '#FFD700' : '#aaa',
                borderTop: activeTab === 'logros' ? '2px solid #FFD700' : '2px solid transparent',
                padding: '16px 0',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '-1px'
              }}
            >
              <span style={{ fontSize: '16px' }}>🏆</span>
              LOGROS
            </button>
          </div>
        </div>
      </div>

      {/* Invitaciones a torneos */}
      <div style={{ maxWidth: '935px', margin: '0 auto', padding: '0 20px' }}>
        <TournamentInviteBanner />
      </div>

      {/* Content Grid - Estilo Instagram */}
      <div style={{
        maxWidth: '935px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        {activeTab === 'tarjetas' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {cards.map(card => (
              <div key={card.id} style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <FIFACard 
                  ovr={card.ovr}
                  type={card.type}
                  name={userData?.nombre || 'Jugador'}
                  position="CAM"
                />
              </div>
            ))}
            {/* Botón para crear nueva tarjeta */}
            <div
              onClick={() => navigate('/card-fifa')}
              style={{
                width: '280px',
                height: '320px',
                background: '#181818',
                border: '2px dashed #333',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.background = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.background = '#181818';
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>➕</div>
              <div style={{ color: '#aaa', fontSize: '16px' }}>Crear nueva tarjeta</div>
            </div>
          </div>
        )}

        {activeTab === 'equipos' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {teams.map(team => (
              <div
                key={team.id}
                onClick={() => navigate(`/equipo/${team.id}`)}
                style={{
                  background: '#181818',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD700';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '16px' }}>
                  🛡️
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', color: '#FFD700' }}>
                  {team.name}
                </div>
                <div style={{ fontSize: '14px', color: '#aaa', textAlign: 'center', marginTop: '8px' }}>
                  {team.category}
                </div>
              </div>
            ))}
            {/* Botón crear equipo */}
            <div
              onClick={() => navigate('/crear-equipo')}
              style={{
                background: '#181818',
                border: '2px dashed #333',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '180px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.background = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.background = '#181818';
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>➕</div>
              <div style={{ color: '#aaa', fontSize: '16px' }}>Crear nuevo equipo</div>
            </div>
          </div>
        )}

        {activeTab === 'partidos' && (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {matches.map((match, idx) => (
              <div
                key={idx}
                style={{
                  background: '#181818',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFD700', marginBottom: '8px' }}>
                    {match.matches?.type === 'amistoso' ? '🤝 Amistoso' : '🏆 Competitivo'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#aaa' }}>
                    {new Date(match.participated_at).toLocaleDateString('es-ES')}
                  </div>
                  <div style={{ fontSize: '14px', color: '#aaa', marginTop: '4px' }}>
                    📍 {match.matches?.location}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  +{match.points_earned} pts
                </div>
              </div>
            ))}
            {matches.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#aaa'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚽</div>
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>No has jugado partidos aún</div>
                <button
                  onClick={() => navigate('/amistoso')}
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  Crear Amistoso
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logros' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {[
              { icon: '🏆', title: 'Primer Partido', desc: 'Jugaste tu primer partido', unlocked: stats.partidos > 0 },
              { icon: '👥', title: 'Líder de Equipo', desc: 'Creaste tu primer equipo', unlocked: stats.equipos > 0 },
              { icon: '🎴', title: 'Coleccionista', desc: 'Creaste 5 tarjetas FIFA', unlocked: false },
              { icon: '⚡', title: 'Veterano', desc: 'Jugaste 10 partidos', unlocked: stats.partidos >= 10 },
              { icon: '🌟', title: 'Estrella', desc: 'Alcanza 90+ OVR', unlocked: (userData?.ovr || 0) >= 90 },
              { icon: '🔥', title: 'Imparable', desc: 'Gana 5 partidos seguidos', unlocked: false }
            ].map((logro, idx) => (
              <div
                key={idx}
                style={{
                  background: logro.unlocked ? '#181818' : '#0a0a0a',
                  border: `2px solid ${logro.unlocked ? '#FFD700' : '#333'}`,
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  opacity: logro.unlocked ? 1 : 0.4,
                  position: 'relative'
                }}
              >
                {!logro.unlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '24px'
                  }}>
                    🔒
                  </div>
                )}
                <div style={{ fontSize: '64px', marginBottom: '12px' }}>
                  {logro.icon}
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: logro.unlocked ? '#FFD700' : '#666',
                  marginBottom: '8px'
                }}>
                  {logro.title}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>
                  {logro.desc}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </NotificationsProvider>
  );
}