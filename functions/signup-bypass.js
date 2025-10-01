// Netlify Function: signup-bypass
// Crea usuarios en Supabase sin CAPTCHA usando Service Role y devuelve un magic link para iniciar sesión sin email real

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Supabase Service Role o URL no configurados en Netlify env' })
      };
    }

    const { email, password, nombre } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'email y password son requeridos' }) };
    }

    const { createClient } = await import('@supabase/supabase-js');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1) Crear usuario confirmado
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { nombre: nombre || '', full_name: nombre || '' }
    });
    if (createErr) {
      return { statusCode: 400, body: JSON.stringify({ error: createErr.message }) };
    }

    // 2) Generar magic link para iniciar sesión sin CAPTCHA
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase()
    });
    if (linkErr) {
      return { statusCode: 400, body: JSON.stringify({ error: linkErr.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        userId: created.user?.id,
        email: created.user?.email,
        action_link: linkData?.properties?.action_link || linkData?.action_link
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};