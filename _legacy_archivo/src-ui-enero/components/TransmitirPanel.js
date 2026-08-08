import React, { useState } from 'react';

const TransmitirPanel = () => {
  const [url, setUrl] = useState('');
  const [transmitiendo, setTransmitiendo] = useState(false);

  const handleTransmitir = () => {
    if (url) {
      setTransmitiendo(true);
      // Aquí iría la lógica real de transmisión (ejemplo: abrir el url en un iframe, iniciar stream, etc)
    }
  };

  return (
    <div style={{ background: '#222', color: '#FFD700', padding: '1.5rem', borderRadius: '12px', maxWidth: '400px', margin: '2rem auto', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Transmisión en Vivo</h3>
      <input
        type="text"
        placeholder="URL de transmisión (ej: YouTube, Twitch, etc)"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #FFD700', marginBottom: '1rem', fontSize: '1rem' }}
      />
      <button
        style={{
          background: url ? '#FFD700' : '#888',
          color: '#111',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1.5rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: url ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s'
        }}
        disabled={!url}
        onClick={handleTransmitir}
      >
        Transmitir
      </button>
      {transmitiendo && (
        <div style={{ marginTop: '1rem', color: '#FFD700', fontWeight: 'bold' }}>
          ¡Transmisión iniciada! URL: <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'underline' }}>{url}</a>
        </div>
      )}
    </div>
  );
};

export default TransmitirPanel;
