import React, { useEffect } from 'react';

export default function Notificacion({ mensaje, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;
  return (
    <div style={{position:'fixed',top:24,right:24,zIndex:9999,padding:16,background:'#1877f2',color:'#fff',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>
      <strong>Notificación</strong>
      <div>{mensaje}</div>
    </div>
  );
}
