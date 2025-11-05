import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';

const gold = '#FFD700';

const POSICIONES = [
  'Portero','Defensa Central','Lateral Derecho','Lateral Izquierdo',
  'Mediocampista Defensivo','Mediocampista Central','Mediocampista Ofensivo',
  'Extremo Derecho','Extremo Izquierdo','Delantero Centro','Flexible'
];
const NIVELES = ['Principiante','Intermedio','Avanzado','Élite'];

export default function RegistroPerfil() {
  const navigate = useNavigate();
  const location = useLocation();

  const draftInicial = useMemo(() => {
    try {
      const fromState = location.state?.draft || {};
      const local = localStorage.getItem('draft_carfutpro');
      const parsed = local ? JSON.parse(local) : {};
      return { categoria: 'infantil_femenina', ...parsed, ...fromState };
    } catch {
      return { categoria: 'infantil_femenina' };
    }
  }, [location.state]);

  const [nombre, setNombre] = useState(draftInicial.nombre || '');
  const [ciudad, setCiudad] = useState(draftInicial.ciudad || '');
  const [pais, setPais] = useState(draftInicial.pais || '');
  const [posicion, setPosicion] = useState(draftInicial.posicion_favorita || 'Flexible');
  const [nivel, setNivel] = useState(draftInicial.nivel_habilidad || 'Principiante');
  const [equipo, setEquipo] = useState(draftInicial.equipo || '');
  const [avatar, setAvatar] = useState(draftInicial.avatar_url || '');
  const [categoria] = useState(draftInicial.categoria || 'infantil_femenina');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Autosave local y Firebase
  useEffect(() => {
    const draft = {
      ...(draftInicial || {}),
      nombre, ciudad, pais,
      posicion_favorita: posicion,
      nivel_habilidad: nivel,
      equipo, avatar_url: avatar,
      categoria,
      updatedAt: new Date().toISOString(),
      estado: 'borrador_perfil'
    };
    try {
      localStorage.setItem('draft_carfutpro', JSON.stringify(draft));
    } catch {}
    // Esfuerzo best-effort a Firebase
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const uid = data?.session?.user?.id || 'pending';
        const { database } = await import('../config/firebase.js');
        const { ref, set } = await import('firebase/database');
        await set(ref(database, `autosave/carfutpro/${uid}`), draft);
      } catch {}
    })();
  }, [nombre, ciudad, pais, posicion, nivel, equipo, avatar, categoria]);

  const continuar = async () => {
    setMsg('');
    setLoading(true);
    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const userId = sessionRes?.session?.user?.id;
      if (!userId) {
        setMsg('Tu cuenta está creada. Inicia sesión para finalizar y crear tu perfil.');
        // Guardar intención de post-login
        try { localStorage.setItem('post_auth_target', '/perfil-card'); } catch {}
        setLoading(false);
        return navigate('/login');
      }

      // Crear/actualizar registro en Supabase
      const payload = {
        user_id: userId,
        categoria,
        nombre,
        ciudad,
        pais,
        posicion_favorita: posicion,
        nivel_habilidad: nivel,
        equipo,
        avatar_url: avatar,
        creada_en: new Date().toISOString(),
        estado: 'activa'
      };

      const { data, error } = await supabase
        .from('carfutpro')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) throw error;

      // Guardar datos para la Card
      const cardData = {
        id: data.id,
        categoria: data.categoria,
        nombre: data.nombre,
        ciudad: data.ciudad,
        pais: data.pais,
        posicion_favorita: data.posicion_favorita,
        nivel_habilidad: data.nivel_habilidad,
        puntaje: data.puntaje || 50,
        equipo: data.equipo || '—',
        fecha_registro: new Date().toISOString(),
        esPrimeraCard: true,
        avatar_url: data.avatar_url || ''
      };
      try {
        localStorage.setItem('futpro_user_card_data', JSON.stringify(cardData));
        localStorage.setItem('show_first_card', 'true');
      } catch {}

      // Limpiar autosave en Firebase
      try {
        const { database } = await import('../config/firebase.js');
        const { ref, set } = await import('firebase/database');
        await set(ref(database, `carfutpro/${userId}`), data);
        await set(ref(database, `autosave/carfutpro/${userId}`), null);
      } catch {}

      navigate('/perfil-card', { state: { cardData } });
    } catch (e) {
      setMsg(e.message || 'No se pudo guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 560, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20 }}>
        <h1 style={{ color: gold, margin: 0, marginBottom: 8, textAlign: 'center' }}>Completa tu Perfil</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>Esta información alimentará tu perfil y tu card.</p>

        {msg && (
          <div style={{ background: '#3b2d0d', color: '#ffd18b', border: '1px solid #d1a938', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{msg}</div>
        )}

        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ color: '#bbb' }}>Nombre</label>
            <input value={nombre} onChange={(e)=>setNombre(e.target.value)} placeholder="Tu nombre" style={{ padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }} />
          </div>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr', gapRow: 10, gapColumn: 10 }}>
            <div>
              <label style={{ color: '#bbb' }}>Ciudad</label>
              <input value={ciudad} onChange={(e)=>setCiudad(e.target.value)} placeholder="Ciudad" style={{ width:'100%', padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }} />
            </div>
            <div>
              <label style={{ color: '#bbb' }}>País</label>
              <input value={pais} onChange={(e)=>setPais(e.target.value)} placeholder="País" style={{ width:'100%', padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }} />
            </div>
          </div>
          <div style={{ display:'grid', gap: 8, gridTemplateColumns: '1fr 1fr', gapRow: 10, gapColumn: 10 }}>
            <div>
              <label style={{ color: '#bbb' }}>Posición favorita</label>
              <select value={posicion} onChange={(e)=>setPosicion(e.target.value)} style={{ width:'100%', padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }}>
                {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#bbb' }}>Nivel de habilidad</label>
              <select value={nivel} onChange={(e)=>setNivel(e.target.value)} style={{ width:'100%', padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }}>
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ color: '#bbb' }}>Equipo favorito</label>
            <input value={equipo} onChange={(e)=>setEquipo(e.target.value)} placeholder="Ej: Barcelona" style={{ padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }} />
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ color: '#bbb' }}>Avatar (URL)</label>
            <input value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="https://..." style={{ padding: 12, background:'#1c1c1c', color:'#eee', border:'1px solid #333', borderRadius: 10 }} />
          </div>

          <button onClick={continuar} disabled={loading} style={{ width: '100%', padding: 12, background:'linear-gradient(135deg,#22c55e,#16a34a)', color:'#111', border:'none', borderRadius: 10, fontWeight:800, cursor:'pointer', opacity: loading?0.7:1 }}>
            {loading ? 'Guardando...' : 'Guardar y finalizar'}
          </button>

          <button onClick={()=>navigate(-1)} style={{ background:'transparent', color: gold, border:'none', textDecoration:'underline', cursor:'pointer' }}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
