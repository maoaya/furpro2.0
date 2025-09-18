import React, { useState } from 'react';
import Button from './Button';

export default function EquipoEditar() {
  const [form, setForm] = useState({ nombre: '', categoria: '', miembros: 0 });
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState({});
  const [actividad, setActividad] = useState([4, 2, 5, 1, 3]);
  const [msg, setMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errs = {};
    if (!form.nombre) errs.nombre = 'El nombre es obligatorio.';
    if (!form.categoria) errs.categoria = 'La categoría es obligatoria.';
    if (!form.miembros || isNaN(form.miembros) || form.miembros < 1) errs.miembros = 'Debe haber al menos 1 miembro.';
    setErrores(errs);
    if (Object.keys(errs).length === 0) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    }
  }

  function handleGuardar() {
    setMsg('Equipo guardado');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando datos de equipo...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Editar Equipo</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Nombre:
          <input name="nombre" type="text" value={form.nombre} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.nombre && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.nombre}</span>}
        </label>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Categoría:
          <input name="categoria" type="text" value={form.categoria} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.categoria && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.categoria}</span>}
        </label>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Miembros:
          <input name="miembros" type="number" value={form.miembros} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.miembros && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.miembros}</span>}
        </label>
  <Button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 16, transition: 'background 0.3s, color 0.3s' }}>Guardar</Button>
        {guardado && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>¡Cambios guardados!</div>}
      </form>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
  <Button onClick={handleGuardar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Guardar</Button>
  <Button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Filtrar</Button>
  <Button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Volver</Button>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de edición</h3>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          {actividad.map((val, i) => (
            <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill="#FFD700" rx={8} />
          ))}
          <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
          <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
        </svg>
      </div>
      {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
    </div>
  );
}
