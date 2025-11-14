// Netlify Function: auto-confirm user without real email confirmation
// WARNING: This should be used only for QA/Dev. Protect with Origin checks.

import { createClient } from '@supabase/supabase-js';

// Orígenes permitidos: configurable por env, siempre incluye producción
const envOrigins = (process.env.ALLOWED_ORIGINS || process.env.NETLIFY_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([
  'https://futpro.vip',
  ...envOrigins,
]));

function buildCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export const handler = async function (event) {
  // Detectar origen
  const originHeader = event.headers.origin || '';
  const refererHeader = event.headers.referer || '';
  const origin = originHeader || refererHeader || '';
  const isAllowed = allowedOrigins.some((o) => origin.startsWith(o));

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: buildCorsHeaders(isAllowed ? (originHeader || allowedOrigins[0]) : '*'),
    };
  }

  // Solo POST permitido
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: buildCorsHeaders(isAllowed ? origin : '*'),
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Logging para debug
  console.log('[auto-confirm] Origen:', origin, 'Permitido:', isAllowed);

  try {
    if (!isAllowed) {
      console.warn('[auto-confirm] Origen no permitido:', origin);
      return {
        statusCode: 403,
        headers: buildCorsHeaders('*'),
        body: JSON.stringify({ error: 'Forbidden origin', allowedOrigins })
      };
    }

    let userId, email;
    try {
      const body = JSON.parse(event.body || '{}');
      userId = body.userId;
      email = body.email;
    } catch (e) {
      return {
        statusCode: 400,
        headers: buildCorsHeaders(origin),
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }
    if (!userId || !email) {
      return {
        statusCode: 400,
        headers: buildCorsHeaders(origin),
        body: JSON.stringify({ error: 'Missing userId or email' })
      };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return {
        statusCode: 500,
        headers: buildCorsHeaders(origin),
        body: JSON.stringify({ error: 'Missing Supabase admin env vars' })
      };
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Confirmar email
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirmed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[auto-confirm] Error Supabase:', error.message);
      return {
        statusCode: 500,
        headers: buildCorsHeaders(origin),
        body: JSON.stringify({ error: error.message })
      };
    }

    console.log('[auto-confirm] Usuario confirmado:', userId, email);
    return {
      statusCode: 200,
      headers: buildCorsHeaders(origin),
      body: JSON.stringify({ ok: true, userId, email, data })
    };
  } catch (err) {
    console.error('[auto-confirm] Error inesperado:', err);
    return {
      statusCode: 500,
      headers: buildCorsHeaders('*'),
      body: JSON.stringify({ error: err.message })
    };
  }
};
