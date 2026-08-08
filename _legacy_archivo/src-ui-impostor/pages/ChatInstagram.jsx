import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import BottomNavBar from '../components/BottomNavBar';
import MenuHamburguesa from '../components/MenuHamburguesa';
import FutproLogo from '../components/FutproLogo';

const gold = '#FFD700';
const darkCard = '#1a1a1a';
const purple = '#9C27B0';

export default function ChatInstagram() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // chats, solicitudes, grupos
  const [conversations, setConversations] = useState([]);
  const [messageRequests, setMessageRequests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadConversations();
    loadMessageRequests();
    loadGroups();
  }, [user, navigate]);

  async function loadConversations() {
    try {
      // Cargar conversaciones de usuarios que seguimos mutuamente
      const { data: mutualFollows } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);

      if (!mutualFollows) return;

      const friendIds = mutualFollows.map(f => f.friend_id);
      
      // Obtener datos de usuarios
      const { data: users } = await supabase
        .from('carfutpro')
        .select('user_id, nombre, apellido, photo_url, avatar_url')
        .in('user_id', friendIds);

      setConversations(users?.map(u => ({
        id: u.user_id,
        name: `${u.nombre} ${u.apellido || ''}`.trim(),
        avatar: u.photo_url || u.avatar_url || 'https://via.placeholder.com/50',
        lastMessage: 'Toca para chatear',
        time: 'Ahora',
        unread: 0,
        online: Math.random() > 0.5
      })) || []);
    } catch (err) {
      console.error('Error cargando conversaciones:', err);
    }
  }

  async function loadMessageRequests() {
    // Simular solicitudes de mensaje
    setMessageRequests([
      {
        id: 'req1',
        name: 'Carlos Pérez',
        avatar: 'https://via.placeholder.com/50',
        message: 'Hola, me gustaría jugar un partido amistoso',
        time: '2h'
      }
    ]);
  }

  async function loadGroups() {
    // Simular grupos
    setGroups([
      {
        id: 'group1',
        name: 'Equipo Los Tigres',
        avatar: 'https://via.placeholder.com/50',
        members: 15,
        lastMessage: 'Juan: Confirmado para el sábado',
        time: '30m'
      }
    ]);
  }

  function openChat(chat) {
    setSelectedChat(chat);
    loadMessages(chat.id);
  }

  async function loadMessages(chatId) {
    // Simular mensajes
    setMessages([
      { id: 1, sender: 'other', text: '¿Jugamos este sábado?', time: '10:30', type: 'text' },
      { id: 2, sender: 'me', text: '¡Claro! ¿A qué hora?', time: '10:32', type: 'text' },
      { id: 3, sender: 'other', text: 'A las 4pm en la cancha del parque', time: '10:35', type: 'text' }
    ]);
  }

  function sendMessage() {
    if (!messageText.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  }

  function sendImage() {
    fileInputRef.current?.click();
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simular envío de imagen
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      type: 'image',
      imageUrl: URL.createObjectURL(file),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  }

  function startVoiceRecording() {
    setIsRecording(true);
    // Aquí iría la lógica de grabación de audio
    setTimeout(() => {
      setIsRecording(false);
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        type: 'voice',
        duration: '0:15',
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
    }, 2000);
  }

  function sendLineup() {
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      type: 'lineup',
      text: '📋 Alineación propuesta para el sábado',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  }

  function sendAttendanceConfirmation() {
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      type: 'confirmation',
      text: '✅ Confirmo mi asistencia al partido del sábado 4pm',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  }

  const emojis = ['⚽', '🏆', '👍', '🔥', '💪', '😂', '❤️', '🎉'];

  function addEmoji(emoji) {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  }

  if (selectedChat) {
    // Vista de chat individual
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', paddingBottom: 80 }}>
        {/* Header del chat */}
        <header style={{
          background: darkCard,
          borderBottom: `2px solid ${purple}`,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button onClick={() => setSelectedChat(null)} style={{ background: 'none', border: 'none', color: purple, fontSize: 24, cursor: 'pointer' }}>←</button>
          <img src={selectedChat.avatar} alt={selectedChat.name} style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${purple}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedChat.name}</div>
            <div style={{ fontSize: 12, color: selectedChat.online ? '#4CAF50' : '#888' }}>
              {selectedChat.online ? 'En línea' : 'Desconectado'}
            </div>
          </div>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: gold, fontSize: 24, cursor: 'pointer' }}>☰</button>
        </header>

        <MenuHamburguesa isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Mensajes */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 'calc(100vh - 200px)' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '70%'
            }}>
              {msg.type === 'text' && (
                <div style={{
                  background: msg.sender === 'me' ? purple : '#2a2a2a',
                  padding: '10px 14px',
                  borderRadius: 18,
                  color: '#fff'
                }}>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: 10, color: '#bbb', marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
                </div>
              )}
              {msg.type === 'image' && (
                <div style={{ borderRadius: 12, overflow: 'hidden', border: `2px solid ${purple}` }}>
                  <img src={msg.imageUrl} alt="Imagen" style={{ width: '100%', display: 'block' }} />
                  <div style={{ background: purple, padding: '4px 8px', fontSize: 10, color: '#fff', textAlign: 'right' }}>{msg.time}</div>
                </div>
              )}
              {msg.type === 'voice' && (
                <div style={{ background: msg.sender === 'me' ? purple : '#2a2a2a', padding: '10px 14px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🎤</span>
                  <div style={{ flex: 1, height: 4, background: '#444', borderRadius: 2 }} />
                  <span style={{ fontSize: 12 }}>{msg.duration}</span>
                </div>
              )}
              {msg.type === 'lineup' && (
                <div style={{ background: '#1565C0', padding: '12px', borderRadius: 12, border: '2px solid #42A5F5' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{msg.text}</div>
                  <div style={{ fontSize: 10, color: '#ddd', marginTop: 4 }}>{msg.time}</div>
                </div>
              )}
              {msg.type === 'confirmation' && (
                <div style={{ background: '#2E7D32', padding: '12px', borderRadius: 12, border: '2px solid #66BB6A' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{msg.text}</div>
                  <div style={{ fontSize: 10, color: '#ddd', marginTop: 4 }}>{msg.time}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input de mensaje */}
        <div style={{
          position: 'fixed',
          bottom: 70,
          left: 0,
          right: 0,
          background: darkCard,
          borderTop: `2px solid ${purple}`,
          padding: '12px 16px'
        }}>
          {/* Botones de acción rápida */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, overflowX: 'auto' }}>
            <button onClick={sendImage} style={{ background: '#1565C0', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>📷 Imagen</button>
            <button onClick={startVoiceRecording} disabled={isRecording} style={{ background: '#E91E63', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>{isRecording ? '⏺️ Grabando...' : '🎤 Nota de voz'}</button>
            <button onClick={sendLineup} style={{ background: '#FF6F00', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>📋 Alineación</button>
            <button onClick={sendAttendanceConfirmation} style={{ background: '#2E7D32', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>✅ Confirmar</button>
          </div>

          {/* Input principal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>😊</button>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                background: '#2a2a2a',
                border: `1px solid ${purple}`,
                borderRadius: 20,
                padding: '10px 16px',
                color: '#fff',
                fontSize: 14
              }}
            />
            <button onClick={sendMessage} disabled={!messageText.trim()} style={{
              background: messageText.trim() ? purple : '#444',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              color: '#fff',
              fontSize: 18,
              cursor: messageText.trim() ? 'pointer' : 'not-allowed'
            }}>
              ➤
            </button>
          </div>

          {/* Picker de emojis */}
          {showEmojiPicker && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, padding: '8px', background: '#2a2a2a', borderRadius: 12 }}>
              {emojis.map(emoji => (
                <button key={emoji} onClick={() => addEmoji(emoji)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>{emoji}</button>
              ))}
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

        <BottomNavBar />
      </div>
    );
  }

  // Vista principal de chats
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(120deg, #0b0b0b 0%, #1a1a1a 60%, #0b0b0b 100%)',
        borderBottom: `2px solid ${purple}`,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FutproLogo size={36} />
          <div style={{ fontWeight: 800, fontSize: 20, color: purple }}>Chat</div>
        </div>
        <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', color: gold, fontSize: 28, cursor: 'pointer' }}>☰</button>
      </header>

      <MenuHamburguesa isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid #333`, background: darkCard }}>
        {[
          { key: 'chats', label: 'Chats', count: conversations.length },
          { key: 'solicitudes', label: 'Solicitudes', count: messageRequests.length },
          { key: 'grupos', label: 'Grupos', count: groups.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === tab.key ? purple : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? `3px solid ${gold}` : '3px solid transparent',
              color: activeTab === tab.key ? '#fff' : '#888',
              fontWeight: activeTab === tab.key ? 800 : 600,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Lista de conversaciones */}
      <div style={{ padding: '8px' }}>
        {activeTab === 'chats' && conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => openChat(conv)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px',
              background: darkCard,
              borderRadius: 12,
              marginBottom: 8,
              cursor: 'pointer',
              border: '1px solid #333',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
            onMouseLeave={(e) => e.currentTarget.style.background = darkCard}
          >
            <div style={{ position: 'relative' }}>
              <img src={conv.avatar} alt={conv.name} style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${purple}` }} />
              {conv.online && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, background: '#4CAF50', borderRadius: '50%', border: '2px solid #0a0a0a' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{conv.name}</div>
              <div style={{ fontSize: 13, color: '#aaa' }}>{conv.lastMessage}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{conv.time}</div>
              {conv.unread > 0 && (
                <div style={{ background: purple, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                  {conv.unread}
                </div>
              )}
            </div>
          </div>
        ))}

        {activeTab === 'solicitudes' && messageRequests.map(req => (
          <div key={req.id} style={{ background: darkCard, borderRadius: 12, padding: 12, marginBottom: 8, border: '1px solid #FF6B6B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <img src={req.avatar} alt={req.name} style={{ width: 50, height: 50, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{req.name}</div>
                <div style={{ fontSize: 13, color: '#aaa' }}>{req.message}</div>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{req.time}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, background: purple, border: 'none', borderRadius: 8, padding: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Aceptar</button>
              <button style={{ flex: 1, background: '#444', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Rechazar</button>
            </div>
          </div>
        ))}

        {activeTab === 'grupos' && groups.map(group => (
          <div
            key={group.id}
            onClick={() => openChat(group)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              background: darkCard,
              borderRadius: 12,
              marginBottom: 8,
              cursor: 'pointer',
              border: '1px solid #4CAF50'
            }}
          >
            <img src={group.avatar} alt={group.name} style={{ width: 56, height: 56, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{group.name}</div>
              <div style={{ fontSize: 13, color: '#aaa' }}>{group.lastMessage}</div>
              <div style={{ fontSize: 12, color: '#4CAF50', marginTop: 4 }}>{group.members} miembros</div>
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{group.time}</div>
          </div>
        ))}
      </div>

      <BottomNavBar />
    </div>
  );
}
