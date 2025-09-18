// AchievementManager.js - Sistema de logros y recompensas para FutPro
// Gestiona achievements, badges, niveles y sistema de gamificación

import { supabase } from '../config/supabase.js';

export class AchievementManager {
    constructor() {
        this.achievements = new Map();
        this.userProgress = new Map();
        this.achievementDefinitions = this.initializeAchievements();
        
        // Configuración del sistema
        this.config = {
            pointsPerGoal: 10,
            pointsPerAssist: 7,
            pointsPerWin: 25,
            pointsPerTournamentWin: 100,
            pointsPerSocialInteraction: 2,
            levelThresholds: [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000]
        };
        
        console.log('🏆 AchievementManager inicializado');
    }

    /**
     * Definiciones de achievements
     */
    initializeAchievements() {
        return {
            // Achievements de fútbol
            first_goal: {
                id: 'first_goal',
                name: 'Primer Gol',
                description: 'Anota tu primer gol en FutPro',
                icon: '⚽',
                category: 'football',
                points: 50,
                type: 'milestone',
                condition: (stats) => stats.goals >= 1
            },
            
            hat_trick: {
                id: 'hat_trick',
                name: 'Hat Trick',
                description: 'Anota 3 goles en un solo partido',
                icon: '🎩',
                category: 'football',
                points: 200,
                type: 'special',
                rarity: 'rare'
            },
            
            goal_machine: {
                id: 'goal_machine',
                name: 'Máquina de Goles',
                description: 'Anota 50 goles en total',
                icon: '🚀',
                category: 'football',
                points: 500,
                type: 'milestone',
                condition: (stats) => stats.goals >= 50
            },
            
            playmaker: {
                id: 'playmaker',
                name: 'Creador de Juego',
                description: 'Realiza 25 asistencias',
                icon: '🎯',
                category: 'football',
                points: 300,
                type: 'milestone',
                condition: (stats) => stats.assists >= 25
            },
            
            iron_man: {
                id: 'iron_man',
                name: 'Hombre de Hierro',
                description: 'Juega 100 partidos',
                icon: '💪',
                category: 'football',
                points: 250,
                type: 'milestone',
                condition: (stats) => stats.matches_played >= 100
            },
            
            winner: {
                id: 'winner',
                name: 'Ganador',
                description: 'Gana 50 partidos',
                icon: '🏆',
                category: 'football',
                points: 400,
                type: 'milestone',
                condition: (stats) => stats.wins >= 50
            },
            
            clean_sheet_king: {
                id: 'clean_sheet_king',
                name: 'Rey del Arco en Cero',
                description: 'Mantén 20 arcos en cero',
                icon: '🧤',
                category: 'football',
                points: 350,
                type: 'milestone',
                condition: (stats) => stats.clean_sheets >= 20
            },
            
            // Achievements de equipo
            team_builder: {
                id: 'team_builder',
                name: 'Constructor de Equipos',
                description: 'Crea tu primer equipo',
                icon: '👥',
                category: 'team',
                points: 100,
                type: 'milestone'
            },
            
            recruiter: {
                id: 'recruiter',
                name: 'Reclutador',
                description: 'Invita 10 jugadores a tu equipo',
                icon: '📣',
                category: 'team',
                points: 150,
                type: 'milestone'
            },
            
            team_champion: {
                id: 'team_champion',
                name: 'Campeón de Equipo',
                description: 'Gana un torneo con tu equipo',
                icon: '🏅',
                category: 'team',
                points: 500,
                type: 'special',
                rarity: 'epic'
            },
            
            // Achievements sociales
            social_butterfly: {
                id: 'social_butterfly',
                name: 'Mariposa Social',
                description: 'Realiza 100 interacciones sociales',
                icon: '🦋',
                category: 'social',
                points: 200,
                type: 'milestone',
                condition: (stats) => stats.social_interactions >= 100
            },
            
            content_creator: {
                id: 'content_creator',
                name: 'Creador de Contenido',
                description: 'Publica 50 posts',
                icon: '📝',
                category: 'social',
                points: 250,
                type: 'milestone',
                condition: (stats) => stats.posts_created >= 50
            },
            
            influencer: {
                id: 'influencer',
                name: 'Influencer',
                description: 'Consigue 1000 likes en total',
                icon: '⭐',
                category: 'social',
                points: 300,
                type: 'milestone',
                condition: (stats) => stats.total_likes >= 1000
            },
            
            // Achievements de torneos
            tournament_participant: {
                id: 'tournament_participant',
                name: 'Participante de Torneo',
                description: 'Participa en tu primer torneo',
                icon: '🎪',
                category: 'tournament',
                points: 75,
                type: 'milestone'
            },
            
            tournament_winner: {
                id: 'tournament_winner',
                name: 'Ganador de Torneo',
                description: 'Gana tu primer torneo',
                icon: '👑',
                category: 'tournament',
                points: 750,
                type: 'special',
                rarity: 'legendary'
            },
            
            tournament_master: {
                id: 'tournament_master',
                name: 'Maestro de Torneos',
                description: 'Gana 5 torneos',
                icon: '🏆',
                category: 'tournament',
                points: 2000,
                type: 'special',
                rarity: 'legendary'
            },
            
            // Achievements especiales
            early_adopter: {
                id: 'early_adopter',
                name: 'Adoptador Temprano',
                description: 'Uno de los primeros 1000 usuarios',
                icon: '🌟',
                category: 'special',
                points: 500,
                type: 'special',
                rarity: 'epic'
            },
            
            veteran: {
                id: 'veteran',
                name: 'Veterano',
                description: 'Activo por más de 1 año',
                icon: '🎖️',
                category: 'special',
                points: 1000,
                type: 'time',
                rarity: 'legendary'
            },
            
            perfectionist: {
                id: 'perfectionist',
                name: 'Perfeccionista',
                description: 'Completa tu perfil al 100%',
                icon: '💯',
                category: 'profile',
                points: 100,
                type: 'milestone'
            }
        };
    }

    /**
     * Verificar y otorgar achievements
     */
    async checkAndAwardAchievements(userId, context = {}) {
        try {
            const userStats = await this.getUserStats(userId);
            const userAchievements = await this.getUserAchievements(userId);
            const newAchievements = [];

            // Verificar cada achievement
            for (const [achievementId, achievement] of Object.entries(this.achievementDefinitions)) {
                // Skip si ya lo tiene
                if (userAchievements.some(ua => ua.achievement_id === achievementId)) {
                    continue;
                }

                let earned = false;

                // Verificar condiciones según el tipo
                switch (achievement.type) {
                    case 'milestone':
                        earned = achievement.condition ? achievement.condition(userStats) : false;
                        break;
                    case 'special':
                        earned = await this.checkSpecialAchievement(achievementId, userId, context);
                        break;
                    case 'time':
                        earned = await this.checkTimeBasedAchievement(achievementId, userId);
                        break;
                }

                if (earned) {
                    await this.awardAchievement(userId, achievementId);
                    newAchievements.push(achievement);
                }
            }

            // Notificar nuevos achievements
            if (newAchievements.length > 0) {
                this.notifyNewAchievements(userId, newAchievements);
            }

            return newAchievements;

        } catch (error) {
            console.error('Error verificando achievements:', error);
            return [];
        }
    }

    async checkSpecialAchievement(achievementId, userId, context) {
        switch (achievementId) {
            case 'hat_trick':
                return context.matchGoals >= 3;
            
            case 'team_champion':
                return context.tournamentWin && context.isTeamTournament;
            
            case 'tournament_winner':
                return context.tournamentWin;
            
            case 'early_adopter': {
                const userCount = await this.getTotalUserCount();
                return userCount <= 1000;
            }
            
            default:
                return false;
        }
    }

    async checkTimeBasedAchievement(achievementId, userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('created_at')
                .eq('id', userId)
                .single();

            if (error) throw error;

            const accountAge = Date.now() - new Date(data.created_at).getTime();
            const oneYear = 365 * 24 * 60 * 60 * 1000;

            switch (achievementId) {
                case 'veteran':
                    return accountAge >= oneYear;
                default:
                    return false;
            }
        } catch (error) {
            console.error('Error verificando achievement temporal:', error);
            return false;
        }
    }

    /**
     * Otorgar achievement
     */
    async awardAchievement(userId, achievementId) {
        try {
            const achievement = this.achievementDefinitions[achievementId];
            if (!achievement) {
                throw new Error(`Achievement no encontrado: ${achievementId}`);
            }

            // Insertar achievement
            const { data, error } = await supabase
                .from('user_achievements')
                .insert({
                    user_id: userId,
                    achievement_id: achievementId,
                    earned_at: new Date().toISOString(),
                    points_awarded: achievement.points
                })
                .select()
                .single();

            if (error) throw error;

            // Actualizar puntos del usuario
            await this.updateUserPoints(userId, achievement.points);

            // Verificar nivel
            await this.checkLevelUp(userId);

            console.log(`🏆 Achievement otorgado: ${achievement.name} a usuario ${userId}`);
            return data;

        } catch (error) {
            console.error('Error otorgando achievement:', error);
            throw error;
        }
    }

    /**
     * Gestión de puntos y niveles
     */
    async updateUserPoints(userId, points) {
        try {
            const { data, error } = await supabase.rpc('add_user_points', {
                user_id: userId,
                points_to_add: points
            });

            if (error) throw error;
            return data;

        } catch (error) {
            console.error('Error actualizando puntos:', error);
            // Fallback: actualizar manualmente
            await this.updateUserPointsFallback(userId, points);
        }
    }

    async updateUserPointsFallback(userId, points) {
        const { data: user, error } = await supabase
            .from('users')
            .select('stats')
            .eq('id', userId)
            .single();

        if (error) throw error;

        const currentStats = user.stats || {};
        const newPoints = (currentStats.achievement_points || 0) + points;

        await supabase
            .from('users')
            .update({
                stats: {
                    ...currentStats,
                    achievement_points: newPoints
                }
            })
            .eq('id', userId);
    }

    async checkLevelUp(userId) {
        try {
            const userStats = await this.getUserStats(userId);
            const currentPoints = userStats.achievement_points || 0;
            const currentLevel = userStats.level || 0;
            
            let newLevel = currentLevel;
            
            // Calcular nuevo nivel basado en puntos
            for (let i = 0; i < this.config.levelThresholds.length; i++) {
                if (currentPoints >= this.config.levelThresholds[i]) {
                    newLevel = i;
                }
            }

            if (newLevel > currentLevel) {
                await this.levelUpUser(userId, newLevel, currentLevel);
            }

        } catch (error) {
            console.error('Error verificando level up:', error);
        }
    }

    async levelUpUser(userId, newLevel, oldLevel) {
        try {
            // Actualizar nivel en base de datos
            const { error } = await supabase
                .from('users')
                .update({
                    'stats.level': newLevel
                })
                .eq('id', userId);

            if (error) throw error;

            // Notificar level up
            this.notifyLevelUp(userId, newLevel, oldLevel);

            // Recompensas por level up
            const reward = this.getLevelUpReward(newLevel);
            if (reward) {
                await this.grantLevelUpReward(userId, reward);
            }

            console.log(`📈 Usuario ${userId} subió al nivel ${newLevel}`);

        } catch (error) {
            console.error('Error en level up:', error);
        }
    }

    /**
     * Obtener datos del usuario
     */
    async getUserStats(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('stats')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data.stats || {};

        } catch (error) {
            console.error('Error obteniendo stats de usuario:', error);
            return {};
        }
    }

    async getUserAchievements(userId) {
        try {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId)
                .order('earned_at', { ascending: false });

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Error obteniendo achievements de usuario:', error);
            return [];
        }
    }

    async getUserProgress(userId) {
        try {
            const userStats = await this.getUserStats(userId);
            const userAchievements = await this.getUserAchievements(userId);
            
            const progress = {};
            
            // Calcular progreso para cada achievement
            for (const [achievementId, achievement] of Object.entries(this.achievementDefinitions)) {
                const isEarned = userAchievements.some(ua => ua.achievement_id === achievementId);
                
                if (isEarned) {
                    progress[achievementId] = {
                        completed: true,
                        progress: 100,
                        earnedAt: userAchievements.find(ua => ua.achievement_id === achievementId).earned_at
                    };
                } else if (achievement.condition) {
                    progress[achievementId] = {
                        completed: false,
                        progress: this.calculateProgress(achievement, userStats)
                    };
                }
            }

            return progress;

        } catch (error) {
            console.error('Error obteniendo progreso de usuario:', error);
            return {};
        }
    }

    calculateProgress(achievement, userStats) {
        if (!achievement.condition) return 0;

        // Extraer la condición y calcular progreso
        const conditionStr = achievement.condition.toString();
        
        if (conditionStr.includes('goals >=')) {
            const target = parseInt(conditionStr.match(/(\d+)/)[1]);
            return Math.min((userStats.goals || 0) / target * 100, 100);
        }
        
        if (conditionStr.includes('assists >=')) {
            const target = parseInt(conditionStr.match(/(\d+)/)[1]);
            return Math.min((userStats.assists || 0) / target * 100, 100);
        }
        
        if (conditionStr.includes('matches_played >=')) {
            const target = parseInt(conditionStr.match(/(\d+)/)[1]);
            return Math.min((userStats.matches_played || 0) / target * 100, 100);
        }
        
        if (conditionStr.includes('wins >=')) {
            const target = parseInt(conditionStr.match(/(\d+)/)[1]);
            return Math.min((userStats.wins || 0) / target * 100, 100);
        }

        return 0;
    }

    /**
     * Leaderboards y rankings
     */
    async getLeaderboard(type = 'points', limit = 50) {
        try {
            let orderBy = 'stats->>achievement_points';
            
            switch (type) {
                case 'level':
                    orderBy = 'stats->>level';
                    break;
                case 'achievements':
                    // Necesitamos hacer una consulta más compleja
                    return await this.getAchievementLeaderboard(limit);
            }

            const { data, error } = await supabase
                .from('users')
                .select('id, name, avatar_url, stats')
                .order(orderBy, { ascending: false })
                .limit(limit);

            if (error) throw error;

            return data.map((user, index) => ({
                rank: index + 1,
                ...user,
                points: user.stats?.achievement_points || 0,
                level: user.stats?.level || 0
            }));

        } catch (error) {
            console.error('Error obteniendo leaderboard:', error);
            return [];
        }
    }

    async getAchievementLeaderboard(limit) {
        try {
            const { data, error } = await supabase
                .from('user_achievements')
                .select(`
                    user_id,
                    users(id, name, avatar_url),
                    count:user_id
                `)
                .group('user_id')
                .order('count', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Error obteniendo leaderboard de achievements:', error);
            return [];
        }
    }

    /**
     * Gestión de recompensas
     */
    getLevelUpReward(level) {
        const rewards = {
            5: { type: 'title', value: 'Promesa' },
            10: { type: 'title', value: 'Talento' },
            15: { type: 'avatar_frame', value: 'bronze' },
            20: { type: 'title', value: 'Estrella' },
            25: { type: 'avatar_frame', value: 'silver' },
            30: { type: 'title', value: 'Leyenda' },
            35: { type: 'avatar_frame', value: 'gold' }
        };

        return rewards[level] || null;
    }

    async grantLevelUpReward(userId, reward) {
        // Implementar otorgamiento de recompensas
        console.log(`🎁 Recompensa otorgada a ${userId}:`, reward);
    }

    /**
     * Notificaciones
     */
    notifyNewAchievements(userId, achievements) {
        achievements.forEach(achievement => {
            this.sendAchievementNotification(userId, achievement);
        });
    }

    notifyLevelUp(userId, newLevel, oldLevel) {
        this.sendLevelUpNotification(userId, newLevel, oldLevel);
    }

    sendAchievementNotification(userId, achievement) {
        // Integrar con NotificationManager
        if (window.futProApp?.notificationManager) {
            window.futProApp.notificationManager.sendNotification(userId, {
                type: 'achievement',
                title: '🏆 ¡Nuevo Logro!',
                message: `Has desbloqueado: ${achievement.name}`,
                icon: achievement.icon,
                data: { achievementId: achievement.id }
            });
        }
            // Feedback visual global (toast/modal)
            if (window.futProApp?.showToast) {
                window.futProApp.showToast({
                    type: 'success',
                    title: '¡Logro desbloqueado!',
                    message: `Has desbloqueado: ${achievement.name}`,
                    icon: achievement.icon,
                    duration: 6000
                });
            }
            if (window.futProApp?.showModal) {
                window.futProApp.showModal({
                    title: '🏆 ¡Nuevo Logro!',
                    content: `¡Felicidades! Has desbloqueado el logro <b>${achievement.name}</b>.<br>${achievement.description}`,
                    icon: achievement.icon,
                    actions: [{ label: 'Cerrar', type: 'primary' }]
                });
            }
    }

    sendLevelUpNotification(userId, newLevel, oldLevel) {
        if (window.futProApp?.notificationManager) {
            window.futProApp.notificationManager.sendNotification(userId, {
                type: 'level_up',
                title: '📈 ¡Nivel Superior!',
                message: `Has alcanzado el nivel ${newLevel}`,
                icon: '⭐',
                data: { newLevel, oldLevel }
            });
        }
        // Feedback visual global (toast/modal)
        if (window.futProApp?.showToast) {
            window.futProApp.showToast({
                type: 'info',
                title: '¡Nivel alcanzado!',
                message: `Has subido al nivel ${newLevel}`,
                icon: '⬆️',
                duration: 5000
            });
        }
        if (window.futProApp?.showModal) {
            window.futProApp.showModal({
                title: '⬆️ ¡Nivel alcanzado!',
                content: `¡Felicidades! Has alcanzado el nivel <b>${newLevel}</b>.`,
                icon: '⬆️',
                actions: [{ label: 'Cerrar', type: 'primary' }]
            });
        }
    }

    /**
     * Utilidades
     */
    async getTotalUserCount() {
        try {
            const { count, error } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;
            return count;
        } catch (error) {
            console.error('Error obteniendo el total de usuarios:', error);
            return 0;
        }
    }

    async onSocialInteraction(userId, interactionType) {
        await this.checkAndAwardAchievements(userId, {
            socialInteraction: true,
            type: interactionType
        });
    }

    async onTeamCreated(userId) {
        await this.awardAchievement(userId, 'team_builder');
    }

    async onPostCreated(userId) {
        await this.checkAndAwardAchievements(userId, {
            postCreated: true
        });
    }

    /**
     * Estadísticas del sistema
     */
    async getSystemStats() {
        try {
            const totalAchievements = Object.keys(this.achievementDefinitions).length;
            
            const { data: totalAwarded, error1 } = await supabase
                .from('user_achievements')
                .select('achievement_id', { count: 'exact' });

            const { data: activeUsers, error2 } = await supabase
                .from('user_achievements')
                .select('user_id')
                .gte('earned_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            if (error1 || error2) throw error1 || error2;

            return {
                totalAchievements,
                totalAwarded: totalAwarded?.length || 0,
                activeUsers: new Set(activeUsers?.map(ua => ua.user_id)).size,
                categories: [...new Set(Object.values(this.achievementDefinitions).map(a => a.category))]
            };

        } catch (error) {
            console.error('Error obteniendo estadísticas del sistema:', error);
            return null;
        }
    }
}

// Exportar instancia singleton
export const achievementManager = new AchievementManager();

export function asignarLogro(usuarioId, logro) {
    // Permite asignar un logro manualmente a un usuario
    if (!usuarioId || !logro) {
        if (window.futProApp?.showToast) {
            window.futProApp.showToast({
                type: 'error',
                title: 'Error asignando logro',
                message: 'Faltan parámetros usuarioId o logro',
                icon: '⚠️',
                duration: 4000
            });
        }
        return;
    }
    achievementManager.awardAchievement(usuarioId, logro)
        .then(() => {
            if (window.futProApp?.showToast) {
                window.futProApp.showToast({
                    type: 'success',
                    title: 'Logro asignado',
                    message: `Logro ${logro} asignado a usuario ${usuarioId}`,
                    icon: '🏆',
                    duration: 4000
                });
            }
        })
        .catch((error) => {
            if (window.futProApp?.showToast) {
                window.futProApp.showToast({
                    type: 'error',
                    title: 'Error asignando logro',
                    message: error.message,
                    icon: '⚠️',
                    duration: 4000
                });
            }
        });
}
export function listarLogros(usuarioId) {
    // Devuelve la lista de logros obtenidos por el usuario
    if (!usuarioId) {
        if (window.futProApp?.showToast) {
            window.futProApp.showToast({
                type: 'error',
                title: 'Error listando logros',
                message: 'Falta parámetro usuarioId',
                icon: '⚠️',
                duration: 4000
            });
        }
        return [];
    }
    return achievementManager.getUserAchievements(usuarioId)
        .then((achievements) => {
            if (window.futProApp?.showToast) {
                window.futProApp.showToast({
                    type: 'info',
                    title: 'Logros obtenidos',
                    message: `Usuario ${usuarioId} tiene ${achievements.length} logros`,
                    icon: '🏆',
                    duration: 4000
                });
            }
            return achievements;
        })
        .catch((error) => {
            if (window.futProApp?.showToast) {
                window.futProApp.showToast({
                    type: 'error',
                    title: 'Error listando logros',
                    message: error.message,
                    icon: '⚠️',
                    duration: 4000
                });
            }
            return [];
        });
}
