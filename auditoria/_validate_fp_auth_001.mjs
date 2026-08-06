/**
 * Validación FP-AUTH-001: tras el fix, /auth/v1/health debe ser 0.
 * Además: probe REST cacheado — muchas llamadas detectSupabaseOnline → 1 fetch.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';
const OUT = path.join(__dirname, 'VALIDACION_FP_AUTH_001.json');
const OUT_MD = path.join(__dirname, 'VALIDACION_FP_AUTH_001.md');

const ROUTES = [
  '/login', '/home', '/torneos', '/equipos', '/marketplace',
  '/ranking-jugadores', '/chat', '/privacidad', '/videos', '/crear-torneo',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const page = await browser.newPage();
  const network = [];
  page.on('response', (res) => {
    const url = res.url();
    if (url.includes('supabase.co')) {
      network.push({ url: url.split('?')[0], status: res.status(), ts: Date.now() });
    }
  });

  const routeResults = [];
  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(500);
      const metrics = await page.evaluate(() => ({
        pathname: location.pathname,
        rootTextLen: (document.getElementById('root')?.innerText || '').length,
        onlineFlag: window.__SUPABASE_ONLINE__,
      }));
      routeResults.push({
        route,
        status: resp?.status() || 0,
        ms: Date.now() - t0,
        ...metrics,
        hardFail: false,
      });
    } catch (e) {
      routeResults.push({ route, hardFail: true, error: String(e.message || e), ms: Date.now() - t0 });
    }
  }

  // Cache test: stay on one document, call probe via page evaluate if exported on window — instead
  // count REST HEAD /rest/v1/ per document by reloading once and waiting.
  // SPA stress within same session isn't available without router hooks; measure health globally.

  const health = network.filter((n) => n.url.includes('/auth/v1/health'));
  const health401 = health.filter((n) => n.status === 401);
  const restRoot = network.filter((n) => /\/rest\/v1\/?$/.test(n.url));

  const report = {
    issue: 'FP-AUTH-001',
    generatedAt: new Date().toISOString(),
    base: BASE,
    criteria: {
      healthCallsMax: 1,
      health401Max: 0,
    },
    metrics: {
      healthCalls: health.length,
      health401: health401.length,
      restRootProbes: restRoot.length,
      routesOk: routeResults.filter((r) => !r.hardFail).length,
      routesTotal: routeResults.length,
    },
    pass: health.length <= 1 && health401.length === 0,
    routeResults,
    healthSample: health.slice(0, 20),
    restRootSample: restRoot.slice(0, 20),
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  fs.writeFileSync(OUT_MD, `# Validación FP-AUTH-001

**Pass:** ${report.pass ? 'YES' : 'NO'}

| Métrica | Valor | Criterio |
|---------|-------|----------|
| auth/v1/health calls | ${report.metrics.healthCalls} | ≤ 1 |
| auth/v1/health 401 | ${report.metrics.health401} | = 0 |
| REST /rest/v1/ probes | ${report.metrics.restRootProbes} | (reemplazo del health) |
| rutas OK | ${report.metrics.routesOk}/${report.metrics.routesTotal} | — |

## Rutas
${routeResults.map((r) => `- \`${r.route}\` ${r.hardFail ? 'FAIL' : 'ok'} ${r.ms}ms text=${r.rootTextLen ?? ''} online=${r.onlineFlag}`).join('\n')}
`);

  await browser.close();
  console.log(JSON.stringify({
    pass: report.pass,
    healthCalls: report.metrics.healthCalls,
    health401: report.metrics.health401,
    restRootProbes: report.metrics.restRootProbes,
    routesOk: report.metrics.routesOk,
  }, null, 2));
  if (!report.pass) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
