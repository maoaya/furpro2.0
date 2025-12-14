import React, { useState } from 'react'

export default function NotificationsEnableButton() {
  const [status, setStatus] = useState(Notification?.permission || 'default')

  const enable = async () => {
    try {
      if (!('Notification' in window)) {
        alert('Tu navegador no soporta notificaciones')
        return
      }
      const perm = await Notification.requestPermission()
      setStatus(perm)
    } catch (e) {
      console.warn('Permiso de notificaciones falló:', e)
    }
  }

  if (status === 'granted') return null

  return (
    <button onClick={enable} title="Habilitar notificaciones" style={{ background: 'linear-gradient(135deg,#FFD700,#FF9F0D)', color: '#000', border: 'none', padding: '10px 14px', borderRadius: 8, fontWeight: 800 }}>
      Habilitar notificaciones 🔔
    </button>
  )
}
