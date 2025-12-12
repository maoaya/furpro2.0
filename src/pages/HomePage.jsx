import React, { useMemo, useState, useEffect } from 'react';
import FutproLogo from '../components/FutproLogo.jsx';
import CommentsModal from '../components/CommentsModal.jsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const gold = '#FFD700';
const black = '#0a0a0a';
const darkCard = '#1a1a1a';
const lightGold = '#FFA500';

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
  const { user } = useAuth();
  const menuActions = createMenuActions(navigate);
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);

  // Cargar posts y followers al montar
  useEffect(() => {
    if (user) {
      cargarFollowers();
      cargarPosts();
    }
    
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

    return () => {
      channelPosts.unsubscribe();
      channelLikes.unsubscribe();
      channelComments.unsubscribe();
    };
  }, [user]);

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

  return (
    <div style={{ background: black, color: gold, minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        background: darkCard,
        borderBottom: `2px solid ${gold}`,
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20
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
                style={{ padding: '10px 38px 10px 12px', borderRadius: 20, border: `1px solid ${gold}`,
                  background: '#111', color: gold, width: 240 }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            </div>
            <button aria-label="Notificaciones" onClick={goAlerts} style={{ borderRadius: '50%', width: 40, height: 40, border: `1px solid ${gold}`, background: 'transparent', color: gold }}>🔔</button>
            <button aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} style={{ borderRadius: '50%', width: 40, height: 40, border: `1px solid ${gold}`, background: 'transparent', color: gold }}>☰</button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div style={{ background: '#111', borderBottom: `1px solid ${gold}`, padding: 16 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
            <button onClick={menuActions.irAPerfil}>👤 Mi Perfil</button>
            <button onClick={menuActions.verEstadisticas}>📊 Mis Estadisticas</button>
            <button onClick={menuActions.verPartidos}>📅 Mis Partidos</button>
            <button onClick={menuActions.verLogros}>🏆 Mis Logros</button>
            <button onClick={menuActions.verTarjetas}>🆔 Mis Tarjetas</button>
            <button onClick={menuActions.verEquipos}>👥 Ver Equipos</button>
            <button onClick={menuActions.crearEquipo}>➕ Crear Equipo</button>
            <button onClick={menuActions.verTorneos}>🏆 Ver Torneos</button>
            <button onClick={menuActions.crearTorneo}>➕ Crear Torneo</button>
            <button onClick={menuActions.crearAmistoso}>🤝 Crear Amistoso</button>
            <button onClick={menuActions.jugarPenaltis}>⚽ Juego de Penaltis</button>
            <button onClick={menuActions.verCardFIFA}>🆔 Card Futpro</button>
            <button onClick={menuActions.sugerenciasCard}>💡 Sugerencias Card</button>
            <button onClick={menuActions.verNotificaciones}>🔔 Notificaciones</button>
            <button onClick={menuActions.abrirChat}>💬 Chat</button>
            <button onClick={menuActions.verVideos}>🎥 Videos</button>
            <button onClick={menuActions.abrirMarketplace}>🏪 Marketplace</button>
            <button onClick={menuActions.verEstados}>📋 Estados</button>
            <button onClick={menuActions.verAmigos}>👫 Seguidores</button>
            <button onClick={menuActions.abrirTransmisionEnVivo}>📡 Transmitir en Vivo</button>
            <button onClick={menuActions.rankingJugadores}>📊 Ranking Jugadores</button>
            <button onClick={menuActions.rankingEquipos}>📈 Ranking Equipos</button>
            <button onClick={menuActions.buscarRanking}>🔍 Buscar Ranking</button>
            <button onClick={menuActions.abrirConfiguracion}>🔧 Configuracion</button>
            <button onClick={menuActions.contactarSoporte}>🆘 Soporte</button>
            <button onClick={menuActions.verPrivacidad}>🛡️ Privacidad</button>
            <button onClick={menuActions.logout}>🚪 Cerrar sesion</button>
          </div>
        </div>
      )}

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
        onClick={() => navigate('/feed')}
        style={{ position: 'fixed', right: 20, bottom: 70, width: 56, height: 56, borderRadius: '50%', background: gold, color: black, fontWeight: 800, border: 'none', boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}
        title="Crear publicación"
      >+
      </button>
    </div>
  );
}
