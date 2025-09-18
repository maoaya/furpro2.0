// ...existing code...
import React from 'react';

export default function BaneosAdminPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Administración de Baneos</h2>
      <ul style={{ fontSize: 18 }}>
        <li style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', marginBottom: 16 }}>Usuarios bloqueados y motivos.</li>
        <li style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', marginBottom: 16 }}>Historial de sanciones.</li>
      </ul>
    </div>
  );
}
// ...existing code...
