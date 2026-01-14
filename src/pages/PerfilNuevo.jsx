import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import cardManager from '../services/CardManager';

export default function PerfilNuevo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [momentos, setMomentos] = useState([]);
  const [seguidores, setSeguidores] = useState(0);
  const [siguiendo, setSiguiendo] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    try {
      console.log('🔄 Iniciando cargarDatos para user:', user.id);
      
      // Cargar card
      const card = await cardManager.getCard(user.id);
      console.log('📊 Card obtenido:', card);

      // Si faltan peso/categoría, intentar completarlos desde usuarios y persistir
      if (card && (!card.peso || !card.categoria)) {
        const { data: perfil } = await supabase
          .from('usuarios')
          .select('peso, categoria')
          .eq('id', user.id)
          .maybeSingle();

        const needsUpdate = {};
        if (!card.peso && perfil?.peso) needsUpdate.peso = perfil.peso;
        if (!card.categoria && perfil?.categoria) needsUpdate.categoria = perfil.categoria;

        if (Object.keys(needsUpdate).length > 0) {
          const updated = await cardManager.updateCard(user.id, needsUpdate);
          setCardData(updated || card);
        } else {
          setCardData(card);
        }
      } else {
        setCardData(card);
      }

      // Cargar seguidores/siguiendo reales
      const { data: followersData, error: followersError } = await supabase
        .from('friends')
        .select('id')
        .eq('friend_id', user.id);
      if (followersError) {
        console.error('❌ Error en query seguidores:', followersError);
      } else {
        console.log('👥 Seguidores (friend_id=user.id):', followersData?.length || 0);
      }
      setSeguidores(followersData?.length || 0);

      const { data: followingData, error: followingError } = await supabase
        .from('friends')
        .select('id')
        .eq('user_id', user.id);
      if (followingError) {
        console.error('❌ Error en query siguiendo:', followingError);
      } else {
        console.log('📍 Siguiendo (user_id=user.id):', followingData?.length || 0);
      }
      setSiguiendo(followingData?.length || 0);

      // Cargar momentos (posts)
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (postsError) {
        console.error('❌ Error en query posts:', postsError);
      } else {
        console.log('📸 Posts/Momentos:', postsData?.length || 0);
      }
      setMomentos(postsData || []);
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabase.from('post_likes').delete().eq('id', existing.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
      cargarDatos();
    } catch (error) {
      console.error('Error con like:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>
        <div style={{ fontSize: '1.5rem' }}>⚽ Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Menú superior desplegable */}
      <div style={{
        background: '#0a0a0a',
        borderBottom: '2px solid #FFD700',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFD700' }}>⚽ FutPro</div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#FFD700',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ☰ Menú
        </button>
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            background: '#1a1a1a',
            border: '2px solid #FFD700',
            borderRadius: '12px',
            padding: '15px',
            minWidth: '200px',
            boxShadow: '0 8px 24px rgba(255,215,0,0.3)'
          }}>
            <div onClick={() => navigate('/')} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}>🏠 Inicio</div>
            <div onClick={() => navigate('/perfil-card')} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}>🎴 Mi Card</div>
            <div onClick={() => navigate('/ranking')} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}>🏆 Ranking</div>
            <div onClick={() => navigate('/equipos')} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}>⚽ Equipos</div>
            <div onClick={() => navigate('/torneos')} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}>🏅 Torneos</div>
            <div onClick={() => navigate('/amigos')} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}>👥 Amigos</div>
            <div onClick={() => navigate('/configuracion')} style={{ padding: '10px', cursor: 'pointer' }}>⚙️ Configuración</div>
          </div>
        )}
      </div>

      {/* Layout principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '20px',
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Columna izquierda: Card */}
        <div style={{ position: 'sticky', top: '80px', height: 'fit-content' }}>
          {/* Card FutPro */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '20px',
            border: '3px solid #FFD700',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(255,215,0,0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FFD700' }}>
                {cardData?.card_tier?.toUpperCase() || 'FUTPRO'}
              </div>
              <div style={{ fontSize: '1rem', color: '#ccc' }}>{cardData?.puntos_totales || 15} PUNTOS</div>
            </div>

            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid #FFD700',
              overflow: 'hidden',
              margin: '0 auto 15px',
              background: '#333'
            }}>
              <img 
                src={cardData?.avatar_url || `https://i.pravatar.cc/300?u=${user?.id}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Avatar"
              />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#fff' }}>
                {cardData?.nombre || 'Jugador'} {cardData?.apellido || ''}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#FFD700' }}>{cardData?.ciudad || '—'}, {cardData?.pais || '—'}</div>
              <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '5px' }}>{cardData?.categoria || 'mixto'}</div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ background: 'rgba(255,215,0,0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#FFD700' }}>POSICIÓN</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{cardData?.posicion_favorita || 'multiple'}</div>
              </div>
              <div style={{ background: 'rgba(255,215,0,0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#FFD700' }}>EDAD</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{cardData?.edad || '29'}</div>
              </div>
              <div style={{ background: 'rgba(255,215,0,0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#FFD700' }}>PESO</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{cardData?.peso || '—'}</div>
              </div>
              <div style={{ background: 'rgba(255,215,0,0.1)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#FFD700' }}>ALTURA</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>{cardData?.estatura || cardData?.altura || '—'}</div>
              </div>
            </div>
          </div>

          {/* (KPIs y publicar movidos a cabecera de la columna derecha) */}
        </div>

        {/* Columna derecha: KPIs + Publicar + Feed de Momentos */}
        <div>
          {/* Cabecera KPIs + Publicar */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '2px solid #FFD700',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFD700' }}>{seguidores}</div>
                <div style={{ fontSize: '0.8rem', color: '#ccc' }}>FANS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFD700' }}>{siguiendo}</div>
                <div style={{ fontSize: '0.8rem', color: '#ccc' }}>SIGUIENDO</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFD700' }}>{momentos.length}</div>
                <div style={{ fontSize: '0.8rem', color: '#ccc' }}>MOMENTOS</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/crear-publicacion')}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              + Publicar
            </button>
          </div>

          <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '1.5rem' }}>📸 Momentos</h2>
          
          {momentos.length === 0 ? (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: '40px',
              textAlign: 'center',
              border: '2px dashed #FFD700'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
              <div style={{ fontSize: '1.2rem', color: '#ccc' }}>Aún no has compartido momentos</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {momentos.map((momento) => (
                <div key={momento.id} style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  border: '2px solid #333',
                  overflow: 'hidden'
                }}>
                  {/* Header del post */}
                  <div style={{
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #333'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#FFD700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>⚽</div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{cardData?.nombre || 'Jugador'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>Hace 2 horas</div>
                      </div>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer' }}>⋯</button>
                  </div>

                  {/* Imagen/Video */}
                  {momento.media_url && (
                    <div style={{ background: '#000', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={momento.media_url} style={{ maxWidth: '100%', maxHeight: '600px' }} alt="Momento" />
                    </div>
                  )}

                  {/* Acciones */}
                  <div style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                      <button onClick={() => handleLike(momento.id)} style={{ background: 'transparent', border: 'none', color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer' }}>⚽ {momento.likes || 0}</button>
                      <button style={{ background: 'transparent', border: 'none', color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer' }}>💬 {momento.comments || 0}</button>
                      <button style={{ background: 'transparent', border: 'none', color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer' }}>🔖</button>
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>
                      <strong>{cardData?.nombre}</strong> {momento.caption || ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button
              style={{
                background: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Subir momento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
