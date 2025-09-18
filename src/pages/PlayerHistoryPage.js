import React from 'react';
import { Card, Row, Col } from 'antd';
import { Line } from 'react-chartjs-2';

const mockMatches = [
  { date: '2025-08-01', goals: 2 },
  { date: '2025-08-05', goals: 1 },
  { date: '2025-08-10', goals: 3 },
  { date: '2025-08-15', goals: 0 },
];

const chartData = {
  labels: mockMatches.map(m => m.date),
  datasets: [
    {
      label: 'Goles por partido',
      data: mockMatches.map(m => m.goals),
      fill: false,
      backgroundColor: '#FFD700',
      borderColor: '#1890FF',
      tension: 0.3,
    },
  ],
};

function PlayerHistoryPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Historial de Partidos del Jugador</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323', marginBottom: 32 }}>
        <Row gutter={24}>
          <Col span={14}>
            <p style={{ fontSize: 18 }}>Aquí se mostrarán los partidos jugados por el jugador, con fechas y resultados.</p>
          </Col>
          <Col span={10}>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default PlayerHistoryPage;
