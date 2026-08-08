import React, { useState } from 'react';

export default function ModalRegistroAvanzado({ onClose }) {
  const [datos, setDatos] = useState('');
  const [msg, setMsg] = useState('');

  const handleGuardar = () => setMsg('Guardando registro...');
  const handleValidar = () => setMsg('Validando registro...');
  const handleCerrar = () => onClose && onClose();

  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #FFD70044', maxWidth: 500, margin: 'auto' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 24 }}>Registro Avanzado</h2>
      <textarea value={datos} onChange={e => setDatos(e.target.value)} placeholder="Datos avanzados..." style={{ width: '100%', minHeight: 60, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', padding: 8, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={handleGuardar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Guardar</button>
        <button onClick={handleValidar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Validar</button>
        <button onClick={handleCerrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Cerrar</button>
      </div>
      {msg && <div style={{ background: '#232323', color: '#FFD700', padding: 12, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{msg}</div>}
    </div>
  );
}