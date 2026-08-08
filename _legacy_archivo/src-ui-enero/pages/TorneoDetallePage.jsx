import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function TorneoDetallePage() {
  const { user, role } = useContext(AuthContext);
  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const torneoId = window.location.pathname.split('/').pop();
    setLoading(true);
    supabase.from('torneos').select('*').eq('id', torneoId).single().then(({ data, error }) => {
      if (error) setError(error.message);
      else setTorneo(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Torneo</h2>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.reload()}>Actualizar</Button>
  <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = '/torneos'}>Volver a lista</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Detalle del Torneo</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {torneo && (
            <>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{torneo.nombre}</div>
              <div>Fecha: {torneo.fecha}</div>
              <div>Estado: {torneo.estado}</div>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginRight: 8, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = `/torneos/${torneo.id}/editar`}>Editar</Button>
                <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = `/torneos/${torneo.id}/historial`}>Ver historial</Button>
                <TorneoDetalleShareButton id={torneo.id} />
              </div>
            </>
          )}
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = '/actividad'}>Ver actividad</Button>
        <Button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12, transition: 'background 0.3s, color 0.3s' }} onClick={() => window.location.href = '/reportes'}>Ver reportes</Button>
      </aside>
    </div>
  );
}

// Botón compartir para detalle de torneo
function TorneoDetalleShareButton({ id }) {
  const [feedback, setFeedback] = React.useState('');
  const url = window.location.origin + '/torneos/' + id;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Torneo FutPro', url });
        setFeedback('¡Compartido!');
        setTimeout(() => setFeedback(''), 1500);
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback('¡Copiado!');
        setTimeout(() => setFeedback(''), 1500);
      } catch (e) {}
    }
  };

  return (
    <>
      <button onClick={handleShare} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>Compartir</button>
      <input value={url} readOnly style={{ width: 120, fontSize: 12, border: '1px solid #FFD700', borderRadius: 6, background: '#181818', color: '#FFD700', padding: '2px 6px' }} onFocus={e => e.target.select()} />
      {feedback && <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 13 }}>{feedback}</span>}
    </>
  );
}