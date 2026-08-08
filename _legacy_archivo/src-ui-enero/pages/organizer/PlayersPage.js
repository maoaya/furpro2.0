import React, { useEffect, useState } from 'react';
import OrganizerLayout from './OrganizerLayout';
import axios from 'axios';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    if (selectedTeam) {
      axios.get(`/api/teams/${selectedTeam}/players`).then(res => setPlayers(res.data));
    }
  }, [selectedTeam]);

  const handleDelete = async (id) => {
    await axios.delete(`/api/players/${id}`);
    setPlayers(players.filter(p => p.id !== id));
  };

  return (
    <OrganizerLayout title="Gestión de Jugadores">
      <label>Selecciona equipo:</label>
      <select onChange={e => setSelectedTeam(e.target.value)}>
        <option value="">-- Selecciona --</option>
        <option value="1">FutPro FC</option>
        <option value="2">Los Campeones</option>
        {/* ...más equipos */}
      </select>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name} ({player.position})
            <button onClick={() => handleDelete(player.id)}>Eliminar</button>
            {player.injured && <span style={{color:'red'}}>Lesionado</span>}
          </li>
        ))}
      </ul>
    </OrganizerLayout>
  );
}
