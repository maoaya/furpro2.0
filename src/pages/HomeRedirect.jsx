import React, { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    try {
      // Redirige a la página estática optimizada tipo Instagram
      window.location.replace('/homepage-instagram.html');
    } catch (_) {
      window.location.href = '/homepage-instagram.html';
    }
  }, []);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' }}>
      Redirigiendo a tu inicio...
    </div>
  );
}
