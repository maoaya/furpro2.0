import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

export default function ModeracionReportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('reportes').select('*');
    if (error) setError(error.message);
    else setReportes(data);
    setLoading(false);
  };

  const handleVer = (r) => {
    setDetalle(r);
  };

  const handleEliminar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('reportes').delete().eq('id', id);
    if (error) setFeedback('Error al eliminar reporte');
    else setFeedback('Reporte eliminado');
    cargarReportes();
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Moderación y Administración</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reportes.map(r => (
          <li key={r.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{r.titulo}</div>
            <div>{r.descripcion}</div>
            <div style={{ marginTop: 8 }}>
              <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold', marginRight: 8 }} onClick={() => handleVer(r)}>Ver</Button>
              <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} onClick={() => handleEliminar(r.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
      {detalle && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Detalle de Reporte</h3>
          <div><strong>Título:</strong> {detalle.titulo}</div>
          <div><strong>Descripción:</strong> {detalle.descripcion}</div>
          <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12 }} onClick={() => setDetalle(null)}>Cerrar</Button>
        </div>
      )}
    </div>
  );
}
