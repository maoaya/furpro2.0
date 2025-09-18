import React, { useEffect, useState } from 'react';
import { dbOperations } from '../config/supabase';

export default function RankingPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    dbOperations.getTeamsByUser(/* userId dinámico */).then(res => setTeams(res));
  }, []);

  return (
    <div style={{padding:32, background:'#f4f6fa', minHeight:'100vh'}}>
      <h1 style={{color:'#FFD700', fontWeight:'bold', fontSize:32}}>Ranking de Equipos</h1>
      <div style={{display:'flex', gap:32, marginTop:32, flexWrap:'wrap'}}>
        {teams.map(team => (
          <div key={team.id} style={{background:'#222', color:'#FFD700', borderRadius:16, padding:24, minWidth:260, boxShadow:'0 2px 12px #FFD70044'}}>
            <h2 style={{fontSize:22}}>{team.name}</h2>
            <div>Capitán: {team.captain_id}</div>
            <div>Jugadores: {team.players?.length || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
