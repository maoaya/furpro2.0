import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const notificacionesMock = [
  { id: 1, mensaje: 'Nuevo comentario en tu publicación', leido: false },
  { id: 2, mensaje: 'Te han dado like', leido: false },
  { id: 3, mensaje: 'Nuevo seguidor: maria', leido: true }
];

function NotificacionesPanel({ notificaciones = notificacionesMock }) {
  const [notis, setNotis] = useState(notificaciones);

  useEffect(() => {
    // Suscripción en tiempo real a la tabla de notificaciones
    const subscription = supabase
      .channel('notificaciones')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificaciones' }, payload => {
        if (payload.eventType === 'INSERT') {
          setNotis(prev => [payload.new, ...prev]);
        }
        if (payload.eventType === 'UPDATE') {
          setNotis(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
        }
        if (payload.eventType === 'DELETE') {
          setNotis(prev => prev.filter(n => n.id !== payload.old.id));
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const MemoList = React.memo(function MemoList({ notis }) { return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {notis?.length ? notis.map((n, idx) => (
        <li key={n.id || idx} style={{ marginBottom: 10, background: '#f7f7f7', borderRadius: 8, padding: 10, animation:'fadeInUp 0.5s', animationDelay:`${idx*0.07}s`, animationFillMode:'both' }}>
          <span>{n.mensaje}</span>
          <span style={{ float: 'right', color: '#FFD700' }}>{n.fecha}</span>
        </li>
      )) : <li>No hay notificaciones.</li>}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ul>
  ); });

  return (
    <div className="notificaciones-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Notificaciones</h3>
      <MemoList notis={notis} />
    </div>
  );
}

export default NotificacionesPanel;
