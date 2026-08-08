import React from 'react';
import { Card, Row, Col } from 'antd';
import { Doughnut } from 'react-chartjs-2';

const mockStats = {
  activeTournaments: 5,
  teams: 32,
  participants: 480,
};
const doughnutData = {
  labels: ['Torneos activos', 'Equipos inscritos', 'Participantes'],
  datasets: [
    {
      data: [mockStats.activeTournaments, mockStats.teams, mockStats.participants],
      backgroundColor: ['#FFD700', '#1890FF', '#FF4D4F'],
    },
  ],
};
function OrganizerDashboard() {
  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 32 }}>
      <Card title="Panel del Organizador" bordered={false} style={{ boxShadow: '0 2px 8px #ccc', borderRadius: 16 }}>
        <Row gutter={24}>
          <Col span={14}>
            <p>Gestión de torneos, equipos, jueces, pagos y moderación de contenido.</p>
          </Col>
          <Col span={10}>
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default OrganizerDashboard;
