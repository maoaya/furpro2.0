import React, { useState } from 'react';
import OrganizerLayout from './OrganizerLayout';
import axios from 'axios';

export default function DrawMatchesPage() {
  const [drawResult, setDrawResult] = useState([]);

  const handleDraw = async () => {
    const res = await axios.post('/api/matches/draw');
    setDrawResult(res.data);
  };

  return (
    <OrganizerLayout title="Sorteo de Partidos">
      <button onClick={handleDraw}>Realizar Sorteo</button>
      <ul>
        {drawResult.map((match, i) => (
          <li key={i}>{match.team1} vs {match.team2} - {match.date}</li>
        ))}
      </ul>
    </OrganizerLayout>
  );
}
