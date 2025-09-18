import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

export default function MediaDetalle() {
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    cargarArchivos();
  }, []);

  const cargarArchivos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('media').select('*');
    if (error) setError(error.message);
    else setArchivos(data);
    setLoading(false);
  };

  const handleVer = (a) => {
    setDetalle(a);
  };

  const handleEliminar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) setFeedback('Error al eliminar archivo');
    else setFeedback('Archivo eliminado');
    cargarArchivos();
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Multimedia</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando archivos...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {archivos.map(a => (
          <li key={a.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{a.titulo}</div>
            <div>{a.descripcion}</div>
            <div style={{ marginTop: 8 }}>
              <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold', marginRight: 8 }} onClick={() => handleVer(a)}>Ver</Button>
              <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} onClick={() => handleEliminar(a.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
      {detalle && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Detalle de Archivo</h3>
          <div><strong>Título:</strong> {detalle.titulo}</div>
          <div><strong>Descripción:</strong> {detalle.descripcion}</div>
          {/* Aquí puedes agregar acciones de descargar, compartir, comentar, etc. */}
          <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12 }} onClick={() => setDetalle(null)}>Cerrar</Button>
        </div>
      )}
    </div>
  );
}
