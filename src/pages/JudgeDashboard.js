import React from 'react';
import { Card, Row, Col } from 'antd';
import { Bar } from 'react-chartjs-2';

const mockArbitraje = [
  { month: 'Enero', matches: 4 },
  { month: 'Febrero', matches: 6 },
  { month: 'Marzo', matches: 3 },
  { month: 'Abril', matches: 5 },
];
const chartData = {
  labels: mockArbitraje.map(m => m.month),
  datasets: [
    {
      label: 'Partidos arbitrados',
      data: mockArbitraje.map(m => m.matches),
      backgroundColor: '#FFD700',
    },
  ],
};

function JudgeDashboard() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 28 }}>Panel del Juez</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323' }}>
        <Row gutter={24}>
          <Col span={14}>
            <p style={{ fontSize: 18, color: '#FFD700' }}>Asignación de partidos, historial de arbitrajes y estadísticas personales.</p>
          </Col>
          <Col span={10}>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top', labels: { color: '#FFD700' } } } }} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default JudgeDashboard;
