// Inicializador principal de la aplicación FutPro
import { Database } from './config/supabase.js';
import { FirebaseService } from './config/firebase.js';
import { AuthService } from './services/AuthService.js';
import { UIManager } from './services/UIManager.js';
import { ChatManager } from './services/ChatManager.js';
import { StreamManager } from './services/StreamManager.js';
import { NotificationManager } from './services/NotificationManager.js';
import { PenaltyGameComponent } from './components/PenaltyGameComponent.js';
// import LoginSocial from './components/LoginSocial.jsx';

// Clase principal de la aplicación
class FutProApp {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.services = {};
        this.components = {};
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando FutPro...');
            this.showSplashScreen();
            await this.initializeBaseServices();
            await this.checkAuthentication();
            if (this.currentUser) {
                await this.initializeUserServices();
            }
            this.renderMainLayout();
            this.setupNavigation();
            // Si tienes setupGlobalEvents y registerServiceWorker, agrégalas aquí
            // await this.registerServiceWorker();
            this.hideSplashScreen();
            this.loadInitialPage && this.loadInitialPage();
            this.isInitialized = true;
            console.log('✅ FutPro inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando FutPro:', error);
            this.showInitializationError(error);
        }
    }

    renderMainLayout() {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; min-height: 100vh; background: #181818;">
                <div id="top-bar"></div>
                <div style="flex:1;display:flex;">
                    <div id="sidebar-menu" style="min-width:220px;"></div>
                    <div id="main-content" style="flex:1;min-width:0;padding:0;"></div>
                </div>
                <div id="bottom-nav"></div>
                <button id="fab-plus" class="fab-plus" aria-label="Crear contenido"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        if (window.React && window.ReactDOM) {
            const TopBar = require('./components/TopBar.jsx').default;
            const BottomNav = require('./components/BottomNav.jsx').default;
            window.ReactDOM.render(window.React.createElement(TopBar), document.getElementById('top-bar'));
            window.ReactDOM.render(window.React.createElement(BottomNav, {
                active: 'home',
                onTab: (page) => {
                    window.location.hash = `#${page}`;
                }
            }), document.getElementById('bottom-nav'));
        }
        if (window.React && window.ReactDOM) {
            const SidebarMenu = window.SidebarMenu || require('./components/SidebarMenu.jsx').default;
            window.ReactDOM.render(window.React.createElement(SidebarMenu), document.getElementById('sidebar-menu'));
        }
        document.getElementById('fab-plus').onclick = () => {
            if (window.React && window.ReactDOM) {
                // ...
            }
        };
    }

    showSplashScreen() {
        document.body.innerHTML = `
            <div id="splash-screen" class="splash-screen">
                <div class="splash-content">
                    <div class="splash-logo">
                        <img src="/assets/logo.png" alt="FutPro" class="logo-img">
                        <h1 class="app-title">FutPro</h1>
                        <p class="app-subtitle">Red Social de Fútbol</p>
                    </div>
                    <div class="splash-loader">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Cargando...</p>
                    </div>
                    <div class="splash-footer">
                        <p>© 2024 FutPro. Todos los derechos reservados.</p>
                    </div>
                </div>
                <style>
                    .splash-screen {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                        color: #FFD700;
                    }
                    .splash-content {
                        text-align: center;
                        animation: fadeInUp 1s ease-out;
                    }
                    .splash-logo .logo-img {
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        margin-bottom: 20px;
                        animation: bounce 2s infinite;
                    }
                    .app-title {
                        font-size: 3rem;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                        background: linear-gradient(45deg, #FFD700, #FFA500);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    
                    .app-subtitle {
                        font-size: 1.2rem;
                        margin: 0 0 40px 0;
                        opacity: 0.8;
                    }
                    
                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(255, 215, 0, 0.3);
                        border-top: 4px solid #FFD700;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    }
                    
                    .loading-text {
                        font-size: 1rem;
                        margin: 0;
                    }
                    
                    .splash-footer {
                        position: absolute;
                        bottom: 30px;
                        font-size: 0.9rem;
                        opacity: 0.6;
                    }
                    
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-10px); }
                        60% { transform: translateY(-5px); }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
    }

    // Ocultar splash screen
    hideSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                splashScreen.remove();
            }, 500);
        }
    }

    // Inicializar servicios base
    async initializeBaseServices() {
        console.log('🔧 Inicializando servicios base...');
        
        // Base de datos
        this.services.database = new Database();
        await this.services.database.init();
        
        // Firebase
        this.services.firebase = new FirebaseService();
        await this.services.firebase.init();
        
        // UI Manager
        this.services.ui = new UIManager();
        
        // Auth Service
        this.services.auth = new AuthService(
            this.services.database, 
            this.services.firebase, 
            this.services.ui
        );
        
        console.log('✅ Servicios base inicializados');
    }

    // Verificar autenticación
    async checkAuthentication() {
        console.log('🔐 Verificando autenticación...');
        
        try {
            this.currentUser = await this.services.auth.getCurrentUser();
            
            if (this.currentUser) {
                console.log('✅ Usuario autenticado:', this.currentUser.email);
            } else {
                console.log('ℹ️ Usuario no autenticado');
            }
        } catch (error) {
            console.warn('⚠️ Error verificando autenticación:', error);
            this.currentUser = null;
        }
    }

    // Inicializar servicios de usuario
    async initializeUserServices() {
        if (!this.currentUser) return;
        
        console.log('👤 Inicializando servicios de usuario...');
        
        try {
            // Chat Manager
            this.services.chat = new ChatManager(
                this.services.firebase,
                this.services.database,
                this.services.ui
            );
            await this.services.chat.initializeChat(this.currentUser.id);
            
            // Stream Manager
            this.services.stream = new StreamManager(
                this.services.firebase,
                this.services.database,
                this.services.ui
            );
            
            // Notification Manager
            this.services.notifications = new NotificationManager(
                this.services.database,
                this.services.ui
            );
            
            // Componentes
            this.components.penaltyGame = new PenaltyGameComponent();
            
            console.log('✅ Servicios de usuario inicializados');
        } catch (error) {
            console.error('❌ Error inicializando servicios de usuario:', error);
        }
    }

    // Configurar navegación
    setupNavigation() {
        console.log('🧭 Configurando navegación...');
        
        // Manejar cambios de hash
        window.addEventListener('hashchange', () => {
            this.handleNavigation();
        });

        // Manejar botón atrás del navegador
        window.addEventListener('popstate', () => {
            this.handleNavigation();
        });
        
        // Interceptar enlaces internos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                window.location.hash = link.getAttribute('href');
            }
        });
    }

    // Manejar navegación
    handleNavigation() {
        const hash = window.location.hash.slice(1) || 'home';
        const [page, ...params] = hash.split('/');
        
        console.log('📍 Navegando a:', page, params);
        
        // Verificar autenticación para páginas protegidas
        const protectedPages = ['profile', 'chat', 'tournaments', 'teams', 'stream', 'settings'];
        
        if (protectedPages.includes(page) && !this.currentUser) {
            this.showAuthRequired();
            return;
        }
        
        // Cargar página
        this.loadPage(page, params);
        // Actualizar BottomNav activo
        if (window.React && window.ReactDOM) {
            const BottomNav = require('./components/BottomNav.jsx').default;
            window.ReactDOM.render(window.React.createElement(BottomNav, {
                active: page,
                onTab: (p) => window.location.hash = `#${p}`
            }), document.getElementById('bottom-nav'));
        }
    }

    // Cargar página
    async loadPage(page, params = []) {
        try {
            this.services.ui.showLoading();
            this.updateActiveNavigation(page);
            // const mainContent = document.getElementById('main-content');
            switch (page) {
                case 'home':
                    await this.loadHomePage();
                    break;
                case 'perfil':
                case 'profile':
                    await this.loadPerfilPage();
                    break;
                case 'partidos':
                    await this.loadPartidosPage();
                    break;
                case 'clubes':
                case 'teams':
                    await this.loadEquiposPage();
                    break;
                case 'torneos':
                case 'tournaments':
                    await this.loadTorneosPage();
                    break;
                case 'comparativas':
                    await this.loadComparativasPage();
                    break;
                case 'progreso':
                    await this.loadProgresoPage();
                    break;
                case 'penaltis':
                    await this.loadPenaltisPage();
                    break;
                case 'media-upload':
                    await this.loadMediaUploadPage();
                    break;
                case 'team-management':
                    await this.loadTeamManagementPage();
                    break;
                case 'match-management':
                    await this.loadMatchManagementPage();
                    break;
                case 'tournament-creator':
                    await this.loadTournamentCreatorPage();
                    break;
                case 'comments':
                    await this.loadCommentsPage(params[0]);
                    break;
                case 'like':
                    await this.loadLikePage(params[0]);
                    break;
                case 'share':
                    await this.loadSharePage(params[0]);
                    break;
                case 'search':
                    await this.loadSearchPage(params[0]);
                    break;
                case 'ranking':
                    await this.loadRankingPage();
                    break;
                case 'estadisticas':
                    await this.loadEstadisticasPage();
                    break;
                case 'logros':
                    await this.loadLogrosPage();
                    break;
                case 'amistosos':
                    await this.loadAmistososPage();
                    break;
                case 'transmitir':
                    await this.loadTransmitirPage();
                    break;
                // ...otros casos...
                default:
                    this.showGenericPage(page, params);
            }
            this.services.ui.hideLoading();
        } catch (error) {
            console.error('Error cargando página:', error);
            this.services.ui.hideLoading();
            this.services.ui.showToast('Error cargando la página', 'error');
        }
    }

    // Ejemplo de subpaneles/páginas específicas
    async loadMediaUploadPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const MediaUploadPanel = require('./components/SubirFotoVideo.jsx').default;
            window.ReactDOM.render(window.React.createElement(MediaUploadPanel), container);
        } else {
            container.innerHTML = '<h2>Subir Foto/Video</h2>';
        }
    }

    async loadTeamManagementPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const TeamManagementPanel = require('./components/ConvocatoriaEquipo.js').default;
            window.ReactDOM.render(window.React.createElement(TeamManagementPanel), container);
        } else {
            container.innerHTML = '<h2>Gestión de Equipo</h2>';
        }
    }

    async loadMatchManagementPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const MatchManagementPanel = require('./components/ComentariosPartido.js').default;
            window.ReactDOM.render(window.React.createElement(MatchManagementPanel), container);
        } else {
            container.innerHTML = '<h2>Gestión de Partido</h2>';
        }
    }

    async loadTournamentCreatorPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const TournamentCreatorPanel = require('./components/TorneoForm.jsx').default;
            window.ReactDOM.render(window.React.createElement(TournamentCreatorPanel), container);
        } else {
            container.innerHTML = '<h2>Crear Torneo</h2>';
        }
    }

    async loadCommentsPage(postId) {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const ComentariosPanel = require('./components/ComentariosPartido.js').default;
            window.ReactDOM.render(window.React.createElement(ComentariosPanel, { postId }), container);
        } else {
            container.innerHTML = `<h2>Comentarios del post ${postId}</h2>`;
        }
    }

    async loadLikePage(postId) {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const LikePanel = require('./components/LikeButton.js').default;
            window.ReactDOM.render(window.React.createElement(LikePanel, { postId }), container);
        } else {
            container.innerHTML = `<h2>Likes del post ${postId}</h2>`;
        }
    }

    async loadSharePage(postId) {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const SharePanel = require('./components/PanelNoticias.js').default;
            window.ReactDOM.render(window.React.createElement(SharePanel, { postId }), container);
        } else {
            container.innerHTML = `<h2>Compartir post ${postId}</h2>`;
        }
    }

    async loadSearchPage(query) {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const SearchPanel = require('./components/BuscarTorneosCercanos.js').default;
            window.ReactDOM.render(window.React.createElement(SearchPanel, { query }), container);
        } else {
            container.innerHTML = `<h2>Resultados de búsqueda: ${query}</h2>`;
        }
    }

    async loadRankingPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const RankingPanel = require('./components/RankingTable.js').default;
            window.ReactDOM.render(window.React.createElement(RankingPanel), container);
        } else {
            container.innerHTML = '<h2>Ranking</h2>';
        }
    }

    async loadEstadisticasPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const EstadisticasPanel = require('./components/StatsChart.js').default;
            window.ReactDOM.render(window.React.createElement(EstadisticasPanel), container);
        } else {
            container.innerHTML = '<h2>Estadísticas</h2>';
        }
    }

    async loadLogrosPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const LogrosPanel = require('./components/LogrosPanel.js').default;
            window.ReactDOM.render(window.React.createElement(LogrosPanel), container);
        } else {
            container.innerHTML = '<h2>Logros</h2>';
        }
    }

    async loadAmistososPage() {
        const container = document.getElementById('main-content');
        if (!container) return;
        if (window.React && window.ReactDOM) {
            const AmistososPanel = require('./components/AmistososPanel.jsx').default;
            window.ReactDOM.render(window.React.createElement(AmistososPanel), container);
        } else {
            container.innerHTML = '<h2>Amistosos</h2>';
        }
    }

    // (Eliminada definición duplicada de loadTransmitirPage)

    // Mostrar error de inicialización
    showInitializationError(error) {
        document.body.innerHTML = `
            <div class="error-page">
                <div class="error-content">
                    <h1>Error de Inicialización</h1>
                    <p>No se pudo cargar la aplicación correctamente.</p>
                    <p class="error-message">${error.message}</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        Reintentar
                    </button>
                </div>
            </div>
        `;
    }

    // Métodos de utilidad
    showAuthRequired() {
        this.services.ui.showModal('auth-required', {
            title: 'Autenticación Requerida',
            content: `
                <p>Necesitas iniciar sesión para acceder a esta función.</p>
                <div class="modal-actions">
                    <a href="#login" class="btn btn-primary">Iniciar Sesión</a>
                    <a href="#register" class="btn btn-secondary">Registrarse</a>
                </div>
            `
        });
    }

    // Actualizar navegación activa
    updateActiveNavigation(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Renderizar posts
    renderPosts(posts) {
        return posts.map(post => `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.userAvatar}" alt="${post.userName}" class="user-avatar">
                    <div class="post-info">
                        <div class="user-name">${post.userName}</div>
                        <div class="post-time">${this.formatTime(post.createdAt)}</div>
                    </div>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                <div class="post-actions">
                    <button class="action-btn like-btn" onclick="app.toggleLike('${post.id}')">
                        <i class="fas fa-heart"></i> ${post.likesCount}
                    </button>
                    <button class="action-btn comment-btn" onclick="app.showComments('${post.id}')">
                        <i class="fas fa-comment"></i> ${post.commentsCount}
                    </button>
                    <button class="action-btn share-btn" onclick="app.sharePost('${post.id}')">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Formatear tiempo
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'hace un momento';
        if (diff < 3600000) return 'hace ' + Math.floor(diff / 60000) + ' min';
        if (diff < 86400000) return 'hace ' + Math.floor(diff / 3600000) + ' h';
        
        return date.toLocaleDateString();
    }

    // Destruir aplicación
    destroy() {
        console.log('🔥 Destruyendo FutPro...');
        
        // Destruir servicios
        Object.values(this.services).forEach(service => {
            if (service && typeof service.destroy === 'function') {
                service.destroy();
            }
        });
        
        // Limpiar eventos
        window.removeEventListener('hashchange', this.handleNavigation);
        window.removeEventListener('popstate', this.handleNavigation);
        
        this.isInitialized = false;
        console.log('✅ FutPro destruida');
    }
}


// Exponer instancia global
window.app = new FutProApp();

if (process.env.NODE_ENV === 'development') {
    window.futpro = {
        app: window.app,
        services: window.app.services,
        components: window.app.components
    };
}

export default FutProApp;
