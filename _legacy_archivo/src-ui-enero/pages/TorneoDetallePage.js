import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';


export default function TorneoDetallePage() {
  const { id } = useParams();
  const [torneo, setTorneo] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('torneos').select('*').eq('id', id).single(),
      supabase.from('equipos').select('*').eq('torneo_id', id),
      supabase.from('partidos').select('*').eq('torneo_id', id)
    ]).then(([torRes, eqRes, partRes]) => {
      if (torRes.error) setError(torRes.error.message);
      else setTorneo(torRes.data);
      if (eqRes.error) setError(eqRes.error.message);
      else setEquipos(eqRes.data || []);
      if (partRes.error) setError(partRes.error.message);
      else setPartidos(partRes.data || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="loader" />;
  if (error) return <div className="msg-anim error">Error: {error}</div>;
  if (!torneo) return <div style={{color:'#FFD700'}}>Torneo no encontrado</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700'}}>{torneo.nombre}</h1>
      <div style={{margin:'12px 0',color:'#FFD70099'}}>Descripción: {torneo.descripcion}</div>
      <h2 style={{color:'#FFD700'}}>Equipos</h2>
      {equipos.map(eq => (
        <div key={eq.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:16,boxShadow:'0 2px 8px #FFD70022'}}>
          <div style={{fontWeight:'bold',fontSize:18}}>{eq.nombre}</div>
        </div>
      ))}
      <h2 style={{color:'#FFD700'}}>Partidos</h2>
      {partidos.map(p => (
        <div key={p.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:16,boxShadow:'0 2px 8px #FFD70022'}}>
          <div style={{fontWeight:'bold',fontSize:18}}>{p.equipo1} vs {p.equipo2}</div>
          <div style={{color:'#FFD70099'}}>Resultado: {p.resultado}</div>
        </div>
      ))}
    </div>
  );
}
