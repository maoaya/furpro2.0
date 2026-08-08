/**
 * Proxy same-origin → TheSportsDB (evita CORS del navegador y amortigua 429).
 * Usado por functions/zona-pro-ai.js y scripts/serve-producto.mjs
 */

const BASE = 'https://www.thesportsdb.com/api/v1/json';
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHE = 200;
const MIN_GAP_MS = 350;

const cache = new Map();
let lastFetchAt = 0;
let chain = Promise.resolve();

function apiKey() {
  const k = String(
    process.env.VITE_THESPORTSDB_KEY ||
      process.env.THESPORTSDB_KEY ||
      process.env.THESPORTSDB_API_KEY ||
      '123',
  )
    .trim();
  return k || '123';
}

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key, value) {
  if (cache.size >= MAX_CACHE) {
    const first = cache.keys().next().value;
    if (first != null) cache.delete(first);
  }
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchSportsDbPath(path) {
  const clean = String(path || '')
    .replace(/^\/+/, '')
    .trim();
  if (!clean || clean.includes('..')) {
    return { ok: false, status: 400, body: { error: 'path inválido' } };
  }

  const cacheKey = `v1:${clean}`;
  const cached = cacheGet(cacheKey);
  if (cached != null) {
    return { ok: true, status: 200, body: cached, cached: true };
  }

  const run = async () => {
    const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastFetchAt));
    if (wait) await sleep(wait);
    lastFetchAt = Date.now();

    const url = `${BASE}/${apiKey()}/${clean}`;
    let res;
    try {
      res = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'ZonaPro-SportsDB-Proxy/1.0' },
      });
    } catch (err) {
      return { ok: false, status: 502, body: { error: err.message || 'fetch failed' } };
    }

    if (res.status === 429) {
      await sleep(1500);
      lastFetchAt = Date.now();
      try {
        res = await fetch(url, {
          headers: { Accept: 'application/json', 'User-Agent': 'ZonaPro-SportsDB-Proxy/1.0' },
        });
      } catch (err) {
        return { ok: false, status: 502, body: { error: err.message || 'fetch failed' } };
      }
    }

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: 'respuesta no JSON', raw: text.slice(0, 200) };
    }

    if (!res.ok) {
      return { ok: false, status: res.status, body: data || { error: `HTTP ${res.status}` } };
    }

    cacheSet(cacheKey, data);
    return { ok: true, status: 200, body: data, cached: false };
  };

  const result = chain.then(run, run);
  chain = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

function mapEvent(ev, sport = 'Fútbol') {
  if (!ev || !ev.strHomeTeam || !ev.strAwayTeam) return null;
  const dateEvent = String(ev.dateEvent || '').slice(0, 10);
  return {
    id: ev.idEvent || `${ev.strHomeTeam}-${ev.strAwayTeam}-${dateEvent}`,
    home: ev.strHomeTeam,
    away: ev.strAwayTeam,
    dateEvent,
    kickoffAt: ev.strTimestamp || (dateEvent ? `${dateEvent}T${ev.strTime || '12:00:00'}` : null),
    league: ev.strLeague || '',
    leagueId: ev.idLeague || '',
    homeScore: ev.intHomeScore ?? null,
    awayScore: ev.intAwayScore ?? null,
    status: ev.strStatus || '',
    clock: ev.strProgress || ev.strStatus || '',
    sport: ev.strSport || sport,
    isLive: /progress|live|halftime|ht|in play|1h|2h/i.test(
      String(ev.strStatus || ev.strProgress || ''),
    ),
    source: 'thesportsdb',
    real: true,
    synthetic: false,
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function handleSportsdb(body) {
  const path = String(body.path || body.endpoint || '').trim();
  const result = await fetchSportsDbPath(path);
  if (!result.ok) {
    return { statusCode: result.status || 502, body: { error: true, ...(result.body || {}) } };
  }
  // Cliente: (a?.payload) ?? a
  return { statusCode: 200, body: { payload: result.body, cached: !!result.cached } };
}

async function handleFixtures(body) {
  const sport = String(body.sport || 'Soccer').trim() || 'Soccer';
  const day = String(body.day || todayISO()).slice(0, 10);
  const limit = Math.min(Number(body.limit) || 40, 120);
  const leagueIds = Array.isArray(body.leagueIds)
    ? body.leagueIds.map((id) => String(id).trim()).filter(Boolean).slice(0, 12)
    : [];

  const fixtures = [];
  const seen = new Set();

  const dayRes = await fetchSportsDbPath(
    `eventsday.php?d=${encodeURIComponent(day)}&s=${encodeURIComponent(sport === 'Fútbol' ? 'Soccer' : sport)}`,
  );
  const dayEvents = Array.isArray(dayRes.body?.events) ? dayRes.body.events : [];
  for (const ev of dayEvents) {
    const row = mapEvent(ev, body.sport || 'Fútbol');
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    fixtures.push(row);
  }

  for (const id of leagueIds) {
    if (fixtures.length >= limit) break;
    const res = await fetchSportsDbPath(`eventsnextleague.php?id=${encodeURIComponent(id)}`);
    const events = Array.isArray(res.body?.events) ? res.body.events : [];
    for (const ev of events) {
      const row = mapEvent(ev, body.sport || 'Fútbol');
      if (!row || seen.has(row.id)) continue;
      if (body.todayOnly && row.dateEvent !== day) continue;
      seen.add(row.id);
      fixtures.push(row);
      if (fixtures.length >= limit) break;
    }
  }

  return { statusCode: 200, body: { fixtures: fixtures.slice(0, limit), source: 'thesportsdb' } };
}

async function handleLive(body) {
  const sport = String(body.sport || 'Soccer').trim() || 'Soccer';
  const limit = Math.min(Number(body.limit) || 20, 60);
  const sportParam = sport === 'Fútbol' ? 'Soccer' : sport;
  const day = todayISO();

  const res = await fetchSportsDbPath(
    `eventsday.php?d=${encodeURIComponent(day)}&s=${encodeURIComponent(sportParam)}`,
  );
  const events = Array.isArray(res.body?.events) ? res.body.events : [];
  const live = events
    .map((ev) => mapEvent(ev, body.sport || 'Fútbol'))
    .filter((row) => row && row.isLive)
    .slice(0, limit);

  return {
    statusCode: 200,
    body: { live, matches: live, sourcesUsed: ['thesportsdb'] },
  };
}

async function handleCompetition(body) {
  const sportsDbId = String(body.sportsDbId || body.id || '').trim();
  if (!sportsDbId || !/^\d+$/.test(sportsDbId)) {
    return { statusCode: 200, body: { teams: [], table: [], fixtures: [], past: [] } };
  }

  const [teamsRes, tableRes, nextRes, pastRes] = await Promise.all([
    fetchSportsDbPath(`lookup_all_teams.php?id=${encodeURIComponent(sportsDbId)}`),
    fetchSportsDbPath(`lookuptable.php?l=${encodeURIComponent(sportsDbId)}`),
    fetchSportsDbPath(`eventsnextleague.php?id=${encodeURIComponent(sportsDbId)}`),
    fetchSportsDbPath(`eventspastleague.php?id=${encodeURIComponent(sportsDbId)}`),
  ]);

  const teams = (Array.isArray(teamsRes.body?.teams) ? teamsRes.body.teams : []).map((t) => ({
    id: t.idTeam,
    name: t.strTeam,
    badge: t.strBadge || t.strTeamBadge || '',
    stadium: t.strStadium || '',
  }));

  const table = (Array.isArray(tableRes.body?.table) ? tableRes.body.table : []).map((row) => ({
    name: row.strTeam || row.name,
    team: row.strTeam,
    played: row.intPlayed,
    win: row.intWin,
    draw: row.intDraw,
    loss: row.intLoss,
    goalsFor: row.intGoalsFor,
    goalsAgainst: row.intGoalsAgainst,
    points: row.intPoints,
    badge: row.strTeamBadge || '',
  }));

  const fixtures = (Array.isArray(nextRes.body?.events) ? nextRes.body.events : [])
    .map((ev) => mapEvent(ev, body.sport || 'Fútbol'))
    .filter(Boolean)
    .slice(0, 40);

  const past = (Array.isArray(pastRes.body?.events) ? pastRes.body.events : [])
    .map((ev) => mapEvent(ev, body.sport || 'Fútbol'))
    .filter(Boolean)
    .slice(0, 40);

  return { statusCode: 200, body: { teams, table, fixtures, past } };
}

async function handleTeamRoster(body) {
  const teamId = String(body.teamId || '').trim();
  if (!teamId || !/^\d+$/.test(teamId)) {
    return { statusCode: 200, body: { players: [] } };
  }
  const res = await fetchSportsDbPath(`lookup_all_players.php?id=${encodeURIComponent(teamId)}`);
  const players = (Array.isArray(res.body?.player) ? res.body.player : []).map((p) => ({
    id: p.idPlayer,
    name: p.strPlayer,
    position: p.strPosition || '',
    number: p.strNumber || '',
    photo: p.strCutout || p.strThumb || '',
    nationality: p.strNationality || '',
    injured: p.strInjured || '',
  }));
  return { statusCode: 200, body: { players } };
}

export async function handleZonaProAction(body = {}) {
  const action = String(body.action || '').trim().toLowerCase();

  switch (action) {
    case 'sportsdb':
      return handleSportsdb(body);
    case 'fixtures':
      return handleFixtures(body);
    case 'live':
      return handleLive(body);
    case 'competition':
      return handleCompetition(body);
    case 'team-roster':
      return handleTeamRoster(body);
    case 'torneos-zp':
      return { statusCode: 200, body: { torneos: [] } };
    case 'on-follow':
      return { statusCode: 200, body: { ok: true } };
    case 'ping':
    case 'health':
      return { statusCode: 200, body: { ok: true, service: 'zona-pro-ai' } };
    default:
      return {
        statusCode: 400,
        body: { error: `action desconocida: ${action || '(vacía)'}`, ok: false },
      };
  }
}

export { fetchSportsDbPath, apiKey };
