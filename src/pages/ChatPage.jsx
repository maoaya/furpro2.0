// ...existing code...
import React, { useState } from 'react';

export default function ChatPage() {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [copiado, setCopiado] = useState(false);

  const urlChat = `${window.location.origin}/chat`;
  const handleCompartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat FutPro',
          text: 'Únete a la conversación en FutPro',
          url: urlChat,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(urlChat);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  function handleEnviar() {
    if (input.trim()) {
      setMensajes(prev => [...prev, input]);
      setInput('');
    }
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Chat</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button onClick={handleEnviar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Enviar</button>
        <button onClick={handleCompartir} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Compartir chat</button>
        {copiado && <span style={{ color: '#FFD700', fontSize: 14 }}>¡Enlace copiado!</span>}
      </div>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32, minHeight: 200 }}>
        {mensajes.length === 0 && <div style={{ color: '#FFD70099' }}>No hay mensajes aún.</div>}
        {mensajes.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>{msg}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} style={{ marginTop: 16, padding: 8, borderRadius: 8, border: '1px solid #FFD700', width: '80%' }} />
      <button onClick={handleEnviar} style={{ marginLeft: 8, background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold' }}>Enviar</button>
      <div style={{ fontSize: 13, color: '#FFD70099', marginTop: 18 }}>URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlChat}</span></div>
    </div>
  );
}
// ...existing code...
