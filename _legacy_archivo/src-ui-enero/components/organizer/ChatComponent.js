import React, { useState, useEffect, useRef } from 'react';
import chatService from '../../services/chatService';

const ChatComponent = ({ roomId, user, onMultimedia, onNotificacion }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    chatService.connect(roomId, (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (onNotificacion) onNotificacion({ texto: `Nuevo mensaje de ${msg.user}`, fecha: new Date() });
    });
    return () => chatService.disconnect();
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      chatService.sendMessage({ roomId, user, text: input });
      setInput('');
    }
  };

  const sendFile = () => {
    if (file) {
      // Simulación de envío de archivo
      const fileObj = { name: file.name, url: URL.createObjectURL(file), user };
      setMessages((prev) => [...prev, { user, text: `Archivo: ${file.name}` }]);
      if (onMultimedia) onMultimedia(fileObj);
      setFile(null);
    }
  };

  return (
    <div>
      <h2>Chat en Tiempo Real</h2>
      <div style={{height: '200px', overflowY: 'auto', border: '1px solid #ccc'}} ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx}><b>{msg.user}:</b> {msg.text}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe un mensaje..." />
      <button onClick={sendMessage}>Enviar</button>
      <div style={{ marginTop: 12 }}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={sendFile} disabled={!file}>Enviar archivo</button>
      </div>
    </div>
  );
};

export default ChatComponent;
