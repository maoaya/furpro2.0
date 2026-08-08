import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LogrosPage() {
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actividad] = useState([1, 5, 3, 2, 4]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    supabase
      .from('logros')
      .select('*')
      .order('fecha', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setLogros(data || []);
        setLoading(false);
      });
  }, []);

  function handleConsultar() {
    setMsg('Consultando logros...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando logros...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }

  if (loading) return <div className="loader" />;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Logros</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button onClick={handleConsultar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Consultar</button>
        <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
        <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de logros</h3>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          {actividad.map((val, i) => (
            <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill="#FFD700" rx={8} />
          ))}
          <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
          <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
        </svg>
      </div>
      <h1 style={{color:'#FFD700'}}>Logros</h1>
      {logros.map((l, idx) => (
        <div key={l.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:16,boxShadow:'0 2px 8px #FFD70022',animation:'fadeInUp 0.5s',animationDelay:`${idx*0.07}s`,animationFillMode:'both'}}>
          <div style={{fontWeight:'bold',fontSize:18}}>{l.titulo}</div>
          <div style={{color:'#FFD70099'}}>{l.descripcion}</div>
          <div style={{margin:'12px 0'}}>Fecha: {l.fecha}</div>
        </div>
      ))}
      {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
