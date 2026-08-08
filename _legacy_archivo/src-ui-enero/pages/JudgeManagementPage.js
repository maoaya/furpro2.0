import React, { useState } from 'react';
import { Card } from 'antd';
import JudgeList from '../components/JudgeList';
import JudgeAssignForm from '../components/JudgeAssignForm';

const initialJudges = [
  { id: 1, name: 'Juez 1', experience: 5 },
  { id: 2, name: 'Juez 2', experience: 3 },
];

function JudgeManagementPage() {
  const [judges] = useState(initialJudges);

  const handleAssign = (id) => {
    // Aquí iría la lógica real de asignación
    alert(`Juez asignado: ${id}`);
  };

  const handleAssignForm = (values) => {
    // Aquí iría la lógica real de agregar juez
    alert(`Nuevo juez: ${values.judge}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 32 }}>
      <Card title="Gestión de Jueces" bordered={false} style={{ boxShadow: '0 2px 8px #ccc', borderRadius: 16 }}>
        <JudgeAssignForm onSubmit={handleAssignForm} />
        <JudgeList judges={judges} onAssign={handleAssign} />
      </Card>
    </div>
  );
}

export default JudgeManagementPage;
