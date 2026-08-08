import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import MatchList from '../components/MatchList';

const mockMatches = [
  { id: 1, date: '2025-08-20', teamA: 'Equipo A', teamB: 'Equipo B', status: 'Pendiente' },
  { id: 2, date: '2025-08-22', teamA: 'Equipo C', teamB: 'Equipo D', status: 'Finalizado' },
];

function MatchManagementPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Aquí iría la llamada real a la API
    setMatches(mockMatches);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 32 }}>
      <Card title="Gestión de Partidos" bordered={false} style={{ boxShadow: '0 2px 8px #ccc', borderRadius: 16 }}>
        <MatchList matches={matches} />
      </Card>
    </div>
  );
}

export default MatchManagementPage;
