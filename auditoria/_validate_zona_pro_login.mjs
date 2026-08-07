import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();

  const checks = [];
  for (const route of ['/', '/login', '/auth']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await sleep(900);
    const m = await page.evaluate(() => {
      const t = document.getElementById('root')?.innerText || '';
      return {
        pathname: location.pathname,
        hasZonaPro: /ZONA PRO/i.test(t),
        hasGoogle: /Continuar con Google/i.test(t),
        hasCrear: /Crear usuario/i.test(t),
        hasGmail: /Gmail|GMAIL/i.test(t),
        hasInstagramHome: /homepage-instagram|Stories|filtro-alertas/i.test(t) && !/ZONA PRO/i.test(t),
        preview: t.slice(0, 180),
      };
    });
    checks.push({ route, ...m });
  }

  // Stub HTML no debe ganar
  await page.goto(`${BASE}/homepage-instagram.html`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await sleep(600);
  const stub = await page.evaluate(() => ({
    pathname: location.pathname,
    title: document.title,
    hasRoot: Boolean(document.getElementById('root')),
    text: (document.getElementById('root')?.innerText || document.body?.innerText || '').slice(0, 120),
  }));

  await browser.close();

  const loginPass = checks.every((c) => c.hasZonaPro && c.hasGoogle && c.hasCrear && !c.hasInstagramHome);
  const stubQuarantined = stub.hasRoot || /ZONA PRO/i.test(stub.text) || stub.pathname === '/';
  const pass = loginPass;

  const report = { pass, loginPass, stubQuarantined, checks, stub, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(__dirname, 'VALIDACION_ZONA_PRO_LOGIN.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(
    path.join(__dirname, 'VALIDACION_ZONA_PRO_LOGIN.md'),
    [
      '# VALIDACION ZONA PRO login',
      '',
      `**Resultado:** ${pass ? 'PASS' : 'FAIL'}`,
      '',
      ...checks.map(
        (c) =>
          `- ${c.route}: ZONA PRO=${c.hasZonaPro} Google=${c.hasGoogle} Crear=${c.hasCrear} InstagramHTML=${c.hasInstagramHome}`
      ),
      '',
      `Stub /homepage-instagram.html → root=${stub.hasRoot} path=${stub.pathname}`,
      '',
      `Generado: ${report.generatedAt}`,
    ].join('\n')
  );
  console.log(JSON.stringify({ pass, loginPass, stubQuarantined, checks: checks.map((c) => ({ route: c.route, hasZonaPro: c.hasZonaPro })) }, null, 2));
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
