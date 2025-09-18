import React, { useState } from 'react';

export default function EquipoTecnicoPage() {
  const [tecnicos, setTecnicos] = useState(() => JSON.parse(localStorage.getItem('equipo_tecnico') || '[]'));
  const [nuevo, setNuevo] = useState({ nombre: '', rol: '' });
  const [shareFeedback, setShareFeedback] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.rol) return;
    if (tecnicos.length >= 4) return alert('Solo puedes agregar hasta 4 personas.');
    const lista = [...tecnicos, { ...nuevo, id: Date.now() }];
    setTecnicos(lista);
    localStorage.setItem('equipo_tecnico', JSON.stringify(lista));
    setNuevo({ nombre: '', rol: '' });
  };

  const handleShare = async () => {
    const url = window.location.origin + '/equipo-tecnico';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Equipo Técnico FutPro', url });
        setShareFeedback('¡Compartido!');
        setTimeout(() => setShareFeedback(''), 1500);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback('¡Copiado!');
        setTimeout(() => setShareFeedback(''), 1500);
      } catch {}
    }
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2>Equipo Técnico (máx. 4 personas)</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <input value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Nombre" style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700' }} />
        <input value={nuevo.rol} onChange={e => setNuevo({ ...nuevo, rol: e.target.value })} placeholder="Rol (DT, PF, Médico, etc)" style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700' }} />
        <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer' }}>Agregar</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tecnicos.map(t => (
          <li key={t.id} style={{ background: '#232323', borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <strong>{t.nombre}</strong> - {t.rol}
          </li>
        ))}
      </ul>
      {/* Compartir equipo técnico */}
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={handleShare} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>Compartir equipo</button>
        <input value={window.location.origin + '/equipo-tecnico'} readOnly style={{ width: 160, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }} onFocus={e => e.target.select()} />
        {shareFeedback && <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{shareFeedback}</span>}
      </div>
    </div>
  );
}
