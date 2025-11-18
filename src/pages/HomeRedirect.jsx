import React, { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    // Redirigir a la página principal homepage-instagram.html
    window.location.href = '/homepage-instagram.html';
  }, []);

  return null; // No renderizar nada mientras redirige
}