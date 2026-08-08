import React, { useState } from 'react';
import { Button } from './Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function AdminPanelPage() {
  const [adminStats, setAdminStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    supabase.rpc('get_admin_stats').then(({ data, error }) => {
      if (error) setError(error.message);
      else setAdminStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel de administración</h2>
        <Button onClick={() => window.location.href = '/usuarios'}>Usuarios</Button>
        <Button onClick={() => window.location.href = '/moderacion'}>Moderación</Button>
        <Button onClick={() => window.location.href = '/pagos'}>Pagos</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Panel de administración</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24 }}>
            <div>
              <h3>Usuarios</h3>
              <div style={{ fontSize: 32 }}>{adminStats.usuarios || '-'}</div>
            </div>
            <div>
              <h3>Moderación</h3>
              <div style={{ fontSize: 32 }}>{adminStats.moderacion || '-'}</div>
            </div>
            <div>
              <h3>Pagos</h3>
              <div style={{ fontSize: 32 }}>{adminStats.pagos || '-'}</div>
            </div>
          </div>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button onClick={() => window.location.href = '/actividad'}>Ver actividad</Button>
        <Button onClick={() => window.location.href = '/reportes'}>Ver reportes</Button>
      </aside>
    </div>
  );
}
