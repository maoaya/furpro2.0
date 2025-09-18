// AnalyticsManager.js - Sistema de analíticas y estadísticas para FutPro
// Recopila, procesa y presenta datos estadísticos de la plataforma

import { supabase } from '../config/supabase.js';

export class AnalyticsManager {
    constructor() {
        this.eventQueue = [];
        this.isProcessing = false;
        this.batchSize = 10;
        this.flushInterval = 30000; // 30 segundos
        
        // Configuración de métricas
        this.metrics = {
            userActivity: new Map(),
            pageViews: new Map(),
            searchQueries: new Map(),
            matchEvents: new Map(),
            socialInteractions: new Map()
        };
        
        // Inicializar analytics
        this.initializeAnalytics();
        console.log('📊 AnalyticsManager inicializado');
    }

    initializeAnalytics() {
        // Configurar flush automático
        setInterval(() => {
            this.flushEvents();
        }, this.flushInterval);

        // Tracking básico de página
        this.trackPageView(window.location.pathname);

        // Event listeners globales
        this.setupGlobalTracking();
    }

    setupGlobalTracking() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackUserInteraction('click', {
                element: e.target.tagName,
                className: e.target.className,
                id: e.target.id
            });
        });

        // Track time on page
        let pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - pageStartTime;
            this.trackEvent('page_time', {
                duration: timeSpent,
                page: window.location.pathname
            });
        });
    }

    /**
     * Tracking de eventos generales
     */
    trackEvent(eventName, properties = {}, userId = null) {
        const event = {
            id: this.generateEventId(),
            name: eventName,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                userAgent: navigator.userAgent,
                userId: userId || this.getCurrentUserId()
            }
        };

        this.eventQueue.push(event);
        this.updateMetrics(eventName, properties);

        // Auto-flush si la cola está llena
        if (this.eventQueue.length >= this.batchSize) {
            this.flushEvents();
        }
    }

    /**
     * Tracking específico para fútbol
     */
    trackMatchEvent(matchId, eventType, details = {}) {
        this.trackEvent('match_event', {
            matchId,
            eventType,
            ...details
        });

        // Actualizar métricas específicas de partidos
        if (!this.metrics.matchEvents.has(matchId)) {
            this.metrics.matchEvents.set(matchId, []);
        }
        this.metrics.matchEvents.get(matchId).push({
            eventType,
            timestamp: Date.now(),
            ...details
        });
    }

    trackPlayerAction(playerId, action, context = {}) {
        this.trackEvent('player_action', {
            playerId,
            action,
            ...context
        });
    }

    trackTeamActivity(teamId, activity, details = {}) {
        this.trackEvent('team_activity', {
            teamId,
            activity,
            ...details
        });
    }

    trackTournamentEvent(tournamentId, eventType, data = {}) {
        this.trackEvent('tournament_event', {
            tournamentId,
            eventType,
            ...data
        });
    }

    /**
     * Tracking de interacciones sociales
     */
    trackSocialInteraction(type, targetId, targetType) {
        this.trackEvent('social_interaction', {
            interactionType: type, // like, comment, share, follow
            targetId,
            targetType // post, user, team
        });

        const key = `${type}_${targetType}`;
        this.metrics.socialInteractions.set(key, 
            (this.metrics.socialInteractions.get(key) || 0) + 1
        );
    }

    trackSearchQuery(query, results = {}) {
        this.trackEvent('search_query', {
            query: query.toLowerCase(),
            resultsCount: Object.values(results).reduce((total, arr) => total + (arr?.length || 0), 0),
            categories: Object.keys(results).filter(key => results[key]?.length > 0)
        });

        // Actualizar métricas de búsqueda
        const normalizedQuery = query.toLowerCase();
        this.metrics.searchQueries.set(normalizedQuery,
            (this.metrics.searchQueries.get(normalizedQuery) || 0) + 1
        );
    }

    trackPageView(page) {
        this.trackEvent('page_view', { page });
        
        this.metrics.pageViews.set(page,
            (this.metrics.pageViews.get(page) || 0) + 1
        );
    }

    trackUserInteraction(interactionType, details = {}) {
        this.trackEvent('user_interaction', {
            interactionType,
            ...details
        });
    }

    /**
     * Obtener estadísticas de usuarios
     */
    async getUserStats(userId, timeframe = '30d') {
        try {
            const startDate = this.getStartDate(timeframe);
            
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString());

            if (error) throw error;

            return this.processUserStats(data || []);
        } catch (error) {
            console.error('Error obteniendo estadísticas de usuario:', error);
            return null;
        }
    }

    async getTeamStats(teamId, timeframe = '30d') {
        try {
            const startDate = this.getStartDate(timeframe);
            
            // Obtener estadísticas del equipo
            const teamStatsPromise = supabase
                .from('teams')
                .select('stats')
                .eq('id', teamId)
                .single();

            // Obtener eventos del equipo
            const teamEventsPromise = supabase
                .from('analytics_events')
                .select('*')
                .eq('properties->>teamId', teamId)
                .gte('created_at', startDate.toISOString());

            // Obtener partidos del equipo
            const matchesPromise = supabase
                .from('matches')
                .select('*')
                .or(`team1_id.eq.${teamId},team2_id.eq.${teamId}`)
                .gte('date', startDate.toISOString());

            const [teamStatsResult, teamEventsResult, matchesResult] = await Promise.all([
                teamStatsPromise,
                teamEventsPromise,
                matchesPromise
            ]);

            return this.processTeamStats({
                stats: teamStatsResult.data?.stats || {},
                events: teamEventsResult.data || [],
                matches: matchesResult.data || []
            });

        } catch (error) {
            console.error('Error obteniendo estadísticas de equipo:', error);
            return null;
        }
    }

    async getTournamentStats(tournamentId, timeframe = '30d') {
        try {
            const startDate = this.getStartDate(timeframe);
            
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .eq('properties->>tournamentId', tournamentId)
                .gte('created_at', startDate.toISOString());

            if (error) throw error;

            return this.processTournamentStats(data || []);
        } catch (error) {
            console.error('Error obteniendo estadísticas de torneo:', error);
            return null;
        }
    }

    /**
     * Estadísticas generales de la plataforma
     */
    async getPlatformStats(timeframe = '30d') {
        try {
            const startDate = this.getStartDate(timeframe);
            
            // Obtener múltiples métricas en paralelo
            const [usersResult, teamsResult, matchesResult, postsResult, eventsResult] = await Promise.all([
                this.getUsersMetrics(startDate),
                this.getTeamsMetrics(startDate),
                this.getMatchesMetrics(startDate),
                this.getPostsMetrics(startDate),
                this.getEventsMetrics(startDate)
            ]);

            return {
                users: usersResult,
                teams: teamsResult,
                matches: matchesResult,
                posts: postsResult,
                events: eventsResult,
                timeframe,
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error obteniendo estadísticas de plataforma:', error);
            return null;
        }
    }

    async getUsersMetrics(startDate) {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, created_at, user_type, stats')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        const activeUsers = await this.getActiveUsersCount(startDate);
        
        return {
            total: users.length,
            active: activeUsers,
            byType: this.groupBy(users, 'user_type'),
            registrationTrend: this.calculateTrend(users, 'created_at')
        };
    }

    async getTeamsMetrics(startDate) {
        const { data: teams, error } = await supabase
            .from('teams')
            .select('id, created_at, member_count, stats')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        return {
            total: teams.length,
            averageMembers: this.calculateAverage(teams, 'member_count'),
            creationTrend: this.calculateTrend(teams, 'created_at')
        };
    }

    async getMatchesMetrics(startDate) {
        const { data: matches, error } = await supabase
            .from('matches')
            .select('id, date, status, score')
            .gte('date', startDate.toISOString());

        if (error) throw error;

        return {
            total: matches.length,
            completed: matches.filter(m => m.status === 'completed').length,
            byStatus: this.groupBy(matches, 'status'),
            trend: this.calculateTrend(matches, 'date')
        };
    }

    async getPostsMetrics(startDate) {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('id, created_at, likes, comments')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        return {
            total: posts.length,
            totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
            totalComments: posts.reduce((sum, p) => sum + (p.comments || 0), 0),
            trend: this.calculateTrend(posts, 'created_at')
        };
    }

    async getEventsMetrics(startDate) {
        const { data: events, error } = await supabase
            .from('analytics_events')
            .select('event_name, created_at')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        return {
            total: events.length,
            byType: this.groupBy(events, 'event_name'),
            trend: this.calculateTrend(events, 'created_at')
        };
    }

    /**
     * Obtener top rankings
     */
    async getTopPlayers(metric = 'rating', limit = 10) {
        try {
            let orderBy = 'stats->>rating';
            
            switch (metric) {
                case 'goals':
                    orderBy = 'stats->>goals';
                    break;
                case 'assists':
                    orderBy = 'stats->>assists';
                    break;
                case 'matches':
                    orderBy = 'stats->>matches_played';
                    break;
            }

            const { data, error } = await supabase
                .from('users')
                .select('id, name, avatar_url, user_type, stats')
                .eq('user_type', 'player')
                .order(orderBy, { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Error obteniendo top jugadores:', error);
            return [];
        }
    }

    async getTopTeams(metric = 'rating', limit = 10) {
        try {
            let orderBy = 'stats->>rating';
            
            switch (metric) {
                case 'wins':
                    orderBy = 'stats->>wins';
                    break;
                case 'members':
                    orderBy = 'member_count';
                    break;
            }

            const { data, error } = await supabase
                .from('teams')
                .select('id, name, logo_url, member_count, stats')
                .order(orderBy, { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Error obteniendo top equipos:', error);
            return [];
        }
    }

    /**
     * Generar reportes
     */
    async generateReport(type, options = {}) {
        const { timeframe = '30d', format = 'json' } = options;
        
        let reportData;
        
        switch (type) {
            case 'platform':
                reportData = await this.getPlatformStats(timeframe);
                break;
            case 'users':
                reportData = await this.generateUsersReport(timeframe);
                break;
            case 'engagement':
                reportData = await this.generateEngagementReport(timeframe);
                break;
            case 'performance':
                reportData = await this.generatePerformanceReport(timeframe);
                break;
            default:
                throw new Error(`Tipo de reporte no soportado: ${type}`);
        }

        if (format === 'csv') {
            return this.exportToCSV(reportData);
        }
        
        return reportData;
    }

    async generateUsersReport(timeframe) {
        const startDate = this.getStartDate(timeframe);
        
        const users = await this.getUsersMetrics(startDate);
        const topPlayers = await this.getTopPlayers('rating', 20);
        
        return {
            summary: users,
            topPlayers,
            insights: this.generateUserInsights(users),
            generatedAt: new Date().toISOString()
        };
    }

    async generateEngagementReport(timeframe) {
        const startDate = this.getStartDate(timeframe);
        
        const posts = await this.getPostsMetrics(startDate);
        const socialInteractions = await this.getSocialInteractionsMetrics(startDate);
        
        return {
            posts,
            socialInteractions,
            engagementRate: this.calculateEngagementRate(posts, socialInteractions),
            insights: this.generateEngagementInsights(posts, socialInteractions),
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Procesamiento de datos y cálculos
     */
    processUserStats(events) {
        const stats = {
            totalEvents: events.length,
            pageViews: 0,
            searches: 0,
            socialInteractions: 0,
            matchEvents: 0,
            loginSessions: 0,
            timeSpent: 0
        };

        events.forEach(event => {
            switch (event.event_name) {
                case 'page_view':
                    stats.pageViews++;
                    break;
                case 'search_query':
                    stats.searches++;
                    break;
                case 'social_interaction':
                    stats.socialInteractions++;
                    break;
                case 'match_event':
                    stats.matchEvents++;
                    break;
                case 'user_login':
                    stats.loginSessions++;
                    break;
                case 'page_time':
                    stats.timeSpent += event.properties?.duration || 0;
                    break;
            }
        });

        return stats;
    }

    processTeamStats(data) {
        const { stats, events, matches } = data;
        
        return {
            ...stats,
            totalMatches: matches.length,
            wins: matches.filter(m => this.isTeamWinner(m, data.teamId)).length,
            recentActivity: events.length,
            performance: this.calculateTeamPerformance(matches, data.teamId)
        };
    }

    processTournamentStats(events) {
        return {
            totalEvents: events.length,
            registrations: events.filter(e => e.event_name === 'tournament_registration').length,
            matchesPlayed: events.filter(e => e.event_name === 'tournament_match').length,
            engagement: this.calculateTournamentEngagement(events)
        };
    }

    /**
     * Utilidades de cálculo
     */
    getStartDate(timeframe) {
        const now = new Date();
        const days = parseInt(timeframe.replace('d', ''));
        return new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    }

    groupBy(array, property) {
        return array.reduce((groups, item) => {
            const value = item[property];
            groups[value] = (groups[value] || []);
            groups[value].push(item);
            return groups;
        }, {});
    }

    calculateAverage(array, property) {
        if (array.length === 0) return 0;
        return array.reduce((sum, item) => sum + (item[property] || 0), 0) / array.length;
    }

    calculateTrend(array, dateProperty) {
        const grouped = this.groupBy(array, (item) => {
            return new Date(item[dateProperty]).toDateString();
        });
        
        return Object.keys(grouped).map(date => ({
            date,
            count: grouped[date].length
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    /**
     * Persistencia de eventos
     */
    async flushEvents() {
        if (this.isProcessing || this.eventQueue.length === 0) return;
        
        this.isProcessing = true;
        const eventsToFlush = [...this.eventQueue];
        this.eventQueue = [];

        try {
            const { error } = await supabase
                .from('analytics_events')
                .insert(eventsToFlush.map(event => ({
                    id: event.id,
                    event_name: event.name,
                    properties: event.properties,
                    user_id: event.properties.userId,
                    created_at: event.properties.timestamp
                })));

            if (error) throw error;
            
            console.log(`📊 Enviados ${eventsToFlush.length} eventos de analytics`);
            
        } catch (error) {
            console.error('Error enviando eventos de analytics:', error);
            // Devolver eventos a la cola
            this.eventQueue.unshift(...eventsToFlush);
        } finally {
            this.isProcessing = false;
        }
    }

    updateMetrics(eventName, properties) {
        // Actualizar métricas en memoria para acceso rápido
        const userId = properties.userId;
        if (userId) {
            if (!this.metrics.userActivity.has(userId)) {
                this.metrics.userActivity.set(userId, []);
            }
            this.metrics.userActivity.get(userId).push({
                event: eventName,
                timestamp: Date.now()
            });
        }
    }

    generateEventId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getCurrentUserId() {
        // Obtener ID del usuario actual desde la aplicación
        return window.futProApp?.user?.id || null;
    }

    async getActiveUsersCount(startDate) {
        const { data, error } = await supabase
            .from('analytics_events')
            .select('user_id')
            .gte('created_at', startDate.toISOString())
            .not('user_id', 'is', null);

        if (error) throw error;
        
        const uniqueUsers = new Set(data.map(event => event.user_id));
        return uniqueUsers.size;
    }

    /**
     * Exportación de datos
     */
    exportToCSV(data) {
        // Implementación básica de exportación a CSV
    // Exportación completa pendiente. Aquí se debe agregar la lógica de exportación de datos cuando se defina el formato final.
        return JSON.stringify(data, null, 2);
    }

    /**
     * Insights y recomendaciones
     */
    generateUserInsights(userStats) {
        const insights = [];
        
        if (userStats.active / userStats.total < 0.3) {
            insights.push({
                type: 'warning',
                message: 'Baja tasa de usuarios activos. Considerar estrategias de engagement.'
            });
        }
        
        return insights;
    }

    generateEngagementInsights(posts) {
        const insights = [];
        
        const avgLikesPerPost = posts.totalLikes / posts.total;
        if (avgLikesPerPost < 5) {
            insights.push({
                type: 'suggestion',
                message: 'Promedio de likes bajo. Mejorar calidad del contenido.'
            });
        }
        
        return insights;
    }

    calculateEngagementRate(posts) {
        if (posts.total === 0) return 0;
        return (posts.totalLikes + posts.totalComments) / posts.total;
    }

    isTeamWinner(match, teamId) {
        // Lógica para determinar si un equipo ganó un partido
        if (!match.score) return false;
        
        const [score1, score2] = match.score.split('-').map(Number);
        
        if (match.team1_id === teamId) {
            return score1 > score2;
        } else if (match.team2_id === teamId) {
            return score2 > score1;
        }
        
        return false;
    }

    calculateTeamPerformance(matches, teamId) {
        const wins = matches.filter(m => this.isTeamWinner(m, teamId)).length;
        return matches.length > 0 ? (wins / matches.length) * 100 : 0;
    }

    calculateTournamentEngagement(events) {
        return events.length / Math.max(1, new Set(events.map(e => e.properties?.userId)).size);
    }

    /**
     * API pública para obtener métricas rápidas
     */
    getQuickStats() {
        return {
            userActivity: this.metrics.userActivity.size,
            pageViews: Array.from(this.metrics.pageViews.values()).reduce((a, b) => a + b, 0),
            searchQueries: Array.from(this.metrics.searchQueries.values()).reduce((a, b) => a + b, 0),
            socialInteractions: Array.from(this.metrics.socialInteractions.values()).reduce((a, b) => a + b, 0),
            eventsQueued: this.eventQueue.length
        };
    }
}

// Exportar instancia singleton
export const analyticsManager = new AnalyticsManager();

export function registrarEvento({ tipo, usuario }) {
  // Implementación de ejemplo
  console.log(`Evento registrado: tipo=${tipo}, usuario=${usuario}`);
  // Aquí puedes agregar la lógica real de registro de eventos
}
