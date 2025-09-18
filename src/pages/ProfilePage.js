import React from 'react';

function ProfilePage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Perfil de Usuario</h1>
      <p style={{ fontSize: 18, marginBottom: 32 }}>Gestiona tu cuenta, configuración y privacidad.</p>
      <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginRight: 16 }}>Desactivar cuenta</button>
      <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Cerrar sesión</button>
    </div>
  );
}

export default ProfilePage;
