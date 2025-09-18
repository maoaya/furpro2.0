// Gestor de Partidos
export class MatchManager {
    constructor(database, firebase, uiManager, socketService) {
        this.database = database;
        this.firebase = firebase;
        this.ui = uiManager;
        this.socket = socketService;
        this.currentMatch = null;
        this.liveMatches = new Map();
        this.matchHistory = [];
        this.pendingMatches = [];
        this.matchTimer = null;
        this.matchEvents = [];
        
        this.bindEvents();
        this.setupSocketListeners();
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="create-match"]')) {
                this.showCreateMatchModal();
            }
            
            if (e.target.matches('[data-action="join-match"]')) {
                const matchId = e.target.dataset.matchId;
                this.joinMatch(matchId);
            }
            
            if (e.target.matches('[data-action="start-match"]')) {
                const matchId = e.target.dataset.matchId;
                this.startMatch(matchId);
            }
            
            if (e.target.matches('[data-action="view-match"]')) {
                const matchId = e.target.dataset.matchId;
                this.viewMatch(matchId);
            }
            
            if (e.target.matches('[data-action="manage-match"]')) {
                const matchId = e.target.dataset.matchId;
                this.manageMatch(matchId);
            }
            
            if (e.target.matches('[data-action="end-match"]')) {
                const matchId = e.target.dataset.matchId;
                this.endMatch(matchId);
            }
            
            // Eventos del marcador en vivo
            if (e.target.matches('[data-action="add-goal"]')) {
                const team = e.target.dataset.team;
                this.addGoal(team);
            }
            
            if (e.target.matches('[data-action="add-card"]')) {
                const team = e.target.dataset.team;
                const type = e.target.dataset.cardType;
                this.showCardModal(team, type);
            }
            
            if (e.target.matches('[data-action="add-substitution"]')) {
                const team = e.target.dataset.team;
                this.showSubstitutionModal(team);
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.matches('#create-match-form')) {
                e.preventDefault();
                this.createMatch(e.target);
            }
            
            if (e.target.matches('#match-result-form')) {
                e.preventDefault();
                this.submitMatchResult(e.target);
            }
        });
    }

    // Configurar listeners de Socket.io
    setupSocketListeners() {
        if (!this.socket) return;
        
        this.socket.on('match_started', (data) => {
            this.handleMatchStarted(data);
        });
        
        this.socket.on('match_event', (data) => {
            this.handleMatchEvent(data);
        });
        
        this.socket.on('match_ended', (data) => {
            this.handleMatchEnded(data);
        });
        
        this.socket.on('score_updated', (data) => {
            this.updateLiveScore(data);
        });
    }

    // Cargar página de partidos
    async loadMatchesPage() {
        try {
            this.ui.showLoading();
            
            // Cargar datos
            await Promise.all([
                this.loadLiveMatches(),
                this.loadUpcomingMatches(),
                this.loadMatchHistory()
            ]);
            
            // Renderizar página
            this.renderMatchesPage();
            
            this.ui.hideLoading();
        } catch (error) {
            console.error('Error cargando página de partidos:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar partidos', 'error');
        }
    }

    // Cargar partidos en vivo
    async loadLiveMatches() {
        try {
            const matches = await this.database.getLiveMatches();
            this.liveMatches.clear();
            matches.forEach(match => {
                this.liveMatches.set(match.id, match);
            });
            return matches;
        } catch (error) {
            console.error('Error cargando partidos en vivo:', error);
            return [];
        }
    }

    // Cargar próximos partidos
    async loadUpcomingMatches() {
        try {
            this.pendingMatches = await this.database.getUpcomingMatches(this.database.currentUser.id);
            return this.pendingMatches;
        } catch (error) {
            console.error('Error cargando próximos partidos:', error);
            return [];
        }
    }

    // Cargar historial de partidos
    async loadMatchHistory() {
        try {
            this.matchHistory = await this.database.getMatchHistory(this.database.currentUser.id);
            return this.matchHistory;
        } catch (error) {
            console.error('Error cargando historial:', error);
            return [];
        }
    }

    // Renderizar página de partidos
    renderMatchesPage() {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="matches-page">
                <div class="matches-header">
                    <h2>Partidos</h2>
                    <button class="btn btn-primary" data-action="create-match">
                        <i class="fas fa-plus"></i> Crear Partido
                    </button>
                </div>

                <!-- Navegación de partidos -->
                <div class="matches-nav">
                    <button class="nav-tab active" data-tab="live">
                        <i class="fas fa-play-circle"></i> En Vivo
                        ${this.liveMatches.size > 0 ? `<span class="badge">${this.liveMatches.size}</span>` : ''}
                    </button>
                    <button class="nav-tab" data-tab="upcoming">
                        <i class="fas fa-clock"></i> Próximos
                        ${this.pendingMatches.length > 0 ? `<span class="badge">${this.pendingMatches.length}</span>` : ''}
                    </button>
                    <button class="nav-tab" data-tab="history">
                        <i class="fas fa-history"></i> Historial
                    </button>
                    <button class="nav-tab" data-tab="referee">
                        <i class="fas fa-whistle"></i> Arbitrar
                    </button>
                </div>

                <!-- Contenido de pestañas -->
                <div class="matches-content">
                    <div class="tab-content active" id="live-tab">
                        ${this.renderLiveMatches()}
                    </div>
                    
                    <div class="tab-content" id="upcoming-tab">
                        ${this.renderUpcomingMatches()}
                    </div>
                    
                    <div class="tab-content" id="history-tab">
                        ${this.renderMatchHistory()}
                    </div>
                    
                    <div class="tab-content" id="referee-tab">
                        ${this.renderRefereeMatches()}
                    </div>
                </div>
            </div>
        `;

        // Configurar navegación de pestañas
        this.setupTabNavigation();
    }

    // Renderizar partidos en vivo
    renderLiveMatches() {
        const liveMatchesArray = Array.from(this.liveMatches.values());
        
        if (liveMatchesArray.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-play-circle"></i>
                    <h3>No hay partidos en vivo</h3>
                    <p>Los partidos activos aparecerán aquí en tiempo real</p>
                </div>
            `;
        }

        return `
            <div class="live-matches-grid">
                ${liveMatchesArray.map(match => this.renderLiveMatchCard(match)).join('')}
            </div>
        `;
    }

    // Renderizar tarjeta de partido en vivo
    renderLiveMatchCard(match) {
        return `
            <div class="live-match-card" data-match-id="${match.id}">
                <div class="match-status">
                    <span class="live-indicator">
                        <i class="fas fa-circle"></i> EN VIVO
                    </span>
                    <span class="match-time">${this.formatMatchTime(match.elapsed_time)}'</span>
                </div>
                
                <div class="match-teams">
                    <div class="team home-team">
                        <img src="${match.home_team.logo || '/assets/default-team.png'}" 
                             alt="${match.home_team.name}" class="team-logo">
                        <span class="team-name">${match.home_team.name}</span>
                    </div>
                    
                    <div class="match-score">
                        <span class="score">${match.home_score} - ${match.away_score}</span>
                    </div>
                    
                    <div class="team away-team">
                        <img src="${match.away_team.logo || '/assets/default-team.png'}" 
                             alt="${match.away_team.name}" class="team-logo">
                        <span class="team-name">${match.away_team.name}</span>
                    </div>
                </div>
                
                <div class="match-info">
                    <div class="tournament-info">
                        <i class="fas fa-trophy"></i>
                        <span>${match.tournament_name || 'Partido amistoso'}</span>
                    </div>
                    <div class="venue-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${match.venue}</span>
                    </div>
                </div>
                
                <div class="match-actions">
                    <button class="btn btn-sm btn-outline" data-action="view-match" 
                            data-match-id="${match.id}">
                        Ver Detalles
                    </button>
                    ${this.canManageMatch(match) ? `
                        <button class="btn btn-sm btn-primary" data-action="manage-match" 
                                data-match-id="${match.id}">
                            Gestionar
                        </button>
                    ` : ''}
                </div>
                
                ${match.recent_events && match.recent_events.length > 0 ? `
                    <div class="recent-events">
                        ${match.recent_events.slice(0, 3).map(event => `
                            <div class="event">
                                <i class="fas fa-${this.getEventIcon(event.type)}"></i>
                                <span>${event.description}</span>
                                <span class="event-time">${event.minute}'</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Renderizar próximos partidos
    renderUpcomingMatches() {
        if (this.pendingMatches.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <h3>No hay partidos programados</h3>
                    <p>Crea un nuevo partido o únete a uno existente</p>
                    <button class="btn btn-primary" data-action="create-match">
                        Crear Partido
                    </button>
                </div>
            `;
        }

        return `
            <div class="upcoming-matches">
                ${this.pendingMatches.map(match => this.renderUpcomingMatchCard(match)).join('')}
            </div>
        `;
    }

    // Renderizar tarjeta de próximo partido
    renderUpcomingMatchCard(match) {
        const timeUntilMatch = this.getTimeUntilMatch(match.scheduled_time);
        const canStart = this.canStartMatch(match);
        
        return `
            <div class="upcoming-match-card">
                <div class="match-date">
                    <div class="date-main">${this.formatDate(match.scheduled_time)}</div>
                    <div class="date-time">${this.formatTime(match.scheduled_time)}</div>
                    <div class="time-until ${timeUntilMatch.urgent ? 'urgent' : ''}">${timeUntilMatch.text}</div>
                </div>
                
                <div class="match-details">
                    <div class="teams">
                        <div class="team">
                            <img src="${match.home_team.logo || '/assets/default-team.png'}" 
                                 alt="${match.home_team.name}" class="team-logo">
                            <div class="team-info">
                                <span class="team-name">${match.home_team.name}</span>
                                <span class="team-status ${match.home_team.confirmed ? 'confirmed' : 'pending'}">
                                    ${match.home_team.confirmed ? '✓ Confirmado' : '⏳ Pendiente'}
                                </span>
                            </div>
                        </div>
                        
                        <div class="vs">VS</div>
                        
                        <div class="team">
                            <img src="${match.away_team.logo || '/assets/default-team.png'}" 
                                 alt="${match.away_team.name}" class="team-logo">
                            <div class="team-info">
                                <span class="team-name">${match.away_team.name}</span>
                                <span class="team-status ${match.away_team.confirmed ? 'confirmed' : 'pending'}">
                                    ${match.away_team.confirmed ? '✓ Confirmado' : '⏳ Pendiente'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="match-meta">
                        <div class="meta-item">
                            <i class="fas fa-trophy"></i>
                            <span>${match.tournament_name || 'Partido amistoso'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${match.venue}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${match.format}</span>
                        </div>
                        ${match.referee ? `
                            <div class="meta-item">
                                <i class="fas fa-whistle"></i>
                                <span>${match.referee.name}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="match-actions">
                    <button class="btn btn-outline" data-action="view-match" 
                            data-match-id="${match.id}">
                        Ver Detalles
                    </button>
                    
                    ${!this.isUserInMatch(match) ? `
                        <button class="btn btn-primary" data-action="join-match" 
                                data-match-id="${match.id}">
                            Unirse
                        </button>
                    ` : canStart ? `
                        <button class="btn btn-success" data-action="start-match" 
                                data-match-id="${match.id}">
                            <i class="fas fa-play"></i> Iniciar
                        </button>
                    ` : ''}
                    
                    ${this.canManageMatch(match) ? `
                        <button class="btn btn-secondary" data-action="manage-match" 
                                data-match-id="${match.id}">
                            Gestionar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Mostrar modal de creación de partido
    showCreateMatchModal() {
        this.ui.showModal('create-match', {
            title: 'Crear Nuevo Partido',
            content: `
                <form id="create-match-form" class="create-match-form">
                    <div class="form-section">
                        <h4>Información Básica</h4>
                        
                        <div class="form-group">
                            <label for="match_format">Formato del partido</label>
                            <select id="match_format" name="format" required>
                                <option value="">Seleccionar formato</option>
                                <option value="5v5">5 vs 5</option>
                                <option value="7v7">7 vs 7</option>
                                <option value="8v8">8 vs 8</option>
                                <option value="9v9">9 vs 9</option>
                                <option value="11v11">11 vs 11</option>
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="match_date">Fecha</label>
                                <input type="date" id="match_date" name="date" required>
                            </div>
                            <div class="form-group">
                                <label for="match_time">Hora</label>
                                <input type="time" id="match_time" name="time" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="match_duration">Duración (minutos)</label>
                            <select id="match_duration" name="duration" required>
                                <option value="30">30 minutos</option>
                                <option value="45">45 minutos</option>
                                <option value="60">60 minutos</option>
                                <option value="90" selected>90 minutos</option>
                                <option value="120">120 minutos</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="match_venue">Ubicación</label>
                            <input type="text" id="match_venue" name="venue" required 
                                   placeholder="Dirección o nombre de la cancha">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Equipos</h4>
                        
                        <div class="form-group">
                            <label for="home_team">Equipo Local</label>
                            <select id="home_team" name="home_team" required>
                                <option value="">Seleccionar equipo</option>
                                <!-- Se llenará dinámicamente -->
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="away_team">Equipo Visitante</label>
                            <select id="away_team" name="away_team">
                                <option value="">Buscar oponente automáticamente</option>
                                <!-- Se llenará dinámicamente -->
                            </select>
                            <small>Deja en blanco para buscar oponente automáticamente</small>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4>Configuración Adicional</h4>
                        
                        <div class="form-group">
                            <label for="tournament_id">Torneo (opcional)</label>
                            <select id="tournament_id" name="tournament_id">
                                <option value="">Partido amistoso</option>
                                <!-- Se llenará dinámicamente -->
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="referee_id">Árbitro (opcional)</label>
                            <select id="referee_id" name="referee_id">
                                <option value="">Sin árbitro</option>
                                <!-- Se llenará dinámicamente -->
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="public_match" name="public_match" checked>
                                Partido público (otros pueden unirse)
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="live_stream" name="live_stream">
                                Permitir transmisión en vivo
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="match_description">Descripción (opcional)</label>
                        <textarea id="match_description" name="description" rows="3" 
                                  placeholder="Información adicional sobre el partido..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Crear Partido
                        </button>
                    </div>
                </form>
            `
        });

        // Cargar opciones dinámicas
        this.loadMatchFormOptions();
        
        // Configurar fecha mínima
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('match_date').min = today;
    }

    // Cargar opciones del formulario
    async loadMatchFormOptions() {
        try {
            // Cargar equipos del usuario
            const userTeams = await this.database.getUserTeams(this.database.currentUser.id);
            const homeTeamSelect = document.getElementById('home_team');
            const awayTeamSelect = document.getElementById('away_team');
            
            userTeams.forEach(team => {
                const option = new Option(team.name, team.id);
                homeTeamSelect.add(option.cloneNode(true));
                awayTeamSelect.add(option);
            });
            
            // Cargar torneos activos
            const activeTournaments = await this.database.getActiveTournaments();
            const tournamentSelect = document.getElementById('tournament_id');
            
            activeTournaments.forEach(tournament => {
                const option = new Option(tournament.name, tournament.id);
                tournamentSelect.add(option);
            });
            
            // Cargar árbitros disponibles
            const referees = await this.database.getAvailableReferees();
            const refereeSelect = document.getElementById('referee_id');
            
            referees.forEach(referee => {
                const option = new Option(referee.name, referee.id);
                refereeSelect.add(option);
            });
            
        } catch (error) {
            console.error('Error cargando opciones:', error);
        }
    }

    // Crear partido
    async createMatch(form) {
        try {
            this.ui.showLoading('Creando partido...');
            
            const formData = new FormData(form);
            
            // Validar datos
            const homeTeamId = formData.get('home_team');
            if (!homeTeamId) {
                throw new Error('Debes seleccionar un equipo local');
            }
            
            const matchDate = formData.get('date');
            const matchTime = formData.get('time');
            const scheduledTime = new Date(`${matchDate}T${matchTime}`);
            
            if (scheduledTime <= new Date()) {
                throw new Error('La fecha y hora del partido debe ser en el futuro');
            }
            
            // Preparar datos del partido
            const matchData = {
                format: formData.get('format'),
                scheduled_time: scheduledTime.toISOString(),
                duration: parseInt(formData.get('duration')),
                venue: formData.get('venue'),
                home_team_id: homeTeamId,
                away_team_id: formData.get('away_team') || null,
                tournament_id: formData.get('tournament_id') || null,
                referee_id: formData.get('referee_id') || null,
                description: formData.get('description'),
                public_match: formData.get('public_match') === 'on',
                live_stream_enabled: formData.get('live_stream') === 'on',
                created_by: this.database.currentUser.id,
                status: 'pending'
            };
            
            // Crear partido
            const newMatch = await this.database.createMatch(matchData);
            
            // Si no hay equipo visitante, buscar automáticamente
            if (!matchData.away_team_id && matchData.public_match) {
                await this.findOpponent(newMatch.id, matchData.format);
            }
            
            // Actualizar listas
            this.pendingMatches.unshift(newMatch);
            
            // Notificar
            this.ui.closeModal();
            this.renderMatchesPage();
            this.ui.hideLoading();
            this.ui.showToast('Partido creado correctamente', 'success');
            
            // Enviar notificaciones
            await this.sendMatchNotifications(newMatch);
            
        } catch (error) {
            console.error('Error creando partido:', error);
            this.ui.hideLoading();
            this.ui.showToast(error.message, 'error');
        }
    }

    // Iniciar partido
    async startMatch(matchId) {
        try {
            this.ui.showLoading('Iniciando partido...');
            
            // Verificar que ambos equipos estén confirmados
            const match = await this.database.getMatch(matchId);
            if (!match.home_team.confirmed || !match.away_team.confirmed) {
                throw new Error('Ambos equipos deben confirmar su participación');
            }
            
            // Iniciar partido
            const startedMatch = await this.database.startMatch(matchId);
            
            // Actualizar estado local
            this.liveMatches.set(matchId, startedMatch);
            this.pendingMatches = this.pendingMatches.filter(m => m.id !== matchId);
            
            // Notificar via socket
            if (this.socket) {
                this.socket.emit('match_started', { matchId, match: startedMatch });
            }
            
            // Redirigir a vista de partido en vivo
            this.viewLiveMatch(matchId);
            
            this.ui.hideLoading();
            this.ui.showToast('¡Partido iniciado!', 'success');
            
        } catch (error) {
            console.error('Error iniciando partido:', error);
            this.ui.hideLoading();
            this.ui.showToast(error.message, 'error');
        }
    }

    // Ver partido en vivo
    viewLiveMatch(matchId) {
        const container = document.getElementById('main-content');
        if (!container) return;

        const match = this.liveMatches.get(matchId);
        if (!match) return;

        container.innerHTML = `
            <div class="live-match-view" data-match-id="${matchId}">
                <!-- Header del partido -->
                <div class="match-header">
                    <button class="back-btn" onclick="matchManager.loadMatchesPage()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    
                    <div class="match-info">
                        <div class="status">
                            <span class="live-indicator">
                                <i class="fas fa-circle"></i> EN VIVO
                            </span>
                            <span class="match-time" id="match-timer">${this.formatMatchTime(match.elapsed_time)}'</span>
                        </div>
                        <div class="tournament">
                            ${match.tournament_name || 'Partido Amistoso'}
                        </div>
                    </div>
                    
                    <div class="match-actions">
                        ${this.canManageMatch(match) ? `
                            <button class="btn btn-danger" data-action="end-match" 
                                    data-match-id="${matchId}">
                                <i class="fas fa-stop"></i> Finalizar
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Marcador principal -->
                <div class="scoreboard">
                    <div class="team home-team">
                        <img src="${match.home_team.logo || '/assets/default-team.png'}" 
                             alt="${match.home_team.name}" class="team-logo">
                        <h2 class="team-name">${match.home_team.name}</h2>
                        <div class="team-score" id="home-score">${match.home_score}</div>
                    </div>
                    
                    <div class="score-separator">
                        <div class="vs">VS</div>
                        <div class="match-period">${this.getMatchPeriod(match)}</div>
                    </div>
                    
                    <div class="team away-team">
                        <img src="${match.away_team.logo || '/assets/default-team.png'}" 
                             alt="${match.away_team.name}" class="team-logo">
                        <h2 class="team-name">${match.away_team.name}</h2>
                        <div class="team-score" id="away-score">${match.away_score}</div>
                    </div>
                </div>

                <!-- Controles del partido (solo para gestores) -->
                ${this.canManageMatch(match) ? `
                    <div class="match-controls">
                        <div class="control-section">
                            <h4>Goles</h4>
                            <div class="control-buttons">
                                <button class="btn btn-success" data-action="add-goal" data-team="home">
                                    <i class="fas fa-futbol"></i> Gol Local
                                </button>
                                <button class="btn btn-success" data-action="add-goal" data-team="away">
                                    <i class="fas fa-futbol"></i> Gol Visitante
                                </button>
                            </div>
                        </div>
                        
                        <div class="control-section">
                            <h4>Tarjetas</h4>
                            <div class="control-buttons">
                                <button class="btn btn-warning" data-action="add-card" 
                                        data-team="home" data-card-type="yellow">
                                    <i class="fas fa-square" style="color: yellow;"></i> Amarilla Local
                                </button>
                                <button class="btn btn-warning" data-action="add-card" 
                                        data-team="away" data-card-type="yellow">
                                    <i class="fas fa-square" style="color: yellow;"></i> Amarilla Visitante
                                </button>
                                <button class="btn btn-danger" data-action="add-card" 
                                        data-team="home" data-card-type="red">
                                    <i class="fas fa-square" style="color: red;"></i> Roja Local
                                </button>
                                <button class="btn btn-danger" data-action="add-card" 
                                        data-team="away" data-card-type="red">
                                    <i class="fas fa-square" style="color: red;"></i> Roja Visitante
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Timeline de eventos -->
                <div class="match-timeline">
                    <h3>Eventos del Partido</h3>
                    <div class="timeline" id="match-events">
                        ${this.renderMatchEvents(match.events || [])}
                    </div>
                </div>

                <!-- Chat en vivo -->
                <div class="live-chat">
                    <h3>Chat en Vivo</h3>
                    <div class="chat-container" id="match-chat">
                        <!-- El chat se cargará aquí -->
                    </div>
                </div>
            </div>
        `;

        // Iniciar timer del partido
        this.startMatchTimer(matchId);
        
        // Cargar chat en vivo
        if (this.chatManager) {
            this.chatManager.loadMatchChat(matchId);
        }
    }

    // Agregar gol
    async addGoal(team) {
        try {
            const matchId = this.currentMatch?.id;
            if (!matchId) return;
            
            const goalData = {
                match_id: matchId,
                team: team,
                type: 'goal',
                minute: this.getCurrentMinute(),
                player_id: null, // Se puede expandir para seleccionar jugador
                description: `Gol del equipo ${team === 'home' ? 'local' : 'visitante'}`
            };
            
            // Guardar evento
            await this.database.addMatchEvent(goalData);
            
            // Actualizar marcador
            const match = this.liveMatches.get(matchId);
            if (team === 'home') {
                match.home_score++;
                document.getElementById('home-score').textContent = match.home_score;
            } else {
                match.away_score++;
                document.getElementById('away-score').textContent = match.away_score;
            }
            
            // Notificar via socket
            if (this.socket) {
                this.socket.emit('match_event', goalData);
                this.socket.emit('score_updated', {
                    matchId,
                    homeScore: match.home_score,
                    awayScore: match.away_score
                });
            }
            
            // Actualizar timeline
            this.addEventToTimeline(goalData);
            
        } catch (error) {
            console.error('Error agregando gol:', error);
            this.ui.showToast('Error al agregar gol', 'error');
        }
    }

    // Funciones de utilidad
    formatMatchTime(minutes) {
        return minutes || 0;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getTimeUntilMatch(scheduledTime) {
        const now = new Date();
        const matchTime = new Date(scheduledTime);
        const diffMs = matchTime - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffMs < 0) {
            return { text: 'Partido pasado', urgent: true };
        } else if (diffHours < 1) {
            return { text: `En ${diffMinutes} min`, urgent: true };
        } else if (diffHours < 24) {
            return { text: `En ${diffHours}h ${diffMinutes}m`, urgent: diffHours < 2 };
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return { text: `En ${diffDays} días`, urgent: false };
        }
    }

    canManageMatch(match) {
        const userId = this.database.currentUser.id;
        return match.created_by === userId || 
               match.referee_id === userId ||
               (match.home_team.captain_id === userId) ||
               (match.away_team.captain_id === userId);
    }

    canStartMatch(match) {
        return this.canManageMatch(match) && 
               match.home_team.confirmed && 
               match.away_team.confirmed &&
               new Date(match.scheduled_time) <= new Date();
    }

    isUserInMatch(match) {
        const userId = this.database.currentUser.id;
        return match.home_team.members?.some(m => m.id === userId) ||
               match.away_team.members?.some(m => m.id === userId);
    }

    getEventIcon(eventType) {
        const icons = {
            'goal': 'futbol',
            'yellow_card': 'square',
            'red_card': 'square',
            'substitution': 'exchange-alt',
            'start': 'play',
            'end': 'stop',
            'half_time': 'pause'
        };
        return icons[eventType] || 'circle';
    }

    getMatchPeriod(match) {
        const elapsed = match.elapsed_time || 0;
        const halfTime = 45;
        
        if (elapsed < halfTime) {
            return '1er Tiempo';
        } else if (elapsed === halfTime) {
            return 'Medio Tiempo';
        } else if (elapsed < 90) {
            return '2do Tiempo';
        } else {
            return 'Tiempo Extra';
        }
    }

    getCurrentMinute() {
        return this.currentMatch?.elapsed_time || 0;
    }

    // Configurar navegación de pestañas
    setupTabNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-tab')) {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');
    }

    // Destruir instancia
    destroy() {
        if (this.matchTimer) {
            clearInterval(this.matchTimer);
        }
        this.currentMatch = null;
        this.liveMatches.clear();
        this.matchHistory = [];
        this.pendingMatches = [];
        this.matchEvents = [];
    }

    // Placeholder methods para renderizado adicional
    renderMatchHistory() {
        return `<div class="empty-state"><p>Historial de partidos en desarrollo...</p></div>`;
    }

    renderRefereeMatches() {
        return `<div class="empty-state"><p>Sistema de arbitraje en desarrollo...</p></div>`;
    }

    renderMatchEvents(events) {
        return events.map(event => `
            <div class="timeline-event">
                <div class="event-time">${event.minute}'</div>
                <div class="event-icon">
                    <i class="fas fa-${this.getEventIcon(event.type)}"></i>
                </div>
                <div class="event-description">${event.description}</div>
            </div>
        `).join('');
    }

    addEventToTimeline(event) {
        const timeline = document.getElementById('match-events');
        if (timeline) {
            const eventHtml = this.renderMatchEvents([event]);
            timeline.insertAdjacentHTML('afterbegin', eventHtml);
        }
    }

    startMatchTimer() {
        // Implementación del timer en tiempo real
        // Se expandirá según necesidades
    }

    handleMatchStarted() {
        // Manejar evento de partido iniciado via socket
    }

    handleMatchEvent() {
        // Manejar eventos del partido via socket
    }

    handleMatchEnded() {
        // Manejar fin del partido via socket
    }

    updateLiveScore() {
        // Actualizar marcador en tiempo real
    }
}
