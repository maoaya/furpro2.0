// ...existing code...
import React, { useState } from 'react';
import Button from '../components/Button';

const gold = '#FFD700';
const black = '#222';

export default function StreamingPage() {
  const [streaming, setStreaming] = useState([
    { id: 1, nombre: 'Final Torneo', estado: 'En vivo' },
    { id: 2, nombre: 'Semifinal', estado: 'Finalizado' },
  ]);
  const [shareFeedback, setShareFeedback] = useState({});

  const handleShare = async (id) => {
    const url = window.location.origin + '/streaming/' + id;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Streaming FutPro', url });
        setShareFeedback(prev => ({ ...prev, [id]: '¡Compartido!' }));
        setTimeout(() => setShareFeedback(prev => ({ ...prev, [id]: '' })), 1500);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback(prev => ({ ...prev, [id]: '¡Copiado!' }));
        setTimeout(() => setShareFeedback(prev => ({ ...prev, [id]: '' })), 1500);
      } catch {}
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Streaming</h2>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Iniciar streaming</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Streaming</h1>
          <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
            <h1>Streaming</h1>
            <div style={{ maxWidth: 800, margin: 'auto', background: '#232323', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #FFD70044' }}>
              <h2 style={{ fontSize: 22, marginBottom: 16 }}>Ver transmisión</h2>
              <video id="videoPlayer" controls autoPlay style={{ width: '100%', borderRadius: 12, background: '#000' }}>
                <source src="http://localhost:8000/live/stream/index.m3u8" type="application/x-mpegURL" />
                Tu navegador no soporta video en vivo HLS.
              </video>
              <div style={{ marginTop: 24, color: '#FFD700', fontSize: 15 }}>
                <b>¿Quieres transmitir desde OBS Studio?</b><br />
                <ul>
                  <li>URL del servidor: <code>rtmp://localhost/live</code></li>
                  <li>Clave de transmisión: <code>stream</code></li>
                </ul>
                <span>Abre OBS Studio, ve a Ajustes &gt; Stream y usa los datos anteriores.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', transition: 'background 0.3s, color 0.3s' }}>Ver reportes</Button>
      </aside>
    </div>
  );
}
// ...existing code...

// Compartir streaming
// Estado para feedback de compartir
// (Debe ir dentro del componente)

// ...existing code...
