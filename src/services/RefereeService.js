import { supabase } from '../config/supabase';

/**
 * 👨‍⚖️ FUNCIONES PARA SISTEMA DE ÁRBITROS
 * Helpers para operaciones específicas de árbitros
 */

/**
 * Registrar árbitro en la base de datos
 */
export async function registerReferee(userId, licenseNumber, certificationLevel, experienceYears, specialties = []) {
  const { data, error } = await supabase
    .from('tournament_referees')
    .upsert({
      user_id: userId,
      license_number: licenseNumber,
      certification_level: certificationLevel,
      experience_years: experienceYears,
      specialties: specialties,
      is_available: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener información completa de un árbitro
 */
export async function getRefereeProfile(userId) {
  const { data, error } = await supabase
    .from('tournament_referees')
    .select(`
      *,
      carfutpro:user_id (
        nombre,
        apellido,
        email,
        avatar_url,
        ciudad,
        fecha_nacimiento
      )
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No existe perfil de árbitro
    throw error;
  }
  return data;
}

/**
 * Buscar árbitros disponibles
 */
export async function getAvailableReferees(filters = {}) {
  let query = supabase
    .from('tournament_referees')
    .select(`
      *,
      carfutpro:user_id (
        nombre,
        apellido,
        avatar_url,
        ciudad
      )
    `)
    .eq('is_available', true)
    .eq('is_suspended', false);

  // Filtrar por nivel de certificación
  if (filters.certificationLevel) {
    query = query.eq('certification_level', filters.certificationLevel);
  }

  // Filtrar por experiencia mínima
  if (filters.minExperience) {
    query = query.gte('experience_years', filters.minExperience);
  }

  // Filtrar por ciudad
  if (filters.ciudad) {
    query = query.eq('carfutpro.ciudad', filters.ciudad);
  }

  // Ordenar por rating (mejor primero)
  query = query.order('average_rating', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Obtener partidos asignados a un árbitro
 */
export async function getRefereeAssignedMatches(refereeId, filters = {}) {
  let query = supabase
    .from('tournament_matches')
    .select(`
      *,
      tournament:tournament_id (
        name,
        category,
        start_date
      ),
      home_team:home_team_id (name, logo_url),
      away_team:away_team_id (name, logo_url)
    `)
    .eq('referee_id', refereeId);

  // Filtrar por estado del partido
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Filtrar por rango de fechas
  if (filters.startDate) {
    query = query.gte('match_date', filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte('match_date', filters.endDate);
  }

  query = query.order('match_date', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Verificar si un árbitro ya tiene partido a esa hora
 */
export async function checkRefereeAvailability(refereeId, matchDate, duration = 120) {
  const startTime = new Date(matchDate);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const { data, error } = await supabase
    .from('tournament_matches')
    .select('id, match_date')
    .eq('referee_id', refereeId)
    .in('status', ['scheduled', 'in_progress'])
    .gte('match_date', startTime.toISOString())
    .lte('match_date', endTime.toISOString());

  if (error) throw error;
  return data.length === 0; // True si está disponible
}

/**
 * Crear reporte de árbitro para un partido
 */
export async function createRefereeReport(matchId, refereeId, reportData) {
  const { data, error } = await supabase
    .from('tournament_referee_reports')
    .insert({
      match_id: matchId,
      referee_id: refereeId,
      home_score: reportData.homeScore,
      away_score: reportData.awayScore,
      decided_by_penalties: reportData.decidedByPenalties || false,
      home_won_penalties: reportData.homeWonPenalties || null,
      home_yellow_cards: reportData.homeYellowCards || 0,
      home_red_cards: reportData.homeRedCards || 0,
      away_yellow_cards: reportData.awayYellowCards || 0,
      away_red_cards: reportData.awayRedCards || 0,
      incidents: reportData.incidents || null,
      notes: reportData.notes || null,
      player_stats: reportData.playerStats || []
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener reportes creados por un árbitro
 */
export async function getRefereeReports(refereeId, limit = 50) {
  const { data, error } = await supabase
    .from('tournament_referee_reports')
    .select(`
      *,
      match:match_id (
        match_date,
        tournament:tournament_id (name),
        home_team:home_team_id (name, logo_url),
        away_team:away_team_id (name, logo_url)
      )
    `)
    .eq('referee_id', refereeId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Actualizar disponibilidad de árbitro
 */
export async function updateRefereeAvailability(userId, isAvailable) {
  const { data, error } = await supabase
    .from('tournament_referees')
    .update({ is_available: isAvailable })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener estadísticas de un árbitro
 */
export async function getRefereeStats(refereeId) {
  // Contar partidos dirigidos
  const { count: matchesDirected } = await supabase
    .from('tournament_referee_reports')
    .select('*', { count: 'exact', head: true })
    .eq('referee_id', refereeId);

  // Contar tarjetas mostradas
  const { data: reports } = await supabase
    .from('tournament_referee_reports')
    .select('home_yellow_cards, home_red_cards, away_yellow_cards, away_red_cards')
    .eq('referee_id', refereeId);

  let totalYellowCards = 0;
  let totalRedCards = 0;

  reports?.forEach(report => {
    totalYellowCards += (report.home_yellow_cards || 0) + (report.away_yellow_cards || 0);
    totalRedCards += (report.home_red_cards || 0) + (report.away_red_cards || 0);
  });

  // Obtener promedio de rating
  const { data: referee } = await supabase
    .from('tournament_referees')
    .select('average_rating, total_ratings')
    .eq('user_id', refereeId)
    .single();

  return {
    matches_directed: matchesDirected || 0,
    yellow_cards_shown: totalYellowCards,
    red_cards_shown: totalRedCards,
    average_rating: referee?.average_rating || 0,
    total_ratings: referee?.total_ratings || 0
  };
}

/**
 * Calificar desempeño de árbitro
 */
export async function rateReferee(refereeId, matchId, rating, comment = null) {
  if (rating < 1 || rating > 5) {
    throw new Error('El rating debe estar entre 1 y 5');
  }

  // Verificar que el partido existe y el árbitro lo dirigió
  const { data: match, error: matchError } = await supabase
    .from('tournament_matches')
    .select('referee_id')
    .eq('id', matchId)
    .single();

  if (matchError) throw matchError;
  if (match.referee_id !== refereeId) {
    throw new Error('Este árbitro no dirigió el partido');
  }

  // Obtener datos actuales del árbitro
  const { data: referee, error: refError } = await supabase
    .from('tournament_referees')
    .select('average_rating, total_ratings')
    .eq('user_id', refereeId)
    .single();

  if (refError) throw refError;

  // Calcular nuevo promedio
  const currentTotal = (referee.average_rating || 0) * (referee.total_ratings || 0);
  const newTotal = currentTotal + rating;
  const newCount = (referee.total_ratings || 0) + 1;
  const newAverage = newTotal / newCount;

  // Actualizar
  const { data, error } = await supabase
    .from('tournament_referees')
    .update({
      average_rating: newAverage,
      total_ratings: newCount
    })
    .eq('user_id', refereeId)
    .select()
    .single();

  if (error) throw error;

  // Guardar calificación individual (opcional, si existe tabla)
  // await supabase.from('referee_ratings').insert({ referee_id: refereeId, match_id: matchId, rating, comment });

  return data;
}

/**
 * Suspender árbitro
 */
export async function suspendReferee(userId, reason, suspendedUntil = null) {
  const { data, error } = await supabase
    .from('tournament_referees')
    .update({
      is_suspended: true,
      suspension_reason: reason,
      suspended_until: suspendedUntil
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Levantar suspensión de árbitro
 */
export async function unsuspendReferee(userId) {
  const { data, error } = await supabase
    .from('tournament_referees')
    .update({
      is_suspended: false,
      suspension_reason: null,
      suspended_until: null
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export default {
  registerReferee,
  getRefereeProfile,
  getAvailableReferees,
  getRefereeAssignedMatches,
  checkRefereeAvailability,
  createRefereeReport,
  getRefereeReports,
  updateRefereeAvailability,
  getRefereeStats,
  rateReferee,
  suspendReferee,
  unsuspendReferee
};
