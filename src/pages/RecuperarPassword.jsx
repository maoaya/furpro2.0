
import React, { useState } from 'react';
import { supabase } from '../config/supabase';


const gold = '#FFD700';
const black = '#222';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMsg('Error: ' + error.message);
    else setMsg('Si el email existe, recibirás instrucciones para restablecer tu contraseña.');
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', minWidth: 320, textAlign: 'center' }}>
        <img src="/logo192.png" alt="FutPro Logo" style={{ width: 80, marginBottom: 24 }} />
        <h1>Recuperar contraseña</h1>
        <form onSubmit={handleRecuperar}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          <button type="submit" disabled={loading || !email} style={{ width: '100%', background: black, color: gold, border: 'none', borderRadius: 8, padding: 12, fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
            Recuperar
          </button>
        </form>
        {msg && <div style={{ color: msg.startsWith('Error') ? 'red' : 'green', marginTop: 12 }}>{msg}</div>}
        <a href="/" style={{ color: black, textDecoration: 'underline', display: 'block', marginTop: 16 }}>Volver a inicio</a>
      </div>
    </div>
  );
}
