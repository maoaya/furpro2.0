imexport function useWebSocketLikes(onLikeUpdate) {
  useEffect(() => {
    const ws = new window.WebSocket('wss://futpro.vip/ws');
    ws.onmessage = (event) => { { useEffect } from 'react';

export function useWebSocketLikes(onNewLike) {
  useEffect(() => {
    const ws = new window.WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new-like' && onNewLike) {
          onNewLike(data.mediaId, data.likes);
        }
  } catch { /* noop */ }
    };
    return () => ws.close();
  }, [onNewLike]);
}
