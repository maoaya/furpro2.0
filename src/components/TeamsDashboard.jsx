import React, { useEffect, useState } from 'react';
import { dbOperations } from '../config/supabase';
import { Card, Select, Spin } from 'antd';
import { Bar } from 'react-chartjs-2';

const { Option } = Select;

const TeamsDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setLoading(true);
    dbOperations.getTeamsByUser(/* userId dinámico o admin */)
      .then(data => setTeams(data))
      .finally(() => setLoading(false));
  }, []);

  // Filtros
  const filteredTeams = teams.filter(team => {
    return (!position || team.position === position) && (!type || team.type === type);
  });

  // Datos para gráfico
  const positions = [...new Set(teams.map(t => t.position))];
  const positionCounts = positions.map(pos => teams.filter(t => t.position === pos).length);
  const chartData = {
    labels: positions,
    datasets: [{
      label: 'Jugadores por posición',
      data: positionCounts,
      backgroundColor: 'rgba(24, 144, 255, 0.6)',
    }],
  };

  return (
    <Card title="Panel de Equipos" style={{ margin: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Select placeholder="Filtrar por posición" style={{ width: 180, marginRight: 8 }} onChange={setPosition} allowClear>
          {positions.map(pos => (
            <Option key={pos} value={pos}>{pos}</Option>
          ))}
        </Select>
        <Select placeholder="Filtrar por tipo" style={{ width: 180 }} onChange={setType} allowClear>
          <Option value="pro">Pro</Option>
          <Option value="amateur">Amateur</Option>
        </Select>
      </div>
      <Bar data={chartData} />
      {loading && <Spin style={{ marginTop: 16 }} />}
    </Card>
  );
};

export default TeamsDashboard;
