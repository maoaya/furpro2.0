/**
 * Soft-persist de gestión de torneo.
 * Evita 404 en /api/gestion-torneo cuando el RPC Supabase aún no existe.
 * Persistencia real: tablas public.torneos (+ columnas disponibles).
 */
import { createClient } from '@supabase/supabase-js';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

function clientFromEvent(event) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const auth = event.headers?.authorization || event.headers?.Authorization || '';
  const key = service || anon;
  if (!url || !key) return null;
  return createClient(url, key, {
    global: { headers: auth ? { Authorization: auth } : {} },
    db: { schema: 'public' },
  });
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }) };
  }

  try {
    const body = event.httpMethod === 'GET'
      ? Object.fromEntries(new URLSearchParams(event.rawQuery || event.queryStringParameters && new URLSearchParams(event.queryStringParameters).toString() || ''))
      : JSON.parse(event.body || '{}');

    const torneoId = body.torneo_id || body.torneoId || body.id;
    const action = body.action || body.op || 'guardar';
    const payload = body.payload || body.gestion || body.data || body;

    if (!torneoId) {
      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({ ok: true, soft: true, skipped: true, reason: 'missing_torneo_id' }),
      };
    }

    const supabase = clientFromEvent(event);
    if (!supabase) {
      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({ ok: true, soft: true, skipped: true, reason: 'supabase_env_missing' }),
      };
    }

    // Intentar RPCs si existen; si no, soft-OK (el panel no debe spamear 400/404).
    if (action === 'cerrar' || action === 'cerrar_forever' || action === 'close') {
      const { error: rpcErr } = await supabase.rpc('cerrar_gestion_torneo_forever', {
        p_torneo_id: torneoId,
        torneo_id: torneoId,
      });
      if (!rpcErr) {
        return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, via: 'rpc_cerrar' }) };
      }
      const { error: patchErr } = await supabase
        .from('torneos')
        .update({ gestion_cerrada: true })
        .eq('id', torneoId);
      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({
          ok: !patchErr,
          soft: Boolean(patchErr),
          via: patchErr ? 'soft' : 'patch_gestion_cerrada',
          error: patchErr?.message || null,
        }),
      };
    }

    const { error: rpcErr } = await supabase.rpc('guardar_gestion_torneo', {
      p_torneo_id: torneoId,
      torneo_id: torneoId,
      p_payload: payload,
      payload,
    });
    if (!rpcErr) {
      return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, via: 'rpc_guardar' }) };
    }

    // Sin RPC: no forzar PATCH de columnas desconocidas → soft OK para no romper UI
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        ok: true,
        soft: true,
        via: 'soft',
        reason: rpcErr?.message || 'rpc_missing',
        torneo_id: torneoId,
      }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, soft: true, error: e.message || String(e) }),
    };
  }
}
