import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function ModerationPage() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar reportes
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from('reportes_moderacion').select('*');
      if (!mounted) return;
      if (error) setError(error.message);
      else setReportes(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Suscripción en tiempo real a cambios en reportes
  useEffect(() => {
    const channel = supabase
      .channel('reportes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reportes_moderacion' },
        () => {
          // Para simplicidad recargamos; en futuro se puede aplicar un diff local
          window.location.reload();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBorrar = async (id) => {
    setLoading(true);
    const { error } = await supabase
      .from('reportes_moderacion')
      .delete()
      .eq('id', id);
    if (error) setError('Error al borrar reporte');
    else window.location.reload();
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Moderación</h2>
        <button
          onClick={() => navigate('/moderacion')}
          style={{
            background: gold,
            color: black,
            border: 'none',
            borderRadius: 8,
            padding: '8px 12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'block',
            marginBottom: 8
          }}
        >
          Actualizar
        </button>
        <button
          onClick={() => navigate('/reportes')}
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Ver reportes
        </button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Moderación</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: black, color: gold }}>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Usuario</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Motivo</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Estado</th>
                <th style={{ padding: 10, borderBottom: `2px solid ${gold}` }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id} style={{ background: r.id % 2 === 0 ? '#333' : black, borderRadius: 12 }}>
                  <td style={{ padding: 10 }}>{r.usuario}</td>
                  <td style={{ padding: 10 }}>{r.motivo}</td>
                  <td style={{ padding: 10 }}>{r.estado}</td>
                  <td style={{ padding: 10 }}>
                    <button
                      onClick={() => navigate(`/moderacion/${r.id}`)}
                      style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => navigate(`/moderacion/${r.id}/historial`)}
                      style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 8 }}
                    >
                      Historial
                    </button>
                    <button
                      style={{ background: '#FF4444', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 24px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FF444488', cursor: 'pointer', marginLeft: 8 }}
                      onClick={() => window.confirm('¿Seguro que quieres borrar este reporte?') && handleBorrar(r.id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <button
          onClick={() => navigate('/actividad')}
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer', display: 'block', marginBottom: 8 }}
        >
          Ver actividad
        </button>
        <button
          onClick={() => navigate('/reportes')}
          style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Ver reportes
        </button>
      </aside>
    </div>
  );
}
