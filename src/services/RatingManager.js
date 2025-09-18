// Sistema de Calificaciones y Comportamiento
export class RatingManager {
    constructor(database, firebase, uiManager) {
        this.database = database;
        this.firebase = firebase;
        this.ui = uiManager;
        this.userRatings = new Map();
        this.behaviorHistory = [];
        this.ratingCategories = {
            player: ['skill', 'teamwork', 'punctuality', 'sportsmanship', 'communication'],
            organizer: ['organization', 'communication', 'punctuality', 'fairness', 'problem_solving'],
            sponsor: ['reliability', 'communication', 'payment_punctuality', 'support_quality', 'professionalism'],
            referee: ['fairness', 'consistency', 'communication', 'rule_knowledge', 'professionalism']
        };
        
        this.bindEvents();
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="rate-user"]')) {
                const userId = e.target.dataset.userId;
                const userType = e.target.dataset.userType;
                this.showRatingModal(userId, userType);
            }
            
            if (e.target.matches('[data-action="view-ratings"]')) {
                const userId = e.target.dataset.userId;
                this.viewUserRatings(userId);
            }
            
            if (e.target.matches('[data-action="report-behavior"]')) {
                const userId = e.target.dataset.userId;
                const context = e.target.dataset.context;
                this.showReportModal(userId, context);
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.matches('#rating-form')) {
                e.preventDefault();
                this.submitRating(e.target);
            }
            
            if (e.target.matches('#report-form')) {
                e.preventDefault();
                this.submitReport(e.target);
            }
        });
    }

    // Mostrar modal de calificación
    showRatingModal(userId, userType) {
        const categories = this.ratingCategories[userType] || this.ratingCategories.player;
        
        this.ui.showModal('rate-user', {
            title: `Calificar ${this.getUserTypeLabel(userType)}`,
            content: `
                <form id="rating-form" class="rating-form">
                    <input type="hidden" name="rated_user_id" value="${userId}">
                    <input type="hidden" name="user_type" value="${userType}">
                    
                    <div class="rating-intro">
                        <p>Tu calificación ayuda a mantener la calidad de la comunidad FutPro</p>
                        <small>Todas las calificaciones son anónimas</small>
                    </div>
                    
                    <div class="rating-categories">
                        ${categories.map(category => `
                            <div class="rating-category">
                                <label>${this.getCategoryLabel(category)}</label>
                                <div class="star-rating" data-category="${category}">
                                    ${[1, 2, 3, 4, 5].map(star => `
                                        <button type="button" class="star" data-rating="${star}">
                                            <i class="fas fa-star"></i>
                                        </button>
                                    `).join('')}
                                </div>
                                <input type="hidden" name="${category}" value="0" required>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="form-group">
                        <label for="rating_comment">Comentario (opcional)</label>
                        <textarea id="rating_comment" name="comment" rows="3" 
                                  placeholder="Comparte tu experiencia..."></textarea>
                    </div>
                    
                    <div class="rating-tags">
                        <label>Etiquetas rápidas:</label>
                        <div class="tag-options">
                            ${this.getQuickTags(userType).map(tag => `
                                <label class="tag-option">
                                    <input type="checkbox" name="tags" value="${tag.value}">
                                    <span>${tag.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Enviar Calificación
                        </button>
                    </div>
                </form>
            `
        });

        // Configurar interactividad de estrellas
        this.setupStarRating();
    }

    // Configurar sistema de estrellas
    setupStarRating() {
        document.querySelectorAll('.star-rating').forEach(ratingContainer => {
            const stars = ratingContainer.querySelectorAll('.star');
            const category = ratingContainer.dataset.category;
            const hiddenInput = document.querySelector(`input[name="${category}"]`);
            
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    hiddenInput.value = rating;
                    
                    // Actualizar visual
                    stars.forEach((s, i) => {
                        if (i < rating) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
                
                star.addEventListener('mouseenter', () => {
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.classList.add('hover');
                        } else {
                            s.classList.remove('hover');
                        }
                    });
                });
            });
            
            ratingContainer.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
        });
    }

    // Enviar calificación
    async submitRating(form) {
        try {
            this.ui.showLoading('Enviando calificación...');
            
            const formData = new FormData(form);
            const ratedUserId = formData.get('rated_user_id');
            const userType = formData.get('user_type');
            const categories = this.ratingCategories[userType];
            
            // Validar que todas las categorías tengan calificación
            const ratings = {};
            let totalRating = 0;
            let validCategories = 0;
            
            for (const category of categories) {
                const rating = parseInt(formData.get(category));
                if (rating === 0) {
                    throw new Error(`Por favor califica: ${this.getCategoryLabel(category)}`);
                }
                ratings[category] = rating;
                totalRating += rating;
                validCategories++;
            }
            
            const averageRating = totalRating / validCategories;
            
            // Preparar datos de calificación
            const ratingData = {
                rated_user_id: ratedUserId,
                rater_user_id: this.database.currentUser.id,
                user_type: userType,
                overall_rating: averageRating,
                category_ratings: ratings,
                comment: formData.get('comment'),
                tags: formData.getAll('tags'),
                created_at: new Date().toISOString()
            };
            
            // Guardar calificación
            await this.database.saveUserRating(ratingData);
            
            // Actualizar estadísticas del usuario calificado
            await this.updateUserRatingStats(ratedUserId);
            
            this.ui.closeModal();
            this.ui.hideLoading();
            this.ui.showToast('Calificación enviada correctamente', 'success');
            
        } catch (error) {
            console.error('Error enviando calificación:', error);
            this.ui.hideLoading();
            this.ui.showToast(error.message, 'error');
        }
    }

    // Mostrar modal de reporte
    showReportModal(userId, context) {
        this.ui.showModal('report-behavior', {
            title: 'Reportar Comportamiento',
            content: `
                <form id="report-form" class="report-form">
                    <input type="hidden" name="reported_user_id" value="${userId}">
                    <input type="hidden" name="context" value="${context}">
                    
                    <div class="report-intro">
                        <div class="warning-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p>Los reportes ayudan a mantener un ambiente seguro y respetuoso</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="report_type">Tipo de reporte</label>
                        <select id="report_type" name="report_type" required>
                            <option value="">Seleccionar tipo</option>
                            <option value="harassment">Acoso o intimidación</option>
                            <option value="inappropriate_language">Lenguaje inapropiado</option>
                            <option value="cheating">Trampa o juego desleal</option>
                            <option value="no_show">No se presentó al partido</option>
                            <option value="late_arrival">Llegada tarde</option>
                            <option value="poor_sportsmanship">Mal comportamiento deportivo</option>
                            <option value="violence">Violencia o agresión</option>
                            <option value="spam">Spam o contenido no deseado</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="report_description">Descripción del incidente</label>
                        <textarea id="report_description" name="description" rows="4" required
                                  placeholder="Describe lo que ocurrió..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="report_evidence">Evidencia (opcional)</label>
                        <input type="file" id="report_evidence" name="evidence" 
                               accept="image/*,video/*" multiple>
                        <small>Capturas de pantalla, videos, etc.</small>
                    </div>
                    
                    <div class="severity-level">
                        <label>Severidad del incidente</label>
                        <div class="severity-options">
                            <label class="severity-option">
                                <input type="radio" name="severity" value="low" required>
                                <span class="severity-low">Leve</span>
                            </label>
                            <label class="severity-option">
                                <input type="radio" name="severity" value="medium" required>
                                <span class="severity-medium">Moderado</span>
                            </label>
                            <label class="severity-option">
                                <input type="radio" name="severity" value="high" required>
                                <span class="severity-high">Grave</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="report-disclaimer">
                        <small>
                            <i class="fas fa-info-circle"></i>
                            Todos los reportes son revisados por nuestro equipo de moderación. 
                            Los reportes falsos pueden resultar en sanciones.
                        </small>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="uiManager.closeModal()" class="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-danger">
                            <i class="fas fa-flag"></i> Enviar Reporte
                        </button>
                    </div>
                </form>
            `
        });
    }

    // Enviar reporte
    async submitReport(form) {
        try {
            this.ui.showLoading('Enviando reporte...');
            
            const formData = new FormData(form);
            
            // Subir evidencia si existe
            const evidenceFiles = formData.getAll('evidence');
            const evidenceUrls = [];
            
            for (const file of evidenceFiles) {
                if (file.size > 0) {
                    const url = await this.database.uploadFile(file, 'reports');
                    evidenceUrls.push(url);
                }
            }
            
            // Preparar datos del reporte
            const reportData = {
                reported_user_id: formData.get('reported_user_id'),
                reporter_user_id: this.database.currentUser.id,
                report_type: formData.get('report_type'),
                description: formData.get('description'),
                context: formData.get('context'),
                severity: formData.get('severity'),
                evidence_urls: evidenceUrls,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            
            // Guardar reporte
            await this.database.saveUserReport(reportData);
            
            this.ui.closeModal();
            this.ui.hideLoading();
            this.ui.showToast('Reporte enviado. Será revisado por nuestro equipo', 'info');
            
        } catch (error) {
            console.error('Error enviando reporte:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al enviar reporte', 'error');
        }
    }

    // Ver calificaciones de usuario
    async viewUserRatings(userId) {
        try {
            this.ui.showLoading();
            
            const [ratings, stats] = await Promise.all([
                this.database.getUserRatings(userId),
                this.database.getUserRatingStats(userId)
            ]);
            
            this.renderUserRatingsView(ratings, stats);
            this.ui.hideLoading();
            
        } catch (error) {
            console.error('Error cargando calificaciones:', error);
            this.ui.hideLoading();
            this.ui.showToast('Error al cargar calificaciones', 'error');
        }
    }

    // Renderizar vista de calificaciones
    renderUserRatingsView(ratings, stats) {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="user-ratings-view">
                <div class="ratings-header">
                    <h2>Calificaciones y Reputación</h2>
                    <div class="overall-rating">
                        <div class="rating-display">
                            <span class="rating-number">${stats.overall_rating.toFixed(1)}</span>
                            <div class="rating-stars">
                                ${this.renderStars(stats.overall_rating)}
                            </div>
                            <small>${stats.total_ratings} calificaciones</small>
                        </div>
                    </div>
                </div>

                <div class="ratings-breakdown">
                    <h3>Desglose por Categoría</h3>
                    <div class="category-ratings">
                        ${Object.entries(stats.category_averages).map(([category, avg]) => `
                            <div class="category-item">
                                <span class="category-name">${this.getCategoryLabel(category)}</span>
                                <div class="category-rating">
                                    <div class="rating-bar">
                                        <div class="rating-fill" style="width: ${(avg / 5) * 100}%"></div>
                                    </div>
                                    <span class="rating-value">${avg.toFixed(1)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ratings-distribution">
                    <h3>Distribución de Calificaciones</h3>
                    <div class="distribution-chart">
                        ${[5, 4, 3, 2, 1].map(star => {
                            const count = stats.rating_distribution[star] || 0;
                            const percentage = stats.total_ratings > 0 ? (count / stats.total_ratings) * 100 : 0;
                            return `
                                <div class="distribution-row">
                                    <span class="star-label">${star} ⭐</span>
                                    <div class="distribution-bar">
                                        <div class="distribution-fill" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="count">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="recent-ratings">
                    <h3>Comentarios Recientes</h3>
                    <div class="ratings-list">
                        ${ratings.slice(0, 10).map(rating => `
                            <div class="rating-item">
                                <div class="rating-header">
                                    <div class="rating-stars">
                                        ${this.renderStars(rating.overall_rating)}
                                    </div>
                                    <span class="rating-date">${this.formatTimeAgo(rating.created_at)}</span>
                                </div>
                                ${rating.comment ? `
                                    <p class="rating-comment">${rating.comment}</p>
                                ` : ''}
                                ${rating.tags && rating.tags.length > 0 ? `
                                    <div class="rating-tags">
                                        ${rating.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Obtener etiquetas rápidas por tipo de usuario
    getQuickTags(userType) {
        const tags = {
            player: [
                { value: 'team_player', label: 'Buen compañero' },
                { value: 'skilled', label: 'Habilidoso' },
                { value: 'punctual', label: 'Puntual' },
                { value: 'positive_attitude', label: 'Actitud positiva' },
                { value: 'fair_play', label: 'Juego limpio' }
            ],
            organizer: [
                { value: 'well_organized', label: 'Bien organizado' },
                { value: 'clear_communication', label: 'Comunicación clara' },
                { value: 'responsive', label: 'Responsivo' },
                { value: 'fair_rules', label: 'Reglas justas' },
                { value: 'professional', label: 'Profesional' }
            ],
            sponsor: [
                { value: 'reliable_payment', label: 'Pagos puntuales' },
                { value: 'good_support', label: 'Buen apoyo' },
                { value: 'clear_terms', label: 'Términos claros' },
                { value: 'responsive', label: 'Responsivo' },
                { value: 'long_term', label: 'Visión a largo plazo' }
            ],
            referee: [
                { value: 'fair_calls', label: 'Decisiones justas' },
                { value: 'consistent', label: 'Consistente' },
                { value: 'professional', label: 'Profesional' },
                { value: 'knows_rules', label: 'Conoce las reglas' },
                { value: 'calm_under_pressure', label: 'Calmado bajo presión' }
            ]
        };
        
        return tags[userType] || tags.player;
    }

    // Obtener etiqueta de categoría
    getCategoryLabel(category) {
        const labels = {
            // Jugadores
            skill: 'Habilidad técnica',
            teamwork: 'Trabajo en equipo',
            punctuality: 'Puntualidad',
            sportsmanship: 'Deportividad',
            communication: 'Comunicación',
            
            // Organizadores
            organization: 'Organización',
            fairness: 'Justicia',
            problem_solving: 'Resolución de problemas',
            
            // Patrocinadores
            reliability: 'Confiabilidad',
            payment_punctuality: 'Puntualidad en pagos',
            support_quality: 'Calidad de apoyo',
            professionalism: 'Profesionalismo',
            
            // Árbitros
            consistency: 'Consistencia',
            rule_knowledge: 'Conocimiento de reglas'
        };
        
        return labels[category] || category;
    }

    // Obtener etiqueta de tipo de usuario
    getUserTypeLabel(userType) {
        const labels = {
            player: 'Jugador',
            organizer: 'Organizador',
            sponsor: 'Patrocinador',
            referee: 'Árbitro'
        };
        
        return labels[userType] || userType;
    }

    // Renderizar estrellas
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Estrellas llenas
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Media estrella
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Estrellas vacías
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // Actualizar estadísticas de calificación del usuario
    async updateUserRatingStats(userId) {
        try {
            const ratings = await this.database.getUserRatings(userId);
            
            if (ratings.length === 0) return;
            
            const totalRating = ratings.reduce((sum, rating) => sum + rating.overall_rating, 0);
            const averageRating = totalRating / ratings.length;
            
            // Calcular promedios por categoría
            const categoryAverages = {};
            const categoryRatings = {};
            
            ratings.forEach(rating => {
                Object.entries(rating.category_ratings).forEach(([category, value]) => {
                    if (!categoryRatings[category]) {
                        categoryRatings[category] = [];
                    }
                    categoryRatings[category].push(value);
                });
            });
            
            Object.entries(categoryRatings).forEach(([category, values]) => {
                categoryAverages[category] = values.reduce((sum, val) => sum + val, 0) / values.length;
            });
            
            // Calcular distribución
            const distribution = {};
            ratings.forEach(rating => {
                const rounded = Math.round(rating.overall_rating);
                distribution[rounded] = (distribution[rounded] || 0) + 1;
            });
            
            // Actualizar en base de datos
            await this.database.updateUserRatingStats(userId, {
                overall_rating: averageRating,
                total_ratings: ratings.length,
                category_averages: categoryAverages,
                rating_distribution: distribution,
                last_updated: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    }

    // Funciones de utilidad
    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) return 'Hace un momento';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} d`;
        return time.toLocaleDateString();
    }

    // Destruir instancia
    destroy() {
        this.userRatings.clear();
        this.behaviorHistory = [];
    }
}
