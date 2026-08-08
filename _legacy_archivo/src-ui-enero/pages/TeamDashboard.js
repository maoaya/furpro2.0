import React from 'react';
import { Card } from 'antd';

function TeamDashboard() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Panel del Equipo</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323', marginBottom: 32 }}>
        <p style={{ fontSize: 18 }}>Gestión de jugadores, ranking, historial y estadísticas del equipo.</p>
      </Card>
    </div>
  );
}

export default TeamDashboard;
