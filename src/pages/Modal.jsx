// ...existing code...
import React from 'react';
import Button from '../components/Button';

const gold = '#FFD700';
const black = '#222';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)', opacity: open ? 1 : 0 }}>
      <div style={{ background: gold, color: black, borderRadius: 16, boxShadow: '0 2px 12px #0006', padding: 32, minWidth: 320, maxWidth: 480, transform: open ? 'scale(1)' : 'scale(0.95)', transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <Button onClick={onClose} style={{ background: black, color: gold, border: `2px solid ${gold}`, borderRadius: 8, padding: '6px 12px', fontWeight: 'bold' }}>Cerrar</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
// ...existing code...
