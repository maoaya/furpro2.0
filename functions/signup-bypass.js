// Netlify Function: signup-bypass
// Crea usuarios en Supabase sin CAPTCHA usando Service Role

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Headers CORS mejorados
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    // Preflight CORS
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers };
    }

    if (event.httpMethod !== 'POST') {
      return { 
        statusCode: 405, 
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' }) 
      };
    }

    // Variables de entorno de Supabase
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Env check:', { 
      hasUrl: !!SUPABASE_URL, 
      hasKey: !!SERVICE_ROLE,
      url: SUPABASE_URL?.substring(0, 30) + '...' 
    });

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      console.error('Missing Supabase env vars');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Supabase configuration missing',
          debug: { 
            hasUrl: !!SUPABASE_URL, 
            hasKey: !!SERVICE_ROLE,
            env: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
          }
        })
      };
    }

    const { email, password, nombre } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'email y password son requeridos' }) 
      };
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
      db: { schema: 'api' }
    });

    // 1) Crear usuario confirmado
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { nombre: nombre || '', full_name: nombre || '' }
    });
    
    if (createErr) {
      console.error('Create user error:', createErr);
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: createErr.message }) 
      };
    }

    console.log('Usuario creado:', created.user?.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        user: { 
          id: created.user?.id, 
          email: created.user?.email 
        },
        message: 'Usuario creado exitosamente'
      })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: err.message 
      })
    };
  }
};