import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const EquipoDetallePage = () => {
  const { id } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('equipos').select('*').eq('id', id).single(),
      supabase.from('users').select('*').eq('equipo_id', id)
    ]).then(([eqRes, jugRes]) => {
      if (eqRes.error) setError(eqRes.error.message);
      else setEquipo(eqRes.data);
      if (jugRes.error) setError(jugRes.error.message);
      else setJugadores(jugRes.data || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="loader" />;
  if (error) return <div className="msg-anim error">Error: {error}</div>;
  if (!equipo) return <div style={{color:'#FFD700'}}>Equipo no encontrado</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700'}}>{equipo.nombre}</h1>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>Estadísticas: {equipo.estadisticas}</div>
      <h2 style={{color:'#FFD700'}}>Jugadores</h2>
      {jugadores.map(j => (
        <div key={j.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:16,boxShadow:'0 2px 8px #FFD70022'}}>
          <div style={{fontWeight:'bold',fontSize:18}}>{j.username}</div>
          <div style={{color:'#FFD70099'}}>{j.bio}</div>
        </div>
      ))}
    </div>
  );
};

export default EquipoDetallePage;