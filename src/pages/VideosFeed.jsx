import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VideosFeed() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [activeTab, setActiveTab] = useState('paraTi');
  const containerRef = useRef(null);

  useEffect(() => {
    loadVideos();
  }, [activeTab]);

  const loadVideos = () => {
    // Stub: Videos de ejemplo
    const videosData = [
      {
        id: 1,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        user: {
          name: 'Lucia Martínez',
          username: '@luciaM10',
          avatar: '👤'
        },
        description: '⚽ Gol de la victoria! 🔥 #futbol #gol',
        likes: 1205,
        comments: 89,
        shares: 34,
        isLiked: false
      },
      {
        id: 2,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        user: {
          name: 'Carlos FC',
          username: '@carlosFC',
          avatar: '👤'
        },
        description: 'Entrenamiento de hoy 💪 #training',
        likes: 842,
        comments: 56,
        shares: 21,
        isLiked: false
      },
      {
        id: 3,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        user: {
          name: 'Team Lions',
          username: '@teamLions',
          avatar: '🦁'
        },
        description: 'Partido del domingo ⚡',
        likes: 2103,
        comments: 145,
        shares: 67,
        isLiked: false
      }
    ];

    setVideos(videosData);
    
    // Inicializar likes del localStorage
    const savedLikes = JSON.parse(localStorage.getItem('futpro_video_likes') || '{}');
    setLikes(savedLikes);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);
    
    if (newIndex !== currentIndex && newIndex < videos.length) {
      setCurrentIndex(newIndex);
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
    if (navigator.share) {
      navigator.share({
        title: `Video de ${video.user.name}`,
        text: video.description,
        url: window.location.href
      });
    } else {
      alert('Compartir: ' + video.description);
    }
  };

  const currentVideo = videos[currentIndex];

  return (
    <div style={styles.container}>
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
      </div>

      {/* Contenedor de videos */}
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
