import React from 'react';

export default function ConfiguracionPanel({ usuario }) {
  return (
    <div className="configuracion-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Configuración y Privacidad</h3>
      <div>
        <p>Nombre: {usuario?.nombre}</p>
        <p>Email: {usuario?.email}</p>
        <p>Privacidad: {usuario?.privacidad ? 'Privado' : 'Público'}</p>
        {/* Agrega más opciones de configuración aquí */}
      </div>
    </div>
  );
}
