import React, { useState } from 'react';
import { Card, Slider, Row, Col } from 'antd';
import { Bar } from 'react-chartjs-2';
import RankingTable from '../components/RankingTable';

const mockData = [
  { id: 1, position: 1, name: 'Jugador X', type: 'Delantero', age: 15, points: 50 },
  { id: 2, position: 2, name: 'Jugador Y', type: 'Portero', age: 22, points: 48 },
  { id: 3, position: 3, name: 'Jugador Z', type: 'Defensa', age: 34, points: 45 },
  { id: 4, position: 4, name: 'Jugador W', type: 'Delantero', age: 60, points: 40 },
];

function AgeFilterRankingPage() {
  const [ageRange, setAgeRange] = useState([12, 65]);

  const filteredData = mockData.filter(j => j.age >= ageRange[0] && j.age <= ageRange[1]);

  // Lógica para gráfico de distribución de edades
  const ageGroups = ['12-18', '19-30', '31-45', '46-65'];
  const ageCounts = [
    filteredData.filter(j => j.age >= 12 && j.age <= 18).length,
    filteredData.filter(j => j.age >= 19 && j.age <= 30).length,
    filteredData.filter(j => j.age >= 31 && j.age <= 45).length,
    filteredData.filter(j => j.age >= 46 && j.age <= 65).length,
  ];
  const chartData = {
    labels: ageGroups,
    datasets: [
      {
        label: 'Cantidad de jugadores',
        data: ageCounts,
        backgroundColor: ['#FFD700', '#FFA500', '#FF4D4F', '#1890FF'],
      },
    ],
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto' }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Ranking por Edad</span>} bordered={false} style={{ background: '#232323', borderRadius: 12, boxShadow: '0 2px 8px #FFD70022', marginBottom: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <span>Filtrar por edad: </span>
          <Slider range min={12} max={65} value={ageRange} onChange={setAgeRange} style={{ width: 300 }} />
          <span>{ageRange[0]} - {ageRange[1]} años</span>
        </div>
        <Row gutter={24}>
          <Col span={14}>
            <RankingTable data={filteredData} />
          </Col>
          <Col span={10}>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default AgeFilterRankingPage;
