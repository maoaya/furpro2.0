import React, { useEffect, useState } from 'react';
import { NotificacionesService } from '../services/NotificacionesService';
import { useAuth } from '../context/AuthContext';

export default function Notificaciones() {
  // FP-AUTH-002: sin getSession local
  const { user, loading: authLoading } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  useEffect(() => {
    if (authLoading) return;
    async function fetchNotificaciones() {
      const userId = user?.id;
      if (userId) {
        const notis = await NotificacionesService.getNotificaciones(userId);
        setNotificaciones(notis);
      }
    }
    fetchNotificaciones();
  }, [user?.id, authLoading]);
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Notificaciones</h2>
      {/* Lista de notificaciones */}
      <div style={{ background: '#232323', borderRadius: 8, padding: '24px', color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginTop: 24 }}>
        <p style={{ fontSize: 18 }}>Aquí verás tus notificaciones importantes, alertas y mensajes del sistema.</p>
      </div>
    </div>
  );
}
