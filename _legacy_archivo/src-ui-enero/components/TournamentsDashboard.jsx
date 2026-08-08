import React, { useEffect, useState } from 'react';
import { dbOperations } from '../config/supabase';
import { Card, Select, Spin } from 'antd';
import { Doughnut } from 'react-chartjs-2';

const { Option } = Select;

const TournamentsDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setLoading(true);
    dbOperations.getTournaments({ status, type })
      .then(data => setTournaments(data))
      .finally(() => setLoading(false));
  }, [status, type]);

  // Datos para gráfico
  const statusCounts = ['active', 'finished'].map(s => tournaments.filter(t => t.status === s).length);
  const chartData = {
    labels: ['Activos', 'Finalizados'],
    datasets: [{
      data: statusCounts,
      backgroundColor: ['#52c41a', '#f5222d'],
    }],
  };

  return (
    <Card title="Panel de Torneos" style={{ margin: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Select placeholder="Filtrar por estado" style={{ width: 180, marginRight: 8 }} onChange={setStatus} allowClear>
          <Option value="active">Activo</Option>
          <Option value="finished">Finalizado</Option>
        </Select>
        <Select placeholder="Filtrar por tipo" style={{ width: 180 }} onChange={setType} allowClear>
          <Option value="elimination">Eliminación</Option>
          <Option value="league">Liga</Option>
        </Select>
      </div>
      <Doughnut data={chartData} />
      {loading && <Spin style={{ marginTop: 16 }} />}
    </Card>
  );
};

export default TournamentsDashboard;
