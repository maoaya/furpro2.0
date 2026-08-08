import React, { useState, useRef, useEffect } from 'react';
import AIService from '../services/AIService';
import '../styles/ChatPage.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy Grok, tu asistente de IA especializado en fútbol. ¿En qué puedo ayudarte hoy? Puedo darte consejos sobre estrategias, analizar equipos, predecir partidos o responder cualquier pregunta relacionada con el fútbol.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Contexto del usuario (puedes obtener esto del AuthContext)
      const userContext = {
        userName: 'Usuario', // Reemplaza con datos reales del contexto
        userEmail: 'usuario@futpro.com',
        userRole: 'Jugador'
      };

      const response = await AIService.generateResponse(inputMessage, userContext);

      const aiMessage = {
        id: messages.length + 2,
        text: response.success ? response.response : response.error,
        sender: 'ai',
        timestamp: new Date(),
        error: !response.success
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'ai',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>Chat con IA Fútbol</h1>
        <p>Asistente especializado en fútbol y gestión de equipos</p>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'} ${message.error ? 'error-message' : ''}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message ai-message loading-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="message-time">Escribiendo...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-form" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje sobre fútbol..."
              disabled={isLoading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
