// Netlify Function: auto-confirm user without real email confirmation
// WARNING: This should be used only for QA/Dev. Protect with Origin checks.

const { createClient } = require('@supabase/supabase-js');

const allowedOrigins = [
  'https://futpro.vip',
  // Add your Netlify preview domain if needed
];

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const origin = event.headers.origin || event.headers.referer || '';
    if (!allowedOrigins.some((o) => origin.startsWith(o))) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden origin' }) };
    }

    const { userId, email } = JSON.parse(event.body || '{}');
    if (!userId || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing userId or email' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase admin env vars' }) };
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Mark email as confirmed
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirmed_at: new Date().toISOString(),
    });

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, userId, email }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
