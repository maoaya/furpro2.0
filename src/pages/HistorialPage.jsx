import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function HistorialPage() {
  const { user, role } = useContext(AuthContext);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    supabase.from('historial').select('*').then(({ data, error }) => {
      if (error) setError(error.message);
      else setHistorial(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Historial</h2>
        <Button onClick={() => window.location.href = '/historial'}>Actualizar</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Historial</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: black, color: gold }}>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Acción</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map(h => (
                <tr key={h.id} style={{ background: h.id % 2 === 0 ? '#333' : black }}>
                  <td style={{ padding: 10 }}>{h.accion}</td>
                  <td style={{ padding: 10 }}>{h.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button onClick={() => window.location.href = '/reportes'}>Ver reportes</Button>
      </aside>
    </div>
  );
}