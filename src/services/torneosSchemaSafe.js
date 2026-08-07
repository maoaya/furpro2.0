/**
 * Lecturas de torneos tolerantes a schema drift (torneos_partidos / participantes / RPC).
 * Evita 400 spam y degrada a [] sin tumbar la UI.
 *
 * Schema real (public, 2026-08-07):
 * - torneos_partidos: estado_partido (NO estado / token_qr…)
 * - torneos_participantes: solo torneo_id, equipo_id, updated_at (NO usuario_id)
 * - RPC obtener_torneos_usuario: ausente → fallback por creador_id
 */
import { supabase } from '../config/supabase';
import { safeRpc, safeSelect } from '../utils/safeSelect.js';
import { isRpcDisabled, isTableDisabled } from '../utils/schemaCompatibilityGate.js';

export async function fetchTorneosUsuario(userId) {
  if (!userId) return [];
  if (!isRpcDisabled('obtener_torneos_usuario')) {
    const rpc = await safeRpc(supabase, 'obtener_torneos_usuario', { p_user_id: userId, user_id: userId });
    if (!rpc.error && Array.isArray(rpc.data)) return rpc.data;
  }

  for (const table of ['torneos', 'tournaments']) {
    if (isTableDisabled(table)) continue;
    for (const col of ['creador_id', 'organizer_id', 'created_by', 'user_id']) {
      const res = await safeSelect(
        supabase,
        table,
        ['id,nombre,name,estado,status,creador_id,fecha_inicio,created_at', 'id,nombre,estado,creador_id', '*'],
        (q) => q.eq(col, userId).limit(50)
      );
      if (!res.error && Array.isArray(res.data)) return res.data;
      if (res.skipped) break;
    }
  }
  return [];
}

export async function fetchTorneosPartidos(torneoId) {
  if (!torneoId || isTableDisabled('torneos_partidos')) return [];

  const selects = [
    'id,torneo_id,fecha_partido,estado_partido,equipo_a_id,equipo_b_id,arbitro_id,ubicacion,fase_torneo,goles_equipo_a,goles_equipo_b',
    'id,torneo_id,fecha_partido,estado_partido,equipo_a_id,equipo_b_id',
    'id,torneo_id,fecha_partido',
    'id,torneo_id',
    '*',
  ];

  let res = await safeSelect(supabase, 'torneos_partidos', selects, (q) =>
    q.eq('torneo_id', torneoId).order('fecha_partido', { ascending: true })
  );
  if (!res.error && res.data) return res.data;

  if (!isTableDisabled('torneos_partidos')) {
    res = await safeSelect(supabase, 'torneos_partidos', selects, (q) =>
      q.eq('torneo_id', torneoId).limit(100)
    );
    if (!res.error && res.data) return res.data;
  }
  return [];
}

/**
 * Participantes del torneo.
 * En el schema actual no hay columna de usuario: devolvemos equipos del torneo.
 * `userId` se acepta por compat de firma pero no se filtra en SQL.
 */
export async function fetchTorneosParticipantesEquipo(torneoId, _userId) {
  if (!torneoId || isTableDisabled('torneos_participantes')) return [];

  const res = await safeSelect(
    supabase,
    'torneos_participantes',
    ['torneo_id,equipo_id,updated_at', 'equipo_id', '*'],
    (q) => q.eq('torneo_id', torneoId).limit(50)
  );
  if (!res.error && Array.isArray(res.data)) return res.data;
  return [];
}
