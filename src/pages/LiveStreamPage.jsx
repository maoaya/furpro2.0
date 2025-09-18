import React, { useRef, useState } from 'react';

export default function LiveStreamPage() {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  const urlLive = `${window.location.origin}/live`;
  const handleCompartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transmisión en Vivo FutPro',
          text: '¡Mira mi transmisión en FutPro!',
          url: urlLive,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(urlLive);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  const startStream = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (e) {
      setError('No se pudo acceder a la cámara/micrófono.');
    }
  };

  const stopStream = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32, textAlign: 'center' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Transmisión en Vivo</h2>
      <video ref={videoRef} autoPlay muted style={{ width: 480, borderRadius: 16, background: '#232323' }} />
      <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center', gap: 16 }}>
        {!streaming ? (
          <button onClick={startStream} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Iniciar transmisión</button>
        ) : (
          <button onClick={stopStream} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Detener transmisión</button>
        )}
        <button onClick={handleCompartir} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Compartir transmisión</button>
        {copiado && <span style={{ color: '#FFD700', fontSize: 14, alignSelf: 'center' }}>¡Enlace copiado!</span>}
      </div>
      <div style={{ fontSize: 13, color: '#FFD70099', marginBottom: 10 }}>URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlLive}</span></div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      <div style={{ marginTop: 32, color: '#FFD70099' }}>
        * Solo tú puedes ver tu transmisión en este demo local. Para transmitir a otros usuarios se requiere backend.
      </div>
    </div>
  );
}
