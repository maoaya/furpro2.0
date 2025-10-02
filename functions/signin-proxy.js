// Netlify Function: signin-proxy
// Proxy para login con password desde el servidor
// Nota: En Node 18+ en Netlify, fetch es nativo, no se requiere node-fetch

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email y password requeridos' }) };
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qqrxetxcglwrejtblwut.supabase.co';
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDU0NzQsImV4cCI6MjA2OTgyMTQ3NH0.kXZzpXZQf3rS_LRNnWf0Bz7r4Ik8vqhAoTKxGzgwWFA';

    if (!supabaseUrl || !anonKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Faltan variables de entorno de Supabase' }) };
    }

    const url = `${supabaseUrl}/auth/v1/token?grant_type=password`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: data.error_description || data.error || 'Signin failed', details: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};