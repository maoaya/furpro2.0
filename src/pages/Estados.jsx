import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './Estados.css';

const Estados = () => {
  const { user, categoria } = useAuth();
  const [estados, setEstados] = useState([]);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstados();
  }, [user]);

  const cargarEstados = () => {
    const estadosGuardados = JSON.parse(localStorage.getItem('futpro_estados') || '[]');
    setEstados(estadosGuardados);
  };

  const agregarEstado = () => {
    if (!nuevoEstado.trim()) return;

    setLoading(true);
    const nuevoEstadoObj = {
      id: Date.now(),
      texto: nuevoEstado.trim(),
      usuario: user?.email || 'Usuario',
      categoria: categoria,
      fecha: new Date().toISOString(),
      likes: 0,
      comentarios: []
    };

    const estadosActualizados = [nuevoEstadoObj, ...estados];
    setEstados(estadosActualizados);
    localStorage.setItem('futpro_estados', JSON.stringify(estadosActualizados));
    setNuevoEstado('');
    setLoading(false);
  };

  const darLike = (estadoId) => {
    const estadosActualizados = estados.map(estado =>
      estado.id === estadoId
        ? { ...estado, likes: estado.likes + 1 }
        : estado
    );
    setEstados(estadosActualizados);
    localStorage.setItem('futpro_estados', JSON.stringify(estadosActualizados));
  };

  const agregarComentario = (estadoId, comentario) => {
    const estadosActualizados = estados.map(estado =>
      estado.id === estadoId
        ? {
            ...estado,
            comentarios: [...estado.comentarios, {
              id: Date.now(),
              texto: comentario,
              usuario: user?.email || 'Usuario',
              fecha: new Date().toISOString()
            }]
          }
        : estado
    );
    setEstados(estadosActualizados);
    localStorage.setItem('futpro_estados', JSON.stringify(estadosActualizados));
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
                  <span>{estado.comentarios.length}</span>
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