import { useEffect, useState } from 'react';

export function useWebSocketNotifications() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotification(data);
      } catch {
        setNotification({ type: 'info', msg: event.data });
      }
    };
    ws.onerror = () => setNotification({ type: 'error', msg: 'Error de conexión a notificaciones' });
    return () => ws.close();
  }, []);

  return notification;
}
