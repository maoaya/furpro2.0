// Gestor de Equipos
export class TeamManager {
    constructor(database, firebase, uiManager) {
        this.database = database;
        this.firebase = firebase;
        this.ui = uiManager;
        this.currentTeam = null;
        this.userTeams = [];
        this.teamMembers = [];
        this.teamMatches = [];
        this.invitations = [];
        
        this.bindEvents();
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="create-team"]')) {
                this.showCreateTeamModal();
            }
            
            if (e.target.matches('[data-action="join-team"]')) {
                const teamId = e.target.dataset.teamId;
                this.requestToJoinTeam(teamId);
            }
            
            if (e.target.matches('[data-action="leave-team"]')) {
                const teamId = e.target.dataset.teamId;
                this.leaveTeam(teamId);
            }
            
            if (e.target.matches('[data-action="view-team"]')) {
                const teamId = e.target.dataset.teamId;
                this.viewTeam(teamId);
            }
            
            if (e.target.matches('[data-action="invite-player"]')) {
                this.showInvitePlayerModal();
            }
            
            if (e.target.matches('[data-action="manage-team"]')) {
                this.showTeamManagementModal();
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.matches('#create-team-form')) {
                e.preventDefault();
                this.createTeam(e.target);
            }
            
            if (e.target.matches('#invite-player-form')) {
                e.preventDefault();
                this.invitePlayer(e.target);
            }
        });
    }

    // Cargar página de equipos
    async loadTeamsPage() {
        try {
            this.ui.showLoading();
            
            // Cargar datos
            await Promise.all([
                this.loadUserTeams(),
                this.loadAvailableTeams(),
                this.loadTeamInvitations()
            ]);
            
            // Renderizar página
            this.renderTeamsPage();
            
            this.ui.hideLoading();
        } catch (error) {
            console.error('Error cargando equipos:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar equipos', 'error');
        }
    }

    // Renderizar tarjeta de equipo
    renderTeamCard(team, isUserTeam) {
        return `
            <div class="team-card ${isUserTeam ? 'user-team' : ''}">
                <div class="team-header">
                    <img src="${team.logo_url || '/assets/default-team.png'}" 
                         alt="${team.name}" class="team-logo">
                    <div class="team-badge ${team.level}">${team.level}</div>
                </div>
                
                <div class="team-info">
                    <h3 class="team-name">${team.name}</h3>
                    <p class="team-description">${team.description}</p>
                    
                    <div class="team-stats">
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <span>${team.members_count}/${team.max_members}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-trophy"></i>
                            <span>${team.wins || 0}W</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-times"></i>
                            <span>${team.losses || 0}L</span>
                        </div>
                    </div>
                    
                    <div class="team-meta">
                        <span class="format-badge">${team.format}</span>
                        <span class="location"><i class="fas fa-map-marker-alt"></i> ${team.location}</span>
                    </div>
                </div>
                
                <div class="team-actions">
                    <button class="btn btn-outline" data-action="view-team" data-team-id="${team.id}">
                        Ver Equipo
                    </button>
                    
                    ${isUserTeam ? `
                        ${team.is_captain ? `
                            <button class="btn btn-primary" data-action="manage-team" data-team-id="${team.id}">
                                Gestionar
                            </button>
                        ` : `
                            <button class="btn btn-secondary" data-action="leave-team" data-team-id="${team.id}">
                                Salir
                            </button>
                        `}
                    ` : `
                        <button class="btn btn-primary" data-action="join-team" data-team-id="${team.id}"
                                ${team.members_count >= team.max_members ? 'disabled' : ''}>
                            ${team.members_count >= team.max_members ? 'Completo' : 'Unirse'}
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    // Mostrar modal de creación de equipo
    showCreateTeamModal() {
        this.ui.showModal('create-team', {
            title: 'Crear Nuevo Equipo',
            content: `
                <form id="create-team-form" class="create-team-form">
                    <div class="form-group">
                        <label for="team_name">Nombre del equipo</label>
                        <input type="text" id="team_name" name="name" required 
                               placeholder="Ej: Los Leones FC">
                    </div>
                    
                    <div class="form-group">
                        <label for="team_description">Descripción</label>
                        <textarea id="team_description" name="description" rows="3" 
                                  placeholder="Describe tu equipo..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="team_format">Formato de juego</label>
                        <select id="team_format" name="format" required>
                            <option value="">Seleccionar formato</option>
                            <option value="5v5">5 vs 5</option>
                            <option value="7v7">7 vs 7</option>
                            <option value="8v8">8 vs 8</option>
                            <option value="9v9">9 vs 9</option>
                            <option value="11v11">11 vs 11</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="team_level">Nivel del equipo</label>
                        <select id="team_level" name="level" required>
                            <option value="">Seleccionar nivel</option>
                            <option value="beginner">Principiante</option>
                            <option value="intermediate">Intermedio</option>
                            <option value="advanced">Avanzado</option>
                            <option value="professional">Profesional</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="team_location">Ubicación</label>
                        <input type="text" id="team_location" name="location" required 
                               placeholder="City, Country">
                    </div>
                    
                    <div class="form-group">
                        <label for="team_logo">Logo del equipo</label>
                        <input type="file" id="team_logo" name="logo" accept="image/*">
                        <small>Opcional - Tamaño recomendado: 200x200px</small>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="is_recruiting" checked>
                            Aceptar nuevos miembros
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Crear Equipo
                        </button>
                    </div>
                </form>
            `
        });
    }

    // Crear equipo
    async createTeam(form) {
        try {
            this.ui.showLoading('Creando equipo...');
            
            const formData = new FormData(form);
            
            // Validar datos
            const name = formData.get('name').trim();
            if (!name) {
                throw new Error('El nombre del equipo es requerido');
            }
            
            // Verificar disponibilidad del nombre
            const isAvailable = await this.database.checkTeamNameAvailability(name);
            if (!isAvailable) {
                throw new Error('El nombre del equipo no está disponible');
            }
            
            // Subir logo si existe
            let logoUrl = null;
            const logoFile = formData.get('logo');
            if (logoFile && logoFile.size > 0) {
                logoUrl = await this.database.uploadFile(logoFile, 'team-logos');
            }
            
            // Crear equipo
            const teamData = {
                name: formData.get('name'),
                description: formData.get('description'),
                format: formData.get('format'),
                level: formData.get('level'),
                location: formData.get('location'),
                logo_url: logoUrl,
                is_recruiting: formData.get('is_recruiting') === 'on',
                captain_id: this.database.currentUser.id,
                max_members: this.getMaxMembersByFormat(formData.get('format'))
            };
            
            const newTeam = await this.database.createTeam(teamData);
            
            // Agregar creador como miembro
            await this.database.addTeamMember(newTeam.id, this.database.currentUser.id, 'captain');
            
            // Actualizar listas
            this.userTeams.unshift(newTeam);
            
            // Actualizar UI
            this.ui.closeModal();
            this.renderTeamsPage();
            this.ui.hideLoading();
            this.ui.showToast('Equipo creado correctamente', 'success');
            
        } catch (error) {
            console.error('Error creando equipo:', error);
            this.ui.hideLoading();
            this.ui.showToast(error.message, 'error');
        }
    }

    // Obtener máximo de miembros por formato
    getMaxMembersByFormat(format) {
        const formats = {
            '5v5': 8,
            '7v7': 12,
            '8v8': 14,
            '9v9': 16,
            '11v11': 20
        };
        return formats[format] || 20;
    }

    // Solicitar unirse a equipo
    async requestToJoinTeam(teamId) {
        try {
            await this.database.requestToJoinTeam(teamId, this.database.currentUser.id);
            this.ui.showToast('Solicitud enviada al equipo', 'success');
            
            // Actualizar botón
            const button = document.querySelector(`[data-action="join-team"][data-team-id="${teamId}"]`);
            if (button) {
                button.textContent = 'Solicitud enviada';
                button.disabled = true;
            }
        } catch (error) {
            console.error('Error solicitando unirse:', error);
            this.ui.showToast('Error al enviar solicitud', 'error');
        }
    }

    // Salir de equipo
    async leaveTeam(teamId) {
        try {
            const confirmed = await this.ui.showConfirm(
                '¿Estás seguro?',
                'Una vez que salgas del equipo, tendrás que solicitar unirte nuevamente.'
            );
            
            if (!confirmed) return;
            
            await this.database.removeTeamMember(teamId, this.database.currentUser.id);
            
            // Actualizar lista
            this.userTeams = this.userTeams.filter(team => team.id !== teamId);
            
            // Actualizar UI
            this.renderTeamsPage();
            this.ui.showToast('Has salido del equipo', 'info');
            
        } catch (error) {
            console.error('Error saliendo del equipo:', error);
            this.ui.showToast('Error al salir del equipo', 'error');
        }
    }

    // Ver equipo específico
    async viewTeam(teamId) {
        try {
            this.ui.showLoading();
            
            // Cargar datos del equipo
            const [team, members, matches, stats] = await Promise.all([
                this.database.getTeam(teamId),
                this.database.getTeamMembers(teamId),
                this.database.getTeamMatches(teamId),
                    // this.database.getTeamStats(teamId)
            ]);
            
            this.currentTeam = team;
            this.teamMembers = members;
            this.teamMatches = matches;
            
            this.renderTeamDetails(team, members, matches, stats);
            this.ui.hideLoading();
            
        } catch (error) {
            console.error('Error cargando equipo:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar equipo', 'error');
        }
    }

    // Renderizar detalles del equipo
    renderTeamDetails(team, members, matches, stats) {
        const container = document.getElementById('main-content');
        if (!container) return;

        const isUserMember = members.some(member => member.user_id === this.database.currentUser.id);
        const userRole = isUserMember ? members.find(m => m.user_id === this.database.currentUser.id).role : null;

        container.innerHTML = `
            <div class="team-details">
                <div class="team-header">
                    <button class="back-btn" onclick="teamManager.loadTeamsPage()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    
                    <div class="team-info">
                        <img src="${team.logo_url || '/assets/default-team.png'}" 
                             alt="${team.name}" class="team-logo-large">
                        <div class="team-details-info">
                            <h1>${team.name}</h1>
                            <p>${team.description}</p>
                            <div class="team-badges">
                                <span class="badge format">${team.format}</span>
                                <span class="badge level">${team.level}</span>
                                <span class="badge location">
                                    <i class="fas fa-map-marker-alt"></i> ${team.location}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="team-actions">
                        ${userRole === 'captain' ? `
                            <button class="btn btn-primary" data-action="manage-team" data-team-id="${team.id}">
                                <i class="fas fa-cog"></i> Gestionar
                            </button>
                            <button class="btn btn-secondary" data-action="invite-player">
                                <i class="fas fa-user-plus"></i> Invitar
                            </button>
                        ` : isUserMember ? `
                            <button class="btn btn-secondary" data-action="leave-team" data-team-id="${team.id}">
                                <i class="fas fa-sign-out-alt"></i> Salir
                            </button>
                        ` : `
                            <button class="btn btn-primary" data-action="join-team" data-team-id="${team.id}">
                                <i class="fas fa-user-plus"></i> Unirse
                            </button>
                        `}
                    </div>
                </div>

                <!-- Estadísticas del equipo -->
                <div class="team-stats">
                    <div class="stat-card">
                        <div class="stat-number">${members.length}</div>
                        <div class="stat-label">Miembros</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.matches_played || 0}</div>
                        <div class="stat-label">Partidos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.wins || 0}</div>
                        <div class="stat-label">Victorias</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.goals_scored || 0}</div>
                        <div class="stat-label">Goles</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.calculateWinRate(stats)}%</div>
                        <div class="stat-label">% Victorias</div>
                    </div>
                </div>

                <!-- Navegación de contenido -->
                <div class="team-nav">
                    <button class="nav-tab active" data-tab="members">
                        <i class="fas fa-users"></i> Miembros
                    </button>
                    <button class="nav-tab" data-tab="matches">
                        <i class="fas fa-futbol"></i> Partidos
                    </button>
                    <button class="nav-tab" data-tab="tournaments">
                        <i class="fas fa-trophy"></i> Torneos
                    </button>
                    <button class="nav-tab" data-tab="stats">
                        <i class="fas fa-chart-bar"></i> Estadísticas
                    </button>
                </div>

                <!-- Contenido de pestañas -->
                <div class="team-content">
                    <div class="tab-content active" id="members-tab">
                        ${this.renderTeamMembers(members, userRole)}
                    </div>
                    
                    <div class="tab-content" id="matches-tab">
                        ${this.renderTeamMatches(matches)}
                    </div>
                    
                    <div class="tab-content" id="tournaments-tab">
                        ${this.renderTeamTournaments()}
                    </div>
                    
                    <div class="tab-content" id="stats-tab">
                        ${this.renderTeamDetailedStats(stats)}
                    </div>
                </div>
            </div>
        `;

        // Configurar navegación
        this.setupTabNavigation();
    }

    // Renderizar miembros del equipo
    renderTeamMembers(members, userRole) {
        return `
            <div class="team-members">
                <div class="members-header">
                    <h3>Miembros (${members.length})</h3>
                    ${userRole === 'captain' ? `
                        <button class="btn btn-primary" data-action="invite-player">
                            <i class="fas fa-user-plus"></i> Invitar Jugador
                        </button>
                    ` : ''}
                </div>
                
                <div class="members-list">
                    ${members.map(member => `
                        <div class="member-card">
                            <img src="${member.avatar_url || '/assets/default-avatar.png'}" 
                                 alt="${member.full_name}" class="member-avatar">
                            <div class="member-info">
                                <h4>${member.full_name}</h4>
                                <p>@${member.username}</p>
                                <div class="member-meta">
                                    <span class="role ${member.role}">${this.translateRole(member.role)}</span>
                                    ${member.position ? `<span class="position">${this.translatePosition(member.position)}</span>` : ''}
                                </div>
                            </div>
                            <div class="member-stats">
                                <div class="stat">
                                    <span class="stat-label">Partidos</span>
                                    <span class="stat-value">${member.matches_played || 0}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Goles</span>
                                    <span class="stat-value">${member.goals_scored || 0}</span>
                                </div>
                            </div>
                            ${userRole === 'captain' && member.role !== 'captain' ? `
                                <div class="member-actions">
                                    <button class="btn btn-sm btn-outline" onclick="teamManager.promoteToViceCaptain('${member.user_id}')">
                                        Promover
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="teamManager.removeMember('${member.user_id}')">
                                        Remover
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Aceptar invitación
    async acceptInvitation(invitationId) {
        try {
            await this.database.acceptTeamInvitation(invitationId);
            
            // Actualizar listas
            await this.loadUserTeams();
            await this.loadTeamInvitations();
            
            this.renderTeamsPage();
            this.ui.showToast('Te has unido al equipo', 'success');
            
        } catch (error) {
            console.error('Error aceptando invitación:', error);
            this.ui.showToast('Error al aceptar invitación', 'error');
        }
    }

    // Rechazar invitación
    async declineInvitation(invitationId) {
        try {
            await this.database.declineTeamInvitation(invitationId);
            
            // Actualizar lista
            await this.loadTeamInvitations();
            
            this.renderTeamsPage();
            this.ui.showToast('Invitación rechazada', 'info');
            
        } catch (error) {
            console.error('Error rechazando invitación:', error);
            this.ui.showToast('Error al rechazar invitación', 'error');
        }
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
        // Actualizar navegación
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');
    }

    // Funciones de utilidad
    translateRole(role) {
        const roles = {
            'captain': 'Capitán',
            'vice_captain': 'Subcapitán',
            'member': 'Miembro'
        };
        return roles[role] || role;
    }

    translatePosition(position) {
        const positions = {
            'goalkeeper': 'Portero',
            'defender': 'Defensa',
            'midfielder': 'Centrocampista',
            'forward': 'Delantero'
        };
        return positions[position] || position;
    }

    calculateWinRate(stats) {
        if (!stats.matches_played) return 0;
        return Math.round((stats.wins / stats.matches_played) * 100);
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'hace un momento';
        if (diffInHours < 24) return `hace ${diffInHours} horas`;
        
        const days = Math.floor(diffInHours / 24);
        return `hace ${days} días`;
    }

    // Renderizar partidos del equipo (placeholder)
    renderTeamMatches() {
        return `
            <div class="empty-state">
                <i class="fas fa-futbol"></i>
                <h3>Sin partidos aún</h3>
                <p>Los partidos del equipo aparecerán aquí</p>
            </div>
        `;
    }

    // Renderizar torneos del equipo (placeholder)
    renderTeamTournaments() {
        return `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <h3>Sin torneos aún</h3>
                <p>Los torneos del equipo aparecerán aquí</p>
            </div>
        `;
    }

    // Renderizar estadísticas detalladas (placeholder)
    renderTeamDetailedStats() {
        return `
            <div class="detailed-stats">
                <h3>Estadísticas Detalladas</h3>
                <p>Las estadísticas detalladas del equipo aparecerán aquí</p>
            </div>
        `;
    }

    // Destruir instancia
    destroy() {
        this.currentTeam = null;
        this.userTeams = [];
        this.teamMembers = [];
        this.teamMatches = [];
        this.invitations = [];
    }
}

// Funciones independientes
export function crearEquipo() {
    // Lógica para crear equipo
}
export function editarEquipo() {
    // Lógica para editar equipo
}
export function listarEquipos() {
    // Lógica para obtener todos los equipos
}
