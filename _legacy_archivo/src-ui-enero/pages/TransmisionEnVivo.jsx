import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export default function TransmisionEnVivo() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [matchId, setMatchId] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [streamId, setStreamId] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      return false;
    }
  };

  const startStreaming = async () => {
    if (!streamTitle) {
      alert('Ingresa un título para la transmisión');
      return;
    }

    const cameraStarted = await startCamera();
    if (!cameraStarted) return;

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Usuario no autenticado');

      const newStreamId = `stream_${Date.now()}`;
      
      // Crear entrada en live_streams
      const { error } = await supabase.from('live_streams').insert({
        stream_id: newStreamId,
        host_id: user.id,
        title: streamTitle,
        stream_url: streamUrl || null,
        match_id: matchId || null,
        status: 'active',
        viewer_count: 0
      });

      if (error) throw error;

      setStreamId(newStreamId);
      setIsStreaming(true);

      // Suscribirse a actualizaciones de viewers
      const channel = supabase.channel(`stream-${newStreamId}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          setViewerCount(Object.keys(state).length);
        })
        .subscribe();

    } catch (error) {
      console.error('Error al iniciar transmisión:', error);
      alert('Error al iniciar la transmisión');
      stopStreaming();
    }
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (streamId) {
      supabase.from('live_streams')
        .update({ status: 'completed', ended_at: new Date().toISOString() })
        .eq('stream_id', streamId)
        .then(() => {});
    }

    setIsStreaming(false);
    setStreamId(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#FFD700' }}>
          📡 Transmisión en Vivo
        </h1>

        {!isStreaming ? (
          <div style={{
            background: '#2a2a2a',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Configurar Transmisión</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Título de la transmisión *
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Ej: Final del Torneo Sub-17"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                URL de stream externo (opcional)
              </label>
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://youtube.com/live/... o https://twitch.tv/..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                ID del partido (opcional)
              </label>
              <input
                type="text"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                placeholder="UUID del partido"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <button
              onClick={startStreaming}
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                padding: '15px 40px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🎥 Iniciar Transmisión
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#2a2a2a',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>🔴 EN VIVO: {streamTitle}</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span style={{ color: '#FFD700' }}>👁️ {viewerCount} espectadores</span>
                  <button
                    onClick={stopStreaming}
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ⏹️ Detener
                  </button>
                </div>
              </div>

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  background: '#000',
                  borderRadius: '8px'
                }}
              />
            </div>

            <div style={{
              background: '#2a2a2a',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3>💬 Chat en vivo</h3>
              <div style={{
                height: '200px',
                overflowY: 'auto',
                background: '#1a1a1a',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                {comments.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center' }}>No hay comentarios aún</p>
                ) : (
                  comments.map((comment, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#FFD700' }}>{comment.user}:</strong> {comment.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '20px'
        }}>
          <h3>ℹ️ Información</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Puedes transmitir usando tu cámara o enlazar una URL externa (YouTube, Twitch, etc.)</li>
            <li>Los espectadores podrán ver la transmisión en tiempo real</li>
            <li>Vincula la transmisión a un partido específico usando el ID del partido</li>
            <li>Asegúrate de tener permisos de cámara y micrófono habilitados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
