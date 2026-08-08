/**
 * Netlify Function: zona-pro-ai
 * Expone POST /api/zona-pro (rewrite en netlify.toml).
 * Acciones usadas por el bundle canónico: sportsdb, fixtures, live, competition, …
 */
import { handleZonaProAction } from './lib/sportsdb-proxy.mjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=60',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: CORS,
      body: JSON.stringify({ error: 'JSON inválido' }),
    };
  }

  try {
    const result = await handleZonaProAction(body);
    return {
      statusCode: result.statusCode || 200,
      headers: CORS,
      body: JSON.stringify(result.body ?? {}),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message || 'zona-pro-ai failed' }),
    };
  }
};
