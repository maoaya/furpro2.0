import React from 'react';
import { Card } from 'antd';

function PlayerDashboard() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Panel del Jugador</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323', marginBottom: 32 }}>
        <p style={{ fontSize: 18 }}>Estadísticas personales, historial de partidos, ranking y convocatorias.</p>
      </Card>
    </div>
  );
}

export default PlayerDashboard;
