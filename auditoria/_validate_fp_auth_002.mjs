/**
 * Validación FP-AUTH-002: pages sin getSession/getUser (salvo AuthCallback).
 * + smoke nav de rutas afectadas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function grepPagesAuthCalls() {
  const pagesDir = path.join(ROOT, 'src/pages');
  const out = execSync(
    `rg -n "auth\\\\.getSession|auth\\\\.getUser" "${pagesDir}" -g '*.{js,jsx}' || true`,
    { encoding: 'utf8' }
  );
  const lines = out
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const allowed = lines.filter((l) => l.includes('auth/AuthCallback'));
  const forbidden = lines.filter((l) => !l.includes('auth/AuthCallback'));
  return { lines, allowed, forbidden };
}

const ROUTES = [
  '/login',
  '/home',
  '/feed',
  '/perfil',
  '/notificaciones',
  '/ranking',
  '/marketplace',
  '/amigos',
];

async function main() {
  const grep = grepPagesAuthCalls();
  const grepPass = grep.forbidden.length === 0;

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  const nav = [];

  for (const route of ROUTES) {
    const t0 = Date.now();
    try {
      const resp = await page.goto(`${BASE}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });
      await sleep(600);
      const metrics = await page.evaluate(() => ({
        pathname: location.pathname,
        rootTextLen: (document.getElementById('root')?.innerText || '').length,
        hasRoot: Boolean(document.getElementById('root')),
      }));
      nav.push({
        route,
        status: resp?.status() || 0,
        ms: Date.now() - t0,
        hardFail: false,
        ...metrics,
      });
    } catch (e) {
      nav.push({
        route,
        status: 0,
        ms: Date.now() - t0,
        hardFail: true,
        error: String(e.message || e).slice(0, 300),
      });
    }
  }

  await browser.close();

  const navPass = nav.every((r) => !r.hardFail && (r.rootTextLen || 0) > 0);
  const pass = grepPass && navPass;

  const report = {
    id: 'FP-AUTH-002',
    pass,
    grepPass,
    forbiddenCount: grep.forbidden.length,
    forbidden: grep.forbidden,
    allowedAuthCallback: grep.allowed,
    navPass,
    nav,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, 'VALIDACION_FP_AUTH_002.json'),
    JSON.stringify(report, null, 2)
  );

  const md = [
    '# VALIDACION FP-AUTH-002',
    '',
    `**Resultado:** ${pass ? 'PASS' : 'FAIL'}`,
    '',
    '## Criterio matriz',
    '- grep getSession/getUser en `src/pages` → 0 (salvo AuthCallback)',
    '- smoke nav rutas afectadas con rootText > 0',
    '',
    `### Grep: ${grepPass ? 'PASS' : 'FAIL'} (forbidden=${grep.forbidden.length})`,
    '',
    grep.forbidden.length
      ? grep.forbidden.map((l) => `- \`${l}\``).join('\n')
      : '- Sin call-sites prohibidos en pages.',
    '',
    `### Nav smoke: ${navPass ? 'PASS' : 'FAIL'}`,
    '',
    '| route | status | ms | rootText |',
    '|---|---:|---:|---:|',
    ...nav.map(
      (r) =>
        `| ${r.route} | ${r.status} | ${r.ms} | ${r.rootTextLen ?? '-'} |`
    ),
    '',
    `Generado: ${report.generatedAt}`,
  ].join('\n');

  fs.writeFileSync(path.join(__dirname, 'VALIDACION_FP_AUTH_002.md'), md);
  console.log(JSON.stringify({ pass, grepPass, navPass, forbidden: grep.forbidden.length }, null, 2));
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
