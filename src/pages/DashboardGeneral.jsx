import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

export default function DashboardGeneral() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarKPIs();
  }, []);

  const cargarKPIs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('kpis').select('*');
    if (error) setError(error.message);
    else setKpis(data);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Panel General</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando KPIs...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 24 }}>
        {kpis.map(kpi => (
          <div key={kpi.id} style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 220 }}>
            <h3>{kpi.titulo}</h3>
            <div>{kpi.valor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
