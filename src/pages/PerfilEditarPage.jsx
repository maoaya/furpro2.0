import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function PerfilEditarPage() {
  const usuarioActivo = localStorage.getItem('usuarioActivo') || '';
  const [nombre, setNombre] = useState(usuarioActivo);
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [feedback, setFeedback] = useState('');

  // Cargar datos actuales
  React.useEffect(() => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = usuarios.find(u => u.nombre === usuarioActivo);
    if (user) {
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [usuarioActivo]);

  const handleGuardar = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const idx = usuarios.findIndex(u => u.nombre === usuarioActivo);
    if (idx !== -1) {
      usuarios[idx] = { ...usuarios[idx], nombre, email, avatar };
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      setFeedback('¡Perfil actualizado!');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  return (
    <div style={{ background: black, color: gold, minHeight: '100vh', padding: 48, maxWidth: 600, margin: 'auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Editar Perfil</h1>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, color: gold }}>
        <label>Nombre:<br />
          <input value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} />
        </label>
        <label>Email:<br />
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} />
        </label>
        <label>Avatar (URL):<br />
          <input value={avatar} onChange={e => setAvatar(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} />
        </label>
        <button onClick={handleGuardar} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 18 }}>Guardar cambios</button>
        {feedback && <div style={{ color: gold, marginTop: 16 }}>{feedback}</div>}
      </div>
    </div>
  );
}
