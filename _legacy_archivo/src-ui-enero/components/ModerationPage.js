import React, { useEffect, useState } from 'react';
import { dbOperations } from '../config/supabase';

export default function ModerationPage() {
  const [judges, setJudges] = useState([]);

  useEffect(() => {
    dbOperations.searchUsers('', { userType: 'judge' }).then(res => setJudges(res));
  }, []);

  return (
    <div style={{padding:32, background:'#f4f6fa', minHeight:'100vh'}}>
      <h1 style={{color:'#FFD700', fontWeight:'bold', fontSize:32}}>Panel de Jueces</h1>
      <div style={{display:'flex', gap:32, marginTop:32, flexWrap:'wrap'}}>
        {judges.map(j => (
          <div key={j.id} style={{background:'#222', color:'#FFD700', borderRadius:16, padding:24, minWidth:260, boxShadow:'0 2px 12px #FFD70044'}}>
            <h2 style={{fontSize:22}}>{j.name}</h2>
            <div>Email: {j.email}</div>
            <div>Tipo: {j.user_type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
