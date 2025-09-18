import React, { useState } from 'react';
import Button from './Button';

const equiposDemo = [
  { id: 1, nombre: 'Atlético Nacional', categoria: 'A', miembros: 22 },
  { id: 2, nombre: 'River Plate', categoria: 'A', miembros: 20 },
  { id: 3, nombre: 'Barcelona', categoria: 'A', miembros: 23 }
];

export default function Equipos() {
  const [equipos, setEquipos] = useState(equiposDemo);
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Equipos</h2>
  <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginBottom: 24, transition: 'background 0.3s, color 0.3s' }}>Crear equipo</Button>
      <ul style={{ fontSize: 18 }}>
        {equipos.map(e => (
          <li key={e.id} style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginBottom: 16 }}>
            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{e.nombre}</span> — Categoría: {e.categoria} — Miembros: {e.miembros}
            <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginLeft: 16, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = `/equipo-detalle/${e.id}`}>Ver detalle</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
