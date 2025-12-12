import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function FeedPageSimple() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ content: '', image_url: '', tags: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    cargarPosts();

    // Realtime subscription
    const channel = supabase
      .channel('posts:feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        cargarPosts();
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, []);

  async function cargarPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey(email, full_name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error cargando posts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function crearPost() {
    if (!user || !newPost.content.trim()) {
      alert('Debes iniciar sesión y escribir contenido');
      return;
    }

    try {
      const tags = newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : [];
      const { error } = await supabase.from('posts').insert([{
        user_id: user.id,
        content: newPost.content.trim(),
        image_url: newPost.image_url || null,
        tags
      }]);

      if (error) throw error;
      setNewPost({ content: '', image_url: '', tags: '' });
      setShowCreatePost(false);
      alert('Post creado exitosamente');
    } catch (err) {
      console.error('Error creando post:', err);
      alert('Error al crear post');
    }
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#FFD700', minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 20 }}>📱 Feed de Publicaciones</h1>

        {/* Botón crear post */}
        <button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          style={{ 
            background: '#FFD700', 
            color: '#000', 
            padding: '12px 24px', 
            borderRadius: 8, 
            border: 'none', 
            fontWeight: 'bold',
            marginBottom: 20,
            cursor: 'pointer'
          }}
        >
          {showCreatePost ? 'Cancelar' : '➕ Crear Publicación'}
        </button>

        {/* Formulario crear post */}
        {showCreatePost && (
          <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8, marginBottom: 20, border: '1px solid #FFD700' }}>
            <h3 style={{ marginBottom: 15 }}>Nueva Publicación</h3>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="¿Qué estás pensando?"
              style={{ 
                width: '100%', 
                minHeight: 100, 
                padding: 12, 
                borderRadius: 8, 
                border: '1px solid #FFD700', 
                background: '#000', 
                color: '#fff',
                marginBottom: 12,
                fontFamily: 'inherit'
              }}
            />
            <input
              type="text"
              value={newPost.image_url}
              onChange={(e) => setNewPost(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="URL de imagen (opcional)"
              style={{ 
                width: '100%', 
                padding: 12, 
                borderRadius: 8, 
                border: '1px solid #FFD700', 
                background: '#000', 
                color: '#fff',
                marginBottom: 12
              }}
            />
            <input
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Tags separados por coma (ej: Masculino, Sub18)"
              style={{ 
                width: '100%', 
                padding: 12, 
                borderRadius: 8, 
                border: '1px solid #FFD700', 
                background: '#000', 
                color: '#fff',
                marginBottom: 12
              }}
            />
            <button 
              onClick={crearPost}
              style={{ 
                background: '#FFD700', 
                color: '#000', 
                padding: '12px 24px', 
                borderRadius: 8, 
                border: 'none', 
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Publicar
            </button>
          </div>
        )}

        {/* Lista de posts */}
        {loading ? (
          <p>Cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {posts.map(post => (
              <article key={post.id} style={{ 
                background: '#1a1a1a', 
                borderRadius: 12, 
                overflow: 'hidden', 
                border: '1px solid #FFD700' 
              }}>
                {/* Header del post */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                  <img 
                    src={post.user?.avatar_url || 'https://via.placeholder.com/50'} 
                    alt={post.user?.full_name} 
                    style={{ width: 50, height: 50, borderRadius: '50%' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{post.user?.full_name || post.user?.email || 'Usuario'}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>
                      {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {post.tags.map(tag => (
                        <span key={tag} style={{ background: '#222', padding: '4px 8px', borderRadius: 12, fontSize: 12 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div style={{ padding: '0 16px 16px', whiteSpace: 'pre-wrap' }}>
                  {post.content}
                </div>

                {/* Imagen */}
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt="Post" 
                    style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }} 
                  />
                )}

                {/* Footer con stats */}
                <div style={{ 
                  padding: 16, 
                  display: 'flex', 
                  gap: 20, 
                  borderTop: '1px solid #333',
                  fontSize: 14,
                  color: '#aaa'
                }}>
                  <span>⚽ {post.likes_count?.[0]?.count || 0} likes</span>
                  <span>💬 {post.comments_count?.[0]?.count || 0} comentarios</span>
                  <span>👁️ {post.views || 0} vistas</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
