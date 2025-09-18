import React from 'react';
import Button from '../components/Button';

export default function Comparativas() {
  return (
    <div style={{ transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)', opacity: 1 }}>
      <h2>Comparativas</h2>
      {/* Panel de comparación de equipos, jugadores, etc. */}
      <Button style={{ marginTop: 24 }}>Comparar</Button>
    </div>
  );
}
