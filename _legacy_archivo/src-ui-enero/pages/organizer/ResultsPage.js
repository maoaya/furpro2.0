import React, { useEffect, useState } from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Simulación: cargar resultados automáticos del día
    setResults([
      { match: 'FutPro FC vs Los Campeones', score: '2-1', date: '15/08/2025' },
      { match: 'Estrellas vs Titanes', score: '0-0', date: '15/08/2025' }
    ]);
  }, []);

  return (
    <OrganizerLayout title="Resultados del Día">
      <ul>
        {results.map((r, i) => (
          <li key={i}>{r.match} - {r.score} ({r.date})</li>
        ))}
      </ul>
    </OrganizerLayout>
  );
}
