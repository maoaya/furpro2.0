import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function PaymentsPage() {
  return (
    <OrganizerLayout title="Pagos e Inscripciones">
      {/* Validar pagos y ver reportes */}
      <button>Validar Pago</button>
      <button>Ver Reporte de Pagos</button>
    </OrganizerLayout>
  );
}
