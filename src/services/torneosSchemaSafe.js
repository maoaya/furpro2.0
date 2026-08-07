/**
 * Lecturas de torneos tolerantes a schema drift (torneos_partidos / participantes / RPC).
 * Evita 400 spam y degrada a [] sin tumbar la UI.
 */
import { supabase } from '../config/supabase';
import { safeRpc, safeSelect } from '../utils/safeSelect.js';
import { isRpcDisabled, isTableDisabled } from '../utils/schemaCompatibilityGate.js';

export async function fetchTorneosUsuario(userId) {
  if (!userId) return [];
  if (!isRpcDisabled('obtener_torneos_usuario')) {
    const rpc = await safeRpc(supabase, 'obtener_torneos_usuario', { p_user_id: userId, user_id: userId });
    if (!rpc.error && Array.isArray(rpc.data)) return rpc.data;
    // NETWORK_ERROR/503: no spamear — un solo intento por mount
  }
  for (const table of ['tournaments', 'torneos']) {
    if (isTableDisabled(table)) continue;
    for (const col of ['organizer_id', 'created_by', 'user_id', 'organizer_email']) {
      const res = await safeSelect(supabase, table, ['id,name,nombre,status,estado,created_at', '*'], (q) =>
        q.eq(col, userId).limit(50)
      );
      if (!res.error && Array.isArray(res.data) && res.data.length) return res.data;
      if (res.skipped) break;
    }
  }
  return [];
}

export async function fetchTorneosPartidos(torneoId) {
  if (!torneoId || isTableDisabled('torneos_partidos')) return [];

  const selects = [
    'id,torneo_id,fecha_partido,estado_partido,estado,equipo_a_id,equipo_b_id,arbitro_id,ubicacion,fase_torneo,goles_equipo_a,goles_equipo_b',
    'id,torneo_id,fecha_partido,estado,equipo_a_id,equipo_b_id',
    'id,torneo_id',
    '*',
  ];

  // Con order (si fecha_partido existe)
  let res = await safeSelect(supabase, 'torneos_partidos', selects, (q) =>
    q.eq('torneo_id', torneoId).order('fecha_partido', { ascending: true })
  );
  if (!res.error && res.data) return res.data;

  // Sin order (columna fecha_partido puede no existir)
  if (!isTableDisabled('torneos_partidos')) {
    res = await safeSelect(supabase, 'torneos_partidos', selects, (q) =>
      q.eq('torneo_id', torneoId).limit(100)
    );
    if (!res.error && res.data) return res.data;
  }
  return [];
}

export async function fetchTorneosParticipantesEquipo(torneoId, userId) {
  if (!torneoId || !userId || isTableDisabled('torneos_participantes')) return [];

  // Probar columnas de usuario una a una (el OR con 3 cols inexistentes → 400)
  for (const col of ['usuario_id', 'user_id', 'auth_user_id']) {
    const res = await safeSelect(
      supabase,
      'torneos_participantes',
      ['equipo_id', 'equipo_id,usuario_id', 'equipo_id,user_id', '*'],
      (q) => q.eq('torneo_id', torneoId).eq(col, userId).limit(5)
    );
    if (!res.error && Array.isArray(res.data)) return res.data;
    if (res.skipped) return [];
  }
  return [];
}
