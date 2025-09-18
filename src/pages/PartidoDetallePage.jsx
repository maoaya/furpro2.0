import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function PartidoDetallePage() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    if (navigator?.clipboard && url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div style={{ color: gold, background: black, minHeight: '100vh', padding: 32 }}>
      <h1 style={{ color: gold, marginBottom: 24 }}>Detalle de partido</h1>
      {/* ...aquí iría el contenido real del partido... */}
      <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={handleCopy}
          style={{ background: gold, color: black, border: 'none', borderRadius: 12, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}
        >
          Compartir
        </button>
        <span style={{ background: '#222', color: gold, borderRadius: 8, padding: '6px 16px', fontSize: 16 }}>{url}</span>
        {copied && <span style={{ color: gold, marginLeft: 12 }}>¡Copiado!</span>}
      </div>
    </div>
  );
}
