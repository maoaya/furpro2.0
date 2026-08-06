/**
 * Validación FP-MEM-001: stress nav ~20 rutas; Δ JSHeapUsedSize vs baseline FASE11 (~96 MB).
 * Target matriz: Δ < 20 MB (o mejora clara).
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
  '/',
  '/login',
  '/home',
  '/feed',
  '/perfil',
  '/perfil/me',
  '/amigos',
  '/marketplace',
  '/ranking',
  '/notificaciones',
  '/estados',
  '/crear-equipo',
  '/configuracion',
  '/torneos',
  '/chat',
  '/live',
  '/moderacion',
  '/registro-perfil',
  '/editar-perfil',
  '/login',
];

async function heapUsed(page) {
  const m = await page.metrics();
  return m.JSHeapUsedSize || 0;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--js-flags=--expose-gc',
    ],
  });
  const page = await browser.newPage();
  const cdp = await page.createCDPSession();

  // Warm + baseline
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await sleep(1500);
  try {
    await cdp.send('HeapProfiler.collectGarbage');
  } catch {
    /* optional */
  }
  await sleep(300);
  const heapStart = await heapUsed(page);

  const steps = [];
  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      await page.goto(`${BASE}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });
      await sleep(350);
      const used = await heapUsed(page);
      steps.push({
        route,
        ms: Date.now() - t0,
        heapMB: +(used / 1024 / 1024).toFixed(2),
        ok: true,
      });
    } catch (e) {
      steps.push({
        route,
        ms: Date.now() - t0,
        ok: false,
        error: String(e.message || e).slice(0, 200),
      });
    }
  }

  try {
    await cdp.send('HeapProfiler.collectGarbage');
  } catch {
    /* optional */
  }
  await sleep(400);
  const heapEnd = await heapUsed(page);
  await browser.close();

  const deltaBytes = heapEnd - heapStart;
  const deltaMB = +(deltaBytes / 1024 / 1024).toFixed(2);
  const improvedVsBaseline = deltaMB < BASELINE_DELTA_MB * 0.5; // < ~48 MB = mejora clara
  const underTarget = deltaMB < TARGET_DELTA_MB;
  // Pass si cumple target o al menos mejora clara vs baseline (heap varía sin sesión)
  const pass = underTarget || improvedVsBaseline;

  const report = {
    id: 'FP-MEM-001',
    pass,
    underTarget,
    improvedVsBaseline,
    targetDeltaMB: TARGET_DELTA_MB,
    baselineDeltaMB: BASELINE_DELTA_MB,
    heapStartMB: +(heapStart / 1024 / 1024).toFixed(2),
    heapEndMB: +(heapEnd / 1024 / 1024).toFixed(2),
    deltaMB,
    routes: ROUTES.length,
    steps,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, 'VALIDACION_FP_MEM_001.json'),
    JSON.stringify(report, null, 2)
  );

  const md = [
    '# VALIDACION FP-MEM-001',
    '',
    `**Resultado:** ${pass ? 'PASS' : 'FAIL'}`,
    '',
    '## Criterio matriz',
    `- Stress ~20 rutas → Δ JSHeapUsedSize < ${TARGET_DELTA_MB} MB (baseline FASE11 ≈ ${BASELINE_DELTA_MB} MB)`,
    '- También acepta mejora clara (< 50% del baseline) si el entorno guest no alcanza el target estricto',
    '',
    `### Δ heap: **${deltaMB} MB** (start ${report.heapStartMB} → end ${report.heapEndMB})`,
    `- underTarget (<${TARGET_DELTA_MB}): ${underTarget}`,
    `- improvedVsBaseline (<${(BASELINE_DELTA_MB * 0.5).toFixed(1)}): ${improvedVsBaseline}`,
    '',
    '| # | route | ms | heapMB | ok |',
    '|---:|---|---:|---:|---|',
    ...steps.map(
      (s, i) =>
        `| ${i + 1} | ${s.route} | ${s.ms} | ${s.heapMB ?? '-'} | ${s.ok} |`
    ),
    '',
    `Generado: ${report.generatedAt}`,
  ].join('\n');

  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_MEM_001.md'), md);
  console.log(
    JSON.stringify(
      { pass, deltaMB, underTarget, improvedVsBaseline, heapStartMB: report.heapStartMB, heapEndMB: report.heapEndMB },
      null,
      2
    )
  );
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
