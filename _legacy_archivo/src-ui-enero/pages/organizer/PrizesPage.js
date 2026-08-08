import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function PrizesPage() {
  return (
    <OrganizerLayout title="Gestión de Premios">
      {/* Definir y registrar premios */}
      <form>
        <label>Premio:</label>
        <input type="text" name="prize" />
        <button type="submit">Registrar Premio</button>
      </form>
    </OrganizerLayout>
  );
}
