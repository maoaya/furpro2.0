import React, { useEffect, useMemo, useState } from 'react';
import { NotificacionesService } from '../services/NotificacionesService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import NotificationItem from '../components/NotificationItem';

const gold = '#FFD700';

export default function Notificaciones() {
  const { user, loading: authLoading } = useAuth();
  const ctx = useNotifications() || { items: [], unread: 0, markAllRead: () => {}, status: 'idle' };
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function fetchNotificaciones() {
      setLoading(true);
      setError('');
      try {
        if (!user?.id) {
          setRemote([]);
          return;
        }
        const notis = await NotificacionesService.getNotificaciones(user.id);
        if (!cancelled) setRemote(notis);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'No se pudieron cargar notificaciones');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchNotificaciones();
    return () => { cancelled = true; };
  }, [user?.id, authLoading]);

  const list = useMemo(() => {
    const map = new Map();
    for (const n of [...(ctx.items || []), ...remote]) {
      const key = n.id || `${n.title}-${n.created_at || n.timestamp}`;
      if (!map.has(key)) map.set(key, n);
    }
    return [...map.values()].sort((a, b) => {
      const ta = new Date(a.timestamp || a.created_at || 0).getTime();
      const tb = new Date(b.timestamp || b.created_at || 0).getTime();
      return tb - ta;
    });
  }, [ctx.items, remote]);

  if (!authLoading && !user) {
    return (
      <div style={{ background: '#181818', minHeight: '60vh', color: gold, padding: 32, maxWidth: 900, margin: 'auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 'bold' }}>Notificaciones</h2>
        <p style={{ color: '#ccc' }}>Inicia sesión para ver tus alertas en tiempo real.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: gold, padding: 32, borderRadius: 18, maxWidth: 900, margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>Notificaciones</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {ctx.unread > 0 && (
            <span style={{ background: '#e02424', color: '#fff', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 800 }}>
              {ctx.unread} nuevas
            </span>
          )}
          <button
            type="button"
            onClick={ctx.markAllRead}
            style={{ background: 'transparent', border: `1px solid ${gold}`, color: gold, borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
          >
            Marcar leídas
          </button>
        </div>
      </div>

      {ctx.status === 'error' && (
        <div style={{ background: '#3a1a1a', border: '1px solid #a44', color: '#fcc', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
          Realtime inestable. Mostrando historial; se reintentará al recargar.
        </div>
      )}
      {error && (
        <div style={{ color: '#f88', marginBottom: 12, fontSize: 13 }}>{error}</div>
      )}
      {loading && <div style={{ color: '#888' }}>Cargando…</div>}

      <div style={{ display: 'grid', gap: 10 }}>
        {!loading && list.length === 0 && (
          <div style={{ background: '#232323', borderRadius: 8, padding: 24, color: '#aaa' }}>
            No tienes notificaciones todavía. Cuando recibas likes, comentarios o invitaciones aparecerán aquí en tiempo real.
          </div>
        )}
        {list.map((n) => (
          <NotificationItem
            key={n.id || `${n.title}-${n.timestamp || n.created_at}`}
            notification={n}
            userId={user?.id}
          />
        ))}
      </div>
    </div>
  );
}
