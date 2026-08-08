import React, { useState } from 'react';
export default function UsuarioEditarPage() {
  const [feedback, setFeedback] = useState('');
  const url = window.location.origin + window.location.pathname;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Editar usuario FutPro', url });
        setFeedback('¡Compartido!');
        setTimeout(() => setFeedback(''), 1500);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback('¡Copiado!');
        setTimeout(() => setFeedback(''), 1500);
      } catch {}
    }
  };
  return (
    <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>
      Editar usuario (placeholder)
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={handleShare} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>Compartir</button>
        <input value={url} readOnly style={{ width: 140, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }} onFocus={e => e.target.select()} />
        {feedback && <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{feedback}</span>}
      </div>
    </div>
  );
}
