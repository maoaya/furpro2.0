/**
 * Validación FP-SB-001: products 400 / valoraciones 404 no se repiten.
 * Criterio: en 2 pasadas de rutas críticas, errores schema ≤1 por recurso (primer probe),
 * y la 2ª pasada no añade más 400/404 a esos endpoints.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';

const ROUTES = ['/marketplace', '/feed', '/home', '/ranking', '/ranking-jugadores'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function classify(url, status) {
  if (url.includes('/rest/v1/products') && status === 400) return 'products400';
  if (url.includes('/rest/v1/valoraciones') && status === 404) return 'valoraciones404';
  if (url.includes('/rest/v1/tournaments') && status === 404) return 'tournaments404';
  if (url.includes('/rest/v1/referees') && (status === 400 || status === 404)) return 'refereesSchema';
  if (url.includes('seller_id') || url.includes('carfutpro')) return 'embedNoise';
  return null;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  const pass1 = [];
  const pass2 = [];
  let bucket = pass1;

  page.on('response', (res) => {
    try {
      const url = res.url();
      if (!url.includes('supabase.co/rest/v1')) return;
      const status = res.status();
      const kind = classify(url, status);
      if (kind || status >= 400) {
        bucket.push({ url: url.split('?')[0], status, kind, ts: Date.now() });
      }
    } catch { /* */ }
  });

  const visitAll = async (label) => {
    const results = [];
    for (const route of ROUTES) {
      const t0 = Date.now();
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await sleep(700);
        const m = await page.evaluate(() => ({
          path: location.pathname,
          text: (document.getElementById('root')?.innerText || '').length,
          gate: (() => {
            try { return sessionStorage.getItem('futpro:schema-gate:v1'); } catch { return null; }
          })(),
        }));
        results.push({ route, ms: Date.now() - t0, ...m });
      } catch (e) {
        results.push({ route, ms: Date.now() - t0, error: String(e.message || e) });
      }
    }
    return results;
  };

  const routes1 = await visitAll('pass1');
  bucket = pass2;
  const routes2 = await visitAll('pass2');

  const countKind = (arr, kind) => arr.filter((x) => x.kind === kind).length;
  const products400_1 = countKind(pass1, 'products400');
  const products400_2 = countKind(pass2, 'products400');
  const valoraciones404_1 = countKind(pass1, 'valoraciones404');
  const valoraciones404_2 = countKind(pass2, 'valoraciones404');

  // Pass: no embed 400 storm; 2ª pasada no debe repetir 404/400 de recursos gateados.
  const pass = products400_2 === 0
    && valoraciones404_2 === 0
    && products400_1 <= 1
    && valoraciones404_1 <= 1;

  const report = {
    issue: 'FP-SB-001',
    generatedAt: new Date().toISOString(),
    base: BASE,
    pass,
    metrics: {
      products400_pass1: products400_1,
      products400_pass2: products400_2,
      valoraciones404_pass1: valoraciones404_1,
      valoraciones404_pass2: valoraciones404_2,
      pass1Errors: pass1.length,
      pass2Errors: pass2.length,
    },
    routes1,
    routes2,
    pass1,
    pass2,
  };

  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_SB_001.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_SB_001.md'), `# Validación FP-SB-001

**Pass:** ${pass ? 'YES' : 'NO'}

| Recurso | Pasada 1 | Pasada 2 (debe ser 0) |
|---------|----------|------------------------|
| products 400 | ${products400_1} | ${products400_2} |
| valoraciones 404 | ${valoraciones404_1} | ${valoraciones404_2} |

Gate sessionStorage tras pasada 1: \`${(routes1.find((r) => r.gate) || {}).gate || 'n/a'}\`
`);

  await browser.close();
  console.log(JSON.stringify({ pass, ...report.metrics }, null, 2));
  if (!pass) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
