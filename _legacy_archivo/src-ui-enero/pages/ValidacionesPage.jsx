import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

function ValidacionShareButton({ id }) {
  const [feedback, setFeedback] = React.useState('');
  const url = window.location.origin + '/validaciones/' + id;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Validación FutPro', url });
        setFeedback('¡Compartido!');
        setTimeout(() => setFeedback(''), 1500);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback('¡Copiado!');
        setTimeout(() => setFeedback(''), 1500);
      } catch {}
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button onClick={handleShare} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>Compartir</button>
      <input value={url} readOnly style={{ width: 120, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }} onFocus={e => e.target.select()} />
      {feedback && <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{feedback}</span>}
    </div>
  );
}

export default function ValidacionesPage() {
  const { user, role } = useContext(AuthContext);
  const [validaciones, setValidaciones] = useState([
    { id: 1, usuario: 'Juan Pérez', estado: 'Pendiente', fecha: '2025-09-10' },
    { id: 2, usuario: 'Ana Gómez', estado: 'Pendiente', fecha: '2025-09-10' },
    { id: 3, usuario: 'Carlos Ruiz', estado: 'Pendiente', fecha: '2025-09-10' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Aquí iría la lógica para cargar validaciones reales si se conecta a una API

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Validaciones</h2>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = '/validaciones'}>Actualizar</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Validaciones</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: black, color: gold }}>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Usuario</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Estado</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Fecha</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Compartir</th>
              </tr>
            </thead>
            <tbody>
              {validaciones.map(v => (
                <tr key={v.id} style={{ background: v.id % 2 === 0 ? '#333' : black }}>
                  <td style={{ padding: 10 }}>{v.usuario}</td>
                  <td style={{ padding: 10 }}>{v.estado}</td>
                  <td style={{ padding: 10 }}>{v.fecha}</td>
                  <td style={{ padding: 10 }}><ValidacionShareButton id={v.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = '/actividad'}>Ver actividad</Button>
      </aside>
    </div>
  );
}