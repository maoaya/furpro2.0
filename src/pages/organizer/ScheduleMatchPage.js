import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function ScheduleMatchPage() {
  return (
    <OrganizerLayout title="Programar Partido">
      {/* Formulario para programar partido */}
      <form>
        <label>Equipo 1:</label>
        <input type="text" name="team1" />
        <label>Equipo 2:</label>
        <input type="text" name="team2" />
        <label>Fecha y hora:</label>
        <input type="datetime-local" name="date" />
        <button type="submit">Programar</button>
      </form>
    </OrganizerLayout>
  );
}
