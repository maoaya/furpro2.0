/**
 * 🔥 SISTEMA DE TRACKING AVANZADO TIPO REDES SOCIALES
 * Autoguarda TODAS las acciones del usuario en tiempo real
 * Funciona como Facebook, Instagram, TikTok
 */

import supabase from '../supabaseClient';

class UserActivityTracker {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingActions = [];
    this.lastSave = null;
    this.user = null;
    this.autoSaveInterval = null;
    this.debounceTimers = new Map();
    
    this.initializeTracker();
    this.setupEventListeners();
  }

  /**
   * 🚀 INICIALIZAR TRACKER
   */
  initializeTracker() {
    console.log('🔥 UserActivityTracker iniciado - Modo Red Social');
    
    // Auto-save cada 3 segundos (más agresivo que redes sociales)
    this.autoSaveInterval = setInterval(() => {
      this.processPendingActions();
    }, 3000);

    // Cargar acciones pendientes del localStorage
    this.loadPendingActions();
  }

  /**
   * 📱 CONFIGURAR EVENT LISTENERS
   */
  setupEventListeners() {
    // Detectar cambios de conectividad
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Conexión restaurada - Sincronizando...');
      this.processPendingActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Sin conexión - Modo offline activado');
    });

    // Guardar antes de cerrar pestaña
    window.addEventListener('beforeunload', () => {
      this.processPendingActions(true);
    });

    // Detectar cambios de foco (como Instagram)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackAction('page_hidden', { timestamp: new Date().toISOString() });
      } else {
        this.trackAction('page_visible', { timestamp: new Date().toISOString() });
      }
    });
  }

  /**
   * 👤 ESTABLECER USUARIO
   */
  setUser(user) {
    this.user = user;
    console.log(`👤 Usuario establecido: ${user?.email}`);
    
    // Trackear login
    if (user) {
      this.trackAction('user_login', {
        userId: user.id,
        email: user.email,
        loginMethod: 'detected',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 📊 TRACKEAR ACCIÓN PRINCIPAL
   */
  trackAction(actionType, data = {}, saveImmediate = false) {
    const action = {
      id: this.generateActionId(),
      userId: this.user?.id || 'anonymous',
      actionType,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        userAgent: navigator.userAgent.substring(0, 100),
        sessionId: this.getSessionId()
      },
      attempts: 0,
      created: Date.now()
    };

    // Añadir a cola de acciones pendientes
    this.pendingActions.push(action);

    // Debug log
    console.log(`📱 Acción tracked: ${actionType}`, data);

    // Guardar inmediatamente si es crítico
    if (saveImmediate || this.isCriticalAction(actionType)) {
      this.processPendingActions(true);
    } else {
      // Guardar en localStorage como backup
      this.savePendingActions();
    }

    return action.id;
  }

  /**
   * 🔥 MÉTODOS ESPECÍFICOS DE TRACKING (COMO REDES SOCIALES)
   */

  // 🔐 TRACKING DE AUTENTICACIÓN
  trackLogin(method, success, userData = {}) {
    this.trackAction('auth_login', {
      method, // 'google', 'facebook', 'email', 'registro_completo'
      success,
      userEmail: userData.email,
      userId: userData.id,
      provider: method,
      timestamp: new Date().toISOString()
    }, true); // Guardar inmediatamente
  }

  trackLogout() {
    this.trackAction('auth_logout', {
      duration: this.getSessionDuration(),
      timestamp: new Date().toISOString()
    }, true);
  }

  // 📝 TRACKING DE FORMULARIOS (COMO INSTAGRAM STORIES)
  trackFormInput(fieldName, value, step = null) {
    // Debounce para evitar spam
    const key = `form_${fieldName}`;
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    this.debounceTimers.set(key, setTimeout(() => {
      this.trackAction('form_input', {
        fieldName,
        valueLength: value ? value.length : 0,
        step,
        hasValue: !!value,
        fieldType: this.detectFieldType(fieldName)
      });
    }, 1000));
  }

  trackFormStep(step, completed = false) {
    this.trackAction('form_step', {
      step,
      completed,
      progress: `${step}/5`,
      timestamp: new Date().toISOString()
    });
  }

  trackFormSubmission(formType, success, errorMessage = null) {
    this.trackAction('form_submission', {
      formType,
      success,
      errorMessage,
      timestamp: new Date().toISOString()
    }, true);
  }

  // 📷 TRACKING DE UPLOADS (COMO INSTAGRAM)
  trackPhotoUpload(fileName, fileSize, uploadType) {
    this.trackAction('photo_upload', {
      fileName: fileName.substring(0, 50),
      fileSize,
      uploadType,
      timestamp: new Date().toISOString()
    }, true);
  }

  trackPhotoEdit(editType, duration) {
    this.trackAction('photo_edit', {
      editType,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  // 🎯 TRACKING DE NAVEGACIÓN (COMO TIKTOK)
  trackPageView(page, referrer = null) {
    this.trackAction('page_view', {
      page,
      referrer: referrer || document.referrer,
      loadTime: performance.now(),
      timestamp: new Date().toISOString()
    });
  }

  trackButtonClick(buttonType, buttonText, context = null) {
    this.trackAction('button_click', {
      buttonType,
      buttonText: buttonText.substring(0, 50),
      context,
      timestamp: new Date().toISOString()
    });
  }

  trackScrollDepth(percentage, page) {
    // Solo trackear cada 25% para evitar spam
    if (percentage % 25 === 0) {
      this.trackAction('scroll_depth', {
        percentage,
        page,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ⚽ TRACKING ESPECÍFICO DE FUTPRO
  trackProfileAction(actionType, profileData = {}) {
    this.trackAction('profile_action', {
      actionType, // 'view', 'edit', 'score_update', 'card_generate'
      profileData: {
        hasPhoto: !!profileData.foto_url,
        position: profileData.posicion,
        experience: profileData.experiencia,
        score: profileData.puntaje || 0
      },
      timestamp: new Date().toISOString()
    });
  }

  trackGameAction(actionType, gameData = {}) {
    this.trackAction('game_action', {
      actionType, // 'create', 'join', 'leave', 'score'
      gameData,
      timestamp: new Date().toISOString()
    });
  }

  trackSocialInteraction(interactionType, targetUser = null) {
    this.trackAction('social_interaction', {
      interactionType, // 'follow', 'unfollow', 'message', 'invite'
      targetUser,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 💾 PROCESAMIENTO Y GUARDADO
   */
  async processPendingActions(force = false) {
    if (!this.isOnline && !force) {
      console.log('📴 Sin conexión - Acciones en cola:', this.pendingActions.length);
      return;
    }

    if (this.pendingActions.length === 0) return;

    const actionsToProcess = [...this.pendingActions];
    this.pendingActions = [];

    console.log(`💾 Procesando ${actionsToProcess.length} acciones...`);

    try {
      // Separar acciones que requieren usuario autenticado (RLS) vs. anónimas (diferir)
      const toInsert = actionsToProcess.filter(a => a.userId && a.userId !== 'anonymous');
      const toDefer = actionsToProcess.filter(a => !a.userId || a.userId === 'anonymous');

      // Re-encolar las anónimas hasta que tengamos userId
      if (toDefer.length > 0) {
        console.log(`⏸️ Diferidas ${toDefer.length} acciones sin userId (esperando login)`);
        this.pendingActions.unshift(...toDefer);
      }

      if (toInsert.length === 0) {
        this.savePendingActions();
        return;
      }

      // Guardar en Supabase (schema 'api')
      const { error } = await supabase
        .schema('api')
        .from('user_activities')
        .insert(toInsert.map(action => ({
          // id: lo genera la DB (uuid)
          user_id: action.userId,
          action_type: action.actionType,
          action_data: action.data,
          created_at: new Date(action.created).toISOString()
        })));

      if (error) {
        // Detectar 404 típico de tabla inexistente bajo esquema api
        const msg = (error?.message || '').toLowerCase();
        const code = error?.code || '';
        const status = error?.status || error?.statusCode || 0;
        if (status === 404 || msg.includes('not found') || msg.includes('does not exist')) {
          console.warn('⚠️ Tracking deshabilitado temporalmente (tabla api.user_activities no encontrada).');
          // Backoff: guardar en localStorage y no reintentar agresivamente para evitar spam
          this.pendingActions.unshift(...toInsert, ...toDefer);
          this.savePendingActions();
          // Desactivar autosave por 2 minutos
          if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
          setTimeout(() => {
            this.autoSaveInterval = setInterval(() => this.processPendingActions(), 3000);
          }, 120000);
          return;
        }

        console.error('❌ Error guardando actividades:', error);
        // Volver a añadir a la cola con incremento de intentos
        toInsert.forEach(action => {
          action.attempts += 1;
          if (action.attempts < 3) {
            this.pendingActions.push(action);
          }
        });
        // Mantener diferidas
        if (toDefer.length > 0) this.pendingActions.unshift(...toDefer);
      } else {
        console.log(`✅ ${toInsert.length} acciones guardadas exitosamente`);
        this.lastSave = new Date().toISOString();
        
        // Limpiar localStorage
        localStorage.removeItem('futpro_pending_actions');
      }
    } catch (error) {
      console.error('💥 Error crítico guardando:', error);
      // Restaurar acciones en caso de error crítico
      this.pendingActions.unshift(...actionsToProcess);
    }

    // Actualizar localStorage con acciones pendientes
    this.savePendingActions();
  }

  /**
   * 🔧 MÉTODOS AUXILIARES
   */
  generateActionId() {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    let sessionId = localStorage.getItem('futpro_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('futpro_session_id', sessionId);
    }
    return sessionId;
  }

  getSessionDuration() {
    const sessionStart = localStorage.getItem('futpro_session_start');
    if (sessionStart) {
      return Date.now() - parseInt(sessionStart);
    }
    return 0;
  }

  isCriticalAction(actionType) {
    const criticalActions = [
      'auth_login', 'auth_logout', 'form_submission', 
      'photo_upload', 'profile_action', 'payment'
    ];
    return criticalActions.includes(actionType);
  }

  detectFieldType(fieldName) {
    const fieldTypes = {
      email: 'email',
      password: 'password',
      telefono: 'phone',
      edad: 'number',
      foto: 'file'
    };
    return fieldTypes[fieldName] || 'text';
  }

  savePendingActions() {
    try {
      localStorage.setItem('futpro_pending_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Error guardando acciones pendientes:', error);
    }
  }

  loadPendingActions() {
    try {
      const saved = localStorage.getItem('futpro_pending_actions');
      if (saved) {
        this.pendingActions = JSON.parse(saved);
        console.log(`📦 Cargadas ${this.pendingActions.length} acciones pendientes`);
      }
    } catch (error) {
      console.error('Error cargando acciones pendientes:', error);
      this.pendingActions = [];
    }
  }

  /**
   * 📊 MÉTODOS DE ESTADÍSTICAS
   */
  getStats() {
    return {
      pendingActions: this.pendingActions.length,
      lastSave: this.lastSave,
      isOnline: this.isOnline,
      user: this.user?.email || 'anonymous',
      sessionId: this.getSessionId()
    };
  }

  /**
   * 🧹 CLEANUP
   */
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    // Limpiar todos los timers de debounce
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    
    // Procesar acciones pendientes finales
    this.processPendingActions(true);
  }
}

// Crear instancia global
const userActivityTracker = new UserActivityTracker();

export default userActivityTracker;