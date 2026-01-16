import React, { useMemo, useState, useEffect, useRef } from 'react';
import FutproLogo from '../components/FutproLogo.jsx';
import TournamentInviteBanner from '../components/TournamentInviteBanner.jsx';
import NotificationsBell from '../components/NotificationsBell.jsx';
import { NotificationsProvider } from '../context/NotificationsContext.jsx';
import NotificationsEnableButton from '../components/NotificationsEnableButton.jsx';
import CommentsModal from '../components/CommentsModal.jsx';
import MenuHamburguesa from '../components/MenuHamburguesa.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';
import UploadContenidoComponent from '../components/UploadContenidoComponent.jsx';
import PostCard from '../components/PostCard.jsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { NotificationManager } from '../services/NotificationManager';
import { useAuth } from '../context/AuthContext';
import { StoryService } from '../services/StoryService.js';
import { PostService } from '../services/PostService.js';

const gold = '#FFD700';
const black = '#0a0a0a';
const darkCard = '#1a1a1a';
const lightGold = '#FFA500';
const SHARED_STORAGE_KEY = 'futpro_shared_moments';

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
  { key: 'penalty-pvp', label: '⚽ Penaltis PvP', action: actions.jugarPenaltisPvP },
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
  jugarPenaltisPvP: () => navigate('/penalty-pvp'),
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

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  const menuActions = useMemo(() => createMenuActions(navigate), [navigate]);
  const menuItems = useMemo(() => menuItemsList(menuActions), [menuActions]);
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [searchResults, setSearchResults] = useState({ players: [], posts: [], teams: [], tournaments: [] });
  const [searching, setSearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [storyMessage, setStoryMessage] = useState('');
  const [storyCaption, setStoryCaption] = useState('');
  const [storyLocation, setStoryLocation] = useState('');
  const [storyTournament, setStoryTournament] = useState('');
  const fileInputRef = useRef(null);
  const [menuHamburguesaOpen, setMenuHamburguesaOpen] = useState(false);
  // Realtime y notificaciones consolidadas en NotificationsProvider

  // Cargar posts y followers al montar
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    cargarFollowers();
    loadPosts();

    // Suscribirse a cambios en realtime
    const channelPosts = supabase
      .channel('posts:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadPosts();
      })
      .subscribe();

    const channelLikes = supabase
      .channel('post_likes:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        loadPosts();
      })
      .subscribe();

    const channelComments = supabase
      .channel('post_comments:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, () => {
        loadPosts();
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

      // Intentar primero con tabla friends en public schema
      let { data: followedData, error: followError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      // Si falla, intentar con api.friends
      if (followError) {
        console.warn('⚠️ Error en friends (public), intentando api.friends:', followError.message);
        const result = await supabase
          .from('api.friends')
          .select('friend_id')
          .eq('user_id', user.id);
        
        followedData = result.data;
        followError = result.error;
      }

      if (followError) {
        console.error('❌ Error cargando followers (ambos schemas):', {
          code: followError.code,
          message: followError.message,
          details: followError.details,
          hint: followError.hint
        });
        // No hacer throw, simplemente establecer array vacío
        setFollowedUsers([]);
        return;
      }

      const followedIds = followedData?.map(f => f.friend_id) || [];
      setFollowedUsers(followedIds);
      console.log('✅ Followers cargados:', followedIds.length);
    } catch (err) {
      console.error('❌ Error inesperado cargando followers:', err);
      setFollowedUsers([]);
    }
  }

  async function cargarUnreadNotifications() {
    if (!user) return;
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
    }
  }

  async function ejecutarBusqueda() {
    if (!search.trim()) {
      setSearchResults({ players: [], posts: [], teams: [], tournaments: [] });
      return;
    }
    const like = `%${search.trim()}%`;
    const results = { players: [], posts: [], teams: [], tournaments: [] };
    setSearching(true);
    try {
      const { data: players } = await supabase
        .from('carfutpro')
        .select('user_id, nombre, apellido, ciudad, pais, categoria, equipo, posicion_favorita, edad, photo_url, avatar_url')
        .or([
          `nombre.ilike.${like}`,
          `apellido.ilike.${like}`,
          `ciudad.ilike.${like}`,
          `pais.ilike.${like}`,
          `categoria.ilike.${like}`,
          `equipo.ilike.${like}`,
          `posicion_favorita.ilike.${like}`,
          `edad::text.ilike.${like}`
        ].join(','))
        .limit(25);
      results.players = players || [];
    } catch (err) {
      console.error('Busqueda jugadores falló:', err);
    }

    try {
      const { data: posts } = await supabase
        .from('posts')
        .select('id, caption, media_url, created_at, user_id')
        .or([
          `caption.ilike.${like}`,
          `media_url.ilike.${like}`
        ].join(','))
        .limit(25);
      results.posts = posts || [];
    } catch (err) {
      console.error('Busqueda posts falló:', err);
    }

    try {
      const { data: teams } = await supabase
        .from('teams')
        .select('id, name, location, category, logo_url')
        .or([
          `name.ilike.${like}`,
          `location.ilike.${like}`,
          `category.ilike.${like}`
        ].join(','))
        .limit(15);
      results.teams = teams || [];
    } catch (err) {
      console.warn('Busqueda equipos omitida:', err.message);
    }

    try {
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('id, name, location, category, start_date')
        .or([
          `name.ilike.${like}`,
          `location.ilike.${like}`,
          `category.ilike.${like}`
        ].join(','))
        .limit(15);
      results.tournaments = tournaments || [];
    } catch (err) {
      console.warn('Busqueda torneos omitida:', err.message);
    }

    setSearchResults(results);
    setSearching(false);
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    ejecutarBusqueda();
  }

  async function loadPosts() {
    try {
      setLoading(true);

      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ Error cargando posts:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setPosts([]);
        setSuggestedPosts([]);
        setLoading(false);
        return;
      }

      const formatted = await Promise.all((postsData || []).map(async (p) => {
        let userName = 'Usuario';
        let userAvatar = 'https://via.placeholder.com/90';

        // Intentar cargar desde carfutpro
        try {
          const { data: card } = await supabase
            .from('carfutpro')
            .select('nombre, apellido, avatar_url, photo_url')
            .eq('user_id', p.user_id)
            .single();
          
          if (card) {
            userName = `${card.nombre || ''} ${card.apellido || ''}`.trim() || 'Usuario';
            userAvatar = card.photo_url || card.avatar_url || userAvatar;
          }
        } catch (cardErr) {
          // Si falla, intentar tabla usuarios
          try {
            const { data: usuario } = await supabase
              .from('usuarios')
              .select('nombre_completo, foto_perfil, nombre, apellido')
              .eq('id', p.user_id)
              .single();
            
            if (usuario) {
              userName = usuario.nombre_completo || 
                         `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || 
                         'Usuario';
              userAvatar = usuario.foto_perfil || userAvatar;
            }
          } catch (userErr) {
            // Último intento: auth.users metadata
            try {
              const { data: authData } = await supabase.auth.admin.getUserById(p.user_id);
              if (authData?.user) {
                userName = authData.user.user_metadata?.full_name || 
                           authData.user.email?.split('@')[0] || 
                           'Usuario';
                userAvatar = authData.user.user_metadata?.avatar_url || userAvatar;
              }
            } catch (authErr) {
              console.warn(`⚠️ No se pudo cargar info de usuario ${p.user_id}`);
            }
          }
        }

        return {
          id: p.id,
          user: userName,
          avatar: userAvatar,
          image: p.imagen_url || p.media_url,
          title: 'Post',
          description: p.contenido || p.caption || '',
          likes: p.likes_count ?? 0,
          comments: p.comments_count ?? 0,
          views: p.views_count ?? 0,
          ubicacion: p.ubicacion || 'Ubicación no disponible',
          tags: [],
          user_id: p.user_id,
          created_at: p.created_at,
          isLiked: likedMap[p.id] || false
        };
      }));

      setPosts(formatted);
      setSuggestedPosts(formatted);

      // Cargar productos destacados y agregarlos arriba de sugeridos
      try {
        const { data: productsData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('views', { ascending: false })
          .limit(6);

        if (prodError) {
          console.warn('⚠️ Error cargando productos:', prodError.message);
        } else if (productsData && productsData.length > 0) {
          const productPosts = productsData.map(prod => ({
            id: `product-${prod.id}`,
            user: 'Marketplace',
            avatar: 'https://via.placeholder.com/90',
            image: prod.images?.[0] || 'https://via.placeholder.com/400',
            title: prod.title,
            description: `💰 $${prod.price} ${prod.currency || 'USD'} • ${prod.category || 'Producto'}`,
            likes: prod.favorites || 0,
            comments: 0,
            views: prod.views || 0,
            ubicacion: prod.location || '—',
            tags: ['marketplace', prod.category || 'producto'],
            user_id: prod.seller_id,
            created_at: prod.created_at,
            isProduct: true,
            productId: prod.id
          }));
          setSuggestedPosts(prev => [...productPosts, ...prev]);
        }
      } catch (prodErr) {
        console.error('❌ Error procesando productos:', prodErr);
      }
    } catch (err) {
      console.error('❌ Error inesperado cargando posts:', err);
      setPosts([]);
      setSuggestedPosts([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = useMemo(() => {
    if (!search) return posts;
    const term = search.toLowerCase();
    return posts.filter(post => 
      post.caption?.toLowerCase().includes(term) ||
      post.user_name?.toLowerCase().includes(term)
    );
  }, [posts, search]);

  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleCameraClick = () => {
    setShowCameraMenu(true);
  };

  const handleSelectPhoto = () => {
    setShowCameraMenu(false);
    setStoryMessage('');
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
      photoInputRef.current.click();
    }
  };

  const handleSelectVideo = () => {
    setShowCameraMenu(false);
    setStoryMessage('');
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
      videoInputRef.current.click();
    }
  };

  const handleStartLive = () => {
    setShowCameraMenu(false);
    navigate('/transmision-en-vivo');
  };

  const handleGoLive = () => {
    // Botón directo para transmisión en vivo
    navigate('/transmision-en-vivo');
  };

  const handleStoryFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setUploadingStory(true);
    setStoryMessage('');
    try {
      // Validar duración de video: máximo 60s
      if (file.type.startsWith('video')) {
        const duration = await new Promise((resolve, reject) => {
          try {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              URL.revokeObjectURL(video.src);
              resolve(video.duration || 0);
            };
            video.onerror = () => resolve(0);
            video.src = URL.createObjectURL(file);
          } catch (e) { resolve(0); }
        });
        if (duration > 60) {
          setStoryMessage('❌ El video supera 60 segundos');
          setUploadingStory(false);
          return;
        }
      }
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('stories').upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('stories').getPublicUrl(path);
      await supabase.from('user_stories').insert({
        user_id: user.id,
        image_url: publicData?.publicUrl,
        caption: storyCaption || 'Nueva historia'
      });
      setStoryMessage('✅ Historia subida');
      setStoryCaption('');
      setStoryLocation('');
      setStoryTournament('');
    } catch (err) {
      console.error('Error subiendo historia:', err);
      setStoryMessage('❌ No se pudo subir la historia');
    } finally {
      setUploadingStory(false);
    }
  };

  const [likedMap, setLikedMap] = useState({});

  const onLike = async (postId) => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    const isLiked = likedMap[postId] || false;
    const delta = isLiked ? -1 : 1;

    // Optimista en UI
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + delta, isLiked: !isLiked } : p));
    setSuggestedPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + delta, isLiked: !isLiked } : p));
    setLikedMap(prev => ({ ...prev, [postId]: !isLiked }));

    try {
      // Persistir en tabla de likes (si existe)
      const { data: existingLikeArr } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .limit(1);

      const existingLike = existingLikeArr?.[0];

      if (existingLike) {
        if (isLiked) {
          await supabase.from('likes').delete().eq('id', existingLike.id);
        }
      } else {
        if (!isLiked) {
          await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);
        }
      }

      // Actualizar contador en posts (ignorar error si no existe columna)
      const target = posts.find(p => p.id === postId) || suggestedPosts.find(p => p.id === postId);
      const nextLikes = (target?.likes || 0) + delta;
      await supabase.from('posts').update({ likes_count: nextLikes }).eq('id', postId);
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
    const target = posts.find(p => p.id === id) || suggestedPosts.find(p => p.id === id);
    if (!target) return;

    persistSharedMoment({
      id: target.id,
      type: 'post',
      user: target.user,
      image: target.image,
      description: target.description,
      ubicacion: target.ubicacion || '—',
      created_at: target.created_at || new Date().toISOString(),
      likes: target.likes || 0,
      views: target.views || 0
    });

    const sharePayload = {
      title: 'FutPro',
      text: target.description || 'Mira este momento en FutPro',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(sharePayload).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${sharePayload.text} - ${sharePayload.url}`);
      alert('📋 Copiado para compartir');
    }
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
            {user && (
              <>
                <NotificationsBell />
                <button
                  onClick={() => setMenuHamburguesaOpen(true)}
                  style={{
                    background: '#FFD700',
                    border: 'none',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#0a0a0a',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  title="Abrir menú"
                >
                  ☰
                </button>
                <MenuHamburguesa isOpen={menuHamburguesaOpen} onClose={() => setMenuHamburguesaOpen(false)} />
              </>
            )}
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
          </div>
        </div>
      </header>

      {storyMessage && (
        <div style={{ padding: '8px 16px', color: storyMessage.startsWith('✅') ? '#4CAF50' : '#FF6B6B', fontWeight: 700 }}>
          {storyMessage}
        </div>
      )}

      {/* Panel de resultados de búsqueda */}
      {(searchResults.players?.length || searchResults.posts?.length || searchResults.teams?.length || searchResults.tournaments?.length) ? (
        <div style={{ padding: '8px 16px', color: '#fff' }}>
          <div style={{ color: gold, fontWeight: 700, marginBottom: 6 }}>
            Resultados: Jugadores {searchResults.players?.length || 0} · Equipos {searchResults.teams?.length || 0} · Torneos {searchResults.tournaments?.length || 0} · Contenido {searchResults.posts?.length || 0}
          </div>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {(searchResults.players || []).slice(0, 4).map((p) => (
              <div key={`p-${p.user_id}`} style={{ background: '#141414', border: `1px solid ${gold}`, borderRadius: 12, padding: 10 }}>
                <div style={{ fontWeight: 700, color: gold }}>{p.nombre} {p.apellido}</div>
                <div style={{ fontSize: 12, color: '#ccc' }}>{p.ciudad || '—'}, {p.pais || '—'} · {p.categoria || '—'}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{p.posicion_favorita || 'Posición'} · Edad {p.edad || '—'}</div>
              </div>
            ))}
            {(searchResults.teams || []).slice(0, 3).map((t) => (
              <div key={`t-${t.id}`} style={{ background: '#141414', border: `1px solid ${gold}`, borderRadius: 12, padding: 10 }}>
                <div style={{ fontWeight: 700, color: '#00ff88' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#ccc' }}>{t.location || '—'} · {t.category || '—'}</div>
              </div>
            ))}
            {(searchResults.tournaments || []).slice(0, 3).map((t) => (
              <div key={`tor-${t.id}`} style={{ background: '#141414', border: `1px solid ${gold}`, borderRadius: 12, padding: 10 }}>
                <div style={{ fontWeight: 700, color: '#FFB347' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#ccc' }}>{t.location || '—'} · {t.category || '—'}</div>
              </div>
            ))}
            {(searchResults.posts || []).slice(0, 3).map((p) => (
              <div key={`post-${p.id}`} style={{ background: '#141414', border: `1px solid ${gold}`, borderRadius: 12, padding: 10 }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>{p.caption || 'Contenido'}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{p.media_url ? 'Media adjunta' : 'Sin media'} · {new Date(p.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
        {/* Componente de subida de contenido */}
        <div style={{ marginBottom: '24px' }}>
          <UploadContenidoComponent />
        </div>

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
              <PostCard
                key={post.id}
                post={{ ...post, isLiked: likedMap[post.id] || false }}
                user={user}
                onLike={onLike}
                setSelectedPostForComments={setSelectedPostForComments}
                loadPosts={loadPosts}
              />
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

      <BottomNavBar />

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
