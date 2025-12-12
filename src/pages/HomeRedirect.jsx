import React, { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    // Redirigir a la página principal SPA /home-instagram
    window.location.href = '/home-instagram';
  }, []);

  return null; // No renderizar nada mientras redirige
}