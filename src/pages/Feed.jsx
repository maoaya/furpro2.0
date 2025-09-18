// ...existing code...
import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';

const publicacionesDemo = [
  { id: 1, usuario: 'Juan Pérez', contenido: '¡Gran partido hoy!', fecha: '2025-08-20', likes: 12 },
  { id: 2, usuario: 'Ana Gómez', contenido: '¡Nos vemos en el torneo!', fecha: '2025-08-19', likes: 8 },
];

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState(publicacionesDemo);
  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', color: '#FFD700', marginBottom: 24 }}>Feed Social</h2>
      <div style={{ marginBottom: 32 }}>
        <input type="text" placeholder="¿Qué quieres compartir?" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', fontSize: 18 }} />
        <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 12, transition: 'background 0.3s, color 0.3s' }}>Publicar</Button>
      </div>
      {/* Paginación y renderizado lógico de publicaciones */}
      {publicaciones.length === 0 ? (
        <div style={{ color: '#FFD700', textAlign: 'center', marginTop: 32 }}>No hay publicaciones aún.</div>
      ) : (
        publicaciones.slice(0, 5).map(pub => (
          <Card key={pub.id} title={pub.usuario} actions={
            <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>
              👍 {pub.likes}
            </Button>
          }>
            <div style={{ fontSize: 18, margin: '12px 0' }}>{pub.contenido}</div>
            <div style={{ fontSize: 15, color: '#FFD70099' }}>{pub.fecha}</div>
          </Card>
        ))
      )}
      {/* Componente de paginación simple */}
      {publicaciones.length > 5 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Button style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '8px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginRight: 8 }}>Anterior</Button>
          <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Siguiente</Button>
        </div>
      )}
    </div>
  );
}
// ...existing code...
