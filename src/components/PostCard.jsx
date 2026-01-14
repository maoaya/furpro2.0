import React from 'react';
import { supabase } from '../config/supabase';

const GOLD = '#FFD700';

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

export default function PostCard({ post, user, onLike, setSelectedPostForComments, loadPosts }) {
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar publicación?')) return;
    try {
      await supabase.from('posts').delete().eq('id', post.id);
      if (loadPosts) loadPosts();
    } catch (err) {
      console.error('Error eliminando post:', err);
    }
  };

  const handleShare = () => {
    const text = `Mira este post en FutPro: ${post.description || post.contenido || 'Nueva publicación'}`;
    persistSharedMoment({
      id: post.id,
      type: 'post',
      user: post.user || 'Usuario',
      image: post.image || post.imagen_url || post.media_url,
      description: post.description || post.contenido || '',
      ubicacion: post.ubicacion || '—',
      created_at: post.created_at || new Date().toISOString(),
      likes: post.likes || 0,
      views: post.views || 0
    });
    if (navigator.share) {
      navigator.share({ text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert('📋 Link copiado al portapapeles');
    }
  };

  return (
    <article style={{ background: '#1a1a1a', borderRadius: 16, overflow: 'hidden', border: `1px solid ${GOLD}`, marginBottom: 16 }}>
      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <img 
            src={post.avatar || 'https://via.placeholder.com/48'} 
            alt={post.user} 
            style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${GOLD}`, objectFit: 'cover' }} 
          />
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{post.user || 'Usuario'}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES') : '—'}
            </div>
          </div>
        </div>
        {user?.id === post.user_id && (
          <button
            onClick={handleDelete}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#FF6B6B', 
              fontSize: 18, 
              cursor: 'pointer', 
              padding: 4,
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            title="Eliminar publicación"
          >
            •
          </button>
        )}
      </header>

      {/* IMAGEN */}
      <div style={{ width: '100%', maxHeight: 350, overflow: 'hidden', backgroundColor: '#000' }}>
        <img 
          src={post.image || post.imagen_url || post.media_url || 'https://via.placeholder.com/400'} 
          alt={post.title || 'Post'} 
          style={{ width: '100%', maxHeight: 350, display: 'block', objectFit: 'cover' }} 
        />
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: 12 }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          📍 <span>{post.ubicacion || 'Ubicación no disponible'}</span>
        </div>
        <div style={{ color: '#ddd', fontSize: 14, lineHeight: 1.5 }}>
          {post.description || post.contenido || 'Sin descripción'}
        </div>
      </div>

      {/* FOOTER - ACCIONES */}
      <footer style={{ padding: '0 12px 12px' }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
          👁️ {post.views || 0} vistas · ⚽ {post.likes || 0} likes
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => onLike?.(post.id)} 
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 6, 
              background: 'transparent', 
              border: `1px solid ${GOLD}`, 
              color: post.isLiked ? '#0f0' : GOLD, 
              padding: 8, 
              borderRadius: 8, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: 14,
              fontWeight: 600
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,215,0,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ⚽ {post.likes || 0}
          </button>
          <button
            onClick={() => setSelectedPostForComments?.(post.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'transparent',
              border: `1px solid ${GOLD}`,
              color: GOLD,
              padding: 8,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,215,0,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            💬 Comentar
          </button>
          <button
            onClick={() => {
              persistSharedMoment({
                id: post.id,
                type: 'historia',
                user: post.user || 'Usuario',
                image: post.image || post.imagen_url || post.media_url,
                description: post.description || post.contenido || '',
                ubicacion: post.ubicacion || '—',
                created_at: post.created_at || new Date().toISOString(),
                likes: post.likes || 0,
                views: post.views || 0
              });
              alert('✅ Compartido en tu historia de perfil');
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'transparent',
              border: `1px solid ${GOLD}`,
              color: '#FFD700',
              padding: 8,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
            title="Compartir en historia"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,215,0,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📖 Historia
          </button>
          {user?.id !== post.user_id && (
            <button
              onClick={handleShare}
              style={{
                flex: 1,
                background: 'transparent',
                border: `1px solid ${GOLD}`,
                color: GOLD,
                padding: 8,
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: 16,
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,215,0,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Compartir en tu perfil"
            >
              🔄
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
