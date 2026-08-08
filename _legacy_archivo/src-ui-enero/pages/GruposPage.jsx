
import React, { useState } from 'react';

export default function GruposPage() {
  const [grupos, setGrupos] = useState(() => JSON.parse(localStorage.getItem('grupos') || '[]'));
  const [nuevo, setNuevo] = useState({ nombre: '', emogi: '' });
  const [mensaje, setMensaje] = useState('');
  const [copiadoId, setCopiadoId] = useState(null);

  const urlGrupo = id => `${window.location.origin}/grupos/${id}`;
  const handleCompartir = async (grupo) => {
    const url = urlGrupo(grupo.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Grupo: ${grupo.nombre}`,
          text: 'Únete a mi grupo en FutPro',
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopiadoId(grupo.id);
      setTimeout(() => setCopiadoId(null), 1500);
    }
  };

  const handleAddGrupo = e => {
    e.preventDefault();
    if (!nuevo.nombre) return;
    const lista = [...grupos, { ...nuevo, id: Date.now(), mensajes: [] }];
    setGrupos(lista);
    localStorage.setItem('grupos', JSON.stringify(lista));
    setNuevo({ nombre: '', emogi: '' });
  };

  const handleEnviarMensaje = (id) => {
    if (!mensaje.trim()) return;
    const lista = grupos.map(g => g.id === id ? { ...g, mensajes: [...g.mensajes, { texto: mensaje, fecha: new Date().toISOString() }] } : g);
    setGrupos(lista);
    localStorage.setItem('grupos', JSON.stringify(lista));
    setMensaje('');
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2>Grupos y Emojis</h2>
      <form onSubmit={handleAddGrupo} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <input value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Nombre del grupo" style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700' }} />
        <input value={nuevo.emogi} onChange={e => setNuevo({ ...nuevo, emogi: e.target.value })} placeholder="Emoji (ej: ⚽)" style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700', width: 60 }} />
        <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Crear grupo</button>
      </form>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {grupos.length === 0 && <div>No hay grupos aún.</div>}
        {grupos.map(g => (
          <div key={g.id} style={{ background: '#232323', borderRadius: 12, padding: 18, minWidth: 220, boxShadow: '0 2px 12px #FFD70033' }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{g.emogi} {g.nombre}</div>
            <div style={{ margin: '12px 0' }}>
              {g.mensajes.length === 0 && <div style={{ color: '#FFD70099' }}>Sin mensajes</div>}
              {g.mensajes.map((m, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <span style={{ color: '#FFD700', fontWeight: 'bold' }}>• </span>{m.texto} <span style={{ color: '#FFD70099', fontSize: 11 }}>({new Date(m.fecha).toLocaleString()})</span>
                </div>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); handleEnviarMensaje(g.id); }} style={{ display: 'flex', gap: 6 }}>
              <input value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Mensaje..." style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #FFD700' }} />
              <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
            </form>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
              <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleCompartir(g)}>Compartir</button>
              <span style={{ fontSize: 12, color: '#FFD70099' }}>URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlGrupo(g.id)}</span></span>
              {copiadoId === g.id && <span style={{ color: '#FFD700', marginLeft: 8 }}>¡Enlace copiado!</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
