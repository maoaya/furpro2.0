import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function HistorialPromociones() {
  const [promociones, setPromociones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPromociones();
  }, [filtro]);

  const cargarPromociones = async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('promociones').select('*');
    if (filtro) {
      query = query.ilike('ciudad', `%${filtro}%`).ilike('pais', `%${filtro}%`);
    }
    const { data, error } = await query;
    if (error) setError(error.message);
    else setPromociones(data);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Historial de Promociones</h2>
      <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Filtrar por país o ciudad..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: '#FFD700' }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', background: '#232323', borderRadius: 8 }}>
        <thead>
          <tr style={{ color: '#FFD700' }}>
            <th>Producto/Servicio</th>
            <th>Usuario</th>
            <th>Ciudad</th>
            <th>País</th>
            <th>Estado</th>
            <th>Link de pago</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map(p => (
            <tr key={p.id}>
              <td>{p.descripcion}</td>
              <td>{p.nombre} {p.apellido}</td>
              <td>{p.ciudad}</td>
              <td>{p.pais}</td>
              <td>{p.estado}</td>
              <td><a href={p.link_pago} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'underline' }}>Ver pago</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
