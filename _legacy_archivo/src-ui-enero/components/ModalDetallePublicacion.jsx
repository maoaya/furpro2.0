import React from 'react';
import { Button } from './Button';

export default function ModalDetallePublicacion({ detalle, onClose }) {
  if (!detalle) return null;
  return (
    <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
      <h3>Detalle de Publicación</h3>
      <div><strong>Título:</strong> {detalle.titulo}</div>
      <div><strong>Descripción:</strong> {detalle.descripcion}</div>
      <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12 }} onClick={onClose}>Cerrar</Button>
    </div>
  );
}
