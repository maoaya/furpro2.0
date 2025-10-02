// Netlify Function: signup-proxy
// Proxy para evitar errores 502 llamando a Supabase desde el servidor (no desde el navegador)
// Nota: En Node 18+ en Netlify, fetch es nativo, no se requiere node-fetch

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, password, metadata } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email y password requeridos' }) };
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Faltan variables de entorno de Supabase' }) };
    }

    const url = `${supabaseUrl}/auth/v1/signup`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
        data: metadata || {},
        gotrue_meta_security: { captcha_token: 'bypass' }
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: data.error_description || data.error || 'Signup failed', details: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};