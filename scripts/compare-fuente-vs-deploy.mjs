#!/usr/bin/env node
/**
 * Compara src-zona-pro (fuente PC) contra el inventario del deploy.
 * Uso: node scripts/compare-fuente-vs-deploy.mjs
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();
const inventario = path.join(root, 'auditoria', 'CONTEXTO_DEPLOY_A_JSX.json');
const fuente = path.join(root, 'src-zona-pro');

if (!fs.existsSync(inventario)) {
  console.error('Falta', inventario);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inventario, 'utf8'));
const expected = new Set();
for (const c of data.chunks || []) {
  const s = c.expected_source;
  if (!s) continue;
  expected.add(s);
  // also allow .js/.ts for service-like names
  if (s.endsWith('.jsx')) {
    expected.add(s.replace(/\.jsx$/, '.js'));
    expected.add(s.replace(/\.jsx$/, '.tsx'));
    expected.add(s.replace(/\.jsx$/, '.ts'));
  }
}

if (!fs.existsSync(path.join(fuente, 'README.md')) && !fs.existsSync(fuente)) {
  console.error('src-zona-pro/ vacío. Importa primero el ZIP del Desktop.');
  process.exit(1);
}

const found = new Set();
const allJsx = [];
try {
  const out = execSync(
    `find ${JSON.stringify(fuente)} \\( -name '*.jsx' -o -name '*.tsx' -o -name '*.js' -o -name '*.ts' \\) -not -path '*/node_modules/*' -not -path '*/dist/*'`,
    { encoding: 'utf8' }
  );
  for (const line of out.split('\n').filter(Boolean)) {
    const base = path.basename(line);
    found.add(base);
    if (base.endsWith('.jsx') || base.endsWith('.tsx')) allJsx.push(line);
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const present = [];
const missing = [];
for (const name of [...expected].filter((n) => n.endsWith('.jsx')).sort()) {
  const ok =
    found.has(name) ||
    found.has(name.replace(/\.jsx$/, '.js')) ||
    found.has(name.replace(/\.jsx$/, '.tsx')) ||
    found.has(name.replace(/\.jsx$/, '.ts'));
  (ok ? present : missing).push(name);
}

const deployBases = new Set(
  [...expected].map((n) => n.replace(/\.(jsx|tsx|js|ts)$/, ''))
);
const extras = allJsx
  .map((p) => ({ path: p, base: path.basename(p) }))
  .filter(({ base }) => !deployBases.has(base.replace(/\.(jsx|tsx)$/, '')));

console.log('=== KEEP (tienen chunk en deploy) ===');
present.forEach((n) => console.log('  ✓', n));
console.log('\n=== FALTAN en fuente (el PC debería traerlos) ===');
missing.forEach((n) => console.log('  ✗', n));
console.log('\n=== SOBRANTES / revisar (jsx sin chunk homónimo) ===');
console.log(`  (${extras.length} archivos — posibles duplicados o no-producto)`);
extras.slice(0, 80).forEach(({ path: p }) => console.log('  ?', p.replace(root + '/', '')));
if (extras.length > 80) console.log('  …', extras.length - 80, 'más');

const report = {
  present,
  missing,
  extras_count: extras.length,
  extras_sample: extras.slice(0, 200).map((e) => e.path),
  jsx_total_in_fuente: allJsx.length,
};
fs.writeFileSync(
  path.join(root, 'auditoria', 'COMPARE_FUENTE_VS_DEPLOY.json'),
  JSON.stringify(report, null, 2)
);
console.log('\n→ auditoria/COMPARE_FUENTE_VS_DEPLOY.json');
console.log(
  missing.length
    ? '\nAún falta fuente completo o nombres distintos en el PC.'
    : '\nTodos los JSX esperados del deploy están en src-zona-pro.'
);
