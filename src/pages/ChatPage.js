import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransmisionDirectaFutpro from './TransmisionDirectaFutpro';

// Página de chats abiertos

function ChatPage({ chats }) {
    const navigate = useNavigate();
    const [actividad] = useState([2, 4, 3, 5, 1]);
    const [msg, setMsg] = useState('');

    const handleOpenChat = (chatId) => {
        // Aquí puedes agregar lógica adicional si es necesario
        navigate(`/chat/${chatId}`);
    };

    function handleEnviar() {
        setMsg('Mensaje enviado');
        setTimeout(() => setMsg(''), 2000);
    }
    function handleFiltrar() {
        setMsg('Filtrando mensajes...');
        setTimeout(() => setMsg(''), 2000);
    }
    function handleVolver() {
        setMsg('Volviendo...');
        setTimeout(() => setMsg(''), 2000);
    }

    return (
        <div className="chat-page" style={{background:'#111',color:'#FFD700',minHeight:'100vh',padding:'32px'}}>
            <h2><i className="fas fa-comments"></i> Chats abiertos</h2>
            <div className="chat-list">
                {chats && chats.length > 0 ? (
                    chats.map((chat, idx) => (
                        <div key={idx} className="chat-item" style={{border:'1px solid #FFD700',borderRadius:'8px',marginBottom:'16px',padding:'16px',background:'#222'}}>
                            <div className="chat-header">
                                <img src={chat.avatar} alt={chat.nombre} className="avatar-mini" />
                                <span style={{color:'#FFD700',fontWeight:'bold'}}>{chat.nombre}</span>
                            </div>
                            <div className="chat-preview" style={{color:'#fff'}}>
                                {chat.lastMessage}
                            </div>
                            <button className="btn btn-primary" style={{background:'#FFD700',color:'#111',marginTop:'8px'}} onClick={() => handleOpenChat(chat.id)}>Abrir chat</button>
                        </div>
                    ))
                ) : (
                    <div className="chat-empty">No tienes chats abiertos.</div>
                )}
            </div>
            <button style={{marginTop:32,background:'#FFD700',color:'#111',padding:'12px 32px',borderRadius:'8px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Ir al inicio</button>
            <TransmisionDirectaFutpro />
            <div style={{ display: 'flex', gap: 16, marginTop: '32px', marginBottom: '32px' }}>
                <button onClick={handleEnviar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Enviar</button>
                <button onClick={handleFiltrar} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Filtrar</button>
                <button onClick={handleVolver} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>Volver</button>
            </div>
            <div style={{ background: '#232323', borderRadius: 12, padding: 32, marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 18 }}>Gráfico de actividad de chat</h3>
                <svg width="100%" height="120" viewBox="0 0 400 120">
                    {actividad.map((val, i) => (
                        <rect key={i} x={i * 70 + 20} y={120 - val * 20} width={40} height={val * 20} fill="#FFD700" rx={8} />
                    ))}
                    <line x1="20" y1="10" x2="20" y2="110" stroke="#FFD700" strokeWidth={2} />
                    <line x1="20" y1="110" x2="380" y2="110" stroke="#FFD700" strokeWidth={2} />
                </svg>
            </div>
            {msg && <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022' }}>{msg}</div>}
        </div>
    );
}

export default ChatPage;
