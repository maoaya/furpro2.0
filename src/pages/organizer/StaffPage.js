import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function StaffPage() {
  return (
    <OrganizerLayout title="Gestión de Staff">
      {/* Invitar y asignar roles */}
      <button>Invitar Organizador</button>
      <button>Asignar Rol</button>
    </OrganizerLayout>
  );
}
