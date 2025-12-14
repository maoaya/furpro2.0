import React, { useMemo, useState, useEffect } from 'react';
import FutproLogo from '../components/FutproLogo.jsx';
import TournamentInviteBanner from '../components/TournamentInviteBanner.jsx';
import NotificationsBell from '../components/NotificationsBell.jsx';
import { NotificationsProvider } from '../context/NotificationsContext.jsx';
import NotificationsEnableButton from '../components/NotificationsEnableButton.jsx';
import CommentsModal from '../components/CommentsModal.jsx';
import MenuHamburguesa from '../components/MenuHamburguesa.jsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { NotificationManager } from '../services/NotificationManager';
import { useAuth } from '../context/AuthContext';

const gold = '#FFD700';
const black = '#0a0a0a';
const darkCard = '#1a1a1a';
const lightGold = '#FFA500';

const menuItemsList = (actions) => ([
  { key: 'perfil', label: '👤 Mi Perfil', action: actions.irAPerfil },
  { key: 'estadisticas', label: '📊 Mis Estadisticas', action: actions.verEstadisticas },
  { key: 'partidos', label: '📅 Mis Partidos', action: actions.verPartidos },
  { key: 'logros', label: '🏆 Mis Logros', action: actions.verLogros },
  { key: 'tarjetas', label: '🆔 Mis Tarjetas', action: actions.verTarjetas },
  { key: 'equipos', label: '👥 Ver Equipos', action: actions.verEquipos },
  { key: 'crear-equipo', label: '➕ Crear Equipo', action: actions.crearEquipo },
  { key: 'torneos', label: '🏆 Ver Torneos', action: actions.verTorneos },
  { key: 'crear-torneo', label: '➕ Crear Torneo', action: actions.crearTorneo },
  { key: 'amistoso', label: '🤝 Crear Amistoso', action: actions.crearAmistoso },
  { key: 'penaltis', label: '⚽ Juego de Penaltis', action: actions.jugarPenaltis },
  { key: 'card-fifa', label: '🆔 Card Futpro', action: actions.verCardFIFA },
  { key: 'sugerencias-card', label: '💡 Sugerencias Card', action: actions.sugerenciasCard },
  { key: 'notificaciones', label: '🔔 Notificaciones', action: actions.verNotificaciones },
  { key: 'chat', label: '💬 Chat', action: actions.abrirChat },
  { key: 'videos', label: '🎥 Videos', action: actions.verVideos },
  { key: 'marketplace', label: '🏪 Marketplace', action: actions.abrirMarketplace },
  { key: 'estados', label: '📋 Estados', action: actions.verEstados },
  { key: 'seguidores', label: '👫 Seguidores', action: actions.verAmigos },
  { key: 'vivo', label: '📡 Transmitir en Vivo', action: actions.abrirTransmisionEnVivo },
  { key: 'ranking-jug', label: '📊 Ranking Jugadores', action: actions.rankingJugadores },
  { key: 'ranking-eq', label: '📈 Ranking Equipos', action: actions.rankingEquipos },
  { key: 'buscar-ranking', label: '🔍 Buscar Ranking', action: actions.buscarRanking },
  { key: 'config', label: '🔧 Configuracion', action: actions.abrirConfiguracion },
  { key: 'soporte', label: '🆘 Soporte', action: actions.contactarSoporte },
  { key: 'privacidad', label: '🛡️ Privacidad', action: actions.verPrivacidad },
  { key: 'logout', label: '🚪 Cerrar sesion', action: actions.logout }
]);

// Funciones de acción del menú - se actualizan con navigate
const createMenuActions = (navigate) => ({
  irAPerfil: () => navigate('/perfil/me'),
  verEstadisticas: () => navigate('/estadisticas'),
  verPartidos: () => navigate('/partidos'),
  verLogros: () => navigate('/logros'),
  verTarjetas: () => navigate('/tarjetas'),
  verEquipos: () => navigate('/equipos'),
  crearEquipo: () => navigate('/crear-equipo'),
  verTorneos: () => navigate('/torneos'),
  crearTorneo: () => navigate('/crear-torneo'),
  crearAmistoso: () => navigate('/amistoso'),
  jugarPenaltis: () => navigate('/penaltis'),
  verCardFIFA: () => navigate('/card-fifa'),
  sugerenciasCard: () => navigate('/sugerencias-card'),
  verNotificaciones: () => navigate('/notificaciones'),
  abrirChat: () => navigate('/chat'),
  verVideos: () => navigate('/videos'),
  abrirMarketplace: () => navigate('/marketplace'),
  verEstados: () => navigate('/estados'),
  verAmigos: () => navigate('/amigos'),
  abrirTransmisionEnVivo: () => navigate('/transmision-en-vivo'),
  rankingJugadores: () => navigate('/ranking-jugadores'),
  rankingEquipos: () => navigate('/ranking-equipos'),
  buscarRanking: () => navigate('/buscar-ranking'),
  abrirConfiguracion: () => navigate('/configuracion'),
  contactarSoporte: () => navigate('/soporte'),
  verPrivacidad: () => navigate('/privacidad'),
  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  }
});

const seedStories = [
  { id: 1, name: 'Lucia', avatar: 'https://placekitten.com/80/80' },
  { id: 2, name: 'Mateo', avatar: 'https://placekitten.com/81/81' },
  { id: 3, name: 'Sofia', avatar: 'https://placekitten.com/82/82' },
  { id: 4, name: 'Leo FC', avatar: 'https://placekitten.com/83/83' }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  const menuActions = useMemo(() => createMenuActions(navigate), [navigate]);
  const menuItems = useMemo(() => menuItemsList(menuActions), [menuActions]);
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  // Realtime y notificaciones consolidadas en NotificationsProvider

  // Cargar posts y followers al montar
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    cargarFollowers();
    cargarPosts();

    // Suscribirse a cambios en realtime
    const channelPosts = supabase
      .channel('posts:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        cargarPosts();
      })
      .subscribe();

    const channelLikes = supabase
      .channel('likes:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
        cargarPosts();
      })
      .subscribe();

    const channelComments = supabase
      .channel('comments:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        cargarPosts();
      })
      .subscribe();

    // Suscripciones específicas de posts/likes/comments permanecen; notificaciones se manejan en Provider

    return () => {
      channelPosts.unsubscribe();
      channelLikes.unsubscribe();
      channelComments.unsubscribe();
    };
  }, [user, navigate]);

  async function cargarFollowers() {
    try {
      if (!user) return;

      // Obtener usuarios que el usuario actual sigue
      const { data: followedData, error: followError } = await supabase
        .from('friends')
        .select('friend_email')
        .eq('user_email', user.email);

      if (followError) throw followError;

      // Convertir emails a IDs
      const followedEmails = followedData?.map(f => f.friend_email) || [];
      if (followedEmails.length > 0) {
        const { data: followedIds } = await supabase
          .from('users')
          .select('id')
          .in('email', followedEmails);
        setFollowedUsers(followedIds?.map(u => u.id) || []);
      } else {
        setFollowedUsers([]);
      }
    } catch (err) {
      console.error('Error cargando followers:', err);
    }
  }

  async function cargarPosts() {
    try {
      setLoading(true);
      // Cargar posts con joins para usuario, conteo de likes y comentarios
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey(id, email, full_name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Formatear posts
      const formatted = postsData.map(p => ({
        id: p.id,
        user: p.user?.full_name || p.user?.email || 'Usuario',
        avatar: p.user?.avatar_url || 'https://via.placeholder.com/90',
        image: p.image_url,
        title: p.tags?.[0] || 'Post',
        description: p.content,
        likes: p.likes_count?.[0]?.count || 0,
        comments: p.comments_count?.[0]?.count || 0,
        tags: p.tags || [],
        user_id: p.user_id,
        created_at: p.created_at
      }));

      // Separar posts de usuarios seguidos y sugerencias
      const followed = formatted.filter(p => followedUsers.includes(p.user_id));
      const suggested = formatted.filter(p => !followedUsers.includes(p.user_id) && p.user_id !== user?.id);

      setPosts(followed);
      setSuggestedPosts(suggested);
    } catch (err) {
      console.error('Error cargando posts:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = useMemo(() => {
    if (!search) return posts;
    const term = search.toLowerCase();
    return posts.filter(p =>
      p.user.toLowerCase().includes(term) ||
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }, [posts, search]);

  const onLike = async (postId) => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }
    try {
      // Verificar si ya dio like
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Quitar like
        await supabase.from('likes').delete().eq('id', existingLike.id);
      } else {
        // Dar like
        await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);
      }
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const onComment = async (postId) => {
    const text = commentText[postId];
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }
    if (!text || !text.trim()) {
      alert('Escribe un comentario');
      return;
    }
    try {
      await supabase.from('comments').insert([{
        post_id: postId,
        user_id: user.id,
        content: text.trim()
      }]);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      setShowComments(prev => ({ ...prev, [postId]: false }));
    } catch (err) {
      console.error('Error al comentar:', err);
    }
  };

  const onShare = (id) => {
    console.log('Compartir post', id);
  };

  const goHome = () => navigate('/');
  const goMarket = () => menuActions.abrirMarketplace();
  const goVideos = () => menuActions.verVideos();
  const goAlerts = () => menuActions.verNotificaciones();
  const goChat = () => menuActions.abrirChat();

  const menuButtonStyle = (isHover) => ({
    width: '100%',
    textAlign: 'left',
    padding: '14px 16px',
    borderRadius: 14,
    border: `1px solid ${gold}`,
    background: isHover ? 'linear-gradient(135deg,#FFD700,#FFB347)' : '#121212',
    color: isHover ? '#0a0a0a' : gold,
    fontWeight: 800,
    letterSpacing: 0.3,
    boxShadow: isHover ? '0 6px 18px rgba(255,215,0,0.35)' : '0 2px 10px rgba(0,0,0,0.35)',
    transition: 'all 0.15s ease'
  });

  return (
    <NotificationsProvider>
    <div style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,215,0,0.08), transparent 30%), radial-gradient(circle at 80% 10%, rgba(255,215,0,0.06), transparent 30%), #0a0a0a', color: gold, minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        background: 'linear-gradient(120deg,#0b0b0b 0%, #151515 60%, #0b0b0b 100%)',
        borderBottom: `2px solid ${gold}`,
        padding: '18px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FutproLogo size={42} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>FutPro</div>
              <div style={{ color: '#ccc', fontSize: 12 }}>Bienvenido de vuelta</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar jugadores, equipos..."
                style={{
                  padding: '12px 44px 12px 14px',
                  borderRadius: 24,
                  border: `2px solid ${gold}`,
                  background: '#0f0f0f',
                  color: gold,
                  width: 260,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)'
                }}
              />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: gold, fontWeight: 700 }}>🔍</span>
            </div>
            {!user && (
              <button
                onClick={async () => {
                  localStorage.setItem('post_auth_origin', 'homepage');
                  localStorage.setItem('post_auth_target', '/');
                  await loginWithGoogle();
                }}
                style={{
                  background: 'linear-gradient(135deg,#FFD700,#FF9F0D)',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: 22,
                  padding: '11px 16px',
                  fontWeight: 900,
                  boxShadow: '0 6px 20px rgba(255,215,0,0.35)',
                  letterSpacing: 0.3
                }}
                title="Iniciar sesión con Google"
              >
                Iniciar sesión
              </button>
            )}
            <button 
              aria-label="Nueva publicación" 
              onClick={() => navigate('/crear-publicacion')}
              style={{ borderRadius: '50%', width: 42, height: 42, border: `2px solid ${gold}`, background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', boxShadow: '0 3px 12px rgba(255,215,0,0.4)', fontSize: '24px', fontWeight: 'bold' }}
            >
              📸
            </button>
            <NotificationsEnableButton />
            <NotificationsBell />
            <button aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} style={{ borderRadius: '50%', width: 42, height: 42, border: `2px solid ${gold}`, background: '#0f0f0f', color: gold, boxShadow: '0 3px 12px rgba(0,0,0,0.4)' }}>☰</button>
          </div>
        </div>
      </header>

      {/* Menu Hamburguesa Mejorado */}
      <MenuHamburguesa isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <section style={{ padding: '12px 16px', overflowX: 'auto', display: 'flex', gap: 12 }}>
        {seedStories.map(story => (
          <div key={story.id} style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0080, #ff8c00)',
              padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
              onClick={() => console.log('Ver historia', story.name)}
            >
              <img src={story.avatar} alt={story.name} style={{ width: 58, height: 58, borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>{story.name}</div>
          </div>
        ))}
      </section>

      <main style={{ padding: '0 16px 80px' }}>
        {/* Invitaciones a torneos */}
        <TournamentInviteBanner />
        {/* Posts de usuarios seguidos */}
        <div style={{ marginBottom: '32px' }}>
          {filteredPosts.length > 0 && (
            <div style={{ color: gold, fontSize: 14, fontWeight: 'bold', marginBottom: 16, borderBottom: `1px solid ${gold}`, paddingBottom: 8 }}>
              📰 Posts de usuarios seguidos ({filteredPosts.length})
            </div>
          )}
          {filteredPosts.length === 0 && followedUsers.length > 0 && (
            <div style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
              Sin posts aún de los usuarios que sigues
            </div>
          )}
          <div style={{ display: 'grid', gap: 16 }}>
            {filteredPosts.map(post => (
              <article key={post.id} style={{ background: darkCard, borderRadius: 16, overflow: 'hidden', border: `1px solid ${gold}` }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
                  <img src={post.avatar} alt={post.user} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{post.user}</div>
                    <div style={{ fontSize: 12, color: '#ccc' }}>{post.title}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, fontSize: 12 }}>
                    {post.tags.map(tag => (<span key={tag} style={{ background: '#222', padding: '4px 8px', borderRadius: 12 }}>{tag}</span>))}
                  </div>
                </header>
                <div>
                  <img src={post.image} alt={post.title} style={{ width: '100%', display: 'block' }} />
                </div>
                <div style={{ padding: 12, color: '#ddd' }}>{post.description}</div>
                <footer style={{ padding: '0 12px 12px' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => onLike(post.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', border: `1px solid ${gold}`, color: gold, padding: 8, borderRadius: 8, cursor: 'pointer' }}>⚽ {post.likes}</button>
                    <button onClick={() => setSelectedPostForComments(post.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', border: `1px solid ${gold}`, color: gold, padding: 8, borderRadius: 8, cursor: 'pointer' }}>💬 {post.comments}</button>
                    <button onClick={() => onShare(post.id)} style={{ flex: 1, background: 'transparent', border: `1px solid ${gold}`, color: gold, padding: 8, borderRadius: 8, cursor: 'pointer' }}>📤</button>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>

        {/* Sugerencias de posts */}
        {suggestedPosts.length > 0 && (
          <div>
            <div style={{ color: '#FFB347', fontSize: 14, fontWeight: 'bold', marginBottom: 16, borderBottom: `1px solid #FFB347`, paddingBottom: 8 }}>
              ✨ Descubre nuevos contenidos ({suggestedPosts.length})
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {suggestedPosts.slice(0, 5).map(post => (
                <article key={post.id} style={{ background: darkCard, borderRadius: 16, overflow: 'hidden', border: `1px solid #FFB347`, opacity: 0.8 }}>
                  <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
                    <img src={post.avatar} alt={post.user} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{post.user}</div>
                      <div style={{ fontSize: 12, color: '#ccc' }}>{post.title}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, fontSize: 12 }}>
                      {post.tags.map(tag => (<span key={tag} style={{ background: '#222', padding: '4px 8px', borderRadius: 12 }}>{tag}</span>))}
                    </div>
                  </header>
                  <div>
                    <img src={post.image} alt={post.title} style={{ width: '100%', display: 'block' }} />
                  </div>
                  <div style={{ padding: 12, color: '#ddd' }}>{post.description}</div>
                  <footer style={{ padding: '0 12px 12px' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => onLike(post.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', border: `1px solid #FFB347`, color: '#FFB347', padding: 8, borderRadius: 8, cursor: 'pointer' }}>⚽ {post.likes}</button>
                      <button onClick={() => setSelectedPostForComments(post.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', border: `1px solid #FFB347`, color: '#FFB347', padding: 8, borderRadius: 8, cursor: 'pointer' }}>💬 {post.comments}</button>
                      <button onClick={() => onShare(post.id)} style={{ flex: 1, background: 'transparent', border: `1px solid #FFB347`, color: '#FFB347', padding: 8, borderRadius: 8, cursor: 'pointer' }}>📤</button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de comentarios */}
      <CommentsModal
        postId={selectedPostForComments}
        isOpen={!!selectedPostForComments}
        onClose={() => setSelectedPostForComments(null)}
      />

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', borderTop: `1px solid ${gold}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        <button onClick={goHome}>🏠 Home</button>
        <button onClick={goMarket}>🛒 Market</button>
        <button onClick={goVideos}>🎥 Videos</button>
        <button onClick={goAlerts}>🔔 Alertas</button>
        <button onClick={goChat}>💬 Chat</button>
      </nav>

      <button
        onClick={() => navigate('/crear-publicacion')}
        style={{ position: 'fixed', right: 20, bottom: 70, width: 56, height: 56, borderRadius: '50%', background: gold, color: black, fontWeight: 800, border: 'none', boxShadow: '0 6px 18px rgba(0,0,0,0.4)', fontSize: '32px' }}
        title="Crear publicación"
      >
        📸
      </button>
    </div>
    </NotificationsProvider>
  );
}
