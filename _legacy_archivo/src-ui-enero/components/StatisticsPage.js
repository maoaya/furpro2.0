import React, { useEffect, useState } from 'react';
import { dbOperations } from '../config/supabase';

export default function StatisticsPage() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    dbOperations.getTournaments().then(res => setTournaments(res));
  }, []);

  return (
    <div style={{padding:32, background:'#f4f6fa', minHeight:'100vh'}}>
      <h1 style={{color:'#FFD700', fontWeight:'bold', fontSize:32}}>Estadísticas de Torneos</h1>
      <div style={{display:'flex', gap:32, marginTop:32, flexWrap:'wrap'}}>
        {tournaments.map(t => (
          <div key={t.id} style={{background:'#222', color:'#FFD700', borderRadius:16, padding:24, minWidth:260, boxShadow:'0 2px 12px #FFD70044'}}>
            <h2 style={{fontSize:22}}>{t.name}</h2>
            <div>Organizador: {t.organizer?.name}</div>
            <div>Tipo: {t.tournament_type}</div>
            <div>Estado: {t.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
