import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const gold = '#FFD700';
const darkCard = '#1a1a1a';
const black = '#0a0a0a';

export default function CommentsModal({ postId, isOpen, onClose }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Cargar comentarios cuando se abre el modal
  useEffect(() => {
    if (isOpen && postId) {
      cargarComentarios();
    }
  }, [isOpen, postId]);

  // Suscribirse a cambios de comentarios en realtime
  useEffect(() => {
    if (!isOpen || !postId) return;

    const channel = supabase
      .channel(`comments:post:${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, () => {
        cargarComentarios();
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, [isOpen, postId]);

  async function cargarComentarios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          parent_id,
          user:users!comments_user_id_fkey(full_name, avatar_url, email)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organizar comentarios: principales y replies
      const mainComments = data?.filter(c => !c.parent_id) || [];
      const organized = mainComments.map(comment => ({
        ...comment,
        replies: data?.filter(c => c.parent_id === comment.id) || []
      }));

      setComments(organized);
    } catch (err) {
      console.error('Error cargando comentarios:', err);
    } finally {
      setLoading(false);
    }
  }

  async function agregarComentario() {
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }
    if (!newComment.trim()) {
      alert('Escribe un comentario');
      return;
    }

    try {
      await supabase.from('comments').insert([{
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
        parent_id: null
      }]);
      setNewComment('');
      await cargarComentarios();
    } catch (err) {
      console.error('Error al comentar:', err);
    }
  }

  async function agregarRespuesta() {
    if (!user) {
      alert('Debes iniciar sesión para responder');
      return;
    }
    if (!replyText.trim() || !replyTo) {
      alert('Escribe una respuesta');
      return;
    }

    try {
      await supabase.from('comments').insert([{
        post_id: postId,
        user_id: user.id,
        content: replyText.trim(),
        parent_id: replyTo
      }]);
      setReplyText('');
      setReplyTo(null);
      await cargarComentarios();
    } catch (err) {
      console.error('Error al responder:', err);
    }
  }

  async function eliminarComentario(commentId) {
    if (window.confirm('¿Eliminar comentario?')) {
      try {
        await supabase.from('comments').delete().eq('id', commentId);
        await cargarComentarios();
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: darkCard,
        border: `2px solid ${gold}`,
        borderRadius: 12,
        width: '90%',
        maxWidth: 600,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 0 20px rgba(255, 215, 0, 0.3)`
      }}>
        {/* Header */}
        <div style={{
          borderBottom: `1px solid ${gold}`,
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: gold, margin: 0 }}>💬 Comentarios ({comments.length})</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${gold}`,
              color: gold,
              width: 32,
              height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: 18
            }}
          >
            ✕
          </button>
        </div>

        {/* Lista de comentarios */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          color: '#eee'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Cargando comentarios...</div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
              No hay comentarios aún. ¡Sé el primero en comentar!
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{ marginBottom: '20px' }}>
                {/* Comentario principal */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <img
                    src={comment.user?.avatar_url || 'https://via.placeholder.com/40'}
                    alt={comment.user?.full_name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: 8,
                      padding: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: 'bold', color: gold }}>
                        {comment.user?.full_name || comment.user?.email}
                      </div>
                      <div style={{ color: '#ddd', marginTop: '4px' }}>
                        {comment.content}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                      {user?.id === comment.user_id && (
                        <button
                          onClick={() => eliminarComentario(comment.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: gold,
                          cursor: 'pointer'
                        }}
                      >
                        ↩️ Responder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Respuestas */}
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginLeft: '52px', borderLeft: `2px solid ${gold}`, paddingLeft: '12px' }}>
                    {comment.replies.map(reply => (
                      <div key={reply.id} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <img
                          src={reply.user?.avatar_url || 'https://via.placeholder.com/32'}
                          alt={reply.user?.full_name}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            background: 'rgba(255, 215, 0, 0.05)',
                            borderRadius: 6,
                            padding: '8px 10px'
                          }}>
                            <div style={{ fontWeight: 'bold', color: gold, fontSize: '13px' }}>
                              {reply.user?.full_name || reply.user?.email}
                            </div>
                            <div style={{ color: '#ddd', marginTop: '3px', fontSize: '13px' }}>
                              {reply.content}
                            </div>
                          </div>
                          {user?.id === reply.user_id && (
                            <button
                              onClick={() => eliminarComentario(reply.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ff6b6b',
                                cursor: 'pointer',
                                fontSize: '11px',
                                marginTop: '4px'
                              }}
                            >
                              🗑️ Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input respuesta */}
                {replyTo === comment.id && (
                  <div style={{
                    marginLeft: '52px',
                    marginBottom: '12px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      onKeyPress={(e) => e.key === 'Enter' && agregarRespuesta()}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: `1px solid ${gold}`,
                        background: '#111',
                        color: gold,
                        fontSize: '13px'
                      }}
                    />
                    <button
                      onClick={agregarRespuesta}
                      style={{
                        background: gold,
                        color: black,
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => { setReplyTo(null); setReplyText(''); }}
                      style={{
                        background: 'transparent',
                        border: `1px solid #666`,
                        color: '#888',
                        borderRadius: 6,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div style={{ borderBottom: `1px solid rgba(255, 215, 0, 0.1)`, marginTop: '12px' }} />
              </div>
            ))
          )}
        </div>

        {/* Input nuevo comentario */}
        <div style={{
          borderTop: `1px solid ${gold}`,
          padding: '16px 20px',
          background: 'rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              onKeyPress={(e) => e.key === 'Enter' && agregarComentario()}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 8,
                border: `1px solid ${gold}`,
                background: '#111',
                color: gold,
                fontSize: '14px'
              }}
            />
            <button
              onClick={agregarComentario}
              style={{
                background: gold,
                color: black,
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              💬 Comentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
