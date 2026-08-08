import React from 'react';

function StaffPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Gestión de Staff</h1>
      <p style={{ fontSize: 18, marginBottom: 32 }}>Administra el staff y roles de apoyo en los eventos.</p>
      <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Agregar Staff</button>
    </div>
  );
}

export default StaffPage;
