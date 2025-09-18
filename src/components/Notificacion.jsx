import React from 'react';

export default function Notificacion({ mensaje, tipo='info' }) {
  const color = tipo === 'error' ? '#f44336' : tipo === 'success' ? '#4caf50' : '#2196f3';
  return (
    <div style={{background:color,color:'#fff',padding:12,borderRadius:6,margin:8}}>
      {mensaje}
    </div>
  );
}
