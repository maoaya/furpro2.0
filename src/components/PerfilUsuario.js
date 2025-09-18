import React from 'react';
import './PerfilUsuario.css';

// Panel de perfil estilo Instagram/TikTok
export default function PerfilUsuario({ usuario }) {
  if (!usuario) return null;
  const { nombre, fotoPerfil, banner, bio, ubicacion, equipo, rol, nivel, partidos, goles, logros, seguidores, seguidos, posts } = usuario;

  return (
    <div className="perfil-usuario-panel">
      <div className="perfil-banner" style={{ backgroundImage: `url(${banner})` }} />
      <div className="perfil-header">
        <img className="perfil-foto" src={fotoPerfil} alt={nombre} />
        <div className="perfil-info">
          <h2>{nombre}</h2>
          <p className="perfil-bio">{bio}</p>
          <div className="perfil-meta">
            <span>Ubicación: {ubicacion}</span>
            <span>Equipo: {equipo}</span>
            <span>Rol: {rol}</span>
            <span>Nivel: {nivel}</span>
          </div>
        </div>
        <div className="perfil-stats">
          <div><strong>{partidos}</strong><span>Partidos</span></div>
          <div><strong>{goles}</strong><span>Goles</span></div>
          <div><strong>{logros?.length || 0}</strong><span>Logros</span></div>
        </div>
      </div>
      <div className="perfil-social">
        <div><strong>{seguidores?.length || 0}</strong><span>Seguidores</span></div>
        <div><strong>{seguidos?.length || 0}</strong><span>Seguidos</span></div>
        <div><strong>{posts?.length || 0}</strong><span>Posts</span></div>
      </div>
      <div className="perfil-actions">
        <button>Seguir</button>
        <button>Mensaje</button>
        <button>Compartir</button>
      </div>
      <div className="perfil-galeria">
        <h3>Galería</h3>
        <div className="galeria-grid">
          {posts?.map((post, idx) => (
            <div key={idx} className="galeria-item">
              {post.tipo === 'video' ? (
                <video src={post.url} controls />
              ) : (
                <img src={post.url} alt={post.descripcion || 'Post'} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="perfil-logros">
        <h3>Logros</h3>
        <ul>
          {logros?.map((logro, idx) => (
            <li key={idx}>{logro}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
