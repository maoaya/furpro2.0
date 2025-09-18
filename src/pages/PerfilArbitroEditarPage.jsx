import React, { useState } from 'react';

const PerfilArbitroEditarPage = () => {
  const [form, setForm] = useState(() => {
    return JSON.parse(localStorage.getItem('arbitroPerfil') || '{}');
  });
  const [feedback, setFeedback] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    localStorage.setItem('arbitroPerfil', JSON.stringify(form));
    setFeedback('¡Perfil de árbitro guardado!');
  };

  return (
    <div style={{background:'#181818',color:'#FFD700',minHeight:'100vh',padding:'2rem'}}>
      <h2>Editar Perfil de Árbitro</h2>
      <form onSubmit={handleSubmit} style={{maxWidth:400,background:'#232323',borderRadius:12,padding:24}}>
        <label>Nombre:<br/>
          <input name="nombre" value={form.nombre||''} onChange={handleChange} style={{width:'100%',marginBottom:12}} />
        </label><br/>
        <label>Experiencia:<br/>
          <input name="experiencia" value={form.experiencia||''} onChange={handleChange} style={{width:'100%',marginBottom:12}} />
        </label><br/>
        <label>Partidos arbitrados:<br/>
          <input name="partidos" type="number" value={form.partidos||0} onChange={handleChange} style={{width:'100%',marginBottom:12}} />
        </label><br/>
        <label>Certificación:<br/>
          <input name="certificacion" value={form.certificacion||''} onChange={handleChange} style={{width:'100%',marginBottom:12}} />
        </label><br/>
        <label>Disponibilidad:<br/>
          <input name="disponibilidad" value={form.disponibilidad||''} onChange={handleChange} style={{width:'100%',marginBottom:12}} />
        </label><br/>
        <button type="submit" style={{background:'#FFD700',color:'#181818',padding:'1rem',borderRadius:'8px',fontWeight:'bold',fontSize:18}}>Guardar</button>
      </form>
      <div style={{marginTop:'1.5rem',fontWeight:'bold'}}>{feedback}</div>
    </div>
  );
};

export default PerfilArbitroEditarPage;
