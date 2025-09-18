import React, { useState } from 'react';

const emojis = ['😀','😂','😍','😎','🥳','👍','🔥','⚽','🏆','🎉'];

const MediaDetailPage = () => {
  const [mensajePrivado, setMensajePrivado] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [historia, setHistoria] = useState('');
  const [historias, setHistorias] = useState([]);

  // Simulación de historias (24h)
  const agregarHistoria = () => {
    if (historia.trim()) {
      setHistorias([...historias, { texto: historia, fecha: new Date() }]);
      setHistoria('');
      setTimeout(() => {
        setHistorias(hs => hs.filter(h => (new Date() - h.fecha) < 86400000)); // 24h
      }, 86400000);
    }
  };

  const enviarMensajePrivado = () => {
    if (mensajePrivado.trim() || selectedEmoji) {
      setMensajes([...mensajes, { texto: mensajePrivado + selectedEmoji, fecha: new Date() }]);
      setMensajePrivado('');
      setSelectedEmoji('');
    }
  };

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Detalle de Media</h2>
      <p>Aquí se mostrarán los detalles de fotos y videos.</p>
      {/* Historias de 24 horas */}
      <div style={{ margin: '24px 0', background: '#232323', color: '#FFD700', borderRadius: 12, padding: 16 }}>
        <h3>Historias (24h)</h3>
        <input value={historia} onChange={e => setHistoria(e.target.value)} placeholder="Agrega una historia..." style={{ borderRadius: 8, padding: 8, width: 220 }} />
        <button onClick={agregarHistoria} style={{ marginLeft: 8, background: '#FFD700', color: '#232323', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }}>Publicar</button>
        <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'center' }}>
          {historias.map((h, idx) => (
            <div key={idx} style={{ background: '#FFD700', color: '#232323', borderRadius: 8, padding: 8, minWidth: 120 }}>
              {h.texto} <br /> <span style={{ fontSize: 12 }}>{h.fecha.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Mensajes privados y emojis */}
      <div style={{ margin: '24px 0', background: '#232323', color: '#FFD700', borderRadius: 12, padding: 16 }}>
        <h3>Enviar mensaje privado</h3>
        <input value={mensajePrivado} onChange={e => setMensajePrivado(e.target.value)} placeholder="Escribe tu mensaje..." style={{ borderRadius: 8, padding: 8, width: 220 }} />
        <span style={{ marginLeft: 12 }}>
          {emojis.map(e => (
            <button key={e} onClick={() => setSelectedEmoji(e)} style={{ fontSize: 22, background: selectedEmoji === e ? '#FFD700' : '#232323', color: selectedEmoji === e ? '#232323' : '#FFD700', border: 'none', borderRadius: 8, margin: '0 2px', cursor: 'pointer' }}>{e}</button>
          ))}
        </span>
        <button onClick={enviarMensajePrivado} style={{ marginLeft: 8, background: '#FFD700', color: '#232323', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }}>Enviar</button>
        <div style={{ marginTop: 12, textAlign: 'left', maxWidth: 400, margin: '12px auto' }}>
          <h4>Mensajes enviados</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {mensajes.map((m, idx) => (
              <li key={idx} style={{ background: '#FFD700', color: '#232323', borderRadius: 8, padding: 8, marginBottom: 6 }}>
                {m.texto} <span style={{ fontSize: 12 }}>{m.fecha.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailPage;
