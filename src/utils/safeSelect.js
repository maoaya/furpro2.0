/**
 * Select progresivo ante 400/PGRST204 (columnas inexistentes).
 * Evita spam de Bad Request cuando el schema diverge.
 */
import { disableOnSchemaError, isSchemaError, isTableDisabled, markTableDisabled } from './schemaCompatibilityGate.js';

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {string} table
 * @param {string[]} selectCandidates - de más específico a más seguro ('*' al final)
 * @param {(q: any) => any} applyFilters - recibe el builder tras .from().select()
 */
export async function safeSelect(client, table, selectCandidates, applyFilters = (q) => q) {
  if (isTableDisabled(table)) {
    return { data: null, error: { message: `table disabled: ${table}`, code: 'SCHEMA_GATE' }, skipped: true };
  }

  const candidates = Array.isArray(selectCandidates) && selectCandidates.length
    ? selectCandidates
    : ['*'];

  let lastError = null;
  for (const sel of candidates) {
    try {
      let query = client.from(table).select(sel);
      query = applyFilters(query) || query;
      const { data, error } = await query;
      if (!error) return { data, error: null, selectUsed: sel };

      lastError = error;
      // Columna/relación inválida → probar siguiente select; tabla inexistente → gate
      const msg = String(error.message || '').toLowerCase();
      const columnIssue =
        isSchemaError(error) &&
        (msg.includes('column') ||
          msg.includes('could not find') ||
          msg.includes('pgrst204') ||
          String(error.code || '') === 'PGRST204' ||
          String(error.code || '') === '42703');

      if (columnIssue && sel !== '*') continue;

      disableOnSchemaError(error, { table });
      return { data: null, error, selectUsed: sel };
    } catch (e) {
      lastError = e;
      if (isSchemaError(e)) {
        markTableDisabled(table, e?.message || e);
        return { data: null, error: e, skipped: true };
      }
    }
  }

  if (lastError) disableOnSchemaError(lastError, { table });
  return { data: null, error: lastError };
}

/**
 * RPC con gate: no reintentar tras 404/400/503 schema/network permanente.
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
        // 503/network: no gate permanente; schema sí
        if (status === 503 || String(error.code || '') === 'NETWORK_ERROR') {
          return { data: null, error };
        }
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
