import React, { useState } from 'react';
import FutproLogo from '../components/FutproLogo';

export default function CrearLogoPage() {
  const [texto, setTexto] = useState('');
  const [color, setColor] = useState('#FFD700');
  const [logo, setLogo] = useState(null);
  const [shareFeedback, setShareFeedback] = useState('');

  const handleGenerar = e => {
    e.preventDefault();
    setLogo({ texto, color });
  };

  const handleShare = async () => {
    const url = window.location.origin + '/logo-generado';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Logo FutPro', url });
        setShareFeedback('¡Compartido!');
      } else {
        await navigator.clipboard.writeText(url);
        setShareFeedback('¡Copiado!');
      }
      setTimeout(() => setShareFeedback(''), 1500);
    } catch (e) {}
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2>Crear Logo con Copilot</h2>
      <form onSubmit={handleGenerar} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Texto o iniciales" style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700' }} />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 40, height: 40, border: 'none' }} />
        <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Generar Logo</button>
      </form>
      {logo && (
        <div style={{ marginTop: 24 }}>
          <svg width={96} height={96} viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill={logo.color} stroke="#232323" strokeWidth="4" />
            <text x="32" y="40" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#232323" fontFamily="Arial, sans-serif">{logo.texto}</text>
          </svg>
          <div style={{ marginTop: 8, color: logo.color, fontWeight: 'bold' }}>Logo generado</div>
          {/* Compartir logo */}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handleShare} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>Compartir logo</button>
            <input value={window.location.origin + '/logo-generado'} readOnly style={{ width: 140, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }} onFocus={e => e.target.select()} />
            {shareFeedback && <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{shareFeedback}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...
