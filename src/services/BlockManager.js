// Sistema de Bloqueo de Usuarios
export class BlockManager {
    constructor(database, firebase, uiManager) {
        this.database = database;
        this.firebase = firebase;
        this.ui = uiManager;
        this.blockedUsers = new Set();
        this.blockedByUsers = new Set();
        
        this.bindEvents();
        this.loadBlockedUsers();
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="block-user"]')) {
                const userId = e.target.dataset.userId;
                this.showBlockConfirmation(userId);
            }
            
            if (e.target.matches('[data-action="unblock-user"]')) {
                const userId = e.target.dataset.userId;
                this.unblockUser(userId);
            }
            
            if (e.target.matches('[data-action="view-blocked-users"]')) {
                this.viewBlockedUsers();
            }
            
            if (e.target.matches('[data-action="report-and-block"]')) {
                const userId = e.target.dataset.userId;
                const context = e.target.dataset.context;
                this.reportAndBlock(userId, context);
            }
        });
    }

    // Cargar usuarios bloqueados
    async loadBlockedUsers() {
        try {
            const [blocked, blockedBy] = await Promise.all([
                this.database.getBlockedUsers(this.database.currentUser.id),
                this.database.getBlockedByUsers(this.database.currentUser.id)
            ]);
            
            this.blockedUsers = new Set(blocked.map(user => user.id));
            this.blockedByUsers = new Set(blockedBy.map(user => user.id));
            
        } catch (error) {
            console.error('Error cargando usuarios bloqueados:', error);
        }
    }

    // Mostrar confirmación de bloqueo
    showBlockConfirmation(userId) {
        this.ui.showModal('block-user-confirmation', {
            title: '⛔ Bloquear Usuario',
            content: `
                <div class="block-confirmation">
                    <div class="warning-icon">
                        <i class="fas fa-user-slash"></i>
                    </div>
                    
                    <div class="block-warning">
                        <h3>¿Estás seguro que quieres bloquear a este usuario?</h3>
                        <p>Al bloquear a este usuario:</p>
                        
                        <ul class="block-consequences">
                            <li>🚫 No podrán enviarte mensajes</li>
                            <li>🔍 No aparecerán en tus búsquedas</li>
                            <li>⚽ No podrán unirse a tus partidos/torneos</li>
                            <li>👥 No podrán solicitar unirse a tus equipos</li>
                            <li>📱 No recibirás notificaciones de ellos</li>
                            <li>💬 No verás sus comentarios en streams</li>
                        </ul>
                        
                        <p><strong>Esta acción puede revertirse posteriormente.</strong></p>
                    </div>
                    
                    <div class="block-options">
                        <h4>Opciones adicionales:</h4>
                        <label class="block-option">
                            <input type="checkbox" id="also-report" name="also_report">
                            <span>También reportar por comportamiento inapropiado</span>
                        </label>
                        
                        <div id="report-reason" style="display: none;">
                            <select name="report_reason" class="form-control">
                                <option value="">Seleccionar motivo</option>
                                <option value="harassment">Acoso o intimidación</option>
                                <option value="inappropriate_language">Lenguaje inapropiado</option>
                                <option value="spam">Spam o mensajes no deseados</option>
                                <option value="cheating">Comportamiento desleal</option>
                                <option value="fake_profile">Perfil falso</option>
                                <option value="other">Otro motivo</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="button" onclick="blockManager.confirmBlock('${userId}')" class="btn btn-danger">
                            <i class="fas fa-user-slash"></i> Bloquear Usuario
                        </button>
                    </div>
                </div>
            `
        });

        // Configurar mostrar/ocultar motivo de reporte
        document.getElementById('also-report').addEventListener('change', (e) => {
            const reportReason = document.getElementById('report-reason');
            if (e.target.checked) {
                reportReason.style.display = 'block';
                reportReason.querySelector('select').required = true;
            } else {
                reportReason.style.display = 'none';
                reportReason.querySelector('select').required = false;
            }
        });
    }

    // Confirmar bloqueo
    async confirmBlock(userId) {
        try {
            this.ui.showLoading('Bloqueando usuario...');
            
            const alsoReport = document.getElementById('also-report').checked;
            const reportReason = alsoReport ? document.querySelector('select[name="report_reason"]').value : null;
            
            // Validaciones
            if (alsoReport && !reportReason) {
                throw new Error('Selecciona un motivo para el reporte');
            }
            
            if (userId === this.database.currentUser.id) {
                throw new Error('No puedes bloquearte a ti mismo');
            }
            
            // Bloquear usuario
            await this.blockUser(userId);
            
            // Reportar si se seleccionó
            if (alsoReport && reportReason) {
                await this.database.saveUserReport({
                    reported_user_id: userId,
                    reporter_user_id: this.database.currentUser.id,
                    report_type: reportReason,
                    description: 'Reporte automático al bloquear usuario',
                    context: 'user_block',
                    severity: 'medium',
                    status: 'pending',
                    created_at: new Date().toISOString()
                });
            }
            
            this.ui.closeModal();
            this.ui.hideLoading();
            this.ui.showToast('Usuario bloqueado correctamente', 'success');
            
        } catch (error) {
            console.error('Error bloqueando usuario:', error);
            this.ui.hideLoading();
            this.ui.showToast(error.message, 'error');
        }
    }

    // Bloquear usuario
    async blockUser(userId) {
        try {
            // Guardar bloqueo en base de datos
            await this.database.blockUser({
                blocker_id: this.database.currentUser.id,
                blocked_id: userId,
                created_at: new Date().toISOString(),
                is_active: true
            });
            
            // Actualizar lista local
            this.blockedUsers.add(userId);
            
            // Limpiar datos relacionados
            await this.cleanupUserData(userId);
            
            // Notificar a otros servicios
            this.notifyUserBlocked(userId);
            
        } catch (error) {
            console.error('Error en blockUser:', error);
            throw error;
        }
    }

    // Desbloquear usuario
    async unblockUser(userId) {
        try {
            this.ui.showLoading('Desbloqueando usuario...');
            
            await this.database.unblockUser(this.database.currentUser.id, userId);
            
            // Actualizar lista local
            this.blockedUsers.delete(userId);
            
            this.ui.hideLoading();
            this.ui.showToast('Usuario desbloqueado correctamente', 'success');
            
            // Recargar vista si está mostrando usuarios bloqueados
            if (document.querySelector('.blocked-users-view')) {
                this.viewBlockedUsers();
            }
            
        } catch (error) {
            console.error('Error desbloqueando usuario:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al desbloquear usuario', 'error');
        }
    }

    // Ver usuarios bloqueados
    async viewBlockedUsers() {
        try {
            this.ui.showLoading();
            
            const blockedUsers = await this.database.getBlockedUsersWithDetails(this.database.currentUser.id);
            
            this.renderBlockedUsersView(blockedUsers);
            
            this.ui.hideLoading();
            
        } catch (error) {
            console.error('Error cargando usuarios bloqueados:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar usuarios bloqueados', 'error');
        }
    }

    // Renderizar vista de usuarios bloqueados
    renderBlockedUsersView(blockedUsers) {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="blocked-users-view">
                <div class="blocked-header">
                    <button class="back-btn" onclick="profileManager.loadProfilePage()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2>Usuarios Bloqueados</h2>
                    <div class="blocked-count">
                        <span>${blockedUsers.length} usuario${blockedUsers.length !== 1 ? 's' : ''} bloqueado${blockedUsers.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                ${blockedUsers.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-user-check"></i>
                        <h3>No hay usuarios bloqueados</h3>
                        <p>Los usuarios que bloquees aparecerán aquí</p>
                    </div>
                ` : `
                    <div class="blocked-users-list">
                        ${blockedUsers.map(user => `
                            <div class="blocked-user-card">
                                <div class="user-info">
                                    <img src="${user.avatar_url || '/assets/default-avatar.jpg'}" 
                                         alt="${user.name}" class="user-avatar">
                                    <div class="user-details">
                                        <h4>${user.name}</h4>
                                        <p class="user-type">${this.getUserTypeLabel(user.user_type)}</p>
                                        <small class="blocked-date">
                                            Bloqueado el ${this.formatDate(user.blocked_at)}
                                        </small>
                                    </div>
                                </div>
                                
                                <div class="blocked-actions">
                                    <button class="btn btn-sm btn-success" data-action="unblock-user" 
                                            data-user-id="${user.id}">
                                        <i class="fas fa-user-check"></i> Desbloquear
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                
                <div class="blocked-info">
                    <h3>Información sobre el bloqueo</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-eye-slash"></i>
                            <div>
                                <strong>Invisibilidad mutua</strong>
                                <p>No aparecerán en búsquedas ni recomendaciones</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-comments"></i>
                            <div>
                                <strong>Sin comunicación</strong>
                                <p>No pueden enviarte mensajes ni notificaciones</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-ban"></i>
                            <div>
                                <strong>Restricción de actividades</strong>
                                <p>No pueden unirse a tus partidos, equipos o torneos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Limpiar datos del usuario bloqueado
    async cleanupUserData(userId) {
        try {
            // Remover de conversaciones activas
            if (window.chatManager) {
                await window.chatManager.removeUserFromChats(userId);
            }
            
            // Remover notificaciones pendientes
            if (window.notificationManager) {
                await window.notificationManager.clearNotificationsFromUser(userId);
            }
            
            // Actualizar UI si es necesario
            this.updateUIAfterBlock(userId);
            
        } catch (error) {
            console.error('Error limpiando datos:', error);
        }
    }

    // Notificar a otros servicios sobre el bloqueo
    notifyUserBlocked(userId) {
        // Emitir evento personalizado para otros managers
        document.dispatchEvent(new CustomEvent('user-blocked', {
            detail: { blockedUserId: userId, blockerId: this.database.currentUser.id }
        }));
    }

    // Actualizar UI después del bloqueo
    updateUIAfterBlock(userId) {
        // Remover elementos del usuario bloqueado de la UI actual
        const userElements = document.querySelectorAll(`[data-user-id="${userId}"]`);
        userElements.forEach(element => {
            if (element.closest('.user-card, .player-card, .member-card')) {
                element.closest('.user-card, .player-card, .member-card').remove();
            }
        });
    }

    // Verificar si un usuario está bloqueado
    isUserBlocked(userId) {
        return this.blockedUsers.has(userId);
    }

    // Verificar si el usuario actual está bloqueado por otro
    isBlockedByUser(userId) {
        return this.blockedByUsers.has(userId);
    }

    // Verificar si hay relación de bloqueo mutua
    hasBlockRelation(userId) {
        return this.isUserBlocked(userId) || this.isBlockedByUser(userId);
    }

    // Filtrar usuarios bloqueados de listas
    filterBlockedUsers(users) {
        return users.filter(user => !this.hasBlockRelation(user.id));
    }

    // Reportar y bloquear (acción rápida)
    async reportAndBlock(userId, context) {
        try {
            this.ui.showLoading('Reportando y bloqueando...');
            
            // Reportar primero
            await this.database.saveUserReport({
                reported_user_id: userId,
                reporter_user_id: this.database.currentUser.id,
                report_type: 'inappropriate_behavior',
                description: `Reporte rápido desde ${context}`,
                context: context,
                severity: 'high',
                status: 'pending',
                created_at: new Date().toISOString()
            });
            
            // Luego bloquear
            await this.blockUser(userId);
            
            this.ui.hideLoading();
            this.ui.showToast('Usuario reportado y bloqueado', 'success');
            
        } catch (error) {
            console.error('Error en reportAndBlock:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al reportar y bloquear', 'error');
        }
    }

    // Funciones de utilidad
    getUserTypeLabel(userType) {
        const labels = {
            'player': '⚽ Jugador',
            'organizer': '🏆 Organizador',
            'sponsor': '💰 Patrocinador',
            'referee': '🟨 Árbitro'
        };
        return labels[userType] || userType;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Destruir instancia
    destroy() {
        this.blockedUsers.clear();
        this.blockedByUsers.clear();
    }
}

// Hacer disponible globalmente
window.BlockManager = BlockManager;
