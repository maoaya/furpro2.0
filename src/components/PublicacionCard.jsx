

import React, { useState } from 'react';

export default function PublicacionCard({ publicacion }) {
  const [copiado, setCopiado] = useState(false);
  const urlPublicacion = `${window.location.origin}/publicacion/${publicacion.id}`;

  const handleCompartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: publicacion.titulo || publicacion.nombre,
          text: publicacion.descripcion,
          url: urlPublicacion,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(urlPublicacion);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  return (
    <div style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: 18, marginBottom: 18, boxShadow: '0 2px 12px #FFD70033' }}>
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>{publicacion.titulo || publicacion.nombre}</div>
      {publicacion.tipo === 'foto' && publicacion.url && (
        <img src={publicacion.url} alt={publicacion.nombre} style={{ width: 220, borderRadius: 12, margin: '12px 0', border: '2px solid #FFD700' }} />
      )}
      {publicacion.tipo === 'video' && publicacion.url && (
        <video src={publicacion.url} controls style={{ width: 320, borderRadius: 12, margin: '12px 0', border: '2px solid #FFD700' }} />
      )}
      <div>{publicacion.descripcion}</div>
      {/* Etiquetas de usuarios */}
      {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
        <div style={{ margin: '8px 0' }}>
          {publicacion.etiquetas.map((tag, i) => (
            <span key={i} style={{ background: '#FFD700', color: '#232323', borderRadius: 6, padding: '2px 8px', marginRight: 6, fontSize: 12 }}>@{tag}</span>
          ))}
        </div>
      )}
      <div style={{ fontSize: 12, color: '#FFD70099', marginTop: 8 }}>Subido: {publicacion.fecha ? new Date(publicacion.fecha).toLocaleString() : ''}</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={handleCompartir} style={{ background: '#FFD700', color: '#232323', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Compartir
        </button>
        {copiado && <span style={{ color: '#FFD700', fontSize: 12 }}>¡Enlace copiado!</span>}
      </div>
    </div>
  );
}
