#!/usr/bin/env node
/**
 * Servidor local canónico: producto-deploy + proxy /api/zona-pro (TheSportsDB).
 * Sustituye `serve` puro para que homepages no dispare CORS a thesportsdb.com.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleZonaProAction } from '../functions/lib/sportsdb-proxy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publish = path.join(root, 'producto-deploy');
const port = Number(process.env.PORT || 4173);
// 0.0.0.0: Cursor Simple Browser / port-forward often cannot reach 127.0.0.1-only binds
const host = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data ?? {});
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split('?')[0]);
  const clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(base, clean);
  if (!full.startsWith(base)) return null;
  return full;
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const cache =
    ext === '.html'
      ? 'no-cache, no-store, must-revalidate'
      : ext === '.js' || ext === '.css'
        ? 'no-cache, must-revalidate'
        : 'public, max-age=3600';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache });
  fs.createReadStream(filePath).pipe(res);
}

if (!fs.existsSync(path.join(publish, 'index.html'))) {
  console.error('❌ Falta producto-deploy/index.html. Ejecuta npm run check:producto');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${host}:${port}`);
    const pathname = url.pathname;

    if (pathname === '/api/zona-pro' || pathname === '/api/zona-pro/') {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
        });
        res.end();
        return;
      }
      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      let body;
      try {
        body = await readBody(req);
      } catch {
        sendJson(res, 400, { error: 'JSON inválido' });
        return;
      }
      const result = await handleZonaProAction(body);
      sendJson(res, result.statusCode || 200, result.body ?? {});
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end('Method not allowed');
      return;
    }

    let filePath = safeJoin(publish, pathname === '/' ? '/index.html' : pathname);
    if (!filePath) {
      res.writeHead(400).end('Bad path');
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      if (req.method === 'HEAD') {
        res.writeHead(200).end();
        return;
      }
      serveFile(res, filePath);
      return;
    }

    // SPA fallback
    const index = path.join(publish, 'index.html');
    if (req.method === 'HEAD') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end();
      return;
    }
    serveFile(res, index);
  } catch (err) {
    console.error('[serve-producto]', err);
    sendJson(res, 500, { error: err.message || 'server error' });
  }
});

server.listen(port, host, () => {
  // Print localhost URLs so Cursor Desktop auto-detects / port-forwards 4173.
  // Bind remains 0.0.0.0 (host) so the tunnel can reach the process.
  console.log(`✅ Zona Pro local: http://127.0.0.1:${port}/`);
  console.log(`   Local: http://localhost:${port}/`);
  console.log(`   login: http://localhost:${port}/login`);
  console.log('   proxy: POST /api/zona-pro  → TheSportsDB (sin CORS)');
});
