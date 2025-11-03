import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1 style={{ color: '#FFD700', fontSize: 64, marginBottom: 12 }}>404</h1>
      <p style={{ color: '#bbb', fontSize: 20, marginBottom: 24 }}>Página no encontrada</p>
      <Link to="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Volver al inicio</Link>
    </div>
  );
}
