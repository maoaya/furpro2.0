import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

const gold = '#FFD700';
const black = '#222';

export default function RecuperarPassword() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    const res = await resetPassword(email);
    if (res?.error) setMsg('Error: ' + res.error);
    else setMsg('Si el email existe, recibirás instrucciones para restablecer tu contraseña.');
    setSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', minWidth: 320, textAlign: 'center' }}>
        <img src="/images/futpro-logo.svg" alt="FutPro Logo" style={{ width: 80, height: 80, borderRadius: 12, marginBottom: 24 }} />
        <h1>Recuperar contraseña</h1>
        <form onSubmit={handleRecuperar}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          <button type="submit" disabled={loading || submitting || !email} style={{ width: '100%', background: black, color: gold, border: 'none', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
            Recuperar
          </button>
        </form>
        {msg && <div style={{ color: msg.startsWith('Error') ? 'red' : 'green', marginTop: 12 }}>{msg}</div>}
        <a href="/" style={{ color: black, textDecoration: 'underline', display: 'block', marginTop: 16 }}>Volver a inicio</a>
      </div>
    </div>
  );
}
