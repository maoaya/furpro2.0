import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ReportesGenerales() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('reportes_generales').select('*');
    if (error) setError(error.message);
    else setReportes(data);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Reportes Generales</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando reportes...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reportes.map(r => (
          <li key={r.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div><strong>Fecha:</strong> {r.fecha}</div>
            <div><strong>Tipo:</strong> {r.tipo}</div>
            <div><strong>Detalle:</strong> {r.detalle}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
