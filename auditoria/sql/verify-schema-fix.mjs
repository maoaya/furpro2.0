#!/usr/bin/env node
/**
 * Probes the live Supabase project after applying
 * 2026-08-08_fix_schema_drift_chat_ranking_historias.sql
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  for (const f of ['.env.netlify', '.env.limpio', '.env.backend', '.env']) {
    const p = resolve(process.cwd(), f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

loadEnv();

const URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qqrxetxcglwrejtblwut.supabase.co';
const KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  'sb_publishable_ogM0DfDZHePZ3FiOmlxpUg_WPURRcKm';

const SAMPLE_USER = '2443f849-869e-4177-b971-e1cbac14392e';

async function probe(label, path, { method = 'GET', body = null, profile = 'public' } = {}) {
  const headers = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    Accept: 'application/json',
    'Accept-Profile': profile,
    'Content-Profile': profile,
  };
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let ok = res.status >= 200 && res.status < 300;
  // empty arrays are success
  if (!ok && res.status === 404 && text.includes('does not exist')) ok = false;
  const preview = text.slice(0, 160).replace(/\s+/g, ' ');
  const mark = ok ? 'OK ' : 'FAIL';
  console.log(`${mark} ${res.status} [${profile}] ${label} :: ${preview}`);
  return ok;
}

const checks = [];
checks.push(await probe('rpc_ranking_equipos', 'rpc/rpc_ranking_equipos', { method: 'POST', body: {} }));
checks.push(
  await probe('rpc_ranking_equipos filters', 'rpc/rpc_ranking_equipos', {
    method: 'POST',
    body: { p_deporte: 'Fútbol', p_limit: 5, p_offset: 0 },
  }),
);
checks.push(
  await probe('obtener_sugerencias_usuarios', 'rpc/obtener_sugerencias_usuarios', {
    method: 'POST',
    body: { p_limite: 5, p_usuario: SAMPLE_USER },
  }),
);
checks.push(
  await probe('fp_obtener_bandeja_chat', 'rpc/fp_obtener_bandeja_chat', {
    method: 'POST',
    body: { p_usuario_id: SAMPLE_USER },
  }),
);
checks.push(
  await probe(
    'mensajes.destinatario',
    `mensajes?select=conversacion_id,chat_id,remitente,usuario_id,destinatario,contenido,created_at,creado_en&destinatario=eq.${SAMPLE_USER}&limit=1`,
  ),
);
checks.push(
  await probe(
    'futpro_chat_sessions english cols',
    `futpro_chat_sessions?select=conversation_id,conversation_type,peer_user_id,product_id,title,avatar_url,last_message_text,last_message_at,unread_count,owner_id&owner_id=eq.${SAMPLE_USER}&deleted_at=is.null&limit=1`,
  ),
);
checks.push(
  await probe(
    'historias.expires_at',
    `historias?select=id,expires_at,fecha_vencimiento&expires_at=gt.2026-08-08T00:00:00Z&limit=1`,
  ),
);

// api schema mirrors (optional but expected after migration)
checks.push(
  await probe('api.fp_obtener_bandeja_chat', 'rpc/fp_obtener_bandeja_chat', {
    method: 'POST',
    body: { p_usuario_id: SAMPLE_USER },
    profile: 'api',
  }),
);

const failed = checks.filter((x) => !x).length;
console.log(`\n${checks.length - failed}/${checks.length} probes passed`);
process.exit(failed ? 1 : 0);
