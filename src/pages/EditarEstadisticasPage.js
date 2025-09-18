import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditarEstadisticasPage = () => {
  const navigate = useNavigate();
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [actividad] = useState([2, 4, 6, 8, 10]);
  const [msg, setMsg] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const metrica = form.metrica.value.trim();
    const valor = form.valor.value.trim();
    let errs = {};
    if (!metrica) errs.metrica = 'La métrica es obligatoria.';
    if (!valor || isNaN(valor)) errs.valor = 'El valor debe ser un número.';
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
    setMsg('Estadísticas actualizadas');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando estadísticas...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Editar Estadísticas</h2>
      <form style={{ maxWidth: '100%', margin: '0 auto' }} onSubmit={handleSubmit} noValidate>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Métrica:
          <input name="metrica" type="text" style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.metrica && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.metrica}</span>}
        </label>
        <label style={{ display: 'block', marginBottom: 18, fontWeight: 'bold', fontSize: 18 }}>
          Valor:
          <input name="valor" type="number" style={{ width: '100%', padding: 12, borderRadius: 8, marginTop: 6, fontSize: 18, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
          {errores.valor && <span style={{ color: '#FF4D4F', fontSize: 15 }}>{errores.valor}</span>}
        </label>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer', boxShadow: '0 2px 8px #FFD70088' }}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '8px', padding: '12px 32px', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer' }} onClick={() => navigate(-1)}>Ir atrás</button>
        </div>
        {guardado && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>¡Cambios guardados!</div>}
      </form>
      <div style={{ display: 'flex', gap: 16, marginTop: 32, marginBottom: 32 }}>
        <button onClick={handleGuardar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Guardar cambios</button>
        <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
        <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de estadísticas</h3>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          {actividad.map((val, i) => (
            <rect key={i} x={i * 70 + 20} y={120 - val * 10} width={40} height={val * 10} fill="#FFD700" rx={8} />
          ))}
          <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
          <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
        </svg>
      </div>
      {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
    </div>
  );
};

export default EditarEstadisticasPage;

// Test unitario básico
import { render, screen } from '@testing-library/react';
describe('EditarEstadisticasPage', () => {
  it('renderiza formulario y botones principales', () => {
    render(<EditarEstadisticasPage />);
    expect(screen.getByText(/Estadísticas actualizadas|Guardar|Filtrar|Actualizar/i)).toBeDefined;
  });
});
