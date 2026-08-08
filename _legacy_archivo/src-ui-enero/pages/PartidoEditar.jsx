import React from 'react';

export default function PartidoEditar({ partidoId }) {
  // Aquí puedes cargar y editar los datos del partido
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Editar Partido</h2>
      {/* Formulario de edición */}
      <form style={{ background: '#232323', borderRadius: 8, padding: '24px', color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', maxWidth: 500, margin: 'auto' }}>
        <label style={{ display: 'block', marginBottom: 12 }}>Equipo A:<input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #FFD700', background: '#181818', color: '#FFD700', marginTop: 4 }} /></label>
        <label style={{ display: 'block', marginBottom: 12 }}>Equipo B:<input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #FFD700', background: '#181818', color: '#FFD700', marginTop: 4 }} /></label>
        <label style={{ display: 'block', marginBottom: 12 }}>Fecha:<input type="date" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #FFD700', background: '#181818', color: '#FFD700', marginTop: 4 }} /></label>
  <Button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 16, transition: 'background 0.3s, color 0.3s' }}>Guardar Cambios</Button>
      </form>
    </div>
  );
}
