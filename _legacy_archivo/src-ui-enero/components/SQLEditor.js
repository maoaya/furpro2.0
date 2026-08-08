import React, { useState } from 'react';
import { supabase } from '../config/supabase';

export default function SQLEditor() {
  const [query, setQuery] = useState('SELECT * FROM usuarios');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      // Ejecuta la consulta SQL usando Supabase
      const { data, error } = await supabase.rpc('run_sql', { sql: query });
      if (error) setError(error.message);
      else setResult(data);
    } catch (err) {
      setError('Error al ejecutar la consulta');
    }
    setLoading(false);
  };

  return (
    <div style={{padding:24}}>
      <h2>Editor SQL FutPro</h2>
      <textarea value={query} onChange={e=>setQuery(e.target.value)} rows={6} style={{width:'100%',fontSize:16}} />
      <button onClick={handleRun} disabled={loading} style={{marginTop:12}}>Ejecutar</button>
      {error && <div style={{color:'red',marginTop:12}}>{error}</div>}
      {result && <pre style={{background:'#222',color:'#FFD700',padding:12,marginTop:12}}>{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}
