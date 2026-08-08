import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function AdminEstadisticasPage() {
  const [stats, setStats] = useState({ usuarios: 0, pagos: 0, pagosPendientes: 0, reportes: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarStats();
    // eslint-disable-next-line
  }, []);

  const cargarStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ count: usuarios }, { count: pagos }, { count: pagosPendientes }, { count: reportes }] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }),
        supabase.from('pagos').select('*', { count: 'exact', head: true }),
        supabase.from('pagos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
        supabase.from('reportes').select('*', { count: 'exact', head: true })
      ]);
      setStats({
        usuarios: usuarios || 0,
        pagos: pagos || 0,
        pagosPendientes: pagosPendientes || 0,
        reportes: reportes || 0
      });
    } catch (e) {
      setError('Error al cargar estadísticas');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: gold, minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Estadísticas y Métricas</h2>
      {loading && <div style={{ color: gold }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 220 }}>
          <div style={{ fontSize: 22, fontWeight: 'bold' }}>Usuarios</div>
          <div style={{ fontSize: 38 }}>{stats.usuarios}</div>
        </div>
        <div style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 220 }}>
          <div style={{ fontSize: 22, fontWeight: 'bold' }}>Pagos totales</div>
          <div style={{ fontSize: 38 }}>{stats.pagos}</div>
        </div>
        <div style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 220 }}>
          <div style={{ fontSize: 22, fontWeight: 'bold' }}>Pagos pendientes</div>
          <div style={{ fontSize: 38 }}>{stats.pagosPendientes}</div>
        </div>
        <div style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 220 }}>
          <div style={{ fontSize: 22, fontWeight: 'bold' }}>Reportes</div>
          <div style={{ fontSize: 38 }}>{stats.reportes}</div>
        </div>
      </div>
      {/* Aquí se pueden agregar visualizaciones con chart.js o similar */}
    </div>
  );
}
