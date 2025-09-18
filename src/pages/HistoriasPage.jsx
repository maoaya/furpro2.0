
import React, { useState } from 'react';

export default function HistoriasPage() {
  const [historias, setHistorias] = useState(() => JSON.parse(localStorage.getItem('historias') || '[]'));
  const [nueva, setNueva] = useState({ tipo: '', url: '', descripcion: '' });
  const [preview, setPreview] = useState('');
  const [copiadoId, setCopiadoId] = useState(null);

  const urlHistoria = id => `${window.location.origin}/historias/${id}`;
  const handleCompartir = async (historia) => {
    const url = urlHistoria(historia.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Historia',
          text: historia.descripcion,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopiadoId(historia.id);
      setTimeout(() => setCopiadoId(null), 1500);
    }
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!nueva.tipo || !preview) return;
    const historia = { ...nueva, url: preview, id: Date.now(), fecha: new Date().toISOString() };
    const nuevas = [historia, ...historias];
    setHistorias(nuevas);
    localStorage.setItem('historias', JSON.stringify(nuevas));
    setNueva({ tipo: '', url: '', descripcion: '' });
    setPreview('');
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Historias</h2>
      <form onSubmit={handleAdd} style={{ background: '#232323', borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
        <select name="tipo" value={nueva.tipo} onChange={e => setNueva({ ...nueva, tipo: e.target.value })} style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700' }} required>
          <option value="">Tipo</option>
          <option value="foto">Foto</option>
          <option value="video">Video</option>
        </select>
        <input type="file" accept="image/*,video/*" onChange={handleFile} required />
        {preview && (nueva.tipo === 'foto' ? <img src={preview} alt="preview" style={{ width: 60, borderRadius: 8 }} /> : <video src={preview} controls style={{ width: 60, borderRadius: 8 }} />)}
        <input name="descripcion" value={nueva.descripcion} onChange={e => setNueva({ ...nueva, descripcion: e.target.value })} placeholder="Descripción" style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700', width: 180 }} />
        <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Publicar</button>
      </form>
      <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 16 }}>
        {historias.length === 0 && <div>No hay historias.</div>}
        {historias.map(h => (
          <div key={h.id} style={{ background: '#232323', borderRadius: 12, padding: 8, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 12px #FFD70033' }}>
            {h.tipo === 'foto' && <img src={h.url} alt="historia" style={{ width: 100, borderRadius: 8, border: '2px solid #FFD700' }} />}
            {h.tipo === 'video' && <video src={h.url} controls style={{ width: 100, borderRadius: 8, border: '2px solid #FFD700' }} />}
            <div style={{ fontSize: 13, color: '#FFD700cc', marginTop: 6 }}>{h.descripcion}</div>
            <div style={{ fontSize: 11, color: '#FFD70099' }}>{new Date(h.fecha).toLocaleString()}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'center' }}>
              <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleCompartir(h)}>Compartir</button>
              <span style={{ fontSize: 12, color: '#FFD70099' }}>URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlHistoria(h.id)}</span></span>
              {copiadoId === h.id && <span style={{ color: '#FFD700', marginLeft: 8 }}>¡Enlace copiado!</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
