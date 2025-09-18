import React, { useState } from 'react';

const preguntas = [
  { id: 1, pregunta: '¿Cómo registro mi equipo?', respuesta: 'Desde el panel de equipos puedes registrar uno nuevo.' },
  { id: 2, pregunta: '¿Cómo contacto soporte?', respuesta: 'Usa el formulario de contacto en la sección de soporte.' },
];

function AyudaFAQPage() {
  const [busqueda, setBusqueda] = useState('');
  const [preguntasFiltradas, setPreguntasFiltradas] = useState(preguntas);
  const [actividad] = useState([1, 4, 2, 5, 3]);
  const [msg, setMsg] = useState('');

  const filtrar = (e) => {
    const val = e.target.value;
    setBusqueda(val);
    setPreguntasFiltradas(
      preguntas.filter(p => p.pregunta.toLowerCase().includes(val.toLowerCase()))
    );
  };
  const contactar = () => window.alert('Redirigiendo a soporte...');
  function handleConsultar() {
    setMsg('Consultando preguntas frecuentes...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleFiltrar() {
    setMsg('Filtrando preguntas...');
    setTimeout(() => setMsg(''), 2000);
  }
  function handleVolver() {
    setMsg('Volviendo...');
    setTimeout(() => setMsg(''), 2000);
  }


  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Ayuda / FAQ</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Buscar pregunta..."
          value={busqueda}
          onChange={filtrar}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button onClick={handleConsultar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Consultar</button>
        <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
        <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
      </div>
      <ul>
        {preguntasFiltradas.map(p => (
          <li key={p.id} style={{marginBottom:12}}>
            <b>{p.pregunta}</b><br />
            <span>{p.respuesta}</span>
          </li>
        ))}
      </ul>
      <button onClick={contactar} style={{ marginTop: 24, background: '#FFD700', color: '#232323', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', boxShadow: '0 2px 8px #FFD70088' }}>Contactar soporte</button>
      <div style={{ background: '#232323', borderRadius: 12, padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Actividad</h3>
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

export default AyudaFAQPage;

