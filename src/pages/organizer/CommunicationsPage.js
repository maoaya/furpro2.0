import React from 'react';
import OrganizerLayout from './OrganizerLayout';

export default function CommunicationsPage() {
  return (
    <OrganizerLayout title="Comunicaciones">
      {/* Enviar notificaciones y anuncios */}
      <button>Enviar Notificación</button>
      <button>Publicar Anuncio</button>
    </OrganizerLayout>
  );
}
