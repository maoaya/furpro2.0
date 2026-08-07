/**
 * Select progresivo ante 400/PGRST204 (columnas inexistentes).
 * Evita spam de Bad Request cuando el schema diverge.
 */
import {
  disableOnSchemaError,
  isMissingColumnError,
  isMissingRelationError,
  isSchemaError,
  isTableDisabled,
  markTableDisabled,
} from './schemaCompatibilityGate.js';

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {string} table
 * @param {string[]} selectCandidates - de más específico a más seguro ('*' al final)
 * @param {(q: any) => any} applyFilters - recibe el builder tras .from().select()
 * @param {{ filterCandidates?: Array<(q: any) => any> }} [options]
 */
export async function safeSelect(client, table, selectCandidates, applyFilters = (q) => q, options = {}) {
  if (isTableDisabled(table)) {
    return { data: null, error: { message: `table disabled: ${table}`, code: 'SCHEMA_GATE' }, skipped: true };
  }

  const candidates = Array.isArray(selectCandidates) && selectCandidates.length
    ? selectCandidates
    : ['*'];

  const filterFns = Array.isArray(options.filterCandidates) && options.filterCandidates.length
    ? options.filterCandidates
    : [applyFilters];

  let lastError = null;
  for (const filterFn of filterFns) {
    for (const sel of candidates) {
      try {
        let query = client.from(table).select(sel);
        query = (typeof filterFn === 'function' ? filterFn(query) : query) || query;
        const { data, error } = await query;
        if (!error) return { data, error: null, selectUsed: sel };

        lastError = error;

        if (isMissingRelationError(error)) {
          markTableDisabled(table, error?.message || error);
          return { data: null, error, selectUsed: sel, skipped: true };
        }

        // Columna/filtro inválido → probar siguiente combinación; no apagar tabla
        if (isMissingColumnError(error) || isSchemaError(error)) {
          continue;
        }

        return { data: null, error, selectUsed: sel };
      } catch (e) {
        lastError = e;
        if (isMissingRelationError(e)) {
          markTableDisabled(table, e?.message || e);
          return { data: null, error: e, skipped: true };
        }
        if (isSchemaError(e)) continue;
      }
    }
  }

  if (lastError) disableOnSchemaError(lastError, { table });
  return { data: null, error: lastError };
}

/**
 * RPC con gate: no reintentar tras 404/400 schema permanente.
 * NETWORK_ERROR/503 no marca gate permanente (un intento soft).
 */
export async function safeRpc(client, rpcName, args = {}) {
  const { isRpcDisabled, markRpcDisabled, withRpcProbe, disableOnSchemaError: disable } = await import('./schemaCompatibilityGate.js');
  if (isRpcDisabled(rpcName)) {
    return { data: null, error: { message: `rpc disabled: ${rpcName}`, code: 'SCHEMA_GATE' }, skipped: true };
  }
  return withRpcProbe(rpcName, async () => {
    try {
      const { data, error } = await client.rpc(rpcName, args);
      if (error) {
        const status = Number(error.status || error.statusCode || 0);
        const code = String(error.code || '');
        if (status === 503 || code === 'NETWORK_ERROR') {
          return { data: null, error };
        }
        // PGRST202 / 404 función → gate RPC
        disable(error, { rpc: rpcName });
      }
      return { data, error };
    } catch (e) {
      const msg = String(e?.message || e);
      if (/failed to fetch|network/i.test(msg)) {
        return { data: null, error: { message: msg, code: 'NETWORK_ERROR', status: 503 } };
      }
      markRpcDisabled(rpcName, msg);
      return { data: null, error: e };
    }
  });
}
