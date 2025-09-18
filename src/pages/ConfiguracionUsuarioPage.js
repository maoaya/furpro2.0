import React, { useEffect, useState } from 'react';
import ConfiguracionPanel from '../components/ConfiguracionPanel';
import supabase from '../supabaseClient';

export default function ConfiguracionUsuarioPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    setLoading(true);
    supabase
      .from('configuracion_usuario')
      .select('*')
      .eq('user_id', 1) // Cambia por el userId real si tienes contexto
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else {
          setConfig(data);
          setForm(data || {});
        }
        setLoading(false);
      });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('configuracion_usuario')
      .update(form)
      .eq('user_id', 1); // Cambia por el userId real si tienes contexto
    if (error) setError(error.message);
    else setConfig(form);
    setEdit(false);
    setLoading(false);
  };

  if (loading) return <div className="loader" />;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  if (!config) return <div style={{color:'#FFD700'}}>No hay configuración</div>;

  return (
    <div>
      <h1 style={{color:'#FFD700',animation:'fadeInUp 0.5s',animationFillMode:'both'}}>Configuración de Usuario</h1>
      <div style={{animation:'fadeInUp 0.5s',animationDelay:'0.1s',animationFillMode:'both'}}>
        <ConfiguracionPanel usuario={config} />
      </div>
      {edit ? (
        <div style={{animation:'fadeInUp 0.5s',animationDelay:'0.2s',animationFillMode:'both'}}>
          <input name="email" value={form.email||''} onChange={handleChange} placeholder="Email" style={{marginBottom:12,padding:8,borderRadius:8,border:'2px solid #FFD700',width:'100%',fontSize:16}} />
          <input name="nombre" value={form.nombre||''} onChange={handleChange} placeholder="Nombre" style={{marginBottom:12,padding:8,borderRadius:8,border:'2px solid #FFD700',width:'100%',fontSize:16}} />
          <button onClick={handleSave} style={{color:'#232323',background:'#FFD700',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold'}}>Guardar</button>
        </div>
      ) : (
        <div style={{animation:'fadeInUp 0.5s',animationDelay:'0.3s',animationFillMode:'both'}}>
          <div style={{margin:'12px 0'}}>Email: <b>{config.email}</b></div>
          <div style={{margin:'12px 0'}}>Nombre: <b>{config.nombre}</b></div>
          <button onClick={()=>setEdit(true)} style={{color:'#232323',background:'#FFD700',border:'none',borderRadius:8,padding:'8px 24px',fontWeight:'bold'}}>Editar</button>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
