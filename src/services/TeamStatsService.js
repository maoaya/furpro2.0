import { supabase } from '../config/supabase';

/**
 * Servicio para calcular y gestionar estadísticas de equipos
 * Incluye cálculo de OVR basado en jugadores y performance
 */
export class TeamStatsService {
  /**
   * Calcular OVR del equipo basado en:
   * - Promedio de cards de jugadores activos
   * - Bonus por torneos ganados (+2 por torneo)
   * - Bonus por win rate (+10% del win rate)
   * - Bonus por racha actual (+0.5 por partido en racha ganadora)
   */
  static async calculateTeamOVR(teamId) {
    try {
      // 1. Obtener miembros del equipo con sus cards
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('user_email')
        .eq('team_id', teamId);

      if (membersError) throw membersError;

      if (!members || members.length === 0) {
        return {
          ovr: 70,
          breakdown: {
            base: 70,
            playerAvg: 0,
            tournamentBonus: 0,
            winRateBonus: 0,
            streakBonus: 0
          }
        };
      }

      // 2. Obtener cards de los jugadores
      const userEmails = members.map(m => m.user_email);
      const { data: cards, error: cardsError } = await supabase
        .from('users')
        .select('email, cards')
        .in('email', userEmails);

      if (cardsError) throw cardsError;

      // 3. Calcular promedio de OVR de los jugadores
      let totalPlayerOVR = 0;
      let playerCount = 0;

      cards?.forEach(user => {
        if (user.cards && Array.isArray(user.cards)) {
          // Tomar la mejor card de cada jugador
          const bestCard = user.cards.reduce((max, card) => 
            (card.ovr || 0) > (max || 0) ? card.ovr : max, 0
          );
          if (bestCard > 0) {
            totalPlayerOVR += bestCard;
            playerCount++;
          }
        }
      });

      const avgPlayerOVR = playerCount > 0 ? totalPlayerOVR / playerCount : 70;

      // 4. Obtener stats del equipo
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('stats')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      const stats = team?.stats || {};

      // 5. Calcular bonuses
      const tournamentsWon = stats.tournaments_won || 0;
      const tournamentBonus = tournamentsWon * 2;

      const totalGames = (stats.wins || 0) + (stats.losses || 0) + (stats.draws || 0);
      const winRate = totalGames > 0 ? (stats.wins || 0) / totalGames : 0;
      const winRateBonus = Math.floor(winRate * 10);

      const currentStreak = stats.current_streak || 0;
      const streakBonus = currentStreak > 0 ? Math.floor(currentStreak * 0.5) : 0;

      // 6. Calcular OVR final
      const finalOVR = Math.min(99, Math.floor(
        avgPlayerOVR + tournamentBonus + winRateBonus + streakBonus
      ));

      return {
        ovr: finalOVR,
        breakdown: {
          base: Math.floor(avgPlayerOVR),
          playerAvg: Math.floor(avgPlayerOVR),
          tournamentBonus,
          winRateBonus,
          streakBonus
        },
        stats: {
          avg_player_ovr: Math.floor(avgPlayerOVR),
          tournaments_won: tournamentsWon,
          win_rate: Math.floor(winRate * 100),
          current_streak: currentStreak,
          total_games: totalGames
        }
      };
    } catch (error) {
      console.error('Error calculando OVR del equipo:', error);
      return {
        ovr: 70,
        breakdown: { base: 70, playerAvg: 0, tournamentBonus: 0, winRateBonus: 0, streakBonus: 0 },
        stats: {}
      };
    }
  }

  /**
   * Calcular stats detalladas por posición (ATT, MID, DEF)
   * Basado en las positions de los jugadores en el equipo
   */
  static async calculatePositionStats(teamId) {
    try {
      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          user_email,
          position,
          users!inner(cards)
        `)
        .eq('team_id', teamId);

      if (error) throw error;

      const positionGroups = {
        attack: ['FWD', 'ST', 'CF', 'LW', 'RW'],
        midfield: ['MID', 'CM', 'CDM', 'CAM', 'LM', 'RM'],
        defense: ['DEF', 'CB', 'LB', 'RB', 'GK']
      };

      const stats = { attack: 0, midfield: 0, defense: 0 };
      const counts = { attack: 0, midfield: 0, defense: 0 };

      members?.forEach(member => {
        const position = member.position;
        const cards = member.users?.cards || [];
        
        if (!position || !cards.length) return;

        const bestCard = cards.reduce((max, card) => 
          (card.ovr || 0) > (max || 0) ? card.ovr : max, 0
        );

        if (positionGroups.attack.includes(position)) {
          stats.attack += bestCard;
          counts.attack++;
        } else if (positionGroups.midfield.includes(position)) {
          stats.midfield += bestCard;
          counts.midfield++;
        } else if (positionGroups.defense.includes(position)) {
          stats.defense += bestCard;
          counts.defense++;
        }
      });

      return {
        attack: counts.attack > 0 ? Math.floor(stats.attack / counts.attack) : 70,
        midfield: counts.midfield > 0 ? Math.floor(stats.midfield / counts.midfield) : 70,
        defense: counts.defense > 0 ? Math.floor(stats.defense / counts.defense) : 70
      };
    } catch (error) {
      console.error('Error calculando stats por posición:', error);
      return { attack: 70, midfield: 70, defense: 70 };
    }
  }

  /**
   * Actualizar stats del equipo después de un partido
   */
  static async updateTeamStatsAfterMatch(teamId, result, goalsFor, goalsAgainst) {
    try {
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('stats')
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      const currentStats = team?.stats || {
        wins: 0,
        losses: 0,
        draws: 0,
        goals_for: 0,
        goals_against: 0,
        tournaments_won: 0,
        current_streak: 0
      };

      // Actualizar resultados
      if (result === 'win') {
        currentStats.wins = (currentStats.wins || 0) + 1;
        currentStats.current_streak = Math.max(0, (currentStats.current_streak || 0)) + 1;
      } else if (result === 'loss') {
        currentStats.losses = (currentStats.losses || 0) + 1;
        currentStats.current_streak = Math.min(0, (currentStats.current_streak || 0)) - 1;
      } else if (result === 'draw') {
        currentStats.draws = (currentStats.draws || 0) + 1;
        currentStats.current_streak = 0;
      }

      currentStats.goals_for = (currentStats.goals_for || 0) + goalsFor;
      currentStats.goals_against = (currentStats.goals_against || 0) + goalsAgainst;

      // Guardar stats actualizadas
      const { error: updateError } = await supabase
        .from('teams')
        .update({ stats: currentStats })
        .eq('id', teamId);

      if (updateError) throw updateError;

      return currentStats;
    } catch (error) {
      console.error('Error actualizando stats del equipo:', error);
      throw error;
    }
  }

  /**
   * Incrementar torneos ganados
   */
  static async incrementTournamentsWon(teamId) {
    try {
      const { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('stats')
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      const currentStats = team?.stats || {};
      currentStats.tournaments_won = (currentStats.tournaments_won || 0) + 1;

      const { error: updateError } = await supabase
        .from('teams')
        .update({ stats: currentStats })
        .eq('id', teamId);

      if (updateError) throw updateError;

      return currentStats;
    } catch (error) {
      console.error('Error incrementando torneos ganados:', error);
      throw error;
    }
  }

  /**
   * Obtener stats completas del equipo incluyendo OVR y posiciones
   */
  static async getCompleteTeamStats(teamId) {
    try {
      const [ovrData, positionStats] = await Promise.all([
        this.calculateTeamOVR(teamId),
        this.calculatePositionStats(teamId)
      ]);

      return {
        ...ovrData.stats,
        ovr: ovrData.ovr,
        breakdown: ovrData.breakdown,
        attack: positionStats.attack,
        midfield: positionStats.midfield,
        defense: positionStats.defense
      };
    } catch (error) {
      console.error('Error obteniendo stats completas:', error);
      return null;
    }
  }
}

export default TeamStatsService;
