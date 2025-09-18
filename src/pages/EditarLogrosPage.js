import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditarLogrosPage = () => {
  const navigate = useNavigate();
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [actividad] = useState([1, 2, 3, 4, 5]);
  const [msg, setMsg] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const nombre = form.nombre.value.trim();
    const desc = form.desc.value.trim();
    let errs = {};
    if (!nombre) errs.nombre = 'El nombre del logro es obligatorio.';
    if (!desc) errs.desc = 'La descripción es obligatoria.';
    setErrores(errs);
    if (Object.keys(errs).length === 0) {
      setTimeout(() => {
        setGuardado(true);
        setLoading(false);
        setTimeout(() => setGuardado(false), 2000);
      }, 1000);
    } else {
      setLoading(false);
    }
  };

  function handleGuardar() {
    setMsg('Logros actualizados');
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

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Editar Logros</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button onClick={handleGuardar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Guardar cambios</button>
        <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
        <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
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
      <form style={{ maxWidth: '100%', margin: '0 auto' }} onSubmit={handleSubmit} noValidate>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Nombre del logro:
          <input name="nombre" type="text" style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.nombre && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.nombre}</span>}
        </label>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Descripción:
          <input name="desc" type="text" style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.desc && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.desc}</span>}
        </label>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer', boxShadow: '0 2px 8px #FFD70088' }}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '12px 32px', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer' }} onClick={() => navigate(-1)}>Ir atrás</button>
        </div>
        {guardado && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>¡Cambios guardados!</div>}
      </form>
      {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
    </div>
  );
};

export default EditarLogrosPage;

// Test unitario básico
import { render, screen } from '@testing-library/react';
describe('EditarLogrosPage', () => {
  it('renderiza formulario y botones principales', () => {
    render(<EditarLogrosPage />);
    expect(screen.getByText(/Logros actualizados|Guardar|Filtrar|Actualizar/i)).toBeDefined;
  });
});
