import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import RankingTable from '../components/RankingTable';

const mockPlayers = [
  { id: 1, position: 1, name: 'Jugador X', type: 'Delantero', country: 'España', points: 50 },
  { id: 2, position: 2, name: 'Jugador Y', type: 'Portero', country: 'Argentina', points: 48 },
  { id: 3, position: 3, name: 'Jugador Z', type: 'Defensa', country: 'Brasil', points: 45 },
];

const mockTeams = [
  { id: 1, position: 1, name: 'Equipo A', type: 'Senior', country: 'España', points: 60 },
  { id: 2, position: 2, name: 'Equipo B', type: 'Juvenil', country: 'Argentina', points: 55 },
  { id: 3, position: 3, name: 'Equipo C', type: 'Senior', country: 'Brasil', points: 52 },
];


function AllRankingsPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [playerFilters] = useState({ type: '', country: '', position: '' });
  const [teamFilters] = useState({ type: '', country: '', position: '' });

  useEffect(() => {
    setPlayers(mockPlayers);
    setTeams(mockTeams);
  }, []);

  // Filtrar jugadores
  const filteredPlayers = players.filter(p =>
    (!playerFilters.type || p.type === playerFilters.type) &&
    (!playerFilters.country || p.country === playerFilters.country) &&
    (!playerFilters.position || p.position === Number(playerFilters.position))
  );

  // Filtrar equipos
  const filteredTeams = teams.filter(t =>
    (!teamFilters.type || t.type === teamFilters.type) &&
    (!teamFilters.country || t.country === teamFilters.country) &&
    (!teamFilters.position || t.position === Number(teamFilters.position))
  );

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '1200px', margin: 'auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Ranking General</h1>
      <Card style={{ background: '#232323', borderRadius: 12, boxShadow: '0 2px 8px #FFD70022', marginBottom: 32 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Jugadores" key="1">
            <RankingTable data={filteredPlayers} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Equipos" key="2">
            <RankingTable data={filteredTeams} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default AllRankingsPage;
