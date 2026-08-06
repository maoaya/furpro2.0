/**
 * FP-SB-001 — Circuit-breaker de schema drift.
 * Tras 404/400 (tabla/RPC/relación inexistente) no se reintenta en la sesión.
 */
const STORAGE_KEY = 'futpro:schema-gate:v1';

const normalize = (value) => String(value || '').trim().toLowerCase();

const readStore = () => {
  if (typeof sessionStorage === 'undefined') {
    return { tables: [], rpcs: [] };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { tables: [], rpcs: [] };
    const parsed = JSON.parse(raw);
    return {
      tables: Array.isArray(parsed?.tables) ? parsed.tables.map(normalize).filter(Boolean) : [],
      rpcs: Array.isArray(parsed?.rpcs) ? parsed.rpcs.map(normalize).filter(Boolean) : [],
    };
  } catch {
    return { tables: [], rpcs: [] };
  }
};

const writeStore = (tables, rpcs) => {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      tables: [...tables],
      rpcs: [...rpcs],
    }));
  } catch {
    // no-op
  }
};

const disabledTables = new Set(readStore().tables);
const disabledRpcs = new Set(readStore().rpcs);

const persist = () => writeStore(disabledTables, disabledRpcs);

export const isSchemaError = (error) => {
  if (!error) return false;
  const status = Number(error?.status || error?.statusCode || 0);
  const code = String(error?.code || '');
  const msg = String(error?.message || error?.details || error?.hint || '').toLowerCase();
  if (status === 404 || status === 400) return true;
  if (code === '404' || code === '400') return true;
  if (
    code === '42P01'
    || code === 'PGRST205'
    || code === 'PGRST200'
    || code === 'PGRST204'
    || code === 'PGRST201'
    || code === 'PGRST202'
  ) {
    return true;
  }
  if (
    msg.includes('does not exist')
    || msg.includes('could not find')
    || msg.includes('relationship')
    || msg.includes('schema cache')
    || msg.includes('not find the table')
    || msg.includes('failed to parse')
    || msg.includes('foreign key')
  ) {
    return true;
  }
  return false;
};

export const isTableDisabled = (tableName) => disabledTables.has(normalize(tableName));

export const markTableDisabled = (tableName, reason = '') => {
  const key = normalize(tableName);
  if (!key || disabledTables.has(key)) return false;
  disabledTables.add(key);
  persist();
  if (typeof console !== 'undefined') {
    console.debug(`[schema-gate] table disabled: ${key}`, reason || '');
  }
  return true;
};

export const isRpcDisabled = (rpcName) => disabledRpcs.has(normalize(rpcName));

export const markRpcDisabled = (rpcName, reason = '') => {
  const key = normalize(rpcName);
  if (!key || disabledRpcs.has(key)) return false;
  disabledRpcs.add(key);
  persist();
  if (typeof console !== 'undefined') {
    console.debug(`[schema-gate] rpc disabled: ${key}`, reason || '');
  }
  return true;
};

/** Marca tabla/RPC si el error es de schema; devuelve true si quedó deshabilitado o ya lo estaba. */
export const disableOnSchemaError = (error, { table, rpc } = {}) => {
  if (!isSchemaError(error)) return false;
  if (table) markTableDisabled(table, error?.message || error);
  if (rpc) markRpcDisabled(rpc, error?.message || error);
  return true;
};

const tableInflight = new Map();
const rpcInflight = new Map();

/**
 * Deduplica probes concurrentes (React StrictMode / efectos dobles)
 * para no spamear el mismo 404/400 dos veces antes de marcar el gate.
 */
export const withTableProbe = async (tableName, fn) => {
  const key = normalize(tableName);
  if (!key) return fn();
  if (disabledTables.has(key)) {
    return { skipped: true, data: null, error: { message: `table disabled: ${key}`, code: 'SCHEMA_GATE' } };
  }
  if (tableInflight.has(key)) return tableInflight.get(key);
  const pending = (async () => {
    try {
      return await fn();
    } finally {
      tableInflight.delete(key);
    }
  })();
  tableInflight.set(key, pending);
  return pending;
};

export const withRpcProbe = async (rpcName, fn) => {
  const key = normalize(rpcName);
  if (!key) return fn();
  if (disabledRpcs.has(key)) {
    return { skipped: true, data: null, error: { message: `rpc disabled: ${key}`, code: 'SCHEMA_GATE' } };
  }
  if (rpcInflight.has(key)) return rpcInflight.get(key);
  const pending = (async () => {
    try {
      return await fn();
    } finally {
      rpcInflight.delete(key);
    }
  })();
  rpcInflight.set(key, pending);
  return pending;
};
