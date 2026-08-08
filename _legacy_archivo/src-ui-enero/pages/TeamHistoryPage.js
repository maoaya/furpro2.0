import React from 'react';
import { Card, Row, Col } from 'antd';
import { Bar } from 'react-chartjs-2';

const mockMatches = [
  { date: '2025-08-01', goals: 2, result: 'Victoria' },
  { date: '2025-08-05', goals: 1, result: 'Empate' },
  { date: '2025-08-10', goals: 0, result: 'Derrota' },
  { date: '2025-08-15', goals: 3, result: 'Victoria' },
];

const chartData = {
  labels: mockMatches.map(m => m.date),
  datasets: [
    {
      label: 'Goles por partido',
      data: mockMatches.map(m => m.goals),
      backgroundColor: '#FFD700',
    },
    {
      label: 'Victorias',
      data: mockMatches.map(m => m.result === 'Victoria' ? 1 : 0),
      backgroundColor: '#52c41a',
    },
    {
      label: 'Empates',
      data: mockMatches.map(m => m.result === 'Empate' ? 1 : 0),
      backgroundColor: '#1890FF',
    },
    {
      label: 'Derrotas',
      data: mockMatches.map(m => m.result === 'Derrota' ? 1 : 0),
      backgroundColor: '#FF4D4F',
    },
  ],
};

function TeamHistoryPage() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Historial de Partidos del Equipo</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323', marginBottom: 32 }}>
        <Row gutter={24}>
          <Col span={14}>
            <p style={{ fontSize: 18 }}>Aquí se mostrarán los partidos jugados por el equipo, con fechas y resultados.</p>
          </Col>
          <Col span={10}>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default TeamHistoryPage;
