import { useEffect } from 'react';

export function useWebSocketComments(onNewComment) {
  useEffect(() => {
    const ws = new window.WebSocket('wss://futpro.vip/ws');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new-comment' && onNewComment) {
          onNewComment(data.mediaId, data.comentario);
        }
      } catch (err) {
        // Ignorar mensajes no JSON
        if (process && process.env && process.env.NODE_ENV === 'development') {
          console.debug('Mensaje WS no JSON', err);
        }
      }
    };
    return () => ws.close();
  }, [onNewComment]);
}
