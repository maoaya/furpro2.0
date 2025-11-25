import React, { useEffect, useState } from 'react';
import { StoriesService } from '../services/StoriesService';
export default function Stories() {
  const [stories, setStories] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    StoriesService.getStories().then(setStories);
  }, []);

  const handleCrearStory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const nueva = { titulo, contenido };
      await StoriesService.crearStory(nueva);
      setTitulo(''); setContenido('');
      const actualizadas = await StoriesService.getStories();
      setStories(actualizadas);
    } catch (err) {
      setError('Error al subir historia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0002' }}>
      <h1 style={{ color: '#FFD700', textAlign: 'center' }}>Stories</h1>
      <form onSubmit={handleCrearStory} style={{ marginBottom: 24 }}>
        <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        <textarea placeholder="Contenido" value={contenido} onChange={e => setContenido(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#232323', padding: '8px 16px', borderRadius: 8 }}>Subir historia</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {stories.map(s => (
          <li key={s.id} style={{ background: '#232323', color: '#FFD700', marginBottom: 12, borderRadius: 8, padding: 12 }}>
            <strong>{s.titulo}</strong>
            <div>{s.contenido}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
