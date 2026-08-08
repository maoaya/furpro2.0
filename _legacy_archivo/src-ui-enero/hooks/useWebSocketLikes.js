import { useEffect, useRef } from 'react';

// Hook para escuchar likes vía WebSocket
// onNewLike(mediaId: string|number, likes: number)
// options: { url?: string, enabled?: boolean, protocols?: string | string[] }
export function useWebSocketLikes(onNewLike, options = {}) {
  const { url, enabled = true, protocols } = options;
  const wsRef = useRef(null);
  const stateRef = useRef({ attempts: 0, timer: null, closed: false });

  useEffect(() => {
    if (!enabled) return () => {};

    const isLocal = typeof window !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
    let viteEnv = undefined;
    try {
      // Safely access import.meta in Vite environments
      if (typeof globalThis !== 'undefined' && typeof globalThis.import !== 'undefined') {
        viteEnv = globalThis.import.meta?.env;
      }
    } catch (e) {
      // Silently ignore in Jest/Node environments
    }
    const wsFromEnv = (typeof process !== 'undefined' && process.env && (process.env.VITE_WS_URL || process.env.WS_URL))
      || (typeof window !== 'undefined' && window.__ENV && (window.__ENV.VITE_WS_URL || window.__ENV.WS_URL))
      || (viteEnv && (viteEnv.VITE_WS_URL || viteEnv.WS_URL));
    const WS_URL = url || wsFromEnv || (isLocal ? 'ws://localhost:8080' : 'wss://futpro.vip/ws');

    const cleanupTimer = () => {
      if (stateRef.current.timer) {
        clearTimeout(stateRef.current.timer);
        stateRef.current.timer = null;
      }
    };

    const connect = () => {
      // Evitar múltiples conexiones simultáneas
      try { wsRef.current?.close(); } catch (e) { if (typeof console !== 'undefined' && console.debug) console.debug('WS previous close error', e); }
      const ws = new window.WebSocket(WS_URL, protocols);
      wsRef.current = ws;

      ws.onopen = () => {
        stateRef.current.attempts = 0; // reset backoff
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.type === 'new-like' && typeof onNewLike === 'function') {
            onNewLike(data.mediaId, data.likes);
          }
        } catch (_) {
          // Ignorar mensajes no-JSON
        }
      };

      ws.onerror = () => {
        // Forzar cierre para disparar onclose y reconectar
        try { ws.close(); } catch (e) { if (typeof console !== 'undefined' && console.debug) console.debug('WS onerror close error', e); }
      };

      ws.onclose = () => {
        if (stateRef.current.closed) return;
        // Reconexión exponencial con tope
        const attempt = Math.min(stateRef.current.attempts + 1, 6);
        stateRef.current.attempts = attempt;
        const delay = Math.min(1000 * 2 ** (attempt - 1), 15000); // 1s,2s,4s.. máx 15s
        cleanupTimer();
        stateRef.current.timer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      stateRef.current.closed = true;
      cleanupTimer();
      try { wsRef.current?.close(); } catch (e) { if (typeof console !== 'undefined' && console.debug) console.debug('WS cleanup close error', e); }
      wsRef.current = null;
    };
  }, [onNewLike, url, enabled, protocols]);
}
