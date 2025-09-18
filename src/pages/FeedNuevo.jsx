import React, { useState } from 'react';

export default function FeedNuevo() {
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [etiquetas, setEtiquetas] = useState('');

  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: 32, borderRadius: 16, maxWidth: 700, margin: 'auto' }}>
      <h2>Crear Nueva Publicación</h2>
      <form>
        <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Escribe tu publicación..." style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12 }} />
        <input type="file" accept="image/*,video/*" onChange={e => setImagen(e.target.files[0])} style={{ marginBottom: 12 }} />
        <input type="text" value={etiquetas} onChange={e => setEtiquetas(e.target.value)} placeholder="Etiquetas (separadas por coma)" style={{ width: '100%', borderRadius: 8, padding: 8, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }}>Publicar</button>
          <button type="button" style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }}>Guardar borrador</button>
        </div>
      </form>
    </div>
  );
}
