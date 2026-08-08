import React, { useState } from 'react'
import { useNotifications } from '../context/NotificationsContext'

export default function NotificationsBell() {
  const { unread, items, markAllRead } = useNotifications() || { unread: 0, items: [] }
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} aria-label="Notificaciones" style={{ borderRadius: '50%', width: 42, height: 42, border: '2px solid #FFD700', background: '#0f0f0f', color: '#FFD700', boxShadow: '0 3px 12px rgba(0,0,0,0.4)', position: 'relative' }}>🔔
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -6, right: -6, background: '#e02424', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: 10, fontWeight: 800 }}>{unread}</span>
        )}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 50, width: 320, background: '#111', border: '1px solid #333', borderRadius: 8, padding: 8, zIndex: 50 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ color: '#FFD700', fontWeight: 700 }}>Notificaciones</div>
            <button onClick={markAllRead} style={{ background: 'transparent', border: 'none', color: '#ccc' }}>Marcar leídas</button>
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto', display: 'grid', gap: 6 }}>
            {items.slice(0, 20).map((n, i) => (
              <div key={n?.id || i} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 6, padding: 8 }}>
                <div style={{ fontSize: 12, color: '#FFD700', fontWeight: 700 }}>{n?.title || n?.type}</div>
                <div style={{ fontSize: 12, color: '#ccc' }}>{n?.body}</div>
                <div style={{ fontSize: 10, color: '#777' }}>{new Date(n?.timestamp || Date.now()).toLocaleString('es-ES')}</div>
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ color: '#888', textAlign: 'center', padding: 12 }}>Sin notificaciones</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
