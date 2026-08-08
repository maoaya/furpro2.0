import React, { useState } from 'react';
import { Card } from 'antd';
import TeamConvocationForm from '../components/TeamConvocationForm';
import TeamList from '../components/TeamList';

const initialTeams = [
  { id: 1, name: 'Equipo A', category: 'Senior' },
  { id: 2, name: 'Equipo B', category: 'Juvenil' },
];

function TeamManagementPage() {
  const [teams] = useState(initialTeams);

  const handleConvocation = (values) => {
    // Aquí iría la lógica real de convocatoria
    alert(`Convocado: ${values.player}`);
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48 }}>
      <Card title={<span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24 }}>Gestión de Equipos</span>} bordered={false} style={{ boxShadow: '0 2px 12px #FFD70044', borderRadius: 18, background: '#232323', marginBottom: 32 }}>
        <TeamConvocationForm onSubmit={handleConvocation} />
        <TeamList teams={teams} />
      </Card>
    </div>
  );
}

export default TeamManagementPage;
