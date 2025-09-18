import React, { useState } from 'react';

const mensajesMock = [
  { id: 1, usuario: 'Juan', texto: '¿Cómo hago un SELECT?' },
  { id: 2, usuario: 'María', texto: 'Usa SELECT * FROM tabla;' },
];

export default function ChatSQLPage() {
  const [mensajes, setMensajes] = useState(mensajesMock);
  const [texto, setTexto] = useState('');

  const handleEnviar = () => {
    if (texto.trim()) {
      setMensajes(prev => [...prev, { id: prev.length + 1, usuario: 'Tú', texto: texto.trim() }]);
      setTexto('');
    }
  };

  return (
    <div className="chat-sql-page" style={{ maxWidth: 700, margin: '24px auto' }}>
      <h2>Chat SQL</h2>
      <div style={{ background: '#f7f7f7', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        {mensajes.map(m => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <b>{m.usuario}:</b> {m.texto}
          </div>
        ))}
      </div>
      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escribe tu mensaje..."
        style={{ marginRight: 8, padding: 8, width: '70%' }}
      />
      <button onClick={handleEnviar}>Enviar</button>
    </div>
  );
}
