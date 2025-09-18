import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase.from('media').select('*').then(({ data, error }) => {
      if (!mounted) return;
      if (error) setError(error.message);
      else setMedia(data || []);
      setLoading(false);
    }).catch(e => {
      if (mounted) {
        setError(String(e.message || e));
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Media</h2>
  <button onClick={() => window.location.href = '/media'} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginBottom: 8 }}>Actualizar</button>
  <button onClick={() => window.location.href = '/media/nuevo'} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Subir archivo</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Archivos e Imágenes</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {media.map(m => (
              <li key={m.id} style={{ background: m.id % 2 === 0 ? '#333' : black, marginBottom: 16, padding: 16, borderRadius: 8 }}>
                <div style={{ fontWeight: 'bold' }}>{m.nombre}</div>
                <div>{m.tipo}</div>
                <div style={{ fontSize: 12, color: black }}>{m.fecha}</div>
                <button onClick={() => window.open(m.url, '_blank')} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', marginTop: 8 }}>Ver archivo</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
  <button onClick={() => window.location.href = '/actividad'} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginBottom: 8 }}>Ver actividad</button>
  <button onClick={() => window.location.href = '/reportes'} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Ver reportes</button>
      </aside>
    </div>
  );
}