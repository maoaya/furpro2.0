import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function LogrosPage() {
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarLogros();
  }, []);

  const cargarLogros = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('logros').select('*');
    if (error) setError(error.message);
    else setLogros(data);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Logros</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando logros...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {logros.map(l => (
          <li key={l.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div><strong>Nombre:</strong> {l.nombre}</div>
            <div><strong>Descripción:</strong> {l.descripcion}</div>
            <div><strong>Fecha:</strong> {l.fecha}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}