import React, { useState } from 'react';

const integracionDemo = {
  estado: 'Activo',
  ultimaSync: '2025-08-20',
  logs: ['Sincronización exitosa', 'Error de conexión', 'Actualización de datos'],
  config: { apiKey: '****', endpoint: 'https://api.demo.com' }
};

export default function IntegracionDetalle() {
  const [editando, setEditando] = useState(false);
  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: 32, borderRadius: 16, maxWidth: 700, margin: 'auto' }}>
      <h2>Detalle de Integración</h2>
      <div><strong>Estado:</strong> {integracionDemo.estado}</div>
      <div><strong>Última sincronización:</strong> {integracionDemo.ultimaSync}</div>
      <div style={{ margin: '18px 0' }}>
        <strong>Logs:</strong>
        <ul>{integracionDemo.logs.map((l, i) => <li key={i}>{l}</li>)}</ul>
      </div>
      <div>
        <strong>Configuración:</strong>
        {editando ? (
          <div>
            <input type="text" defaultValue={integracionDemo.config.apiKey} />
            <input type="text" defaultValue={integracionDemo.config.endpoint} />
            <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginTop: 8 }} onClick={() => setEditando(false)}>Guardar</button>
          </div>
        ) : (
          <div>
            <span>API Key: ****</span><br />
            <span>Endpoint: {integracionDemo.config.endpoint}</span><br />
            <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginTop: 8 }} onClick={() => setEditando(true)}>Editar</button>
            <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginTop: 8 }}>Reintentar</button>
            <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginTop: 8 }}>Ver documentación</button>
          </div>
        )}
      </div>
    </div>
  );
}
