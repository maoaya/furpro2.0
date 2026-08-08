import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function HistorialEquipo() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [fecha, setFecha] = useState('');
  const [usuario, setUsuario] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('historial_equipo').select('*');
    if (error) setError(error.message);
    else setHistorial(data);
    setLoading(false);
  };

  const filtrados = historial.filter(e =>
    (!filtro || e.tipo === filtro) &&
    (!fecha || e.fecha === fecha) &&
    (!usuario || e.usuario === usuario)
  );

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Historial del Equipo</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando historial...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="">Todos</option>
          <option value="Partido">Partido</option>
          <option value="Logro">Logro</option>
          <option value="Sanción">Sanción</option>
        </select>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }}>Exportar PDF</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtrados.map(h => (
          <li key={h.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div><strong>Fecha:</strong> {h.fecha}</div>
            <div><strong>Evento:</strong> {h.evento}</div>
            <div><strong>Detalle:</strong> {h.detalle}</div>
          </li>
        ))}
      </ul>
      <div style={{ marginBottom: 24 }}>
        <textarea value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Agregar comentario..." style={{ width: '100%', borderRadius: 8, padding: 12 }} />
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 8 }}>Agregar comentario</button>
      </div>
    </div>
  );
}
