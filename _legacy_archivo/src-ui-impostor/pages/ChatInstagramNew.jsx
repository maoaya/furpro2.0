import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

export default function ChatInstagramStyled() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersCache, setUsersCache] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages();
      markMessagesAsRead();
      scrollToBottom();
      
      // Suscribirse a nuevos mensajes en tiempo real
      const channel = supabase
        .channel(`chat-messages-${selectedConversation.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserData = async (userId) => {
    if (usersCache[userId]) return usersCache[userId];
    
    try {
      const { data, error } = await supabase
        .from('carfutpro')
        .select('user_id, nombre, apellido, avatar_url')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setUsersCache(prev => ({ ...prev, [userId]: data }));
        return data;
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
    return null;
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .contains('participants', [user.id])
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Cargar datos de usuarios participantes
      const conversations = data || [];
      for (const conv of conversations) {
        for (const participantId of conv.participants) {
          if (participantId !== user.id) {
            await loadUserData(participantId);
          }
        }
      }

      setConversations(conversations);
    } catch (err) {
      console.error('Error cargando conversaciones:', err);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation?.id) return;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedConversation?.id) return;
    
    try {
      const { data: unreadMessages } = await supabase
        .from('chat_messages')
        .select('id, read_by')
        .eq('conversation_id', selectedConversation.id)
        .neq('sender_id', user.id);

      const updates = (unreadMessages || [])
        .filter(msg => !msg.read_by?.includes(user.id))
        .map(msg => ({
          id: msg.id,
          read_by: [...(msg.read_by || []), user.id]
        }));

      if (updates.length > 0) {
        await supabase
          .from('chat_messages')
          .upsert(updates);
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.id) return;

    setLoading(true);
    try {
      const deliveredTo = selectedConversation.participants.filter(p => p !== user.id);

      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text',
          delivered_to: deliveredTo
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async (targetUserId) => {
    try {
      // Buscar conversación directa existente
      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('type', 'direct')
        .contains('participants', [user.id])
        .contains('participants', [targetUserId]);

      if (existing && existing.length > 0) {
        setSelectedConversation(existing[0]);
        return;
      }

      // Crear nueva conversación
      const { data: newConv, error } = await supabase
        .from('chat_conversations')
        .insert([{
          type: 'direct',
          participants: [user.id, targetUserId]
        }])
        .select()
        .single();

      if (error) throw error;
      
      await loadUserData(targetUserId);
      setSelectedConversation(newConv);
      loadConversations();
    } catch (err) {
      console.error('Error iniciando conversación:', err);
    }
  };

  const getOtherParticipant = (conv) => {
    if (conv.type === 'group') return null;
    const otherUserId = conv.participants.find(p => p !== user?.id);
    return usersCache[otherUserId] || null;
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    if (!other) return false;
    const name = `${other?.nombre || ''} ${other?.apellido || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const getUnreadCount = (conv) => {
    // TODO: Implementar conteo de no leídos
    return 0;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      height: '100vh',
      background: '#fff',
      gap: 0
    }}>
      {/* PANEL IZQUIERDO - Conversaciones */}
      <div style={{
        background: '#fff',
        borderRight: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, marginBottom: 16 }}>Mensajes</h2>
          <input
            type="text"
            placeholder="Buscar conversación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #e5e5e5',
              borderRadius: '24px',
              background: '#f0f0f0',
              fontSize: 14
            }}
          />
        </div>

        {/* Lista de Conversaciones */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
              No hay conversaciones
            </div>
          ) : (
            filteredConversations.map(conv => {
              const other = getOtherParticipant(conv);
              if (!other) return null;
              const isSelected = selectedConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  style={{
                    padding: '12px 8px',
                    cursor: 'pointer',
                    background: isSelected ? '#f0f0f0' : 'transparent',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    borderBottom: '1px solid #e5e5e5',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = '#f9f9f9')}
                  onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')}
                >
                  <img
                    src={other?.avatar_url || 'https://via.placeholder.com/50'}
                    alt=""
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>
                      {other?.nombre} {other?.apellido}
                    </div>
                    <div style={{ fontSize: 13, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.last_message_preview || 'Ningún mensaje aún'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PANEL DERECHO - Chat */}
      {selectedConversation ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#fff'
        }}>
          {/* Header del Chat */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img
              src={getOtherParticipant(selectedConversation)?.avatar_url || 'https://via.placeholder.com/40'}
              alt=""
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>
                {getOtherParticipant(selectedConversation)?.nombre} {getOtherParticipant(selectedConversation)?.apellido}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>Activo ahora</div>
            </div>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#fff'
          }}>
            {messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              const sender = usersCache[msg.sender_id];
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    marginBottom: '12px',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}
                >
                  {!isOwn && (
                    <img
                      src={sender?.avatar_url || 'https://via.placeholder.com/32'}
                      alt=""
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <div
                    style={{
                      background: isOwn ? '#0095F6' : '#e5e5e5',
                      color: isOwn ? '#fff' : '#000',
                      padding: '8px 16px',
                      borderRadius: '18px',
                      maxWidth: '60%',
                      wordWrap: 'break-word',
                      fontSize: 14
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensaje */}
          <form
            onSubmit={sendMessage}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #e5e5e5',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end'
            }}
          >
            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0095F6',
                fontSize: 20,
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              😊
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                border: '1px solid #e5e5e5',
                borderRadius: '24px',
                padding: '10px 16px',
                fontSize: 14,
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              style={{
                background: newMessage.trim() ? '#0095F6' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 16
        }}>
          Selecciona una conversación para empezar
        </div>
      )}
    </div>
  );
}
