
import React from 'react';
import supabase from '../supabaseClient';

export default function AdminPanelPageJS() {
  const [msg, setMsg] = React.useState('');

  const [usuarios, setUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    supabase
      .from('users')
      .select('*')
      .order('rol', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setUsuarios(data || []);
        setLoading(false);
      });
  }, []);

  const cambiarRol = async (id, nuevoRol) => {
    await supabase.from('users').update({ rol: nuevoRol }).eq('id', id);
    setUsuarios(u => u.map(user => user.id === id ? { ...user, rol: nuevoRol } : user));
  };

  if (loading) return <div className="loader" />;
  if (error) return <div className="msg-anim error">Error: {error}</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700',animation:'fadeInUp 0.5s',animationFillMode:'both'}}>Panel de Administración</h1>
      {msg && <div className="msg-anim success" style={{marginBottom:16}}>{msg}</div>}
      {usuarios.map((user, idx) => (
        <div key={user.id} style={{background:'#222',borderRadius:12,padding:16,marginBottom:24,boxShadow:'0 2px 8px #FFD70022',animation:'fadeInUp 0.5s',animationDelay:`${idx*0.07}s`,animationFillMode:'both'}}>
          <div style={{fontWeight:'bold',fontSize:18}}>{user.username}</div>
          <div style={{margin:'12px 0',color:'#FFD70099'}}>Rol: {user.rol}</div>
          <button onClick={()=>{cambiarRol(user.id, user.rol==='admin'?'user':'admin'); setMsg('Rol actualizado'); setTimeout(()=>setMsg(''),1500);}} style={{color:'#232323',background:'#FFD700',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold'}}>Cambiar rol</button>
        </div>
      ))}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
