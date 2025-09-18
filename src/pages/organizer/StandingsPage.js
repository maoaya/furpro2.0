import React, { useState } from 'react';
import OrganizerLayout from './OrganizerLayout';

// Simulación de datos reales (debería venir del backend)
const initialTeams = [
  { id: 1, name: 'FutPro FC', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 2, dg: 3 },
  { id: 2, name: 'Los Campeones', pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 3, dg: 0 },
  { id: 3, name: 'Titanes', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 4, dg: -3 }
];

function calculatePoints(team) {
  return team.pg * 3 + team.pe;
}

export default function StandingsPage() {
  const [teams, setTeams] = useState(initialTeams);

  // Ordenar por puntos, diferencia de goles, goles a favor
  const sortedTeams = [...teams].sort((a, b) => {
    const pa = calculatePoints(a);
    const pb = calculatePoints(b);
    if (pb !== pa) return pb - pa;
    if (b.dg !== a.dg) return b.dg - a.dg;
    return b.gf - a.gf;
  });

  // Eliminar equipo
  const handleDelete = (id) => {
    setTeams(teams.filter(t => t.id !== id));
    // Aquí deberías llamar al backend DELETE /api/teams/:id
  };

  return (
    <OrganizerLayout title="Tabla de Posiciones (Estilo FIFA)">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, idx) => (
            <tr key={team.id}>
              <td>{idx + 1}</td>
              <td>{team.name}</td>
              <td>{team.pj}</td>
              <td>{team.pg}</td>
              <td>{team.pe}</td>
              <td>{team.pp}</td>
              <td>{team.gf}</td>
              <td>{team.gc}</td>
              <td>{team.dg}</td>
              <td>{calculatePoints(team)}</td>
              <td>
                <button onClick={() => handleDelete(team.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </OrganizerLayout>
  );
}
