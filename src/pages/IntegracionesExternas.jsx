import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function IntegracionesExternas() {
  const [integraciones, setIntegraciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarIntegraciones();
  }, []);

  const cargarIntegraciones = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('integraciones').select('*');
    if (error) setError(error.message);
    else setIntegraciones(data);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Integraciones Externas</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando integraciones...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {integraciones.map(i => (
          <li key={i.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div><strong>Servicio:</strong> {i.servicio}</div>
            <div><strong>Estado:</strong> {i.estado}</div>
            <div><strong>Última actualización:</strong> {i.ultima_actualizacion}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
