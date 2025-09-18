import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function EquipoDetallePage() {
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Borrar equipo en Supabase
  const handleBorrar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('equipos').delete().eq('id', id);
    if (error) setError('Error al borrar equipo');
    else window.location.href = '/equipos';
    setLoading(false);
  };

  // Ejemplo de tiempo real con Supabase (equipos)
  React.useEffect(() => {
    const subscription = supabase
      .channel('equipos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipos' }, () => {
        window.location.reload();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  React.useEffect(() => {
    const equipoId = window.location.pathname.split('/').pop();
    setLoading(true);
    supabase.from('equipos').select('*').eq('id', equipoId).single().then(({ data, error }) => {
      if (error) setError(error.message);
      else setEquipo(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Equipo</h2>
        <button onClick={() => window.location.reload()} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginBottom: 8 }}>Actualizar</button>
        <button onClick={() => navigate('/equipos')} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Volver a lista</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Detalle del Equipo</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {equipo && (
            <>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{equipo.nombre}</div>
              <div>Ciudad: {equipo.ciudad}</div>
              <div>Fundación: {equipo.fundacion}</div>
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <button onClick={() => navigate(`/equipos/${equipo.id}/editar`)} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => navigate(`/equipos/${equipo.id}/historial`)} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Ver historial</button>
                <button style={{ background: '#FF4444', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 24px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FF444488', cursor: 'pointer' }} onClick={() => window.confirm('¿Seguro que quieres borrar este equipo?') && handleBorrar(equipo.id)}>Borrar</button>
              </div>
            </>
          )}
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button onClick={() => navigate('/actividad')} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginBottom: 8 }}>Ver actividad</button>
          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                if (window.setEquipoDetalleCopied) window.setEquipoDetalleCopied(true);
              }}
              style={{ background: gold, color: black, border: 'none', borderRadius: 12, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer' }}
            >
              Compartir
            </button>
            <span style={{ background: '#222', color: gold, borderRadius: 8, padding: '6px 16px', fontSize: 16 }}>{window.location.href}</span>
            {/* Feedback visual de copiado */}
            {window.equipoDetalleCopied && <span style={{ color: gold, marginLeft: 12 }}>¡Copiado!</span>}
          </div>
    <button onClick={() => navigate('/reportes')} style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>Ver reportes</button>
      </aside>
    </div>
  );
}