/**
 * Validación FP-NAV-001: /perfil y /crear-equipo deben pintar UI sin ERR_ABORTED.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ROUTES = ['/perfil', '/perfil/me', '/crear-equipo', '/login', '/home'];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  const results = [];

  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      const resp = await page.goto(`${BASE}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });
      await sleep(800);
      const metrics = await page.evaluate(() => ({
        pathname: location.pathname,
        title: document.title,
        hasRoot: Boolean(document.getElementById('root')),
        rootTextLen: (document.getElementById('root')?.innerText || '').length,
        rootPreview: (document.getElementById('root')?.innerText || '').slice(0, 120),
        isStub: document.title.includes('Mi Perfil - FutPro') && !document.getElementById('root'),
      }));
      results.push({
        route,
        status: resp?.status() || 0,
        ms: Date.now() - t0,
        hardFail: false,
        aborted: false,
        ...metrics,
      });
    } catch (e) {
      const msg = String(e.message || e);
      results.push({
        route,
        status: 0,
        ms: Date.now() - t0,
        hardFail: true,
        aborted: /ERR_ABORTED|aborted/i.test(msg),
        error: msg.slice(0, 300),
      });
    }
  }

  // Stress: rapid alternation that previously aborted crear-equipo
  const stress = [];
  for (let i = 0; i < 3; i++) {
    for (const route of ['/perfil', '/crear-equipo']) {
      const t0 = Date.now();
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await sleep(200);
        const m = await page.evaluate(() => ({
          text: (document.getElementById('root')?.innerText || '').length,
          hasRoot: Boolean(document.getElementById('root')),
        }));
        stress.push({ i, route, ms: Date.now() - t0, aborted: false, ...m });
      } catch (e) {
        const msg = String(e.message || e);
        stress.push({
          i,
          route,
          ms: Date.now() - t0,
          aborted: /ERR_ABORTED|aborted/i.test(msg),
          hardFail: true,
          error: msg.slice(0, 200),
        });
      }
    }
  }

  const perfil = results.find((r) => r.route === '/perfil');
  const crear = results.find((r) => r.route === '/crear-equipo');
  const pass = Boolean(
    perfil
    && !perfil.hardFail
    && perfil.hasRoot
    && perfil.rootTextLen > 0
    && !perfil.isStub
    && crear
    && !crear.hardFail
    && !crear.aborted
    && crear.rootTextLen > 0
    && stress.every((s) => !s.aborted && !s.hardFail && (s.text || 0) > 0),
  );

  const report = {
    issue: 'FP-NAV-001',
    generatedAt: new Date().toISOString(),
    base: BASE,
    pass,
    results,
    stress,
  };

  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_NAV_001.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_NAV_001.md'), `# Validación FP-NAV-001

**Pass:** ${pass ? 'YES' : 'NO'}

## Rutas
| Ruta | status | text | hasRoot | aborted | hardFail |
|------|--------|------|---------|---------|----------|
${results.map((r) => `| ${r.route} | ${r.status} | ${r.rootTextLen ?? 0} | ${r.hasRoot ? 'yes' : 'no'} | ${r.aborted ? 'YES' : 'no'} | ${r.hardFail ? 'YES' : 'no'} |`).join('\n')}

## Stress perfil ↔ crear-equipo
${stress.map((s) => `- i=${s.i} ${s.route}: text=${s.text ?? 0} aborted=${s.aborted ? 'YES' : 'no'}`).join('\n')}

### /perfil preview
\`\`\`
${perfil?.rootPreview || perfil?.error || ''}
\`\`\`
`);

  await browser.close();
  console.log(JSON.stringify({
    pass,
    perfilText: perfil?.rootTextLen,
    perfilStub: perfil?.isStub,
    crearText: crear?.rootTextLen,
    crearAborted: crear?.aborted,
    stressFails: stress.filter((s) => s.aborted || s.hardFail || !(s.text > 0)).length,
  }, null, 2));
  if (!pass) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
