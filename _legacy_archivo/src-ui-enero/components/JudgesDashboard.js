import React, { useEffect, useState } from 'react';
import { dbOperations } from '../config/supabase';
import { Card, Select, Spin } from 'antd';
import { Line } from 'react-chartjs-2';

const { Option } = Select;

const JudgesDashboard = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [experience, setExperience] = useState('');

  useEffect(() => {
    setLoading(true);
    dbOperations.searchUsers('', { userType: 'judge' })
      .then(data => setJudges(data))
      .finally(() => setLoading(false));
  }, []);

  // Filtros
  const filteredJudges = judges.filter(judge => {
    return !experience || judge.stats?.experience === experience;
  });

  // Datos para gráfico
  const expLevels = [...new Set(judges.map(j => j.stats?.experience))];
  const expCounts = expLevels.map(exp => judges.filter(j => j.stats?.experience === exp).length);
  const chartData = {
    labels: expLevels,
    datasets: [{
      label: 'Jueces por experiencia',
      data: expCounts,
      borderColor: '#faad14',
      backgroundColor: 'rgba(250, 173, 20, 0.2)',
      fill: true,
    }],
  };

  return (
    <Card title="Panel de Jueces" style={{ margin: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Select placeholder="Filtrar por experiencia" style={{ width: 180 }} onChange={setExperience} allowClear>
          {expLevels.map(exp => <Option key={exp} value={exp}>{exp}</Option>)}
        </Select>
      </div>
      {loading ? <Spin /> : (
        <>
          <Line data={chartData} />
          <ul>
            {filteredJudges.map(judge => (
              <li key={judge.id}>{judge.name} - Experiencia: {judge.stats?.experience}</li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

export default JudgesDashboard;
