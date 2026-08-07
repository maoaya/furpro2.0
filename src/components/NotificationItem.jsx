import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { safeSelect } from '../utils/safeSelect.js';
import { isTableDisabled } from '../utils/schemaCompatibilityGate.js';

const MESSAGE_TYPES = new Set(['message', 'mensaje', 'chat', 'dm', 'MESSAGE', 'MENSAJE']);

/**
 * Item de notificación — preview de último mensaje sin spamear 400.
 * Schema real (public.mensajes): remitente/usuario_id (NO destinatario).
 */
export default function NotificationItem({ notification, userId }) {
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uid = userId || notification?.user_id || notification?.destinatario;
    const type = notification?.type || notification?.tipo || '';
    const wantsPreview =
      MESSAGE_TYPES.has(type) ||
      Boolean(notification?.chat_id || notification?.conversacion_id);

    if (!uid || !wantsPreview || isTableDisabled('mensajes')) return undefined;

    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await safeSelect(
        supabase,
        'mensajes',
        [
          'id,contenido,mensaje,remitente,usuario_id,chat_id,conversacion_id,created_at',
          'id,contenido,remitente,usuario_id,created_at',
          'id,contenido,created_at',
          '*',
        ],
        (q) => q.order('created_at', { ascending: false }).limit(1),
        {
          filterCandidates: [
            (q) => q.or(`remitente.eq.${uid},usuario_id.eq.${uid}`).order('created_at', { ascending: false }).limit(1),
            (q) => q.eq('usuario_id', uid).order('created_at', { ascending: false }).limit(1),
            (q) => q.eq('remitente', uid).order('created_at', { ascending: false }).limit(1),
            (q) => q.order('created_at', { ascending: false }).limit(1),
          ],
        }
      );

      if (cancelled) return;
      const row = Array.isArray(result.data) ? result.data[0] : null;
      const text = row?.contenido || row?.mensaje || row?.texto || row?.body || '';
      setPreview(text ? String(text).slice(0, 100) : '');
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [notification?.id, notification?.type, notification?.tipo, notification?.chat_id, notification?.conversacion_id, userId, notification?.user_id, notification?.destinatario]);

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
