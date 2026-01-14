import { supabase } from '../config/supabaseClient';

/**
 * 🏆 FUNCIONES PARA SISTEMA DE TORNEOS
 * Helpers para operaciones comunes en torneos
 */

/**
 * Obtener torneo por ID con datos completos
 */
export async function getTournamentById(tournamentId) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener todos los torneos disponibles (públicos)
 */
export async function getAvailableTournaments(filters = {}) {
  let query = supabase
    .from('tournaments')
    .select('*')
    .neq('status', 'draft')
    .order('tournament_start', { ascending: true });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.city) {
    query = query.eq('city', filters.city);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Inscribir equipo en torneo
 */
export async function registerTeamInTournament(tournamentId, teamId, captainId, roster = []) {
  const { data, error } = await supabase
    .from('tournament_registrations')
    .insert({
      tournament_id: tournamentId,
      team_id: teamId,
      captain_id: captainId,
      status: 'pending',
      initial_roster: roster
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Aceptar/rechazar invitación a torneo
 */
export async function respondTournamentInvitation(invitationId, accepted) {
  const { data, error } = await supabase
    .from('tournament_invitations')
    .update({
      status: accepted ? 'accepted' : 'rejected',
      responded_at: new Date().toISOString()
    })
    .eq('id', invitationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Generar grupos automáticamente
 */
export async function generateGroups(tournamentId, numGroups = 4) {
  // Obtener equipos registrados y aceptados
  const { data: registrations, error: regError } = await supabase
    .from('tournament_registrations')
    .select('*')
    .eq('tournament_id', tournamentId)
    .in('status', ['accepted', 'paid']);

  if (regError) throw regError;

  if (registrations.length < numGroups) {
    throw new Error('No hay suficientes equipos para los grupos');
  }

  // Crear grupos A, B, C, D, etc.
  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const groups = [];
  
  for (let i = 0; i < numGroups; i++) {
    const { data: group, error: groupError } = await supabase
      .from('tournament_groups')
      .insert({
        tournament_id: tournamentId,
        group_name: groupNames[i],
        group_order: i + 1
      })
      .select()
      .single();

    if (groupError) throw groupError;
    groups.push(group);
  }

  // Distribuir equipos en grupos (serpenteo)
  const shuffled = [...registrations].sort(() => Math.random() - 0.5);
  const assignments = [];

  for (let i = 0; i < shuffled.length; i++) {
    const groupIndex = i % numGroups;
    assignments.push({
      group_id: groups[groupIndex].id,
      team_id: shuffled[i].team_id,
      registration_id: shuffled[i].id
    });
  }

  const { error: assignError } = await supabase
    .from('tournament_group_teams')
    .insert(assignments);

  if (assignError) throw assignError;

  return { groups, assignments };
}

/**
 * Obtener tabla de posiciones de un grupo
 */
export async function getGroupStandings(groupId) {
  const { data, error } = await supabase
    .from('tournament_group_teams')
    .select('*')
    .eq('group_id', groupId)
    .order('points', { ascending: false })
    .order('goal_difference', { ascending: false })
    .order('goals_for', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Obtener partidos de un torneo
 */
export async function getTournamentMatches(tournamentId, filters = {}) {
  let query = supabase
    .from('tournament_matches')
    .select('*')
    .eq('tournament_id', tournamentId);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.groupId) {
    query = query.eq('group_id', filters.groupId);
  }

  if (filters.refereeId) {
    query = query.eq('referee_id', filters.refereeId);
  }

  query = query.order('match_date', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Asignar árbitro a partido
 */
export async function assignRefereeToMatch(matchId, refereeId) {
  const { data, error } = await supabase
    .from('tournament_matches')
    .update({
      referee_id: refereeId,
      referee_assigned_at: new Date().toISOString()
    })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;

  // Crear notificación para el árbitro
  await supabase.from('tournament_notifications').insert({
    tournament_id: data.tournament_id,
    recipient_id: refereeId,
    notification_type: 'referee_assigned',
    title: 'Nuevo partido asignado',
    message: `Se te ha asignado como árbitro de un partido el ${new Date(data.match_date).toLocaleDateString('es-ES')}`
  });

  return data;
}

/**
 * Obtener estadísticas de jugador en torneo
 */
export async function getPlayerTournamentStats(tournamentId, playerId) {
  const { data, error } = await supabase
    .from('tournament_player_stats')
    .select('*')
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No existe
    throw error;
  }
  return data;
}

/**
 * Obtener goleadores del torneo
 */
export async function getTournamentTopScorers(tournamentId, limit = 10) {
  const { data, error } = await supabase
    .from('tournament_player_stats')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('goals', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Obtener jugadores sancionados
 */
export async function getSuspendedPlayers(tournamentId) {
  const { data, error } = await supabase
    .from('tournament_player_stats')
    .select('*')
    .eq('tournament_id', tournamentId)
    .eq('is_suspended', true);

  if (error) throw error;
  return data;
}

/**
 * Verificar si un partido requiere transmisión
 */
export async function checkStreamingRequirement(matchId) {
  const { data: match, error: matchError } = await supabase
    .from('tournament_matches')
    .select('tournament_id')
    .eq('id', matchId)
    .single();

  if (matchError) throw matchError;

  const { data: tournament, error: tournError } = await supabase
    .from('tournaments')
    .select('requires_streaming, min_streams_required')
    .eq('id', match.tournament_id)
    .single();

  if (tournError) throw tournError;

  return {
    required: tournament.requires_streaming,
    minStreams: tournament.min_streams_required
  };
}

/**
 * Marcar partido como transmitido
 */
export async function markMatchAsStreamed(matchId, streamId) {
  const { data, error } = await supabase
    .from('tournament_matches')
    .update({
      stream_id: streamId,
      was_streamed: true
    })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener notificaciones no leídas de torneos
 */
export async function getUnreadTournamentNotifications(userId) {
  const { data, error } = await supabase
    .from('tournament_notifications')
    .select('*')
    .eq('recipient_id', userId)
    .is('read_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Marcar notificación como leída
 */
export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('tournament_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener brackets/llaves de un torneo
 */
export async function getTournamentBrackets(tournamentId, round = null) {
  let query = supabase
    .from('tournament_brackets')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('round_order', { ascending: true })
    .order('match_number', { ascending: true });

  if (round) {
    query = query.eq('round_name', round);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Generar fixtures para fase de grupos
 */
export async function generateGroupFixtures(tournamentId, groupId, matchDates = []) {
  const { data: teams, error: teamsError } = await supabase
    .from('tournament_group_teams')
    .select('team_id')
    .eq('group_id', groupId);

  if (teamsError) throw teamsError;

  const teamIds = teams.map(t => t.team_id);
  const matches = [];
  let dateIndex = 0;

  // Generar todos contra todos
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      matches.push({
        tournament_id: tournamentId,
        group_id: groupId,
        home_team_id: teamIds[i],
        away_team_id: teamIds[j],
        match_date: matchDates[dateIndex % matchDates.length] || new Date().toISOString(),
        match_round: Math.floor(dateIndex / (teamIds.length / 2)) + 1,
        status: 'scheduled'
      });
      dateIndex++;
    }
  }

  const { error: insertError } = await supabase
    .from('tournament_matches')
    .insert(matches);

  if (insertError) throw insertError;
  return matches;
}

/**
 * Calcular puntos según sistema del torneo
 */
export function calculatePoints(homeScore, awayScore, decidedByPenalties, homeWonPenalties, scoringSystem = 'standard') {
  if (scoringSystem === 'standard') {
    if (homeScore > awayScore) return { home: 3, away: 0 };
    if (homeScore < awayScore) return { home: 0, away: 3 };
    return { home: 1, away: 1 };
  }

  if (scoringSystem === 'zero_draw') {
    if (homeScore > awayScore) return { home: 3, away: 0 };
    if (homeScore < awayScore) return { home: 0, away: 3 };
    
    // Empate con penaltis: 1+1 + 1 al ganador
    if (decidedByPenalties) {
      return homeWonPenalties 
        ? { home: 2, away: 1 }
        : { home: 1, away: 2 };
    }
    return { home: 1, away: 1 };
  }

  // Standard por defecto
  return { home: 1, away: 1 };
}

export default {
  getTournamentById,
  getAvailableTournaments,
  registerTeamInTournament,
  respondTournamentInvitation,
  generateGroups,
  getGroupStandings,
  getTournamentMatches,
  assignRefereeToMatch,
  getPlayerTournamentStats,
  getTournamentTopScorers,
  getSuspendedPlayers,
  checkStreamingRequirement,
  markMatchAsStreamed,
  getUnreadTournamentNotifications,
  markNotificationAsRead,
  getTournamentBrackets,
  generateGroupFixtures,
  calculatePoints
};
