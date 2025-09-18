import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function IntegracionTestPage() {
  const { user, role } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    supabase.from('integracion_tests').select('*').then(({ data, error }) => {
      if (error) setError(error.message);
      else setTests(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Tests de Integración</h2>
        <Button onClick={() => window.location.href = '/integracion-test'}>Actualizar</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Tests de Integración</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: black, color: gold }}>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Test</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Estado</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id} style={{ background: t.id % 2 === 0 ? '#333' : black }}>
                  <td style={{ padding: 10 }}>{t.nombre}</td>
                  <td style={{ padding: 10 }}>{t.estado}</td>
                  <td style={{ padding: 10 }}>{t.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button onClick={() => window.location.href = '/validaciones'}>Ver validaciones</Button>
      </aside>
    </div>
  );
}