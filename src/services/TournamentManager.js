
// Gestor de Torneos principal
import supabase from '../supabaseClient';
export class TournamentManager {
    // ...existing code...
    // (El resto del archivo ya contiene la clase TournamentManager real y métodos válidos)

    // Mostrar modal de creación de torneo
    showCreateTournamentModal() {
        this.ui.showModal('create-tournament', {
            title: 'Crear Nuevo Torneo',
            content: `
                <form id="create-tournament-form" class="create-tournament-form">
                    <div class="form-group">
                        <label for="tournament_name">Nombre del torneo</label>
                        <input type="text" id="tournament_name" name="name" required 
                               placeholder="Ej: Copa de Verano 2024">
                    </div>
                    
                    <div class="form-group">
                        <label for="tournament_description">Descripción</label>
                        <textarea id="tournament_description" name="description" rows="3" 
                                  placeholder="Describe el torneo..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tournament_format">Formato</label>
                            <select id="tournament_format" name="format" required>
                                <option value="">Seleccionar formato</option>
                                <option value="5v5">5 vs 5</option>
                                <option value="7v7">7 vs 7</option>
                                <option value="8v8">8 vs 8</option>
                                <option value="9v9">9 vs 9</option>
                                <option value="11v11">11 vs 11</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="tournament_type">Tipo de torneo</label>
                            <select id="tournament_type" name="type" required>
                                <option value="">Seleccionar tipo</option>
                                <option value="knockout">Eliminación directa</option>
                                <option value="round_robin">Liga (todos contra todos)</option>
                                <option value="swiss">Sistema suizo</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="max_participants">Máximo de equipos</label>
                            <select id="max_participants" name="max_participants" required>
                                <option value="4">4 equipos</option>
                                <option value="8">8 equipos</option>
                                <option value="16">16 equipos</option>
                                <option value="32">32 equipos</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="min_participants">Mínimo de equipos</label>
                            <select id="min_participants" name="min_participants" required>
                                <option value="4">4 equipos</option>
                                <option value="6">6 equipos</option>
                                <option value="8">8 equipos</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="start_date">Fecha de inicio</label>
                            <input type="datetime-local" id="start_date" name="start_date" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registration_deadline">Fecha límite de inscripción</label>
                            <input type="datetime-local" id="registration_deadline" name="registration_deadline" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="tournament_location">Ubicación</label>
                        <input type="text" id="tournament_location" name="location" required 
                               placeholder="Dirección o nombre del lugar">
                    </div>
                    
                    <div class="form-group">
                        <label for="tournament_banner">Banner del torneo</label>
                        <input type="file" id="tournament_banner" name="banner" accept="image/*">
                        <small>Opcional - Tamaño recomendado: 1200x400px</small>
                    </div>
                    
                    <div class="form-section">
                        <h4>Configuración de premios</h4>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="has_entry_fee" name="has_entry_fee" 
                                       onchange="tournamentManager.toggleEntryFee()">
                                Torneo con entrada
                            </label>
                        </div>
                        
                        <div id="entry-fee-section" style="display: none;">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="entry_fee">Costo de entrada</label>
                                    <input type="number" id="entry_fee" name="entry_fee" min="0" step="0.01">
                                </div>
                                
                                <div class="form-group">
                                    <label for="prize_distribution">Distribución de premios</label>
                                    <select id="prize_distribution" name="prize_distribution">
                                        <option value="winner_takes_all">Ganador se lleva todo</option>
                                        <option value="top_3">Top 3 (50%, 30%, 20%)</option>
                                        <option value="top_2">Top 2 (70%, 30%)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="tournament_rules">Reglas especiales</label>
                        <textarea id="tournament_rules" name="rules" rows="4" 
                                  placeholder="Reglas adicionales del torneo..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Crear Torneo
                        </button>
                    </div>
                </form>
            `
        });

        // Configurar fechas mínimas
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        document.getElementById('start_date').min = this.formatDateTimeLocal(tomorrow);
        document.getElementById('registration_deadline').min = this.formatDateTimeLocal(now);
    }

    // Alternar sección de entrada
    toggleEntryFee() {
        const checkbox = document.getElementById('has_entry_fee');
        const section = document.getElementById('entry-fee-section');
        
        if (checkbox.checked) {
            section.style.display = 'block';
            document.getElementById('entry_fee').required = true;
        } else {
            section.style.display = 'none';
            document.getElementById('entry_fee').required = false;
        }
    }

    // Crear torneo
    async createTournament(form) {
        try {
            this.ui.showLoading('Creando torneo...');
            
            const formData = new FormData(form);
            
            // Validar datos
            const name = formData.get('name').trim();
            if (!name) {
                throw new Error('El nombre del torneo es requerido');
            }
            
            const startDate = new Date(formData.get('start_date'));
            const registrationDeadline = new Date(formData.get('registration_deadline'));
            const now = new Date();
            
            if (registrationDeadline <= now) {
                throw new Error('La fecha límite de inscripción debe ser en el futuro');
            }
            
            if (startDate <= registrationDeadline) {
                throw new Error('La fecha de inicio debe ser posterior a la fecha límite de inscripción');
            }
            
            // Subir banner si existe
            let bannerUrl = null;
            const bannerFile = formData.get('banner');
            if (bannerFile && bannerFile.size > 0) {
                bannerUrl = await this.database.uploadFile(bannerFile, 'tournament-banners');
            }
            
            // Preparar datos del torneo
            const tournamentData = {
                name: formData.get('name'),
                description: formData.get('description'),
                format: formData.get('format'),
                type: formData.get('type'),
                max_participants: parseInt(formData.get('max_participants')),
                min_participants: parseInt(formData.get('min_participants')),
                start_date: formData.get('start_date'),
                registration_deadline: formData.get('registration_deadline'),
                location: formData.get('location'),
                banner_url: bannerUrl,
                organizer_id: this.database.currentUser.id,
                entry_fee: formData.get('has_entry_fee') ? parseFloat(formData.get('entry_fee')) : 0,
                prize_distribution: formData.get('prize_distribution') || 'winner_takes_all',
                rules: formData.get('rules'),
                status: 'open'
            };
            
            // Crear torneo
            const newTournament = await this.database.createTournament(tournamentData);
            
            // Actualizar listas
            this.availableTournaments.unshift(newTournament);
            this.userTournaments.unshift({...newTournament, is_organizer: true});
            
            // Actualizar UI
            this.ui.closeModal();
            this.renderTournamentsPage();
            this.ui.hideLoading();
            this.ui.showToast('Torneo creado correctamente', 'success');
            
        } catch (error) {
            console.error('Error creando torneo:', error);
            this.ui.hideLoading();
            this.ui.showToast(error.message, 'error');
        }
    }

    // Unirse a torneo
    async joinTournament(tournamentId) {
        try {
            // Verificar que el usuario tenga un equipo para el formato
            const tournament = this.availableTournaments.find(t => t.id === tournamentId);
            if (!tournament) {
                throw new Error('Torneo no encontrado');
            }
            
            const userTeamsForFormat = await this.database.getUserTeamsByFormat(
                this.database.currentUser.id, 
                tournament.format
            );
            
            if (userTeamsForFormat.length === 0) {
                throw new Error(`Necesitas un equipo de ${tournament.format} para unirte a este torneo`);
            }
            
            // Mostrar selector de equipo si tiene múltiples equipos
            let selectedTeamId;
            if (userTeamsForFormat.length === 1) {
                selectedTeamId = userTeamsForFormat[0].id;
            } else {
                selectedTeamId = await this.showTeamSelector(userTeamsForFormat);
                if (!selectedTeamId) return;
            }
            
            // Unirse al torneo
            await this.database.joinTournament(tournamentId, selectedTeamId);
            
            // Actualizar listas
            await this.loadAvailableTournaments();
            await this.loadUserTournaments();
            
            this.renderTournamentsPage();
            this.ui.showToast('Te has unido al torneo correctamente', 'success');
            
        } catch (error) {
            console.error('Error uniéndose al torneo:', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    // Ver detalles del torneo
    async viewTournament(tournamentId) {
        try {
            this.ui.showLoading();
            
            // Cargar datos del torneo
            const [tournament, participants, matches, bracket] = await Promise.all([
                this.database.getTournament(tournamentId),
                this.database.getTournamentParticipants(tournamentId),
                this.database.getTournamentMatches(tournamentId),
                this.database.getTournamentBracket(tournamentId)
            ]);
            
            this.currentTournament = tournament;
            this.tournamentMatches = matches;
            this.bracket = bracket;
            
            this.renderTournamentDetails(tournament, participants, matches, bracket);
            this.ui.hideLoading();
            
        } catch (error) {
            console.error('Error cargando torneo:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar torneo', 'error');
        }
    }

    // Renderizar detalles del torneo
    renderTournamentDetails(tournament, participants, matches, bracket) {
        const container = document.getElementById('main-content');
        if (!container) return;

        const isParticipant = participants.some(p => p.team_owner_id === this.database.currentUser.id);
        const isOrganizer = tournament.organizer_id === this.database.currentUser.id;

        container.innerHTML = `
            <div class="tournament-details">
                <!-- Header del torneo -->
                <div class="tournament-header">
                    <button class="back-btn" onclick="tournamentManager.loadTournamentsPage()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    
                    <div class="tournament-banner" style="background-image: url('${tournament.banner_url || '/assets/default-tournament.jpg'}')">
                        <div class="tournament-overlay">
                            <div class="tournament-info">
                                <h1>${tournament.name}</h1>
                                <p>${tournament.description}</p>
                                <div class="tournament-meta">
                                    <span class="status-badge ${tournament.status}">${this.getStatusText(tournament.status)}</span>
                                    <span class="format-badge">${tournament.format}</span>
                                    <span class="type-badge">${tournament.type}</span>
                                </div>
                            </div>
                            
                            <div class="tournament-actions">
                                ${tournament.status === 'open' && !isParticipant ? `
                                    <button class="btn btn-primary" data-action="join-tournament" 
                                            data-tournament-id="${tournament.id}">
                                        <i class="fas fa-plus"></i> Unirse
                                    </button>
                                ` : isOrganizer ? `
                                    <button class="btn btn-primary" data-action="manage-tournament" 
                                            data-tournament-id="${tournament.id}">
                                        <i class="fas fa-cog"></i> Gestionar
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Información del torneo -->
                <div class="tournament-info-grid">
                    <div class="info-card">
                        <i class="fas fa-calendar"></i>
                        <div>
                            <strong>Inicio</strong>
                            <p>${this.formatDateTime(tournament.start_date)}</p>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Inscripción hasta</strong>
                            <p>${this.formatDateTime(tournament.registration_deadline)}</p>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <i class="fas fa-users"></i>
                        <div>
                            <strong>Participantes</strong>
                            <p>${participants.length}/${tournament.max_participants}</p>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Ubicación</strong>
                            <p>${tournament.location}</p>
                        </div>
                    </div>
                    
                    ${tournament.entry_fee > 0 ? `
                        <div class="info-card">
                            <i class="fas fa-dollar-sign"></i>
                            <div>
                                <strong>Entrada</strong>
                                <p>$${tournament.entry_fee}</p>
                            </div>
                        </div>
                        
                        <div class="info-card">
                            <i class="fas fa-trophy"></i>
                            <div>
                                <strong>Premio</strong>
                                <p>$${tournament.prize_pool || tournament.entry_fee * participants.length}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Navegación del torneo -->
                <div class="tournament-nav">
                    <button class="nav-tab active" data-tab="participants">
                        <i class="fas fa-users"></i> Participantes
                    </button>
                    <button class="nav-tab" data-tab="bracket">
                        <i class="fas fa-sitemap"></i> Bracket
                    </button>
                    <button class="nav-tab" data-tab="matches">
                        <i class="fas fa-futbol"></i> Partidos
                    </button>
                    <button class="nav-tab" data-tab="rules">
                        <i class="fas fa-book"></i> Reglas
                    </button>
                </div>

                <!-- Contenido del torneo -->
                <div class="tournament-content">
                    <div class="tab-content active" id="participants-tab">
                        ${this.renderTournamentParticipants(participants)}
                    </div>
                    
                    <div class="tab-content" id="bracket-tab">
                        ${this.renderTournamentBracket(bracket)}
                    </div>
                    
                    <div class="tab-content" id="matches-tab">
                        ${this.renderTournamentMatches(matches)}
                    </div>
                    
                    <div class="tab-content" id="rules-tab">
                        ${this.renderTournamentRules(tournament)}
                    </div>
                </div>
            </div>
        `;

        // Configurar navegación
        this.setupTabNavigation();
    }

    // Renderizar participantes del torneo
    renderTournamentParticipants(participants) {
        if (participants.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No hay participantes aún</h3>
                    <p>Los equipos inscritos aparecerán aquí</p>
                </div>
            `;
        }

        return `
            <div class="participants-grid">
                ${participants.map(participant => `
                    <div class="participant-card">
                        <img src="${participant.team_logo || '/assets/default-team.png'}" 
                             alt="${participant.team_name}" class="team-logo">
                        <div class="team-info">
                            <h4>${participant.team_name}</h4>
                            <p>Capitán: ${participant.captain_name}</p>
                            <div class="team-stats">
                                <span><i class="fas fa-users"></i> ${participant.members_count}</span>
                                <span><i class="fas fa-trophy"></i> ${participant.team_wins || 0}W</span>
                                <span><i class="fas fa-times"></i> ${participant.team_losses || 0}L</span>
                            </div>
                        </div>
                        <div class="seed-number">#${participant.seed || participants.indexOf(participant) + 1}</div>
                    </div>
                `).join('')}
            </div>
        `;
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

    // Cambiar pestaña
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

    // Funciones de utilidad
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    getStatusText(status) {
        const texts = {
            'open': 'Abierto',
            'in_progress': 'En progreso',
            'completed': 'Finalizado',
            'cancelled': 'Cancelado'
        };
        return texts[status] || status;
    }

    // Renderizar bracket del torneo (placeholder)
    renderTournamentBracket() {
        return `
            <div class="bracket-container">
                <div class="empty-state">
                    <i class="fas fa-sitemap"></i>
                    <h3>Bracket no generado</h3>
                    <p>El bracket se generará cuando inicie el torneo</p>
                </div>
            </div>
        `;
    }

    // Renderizar partidos del torneo (placeholder)
    renderTournamentMatches() {
        return `
            <div class="matches-container">
                <div class="empty-state">
                    <i class="fas fa-futbol"></i>
                    <h3>No hay partidos programados</h3>
                    <p>Los partidos aparecerán cuando inicie el torneo</p>
                </div>
            </div>
        `;
    }

    // Renderizar reglas del torneo
    renderTournamentRules(tournament) {
        return `
            <div class="tournament-rules">
                <div class="rules-section">
                    <h3>Reglas Generales</h3>
                    <ul>
                        <li>Formato: ${tournament.format}</li>
                        <li>Tipo: ${this.getTypeDescription(tournament.type)}</li>
                        <li>Duración del partido: 90 minutos (2 tiempos de 45 min)</li>
                        <li>Máximo de sustituciones: 5</li>
                        <li>En caso de empate en eliminatorias: prórroga y penales</li>
                    </ul>
                </div>
                
                ${tournament.rules ? `
                    <div class="rules-section">
                        <h3>Reglas Especiales</h3>
                        <div class="custom-rules">
                            ${tournament.rules.split('\n').map(rule => `<p>${rule}</p>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="rules-section">
                    <h3>Código de Conducta</h3>
                    <ul>
                        <li>Respeto hacia jugadores, árbitros y organizadores</li>
                        <li>Fair play en todo momento</li>
                        <li>Prohibido el uso de lenguaje ofensivo</li>
                        <li>Los equipos deben llegar 15 minutos antes de su partido</li>
                        <li>Cualquier violación puede resultar en descalificación</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getTypeDescription(type) {
        const descriptions = {
            'knockout': 'Eliminación directa - El perdedor queda eliminado',
            'round_robin': 'Liga - Todos contra todos, gana el que más puntos acumule',
            'swiss': 'Sistema suizo - Emparejamientos basados en resultados previos'
        };
        return descriptions[type] || type;
    }

    // Destruir instancia
    destroy() {
        this.currentTournament = null;
        this.availableTournaments = [];
        this.userTournaments = [];
        this.tournamentMatches = [];
        this.bracket = null;
    }
}

// Funciones independientes
export async function crearTorneo(datos) {
    const { data, error } = await supabase
        .from('torneos')
        .insert([datos]);
    if (error) throw error;
    return data;
}

export async function editarTorneo(id, cambios) {
    const { data, error } = await supabase
        .from('torneos')
        .update(cambios)
        .eq('id', id);
    if (error) throw error;
    return data;
}

export async function listarTorneos() {
    const { data, error } = await supabase
        .from('torneos')
        .select('*');
    if (error) throw error;
    return data;
}
