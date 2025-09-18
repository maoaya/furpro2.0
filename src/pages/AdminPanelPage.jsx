// import supabase from '../supabaseClient';

// Ejemplo de borrado y tiempo real para entidades administradas
// const handleBorrarUsuario = async (id) => { /* ... */ };
// const handleBorrarTorneo = async (id) => { /* ... */ };
// const handleBorrarPago = async (id) => { /* ... */ };
// const handleBorrarReporte = async (id) => { /* ... */ };

// React.useEffect(() => {
//   // Suscripción a cambios en todas las entidades
// }, []);
import React from 'react';
export default function AdminPanelPage() {
  return (
    <div style={{ color: '#FFD700', background: '#181818', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #FFD70022', maxWidth: 800, margin: '0 auto', fontSize: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Panel de administración</h1>
      <p>Accede a la gestión avanzada de usuarios, torneos, pagos y reportes.</p>
      <div style={{ marginTop: 32 }}>
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginRight: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Usuarios</button>
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginRight: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Torneos</button>
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, marginRight: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Pagos</button>
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}>Reportes</button>
      </div>
    </div>
  );
}
