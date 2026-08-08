import React from 'react';

const equipoDemo = {
  nombre: 'Atlético Nacional',
  categoria: 'A',
  miembros: 22,
  partidos: 42,
  victorias: 28,
  goles: 88,
  jugadores: ['Juan Pérez', 'Ana Gómez', 'Carlos Ruiz'],
};

export default function EquipoDetalle({ equipoId }) {
  // Aquí puedes cargar los datos del equipo por ID
  const equipo = equipoDemo; // Simulación
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Detalle del Equipo</h2>
      <div style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginBottom: 24 }}>
        <div style={{ fontWeight: 'bold', fontSize: 20 }}>{equipo.nombre}</div>
        <div style={{ fontSize: 18 }}>Categoría: {equipo.categoria}</div>
        <div style={{ fontSize: 18 }}>Miembros: {equipo.miembros}</div>
        <div style={{ fontSize: 18 }}>Partidos: {equipo.partidos}</div>
        <div style={{ fontSize: 18 }}>Victorias: {equipo.victorias}</div>
        <div style={{ fontSize: 18 }}>Goles: {equipo.goles}</div>
      </div>
      <div style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: 24 }}>Jugadores</h3>
        <ul style={{ fontSize: 18 }}>
          {equipo.jugadores.map(j => <li key={j}>{j}</li>)}
        </ul>
      </div>
    </div>
  );
}
