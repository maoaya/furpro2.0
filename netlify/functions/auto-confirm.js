// Netlify Function: auto-confirm user without real email confirmation
// WARNING: This should be used only for QA/Dev. Protect with Origin checks.

const { createClient } = require('@supabase/supabase-js');

// Build allowed origins from env (comma-separated), always include production
const envOrigins = (process.env.ALLOWED_ORIGINS || process.env.NETLIFY_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([
  'https://futpro.vip',
  ...envOrigins,
]));

const buildCorsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});

exports.handler = async function (event) {
  const originHeader = event.headers.origin || '';
  const refererHeader = event.headers.referer || '';
  const origin = originHeader || refererHeader || '';
  const isAllowed = allowedOrigins.some((o) => origin.startsWith(o));

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: buildCorsHeaders(isAllowed ? (originHeader || allowedOrigins[0]) : '*') };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: buildCorsHeaders(isAllowed ? origin : '*'), body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    if (!isAllowed) {
      return { statusCode: 403, headers: buildCorsHeaders('*'), body: JSON.stringify({ error: 'Forbidden origin' }) };
    }

    const { userId, email } = JSON.parse(event.body || '{}');
    if (!userId || !email) {
      return { statusCode: 400, headers: buildCorsHeaders(origin), body: JSON.stringify({ error: 'Missing userId or email' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return { statusCode: 500, headers: buildCorsHeaders(origin), body: JSON.stringify({ error: 'Missing Supabase admin env vars' }) };
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Mark email as confirmed
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirmed_at: new Date().toISOString(),
    });

    if (error) {
      return { statusCode: 500, headers: buildCorsHeaders(origin), body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, headers: buildCorsHeaders(origin), body: JSON.stringify({ ok: true, userId, email }) };
  } catch (err) {
    return { statusCode: 500, headers: buildCorsHeaders('*'), body: JSON.stringify({ error: err.message }) };
  }
};
