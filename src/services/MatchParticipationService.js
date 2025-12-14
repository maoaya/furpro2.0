import { supabase } from '../config/supabase';

/**
 * Servicio para gestionar participaciones en partidos
 */
export class MatchParticipationService {
  /**
   * Verifica cuántos amistosos ha jugado un jugador esta semana
   * @param {string} playerEmail - Email del jugador
   * @returns {Promise<number>} - Número de amistosos jugados
   */
  static async getWeeklyFriendlyCount(playerEmail) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('match_participations')
        .select('id, matches!inner(type)')
        .eq('player_email', playerEmail)
        .eq('matches.type', 'amistoso')
        .gte('participated_at', weekAgo.toISOString());

      if (error) {
        console.error('Error verificando límite semanal:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (err) {
      console.error('Error en getWeeklyFriendlyCount:', err);
      return 0;
    }
  }

  /**
   * Verifica si un jugador puede participar en más amistosos
   * @param {string} playerEmail - Email del jugador
   * @returns {Promise<{canPlay: boolean, count: number}>}
   */
  static async canPlayFriendly(playerEmail) {
    const count = await this.getWeeklyFriendlyCount(playerEmail);
    return {
      canPlay: count < 2,
      count,
      remaining: Math.max(0, 2 - count)
    };
  }

  /**
   * Registra la participación de jugadores en un partido
   * @param {string} matchId - ID del partido
   * @param {Array<{email: string, teamId: string}>} players - Lista de jugadores
   * @param {number} points - Puntos a otorgar (default 2 para amistosos)
   * @returns {Promise<boolean>}
   */
  static async registerParticipations(matchId, players, points = 2) {
    try {
      const participations = players.map(player => ({
        match_id: matchId,
        player_email: player.email,
        team_id: player.teamId || null,
        points_earned: points,
        participated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('match_participations')
        .insert(participations);

      if (error) {
        console.error('Error registrando participaciones:', error);
        return false;
      }

      // Actualizar puntos en las cards de los jugadores
      await this.updatePlayerCards(players, points);

      return true;
    } catch (err) {
      console.error('Error en registerParticipations:', err);
      return false;
    }
  }

  /**
   * Actualiza los puntos de las cards FIFA de los jugadores
   * @param {Array<{email: string}>} players - Lista de jugadores
   * @param {number} points - Puntos a sumar
   */
  static async updatePlayerCards(players, points) {
    try {
      for (const player of players) {
        // Obtener stats actuales del usuario
        const { data: userData } = await supabase
          .from('users')
          .select('card_points, partidos_jugados')
          .eq('email', player.email)
          .single();

        if (userData) {
          const newCardPoints = (userData.card_points || 0) + points;
          const newPartidosJugados = (userData.partidos_jugados || 0) + 1;

          // Actualizar stats
          await supabase
            .from('users')
            .update({
              card_points: newCardPoints,
              partidos_jugados: newPartidosJugados,
              updated_at: new Date().toISOString()
            })
            .eq('email', player.email);
        }
      }
    } catch (err) {
      console.error('Error actualizando cards de jugadores:', err);
    }
  }

  /**
   * Obtiene el historial de participaciones de un jugador
   * @param {string} playerEmail - Email del jugador
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Array>}
   */
  static async getPlayerHistory(playerEmail, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('match_participations')
        .select(`
          *,
          matches (
            id,
            match_date,
            location,
            type,
            status
          )
        `)
        .eq('player_email', playerEmail)
        .order('participated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error obteniendo historial:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en getPlayerHistory:', err);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de participación de un jugador
   * @param {string} playerEmail - Email del jugador
   * @returns {Promise<Object>}
   */
  static async getPlayerStats(playerEmail) {
    try {
      const { data, error } = await supabase
        .from('match_participations')
        .select('points_earned, matches!inner(type)')
        .eq('player_email', playerEmail);

      if (error || !data) {
        return {
          totalMatches: 0,
          totalPoints: 0,
          friendlyMatches: 0,
          competitiveMatches: 0
        };
      }

      const stats = {
        totalMatches: data.length,
        totalPoints: data.reduce((sum, p) => sum + (p.points_earned || 0), 0),
        friendlyMatches: data.filter(p => p.matches?.type === 'amistoso').length,
        competitiveMatches: data.filter(p => p.matches?.type !== 'amistoso').length
      };

      return stats;
    } catch (err) {
      console.error('Error en getPlayerStats:', err);
      return {
        totalMatches: 0,
        totalPoints: 0,
        friendlyMatches: 0,
        competitiveMatches: 0
      };
    }
  }
}

export default MatchParticipationService;
