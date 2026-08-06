/**
 * Auditoría estática Fases 1,3,6,7,9 — NO modifica src/
 * Escribe reportes en auditoria/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const OUT = (name) => path.join(ROOT, 'auditoria', name.replace('<fecha>', DATE));

const walk = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
};

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
const read = (p) => {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
};

const codeFiles = walk(SRC).filter((f) => /\.(jsx?|tsx?|mjs|cjs)$/i.test(f));
const allFiles = walk(ROOT).filter((f) => !f.includes('node_modules') && !f.includes('/.git/'));

// ─── FASE 1 ───
const byFolder = {};
for (const f of codeFiles) {
  const parts = rel(f).split('/');
  const key = parts.slice(0, 2).join('/');
  byFolder[key] = (byFolder[key] || 0) + 1;
}

const appSrc = read(path.join(SRC, 'App.jsx'));
const routes = [...appSrc.matchAll(/path=["']([^"']+)["']/g)].map((m) => m[1]);
const routeComponents = [...appSrc.matchAll(/path=["']([^"']+)["']\s+element=\{([^}]+)\}/gs)]
  .map((m) => ({ path: m[1], element: m[2].replace(/\s+/g, ' ').slice(0, 120) }));

const providers = [];
const contexts = walk(path.join(SRC, 'context')).filter((f) => /\.(jsx?|tsx?)$/.test(f));
for (const f of contexts) {
  const c = read(f);
  const names = [...c.matchAll(/createContext|export\s+(?:const|function|class)\s+(\w+)/g)].map((m) => m[1]).filter(Boolean);
  providers.push({ file: rel(f), exports: [...new Set(names)].slice(0, 20) });
}

const hooks = walk(path.join(SRC, 'hooks')).filter((f) => /\.(jsx?|tsx?)$/.test(f)).map(rel);
const services = walk(path.join(SRC, 'services')).filter((f) => /\.(jsx?|tsx?)$/.test(f)).map(rel);
const pages = walk(path.join(SRC, 'pages')).filter((f) => /\.(jsx?|tsx?)$/.test(f)).map(rel);
const components = walk(path.join(SRC, 'components')).filter((f) => /\.(jsx?|tsx?)$/.test(f)).map(rel);

const engines = allFiles
  .filter((f) => /\.(jsx?|tsx?|mjs)$/.test(f) && /(Engine|Bridge|Coordinator|Guard|Warmup|Sync)/i.test(path.basename(f)))
  .map(rel);

const sqlFiles = allFiles.filter((f) => f.endsWith('.sql')).map(rel);
const edgeCandidates = allFiles.filter((f) => /netlify\/functions|edge-functions|functions\//i.test(f) && /\.(js|ts|mjs)$/.test(f)).map(rel);

const pkg = JSON.parse(read(path.join(ROOT, 'package.json')) || '{}');

const eventNames = new Set();
const rpcNames = new Set();
const tableNames = new Set();
for (const f of codeFiles) {
  const c = read(f);
  for (const m of c.matchAll(/futpro:([a-z0-9:_-]+)/gi)) eventNames.add(`futpro:${m[1]}`);
  for (const m of c.matchAll(/CustomEvent\(\s*['"]([^'"]+)['"]/g)) eventNames.add(m[1]);
  for (const m of c.matchAll(/\.rpc\(\s*['"]([^'"]+)['"]/g)) rpcNames.add(m[1]);
  for (const m of c.matchAll(/\.from\(\s*['"]([^'"]+)['"]/g)) tableNames.add(m[1]);
}

const fase1 = {
  generatedAt: new Date().toISOString(),
  repo: 'github.com/maoaya/furpro2.0',
  note: 'Auditoría sobre el repo cloud actual (master). Distinto del árbol local Windows futpro2.0 con AppStateProvider/MenuHamburguesa moderno.',
  counts: {
    srcCodeFiles: codeFiles.length,
    pages: pages.length,
    components: components.length,
    hooks: hooks.length,
    services: services.length,
    contexts: contexts.length,
    routesInAppJsx: routes.length,
    sqlFiles: sqlFiles.length,
    edgeFunctionCandidates: edgeCandidates.length,
    enginesBridges: engines.length,
    uniqueCustomEvents: eventNames.size,
    uniqueRpcNames: rpcNames.size,
    uniqueTableNames: tableNames.size,
  },
  folders: byFolder,
  routes,
  routeComponents,
  providers,
  hooks,
  services: services.slice(0, 200),
  pages: pages.slice(0, 300),
  engines,
  sqlFiles: sqlFiles.slice(0, 200),
  edgeFunctionCandidates: edgeCandidates,
  events: [...eventNames].sort(),
  rpcs: [...rpcNames].sort(),
  tables: [...tableNames].sort(),
  dependencies: {
    react: pkg.dependencies?.react,
    'react-dom': pkg.dependencies?.['react-dom'],
    'react-router-dom': pkg.dependencies?.['react-router-dom'],
    '@supabase/supabase-js': pkg.dependencies?.['@supabase/supabase-js'],
    vite: pkg.devDependencies?.vite || pkg.dependencies?.vite,
  },
  scripts: pkg.scripts || {},
};

fs.writeFileSync(OUT('FASE1_INVENTARIO_<fecha>.json'), JSON.stringify(fase1, null, 2));

const md1 = `# FASE 1 — Inventario completo (${DATE})

**Repo:** github.com/maoaya/furpro2.0 (workspace cloud)
**Nota:** Este árbol NO incluye \`AppStateProvider\`, \`MenuHamburguesa\` moderno ni scripts \`audit:fase1\` del desktop local. Inventario del código presente.

## Conteos
| Tipo | Cantidad |
|------|----------|
| Archivos código src | ${fase1.counts.srcCodeFiles} |
| Pages | ${fase1.counts.pages} |
| Components | ${fase1.counts.components} |
| Hooks | ${fase1.counts.hooks} |
| Services | ${fase1.counts.services} |
| Contexts | ${fase1.counts.contexts} |
| Rutas App.jsx | ${fase1.counts.routesInAppJsx} |
| SQL | ${fase1.counts.sqlFiles} |
| Edge/functions candidatos | ${fase1.counts.edgeFunctionCandidates} |
| Engines/Bridges | ${fase1.counts.enginesBridges} |
| Eventos CustomEvent | ${fase1.counts.uniqueCustomEvents} |
| RPCs referenciados | ${fase1.counts.uniqueRpcNames} |
| Tablas .from() | ${fase1.counts.uniqueTableNames} |

## Dependencias clave
\`\`\`
${JSON.stringify(fase1.dependencies, null, 2)}
\`\`\`

## Providers / Contexts
${providers.map((p) => `- \`${p.file}\` — ${p.exports.join(', ')}`).join('\n') || '_ninguno_'}

## Rutas (App.jsx)
${routes.map((r) => `- \`${r}\``).join('\n')}

## RPCs
${[...rpcNames].sort().map((r) => `- \`${r}\``).join('\n') || '_ninguno detectado_'}

## Tablas Supabase (.from)
${[...tableNames].sort().map((t) => `- \`${t}\``).join('\n') || '_ninguna_'}

## Eventos
${[...eventNames].sort().map((e) => `- \`${e}\``).join('\n') || '_ninguno_'}

## SQL files (muestra)
${sqlFiles.slice(0, 50).map((s) => `- \`${s}\``).join('\n') || '_no hay .sql en este checkout_'}

## Edge/function candidates
${edgeCandidates.map((e) => `- \`${e}\``).join('\n') || '_no hay netlify/functions en este checkout_'}
`;
fs.writeFileSync(OUT('FASE1_INVENTARIO_<fecha>.md'), md1);

// ─── FASE 3 Auth ───
const authPatterns = [
  { name: 'getSession', re: /\.auth\.getSession\s*\(/g },
  { name: 'getUser', re: /\.auth\.getUser\s*\(/g },
  { name: 'refreshSession', re: /\.auth\.refreshSession\s*\(/g },
  { name: 'onAuthStateChange', re: /\.auth\.onAuthStateChange\s*\(/g },
];
const authRows = [];
for (const f of codeFiles) {
  const c = read(f);
  const lines = c.split('\n');
  for (const { name, re } of authPatterns) {
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i]) || lines[i].includes(`.auth.${name}`) || lines[i].includes(`${name}(`) && lines[i].includes('auth')) {
        // tighter check
      }
      re.lastIndex = 0;
    }
    let m;
    const r = new RegExp(re.source, 'g');
    while ((m = r.exec(c)) !== null) {
      const line = c.slice(0, m.index).split('\n').length;
      authRows.push({ method: name, file: rel(f), line, snippet: lines[line - 1]?.trim().slice(0, 160) || '' });
    }
  }
}
// also looser scan for bare calls
for (const f of codeFiles) {
  const lines = read(f).split('\n');
  lines.forEach((line, idx) => {
    for (const name of ['getSession', 'getUser', 'refreshSession', 'onAuthStateChange']) {
      if (line.includes(name) && (line.includes('auth') || line.includes('supabase'))) {
        const already = authRows.some((r) => r.file === rel(f) && r.line === idx + 1 && r.method === name);
        if (!already && new RegExp(`${name}\\s*\\(`).test(line)) {
          authRows.push({ method: name, file: rel(f), line: idx + 1, snippet: line.trim().slice(0, 160) });
        }
      }
    }
  });
}

const authSummary = {};
for (const row of authRows) authSummary[row.method] = (authSummary[row.method] || 0) + 1;

const csv3 = ['method,file,line,snippet', ...authRows.map((r) =>
  [r.method, r.file, r.line, `"${r.snippet.replace(/"/g, '""')}"`].join(','))].join('\n');
fs.writeFileSync(OUT('FASE3_AUTH_CALLS_<fecha>.csv'), csv3);
fs.writeFileSync(OUT('FASE3_AUTH_CALLS_<fecha>.json'), JSON.stringify({ summary: authSummary, total: authRows.length, rows: authRows }, null, 2));

// ─── FASE 4 static query inventory ───
const queryRows = [];
for (const f of codeFiles) {
  const lines = read(f).split('\n');
  lines.forEach((line, idx) => {
    const fromM = line.match(/\.from\(\s*['"]([^'"]+)['"]/);
    const rpcM = line.match(/\.rpc\(\s*['"]([^'"]+)['"]/);
    if (fromM) queryRows.push({ type: 'from', name: fromM[1], file: rel(f), line: idx + 1 });
    if (rpcM) queryRows.push({ type: 'rpc', name: rpcM[1], file: rel(f), line: idx + 1 });
  });
}
const queryByName = {};
for (const q of queryRows) {
  const k = `${q.type}:${q.name}`;
  queryByName[k] = (queryByName[k] || 0) + 1;
}
fs.writeFileSync(OUT('FASE4_SUPABASE_STATIC_<fecha>.json'), JSON.stringify({
  note: 'Inventario estático de call-sites. Duraciones/runtime en FASE4_SUPABASE_RUNTIME.',
  totalCallSites: queryRows.length,
  byName: Object.fromEntries(Object.entries(queryByName).sort((a, b) => b[1] - a[1])),
  rows: queryRows,
}, null, 2));

// ─── FASE 6 state ───
const stateReport = {
  contexts: providers,
  appProviderTree: ['AuthProvider', 'NotificationsProvider', 'Router/Routes'],
  localStorageKeys: new Set(),
  sessionStorageKeys: new Set(),
};
for (const f of codeFiles) {
  const c = read(f);
  for (const m of c.matchAll(/(?:localStorage|sessionStorage)\.(?:get|set)Item\(\s*['"]([^'"]+)['"]/g)) {
    if (c.includes('localStorage')) stateReport.localStorageKeys.add(m[1]);
  }
  for (const m of c.matchAll(/localStorage\.(?:get|set)Item\(\s*['"]([^'"]+)['"]/g)) stateReport.localStorageKeys.add(m[1]);
  for (const m of c.matchAll(/sessionStorage\.(?:get|set)Item\(\s*['"]([^'"]+)['"]/g)) stateReport.sessionStorageKeys.add(m[1]);
}
stateReport.localStorageKeys = [...stateReport.localStorageKeys].sort();
stateReport.sessionStorageKeys = [...stateReport.sessionStorageKeys].sort();
fs.writeFileSync(OUT('FASE6_ESTADO_GLOBAL_<fecha>.json'), JSON.stringify(stateReport, null, 2));
fs.writeFileSync(OUT('FASE6_ESTADO_GLOBAL_<fecha>.md'), `# FASE 6 — Estado global (${DATE})

## Árbol de providers (App.jsx)
\`AuthProvider → NotificationsProvider → Router\`

## Contexts
${providers.map((p) => `- ${p.file}`).join('\n')}

## localStorage keys detectadas
${stateReport.localStorageKeys.map((k) => `- \`${k}\``).join('\n') || '_ninguna_'}

## sessionStorage keys
${stateReport.sessionStorageKeys.map((k) => `- \`${k}\``).join('\n') || '_ninguna_'}

## Riesgos
- Auth + Notifications son las únicas fuentes Context; mucho estado vive en páginas (useState local) → riesgo de inconsistencia al navegar.
- Duplicación probable de sesión: AuthContext + llamadas getSession/getUser en páginas.
`);

// ─── FASE 7 useEffect ───
const effectRisks = [];
for (const f of codeFiles) {
  const c = read(f);
  const lines = c.split('\n');
  let useEffectCount = 0;
  lines.forEach((line, idx) => {
    if (/useEffect\s*\(/.test(line)) {
      useEffectCount++;
      // look ahead for empty deps or missing cleanup heuristics
      const window = lines.slice(idx, idx + 40).join('\n');
      const hasSupabase = /\.from\(|\.rpc\(|getSession|getUser|channel\(/.test(window);
      const hasSetState = /set[A-Z]\w+\s*\(/.test(window);
      const emptyDeps = /},\s*\[\s*\]\s*\)/.test(window);
      const missingDepsArray = /useEffect\s*\(\s*(?:async\s*)?\([^)]*\)\s*=>|useEffect\s*\(\s*function/.test(line)
        && !/},\s*\[/.test(window.slice(0, 500));
      const addListener = /addEventListener|supabase\.channel|\.subscribe\(/.test(window);
      const hasCleanup = /return\s*\(\s*\)\s*=>|return\s+function|return\s*\(\s*async/.test(window);
      if (hasSupabase || (addListener && !hasCleanup) || (hasSetState && hasSupabase)) {
        effectRisks.push({
          file: rel(f),
          line: idx + 1,
          hasSupabase,
          hasSetState,
          emptyDeps,
          addListener,
          hasCleanup,
          snippet: line.trim().slice(0, 100),
        });
      }
    }
  });
  if (useEffectCount >= 8) {
    effectRisks.push({
      file: rel(f),
      line: 0,
      note: `HIGH_EFFECT_COUNT:${useEffectCount}`,
      useEffectCount,
    });
  }
}
fs.writeFileSync(OUT('FASE7_USEEFFECT_<fecha>.json'), JSON.stringify({ totalRiskFlags: effectRisks.length, risks: effectRisks }, null, 2));

const effectMd = `# FASE 7 — useEffect alto riesgo (${DATE})

Total flags: **${effectRisks.length}**

## Archivos con muchos useEffect o efectos con Supabase/listeners
${effectRisks.filter((r) => r.note || r.hasSupabase || (r.addListener && !r.hasCleanup)).slice(0, 80).map((r) =>
  `- \`${r.file}:${r.line || '?'}\` ${r.note || ''} supabase=${!!r.hasSupabase} listener=${!!r.addListener} cleanup=${!!r.hasCleanup}`
).join('\n')}
`;
fs.writeFileSync(OUT('FASE7_USEEFFECT_<fecha>.md'), effectMd);

// ─── FASE 9 events / realtime ───
const listeners = [];
const intervals = [];
const channels = [];
for (const f of codeFiles) {
  const lines = read(f).split('\n');
  lines.forEach((line, idx) => {
    if (/addEventListener\s*\(/.test(line)) listeners.push({ file: rel(f), line: idx + 1, snippet: line.trim().slice(0, 140) });
    if (/setInterval\s*\(/.test(line)) intervals.push({ file: rel(f), line: idx + 1, snippet: line.trim().slice(0, 140) });
    if (/\.channel\s*\(|supabase\.channel/.test(line)) channels.push({ file: rel(f), line: idx + 1, snippet: line.trim().slice(0, 140) });
  });
}
fs.writeFileSync(OUT('FASE9_EVENTOS_<fecha>.json'), JSON.stringify({
  customEvents: [...eventNames].sort(),
  addEventListenerSites: listeners.length,
  setIntervalSites: intervals.length,
  channelSites: channels.length,
  listeners: listeners.slice(0, 300),
  intervals,
  channels,
}, null, 2));

console.log(JSON.stringify({
  ok: true,
  date: DATE,
  fase1: fase1.counts,
  auth: authSummary,
  authTotal: authRows.length,
  queries: queryRows.length,
  effectRisks: effectRisks.length,
  listeners: listeners.length,
  intervals: intervals.length,
  channels: channels.length,
}, null, 2));
