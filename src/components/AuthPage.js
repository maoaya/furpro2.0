
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase.js';


export default function AuthPage() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 AuthPage - Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        setResult('¡Inicio de sesión exitoso! Redirigiendo...');
        setToken(session.access_token);

        // Redirigir después de un breve delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else if (event === 'SIGNED_OUT') {
        setResult('Sesión cerrada');
        setToken('');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  const handleRegister = async () => {
    setResult('Procesando registro...');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });
    const data = await res.json();
    if (data.user) {
      setResult('¡Registro exitoso! Redirigiendo...');
      // Redirigir después de registro exitoso
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setResult(data.error || 'Error en el registro');
    }
  };


  const handleLogin = async () => {
    setResult('Iniciando sesión...');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setResult('¡Login exitoso! Redirigiendo...');
      setToken(data.token);
      localStorage.setItem('token', data.token);
      // Redirigir después de login exitoso
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setResult(data.error || 'Error en el login');
    }
  };

  // Login social con Google
  const handleLoginGoogle = async () => {
    setResult('Conectando con Google...');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setResult('Error Google: ' + error.message);
      } else {
        setResult('Redirigiendo a Google...');
        // La redirección se maneja automáticamente por Supabase
      }
    } catch (e) {
      setResult('Error Google: ' + e.message);
    }
  };

  // Login social con Facebook
  const handleLoginFacebook = async () => {
    setResult('Conectando con Facebook...');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setResult('Error Facebook: ' + error.message);
      } else {
        setResult('Redirigiendo a Facebook...');
        // La redirección se maneja automáticamente por Supabase
      }
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
