import React, { useState, useEffect } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function ModeracionPage({ usuario, rol }) {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function fetchReportes() {
      setCargando(true);
      try {
        const res = await fetch('/api/moderation/reports', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.reports) setReportes(data.reports);
      } catch {}
      setCargando(false);
    }
    fetchReportes();
  }, []);

  async function handleBloquear(id) {
    setMensaje('');
    try {
      const res = await fetch(`/api/moderation/content/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setReportes(reportes.filter(r => r.id !== id));
        setMensaje('Contenido bloqueado');
      }
    } catch { setMensaje('Error al bloquear'); }
  }

  if (rol !== 'admin' && rol !== 'moderador') {
    return <div style={{ color: gold, background: black, padding: 32 }}>Acceso restringido</div>;
  }

  return (
    <div style={{ background: black, minHeight: '100vh', color: gold, padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Panel de Moderación</h1>
      {cargando ? <div>Cargando reportes...</div> : (
        <>
          {reportes.length === 0 ? <div>No hay reportes pendientes.</div> : (
            <table style={{ width: '100%', background: '#232323', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: gold, color: black }}>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th>Reportado por</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #FFD70022' }}>
                    <td>{r.id}</td>
                    <td>{r.tipo || 'contenido'}</td>
                    <td>{r.motivo}</td>
                    <td>{r.reportadoPor}</td>
                    <td>
                      <button style={{ background: '#c00', color: gold, border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleBloquear(r.id)}>Bloquear</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {mensaje && <div style={{ background: gold, color: black, borderRadius: 8, padding: 12, marginTop: 16, fontWeight: 'bold' }}>{mensaje}</div>}
    </div>
  );
}
