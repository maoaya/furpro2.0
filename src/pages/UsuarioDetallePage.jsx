import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';


const gold = '#FFD700';
const black = '#222';

export default function UsuarioDetallePage({ userId }) {
  // const { user, role } = useContext(AuthContext) || {};
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usuarioId = userId || window.location.pathname.split('/').pop();
    if (!usuarioId) return;
    setLoading(true);
    supabase
      .from('usuarios')
      .select('*')
      .eq('id', usuarioId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setUsuario(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Usuario</h2>
        <button
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12 }}
          onClick={() => window.location.reload()}
        >
          Actualizar
        </button>
        <button
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12 }}
          onClick={() => (window.location.href = '/usuarios')}
        >
          Volver a lista
        </button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Detalle del Usuario</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {usuario && (
            <>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{usuario.nombre}</div>
              <div>Email: {usuario.email}</div>
              <div>Rol: {usuario.rol}</div>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold', marginRight: 8 }}
                  onClick={() => (window.location.href = `/usuarios/${usuario.id}/editar`)}
                >
                  Editar
                </button>
                <button
                  style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 'bold' }}
                  onClick={() => (window.location.href = `/usuarios/${usuario.id}/historial`)}
                >
                  Ver historial
                </button>
                <UsuarioDetalleShareButton id={usuario.id} />
              </div>
            </>
          )}
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12 }}
          onClick={() => (window.location.href = '/actividad')}
        >
          Ver actividad
        </button>
        <button
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%', marginBottom: 12 }}
          onClick={() => (window.location.href = '/reportes')}
        >
          Ver reportes
        </button>
      </aside>
    </div>
  );
}

function UsuarioDetalleShareButton({ id }) {
  const [feedback, setFeedback] = React.useState('');
  const url = window.location.origin + '/usuarios/' + id;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Perfil de usuario FutPro', url });
        setFeedback('¡Compartido!');
        setTimeout(() => setFeedback(''), 1500);
  } catch (e) {/* noop */}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setFeedback('¡Copiado!');
        setTimeout(() => setFeedback(''), 1500);
  } catch (e) {/* noop */}
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