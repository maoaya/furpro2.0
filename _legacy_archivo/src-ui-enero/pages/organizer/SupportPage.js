import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function SupportPage() {
  return (
    <OrganizerLayout title="Soporte y Reclamos">
      {/* Consultas y reclamos */}
      <button>Ver Consultas</button>
      <button>Gestionar Reclamos</button>
    </OrganizerLayout>
  );
}
