import React from 'react';
import { Outlet } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';

export default function TeamsPage() {
  return (
    <OrganizerLayout title="Gestión de Equipos">
      <Outlet />
    </OrganizerLayout>
  );
}
