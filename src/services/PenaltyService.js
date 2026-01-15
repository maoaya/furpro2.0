import { supabase } from '../config/supabase';

/**
 * ⚽ FUNCIONES PARA SISTEMA DE PENALTIS MULTIJUGADOR
 * Helpers para gestionar partidas de penaltis
 */

/**
 * Crear nueva partida de penaltis
 */
export async function createPenaltyMatch(player1Id, player2Id = null, matchType = 'pvp', difficulty = 'media') {
  if (matchType === 'pvp' && !player2Id) {
    throw new Error('Se requiere player2Id para modo PvP');
  }

  const { data, error } = await supabase
    .from('penalty_matches')
    .insert({
      player1_id: player1Id,
      player2_id: player2Id,
      match_type: matchType,
      difficulty: difficulty,
      status: player2Id ? 'in_progress' : 'waiting_opponent',
      current_turn: player1Id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Unirse a partida como oponente
 */
export async function joinPenaltyMatch(matchId, playerId) {
  const { data, error } = await supabase
    .from('penalty_matches')
    .update({
      player2_id: playerId,
      status: 'in_progress',
      current_turn: playerId // El que se une tira primero
    })
    .eq('id', matchId)
    .eq('status', 'waiting_opponent')
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Registrar disparo de penalti
 */
export async function recordPenaltyShot(matchId, playerId, isGoal, direction, power, goalieDirection = null) {
  // Obtener datos actuales de la partida
  const { data: match, error: fetchError } = await supabase
    .from('penalty_matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (fetchError) throw fetchError;

  if (match.status !== 'in_progress') {
    throw new Error('La partida no está en curso');
  }

  // Determinar de qué jugador es el disparo
  const isPlayer1 = playerId === match.player1_id;
  
  // Actualizar goles
  const updatedData = {};
  if (isGoal) {
    if (isPlayer1) {
      updatedData.player1_goals = (match.player1_goals || 0) + 1;
    } else {
      updatedData.player2_goals = (match.player2_goals || 0) + 1;
    }
  }

  // Actualizar disparos
  if (isPlayer1) {
    updatedData.player1_shots = (match.player1_shots || 0) + 1;
  } else {
    updatedData.player2_shots = (match.player2_shots || 0) + 1;
  }

  // Actualizar historial de disparos
  const shotHistory = match.shot_history || [];
  shotHistory.push({
    player_id: playerId,
    direction,
    power,
    is_goal: isGoal,
    goalie_direction: goalieDirection,
    timestamp: new Date().toISOString()
  });
  updatedData.shot_history = shotHistory;

  // Cambiar turno
  updatedData.current_turn = isPlayer1 ? match.player2_id : match.player1_id;

  // Verificar si la partida terminó (5 disparos por jugador)
  const totalShots = (updatedData.player1_shots || match.player1_shots || 0) + 
                     (updatedData.player2_shots || match.player2_shots || 0);
  
  if (totalShots >= 10) {
    updatedData.status = 'completed';
    updatedData.finished_at = new Date().toISOString();
    
    const player1Goals = updatedData.player1_goals || match.player1_goals || 0;
    const player2Goals = updatedData.player2_goals || match.player2_goals || 0;
    
    if (player1Goals > player2Goals) {
      updatedData.winner_id = match.player1_id;
    } else if (player2Goals > player1Goals) {
      updatedData.winner_id = match.player2_id;
    }
    // Si es empate, winner_id queda null
  }

  const { data, error } = await supabase
    .from('penalty_matches')
    .update(updatedData)
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtener estadísticas de jugador en penaltis
 */
export async function getPlayerPenaltyStats(playerId) {
  const { data, error } = await supabase
    .from('penalty_player_stats')
    .select('*')
    .eq('user_id', playerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No existe, retornar stats vacías
      return {
        user_id: playerId,
        matches_played: 0,
        matches_won: 0,
        total_shots: 0,
        total_goals: 0,
        win_streak: 0,
        best_streak: 0
      };
    }
    throw error;
  }
  return data;
}

/**
 * Obtener ranking de penaltis
 */
export async function getPenaltyLeaderboard(limit = 100, minMatches = 5) {
  const { data, error } = await supabase
    .from('penalty_player_stats')
    .select(`
      *,
      carfutpro:user_id (
        nombre,
        apellido,
        avatar_url,
        ciudad
      )
    `)
    .gte('matches_played', minMatches)
    .order('matches_won', { ascending: false })
    .order('goal_percentage', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Obtener partidas activas (esperando oponente)
 */
export async function getAvailablePenaltyMatches(limit = 20) {
  const { data, error } = await supabase
    .from('penalty_matches')
    .select(`
      *,
      player1:player1_id (
        nombre,
        apellido,
        avatar_url
      )
    `)
    .eq('status', 'waiting_opponent')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Obtener historial de partidas de un jugador
 */
export async function getPlayerPenaltyMatches(playerId, status = null, limit = 20) {
  let query = supabase
    .from('penalty_matches')
    .select(`
      *,
      player1:player1_id (nombre, apellido, avatar_url),
      player2:player2_id (nombre, apellido, avatar_url)
    `)
    .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Abandonar partida
 */
export async function forfeitPenaltyMatch(matchId, playerId) {
  const { data: match, error: fetchError } = await supabase
    .from('penalty_matches')
    .select('player1_id, player2_id')
    .eq('id', matchId)
    .single();

  if (fetchError) throw fetchError;

  const winnerId = playerId === match.player1_id ? match.player2_id : match.player1_id;

  const { data, error } = await supabase
    .from('penalty_matches')
    .update({
      status: 'completed',
      winner_id: winnerId,
      finished_at: new Date().toISOString()
    })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Calcular porcentaje de acierto
 */
export function calculateAccuracy(goals, shots) {
  if (shots === 0) return 0;
  return Math.round((goals / shots) * 100);
}

/**
 * Suscribirse a cambios en partida (Realtime)
 */
export function subscribeToPenaltyMatch(matchId, onUpdate) {
  const channel = supabase.channel(`penalty-match-${matchId}`);

  channel.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'penalty_matches',
      filter: `id=eq.${matchId}`
    },
    (payload) => {
      onUpdate(payload.new);
    }
  );

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Verificar si es el turno del jugador
 */
export async function isPlayerTurn(matchId, playerId) {
  const { data, error } = await supabase
    .from('penalty_matches')
    .select('current_turn')
    .eq('id', matchId)
    .single();

  if (error) throw error;
  return data.current_turn === playerId;
}

export default {
  createPenaltyMatch,
  joinPenaltyMatch,
  recordPenaltyShot,
  getPlayerPenaltyStats,
  getPenaltyLeaderboard,
  getAvailablePenaltyMatches,
  getPlayerPenaltyMatches,
  forfeitPenaltyMatch,
  calculateAccuracy,
  subscribeToPenaltyMatch,
  isPlayerTurn
};
