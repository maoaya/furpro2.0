import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { safeSelect } from '../utils/safeSelect.js';
import { isTableDisabled } from '../utils/schemaCompatibilityGate.js';

/**
 * Item de notificación — preview de último mensaje sin spamear 400.
 * Columnas legacy/modernas se prueban en cascada (destinatario vs destinatario_id, etc.).
 */
export default function NotificationItem({ notification, userId }) {
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uid = userId || notification?.user_id || notification?.destinatario;
    if (!uid || isTableDisabled('mensajes')) return undefined;

    let cancelled = false;
    (async () => {
      setLoading(true);
      // Selects de más específico → más seguro (el 400 del log usaba columnas mixto)
      const result = await safeSelect(
        supabase,
        'mensajes',
        [
          'conversacion_id,chat_id,remitente,destinatario,contenido,created_at',
          'id,remitente,destinatario,contenido,created_at',
          'id,user_id,destinatario_id,texto,created_at',
          'id,contenido,created_at',
          '*',
        ],
        (q) => {
          // Intentar filtro por destinatario; si el select no tiene esa col, el gate cae al siguiente
          try {
            return q
              .or(`destinatario.eq.${uid},destinatario_id.eq.${uid},user_id.eq.${uid}`)
              .order('created_at', { ascending: false })
              .limit(1);
          } catch {
            return q.order('created_at', { ascending: false }).limit(1);
          }
        }
      );

      if (cancelled) return;
      const row = Array.isArray(result.data) ? result.data[0] : null;
      const text = row?.contenido || row?.texto || row?.body || '';
      setPreview(text ? String(text).slice(0, 100) : '');
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [notification?.id, userId, notification?.user_id, notification?.destinatario]);

  const title = notification?.title || notification?.titulo || notification?.type || 'Notificación';
  const body = notification?.body || notification?.mensaje || preview || '';

  return (
    <article
      style={{
        background: '#1b1b1b',
        border: '1px solid #333',
        borderRadius: 10,
        padding: 12,
        color: '#FFD700',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 13 }}>{title}</div>
      <div style={{ color: '#ccc', fontSize: 12, marginTop: 4 }}>
        {loading ? '…' : (body || 'Sin detalle')}
      </div>
      {(notification?.timestamp || notification?.created_at) && (
        <div style={{ color: '#666', fontSize: 10, marginTop: 6 }}>
          {new Date(notification.timestamp || notification.created_at).toLocaleString('es-ES')}
        </div>
      )}
    </article>
  );
}
