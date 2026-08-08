import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function TeamsListPage() {
  return (
    <OrganizerLayout title="Equipos Inscritos">
      {/* Listado de equipos inscritos */}
      <ul>
        <li>FutPro FC</li>
        <li>Los Campeones</li>
        {/* ...más equipos */}
      </ul>
    </OrganizerLayout>
  );
}
