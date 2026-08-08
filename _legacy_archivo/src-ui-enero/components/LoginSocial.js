import React from 'react';
import { supabase } from '../supabaseClient';

export default function LoginSocial() {
  const handleLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) alert('Error al iniciar sesión: ' + error.message);
    // El flujo de login social redirige automáticamente
  };
  return (
    <div style={{padding:24, background:'#181818', color:'#FFD700', borderRadius:16, boxShadow:'0 2px 12px #FFD70044', maxWidth:400, margin:'auto'}}>
      <h2 style={{fontWeight:'bold', fontSize:28, marginBottom:24}}>Login Social</h2>
      <button onClick={() => handleLogin('google')} style={{ background:'#FFD700', color:'#181818', border:'none', borderRadius:8, padding:'12px 32px', fontWeight:'bold', fontSize:18, boxShadow:'0 2px 8px #FFD70088', marginBottom:16, cursor:'pointer' }}>Iniciar sesión con Google</button>
      <button onClick={() => handleLogin('github')} style={{ background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'12px 32px', fontWeight:'bold', fontSize:18, marginBottom:16, cursor:'pointer' }}>Iniciar sesión con GitHub</button>
      <button onClick={() => handleLogin('facebook')} style={{ background:'#232323', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8, padding:'12px 32px', fontWeight:'bold', fontSize:18, marginBottom:16, cursor:'pointer' }}>Iniciar sesión con Facebook</button>
      {/* Puedes agregar más proveedores si lo necesitas */}
    </div>
  );
}
