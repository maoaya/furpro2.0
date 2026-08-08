
import React, { useEffect, useState } from 'react';
import PublicacionCard from './PublicacionCard';

export default function ListaPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const pubs = JSON.parse(localStorage.getItem('publicaciones') || '[]');
    setPublicaciones(pubs);
  }, []);

  return (
    <>
      <h3>Publicaciones</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {publicaciones.length === 0 && <li>No hay publicaciones.</li>}
        {publicaciones.map(p => (
          <li key={p.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <PublicacionCard publicacion={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
