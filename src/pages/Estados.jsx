import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import './Estados.css';

const Estados = () => {
  const { user, categoria } = useAuth();
  const [estados, setEstados] = useState([]);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstados();

    // Suscribirse a cambios en statuses en realtime
    const channel = supabase
      .channel('statuses:all')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'statuses' },
        () => { cargarEstados(); }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const cargarEstados = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('statuses')
      .select('id, text, user_email, category, created_at, likes_count, comments_count')
      .order('created_at', { ascending: false });
    if (!error && data) {
      const mapped = data.map(row => ({
        id: row.id,
        texto: row.text,
        usuario: row.user_email,
        categoria: row.category,
        fecha: row.created_at,
        likes: row.likes_count || 0,
        comentariosCount: row.comments_count || 0,
        comentarios: []
      }));
      setEstados(mapped);
    }
  };

  const agregarEstado = async () => {
    if (!nuevoEstado.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase
      .from('statuses')
      .insert([{ text: nuevoEstado.trim(), user_email: user.email, category: categoria }]);
    if (!error) {
      setNuevoEstado('');
      await cargarEstados();
    }
    setLoading(false);
  };

  const darLike = async (estadoId) => {
    await supabase
      .from('statuses')
      .update({ likes_count: (estados.find(e => e.id === estadoId)?.likes || 0) + 1 })
      .eq('id', estadoId);
    await cargarEstados();
  };

  const agregarComentario = async (estadoId, comentario) => {
    if (!user) return;
    await supabase
      .from('status_comments')
      .insert([{ status_id: estadoId, text: comentario, user_email: user.email }]);
    await cargarEstados();
  };

  return (
    <div className="estados-container">
      <div className="estados-header">
        <h1>Estados</h1>
        <p>Comparte lo que estás pensando</p>
      </div>

      {/* Crear nuevo estado */}
      <div className="crear-estado">
        <textarea
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
          placeholder="¿Qué estás pensando?"
          maxLength={280}
        />
        <div className="estado-actions">
          <span className="caracteres">{nuevoEstado.length}/280</span>
          <button
            onClick={agregarEstado}
            disabled={!nuevoEstado.trim() || loading}
            className="btn-publicar"
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {/* Lista de estados */}
      <div className="estados-list">
        {estados.length === 0 ? (
          <div className="no-estados">
            <p>No hay estados publicados aún.</p>
            <p>¡Sé el primero en compartir algo!</p>
          </div>
        ) : (
          estados.map(estado => (
            <div key={estado.id} className="estado-card">
              <div className="estado-header">
                <div className="usuario-info">
                  <div className="avatar-placeholder">
                    {estado.usuario.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{estado.usuario}</h4>
                    <span className="categoria-badge">{estado.categoria}</span>
                    <small>{new Date(estado.fecha).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>

              <div className="estado-contenido">
                <p>{estado.texto}</p>
              </div>

              <div className="estado-actions">
                <button
                  onClick={() => darLike(estado.id)}
                  className="btn-like"
                >
                  <i className="fas fa-heart"></i>
                  <span>{estado.likes}</span>
                </button>
                <button className="btn-comment">
                  <i className="fas fa-comment"></i>
                  <span>{estado.comentariosCount}</span>
                </button>
              </div>

              {/* Comentarios */}
              {estado.comentarios.length > 0 && (
                <div className="comentarios">
                  {estado.comentarios.map(comentario => (
                    <div key={comentario.id} className="comentario">
                      <strong>{comentario.usuario}:</strong> {comentario.texto}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Estados;