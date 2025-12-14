// FutPro - Red Social de Fútbol Profesional
// Clase principal de la aplicación FutPro


import { AnalyticsManager } from './services/AnalyticsManager.js';
import { SearchManager } from './services/SearchManager.js';
import { AchievementManager } from './services/AchievementManager.js';

// Importa cliente Supabase centralizado
import supabase from './supabaseClient.js';


class FutProApp {
  constructor() {
    // Inicialización de managers reales
    this.analyticsManager = new AnalyticsManager();
    this.searchManager = new SearchManager();
    this.achievementManager = new AchievementManager();
    // Si tienes managers para stream y notificaciones, inicialízalos aquí
    // this.streamManager = new StreamManager();
    // this.notificationManager = new NotificationManager();
    this.state = {
      userProfile: null,
      suggestions: [],
      liveMatches: [],
      stories: []
    };
    this.user = null;
    this.isAuthenticated = false;
    this.currentPage = null;
    this.currentParams = {};
  }
  requireLogin() {
    if (!this.user || !this.isAuthenticated) {
      document.getElementById('loginModal').style.display = 'flex';
      setTimeout(() => {
        window.location.href = '#login';
      }, 2500);
      return false;
    }
    return true;
  }

  async renderMainFeed() {
    const feedContainer = document.getElementById('mainFeed');
    if (!feedContainer) return;
    const posts = await this.analyticsManager.getMainFeedPosts();
    feedContainer.innerHTML = posts.map(post => `
      <div class="tiktok-card">
        ${post.videoUrl ? `<video src="${post.videoUrl}" controls autoplay loop style="width:100%;max-height:420px;object-fit:cover;"></video>` : `<img src="${post.imageUrl}" style="width:100%;max-height:420px;object-fit:cover;">`}
        <div class="card-content" style="padding:18px 24px;">
          <div class="card-user" style="display:flex;align-items:center;gap:12px;">
            <img src="${post.userAvatar}" style="width:40px;height:40px;border-radius:50%;border:2px solid #FFD700;">
            <span style="font-weight:600;">${post.userName}</span>
          </div>
          <div class="card-desc" style="margin:12px 0;font-size:1.1em;">${post.description}</div>
          <div class="card-actions" style="display:flex;gap:24px;align-items:center;">
            <button class="btn-reaction"><i class="fa-solid fa-heart"></i> ${post.likes}</button>
            <button class="btn-reaction"><i class="fa-solid fa-comment"></i> ${post.comments}</button>
            <button class="btn-reaction"><i class="fa-solid fa-share"></i></button>
          </div>
        </div>
      </div>
    `).join('');
  }

  async renderLiveStreams(category = 'all') {
    const streamsPanel = document.getElementById('liveStreamsPanel');
    if (!streamsPanel) return;
    let streams = await this.streamManager.getActiveStreams();
    if (category && category !== 'all') {
      streams = streams.filter(s => s.category === category);
    }
    streamsPanel.innerHTML = streams.map(stream => `
      <div class="stream-card animated-stream" style="background:#181818;border-radius:16px;padding:12px 18px;box-shadow:0 2px 8px #FFD70022;display:flex;align-items:center;gap:16px;animation:fadeInUp 0.7s;">
        <img src="${stream.thumbnail}" style="width:60px;height:60px;border-radius:12px;object-fit:cover;">
        <div style="flex:1;">
          <div style="font-weight:600;color:#FFD700;">${stream.title}</div>
          <div style="font-size:0.95em;color:#fff;">${stream.viewers} espectadores</div>
        </div>
        <button class="btn-primary" onclick="window.open('${stream.url}','_blank')"><i class="fa-solid fa-play"></i> Ver</button>
      </div>
    `).join('');
  }

  async initVisualPanels() {
    const chatBtn = document.querySelector('.btn-secondary[onclick*="chatLivePanel"]');
    if (chatBtn) {
      chatBtn.onclick = (e) => {
        if (!this.requireLogin('chat')) {
          e.preventDefault();
          return false;
        }
        document.getElementById('chatLivePanel').style.display = 'block';
      };
    }
    const streamBtns = document.querySelectorAll('.btn-primary[onclick*="stream"]');
    streamBtns.forEach(btn => {
      btn.onclick = (e) => {
        if (!this.requireLogin('stream')) {
          e.preventDefault();
          return false;
        }
        // ...acción de transmitir...
      };
    });
    await this.renderAchievements();
  await this.renderStatisticsCharts();
    await this.renderAdvancedSearch();
    await this.renderMainFeed();
    await this.renderLiveStreams();
    await this.renderNotifications();
    const categorySelect = document.getElementById('streamCategory');
    if (categorySelect) {
      categorySelect.addEventListener('change', async (e) => {
        await this.renderLiveStreams(e.target.value);
      });
    }
  }

  async renderNotifications() {
    const notifPanel = document.getElementById('notificationsPanel');
    if (!notifPanel) return;
    const notifications = await this.notificationManager.getUserNotifications();
    notifPanel.innerHTML = notifications.map(n => `
      <div class="notif-card" style="background:#222;border-radius:12px;padding:12px 18px;box-shadow:0 2px 8px #FFD70022;display:flex;align-items:center;gap:12px;">
        <i class="fa-solid fa-bell" style="color:#FFD700;font-size:1.3em;"></i>
        <div style="flex:1;">
          <div style="font-weight:600;">${n.title}</div>
          <div style="font-size:0.95em;color:#fff;">${n.message}</div>
        </div>
        <span style="font-size:0.85em;color:#FFD700;">${n.date}</span>
      </div>
    `).join('');
  }

  async renderAchievements() {
    const container = document.getElementById('achievements-list');
    const progressBar = document.getElementById('level-progress');
    if (!container || !progressBar) return;
    const userId = this.user?.id || this.state?.userProfile?.id;
    if (!userId) {
      container.innerHTML = '<div class="empty-state">Inicia sesión para ver tus logros.</div>';
      progressBar.innerHTML = '';
      return;
    }
    try {
      const achievements = await this.achievementManager.getUserAchievements(userId);
      const userStats = await this.achievementManager.getUserStats(userId);
  // Progreso de usuario (no requerido para la UI inmediata)
      if (!achievements || achievements.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-trophy"></i><h3>Sin logros aún</h3><p>Los logros aparecerán aquí conforme los vayas desbloqueando</p></div>`;
      } else {
        container.innerHTML = achievements.map(a => {
          const def = this.achievementManager.achievementDefinitions[a.achievement_id] || {};
          const unlocked = a.earned_at ? true : false;
          const color = unlocked ? '#FFD700' : '#444';
          return `<div class="achievement-card" style="background:${color};padding:16px;border-radius:12px;min-width:120px;text-align:center;box-shadow:0 2px 8px #0002;">
            <i class="${def.icon || 'fas fa-trophy'}" style="font-size:2em;"></i>
            <div style="font-weight:bold;">${def.name || a.achievement_id}</div>
            <div style="font-size:0.9em;">${def.description || ''}</div>
            ${unlocked ? `<small>Desbloqueado el ${a.earned_at.split('T')[0]}</small>` : ''}
          </div>`;
        }).join('');
      }
      const nivel = userStats?.level || 1;
      const puntos = userStats?.achievement_points || 0;
      const nextLevel = this.achievementManager.config.levelThresholds.find(l => l > puntos) || puntos;
      const percent = Math.round((puntos / nextLevel) * 100);
      progressBar.innerHTML = `<div style='margin-top:12px;'>Nivel ${nivel} <progress value='${percent}' max='100' style='width:80%;'></progress> ${percent}%</div>`;
    } catch (err) {
      container.innerHTML = `<div class="empty-state">Error cargando logros</div>`;
      progressBar.innerHTML = '';
    }
  }

  async renderStatisticsCharts() {
    const userId = this.user?.id || this.state?.userProfile?.id;
    if (!userId || !window.Chart) return;
    try {
      const stats = await this.analyticsManager.getUserStatistics(userId);
      const activityData = stats?.weeklyActivity || [0,0,0,0,0,0,0];
      const postsData = stats?.weeklyPosts || [0,0,0,0,0,0,0];
      const matchesData = stats?.weeklyMatches || [0,0,0,0,0,0,0];
      const teamsData = stats?.weeklyTeams || [0,0,0,0,0,0,0];
      const ctx1 = document.getElementById('activityChart')?.getContext('2d');
      if (ctx1 && window.Chart) {
        new window.Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ label: 'Actividad', data: activityData, backgroundColor: '#FFD700' }]
          },
          options: { responsive: true }
        });
      }
      const ctx2 = document.getElementById('postsChart')?.getContext('2d');
      if (ctx2 && window.Chart) {
        new window.Chart(ctx2, {
          type: 'line',
          data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ label: 'Posts', data: postsData, borderColor: '#FFD700', backgroundColor: '#FFF8DC' }]
          },
          options: { responsive: true }
        });
      }
      const ctx3 = document.getElementById('matchesChart')?.getContext('2d');
      if (ctx3 && window.Chart) {
        new window.Chart(ctx3, {
          type: 'bar',
          data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ label: 'Partidos', data: matchesData, backgroundColor: '#FFD700' }]
          },
          options: { responsive: true }
        });
      }
      const ctx4 = document.getElementById('teamsChart')?.getContext('2d');
      if (ctx4 && window.Chart) {
        new window.Chart(ctx4, {
          type: 'pie',
          data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ label: 'Equipos', data: teamsData, backgroundColor: ['#FFD700','#C0C0C0','#CD7F32','#FFF8DC','#FF8C00','#FFA500','#222'] }]
          },
          options: { responsive: true }
        });
      }
    } catch (err) {
      // Mostrar error o fallback
    }
  }

  renderAdvancedSearch() {
    const input = document.getElementById('advancedSearchInput');
    const results = document.getElementById('advancedSearchResults');
    if (!input || !results) return;
    input.addEventListener('input', async () => {
      const val = input.value.toLowerCase();
      if (!val) {
        results.innerHTML = '';
        return;
      }
      const foundPlayers = await this.searchManager.searchPlayers(val);
      const foundTeams = await this.searchManager.searchTeams(val);
      const foundTournaments = await this.searchManager.searchTournaments(val);
      const allResults = [
        ...foundPlayers.map(r => ({ tipo: 'Jugador', nombre: r.name, info: r.position, icono: 'fas fa-user' })),
        ...foundTeams.map(r => ({ tipo: 'Equipo', nombre: r.name, info: r.league, icono: 'fas fa-users' })),
        ...foundTournaments.map(r => ({ tipo: 'Torneo', nombre: r.name, info: r.year, icono: 'fas fa-trophy' }))
      ];
      results.innerHTML = allResults.map(r => `
        <div class='search-card' style='background:#fff;padding:14px;border-radius:10px;box-shadow:0 2px 8px #0001;min-width:160px;margin-bottom:8px;'>
          <i class='${r.icono}' style='font-size:1.5em;color:#FFD700;'></i>
          <div style='font-weight:bold;'>${r.nombre}</div>
          <div style='font-size:0.9em;'>${r.info}</div>
          <span style='font-size:0.8em;color:#888;'>${r.tipo}</span>
        </div>
      `).join('');
    });
  }

  setupSearchResultListeners() {
    const resultItems = document.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const id = item.getAttribute('data-id');
        this.handleSearchResultClick(type, id);
      });
    });
  }

  handleSearchResultClick(type, id) {
    switch (type) {
      case 'user':
        this.navigateTo('user-profile', { userId: id });
        break;
      case 'team':
        this.navigateTo('team-profile', { teamId: id });
        break;
      case 'tournament':
        this.navigateTo('tournament-detail', { tournamentId: id });
        break;
    }
    this.hideSearchResults();
  }

  async navigateTo(page, params = {}) {
    console.log(`🧭 Navegando a: ${page}`, params);
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeNavItem = document.querySelector(`[data-page="${page}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
    this.currentPage = page;
    this.currentParams = params;
    await this.loadPageContent(page, params);
  }

  async loadPageContent(page, params = {}) {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;
    try {
      contentContainer.innerHTML = '<div class="loading-content">Cargando...</div>';
      switch (page) {
        case 'feed':
          await this.loadFeedContent(contentContainer);
          break;
        case 'tournaments':
          await this.loadTournamentsContent(contentContainer);
          break;
        case 'teams':
          await this.loadTeamsContent(contentContainer);
          break;
        case 'players':
          await this.loadPlayersContent(contentContainer);
          break;
        case 'live':
          await this.loadLiveContent(contentContainer);
          break;
        case 'my-profile':
          await this.loadProfileContent(contentContainer);
          break;
        case 'user-profile':
          await this.loadProfileContent(contentContainer, params.userId);
          break;
        case 'team-profile':
          await this.loadTeamProfileContent(contentContainer, params.teamId);
          break;
        case 'tournament-detail':
          await this.loadTournamentDetailContent(contentContainer, params.tournamentId);
          break;
        case 'penalty-game':
          await this.loadPenaltyGameContent(contentContainer);
          break;
        default:
          contentContainer.innerHTML = `<div class="page-content"><h2>Página en desarrollo</h2><p>Esta página estará disponible pronto.</p></div>`;
      }
    } catch (error) {
      console.error(`Error cargando contenido de ${page}:`, error);
      contentContainer.innerHTML = '<div class="error-content">Error cargando contenido</div>';
    }
  }

  async loadSuggestions() {
    try {
      const { data, error } = await supabase.from('suggestions').select('*').limit(10);
      if (error) throw error;
      this.state.suggestions = data || [];
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
      this.state.suggestions = [];
    }
  }

  async loadLiveMatches() {
    try {
      const { data, error } = await supabase.from('matches').select('*').eq('status', 'live');
      if (error) throw error;
      this.state.liveMatches = data || [];
    } catch (error) {
      console.error('Error cargando partidos en vivo:', error);
      this.state.liveMatches = [];
    }
  }

  async loadStories() {
    try {
      const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false }).limit(20);
      if (error) throw error;
      this.state.stories = data || [];
    } catch (error) {
      console.error('Error cargando historias:', error);
      this.state.stories = [];
    }
  }

  async loadTournamentsContent(container) {
    try {
      const { data, error } = await supabase.from('tournaments').select('*').order('start_date', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        container.innerHTML = '<div class="empty-section">No hay campeonatos disponibles.</div>';
        return;
      }
      container.innerHTML = '';
      data.forEach((t, idx) => {
        const card = document.createElement('div');
        card.className = 'card tournament-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.innerHTML = `
          <div class="tournament-header">
            <i class="fa-solid fa-trophy" style="font-size:2em;color:#FFD700;"></i>
            <h3 style="color:#FFD700">${t.name}</h3>
          </div>
          <div class="tournament-details">
            <p><strong>Fecha inicio:</strong> ${t.start_date}</p>
            <p><strong>Estado:</strong> ${t.status}</p>
          </div>
        `;
        container.appendChild(card);
        setTimeout(() => {
          card.style.transition = 'opacity 0.6s, transform 0.6s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 * idx);
      });
    } catch (error) {
      container.innerHTML = '<div class="error-message">Error cargando campeonatos</div>';
    }
  }

  async loadTeamsContent(container) {
    try {
      const { data, error } = await supabase.from('teams').select('*').order('name', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        container.innerHTML = '<div class="empty-section">No hay equipos disponibles.</div>';
        return;
      }
      container.innerHTML = '';
      data.forEach((team, idx) => {
        const card = document.createElement('div');
        card.className = 'card team-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.innerHTML = `
          <div class="team-header">
            <i class="fa-solid fa-users" style="font-size:2em;color:#111;"></i>
            <h3 style="color:#fff">${team.name}</h3>
          </div>
          <div class="team-details">
            <p><strong>Miembros:</strong> ${team.member_count || 0}</p>
          </div>
        `;
        container.appendChild(card);
        setTimeout(() => {
          card.style.transition = 'opacity 0.6s, transform 0.6s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 * idx);
      });
    } catch (error) {
      container.innerHTML = '<div class="error-message">Error cargando equipos</div>';
    }
  }

  async loadPlayersContent(container) {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('user_type', 'player').order('name', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        container.innerHTML = '<div class="empty-section">No hay jugadores disponibles.</div>';
        return;
      }
      container.innerHTML = '';
      data.forEach((player, idx) => {
        const card = document.createElement('div');
        card.className = 'card player-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.innerHTML = `
          <div class="player-header">
            <img src="${player.avatar_url || '/assets/default-avatar.jpg'}" alt="${player.name}" class="user-avatar-small">
            <h3 style="color:#2196f3">${player.name}</h3>
          </div>
          <div class="player-details">
            <p><strong>Posición:</strong> ${player.position || 'Sin posición'}</p>
          </div>
        `;
        container.appendChild(card);
        setTimeout(() => {
          card.style.transition = 'opacity 0.6s, transform 0.6s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 * idx);
      });
    } catch (error) {
      container.innerHTML = '<div class="error-message">Error cargando jugadores</div>';
    }
  }

  async loadLiveContent(container) {
    try {
      const { data, error } = await supabase.from('matches').select('*').eq('status', 'live');
      if (error) throw error;
      if (!data || data.length === 0) {
        container.innerHTML = '<div class="empty-section">No hay partidos en vivo.</div>';
        return;
      }
      container.innerHTML = data.map(match => `
        <div class="card live-match-card">
          <i class="fa-solid fa-play-circle" style="color:#e53935"></i>
          <h3>${match.team_a} vs ${match.team_b}</h3>
          <p><strong>Hora:</strong> ${match.start_time}</p>
          <p><strong>Estado:</strong> ${match.status}</p>
        </div>
      `).join('');
    } catch (error) {
      container.innerHTML = '<div class="error-message">Error cargando partidos en vivo</div>';
    }
  }

  async loadProfileContent(container) {
    try {
      const userProfile = this.state.userProfile;
      if (!userProfile) {
        container.innerHTML = '<div class="error-message">No se pudo cargar el perfil</div>';
        return;
      }
      // Consulta de seguidores omitida por ahora; agregar cuando se use en UI.
      // followersCount disponible si se requiere en UI futura
      // ...existing code...
      // Aquí deberías continuar con la lógica de perfil, logros, historial, etc.
    } catch (error) {
      container.innerHTML = '<div class="error-message">No se pudo cargar el perfil</div>';
    }
  }

    // Registrar Service Worker para fallback de entrada main.js
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('/service-worker.js')
          .then(reg => console.log('🔔 SW registrado (main.js)', reg.scope))
          .catch(err => console.warn('SW no registrado (main.js):', err && err.message ? err.message : err))
      } catch (e) {
        console.warn('SW fallback error:', e)
      }
    }
}


document.addEventListener('DOMContentLoaded', () => {
  window.futProApp = new FutProApp();
  window.futProApp.initVisualPanels();
});

