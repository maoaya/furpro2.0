import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function InviteTeamPage() {
  return (
    <OrganizerLayout title="Invitar Equipos">
      {/* Formulario para invitar equipos */}
      <form>
        <label>Nombre del equipo:</label>
        <input type="text" name="teamName" />
        <button type="submit">Invitar</button>
      </form>
    </OrganizerLayout>
  );
}
