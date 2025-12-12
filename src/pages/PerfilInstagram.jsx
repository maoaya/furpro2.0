import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function PerfilInstagram() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadProfileData();

    // Suscribirse a cambios en friends (followers/following)
    const channelFriends = supabase
      .channel('friends:profile')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
        loadProfileData();
      })
      .subscribe();

    // Suscribirse a cambios en posts del usuario
    const channelPosts = supabase
      .channel('posts:profile')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadProfilePosts();
      })
      .subscribe();

    return () => {
      channelFriends.unsubscribe();
      channelPosts.unsubscribe();
    };
  }, [userId]);

  const loadCurrentUser = async () => {
    const { data } = await supabase.auth.getSession();
    setCurrentUser(data?.session?.user);
  };

  const loadProfileData = async () => {
    try {
      // Obtener ID del perfil (userId = 'me' o UUID específico)
      const profileId = userId === 'me' ? currentUser?.id : userId;
      if (!profileId) return;

      // Cargar datos del perfil desde users o profiles
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url')
        .eq('id', profileId)
        .single();

      if (userError) throw userError;

      // Contar posts
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profileId);

      // Contar followers
      const { count: followersCount } = await supabase
        .from('friends')
        .select('*', { count: 'exact', head: true })
        .eq('friend_email', userData.email);

      // Contar following
      const { count: followingCount } = await supabase
        .from('friends')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', userData.email);

      // Verificar si current user sigue a este perfil
      if (currentUser) {
        const { data: friendData } = await supabase
          .from('friends')
          .select('id')
          .eq('user_email', currentUser.email)
          .eq('friend_email', userData.email)
          .single();
        setIsFollowing(!!friendData);
      }

      setProfileUser({
        id: userData.id,
        nombre: userData.full_name || userData.email,
        username: `@${userData.email.split('@')[0]}`,
        bio: '⚽ Jugador FutPro\n🏆 Apasionado del fútbol',
        avatar: userData.avatar_url || '👤',
        postsCount: postsCount || 0,
        followersCount: followersCount || 0,
        followingCount: followingCount || 0
      });

      // Cargar posts
      await loadProfilePosts(profileId);
    } catch (err) {
      console.error('Error cargando perfil:', err);
    }
  };

  const loadProfilePosts = async (profileId = null) => {
    try {
      const targetId = profileId || (userId === 'me' ? currentUser?.id : userId);
      if (!targetId) return;

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .eq('user_id', targetId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data.map(p => ({
        id: p.id,
        image: p.image_url || 'https://via.placeholder.com/300',
        likes: p.likes_count?.[0]?.count || 0,
        comments: p.comments_count?.[0]?.count || 0
      })));
    } catch (err) {
      console.error('Error cargando posts del perfil:', err);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !profileUser) return;
    
    try {
      if (isFollowing) {
        // Dejar de seguir
        await supabase
          .from('friends')
          .delete()
          .eq('user_email', currentUser.email)
          .eq('friend_email', profileUser.nombre.includes('@') ? profileUser.nombre : `${profileUser.username}@futpro.com`);
      } else {
        // Seguir
        await supabase
          .from('friends')
          .insert([{
            user_email: currentUser.email,
            friend_email: profileUser.nombre.includes('@') ? profileUser.nombre : `${profileUser.username}@futpro.com`,
            friend_name: profileUser.nombre
          }]);
      }
      // El realtime actualizará automáticamente
    } catch (err) {
      console.error('Error al seguir/dejar de seguir:', err);
    }
  };

  const handleMessage = () => {
    navigate(`/chat?user=${userId}`);
  };

  const isOwner = userId === 'me' || userId === currentUser?.id;

  if (!profileUser) return <div style={styles.loading}>Cargando perfil...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.profileSection}>
          <div style={styles.avatar}>{profileUser.avatar}</div>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <strong style={styles.statNumber}>{profileUser.postsCount}</strong>
              <span style={styles.statLabel}>posts</span>
            </div>
            <div 
              style={styles.statItem} 
              onClick={() => setShowFollowersModal(true)}
            >
              <strong style={styles.statNumber}>{profileUser.followersCount}</strong>
              <span style={styles.statLabel}>seguidores</span>
            </div>
            <div 
              style={styles.statItem}
              onClick={() => setShowFollowingModal(true)}
            >
              <strong style={styles.statNumber}>{profileUser.followingCount}</strong>
              <span style={styles.statLabel}>siguiendo</span>
            </div>
          </div>
        </div>

        <div style={styles.userInfo}>
          <h2 style={styles.nombre}>{profileUser.nombre}</h2>
          <p style={styles.username}>{profileUser.username}</p>
          <pre style={styles.bio}>{profileUser.bio}</pre>
        </div>

        {/* Botones de acción */}
        <div style={styles.actions}>
          {isOwner ? (
            <>
              <button 
                style={styles.btnPrimary}
                onClick={() => navigate('/editar-perfil')}
              >
                Editar perfil
              </button>
              <button 
                style={styles.btnSecondary}
                onClick={() => navigate('/card-fifa')}
              >
                Ver Card FIFA
              </button>
            </>
          ) : (
            <>
              <button 
                style={isFollowing ? styles.btnSecondary : styles.btnPrimary}
                onClick={handleFollow}
              >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
              <button 
                style={styles.btnSecondary}
                onClick={handleMessage}
              >
                Mensaje
              </button>
              <button style={styles.btnIcon}>⋯</button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'posts' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('posts')}
        >
          📷 POSTS
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'stats' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('stats')}
        >
          📊 STATS
        </button>
        {isOwner && (
          <button 
            style={{...styles.tab, ...(activeTab === 'card' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('card')}
          >
            🆔 CARD
          </button>
        )}
      </div>

      {/* Contenido según tab */}
      {activeTab === 'posts' && (
        <div style={styles.grid}>
          {posts.map(post => (
            <div key={post.id} style={styles.gridItem}>
              <img src={post.image} alt="Post" style={styles.gridImage} />
              <div style={styles.gridOverlay}>
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={styles.statsContent}>
          <h3 style={styles.statsTitle}>Estadísticas del Jugador</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>24</div>
              <div style={styles.statName}>Partidos</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>18</div>
              <div style={styles.statName}>Goles</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>12</div>
              <div style={styles.statName}>Asistencias</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>85</div>
              <div style={styles.statName}>OVR</div>
            </div>
          </div>
          <button 
            style={styles.btnPrimary}
            onClick={() => navigate('/estadisticas')}
          >
            Ver Estadísticas Completas
          </button>
        </div>
      )}

      {activeTab === 'card' && isOwner && (
        <div style={styles.cardContent}>
          <h3 style={styles.statsTitle}>Tu Card FIFA</h3>
          <div style={styles.cardPreview}>
            <div style={styles.cardBox}>
              <div style={styles.cardOVR}>85</div>
              <div style={styles.cardPosition}>DEL</div>
              <div style={styles.cardName}>{profileUser.nombre}</div>
            </div>
          </div>
          <button 
            style={styles.btnPrimary}
            onClick={() => navigate('/card-fifa')}
          >
            Editar Card FIFA
          </button>
        </div>
      )}

      {/* Modal Seguidores */}
      {showFollowersModal && (
        <div style={styles.modal} onClick={() => setShowFollowersModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Seguidores</h3>
            <div style={styles.modalList}>
              {/* Stub: Lista de seguidores */}
              <p style={styles.modalEmpty}>Lista de seguidores (implementar)</p>
            </div>
            <button 
              style={styles.btnSecondary}
              onClick={() => setShowFollowersModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Siguiendo */}
      {showFollowingModal && (
        <div style={styles.modal} onClick={() => setShowFollowingModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Siguiendo</h3>
            <div style={styles.modalList}>
              {/* Stub: Lista de siguiendo */}
              <p style={styles.modalEmpty}>Lista de siguiendo (implementar)</p>
            </div>
            <button 
              style={styles.btnSecondary}
              onClick={() => setShowFollowingModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    paddingBottom: 80
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#FFD700',
    fontSize: 18
  },
  header: {
    padding: 24,
    borderBottom: '1px solid #333'
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    marginBottom: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36
  },
  stats: {
    display: 'flex',
    gap: 24,
    flex: 1
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa'
  },
  userInfo: {
    marginBottom: 16
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  username: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8
  },
  bio: {
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: 8
  },
  btnPrimary: {
    flex: 1,
    padding: '10px 16px',
    background: '#FFD700',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer'
  },
  btnSecondary: {
    flex: 1,
    padding: '10px 16px',
    background: 'transparent',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer'
  },
  btnIcon: {
    width: 40,
    padding: '10px',
    background: 'transparent',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: 8,
    fontSize: 18,
    cursor: 'pointer'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #333'
  },
  tab: {
    flex: 1,
    padding: 16,
    background: 'transparent',
    color: '#aaa',
    border: 'none',
    fontSize: 12,
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '2px solid transparent'
  },
  tabActive: {
    color: '#FFD700',
    borderBottom: '2px solid #FFD700'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 2
  },
  gridItem: {
    position: 'relative',
    paddingBottom: '100%',
    background: '#1a1a1a',
    cursor: 'pointer'
  },
  gridImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.2s'
  },
  statsContent: {
    padding: 24
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFD700'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    marginBottom: 24
  },
  statCard: {
    background: '#1a1a1a',
    padding: 24,
    borderRadius: 12,
    textAlign: 'center'
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8
  },
  statName: {
    fontSize: 14,
    color: '#aaa'
  },
  cardContent: {
    padding: 24
  },
  cardPreview: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24
  },
  cardBox: {
    width: 200,
    height: 280,
    background: 'linear-gradient(135deg, #1a1a1a, #333)',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    border: '2px solid #FFD700'
  },
  cardOVR: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 40
  },
  cardPosition: {
    fontSize: 14,
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 8
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFD700'
  },
  modalList: {
    marginBottom: 16
  },
  modalEmpty: {
    textAlign: 'center',
    color: '#aaa',
    padding: 32
  }
};
