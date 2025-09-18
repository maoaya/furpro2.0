// Gestor de Perfil de Usuario
import supabase from '../supabaseClient';
export class ProfileManager {
    constructor(database, firebase, uiManager) {
        this.database = database;
        this.firebase = firebase;
        this.ui = uiManager;
        this.currentProfile = null;
        this.followers = new Set();
        this.following = new Set();
        this.posts = [];
        this.achievements = [];
        this.stats = {};
        
        this.bindEvents();
    }

    // Obtener lista de seguidores (detallada)
    async getFollowers(userId) {
        const { data, error } = await supabase
          .from('followers')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw new Error('Error al obtener seguidores');
        
        return data;
    }

    // Obtener lista de seguidos (detallada)
    async getFollowing(userId) {
        const { data, error } = await supabase
          .from('followers')
          .select('*')
          .eq('follower_id', userId);
        
        if (error) throw new Error('Error al obtener seguidos');
        
        return data;
    }

    // Seguir usuario
    async followUser(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) throw new Error('No puedes seguirte a ti mismo');
        const alreadyFollowing = await this.database.isFollowing(currentUserId, targetUserId);
        if (alreadyFollowing) throw new Error('Ya sigues a este usuario');
        await this.database.addFollower(currentUserId, targetUserId);
        return true;
    }

    // Dejar de seguir usuario
    async unfollowUser(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) throw new Error('No puedes dejar de seguirte a ti mismo');
        const alreadyFollowing = await this.database.isFollowing(currentUserId, targetUserId);
        if (!alreadyFollowing) throw new Error('No sigues a este usuario');
        await this.database.removeFollower(currentUserId, targetUserId);
        return true;
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="edit-profile"]')) {
                // TODO: Editar perfil
            }
            if (e.target.matches('[data-action="follow-user"]')) {
                // TODO: Seguir usuario
            }
            
            if (e.target.matches('[data-action="view-profile"]')) {
                // TODO: Ver perfil
            }
            
            if (e.target.matches('[data-action="upload-avatar"]')) {
                // TODO: Subir avatar
            }
            
            if (e.target.matches('[data-action="change-cover"]')) {
                // TODO: Cambiar portada
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.matches('#edit-profile-form')) {
                // TODO: Guardar perfil editado
            }
        });
    }

    // Cargar perfil de usuario
    async loadProfile(userId) {
        try {
            this.ui.showLoading();
            
            // Obtener datos del perfil
            const profile = await this.database.getUserProfile(userId);
            if (!profile) {
                throw new Error('Perfil no encontrado');
            }
            
            this.currentProfile = profile;
            
            // Cargar datos adicionales
            await Promise.all([
                this.loadUserPosts(userId),
                this.loadUserStats(userId),
                this.loadFollowData(userId),
                this.loadAchievements(userId)
            ]);
            
            // Renderizar perfil
            this.renderProfile();
            
            this.ui.hideLoading();
            return profile;
        } catch (error) {
            console.error('Error cargando perfil:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar el perfil', 'error');
        }
    }

    // Cargar publicaciones del usuario
    async loadUserPosts(userId) {
        try {
            this.posts = await this.database.getUserPosts(userId);
            return this.posts;
        } catch (error) {
            console.error('Error cargando posts:', error);
            return [];
        }
    }

    // Cargar estadísticas del usuario
    async loadUserStats(userId) {
        try {
            this.stats = await this.database.getUserStats(userId);
            return this.stats;
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            return {};
        }
    }

    // Cargar datos de seguimiento
    async loadFollowData(userId) {
        try {
            const [followers, following] = await Promise.all([
                this.database.getUserFollowers(userId),
                this.database.getUserFollowing(userId)
            ]);
            // followers y following ya son arrays de objetos completos (con id, name, avatar_url)
            this.followers = new Set(followers);
            this.following = new Set(following);
            return { followers, following };
        } catch (error) {
            console.error('Error cargando datos de seguimiento:', error);
            return { followers: [], following: [] };
        }
    }

    // Cargar logros
    async loadAchievements(userId) {
        try {
            this.achievements = await this.database.getUserAchievements(userId);
            return this.achievements;
        } catch (error) {
            console.error('Error cargando logros:', error);
            return [];
        }
    }

    // Renderizar perfil
    renderProfile() {
        const container = document.getElementById('main-content');
        if (!container) return;

        const isOwnProfile = this.currentProfile.id === this.database.currentUser?.id;


        container.innerHTML = `
            <div class="profile-page">
                <!-- Header del perfil -->
                <div class="profile-header">
                    <div class="cover-photo" style="background-image: url('${this.currentProfile.cover_photo || '/assets/default-cover.jpg'}')">
                        ${isOwnProfile ? `<button class="change-cover-btn" data-action="change-cover">Cambiar portada</button>` : ''}
                    </div>
                    <div class="profile-actions">
                        <button class="nav-tab" data-tab="stats">
                            <i class="fas fa-chart-bar"></i> Estadísticas
                        </button>
                    </div>
                </div>

                <!-- Contenido de pestañas -->
                <div class="profile-content">
                    <div class="tab-content active" id="posts-tab">
                        ${this.renderUserPosts()}
                    </div>
                    
                    <div class="tab-content" id="achievements-tab">
                        ${this.renderAchievements()}
                    </div>
                    
                    <div class="tab-content" id="teams-tab">
                        ${this.renderUserTeams()}
                    </div>
                    
                    <div class="tab-content" id="tournaments-tab">
                        ${this.renderUserTournaments()}
                    </div>
                    
                    <div class="tab-content" id="stats-tab">
                        ${this.renderDetailedStats()}
                    </div>
                </div>
            </div>
        `;

        // Configurar navegación de pestañas
        this.setupTabNavigation();
    }

    // Renderizar publicaciones del usuario
    renderUserPosts() {
        if (this.posts.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-camera"></i>
                    <h3>Sin publicaciones aún</h3>
                    <p>Las publicaciones aparecerán aquí</p>
                </div>
            `;
        }

        return `
            <div class="posts-grid">
                ${this.posts.map(post => `
                    <div class="post-thumbnail" onclick="app.viewPost('${post.id}')">
                        ${post.media_url ? `
                            <img src="${post.media_url}" alt="Post">
                            ${post.media_type === 'video' ? '<i class="fas fa-play video-indicator"></i>' : ''}
                        ` : `
                            <div class="text-post-thumbnail">
                                <p>${post.content.substring(0, 100)}...</p>
                            </div>
                        `}
                        <div class="post-overlay">
                            <div class="post-stats">
                                <span><i class="fas fa-heart"></i> ${post.likes_count}</span>
                                <span><i class="fas fa-comment"></i> ${post.comments_count}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Renderizar logros
    renderAchievements() {
        if (this.achievements.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <h3>Sin logros aún</h3>
                    <p>Los logros aparecerán aquí conforme los vayas desbloqueando</p>
                </div>
            `;
        }

        return `
            <div class="achievements-grid">
                ${this.achievements.map(achievement => `
                    <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">
                            <i class="${achievement.icon}"></i>
                        </div>
                        <div class="achievement-info">
                            <h4>${achievement.name}</h4>
                            <p>${achievement.description}</p>
                            ${achievement.unlocked ? `
                                <small>Desbloqueado el ${this.formatDate(achievement.unlocked_at)}</small>
                            ` : `
                                <div class="achievement-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                                    </div>
                                    <span>${achievement.progress}%</span>
                                </div>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Mostrar modal de edición de perfil
    showEditProfileModal() {
        this.ui.showModal('edit-profile', {
            title: 'Editar Perfil',
            content: `
                <form id="edit-profile-form" class="edit-profile-form">
                    <div class="form-group">
                        <label for="full_name">Nombre completo</label>
                        <input type="text" id="full_name" name="full_name" 
                               value="${this.currentProfile.full_name || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="username">Nombre de usuario</label>
                            <!-- Eliminado campo username -->
                    </div>
                    
                    <div class="form-group">
                        <label for="bio">Biografía</label>
                        <textarea id="bio" name="bio" rows="3" 
                                  placeholder="Cuéntanos sobre ti...">${this.currentProfile.bio || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
               <label for="ubicación">Ubicación</label>
               <input type="text" id="ubicación" name="ubicación" 
                   value="${this.currentProfile.ubicación || ''}" 
                   placeholder="City, Country">
                    </div>
                    
                    <div class="form-group">
                        <label for="birth_date">Fecha de nacimiento</label>
                        <input type="date" id="birth_date" name="birth_date" 
                               value="${this.currentProfile.birth_date || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="position">Posición preferida</label>
                        <select id="position" name="position">
                            <option value="">Seleccionar...</option>
                            <option value="goalkeeper" ${this.currentProfile.position === 'goalkeeper' ? 'selected' : ''}>Portero</option>
                            <option value="defender" ${this.currentProfile.position === 'defender' ? 'selected' : ''}>Defensa</option>
                            <option value="midfielder" ${this.currentProfile.position === 'midfielder' ? 'selected' : ''}>Centrocampista</option>
                            <option value="forward" ${this.currentProfile.position === 'forward' ? 'selected' : ''}>Delantero</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="skill_level">Nivel de habilidad</label>
                        <select id="skill_level" name="skill_level">
                            <option value="">Seleccionar...</option>
                            <option value="beginner" ${this.currentProfile.skill_level === 'beginner' ? 'selected' : ''}>Principiante</option>
                            <option value="intermediate" ${this.currentProfile.skill_level === 'intermediate' ? 'selected' : ''}>Intermedio</option>
                            <option value="advanced" ${this.currentProfile.skill_level === 'advanced' ? 'selected' : ''}>Avanzado</option>
                            <option value="professional" ${this.currentProfile.skill_level === 'professional' ? 'selected' : ''}>Profesional</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            `
        });
    }

    // Guardar cambios del perfil
    async saveProfile(form) {
        try {
            this.ui.showLoading('Guardando cambios...');
            
            const formData = new FormData(form);
            const profileData = Object.fromEntries(formData.entries());
            
            // Validar datos
            if (!profileData.full_name.trim()) {
                // TODO: Validar nombre
            }
            
            
            // Verificar si el username está disponible
                // Eliminada validación y disponibilidad de username
            
            // Actualizar perfil
            const updatedProfile = await this.database.updateUserProfile(
                this.currentProfile.id, 
                profileData
            );
            
            this.currentProfile = { ...this.currentProfile, ...updatedProfile };
            
            // Actualizar UI
            this.renderProfile();
            this.ui.closeModal();
            this.ui.hideLoading();
            this.ui.showToast('Perfil actualizado correctamente', 'success');
            
        } catch (error) {
            // TODO: Manejar error al guardar perfil
        }
    }

    // Alternar seguimiento
    async toggleFollow() {
        try {
            // TODO: Alternar seguimiento
        } catch (error) {
            // TODO: Manejar error de seguimiento
        }
    }

    // Actualizar botón de seguir
    updateFollowButton(userId) {
        const button = document.querySelector(`[data-action="follow-user"][data-user-id="${userId}"]`);
        if (button) {
            // TODO: Actualizar botón de seguir
        }
    }

    // Configurar navegación de pestañas
    setupTabNavigation() {
    document.addEventListener('click', () => {
            // TODO: Navegación de pestañas
        });
    }

    // Cambiar pestaña
    switchTab() {
        // TODO: Cambiar pestaña activa
    }

    // Subir avatar
    async uploadAvatar() {
        try {
            // TODO: Subir avatar
        } catch (error) {
            // TODO: Manejar error de avatar
        }
    }

    // Cambiar foto de portada
    async changeCoverPhoto() {
        try {
            // TODO: Cambiar foto de portada
        } catch (error) {
            // TODO: Manejar error de portada
        }
    }

    // Funciones de utilidad
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });
    }

    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            // TODO: Ajustar edad si aún no ha cumplido años este mes
        }
        
        return age;
    }

    // Renderizar equipos del usuario
    renderUserTeams() {
        // TODO: Integración pendiente con TeamManager
        return `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Sin equipos aún</h3>
                <p>Los equipos del usuario aparecerán aquí</p>
            </div>
        `;
    }

    // Renderizar torneos del usuario
    renderUserTournaments() {
        // TODO: Integración pendiente con TournamentManager
        return `
            <div class="empty-state">
                <i class="fas fa-medal"></i>
                <h3>Sin torneos aún</h3>
                <p>Los torneos del usuario aparecerán aquí</p>
            </div>
        `;
    }

    // Renderizar estadísticas detalladas
    renderDetailedStats() {
        return `
            <div class="detailed-stats">
                <div class="stats-section">
                    <h3>Estadísticas de Juego</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Partidos jugados</span>
                            <span class="stat-value">${this.stats.matches_played || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Partidos ganados</span>
                            <span class="stat-value">${this.stats.matches_won || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Goles anotados</span>
                            <span class="stat-value">${this.stats.goals_scored || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Asistencias</span>
                            <span class="stat-value">${this.stats.assists || 0}</span>
                        </div>
                    </div>
                </div>
                
                <div class="stats-section">
                    <h3>Actividad en la App</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Publicaciones</span>
                            <span class="stat-value">${this.posts.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Likes recibidos</span>
                            <span class="stat-value">${this.stats.total_likes || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Comentarios</span>
                            <span class="stat-value">${this.stats.total_comments || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Transmisiones</span>
                            <span class="stat-value">${this.stats.streams_count || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Eliminar duplicados: ya existen implementaciones previas válidas de
    // renderUserTeams, renderUserTournaments, renderDetailedStats,
    // updateFollowersCount, viewProfile y destroy. Se remueven repeticiones.
}
