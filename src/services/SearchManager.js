// SearchManager.js - Gestión de búsquedas globales en FutPro
// Permite buscar usuarios, equipos, torneos y contenido

import { supabase } from '../config/supabase.js';

export class SearchManager {
    constructor() {
        this.searchHistory = [];
        this.recentSearches = this.loadRecentSearches();
        this.searchFilters = {
            users: true,
            teams: true,
            tournaments: true,
            posts: true,
            matches: true
        };
        
        // Cache para resultados frecuentes
        this.searchCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
        
        console.log('🔍 SearchManager inicializado');
    }

    /**
     * Búsqueda global que combina todos los tipos de contenido
     */
    async globalSearch(query, options = {}) {
        try {
            if (!query || query.trim().length < 2) {
                return { results: [], suggestions: this.getSearchSuggestions() };
            }

            const searchKey = `${query}_${JSON.stringify(options)}`;
            
            // Verificar cache
            if (this.searchCache.has(searchKey)) {
                const cached = this.searchCache.get(searchKey);
                if (Date.now() - cached.timestamp < this.cacheTimeout) {
                    return cached.data;
                }
            }

            const normalizedQuery = query.trim().toLowerCase();
            
            // Realizar búsquedas en paralelo
            const searchPromises = [];
            
            if (this.searchFilters.users) {
                searchPromises.push(this.searchUsers(normalizedQuery, options.userLimit || 5));
            }
            
            if (this.searchFilters.teams) {
                searchPromises.push(this.searchTeams(normalizedQuery, options.teamLimit || 5));
            }
            
            if (this.searchFilters.tournaments) {
                searchPromises.push(this.searchTournaments(normalizedQuery, options.tournamentLimit || 3));
            }
            
            if (this.searchFilters.posts) {
                searchPromises.push(this.searchPosts(normalizedQuery, options.postLimit || 5));
            }
            
            if (this.searchFilters.matches) {
                searchPromises.push(this.searchMatches(normalizedQuery, options.matchLimit || 3));
            }

            const results = await Promise.allSettled(searchPromises);
            
            // Procesar resultados
            const searchResults = {
                users: results[0]?.status === 'fulfilled' ? results[0].value : [],
                teams: results[1]?.status === 'fulfilled' ? results[1].value : [],
                tournaments: results[2]?.status === 'fulfilled' ? results[2].value : [],
                posts: results[3]?.status === 'fulfilled' ? results[3].value : [],
                matches: results[4]?.status === 'fulfilled' ? results[4].value : [],
                query: query,
                timestamp: Date.now()
            };

            // Guardar en historial y cache
            this.addToHistory(query);
            this.searchCache.set(searchKey, {
                data: searchResults,
                timestamp: Date.now()
            });

            return searchResults;

        } catch (error) {
            console.error('Error en búsqueda global:', error);
            throw error;
        }
    }

    /**
     * Búsqueda específica de usuarios
     */
    async searchUsers(query, limit = 10, filters = {}, excludeBlockedForUserId = null) {
        try {
            let search = supabase
                .from('users')
                .select(`
                    id,
                    name,
                    email,
                    avatar_url,
                    user_type,
                    position,
                    stats,
                    location,
                    skills,
                    created_at
                `)
                .or(`name.ilike.%${query}%,email.ilike.%${query}%,position.ilike.%${query}%`)
                .limit(limit)
                .order('name');

            // Filtros adicionales
            if (filters.location) {
                search = search.eq('location', filters.location);
            }
            if (filters.skills && Array.isArray(filters.skills)) {
                for (const skill of filters.skills) {
                    search = search.contains('skills', [skill]);
                }
            }

            const { data, error } = await search;
            if (error) throw error;

            let results = (data || []).map(user => ({
                ...user,
                type: 'user',
                relevance: this.calculateUserRelevance(user, query)
            })).sort((a, b) => b.relevance - a.relevance);

            // Excluir usuarios bloqueados
            if (excludeBlockedForUserId) {
                results = await this.excludeBlockedUsers(excludeBlockedForUserId, results);
            }
            return results;
        } catch (error) {
            console.error('Error buscando usuarios:', error);
            return [];
        }
    }

    async excludeBlockedUsers(userId, results) {
        // Consulta la tabla de bloqueos y filtra los resultados
        const { data: blocked } = await supabase
            .from('blocks')
            .select('blocked_user_id')
            .eq('user_id', userId);
        if (!blocked) return results;
        return results.filter(r => !blocked.some(b => b.blocked_user_id === r.id));
    }

    /**
     * Búsqueda específica de equipos
     */
    async searchTeams(query, limit = 10) {
        try {
            const { data, error } = await supabase
                .from('teams')
                .select(`
                    id,
                    name,
                    description,
                    logo_url,
                    captain_id,
                    member_count,
                    stats,
                    created_at
                `)
                .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(limit)
                .order('name');

            if (error) throw error;

            return (data || []).map(team => ({
                ...team,
                type: 'team',
                relevance: this.calculateTeamRelevance(team, query)
            })).sort((a, b) => b.relevance - a.relevance);

        } catch (error) {
            console.error('Error buscando equipos:', error);
            return [];
        }
    }

    /**
     * Búsqueda específica de torneos
     */
    async searchTournaments(query, limit = 10) {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select(`
                    id,
                    name,
                    description,
                    type,
                    status,
                    start_date,
                    end_date,
                    participant_count,
                    created_at
                `)
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
                .limit(limit)
                .order('start_date', { ascending: false });

            if (error) throw error;

            return (data || []).map(tournament => ({
                ...tournament,
                type: 'tournament',
                relevance: this.calculateTournamentRelevance(tournament, query)
            })).sort((a, b) => b.relevance - a.relevance);

        } catch (error) {
            console.error('Error buscando torneos:', error);
            return [];
        }
    }

    /**
     * Búsqueda específica de publicaciones
     */
    async searchPosts(query, limit = 10) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    id,
                    content,
                    media_url,
                    likes,
                    comments,
                    created_at,
                    user:users(id, name, avatar_url)
                `)
                .ilike('content', `%${query}%`)
                .limit(limit)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(post => ({
                ...post,
                type: 'post',
                relevance: this.calculatePostRelevance(post, query)
            })).sort((a, b) => b.relevance - a.relevance);

        } catch (error) {
            console.error('Error buscando publicaciones:', error);
            return [];
        }
    }

    /**
     * Búsqueda específica de partidos
     */
    async searchMatches(query, limit = 10) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .select(`
                    id,
                    team1_name,
                    team2_name,
                    status,
                    date,
                    location,
                    score,
                    created_at
                `)
                .or(`team1_name.ilike.%${query}%,team2_name.ilike.%${query}%,location.ilike.%${query}%`)
                .limit(limit)
                .order('date', { ascending: false });

            if (error) throw error;

            return (data || []).map(match => ({
                ...match,
                type: 'match',
                relevance: this.calculateMatchRelevance(match, query)
            })).sort((a, b) => b.relevance - a.relevance);

        } catch (error) {
            console.error('Error buscando partidos:', error);
            return [];
        }
    }

    /**
     * Búsqueda con filtros avanzados
     */
    async advancedSearch(options) {
        try {
            const {
                query,
                type,
                filters = {},
                sortBy = 'relevance',
                limit = 20
            } = options;

            let results = [];

            switch (type) {
                case 'users':
                    results = await this.searchUsersAdvanced(query, filters, limit);
                    break;
                case 'teams':
                    results = await this.searchTeamsAdvanced(query, filters, limit);
                    break;
                case 'tournaments':
                    results = await this.searchTournamentsAdvanced(query, filters, limit);
                    break;
                default:
                    results = await this.globalSearch(query, { limit });
            }

            // Aplicar ordenamiento
            if (sortBy !== 'relevance') {
                results = this.sortResults(results, sortBy);
            }

            return results;

        } catch (error) {
            console.error('Error en búsqueda avanzada:', error);
            throw error;
        }
    }

    /**
     * Obtener sugerencias de búsqueda
     */
    getSearchSuggestions() {
        const suggestions = [
            'jugadores destacados',
            'equipos locales',
            'torneos activos',
            'partidos hoy',
            'defensas',
            'delanteros',
            'mediocampistas',
            'arqueros'
        ];

        // Agregar búsquedas recientes
        const recentSuggestions = this.recentSearches.slice(0, 3);
        
        return [...recentSuggestions, ...suggestions].slice(0, 8);
    }

    /**
     * Autocompletar búsqueda
     */
    async autocomplete(query, limit = 5) {
        if (!query || query.length < 2) return [];

        try {
            const suggestions = [];
            
            // Buscar usuarios
            const users = await this.searchUsers(query, 3);
            users.forEach(user => {
                suggestions.push({
                    text: user.name,
                    type: 'user',
                    avatar: user.avatar_url,
                    subtitle: user.position || user.user_type
                });
            });

            // Buscar equipos
            const teams = await this.searchTeams(query, 2);
            teams.forEach(team => {
                suggestions.push({
                    text: team.name,
                    type: 'team',
                    avatar: team.logo_url,
                    subtitle: `${team.member_count} miembros`
                });
            });

            return suggestions.slice(0, limit);

        } catch (error) {
            console.error('Error en autocompletado:', error);
            return [];
        }
    }

    /**
     * Gestión de historial de búsquedas
     */
    addToHistory(query) {
        const normalizedQuery = query.trim().toLowerCase();
        
        // Evitar duplicados
        this.searchHistory = this.searchHistory.filter(
            item => item.query !== normalizedQuery
        );
        
        // Agregar al inicio
        this.searchHistory.unshift({
            query: normalizedQuery,
            timestamp: Date.now()
        });
        
        // Mantener solo las últimas 50 búsquedas
        this.searchHistory = this.searchHistory.slice(0, 50);
        
        // Actualizar búsquedas recientes
        this.updateRecentSearches();
        
        // Guardar en localStorage
        this.saveSearchHistory();
    }

    updateRecentSearches() {
        this.recentSearches = this.searchHistory
            .slice(0, 10)
            .map(item => item.query);
    }

    /**
     * Cálculo de relevancia para diferentes tipos de contenido
     */
    calculateUserRelevance(user, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        
        // Coincidencia exacta en el nombre
        if (user.name.toLowerCase() === queryLower) score += 100;
        else if (user.name.toLowerCase().includes(queryLower)) score += 50;
        
        // Coincidencia en posición
        if (user.position && user.position.toLowerCase().includes(queryLower)) score += 30;
        
        // Bonus por rating alto
        if (user.stats?.rating) {
            score += Math.min(user.stats.rating / 100, 20);
        }
        
        return score;
    }

    calculateTeamRelevance(team, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        
        // Coincidencia exacta en el nombre
        if (team.name.toLowerCase() === queryLower) score += 100;
        else if (team.name.toLowerCase().includes(queryLower)) score += 50;
        
        // Coincidencia en descripción
        if (team.description && team.description.toLowerCase().includes(queryLower)) score += 25;
        
        // Bonus por número de miembros
        score += Math.min(team.member_count || 0, 10);
        
        return score;
    }

    calculateTournamentRelevance(tournament, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        
        // Coincidencia exacta en el nombre
        if (tournament.name.toLowerCase() === queryLower) score += 100;
        else if (tournament.name.toLowerCase().includes(queryLower)) score += 50;
        
        // Bonus por torneos activos
        if (tournament.status === 'active') score += 20;
        
        // Bonus por torneos recientes
        const daysSinceStart = (Date.now() - new Date(tournament.start_date)) / (1000 * 60 * 60 * 24);
        if (daysSinceStart < 30) score += 15;
        
        return score;
    }

    calculatePostRelevance(post, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        
        // Coincidencias en el contenido
        const matches = (post.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
        score += matches * 20;
        
        // Bonus por engagement
        score += Math.min((post.likes || 0) / 10, 15);
        score += Math.min((post.comments || 0) / 5, 10);
        
        // Bonus por posts recientes
        const daysOld = (Date.now() - new Date(post.created_at)) / (1000 * 60 * 60 * 24);
        if (daysOld < 7) score += 10;
        
        return score;
    }

    calculateMatchRelevance(match, query) {
        let score = 0;
        const queryLower = query.toLowerCase();
        
        // Coincidencia en nombres de equipos
        if (match.team1_name.toLowerCase().includes(queryLower)) score += 40;
        if (match.team2_name.toLowerCase().includes(queryLower)) score += 40;
        
        // Coincidencia en ubicación
        if (match.location && match.location.toLowerCase().includes(queryLower)) score += 20;
        
        // Bonus por partidos recientes
        const daysOld = (Date.now() - new Date(match.date)) / (1000 * 60 * 60 * 24);
        if (daysOld < 7) score += 15;
        
        return score;
    }

    /**
     * Configurar filtros de búsqueda
     */
    setSearchFilters(filters) {
        this.searchFilters = { ...this.searchFilters, ...filters };
    }

    getSearchFilters() {
        return { ...this.searchFilters };
    }

    /**
     * Limpiar cache de búsquedas
     */
    clearCache() {
        this.searchCache.clear();
        console.log('Cache de búsquedas limpiado');
    }

    /**
     * Persistencia de datos
     */
    saveSearchHistory() {
        try {
            localStorage.setItem('futpro_search_history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.warn('Error guardando historial de búsquedas:', error);
        }
    }

    loadRecentSearches() {
        try {
            const saved = localStorage.getItem('futpro_search_history');
            const history = saved ? JSON.parse(saved) : [];
            return history.slice(0, 10).map(item => item.query || item);
        } catch (error) {
            console.warn('Error cargando historial de búsquedas:', error);
            return [];
        }
    }

    /**
     * Búsquedas avanzadas específicas
     */
    async searchUsersAdvanced(query, filters, limit) {
        const queryBuilder = supabase
            .from('users')
            .select(`
                id, name, email, avatar_url, user_type, 
                position, stats, created_at
            `);

        if (query) {
            queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%,position.ilike.%${query}%`);
        }

        if (filters.userType) {
            queryBuilder.eq('user_type', filters.userType);
        }

        if (filters.position) {
            queryBuilder.eq('position', filters.position);
        }

        if (filters.minRating) {
            queryBuilder.gte('stats->rating', filters.minRating);
        }

        const { data, error } = await queryBuilder
            .limit(limit)
            .order('name');

        if (error) throw error;
        return data || [];
    }

    async searchTeamsAdvanced(query, filters, limit) {
        const queryBuilder = supabase
            .from('teams')
            .select(`
                id, name, description, logo_url, 
                captain_id, member_count, stats, created_at
            `);

        if (query) {
            queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (filters.minMembers) {
            queryBuilder.gte('member_count', filters.minMembers);
        }

        if (filters.maxMembers) {
            queryBuilder.lte('member_count', filters.maxMembers);
        }

        const { data, error } = await queryBuilder
            .limit(limit)
            .order('name');

        if (error) throw error;
        return data || [];
    }

    async searchTournamentsAdvanced(query, filters, limit) {
        const queryBuilder = supabase
            .from('tournaments')
            .select(`
                id, name, description, type, status,
                start_date, end_date, participant_count, created_at
            `);

        if (query) {
            queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`);
        }

        if (filters.status) {
            queryBuilder.eq('status', filters.status);
        }

        if (filters.type) {
            queryBuilder.eq('type', filters.type);
        }

        if (filters.dateFrom) {
            queryBuilder.gte('start_date', filters.dateFrom);
        }

        if (filters.dateTo) {
            queryBuilder.lte('end_date', filters.dateTo);
        }

        const { data, error } = await queryBuilder
            .limit(limit)
            .order('start_date', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    sortResults(results, sortBy) {
        switch (sortBy) {
            case 'name':
                return results.sort((a, b) => a.name.localeCompare(b.name));
            case 'date':
                return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'popularity':
                return results.sort((a, b) => {
                    const aScore = (a.likes || 0) + (a.member_count || 0) + (a.participant_count || 0);
                    const bScore = (b.likes || 0) + (b.member_count || 0) + (b.participant_count || 0);
                    return bScore - aScore;
                });
            default:
                return results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
        }
    }

    /**
     * Obtener estadísticas de búsqueda
     */
    getSearchStats() {
        return {
            totalSearches: this.searchHistory.length,
            recentSearches: this.recentSearches.length,
            cacheSize: this.searchCache.size,
            filters: this.searchFilters
        };
    }

    /**
     * Obtener recomendaciones de AI
     */
    async getAIRecommendations() {
        // Fallback seguro: no usar OpenAI en frontend
        return 'Recomendaciones no disponibles en este entorno.';
    }
}

// Exportar una instancia singleton
export const searchManager = new SearchManager();
