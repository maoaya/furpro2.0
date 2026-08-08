import React from 'react';

export default function ModalVerRegistros({ registros = [], onClose }) {
  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #FFD70044', maxWidth: 500, margin: 'auto' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 24 }}>Registros Guardados</h2>
      <ul style={{ marginBottom: 24 }}>
        {registros.length === 0 ? (
          <li style={{ color: '#FFD700' }}>No hay registros disponibles.</li>
        ) : (
          registros.map((r, i) => (
            <li key={i} style={{ color: '#FFD700' }}>{JSON.stringify(r)}</li>
          ))
        )}
      </ul>
      <button onClick={onClose} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Cerrar</button>
    </div>
  );
}