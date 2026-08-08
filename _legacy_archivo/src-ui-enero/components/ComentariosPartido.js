import React, { useState } from 'react';

export default function ComentariosPartido({ onComentar }) {
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    if (comentario.trim()) {
      const nuevo = { texto: comentario, fecha: new Date().toISOString() };
      setComentarios([...comentarios, nuevo]);
      setComentario('');
      if (onComentar) onComentar();
    }
  };

  return (
    <div style={{margin:'16px 0'}}>
      <h4>Comentarios</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Escribe un comentario..." style={{width:'70%'}} />
        <button type="submit">Comentar</button>
      </form>
      <ul>
        {comentarios.map((c, i) => (
          <li key={i}>{c.texto} <span style={{color:'#888',fontSize:12}}>{new Date(c.fecha).toLocaleString()}</span></li>
        ))}
      </ul>
    </div>
  );
}
