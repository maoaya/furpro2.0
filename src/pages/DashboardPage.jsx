import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button.jsx';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function DashboardPage() {
  const context = useContext(AuthContext);
  const user = context?.user || { nombre: 'Invitado', role: 'guest' };
  const role = context?.role || 'guest';
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    supabase.rpc('get_dashboard_stats').then(({ data, error }) => {
      if (error) setError(error.message);
      else setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Panel principal</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => navigate('/usuarios')}>Usuarios</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => navigate('/torneos')}>Torneos</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => navigate('/equipos')}>Equipos</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Dashboard</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24 }}>
            <div>
              <h3>Usuarios</h3>
              <div style={{ fontSize: 32 }}>{stats.usuarios || '-'}</div>
            </div>
            <div>
              <h3>Torneos</h3>
              <div style={{ fontSize: 32 }}>{stats.torneos || '-'}</div>
            </div>
            <div>
              <h3>Equipos</h3>
              <div style={{ fontSize: 32 }}>{stats.equipos || '-'}</div>
            </div>
          </div>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => navigate('/actividad')}>Ver actividad</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => navigate('/reportes')}>Ver reportes</Button>
      </aside>
    </div>
  );
}