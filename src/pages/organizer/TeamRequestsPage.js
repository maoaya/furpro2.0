import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function TeamRequestsPage() {
  return (
    <OrganizerLayout title="Solicitudes de Inscripción">
      {/* Listado de solicitudes para aprobar/rechazar */}
      <ul>
        <li>Equipo FutPro FC <button>Aprobar</button> <button>Rechazar</button></li>
        {/* ...más equipos */}
      </ul>
    </OrganizerLayout>
  );
}
