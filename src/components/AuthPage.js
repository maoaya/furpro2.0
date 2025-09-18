
import React, { useState } from 'react';
import { supabase } from '../config/supabase.js';


export default function AuthPage() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [token, setToken] = useState('');


  const handleRegister = async () => {
    setResult('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });
    const data = await res.json();
    if (data.user) setResult('Registro exitoso');
    else setResult(data.error || 'Error en el registro');
  };


  const handleLogin = async () => {
    setResult('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setResult('Login exitoso');
      setToken(data.token);
      localStorage.setItem('token', data.token);
      // window.location.href = '/'; // Redirigir si es necesario
    } else {
      setResult(data.error || 'Error en el login');
    }
  };

  // Login social con Google
  const handleLoginGoogle = async () => {
    setResult('');
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
      setResult('Login con Google iniciado');
    } catch (e) {
      setResult('Error Google: ' + e.message);
    }
  };

  // Login social con Facebook
  const handleLoginFacebook = async () => {
    setResult('');
    try {
      await supabase.auth.signInWithOAuth({ provider: 'facebook' });
      setResult('Login con Facebook iniciado');
    } catch (e) {
      setResult('Error Facebook: ' + e.message);
    }
  };

  return (
    <div>
      <h1>Autenticación</h1>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button onClick={handleRegister}>Registrar</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLoginGoogle}>Login con Google</button>
      <button onClick={handleLoginFacebook}>Login con Facebook</button>
      <div>{result}</div>
      {token && <div style={{ color: 'green' }}>Token guardado en localStorage</div>}
    </div>
  );
}
