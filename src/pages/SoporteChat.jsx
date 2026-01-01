import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

export default function SoporteChat() {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('soporte').select('*');
    if (error) setError(error.message);
    else setMensajes(data);
    setLoading(false);
  };

  const handleEnviar = async () => {
    setLoading(true);
    const { error } = await supabase.from('soporte').insert([{ mensaje: nuevoMensaje }]);
    if (error) setFeedback('Error al enviar mensaje');
    else setFeedback('Mensaje enviado');
    setNuevoMensaje('');
    cargarMensajes();
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Soporte y Ayuda</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando mensajes...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
      <div style={{ background: '#232323', borderRadius: 12, padding: 24, minWidth: 320 }}>
        <h3>Chat en tiempo real</h3>
        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 18 }}>
          {mensajes.map(m => (
            <div key={m.id} style={{ marginBottom: 8 }}><strong>{m.usuario}:</strong> {m.mensaje}</div>
          ))}
        </div>
        <input value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} placeholder="Escribe tu mensaje..." style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
        <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={handleEnviar}>Enviar</Button>
      </div>
    </div>
  );
}
