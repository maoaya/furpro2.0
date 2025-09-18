import React, { useState } from 'react';

const publicacionesDemo = [
  { id: 1, autor: 'admin', contenido: '¡Gran partido hoy!', likes: 5, comentarios: ['¡Felicidades!', 'Buen juego'] },
  { id: 2, autor: 'coach', contenido: 'Entrenamiento mañana 8am', likes: 2, comentarios: ['Listo!', 'Nos vemos'] },
];

export default function FeedDetalle() {
  const [comentario, setComentario] = useState('');
  const [publicacion] = useState(publicacionesDemo[0]);

  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: 32, borderRadius: 16, maxWidth: 700, margin: 'auto' }}>
      <h2>Detalle de Publicación</h2>
      <div style={{ marginBottom: 18 }}>
        <strong>Autor:</strong> {publicacion.autor}<br />
        <strong>Contenido:</strong> {publicacion.contenido}<br />
        <strong>Likes:</strong> {publicacion.likes}
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginLeft: 12 }}>Like</button>
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginLeft: 12 }}>Compartir</button>
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginLeft: 12 }}>Reportar</button>
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>Comentarios:</strong>
        <ul>
          {publicacion.comentarios.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
        <textarea value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Agregar comentario..." style={{ width: '100%', borderRadius: 8, padding: 12 }} />
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 8 }}>Comentar</button>
      </div>
    </div>
  );
}
