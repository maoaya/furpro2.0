import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

export default function StreamingDetalle() {
  const [transmisiones, setTransmisiones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    cargarTransmisiones();
  }, []);

  const cargarTransmisiones = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('transmisiones').select('*');
    if (error) setError(error.message);
    else setTransmisiones(data);
    setLoading(false);
  };

  const handleVer = (t) => {
    setDetalle(t);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Transmisiones y Multimedia</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando transmisiones...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transmisiones.map(t => (
          <li key={t.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{t.titulo}</div>
            <div>{t.descripcion}</div>
            <div style={{ marginTop: 8 }}>
              <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold', marginRight: 8 }} onClick={() => handleVer(t)}>Ver</Button>
            </div>
          </li>
        ))}
      </ul>
      {detalle && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Detalle de Transmisión</h3>
          <div><strong>Título:</strong> {detalle.titulo}</div>
          <div><strong>Descripción:</strong> {detalle.descripcion}</div>
          {/* Aquí puedes agregar acciones de descargar, compartir, comentar, etc. */}
          <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12 }} onClick={() => setDetalle(null)}>Cerrar</Button>
        </div>
      )}
    </div>
  );
}
