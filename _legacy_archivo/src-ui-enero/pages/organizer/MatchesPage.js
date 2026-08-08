import React, { useState } from 'react';
import OrganizerLayout from './OrganizerLayout';

const initialMatches = [
  { id: 1, team1: 'FutPro FC', team2: 'Los Campeones', date: '15/08/2025 18:00', referee: null },
  { id: 2, team1: 'Titanes', team2: 'Estrellas', date: '15/08/2025 20:00', referee: 'Juez 1' }
];

const referees = ['Juez 1', 'Juez 2', 'Juez 3'];

export default function MatchesPage() {
  const [matches, setMatches] = useState(initialMatches);

  // Eliminar partido
  const handleDeleteMatch = (id) => {
    setMatches(matches.filter(m => m.id !== id));
    // Aquí deberías llamar al backend DELETE /api/matches/:id
  };

  // Asignar juez
  const handleAssignReferee = (matchId, referee) => {
    setMatches(matches.map(m => m.id === matchId ? { ...m, referee } : m));
    // Aquí deberías llamar al backend POST /api/matches/:id/assign-referee
  };

  return (
    <OrganizerLayout title="Gestión de Partidos">
      <button>Programar Partido</button>
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            {match.team1} vs {match.team2} - {match.date} <br />
            Juez: {match.referee || 'Sin asignar'}
            <select
              value={match.referee || ''}
              onChange={e => handleAssignReferee(match.id, e.target.value)}
            >
              <option value="">Asignar juez</option>
              {referees.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button onClick={() => handleDeleteMatch(match.id)}>Eliminar Partido</button>
          </li>
        ))}
      </ul>
    </OrganizerLayout>
  );
}
