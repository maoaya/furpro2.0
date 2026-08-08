import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const gold = '#FFD700';
const black = '#222';
const PAGE_SIZE = 10;

export default function AdminNotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [nueva, setNueva] = useState({ titulo: '', cuerpo: '' });

  useEffect(() => {
    cargarNotificaciones();
    // eslint-disable-next-line
  }, [pagina, filtro]);

  const cargarNotificaciones = async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('notificaciones').select('*', { count: 'exact' });
    if (filtro) {
      query = query.ilike('titulo', `%${filtro}%`);
    }
    const from = (pagina - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) setError('Error al cargar notificaciones');
    else {
      setNotificaciones(data || []);
      setTotalPaginas(Math.max(1, Math.ceil((count || 1) / PAGE_SIZE)));
    }
    setLoading(false);
  };

  const handleBuscar = (e) => {
    setFiltro(e.target.value);
    setPagina(1);
  };

  const handleNuevaChange = (e) => {
    setNueva({ ...nueva, [e.target.name]: e.target.value });
  };

  const enviarNotificacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de envío (debería integrar push/email real)
    await supabase.from('notificaciones').insert([{ ...nueva, fecha: new Date().toISOString() }]);
    setMensaje('Notificación enviada');
    setNueva({ titulo: '', cuerpo: '' });
    setLoading(false);
    cargarNotificaciones();
    setTimeout(() => setMensaje(''), 2500);
  };

  return (
    <div style={{ background: '#181818', color: gold, minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Gestión de Notificaciones</h2>
      <form onSubmit={enviarNotificacion} style={{ marginBottom: 24, background: '#232323', padding: 18, borderRadius: 10 }}>
        <div style={{ marginBottom: 8 }}>
          <input name="titulo" value={nueva.titulo} onChange={handleNuevaChange} placeholder="Título" required style={{ borderRadius: 8, padding: 8, width: 220, marginRight: 12 }} />
          <input name="cuerpo" value={nueva.cuerpo} onChange={handleNuevaChange} placeholder="Cuerpo" required style={{ borderRadius: 8, padding: 8, width: 320 }} />
          <button type="submit" style={{ marginLeft: 12, background: gold, color: black, borderRadius: 6, padding: '8px 18px', fontWeight: 'bold' }}>Enviar</button>
        </div>
      </form>
      <input value={filtro} onChange={handleBuscar} placeholder="Buscar notificación..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: gold }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', background: '#232323', color: gold, borderRadius: 12, marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ padding: 12 }}>Título</th>
            <th style={{ padding: 12 }}>Cuerpo</th>
            <th style={{ padding: 12 }}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map(n => (
            <tr key={n.id}>
              <td style={{ padding: 12 }}>{n.titulo}</td>
              <td style={{ padding: 12 }}>{n.cuerpo}</td>
              <td style={{ padding: 12 }}>{n.fecha && n.fecha.slice(0, 19).replace('T', ' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {mensaje && (
        <div style={{ background: '#222', color: gold, padding: 10, borderRadius: 8, marginBottom: 18 }}>{mensaje}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        <button disabled={pagina === 1} onClick={() => setPagina(p => Math.max(1, p - 1))} style={{ padding: '8px 18px', borderRadius: 8, background: gold, color: black, fontWeight: 'bold' }}>Anterior</button>
        <span style={{ alignSelf: 'center' }}>Página {pagina} de {totalPaginas}</span>
        <button disabled={pagina === totalPaginas} onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} style={{ padding: '8px 18px', borderRadius: 8, background: gold, color: black, fontWeight: 'bold' }}>Siguiente</button>
      </div>
    </div>
  );
}
