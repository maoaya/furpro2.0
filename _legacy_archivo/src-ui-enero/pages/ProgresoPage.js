import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

const ProgresoPage = () => {
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('progreso')
      .select('*')
      .eq('user_id', 1) // Cambia por el userId real si tienes contexto
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProgreso(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader" />;
  if (error) return <div style={{color:'#FF3333'}}>Error: {error}</div>;
  if (!progreso) return <div style={{color:'#FFD700'}}>No hay datos de progreso</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700'}}>Progreso</h1>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>Nivel: <b>{progreso.nivel}</b></div>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>Puntos: <b>{progreso.puntos}</b></div>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>Logros: <b>{progreso.logros?.join(', ')}</b></div>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>Estadísticas:</div>
      <ul style={{color:'#FFD700'}}>
        {progreso.estadisticas && Object.entries(progreso.estadisticas).map(([k,v], idx) => (
          <li key={k} style={{animation:'fadeInUp 0.5s',animationDelay:`${idx*0.07}s`,animationFillMode:'both',marginBottom:'8px',padding:'8px 0',borderBottom:'1px solid #FFD70022',transition:'background 0.2s'}}>{k}: {v}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProgresoPage;
