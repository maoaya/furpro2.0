import React, { useEffect, useState } from 'react';
import mediaService from '../services/mediaService';
import commentService from '../services/commentService';
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';
import { useWebSocketComments } from '../hooks/useWebSocketComments';
import { useWebSocketLikes } from '../hooks/useWebSocketLikes';
import CopilotAyuda from '../components/CopilotAyuda';
import FutproLogo from '../components/FutproLogo.jsx';

const gold = '#FFD700';
const black = '#181818';

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
  const [publicaciones, setPublicaciones] = useState([]);
  const [likesState, setLikesState] = useState({});
  const [commentsState, setCommentsState] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [shareFeedback, setShareFeedback] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
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
    async function fetchGalleryAndComments() {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await mediaService.getGallery(token);
        if (res.gallery) {
          setPublicaciones(res.gallery);
          // Cargar comentarios para cada publicación
          const commentsObj = {};
          for (const pub of res.gallery) {
            const cres = await commentService.getComments(pub.id, token);
            commentsObj[pub.id] = cres.comentarios || [];
          }
          setCommentsState(commentsObj);
        }
      } catch (e) {}
    }
    fetchGalleryAndComments();
  }, []);

  // Like real
  const handleLike = async (mediaId) => {
    const token = localStorage.getItem('token') || '';
    await fetch('/api/media/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ mediaId })
    });
  };

  // Compartir publicación
  const handleShare = async (id) => {
    const url = window.location.origin + '/publicacion/' + id;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mira esta publicación en FutPro', url });
        setShareFeedback(prev => ({ ...prev, [id]: '¡Compartido!' }));
        setTimeout(() => setShareFeedback(prev => ({ ...prev, [id]: '' })), 1500);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback(prev => ({ ...prev, [id]: '¡Copiado!' }));
        setTimeout(() => setShareFeedback(prev => ({ ...prev, [id]: '' })), 1500);
      } catch {}
    }
  };


  // Enviar comentario real
  const handleComment = async (pubId) => {
    const text = commentInputs[pubId];
    if (!text) return;
    const token = localStorage.getItem('token') || '';
    const res = await commentService.addComment(pubId, text, token);
    if (res.comentario) {
      setCommentsState(prev => ({
        ...prev,
        [pubId]: [...(prev[pubId] || []), res.comentario]
      }));
      setCommentInputs(prev => ({ ...prev, [pubId]: '' }));
    }
  };

  // Filtrar publicaciones por búsqueda
  const publicacionesFiltradas = publicaciones.filter(pub =>
    pub.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    pub.descripcion?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: black, minHeight: '100vh', color: gold, display: 'flex' }}>
      {/* Notificación en tiempo real */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'error' ? '#b71c1c' : '#232323',
          color: gold,
          border: `2px solid ${gold}`,
          borderRadius: 12,
          padding: '14px 32px',
          zIndex: 1000,
          fontWeight: 'bold',
          fontSize: 18,
          boxShadow: '0 2px 12px #0008',
          minWidth: 320,
          textAlign: 'center',
          animation: 'fadeInDown 0.5s',
        }}>
          {notification.msg || '¡Tienes una nueva notificación!'}
        </div>
      )}
      {/* Menú lateral fijo */}
      <aside style={{ width: 90, background: '#232323', color: gold, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', boxShadow: '2px 0 12px #0008', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ marginBottom: 32 }}><FutproLogo size={54} /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <a href="/home" title="Inicio" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>🏠</a>
          <a href="/perfil" title="Mi perfil" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>👤</a>
          <a href="/publicaciones" title="Publicaciones" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>📰</a>
          <a href="/marketplace" title="Marketplace" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>💼</a>
          <a href="/chat" title="Chat" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>💬</a>
          <a href="/notificaciones" title="Notificaciones" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>🔔</a>
          <a href="/torneos" title="Torneos" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>🏆</a>
          <a href="/equipos" title="Equipos" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>🛡️</a>
          <a href="/streaming" title="Transmisiones" style={{ color: gold, fontSize: 28, textAlign: 'center' }}>📺</a>
          <a href="/logout" title="Cerrar sesión" style={{ color: gold, fontSize: 28, textAlign: 'center', marginTop: 32 }}>🚪</a>
        </nav>
      </aside>
      {/* Contenido principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header superior visual */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: black, borderBottom: `2px solid ${gold}`, padding: '18px 32px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontWeight: 'bold', fontSize: 28, color: gold }}>FutPro</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ padding: 6, borderRadius: 8, border: `1px solid ${gold}`, background: black, color: gold, fontSize: 15, width: 180 }} />
            <a href="/notificaciones" style={{ color: gold, fontSize: 26 }} title="Notificaciones">🔔</a>
          </div>
        </header>
        {/* Accesos directos visuales */}
        <nav style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '32px 0 24px 0' }}>
          <a href="/publicaciones" style={{ color: gold, fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>Publicaciones</a>
          <a href="/marketplace" style={{ color: gold, fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>Marketplace</a>
          <a href="/panel-video" style={{ color: gold, fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>Panel de Video</a>
          <a href="/en-vivos" style={{ color: gold, fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>En Vivos</a>
          <a href="/campanas" style={{ color: gold, fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>Campañas</a>
          <a href="/notificaciones" style={{ color: gold, fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>Notificaciones</a>
        </nav>
        {/* Feed visual tipo Instagram */}
        <main style={{ maxWidth: 1100, margin: 'auto', padding: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' }}>Bienvenido a FutPro</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
            <div>
              <h2>Publicaciones</h2>
              {publicacionesFiltradas.length === 0 && <div>No hay publicaciones aún.</div>}
            </div>
            {publicacionesFiltradas.map(pub => (
              <div key={pub.id} style={{ background: '#232323', borderRadius: 12, padding: 12, width: 260, boxShadow: '0 2px 8px #FFD70022', position: 'relative' }}>
                {pub.tipo === 'imagen' && <img src={pub.url} alt={pub.nombre} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}
                {pub.tipo === 'video' && <video src={pub.url} controls style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{pub.nombre}</div>
                <div style={{ fontSize: 12, color: '#FFD70099', marginBottom: 4 }}>{pub.fecha ? new Date(pub.fecha).toLocaleString() : ''}</div>
                <div style={{ fontSize: 13, color: '#FFD700cc', marginBottom: 8 }}>{pub.descripcion || ''}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <button onClick={() => handleLike(pub.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22 }} title="Me gusta">
                    <span role="img" aria-label="balón">⚽</span>
                  </button>
                  <span style={{ fontWeight: 'bold', fontSize: 16 }}>{likesState[pub.id] || 0}</span>
                  <span style={{ fontSize: 13, color: '#FFD70099' }}>Me gusta</span>
                </div>
                {/* Compartir y URL */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <button onClick={() => handleShare(pub.id)} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>
                    Compartir
                  </button>
                  <input
                    value={window.location.origin + pub.url}
                    readOnly
                    style={{ width: 120, fontSize: 12, border: `1px solid ${gold}`, borderRadius: 6, background: black, color: gold, padding: '2px 6px' }}
                    onFocus={e => e.target.select()}
                  />
                  {shareFeedback[pub.id] && <span style={{ color: gold, fontWeight: 'bold', fontSize: 13 }}>{shareFeedback[pub.id]}</span>}
                </div>
                {/* Comentarios */}
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="Agregar comentario..."
                    value={commentInputs[pub.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [pub.id]: e.target.value }))}
                    style={{ width: '70%', padding: 6, borderRadius: 6, border: `1px solid ${gold}`, marginRight: 4 }}
                  />
                  <button onClick={() => handleComment(pub.id)} style={{ background: gold, color: black, border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Comentar</button>
                </div>
                <div style={{ maxHeight: 80, overflowY: 'auto', fontSize: 13, color: gold, background: black, borderRadius: 6, padding: 6 }}>
                  {(commentsState[pub.id] || []).map((c, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      <span style={{ color: gold, fontWeight: 'bold' }}>• </span>{c.text} <span style={{ color: '#FFD70099', fontSize: 11 }}>{c.date ? `(${new Date(c.date).toLocaleString()})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <h2>¡Destacado!</h2>
            <div>Videos y En Vivos</div>
            <h2>Chat en Tiempo Real</h2>
            <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '14px 32px', fontWeight: 'bold', fontSize: 20, cursor: 'pointer', marginTop: 16 }}>Enviar</button>
          </div>
        </main>
        {/* Barra de navegación inferior fija */}
        <nav style={{ position: 'fixed', left: 0, bottom: 0, width: '100vw', background: black, borderTop: `2px solid ${gold}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 64, zIndex: 30 }}>
          <button onClick={() => { setFeedbackNav('Navegando a Home...'); setTimeout(()=>{ window.location.href='/'; }, 400); }} style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}>
            <span role="img" aria-label="home">🏠</span>
            <span style={{ fontSize: 12 }}>Home</span>
          </button>
          <button onClick={() => { setFeedbackNav('Navegando a Marketplace...'); setTimeout(()=>{ window.location.href='/marketplace'; }, 400); }} style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}>
            <span role="img" aria-label="ofertas">💼</span>
            <span style={{ fontSize: 12 }}>Ofertas</span>
          </button>
          <button onClick={() => { setFeedbackNav('Navegando a TV...'); setTimeout(()=>{ window.location.href='/streaming'; }, 400); }} style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}>
            <span role="img" aria-label="tv">📺</span>
            <span style={{ fontSize: 12 }}>TV</span>
          </button>
          <button onClick={() => { setFeedbackNav('Navegando a Calendario...'); setTimeout(()=>{ window.location.href='/calendario'; }, 400); }} style={{ background: 'none', border: 'none', color: gold, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }}>
            <span role="img" aria-label="calendario">📅</span>
            <span style={{ fontSize: 12 }}>Calendario</span>
          </button>
        </nav>
        {feedbackNav && <div style={{position:'fixed',bottom:70,left:0,width:'100vw',textAlign:'center',color:gold,fontWeight:'bold',fontSize:18,zIndex:99,background:'#232323cc',padding:'8px 0',borderRadius:8}}>{feedbackNav}</div>}
        {/* Copilot ayuda */}
        <div style={{ marginTop: 48 }}>
          <CopilotAyuda />
        </div>
      </div>
    </div>
  );
}
