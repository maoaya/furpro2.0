import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';

const gold = '#FFD700';

export default function RegistroNuevo() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('infantil_femenina');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(true);

  const navigate = useNavigate();
  const config = getConfig();

  const goHome = () => {
    try { navigate('/homepage-instagram.html'); } catch (_) { window.location.href = '/homepage-instagram.html'; }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data?.session?.user) goHome(); });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setSuccess('Inicio de sesión exitoso. Redirigiendo...'); setLoading(false); setTimeout(goHome, 600); }
    });
    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  const handleLoginSocial = async (provider) => {
    try {
      setLoading(true); setError(null); setSuccess(null);
      await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: config.oauthCallbackUrl } });
    } catch (e) { setLoading(false); setError(`Error con ${provider}: ${e.message}`); }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError(null); setSuccess(null);
      if (isRegister) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        try {
          const draft = { email, categoria, creadaEn: new Date().toISOString(), estado: 'pendiente_confirmacion' };
          localStorage.setItem('draft_carfutpro', JSON.stringify(draft));
          try {
            const { database } = await import('../config/firebase.js');
            const { ref, set } = await import('firebase/database');
            const uid = signUpData?.user?.id || 'pending';
            await set(ref(database, `autosave/carfutpro/${uid}`), draft);
          } catch (_) {}
        } catch (aux) { console.warn('Autosave inicial falló (no crítico):', aux); }
        setSuccess('Registro iniciado. Revisa tu correo para confirmar y se creó un borrador de tu CarFutPro.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        try {
          const { data: sessionRes } = await supabase.auth.getSession();
          const userId = sessionRes?.session?.user?.id;
          if (userId) {
            const draftRaw = localStorage.getItem('draft_carfutpro');
            const draft = draftRaw ? JSON.parse(draftRaw) : null;
            const categoriaFinal = draft?.categoria || categoria;
            try {
              const { supabase: sb } = await import('../supabaseClient.js');
              const { data, error } = await sb
                .from('carfutpro')
                .insert([{ user_id: userId, categoria: categoriaFinal, creada_en: new Date().toISOString(), estado: 'activa' }])
                .select()
                .single();
              if (error) throw error;
              try {
                const { database } = await import('../config/firebase.js');
                const { ref, set } = await import('firebase/database');
                await set(ref(database, `carfutpro/${userId}`), data);
                await set(ref(database, `autosave/carfutpro/${userId}`), null);
              } catch (_) {}
            } catch (eCreate) { console.warn('Creación de CarFutPro en Supabase falló (continuando):', eCreate.message); }
          }
        } catch (aux) { console.warn('No se pudo completar creación inicial de CarFutPro:', aux); }
        setSuccess('Ingreso exitoso. Redirigiendo...');
        setTimeout(goHome, 600);
      }
    } catch (e) { setError(e.message || 'Ocurrió un error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20, boxShadow: '0 10px 30px #000a' }}>
        <h1 style={{ color: gold, margin: 0, marginBottom: 8, textAlign: 'center' }}>FutPro</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</p>

        {error && (<div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{error}</div>)}
        {success && (<div style={{ background: '#0e3323', color: '#9ff2c3', border: '1px solid #27d17c', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{success}</div>)}

        <div style={{ display: 'grid', gap: 10 }}>
          <button onClick={() => handleLoginSocial('google')} disabled={loading} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>Continuar con Google</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#333' }} />
          <span style={{ color: '#999', fontSize: 12 }}>o con email</span>
          <div style={{ flex: 1, height: 1, background: '#333' }} />
        </div>

        <form onSubmit={handleSubmitEmail} style={{ display: 'grid', gap: 10 }}>
          <input type="email" required placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}/>
          <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}/>
          {isRegister && (
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }}>
              <option value="infantil_femenina">Infantil Femenina</option>
              <option value="infantil_masculina">Infantil Masculina</option>
              <option value="femenina">Femenina</option>
              <option value="masculina">Masculina</option>
            </select>
          )}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: isRegister ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#111', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Procesando...' : (isRegister ? 'Crear cuenta' : 'Ingresar')}</button>
        </form>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', color: gold, border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}
