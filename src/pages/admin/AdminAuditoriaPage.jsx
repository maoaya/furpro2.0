import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const gold = '#FFD700';
const black = '#222';
const PAGE_SIZE = 12;

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [accion, setAccion] = useState(null); // { tipo, log }

  useEffect(() => {
    cargarLogs();
    // eslint-disable-next-line
  }, [pagina, filtro]);

  const cargarLogs = async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('auditoria').select('*', { count: 'exact' });
    if (filtro) {
      query = query.ilike('usuario', `%${filtro}%`);
    }
    const from = (pagina - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) setError('Error al cargar logs');
    else {
      setLogs(data || []);
      setTotalPaginas(Math.max(1, Math.ceil((count || 1) / PAGE_SIZE)));
    }
    setLoading(false);
  };

  const handleBuscar = (e) => {
    setFiltro(e.target.value);
    setPagina(1);
  };

  const handleAccion = (tipo, log) => {
    setAccion({ tipo, log });
  };

  const confirmarAccion = async () => {
    if (!accion) return;
    setLoading(true);
    if (accion.tipo === 'exportar') {
      setMensaje('Log exportado (simulado)');
    }
    setAccion(null);
    setLoading(false);
    setTimeout(() => setMensaje(''), 2500);
  };

  const cancelarAccion = () => setAccion(null);

  return (
    <div style={{ background: '#181818', color: gold, minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Auditoría y Logs</h2>
      <input value={filtro} onChange={handleBuscar} placeholder="Buscar usuario..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: gold }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', background: '#232323', color: gold, borderRadius: 12, marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ padding: 12 }}>Usuario</th>
            <th style={{ padding: 12 }}>Acción</th>
            <th style={{ padding: 12 }}>Detalle</th>
            <th style={{ padding: 12 }}>Fecha</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td style={{ padding: 12 }}>{log.usuario}</td>
              <td style={{ padding: 12 }}>{log.accion}</td>
              <td style={{ padding: 12 }}>{log.detalle}</td>
              <td style={{ padding: 12 }}>{log.fecha && log.fecha.slice(0, 19).replace('T', ' ')}</td>
              <td style={{ padding: 12 }}>
                <button onClick={() => handleAccion('exportar', log)} style={{ background: '#2980b9', color: gold, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }}>Exportar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {accion && (
        <div style={{ background: '#333', color: gold, padding: 18, borderRadius: 10, marginBottom: 18 }}>
          <div>¿Seguro que deseas exportar el log de <b>{accion.log.usuario}</b>?</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={confirmarAccion} style={{ background: gold, color: black, borderRadius: 6, padding: '6px 18px', fontWeight: 'bold', marginRight: 12 }}>Confirmar</button>
            <button onClick={cancelarAccion} style={{ background: '#c0392b', color: gold, borderRadius: 6, padding: '6px 18px', fontWeight: 'bold' }}>Cancelar</button>
          </div>
        </div>
      )}
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
