import React from 'react';
import Button from './Button';

export default function IntegracionesAPI() {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Integraciones API</h2>
      {/* OpenAI, Twilio, Supabase, etc. */}
      <div style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022' }}>
        <ul style={{ fontSize: 18 }}>
          <li>OpenAI</li>
          <li>Twilio</li>
          <li>Supabase</li>
          <li>Google API</li>
        </ul>
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 16 }}>Configurar</button>
    <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginTop: 16, transition: 'background 0.3s, color 0.3s' }}>Configurar</Button>
      </div>
    </div>
  );
}
