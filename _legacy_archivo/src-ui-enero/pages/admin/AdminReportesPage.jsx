import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const gold = '#FFD700';
const black = '#222';
const PAGE_SIZE = 10;

export default function AdminReportesPage() {
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [accion, setAccion] = useState(null); // { tipo, reporte }
  const [mensaje, setMensaje] = useState('');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    cargarReportes();
    // eslint-disable-next-line
  }, [pagina, filtro]);

  const cargarReportes = async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('reportes').select('*', { count: 'exact' });
    if (filtro) {
      query = query.ilike('usuario', `%${filtro}%`);
    }
    const from = (pagina - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) setError('Error al cargar reportes');
    else {
      setReportes(data || []);
      setTotalPaginas(Math.max(1, Math.ceil((count || 1) / PAGE_SIZE)));
    }
    setLoading(false);
  };

  const handleBuscar = (e) => {
    setFiltro(e.target.value);
    setPagina(1);
  };

  const handleAccion = (tipo, reporte) => {
    if (tipo === 'ver') setDetalle(reporte);
    else setAccion({ tipo, reporte });
  };

  const confirmarAccion = async () => {
    if (!accion) return;
    setLoading(true);
    let res;
    if (accion.tipo === 'resolver') {
      res = await supabase.from('reportes').update({ estado: 'resuelto' }).eq('id', accion.reporte.id);
      setMensaje('Reporte marcado como resuelto');
    } else if (accion.tipo === 'exportar') {
      setMensaje('Reporte exportado (simulado)');
    }
    setAccion(null);
    setLoading(false);
    cargarReportes();
    setTimeout(() => setMensaje(''), 2500);
  };

  const cancelarAccion = () => setAccion(null);
  const cerrarDetalle = () => setDetalle(null);

  return (
    <div style={{ background: '#181818', color: gold, minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Gestión de Reportes</h2>
      <input value={filtro} onChange={handleBuscar} placeholder="Buscar usuario..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: gold }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', background: '#232323', color: gold, borderRadius: 12, marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ padding: 12 }}>Usuario</th>
            <th style={{ padding: 12 }}>Motivo</th>
            <th style={{ padding: 12 }}>Estado</th>
            <th style={{ padding: 12 }}>Fecha</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map(reporte => (
            <tr key={reporte.id}>
              <td style={{ padding: 12 }}>{reporte.usuario}</td>
              <td style={{ padding: 12 }}>{reporte.motivo}</td>
              <td style={{ padding: 12 }}>{reporte.estado}</td>
              <td style={{ padding: 12 }}>{reporte.fecha}</td>
              <td style={{ padding: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => handleAccion('ver', reporte)} style={{ background: gold, color: black, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }}>Ver</button>
                {reporte.estado !== 'resuelto' && (
                  <button onClick={() => handleAccion('resolver', reporte)} style={{ background: '#27ae60', color: gold, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }}>Resolver</button>
                )}
                <button onClick={() => handleAccion('exportar', reporte)} style={{ background: '#2980b9', color: gold, borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }}>Exportar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {detalle && (
        <div style={{ background: '#333', color: gold, padding: 18, borderRadius: 10, marginBottom: 18 }}>
          <div><b>Detalle del reporte</b></div>
          <div style={{ marginTop: 8 }}>Usuario: {detalle.usuario}</div>
          <div>Motivo: {detalle.motivo}</div>
          <div>Descripción: {detalle.descripcion}</div>
          <div>Estado: {detalle.estado}</div>
          <div>Fecha: {detalle.fecha}</div>
          <button onClick={cerrarDetalle} style={{ marginTop: 12, background: gold, color: black, borderRadius: 6, padding: '6px 18px', fontWeight: 'bold' }}>Cerrar</button>
        </div>
      )}
      {accion && (
        <div style={{ background: '#333', color: gold, padding: 18, borderRadius: 10, marginBottom: 18 }}>
          <div>¿Seguro que deseas <b>{accion.tipo === 'resolver' ? 'marcar como resuelto' : 'exportar'}</b> el reporte de <b>{accion.reporte.usuario}</b>?</div>
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
