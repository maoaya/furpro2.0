import supabase from '../supabaseClient';
  // Borrar notificación en Supabase
  const handleBorrar = async (id) => {
    // Implementa la lógica según tu estructura de notificaciones
    // Ejemplo:
    // setLoading(true);
    // const { error } = await supabase.from('notificaciones').delete().eq('id', id);
    // if (error) setError('Error al borrar notificación');
    // else cargarNotificaciones();
    // setLoading(false);
  };

  // Ejemplo de tiempo real con Supabase (notificaciones)
  React.useEffect(() => {
    // Implementa la lógica según tu estructura de notificaciones
    // Ejemplo:
    // const subscription = supabase
    //   .channel('notificaciones-changes')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'notificaciones' }, payload => {
    //     cargarNotificaciones();
    //   })
    //   .subscribe();
    // return () => {
    //   supabase.removeChannel(subscription);
    // };
  }, []);
// ...existing code...
import React, { useState } from 'react';

const gold = '#FFD700';
const black = '#222';

export default function NotificationsPage() {
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: 'Nuevo torneo disponible', fecha: '2025-08-15' },
    { id: 2, mensaje: 'Actualización de reglas', fecha: '2025-08-18' },
  ]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: black, color: gold }}>
      <aside style={{ width: 220, background: black, borderRight: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Notificaciones</h2>
  <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }} onClick={() => window.ReactRouterDOM.useNavigate ? window.ReactRouterDOM.useNavigate()('/notificaciones/historial') : window.location.href = '/notificaciones/historial'}>Ver historial</button>
      </aside>
      <main style={{ flex: 1, padding: 32, background: black }}>
        <div style={{ background: gold, color: black, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px #0006', maxWidth: 600, margin: '0 auto' }}>
          <h1>Notificaciones</h1>
          <ul>
            {notificaciones.map(n => (
              <li key={n.id} style={{ marginBottom: 12 }}>
                <strong>{n.mensaje}</strong> <span style={{ color: black, background: gold, borderRadius: 6, padding: '2px 8px', marginLeft: 8 }}>{n.fecha}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <aside style={{ width: 220, background: black, borderLeft: `2px solid ${gold}`, padding: 24 }}>
        <h2 style={{ color: gold }}>Acciones rápidas</h2>
  <button style={{ background: gold, color: black, border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold', width: '100%' }} onClick={() => window.ReactRouterDOM.useNavigate ? window.ReactRouterDOM.useNavigate()('/reportes') : window.location.href = '/reportes'}>Ver reportes</button>
      </aside>
    </div>
  );
}
// ...existing code...
