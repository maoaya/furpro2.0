/**
 * Stub/soft handler para configurar jugadores de torneo.
 * Corta 404 en local/prod cuando el flujo de fixture llama esta función.
 */
import { createClient } from '@supabase/supabase-js';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const torneoId = body.torneo_id || body.torneoId || body.id;
    const jugadores = body.jugadores || body.players || body.config || [];

    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (url && key && torneoId && Array.isArray(jugadores) && jugadores.length) {
      const supabase = createClient(url, key, { db: { schema: 'public' } });
      // Best-effort: si existe tabla, upsert; si no, soft-OK
      const { error } = await supabase.from('torneos_jugadores').upsert(
        jugadores.map((j) => ({
          torneo_id: torneoId,
          ...(typeof j === 'object' ? j : { jugador_id: j }),
        })),
        { onConflict: 'torneo_id,jugador_id' }
      );
      if (!error) {
        return {
          statusCode: 200,
          headers: cors,
          body: JSON.stringify({ ok: true, via: 'torneos_jugadores', count: jugadores.length }),
        };
      }
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        ok: true,
        soft: true,
        torneo_id: torneoId || null,
        received: Array.isArray(jugadores) ? jugadores.length : 0,
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
