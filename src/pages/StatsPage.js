import React from 'react';
import { Card, Row, Col } from 'antd';
import { Bar } from 'react-chartjs-2';

const mockStats = {
  equipos: [
    { name: 'Equipo A', points: 60 },
    { name: 'Equipo B', points: 55 },
    { name: 'Equipo C', points: 52 },
  ],
  jugadores: [
    { name: 'Jugador X', points: 50 },
    { name: 'Jugador Y', points: 48 },
    { name: 'Jugador Z', points: 45 },
  ],
  eventos: [
    { name: 'Copa Oro', points: 80 },
    { name: 'Copa Plata', points: 65 },
  ],
};
const equiposData = {
  labels: mockStats.equipos.map(e => e.name),
  datasets: [{ label: 'Puntos Equipos', data: mockStats.equipos.map(e => e.points), backgroundColor: '#FFD700' }],
};
const jugadoresData = {
  labels: mockStats.jugadores.map(j => j.name),
  datasets: [{ label: 'Puntos Jugadores', data: mockStats.jugadores.map(j => j.points), backgroundColor: '#1890FF' }],
};
const eventosData = {
  labels: mockStats.eventos.map(ev => ev.name),
  datasets: [{ label: 'Puntos Eventos', data: mockStats.eventos.map(ev => ev.points), backgroundColor: '#FF4D4F' }],
};

function StatsPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Estadísticas Generales</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323', marginBottom: 32 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Bar data={equiposData} />
          </Col>
          <Col span={8}>
            <Bar data={jugadoresData} />
          </Col>
          <Col span={8}>
            <Bar data={eventosData} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default StatsPage;
