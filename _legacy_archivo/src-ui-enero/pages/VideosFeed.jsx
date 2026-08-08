import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const SHARED_STORAGE_KEY = 'futpro_shared_moments';

const persistSharedMoment = (moment) => {
  try {
    const stored = JSON.parse(localStorage.getItem(SHARED_STORAGE_KEY) || '[]');
    const exists = stored.find((m) => m.id === moment.id && m.type === moment.type);
    const next = exists ? stored : [{ ...moment, shared_at: new Date().toISOString() }, ...stored].slice(0, 50);
    localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('No se pudo guardar en Momentos compartidos:', err);
  }
};

export default function VideosFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [livestreams, setLivestreams] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [activeTab, setActiveTab] = useState('paraTi');
  const containerRef = useRef(null);
  const viewedRef = useRef(new Set());

  useEffect(() => {
    if (user) {
      cargarFollowers();
      loadVideos();
      loadLivestreams();
    }
  }, [activeTab, user]);

  const cargarFollowers = async () => {
    try {
      const { data } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);
      setFollowedUsers(data?.map(f => f.friend_id) || []);
    } catch (err) {
      console.error('Error cargando followers:', err);
    }
  };

  const loadVideos = async () => {
    try {
      // Cargar posts con media_url (videos)
      let query = supabase
        .from('posts')
        .select('*')
        .not('media_url', 'is', null)
        .order('created_at', { ascending: false });

      // Filtrar por seguidos si activeTab === 'siguiendo'
      if (activeTab === 'siguiendo' && followedUsers.length > 0) {
        query = query.in('user_id', followedUsers);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      // Formatear videos
      const formatted = await Promise.all(
        (data || []).map(async (p) => {
          const { data: cardData } = await supabase
            .from('carfutpro')
            .select('nombre, apellido, avatar_url, photo_url')
            .eq('user_id', p.user_id)
            .single();

          return {
            id: p.id,
            url: p.media_url || p.imagen_url,
            user: {
              name: cardData ? `${cardData.nombre} ${cardData.apellido || ''}`.trim() : 'Usuario',
              username: `@${cardData?.nombre || 'user'}`,
              avatar: cardData?.photo_url || cardData?.avatar_url || '👤'
            },
            description: p.contenido || p.caption || '',
            likes: p.likes_count ?? p.likes ?? 0,
            comments: p.comments_count ?? p.comments ?? 0,
            shares: p.shares_count ?? p.shares ?? 0,
            isLiked: false,
            views: p.views_count ?? p.views ?? 0,
            ubicacion: p.ubicacion || '—',
            created_at: p.created_at,
            user_id: p.user_id
          };
        })
      );

      setVideos(formatted);
    } catch (err) {
      console.error('Error cargando videos:', err);
      setVideos([]);
    }

    // Inicializar likes del localStorage
    const savedLikes = JSON.parse(localStorage.getItem('futpro_video_likes') || '{}');
    setLikes(savedLikes);
  };

  const loadLivestreams = async () => {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*, streamer:carfutpro!user_id(nombre, apellido, avatar_url, photo_url)')
        .eq('status', 'live')
        .order('viewers_count', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formatted = (data || []).map(stream => ({
        id: stream.id,
        title: stream.title,
        description: stream.description,
        thumbnail: stream.thumbnail_url || 'https://via.placeholder.com/400x225',
        streamer: {
          name: stream.streamer ? `${stream.streamer.nombre} ${stream.streamer.apellido || ''}`.trim() : 'Streamer',
          avatar: stream.streamer?.photo_url || stream.streamer?.avatar_url || '👤'
        },
        viewers: stream.viewers_count || 0,
        category: stream.category || 'En vivo',
        started_at: stream.started_at
      }));

      setLivestreams(formatted);
    } catch (err) {
      console.error('Error cargando livestreams:', err);
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);
    
    if (newIndex !== currentIndex && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    if (videos[currentIndex]) {
      registerView(videos[currentIndex]);
    }
  }, [currentIndex, videos]);

  const registerView = async (video) => {
    if (!video || viewedRef.current.has(video.id)) return;
    viewedRef.current.add(video.id);

    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, views: (v.views || 0) + 1 } : v));

    try {
      const rpcResponse = await supabase.rpc('increment_post_view', { post_id: video.id });
      if (rpcResponse.error) throw rpcResponse.error;
    } catch (err) {
      try {
        await supabase
          .from('posts')
          .update({ views_count: (video.views || 0) + 1 })
          .eq('id', video.id);
      } catch (fallbackErr) {
        console.error('Error registrando vista (rpc y fallback):', fallbackErr);
      }
    }
  };

  const handleLike = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    const isCurrentlyLiked = likes[videoId] || false;
    
    const updatedLikes = {
      ...likes,
      [videoId]: !isCurrentlyLiked
    };
    
    setLikes(updatedLikes);
    localStorage.setItem('futpro_video_likes', JSON.stringify(updatedLikes));

    // Actualizar contador en el array
    setVideos(prev => prev.map(v => 
      v.id === videoId 
        ? { ...v, likes: v.likes + (isCurrentlyLiked ? -1 : 1), isLiked: !isCurrentlyLiked }
        : v
    ));
  };

  const handleDoubleTap = (videoId) => {
    handleLike(videoId);
    
    // Animación corazón (implementar con estado adicional si se desea)
    console.log('❤️ Like animado en video', videoId);
  };

  const handleComment = (videoId) => {
    setShowComments(true);
  };

  const handleShare = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    persistSharedMoment({
      id: video.id,
      type: 'video',
      user: video.user?.name || 'Usuario',
      image: video.url,
      description: video.description || '',
      ubicacion: video.ubicacion || '—',
      created_at: video.created_at || new Date().toISOString(),
      likes: video.likes || 0,
      views: video.views || 0
    });
    if (navigator.share) {
      navigator.share({
        title: `Video de ${video.user.name}`,
        text: video.description,
        url: window.location.href
      });
    } else {
      alert('Compartir: ' + video.description);
    }

    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, shares: (v.shares || 0) + 1 } : v));
  };

  const currentVideo = videos[currentIndex];

  return (
    <div style={styles.container}>
      {/* Header con botón atrás */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
          ← Atrás
        </button>
        <h2 style={{ margin: 0, color: '#FFD700', flex: 1, fontSize: '16px', fontWeight: 'bold' }}>Vídeos</h2>
      </div>

      {/* Tabs superiores */}
      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'paraTi' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('paraTi')}
        >
          Para ti
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'siguiendo' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('siguiendo')}
        >
          Siguiendo
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'enVivo' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('enVivo')}
        >
          🔴 En Vivo
        </button>
      </div>

      {/* Transmisiones en vivo */}
      {activeTab === 'enVivo' && (
        <div style={{ padding: '16px', background: '#000', minHeight: '100vh' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>🔴 Transmisiones en vivo</h2>
          {livestreams.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
              No hay transmisiones activas en este momento
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {livestreams.map(stream => (
                <div key={stream.id} style={{
                  background: '#1a1a1a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #FF0050',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/stream/${stream.id}`)}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={stream.thumbnail} alt={stream.title} style={{ width: '100%', display: 'block' }} />
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: '#FF0050',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      🔴 EN VIVO
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      👁️ {stream.viewers}
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '24px' }}>{stream.streamer.avatar}</div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 'bold' }}>{stream.streamer.name}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{stream.category}</div>
                      </div>
                    </div>
                    <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '4px' }}>{stream.title}</div>
                    <div style={{ color: '#ccc', fontSize: '14px' }}>{stream.description || 'Transmisión en vivo'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenedor de videos */}
      {activeTab !== 'enVivo' && (
      <div 
        ref={containerRef}
        style={styles.videosContainer}
        onScroll={handleScroll}
      >
        {videos.map((video, index) => (
          <div key={video.id} style={styles.videoWrapper}>
            <video
              src={video.url}
              style={styles.video}
              loop
              autoPlay={index === currentIndex}
              muted
              playsInline
              onDoubleClick={() => handleDoubleTap(video.id)}
            />

            {/* Información del video */}
            <div style={styles.videoInfo}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>{video.user.avatar}</div>
                <div>
                  <div style={styles.username}>{video.user.name}</div>
                  <div style={styles.handle}>{video.user.username}</div>
                  <div style={{ color: '#ccc', fontSize: '12px', marginTop: 4 }}>📍 {video.ubicacion || '—'}</div>
                </div>
                <button style={styles.followBtn}>Seguir</button>
              </div>

              <p style={styles.description}>{video.description}</p>
            </div>

            {/* Botones laterales */}
            <div style={styles.sideActions}>
              <button 
                style={styles.actionBtn}
                onClick={() => handleLike(video.id)}
              >
                <div style={{
                  ...styles.actionIcon,
                  color: likes[video.id] ? '#FF0050' : '#fff'
                }}>
                  ❤️
                </div>
                <div style={styles.actionText}>{video.likes}</div>
              </button>

              <button 
                style={styles.actionBtn}
                onClick={() => handleComment(video.id)}
              >
                <div style={styles.actionIcon}>💬</div>
                <div style={styles.actionText}>{video.comments}</div>
              </button>

              <button 
                style={styles.actionBtn}
                onClick={() => handleShare(video.id)}
              >
                <div style={styles.actionIcon}>📤</div>
                <div style={styles.actionText}>{video.shares}</div>
              </button>

              <button 
                style={styles.actionBtn}
                onClick={() => navigate(`/perfil/${video.user.username}`)}
              >
                <div style={styles.actionIcon}>👤</div>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Modal de comentarios */}
      {showComments && currentVideo && (
        <div style={styles.commentsModal} onClick={() => setShowComments(false)}>
          <div style={styles.commentsContent} onClick={e => e.stopPropagation()}>
            <div style={styles.commentsHeader}>
              <h3 style={styles.commentsTitle}>{currentVideo.comments} comentarios</h3>
              <button 
                style={styles.closeBtn}
                onClick={() => setShowComments(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.commentsList}>
              <p style={styles.emptyComments}>Sin comentarios aún (implementar)</p>
            </div>

            <div style={styles.commentInput}>
              <input 
                type="text" 
                placeholder="Agregar comentario..." 
                style={styles.input}
              />
              <button style={styles.sendBtn}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    background: '#000',
    overflow: 'hidden'
  },
  tabs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    padding: 16,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 10
  },
  tab: {
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
    padding: '8px 16px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent'
  },
  tabActive: {
    color: '#fff',
    borderBottom: '2px solid #fff'
  },
  videosContainer: {
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth'
  },
  videoWrapper: {
    position: 'relative',
    height: '100vh',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  videoInfo: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 80,
    zIndex: 5
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
  },
  handle: {
    fontSize: 12,
    color: '#ddd',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
  },
  followBtn: {
    marginLeft: 'auto',
    padding: '6px 16px',
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  description: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 1.4,
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    margin: 0
  },
  sideActions: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    zIndex: 5
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4
  },
  actionIcon: {
    fontSize: 32,
    filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))'
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
  },
  commentsModal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end'
  },
  commentsContent: {
    width: '100%',
    maxHeight: '70vh',
    background: '#1a1a1a',
    borderRadius: '16px 16px 0 0',
    padding: 16,
    display: 'flex',
    flexDirection: 'column'
  },
  commentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid #333'
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 24,
    cursor: 'pointer'
  },
  commentsList: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 16
  },
  emptyComments: {
    textAlign: 'center',
    color: '#aaa',
    padding: 32
  },
  commentInput: {
    display: 'flex',
    gap: 8,
    paddingTop: 16,
    borderTop: '1px solid #333'
  },
  input: {
    flex: 1,
    padding: 12,
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 24,
    color: '#fff',
    fontSize: 14
  },
  sendBtn: {
    padding: '12px 24px',
    background: '#FFD700',
    border: 'none',
    borderRadius: 24,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer'
  }
};
