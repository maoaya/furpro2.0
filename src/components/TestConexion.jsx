import React from 'react';

const TestConexion = () => {
  return (
    <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px', margin: '1rem 0' }}>
      <h3>Variables de entorno (.env)</h3>
      <ul style={{ fontFamily: 'monospace', fontSize: '0.95em' }}>
        <li>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'NO DEFINIDA (agrega VITE_SUPABASE_URL en .env)'}</li>
        <li>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NO DEFINIDA (agrega VITE_SUPABASE_ANON_KEY en .env)'}</li>
        <li>NODE_ENV: {import.meta.env.MODE || 'NO DEFINIDA'}</li>
        {/* Puedes agregar más variables aquí si lo deseas */}
      </ul>
      <p style={{ color: '#888', fontSize: '0.9em' }}>
        Si alguna variable aparece como &quot;NO DEFINIDA&quot;, revisa tu archivo .env y asegúrate de reiniciar el servidor de desarrollo tras cualquier cambio.
      </p>
    </div>
  );
};

export default TestConexion;
