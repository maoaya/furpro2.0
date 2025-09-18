// import supabase from '../supabaseClient';
  // Borrar partido en Supabase
  const handleBorrar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('partidos').delete().eq('id', id);
    if (error) setError('Error al borrar partido');
    else navigate('/partidos');
    setLoading(false);
  };

  // Ejemplo de tiempo real con Supabase (partidos)
  React.useEffect(() => {
    const subscription = supabase
      .channel('partidos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partidos' }, payload => {
        handleActualizar();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';

const gold = '#FFD700';
const black = '#222';

export default function PartidoDetalle() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const partidoId = window.location.pathname.split('/').pop();
    setLoading(true);
    supabase.from('partidos').select('*').eq('id', partidoId).single().then(({ data, error }) => {
      if (error) setError(error.message);
      else setPartido(data);
      setLoading(false);
    });
  }, []);

  const handleActualizar = () => {
    const partidoId = window.location.pathname.split('/').pop();
    setLoading(true);
    supabase.from('partidos').select('*').eq('id', partidoId).single().then(({ data, error }) => {
      if (error) setError(error.message);
      else setPartido(data);
      setLoading(false);
    });
  };

  const handleVolver = () => {
    navigate('/partidos');
  };

  const handleEditar = () => {
    if (partido) navigate(`/partidos/${partido.id}/editar`);
  };

  const handleHistorial = () => {
    if (partido) navigate(`/partidos/${partido.id}/historial`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Partido</h2>
        <Button onClick={handleActualizar}>Actualizar</Button>
        <Button onClick={handleVolver}>Volver a lista</Button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 800, margin: '0 auto' }}>
          <h1>Detalle del Partido</h1>
          {loading && <div style={{ color: gold }}>Cargando...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {partido && (
            <>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{partido.equipo_local} vs {partido.equipo_visitante}</div>
              <div>Fecha: {partido.fecha}</div>
              <div>Estado: {partido.estado}</div>
              <div>Marcador: {partido.marcador_local} - {partido.marcador_visitante}</div>
              <div style={{ marginTop: 24 }}>
                  <Button onClick={handleEditar}>Editar</Button>
                  <Button onClick={handleHistorial}>Ver historial</Button>
                  <button style={{ background: '#FF4444', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 24px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FF444488', cursor: 'pointer' }} onClick={() => window.confirm('¿Seguro que quieres borrar este partido?') && handleBorrar(partido.id)}>Borrar</button>
              </div>
            </>
          )}
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
        <Button onClick={() => navigate('/actividad')}>Ver actividad</Button>
        <Button onClick={() => navigate('/reportes')}>Ver reportes</Button>
      </aside>
    </div>
  );
}
