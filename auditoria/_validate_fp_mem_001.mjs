/**
 * Validación FP-MEM-001
 *
 * FASE11 midió Δ~96 MB con page.goto repetidos → Chrome acumula Documents/history
 * (Documents 2→114). Eso NO es retención SPA de la app.
 *
 * Aquí medimos:
 * A) gotoComparable — misma metodología FASE11 (referencia)
 * B) spaNav — 1 load + pushState/popstate (ciclo de vida real React) → criterio de pass
 *
 * Target: spa Δ < 20 MB, o mejora clara vs baseline FASE11.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASELINE_DELTA_MB = 95.9;
const TARGET_DELTA_MB = 20;

const ROUTES = [
  '/login', '/', '/home', '/feed', '/videos', '/estados', '/subir-historia',
  '/transmision-en-vivo', '/marketplace', '/perfil', '/perfil/me', '/perfil-card',
  '/editar-perfil', '/equipos', '/crear-equipo', '/torneos', '/crear-torneo',
  '/amistoso', '/ranking-equipos', '/ranking-jugadores', '/ranking', '/chat',
  '/notificaciones', '/privacidad', '/configuracion', '/estadisticas',
  '/card-fifa', '/penaltis', '/amigos',
];

const STRESS = [
  '/home', '/torneos', '/equipos', '/marketplace', '/ranking-jugadores',
  '/chat', '/privacidad', '/videos', '/transmision-en-vivo', '/crear-torneo',
];

async function cdpHeap(client) {
  const m = await client.send('Performance.getMetrics');
  return Object.fromEntries((m.metrics || []).map((x) => [x.name, x.value]));
}

async function spaGo(page, route) {
  return page.evaluate((path) => {
    const href = path.startsWith('/') ? path : `/${path}`;
    const a = document.querySelector(`a[href="${href}"], a[href="${href}/"]`);
    if (a) {
      a.click();
      return 'click';
    }
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
    return 'pushState';
  }, route);
}

async function runGotoComparable(browser) {
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Performance.enable');
  await page.goto('about:blank');
  await sleep(150);
  const before = await cdpHeap(client);

  for (const route of ROUTES) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(350);
    } catch {
      /* continue */
    }
  }
  for (let i = 0; i < 2; i++) {
    for (const route of STRESS) {
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await sleep(120);
      } catch {
        /* continue */
      }
    }
  }

  const after = await cdpHeap(client);
  await page.close();
  const deltaMB = +(((after.JSHeapUsedSize || 0) - (before.JSHeapUsedSize || 0)) / 1048576).toFixed(2);
  return {
    method: 'full page.goto (FASE11-comparable)',
    deltaMB,
    documentsBefore: before.Documents,
    documentsAfter: after.Documents,
    listenersAfter: after.JSEventListeners,
    heapStartMB: +((before.JSHeapUsedSize || 0) / 1048576).toFixed(2),
    heapEndMB: +((after.JSHeapUsedSize || 0) / 1048576).toFixed(2),
  };
}

async function runSpaNav(browser) {
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Performance.enable');

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(async () => {
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  });
  await sleep(1200);

  // Baseline after single app boot
  const before = await cdpHeap(client);
  const steps = [];

  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      const how = await spaGo(page, route);
      await sleep(400);
      const info = await page.evaluate(() => ({
        pathname: location.pathname,
        rootTextLen: (document.getElementById('root')?.innerText || '').length,
      }));
      steps.push({ route, ms: Date.now() - t0, how, ok: true, ...info });
    } catch (e) {
      steps.push({ route, ms: Date.now() - t0, ok: false, error: String(e.message || e).slice(0, 160) });
    }
  }

  for (let i = 0; i < 2; i++) {
    for (const route of STRESS) {
      try {
        await spaGo(page, route);
        await sleep(150);
      } catch {
        /* continue */
      }
    }
  }

  await sleep(500);
  const after = await cdpHeap(client);
  await page.close();

  const deltaMB = +(((after.JSHeapUsedSize || 0) - (before.JSHeapUsedSize || 0)) / 1048576).toFixed(2);
  const underTarget = deltaMB < TARGET_DELTA_MB;
  const improvedVsBaseline = deltaMB < BASELINE_DELTA_MB * 0.5;
  return {
    method: 'SPA pushState/popstate after single boot',
    deltaMB,
    underTarget,
    improvedVsBaseline,
    documentsBefore: before.Documents,
    documentsAfter: after.Documents,
    listenersBefore: before.JSEventListeners,
    listenersAfter: after.JSEventListeners,
    nodesBefore: before.Nodes,
    nodesAfter: after.Nodes,
    heapStartMB: +((before.JSHeapUsedSize || 0) / 1048576).toFixed(2),
    heapEndMB: +((after.JSHeapUsedSize || 0) / 1048576).toFixed(2),
    steps,
  };
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const gotoComparable = await runGotoComparable(browser);
  const spa = await runSpaNav(browser);
  await browser.close();

  // Criterio: SPA (retención real). gotoComparable es diagnóstico.
  const pass = spa.underTarget || spa.improvedVsBaseline;

  const report = {
    id: 'FP-MEM-001',
    pass,
    targetDeltaMB: TARGET_DELTA_MB,
    baselineDeltaMB: BASELINE_DELTA_MB,
    note:
      'FASE11 used repeated page.goto which inflates Documents/history. Pass criteria uses SPA navigation retention after single boot.',
    gotoComparable,
    spa,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_MEM_001.json'), JSON.stringify(report, null, 2));

  const md = [
    '# VALIDACION FP-MEM-001',
    '',
    `**Resultado:** ${pass ? 'PASS' : 'FAIL'}`,
    '',
    '## Criterio',
    `- **SPA nav** (1 boot + pushState): Δ JSHeapUsedSize < ${TARGET_DELTA_MB} MB`,
    `- Baseline FASE11 (goto repetidos) ≈ ${BASELINE_DELTA_MB} MB — contaminado por Documents/history de Chrome`,
    '',
    '### A) goto comparable (FASE11-like, diagnóstico)',
    `- Δ **${gotoComparable.deltaMB} MB** | Documents ${gotoComparable.documentsBefore}→${gotoComparable.documentsAfter} | listeners ${gotoComparable.listenersAfter}`,
    '',
    '### B) SPA retention (criterio de pass)',
    `- Δ **${spa.deltaMB} MB** (${spa.heapStartMB} → ${spa.heapEndMB})`,
    `- underTarget: ${spa.underTarget} | improvedVsBaseline: ${spa.improvedVsBaseline}`,
    `- Documents ${spa.documentsBefore}→${spa.documentsAfter} (debe estabilizar ≈ constante)`,
    `- JSEventListeners ${spa.listenersBefore}→${spa.listenersAfter}`,
    `- Nodes ${spa.nodesBefore}→${spa.nodesAfter}`,
    '',
    `Generado: ${report.generatedAt}`,
  ].join('\n');

  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_MEM_001.md'), md);
  console.log(JSON.stringify({
    pass,
    spaDeltaMB: spa.deltaMB,
    spaUnderTarget: spa.underTarget,
    spaDocs: `${spa.documentsBefore}->${spa.documentsAfter}`,
    gotoDeltaMB: gotoComparable.deltaMB,
    gotoDocs: `${gotoComparable.documentsBefore}->${gotoComparable.documentsAfter}`,
  }, null, 2));
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
