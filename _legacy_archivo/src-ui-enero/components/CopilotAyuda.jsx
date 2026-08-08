import React, { useState } from 'react';

export default function CopilotAyuda() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  // Simulación de IA local/demo
  const handlePreguntar = async (e) => {
    e.preventDefault();
    setCargando(true);
    setRespuesta('');
    // Aquí podrías integrar una API real de IA (OpenAI, Copilot, etc)
    setTimeout(() => {
      setRespuesta('Esta es una respuesta automática de Copilot Ayuda. Pronto podrás consultar cualquier duda sobre el uso de FutPro aquí.');
      setCargando(false);
    }, 1200);
  };

  return (
    <div style={{ background: '#232323', color: '#FFD700', borderRadius: 16, padding: 32, maxWidth: 500, margin: '32px auto' }}>
      <h2>🤖 Copilot Ayuda</h2>
      <form onSubmit={handlePreguntar} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          placeholder="¿En qué te puedo ayudar?"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #FFD700' }}
        />
        <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }} disabled={cargando}>
          {cargando ? 'Consultando...' : 'Preguntar'}
        </button>
      </form>
      {respuesta && <div style={{ background: '#181818', color: '#FFD700', borderRadius: 8, padding: 16 }}>{respuesta}</div>}
    </div>
  );
}
