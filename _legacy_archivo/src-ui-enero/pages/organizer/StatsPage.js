import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function StatsPage() {
  return (
    <OrganizerLayout title="Estadísticas del Torneo">
      {/* Estadísticas y exportación */}
      <button>Exportar PDF</button>
      <button>Exportar Excel</button>
      <ul>
        <li>Goles: 12</li>
        <li>Tarjetas: 3</li>
        <li>MVP: FutPro FC</li>
      </ul>
    </OrganizerLayout>
  );
}
