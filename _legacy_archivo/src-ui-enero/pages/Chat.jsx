import React, { useEffect, useState } from 'react';
import { ChatManager } from '../services/ChatManager';

export default function Chat() {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [chatManager, setChatManager] = useState(null);

  useEffect(() => {
    const manager = new ChatManager();
    setChatManager(manager);
    manager.messageListeners.set('main', (msg) => {
      setMensajes((prev) => [...prev, msg]);
    });
    return () => {
      manager.messageListeners.delete('main');
    };
  }, []);

  const enviarMensaje = () => {
    if (chatManager && input.trim()) {
      chatManager.socket.emit('send-message', { text: input });
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0002' }}>
      <h1 style={{ color: '#FFD700', textAlign: 'center' }}>Chat</h1>
      <div style={{ minHeight: 120, marginBottom: 16, background: '#232323', color: '#FFD700', borderRadius: 8, padding: 12 }}>
        {mensajes.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>{msg.text}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} style={{ width: '80%', marginRight: 8 }} />
      <button onClick={enviarMensaje} style={{ background: '#FFD700', color: '#232323', padding: '8px 16px', borderRadius: 8 }}>Enviar</button>
    </div>
  );
}
