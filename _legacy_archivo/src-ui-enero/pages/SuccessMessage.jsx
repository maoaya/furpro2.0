// ...existing code...
import React from 'react';

export default function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: '#232323', color: '#52c41a', borderRadius: 8, padding: 16, margin: '24px auto', maxWidth: 500, fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022', textAlign: 'center' }}>
      {message}
    </div>
  );
}
// ...existing code...
