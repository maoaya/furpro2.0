// Netlify Function: notifications-subscribe
// Stores Web Push subscriptions in Supabase

const { createClient } = require('@supabase/supabase-js')

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const body = JSON.parse(event.body || '{}')
    const { subscription, userEmail } = body
    if (!subscription || !userEmail) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing subscription or userEmail' }) }
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase env not configured' }) }
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Upsert by unique (user_email, endpoint)
    const endpoint = subscription?.endpoint || ''
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({ user_email: userEmail, endpoint, subscription_json: subscription, updated_at: new Date().toISOString() }, { onConflict: 'endpoint' })

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || String(e) }) }
  }
}
