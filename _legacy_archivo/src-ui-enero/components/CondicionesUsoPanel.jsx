import React, { useState } from 'react';

const CondicionesUsoPanel = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div style={{ background: '#222', color: '#FFD700', padding: '1.5rem', borderRadius: '12px', maxWidth: '500px', margin: '2rem auto', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Condiciones de Uso</h2>
      <div style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.95rem', marginBottom: '1rem', background: '#111', padding: '1rem', borderRadius: '8px' }}>
        <p><strong>Última actualización:</strong> 11 de agosto de 2025</p>
        <p>Al crear una cuenta, usted acepta nuestros <strong>Términos Legales</strong> y <strong>Condiciones de Uso</strong>. Si no está de acuerdo, no podrá avanzar.</p>
        <p>Para cualquier consulta, contáctenos en <a href="mailto:xpro2025@gmail.com" style={{ color: '#FFD700', textDecoration: 'underline' }}>xpro2025@gmail.com</a>.</p>
        <ul style={{ marginLeft: '1rem' }}>
          <li>Debe ser mayor de edad en su jurisdicción.</li>
          <li>No se permite el uso automatizado ni actividades prohibidas.</li>
          <li>El acceso y uso está sujeto a nuestras políticas de privacidad y seguridad.</li>
        </ul>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={e => setAccepted(e.target.checked)}
          style={{ marginRight: '0.5rem' }}
        />
        Acepto los términos y condiciones
      </label>
      <button
        style={{
          background: accepted ? '#FFD700' : '#888',
          color: '#111',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1.5rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: accepted ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s'
        }}
        disabled={!accepted}
        onClick={() => accepted && onAccept && onAccept()}
      >
        Continuar
      </button>
    </div>
  );
};

export default CondicionesUsoPanel;
