import React, { useRef, useState } from 'react';
import liveStreamService from '../../services/liveStreamService';

const LiveStreamComponent = () => {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [message, setMessage] = useState('');

  const startStream = async () => {
    try {
      await liveStreamService.startStream(videoRef);
      setStreaming(true);
      setMessage('Transmisión iniciada');
    } catch (err) {
      setMessage('Error al iniciar transmisión');
    }
  };

  const stopStream = () => {
    liveStreamService.stopStream(videoRef);
    setStreaming(false);
    setMessage('Transmisión detenida');
  };

  return (
    <div>
      <h2>Transmisión en Vivo</h2>
      <video ref={videoRef} autoPlay playsInline style={{width: '100%', border: '1px solid #ccc'}} />
      <button onClick={startStream} disabled={streaming}>Iniciar</button>
      <button onClick={stopStream} disabled={!streaming}>Detener</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LiveStreamComponent;
