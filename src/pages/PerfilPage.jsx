
import React, { useState, useEffect } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function PerfilPage({ usuario }) {
  // Estado para la foto/avatar
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Cargar avatar actual al montar
  useEffect(() => {
    async function fetchAvatar() {
      try {
        const res = await fetch(`/uploads/user_${usuario}.json`);
        if (res.ok) {
          const data = await res.json();
          if (data.photoUrl) setAvatarUrl(data.photoUrl);
        }
      } catch (e) {
        // noop: error al cargar avatar inicial
      }
    }
    fetchAvatar();
  }, [usuario]);

  // Subir/cambiar avatar
  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Si ya hay avatar, usar PUT, si no, POST
      const method = avatarUrl ? 'PUT' : 'POST';
      const res = await fetch(`/api/user/profile/photo`, {
        method,
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.photoUrl) {
        setAvatarUrl(data.photoUrl);
      }
    } catch (e) {
      // noop: error al subir avatar
    }
    setAvatarLoading(false);
  }
  // Simulación localStorage para posts de usuario
  const [posts, setPosts] = useState(() => {
    const all = JSON.parse(localStorage.getItem('publicaciones') || '[]');
    return all.filter(p => p.usuario === usuario);
  });
  const [postContent, setPostContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [shareFeedback, setShareFeedback] = useState({});

  const handlePost = () => {
    if (!postContent && !mediaFile) return;
    let mediaUrl = null;
    if (mediaFile) {
      mediaUrl = URL.createObjectURL(mediaFile);
    }
    const nueva = {
      id: Date.now(),
      usuario,
      titulo: postContent.substring(0, 30),
      descripcion: postContent,
      fecha: new Date().toISOString(),
      url: mediaUrl,
      tipo: mediaFile ? (mediaFile.type.startsWith('video') ? 'video' : 'foto') : null
    };
    const all = JSON.parse(localStorage.getItem('publicaciones') || '[]');
    const updated = [nueva, ...all];
    localStorage.setItem('publicaciones', JSON.stringify(updated));
    setPosts([nueva, ...posts]);
    setPostContent('');
    setMediaFile(null);
  };

  // Compartir/copy URL
  const handleShare = async (id) => {
    const url = window.location.origin + '/publicacion/' + id;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mira este post en FutPro', url });
        setShareFeedback(prev => ({ ...prev, [id]: '¡Compartido!' }));
        setTimeout(() => setShareFeedback(prev => ({ ...prev, [id]: '' })), 1500);
      } catch (e) {
        // noop: usuario canceló o share no disponible
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback(prev => ({ ...prev, [id]: '¡Copiado!' }));
        setTimeout(() => setShareFeedback(prev => ({ ...prev, [id]: '' })), 1500);
      } catch (e) {
        // noop: permiso denegado para clipboard
      }
    }
  };

  // Reportar post
  function reportarPost(postId) {
    const motivo = prompt('Motivo del reporte:');
    if (!motivo) return;
    fetch('/api/moderation/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId: postId, reason: motivo }),
      credentials: 'include',
    }).then(res => {
      if (res.ok) alert('Reporte enviado');
      else alert('Error al reportar');
    });
  }

  return (
  <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }} role="main" aria-label="Perfil de usuario">
  <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }} aria-label="Menú lateral de perfil">
  <h2 style={{ color: gold }} tabIndex={0}>Perfil de {usuario}</h2>
  <div style={{ margin: '24px 0', textAlign: 'center' }} aria-label="Foto de perfil" tabIndex={0}>
          <div style={{ marginBottom: 8 }}>
            {avatarLoading ? (
              <span style={{ color: gold }}>Subiendo...</span>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${gold}` }} />
            ) : (
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#333', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: 32, border: `2px solid ${gold}` }}>?</div>
            )}
          </div>
          <label htmlFor="avatar-upload" style={{ display: 'block', marginBottom: 4, color: gold }}>Subir nueva foto</label>
          <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'block', margin: '0 auto' }} aria-label="Subir foto de perfil" />
          <small style={{ color: gold, display: 'block', marginTop: 4 }}>Cambiar foto de perfil</small>
        </div>
        <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s', cursor: 'pointer' }} onClick={() => window.history.back()}>Volver</button>
      </aside>
  <main style={{ flex: 1, padding: 32, background: black }} aria-label="Contenido principal del perfil">
  <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }} role="region" aria-label="Publicaciones del usuario">
          <h1 tabIndex={0}>Posts de {usuario}</h1>
          <div style={{ marginBottom: 24 }} role="form" aria-label="Crear nueva publicación">
            <label htmlFor="post-content" style={{ color: black, fontWeight: 'bold' }}>Contenido</label>
            <textarea id="post-content" value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="¿Qué quieres compartir?" style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 8 }} aria-label="Contenido de la publicación" />
            <label htmlFor="media-upload" style={{ color: black, fontWeight: 'bold' }}>Adjuntar imagen o video</label>
            <input id="media-upload" type="file" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files[0])} style={{ marginBottom: 8 }} aria-label="Adjuntar imagen o video" />
            <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s', cursor: 'pointer' }} onClick={handlePost} aria-label="Publicar">Postear</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }} aria-label="Lista de publicaciones">
            {posts.map(f => (
              <li key={f.id} style={{ background: '#232323', marginBottom: 16, padding: 16, borderRadius: 8, color: gold, position: 'relative' }} tabIndex={0} aria-label={`Publicación ${f.titulo}`}>
                <div style={{ fontWeight: 'bold' }}>{f.titulo}</div>
                <div>{f.descripcion}</div>
                {f.url && (f.tipo === 'foto' ? <img src={f.url} alt="media" style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }} /> : <video src={f.url} controls style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }} />)}
                <div style={{ fontSize: 12, color: gold }}>{f.fecha && new Date(f.fecha).toLocaleString()}</div>
                {/* Compartir y URL */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <button onClick={() => handleShare(f.id)} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>
                    Compartir
                  </button>
                  <input
                    value={window.location.origin + '/publicacion/' + f.id}
                    readOnly
                    style={{ width: 120, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }}
                    onFocus={e => e.target.select()}
                  />
                  {shareFeedback[f.id] && <span style={{ color: gold, fontWeight: 'bold', fontSize: 13 }}>{shareFeedback[f.id]}</span>}
                  <button style={{ background: '#c00', color: gold, border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }} onClick={() => reportarPost(f.id)}>Reportar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
  <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s', cursor: 'pointer' }} onClick={() => window.location.href = '/actividad'}>Ver actividad</button>
  <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s', cursor: 'pointer' }} onClick={() => window.location.href = '/reportes'}>Ver reportes</button>
  <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s', cursor: 'pointer' }} onClick={() => window.location.href = '/privacidad-seguridad'}>Privacidad y seguridad</button>
      </aside>
    </div>
  );
}