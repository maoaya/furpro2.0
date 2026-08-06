/**
 * Fases 2,8,10–13 — navegación live (puppeteer-core.launch).
 * NO modifica src/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const OUT_DIR = path.join(ROOT, 'auditoria');
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';

const ROUTES = [
  '/login', '/', '/home', '/feed', '/videos', '/estados', '/subir-historia',
  '/transmision-en-vivo', '/marketplace', '/perfil', '/perfil/me', '/perfil-card',
  '/editar-perfil', '/equipos', '/crear-equipo', '/torneos', '/crear-torneo',
  '/amistoso', '/ranking-equipos', '/ranking-jugadores', '/ranking', '/chat',
  '/notificaciones', '/privacidad', '/configuracion', '/estadisticas',
  '/card-fifa', '/penaltis', '/amigos',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.error('[live]', ...a);

function httpGet(url) {
  return new Promise((resolve) => {
    const started = Date.now();
    const req = http.get(url, { timeout: 10000 }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; if (body.length > 100000) body = body.slice(0, 100000); });
      res.on('end', () => resolve({
        ok: res.statusCode >= 200 && res.statusCode < 400,
        status: res.statusCode,
        ms: Date.now() - started,
        bytes: Buffer.byteLength(body),
      }));
    });
    req.on('error', (err) => resolve({ ok: false, status: 0, ms: Date.now() - started, error: String(err.message || err) }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 0, ms: Date.now() - started, error: 'timeout' }); });
  });
}

async function main() {
  const httpResults = [];
  for (const route of ROUTES) httpResults.push({ route, ...(await httpGet(`${BASE}${route}`)) });
  fs.writeFileSync(path.join(OUT_DIR, `FASE2_HTTP_SMOKE_${DATE}.json`), JSON.stringify({ base: BASE, httpResults }, null, 2));
  log('http smoke', httpResults.filter((r) => r.ok).length, '/', httpResults.length);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 },
  });
  log('browser launched');

  const page = await browser.newPage();
  const consoleLogs = [];
  const pageErrors = [];
  const network = [];

  page.on('console', (msg) => consoleLogs.push({ type: msg.type(), text: String(msg.text()).slice(0, 400), ts: Date.now() }));
  page.on('pageerror', (err) => pageErrors.push({ message: String(err.message || err).slice(0, 800), ts: Date.now() }));
  page.on('response', (res) => {
    try {
      const url = res.url();
      const resourceType = res.request().resourceType();
      if (url.includes('supabase') || resourceType === 'image' || resourceType === 'media' || resourceType === 'xhr' || resourceType === 'fetch') {
        network.push({
          url: url.slice(0, 300),
          status: res.status(),
          ct: res.headers()['content-type'] || '',
          resourceType,
          fromCache: res.fromCache(),
          ts: Date.now(),
        });
      }
    } catch { /* */ }
  });

  await page.evaluateOnNewDocument(() => {
    window.__FP_AUDIT = { longTasks: [] };
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.duration >= 50) window.__FP_AUDIT.longTasks.push({ name: e.name, duration: e.duration, start: e.startTime });
        }
      });
      po.observe({ type: 'longtask', buffered: true });
    } catch { /* */ }
  });

  const client = await page.createCDPSession();
  let heapBefore = null;
  let heapAfter = null;
  try {
    await client.send('Performance.enable');
    const m1 = await client.send('Performance.getMetrics');
    heapBefore = Object.fromEntries((m1.metrics || []).map((x) => [x.name, x.value]));
  } catch { /* */ }

  const routeResults = [];
  const longTasksApprox = [];

  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    const t0 = Date.now();
    try {
      log('goto', route);
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const navMs = Date.now() - t0;
      await sleep(500);
      const metrics = await page.evaluate(() => ({
        pathname: location.pathname,
        title: document.title,
        bodyOverflow: getComputedStyle(document.body).overflow,
        pointerEvents: getComputedStyle(document.body).pointerEvents,
        rootTextLen: (document.getElementById('root')?.innerText || '').length,
        buttons: document.querySelectorAll('button, a[href], [role="button"]').length,
        longTasks: (window.__FP_AUDIT?.longTasks || []).slice(-20),
      }));
      const interactiveMs = Date.now() - t0;
      const blocked = metrics.pointerEvents === 'none' || metrics.rootTextLen < 5;
      longTasksApprox.push(...(metrics.longTasks || []).map((lt) => ({ route, ...lt })));

      let clickSample = [];
      try {
        clickSample = await Promise.race([
          page.evaluate(async () => {
            const btns = [...document.querySelectorAll('button, [role="button"]')].slice(0, 6);
            const results = [];
            for (const b of btns) {
              const label = (b.innerText || b.getAttribute('aria-label') || 'btn').replace(/\s+/g, ' ').slice(0, 50);
              const t = performance.now();
              try {
                b.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
                b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                results.push({ label, ms: performance.now() - t });
              } catch (e) {
                results.push({ label, ms: performance.now() - t, error: String(e) });
              }
            }
            return results;
          }),
          sleep(3000).then(() => [{ label: 'timeout', ms: 3000 }]),
        ]);
      } catch (e) {
        clickSample = [{ error: String(e.message || e) }];
      }

      routeResults.push({
        route,
        status: resp?.status() || 0,
        navMs,
        interactiveMs,
        pathname: metrics.pathname,
        title: metrics.title,
        bodyOverflow: metrics.bodyOverflow,
        pointerEvents: metrics.pointerEvents,
        blocked,
        hardFail: false,
        rootTextLen: metrics.rootTextLen,
        buttonCount: metrics.buttons,
        clickSample,
      });
      log('ok', route, navMs, 'ms', 'text', metrics.rootTextLen, 'btns', metrics.buttons);
    } catch (e) {
      routeResults.push({
        route, status: 0, navMs: Date.now() - t0, interactiveMs: null,
        blocked: true, hardFail: true, error: String(e.message || e).slice(0, 400),
      });
      log('fail', route, e.message);
    }
  }

  // SPA-ish stress via full goto (authless)
  const stress = [];
  const stressRoutes = ['/home', '/torneos', '/equipos', '/marketplace', '/ranking-jugadores', '/chat', '/privacidad', '/videos', '/transmision-en-vivo', '/crear-torneo'];
  for (let i = 0; i < 2; i++) {
    for (const r of stressRoutes) {
      const t0 = Date.now();
      try {
        await page.goto(`${BASE}${r}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await sleep(150);
        const alive = await page.evaluate(() => ({
          pathname: location.pathname,
          pe: getComputedStyle(document.body).pointerEvents,
          text: (document.getElementById('root')?.innerText || '').length,
        }));
        stress.push({ i, route: r, ms: Date.now() - t0, ...alive, blocked: alive.pe === 'none' || alive.text < 5 });
      } catch (e) {
        stress.push({ i, route: r, ms: Date.now() - t0, hardFail: true, error: String(e.message || e).slice(0, 200) });
      }
    }
  }
  log('stress done', stress.length);

  try {
    const m2 = await client.send('Performance.getMetrics');
    heapAfter = Object.fromEntries((m2.metrics || []).map((x) => [x.name, x.value]));
  } catch { /* */ }

  fs.writeFileSync(path.join(OUT_DIR, `FASE2_NAVEGACION_LIVE_${DATE}.json`), JSON.stringify({
    base: BASE, generatedAt: new Date().toISOString(), routeResults, stress,
  }, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, `FASE2_NAVEGACION_LIVE_${DATE}.md`), `# FASE 2 — Navegación live (${DATE})

Base: \`${BASE}\`
Auth: **sin sesión** en este checkout (no hay script open-login-with-token).

## Por ruta
| Ruta | status | navMs | interactiveMs | blocked | hardFail | buttons | rootText |
|------|--------|-------|---------------|---------|----------|---------|----------|
${routeResults.map((r) => `| ${r.route} | ${r.status} | ${r.navMs ?? ''} | ${r.interactiveMs ?? ''} | ${r.blocked ? 'YES' : 'no'} | ${r.hardFail ? 'YES' : 'no'} | ${r.buttonCount ?? ''} | ${r.rootTextLen ?? ''} |`).join('\n')}

## Stress multi-nav
| i | ruta | ms | blocked | hardFail |
|---|------|----|---------|----------|
${stress.map((s) => `| ${s.i} | ${s.route} | ${s.ms} | ${s.blocked ? 'YES' : 'no'} | ${s.hardFail ? 'YES' : 'no'} |`).join('\n')}

## Objetivo &lt;1ms
Full document navigation no puede ser &lt;1ms. Mediana navMs: **${median(routeResults.map((r) => r.navMs).filter(Boolean))}ms**.
`);

  const allClicks = routeResults.flatMap((r) => (r.clickSample || []).map((c) => ({ route: r.route, ...c })));
  fs.writeFileSync(path.join(OUT_DIR, `FASE8_BOTONES_${DATE}.json`), JSON.stringify({ total: allClicks.length, clicks: allClicks }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, `FASE8_BOTONES_${DATE}.md`), `# FASE 8 — Botones (${DATE})\n\n${allClicks.slice(0, 250).map((c) => `- [${c.route}] ${(c.label || '').replace(/\n/g, ' ')}: ${typeof c.ms === 'number' ? c.ms.toFixed(2) : c.ms}ms ${c.error || ''}`).join('\n')}`);

  const media = network.filter((n) => n.resourceType === 'image' || n.resourceType === 'media' || /storage|supabase.*object/i.test(n.url));
  const mediaDup = {};
  for (const m of media) mediaDup[m.url] = (mediaDup[m.url] || 0) + 1;
  fs.writeFileSync(path.join(OUT_DIR, `FASE10_MEDIA_${DATE}.json`), JSON.stringify({
    mediaRequests: media.length,
    duplicates: Object.entries(mediaDup).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]).slice(0, 50),
    sample: media.slice(0, 120),
  }, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, `FASE11_MEMORIA_${DATE}.json`), JSON.stringify({
    heapBefore, heapAfter,
    deltaJSHeap: (heapAfter?.JSHeapUsedSize || 0) - (heapBefore?.JSHeapUsedSize || 0),
  }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, `FASE11_MEMORIA_${DATE}.md`), `# FASE 11 — Memoria (${DATE})\n\nJSHeapUsed before: ${heapBefore?.JSHeapUsedSize}\nJSHeapUsed after: ${heapAfter?.JSHeapUsedSize}\nDelta bytes: ${(heapAfter?.JSHeapUsedSize || 0) - (heapBefore?.JSHeapUsedSize || 0)}\nDelta MB: ${(((heapAfter?.JSHeapUsedSize || 0) - (heapBefore?.JSHeapUsedSize || 0)) / 1048576).toFixed(2)}\n`);

  fs.writeFileSync(path.join(OUT_DIR, `FASE12_MAIN_THREAD_${DATE}.json`), JSON.stringify({ longTasks: longTasksApprox }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, `FASE12_MAIN_THREAD_${DATE}.md`), `# FASE 12 — Hilo principal (${DATE})\n\nLong tasks: **${longTasksApprox.length}**\n\n${longTasksApprox.slice(0, 50).map((t) => `- [${t.route || '?'}] ${Number(t.duration).toFixed(1)}ms`).join('\n') || '_none_'}`);

  const supabaseNetErr = network.filter((n) => n.url.includes('supabase.co') && (n.status >= 400 || n.status === 0));
  fs.writeFileSync(path.join(OUT_DIR, `FASE13_ERRORES_${DATE}.json`), JSON.stringify({
    pageErrors,
    consoleErrors: consoleLogs.filter((c) => c.type === 'error'),
    consoleWarnings: consoleLogs.filter((c) => c.type === 'warning').slice(0, 100),
    supabaseHttpErrors: supabaseNetErr.slice(0, 150),
    consoleSample: consoleLogs.slice(0, 250),
  }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, `FASE13_ERRORES_${DATE}.md`), `# FASE 13 — Errores (${DATE})\n\npageerror: ${pageErrors.length}\nconsole error: ${consoleLogs.filter((c) => c.type === 'error').length}\nSupabase HTTP>=400: ${supabaseNetErr.length}\n\n## pageerror\n${pageErrors.slice(0, 30).map((e) => `- ${e.message}`).join('\n') || '_none_'}\n\n## console error\n${consoleLogs.filter((c) => c.type === 'error').slice(0, 50).map((e) => `- ${e.text}`).join('\n')}\n\n## Supabase errors\n${supabaseNetErr.slice(0, 50).map((e) => `- ${e.status} ${e.url}`).join('\n')}\n`);

  const sb = network.filter((n) => n.url.includes('supabase.co'));
  const byUrl = {};
  for (const n of sb) {
    const key = n.url.split('?')[0];
    byUrl[key] = byUrl[key] || { count: 0, statuses: {} };
    byUrl[key].count++;
    byUrl[key].statuses[n.status] = (byUrl[key].statuses[n.status] || 0) + 1;
  }
  fs.writeFileSync(path.join(OUT_DIR, `FASE4_SUPABASE_RUNTIME_${DATE}.json`), JSON.stringify({ total: sb.length, byUrl }, null, 2));

  await browser.close();
  console.log(JSON.stringify({
    ok: true,
    routes: routeResults.length,
    blocked: routeResults.filter((r) => r.blocked).length,
    hardFail: routeResults.filter((r) => r.hardFail).length,
    avgNavMs: avg(routeResults.map((r) => r.navMs).filter(Boolean)),
    errors: pageErrors.length,
    consoleErrors: consoleLogs.filter((c) => c.type === 'error').length,
    sbErrors: supabaseNetErr.length,
    heapDeltaMB: (((heapAfter?.JSHeapUsedSize || 0) - (heapBefore?.JSHeapUsedSize || 0)) / 1048576),
    stressBlocked: stress.filter((s) => s.blocked || s.hardFail).length,
  }, null, 2));
}

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}
function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
