/**
 * 🔥 SISTEMA DE TRACKING AVANZADO TIPO REDES SOCIALES
 * Autoguarda TODAS las acciones del usuario en tiempo real
 * Funciona como Facebook, Instagram, TikTok
 */

import supabase from '../supabaseClient';

class UserActivityTracker {
  constructor() {
    // 🛡️ PROTECCIÓN ENTORNO: Evitar acceso a APIs del navegador si no existen (tests backend/Node)
    const hasWindow = typeof window !== 'undefined';
    const hasLocalStorage = typeof localStorage !== 'undefined';
    const hasNavigator = typeof navigator !== 'undefined';

    // Inicializaciones seguras por defecto
    this.disabled = false;
    this.isOnline = hasNavigator ? !!navigator.onLine : false;
    this.pendingActions = [];
    this.lastSave = null;
    this.user = null;
    this.autoSaveInterval = null;
    this.debounceTimers = new Map();
    
    // Si estamos en entorno no navegador o en Jest/Node tests, deshabilitar el tracker
    const isJest = typeof process !== 'undefined' && (process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test');
    const isNodeRuntime = typeof window === 'undefined';
    if (!hasWindow || !hasLocalStorage || !hasNavigator || isJest || isNodeRuntime) {
      this.disabled = true;
      return;
    }

    // 🛡️ PROTECCIÓN: No inicializar si tracking está deshabilitado
    if (localStorage.getItem('futpro_tracking_disabled') === 'true') {
      console.warn('⚠️ UserActivityTracker deshabilitado por error de schema');
      this.disabled = true;
      return;
    }
    
    this.initializeTracker();
    this.setupEventListeners();
  }

  /**
   * 🚀 INICIALIZAR TRACKER
   */
  initializeTracker() {
    // Verificar si tracking está deshabilitado por errores previos
    if (localStorage.getItem('futpro_tracking_disabled') === 'true') {
      console.warn('⚠️ UserActivityTracker DESHABILITADO por errores previos de schema');
      return;
    }
    
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
    if (typeof window === 'undefined' || typeof document === 'undefined') return; // entorno no navegador
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
    // 🛡️ PROTECCIÓN: No trackear si está deshabilitado
    if (this.disabled) {
      return null;
    }

    const action = {
      id: this.generateActionId(),
      userId: this.user?.id || 'anonymous',
      actionType,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        url: (typeof window !== 'undefined' && window.location) ? window.location.pathname : '',
        userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.substring(0, 100) : 'node',
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
    if (this.disabled) {
      return;
    }
    if (!this.isOnline && !force) {
      console.log('📴 Sin conexión - Acciones en cola:', this.pendingActions.length);
      return;
    }

    if (this.pendingActions.length === 0) return;

    const actionsToProcess = [...this.pendingActions];
    this.pendingActions = [];

    console.log(`💾 Procesando ${actionsToProcess.length} acciones...`);

    try {
      // Intentar guardar primero en api.user_activities
      let result = await supabase
        .from('api.user_activities')
        .insert(actionsToProcess.map(action => ({
          id: action.id,
          user_id: action.userId,
          action_type: action.actionType,
          action_data: action.data,
          created_at: new Date(action.created).toISOString()
        })));

      let error = result.error;

      // Si falla api.user_activities por schema/tabla inexistente, intentar con public.user_activities
      if (error && (error.code === 'PGRST106' || error.code === '42P01')) {
        console.warn('⚠️ api.user_activities no existe, intentando public.user_activities');
        result = await supabase
          .from('user_activities')
          .insert(actionsToProcess.map(action => ({
            id: action.id,
            user_id: action.userId,
            action_type: action.actionType,
            action_data: action.data,
            created_at: new Date(action.created).toISOString()
          })));
        error = result.error;
      }

      if (error) {
        console.error('❌ Error guardando actividades:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          table: 'user_activities (ambos schemas)'
        });

        // Si el error es de schema/tabla no existe después de ambos intentos, deshabilitar tracking
        if (error.code === 'PGRST106' || error.code === '42P01') {
          console.warn('⚠️ TRACKING DESHABILITADO: Tabla user_activities no existe en ningún schema');
          localStorage.setItem('futpro_tracking_disabled', 'true');
          this.pendingActions = []; // Limpiar cola
          clearInterval(this.autoSaveInterval); // Detener auto-save
          this.disabled = true;
          return;
        }

        // Volver a añadir a la cola con incremento de intentos (solo para otros errores)
        actionsToProcess.forEach(action => { action.attempts += 1; });
        // Restaurar acciones en caso de error
        this.pendingActions.unshift(...actionsToProcess);
      } else {
        console.log(`✅ Acciones guardadas: ${actionsToProcess.length}`);
        this.lastSave = new Date().toISOString();
      }
    } catch (err) {
      console.error('💥 Error crítico guardando:', err);
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
    if (typeof localStorage === 'undefined') return 'session_test_env';
    let sessionId = localStorage.getItem('futpro_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('futpro_session_id', sessionId);
    }
    return sessionId;
  }

  getSessionDuration() {
    if (typeof localStorage === 'undefined') return 0;
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
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('futpro_pending_actions', JSON.stringify(this.pendingActions));
      }
    } catch (error) {
      console.error('Error guardando acciones pendientes:', error);
    }
  }

  loadPendingActions() {
    try {
      if (typeof localStorage === 'undefined') return;
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
    try {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
      
      // Limpiar todos los timers de debounce con protección
      if (this.debounceTimers && typeof this.debounceTimers.forEach === 'function') {
        this.debounceTimers.forEach(timer => {
          if (timer) clearTimeout(timer);
        });
        this.debounceTimers.clear();
      }
      
      // Procesar acciones pendientes finales
      if (!this.disabled && this.processPendingActions) {
        this.processPendingActions(true);
      }
    } catch (error) {
      console.error('Error en cleanup del tracker:', error);
    }
  }

  /**
   * 🔁 INTENTO MANUAL DE REACTIVACIÓN
   * Permite reactivar el tracking si el schema ya fue corregido en Supabase.
   * Uso desde consola: window.futproReactivateTracking()
   */
  async reactivateIfSchemaOk() {
    if (!this.disabled) {
      console.info('ℹ️ Tracking ya está activo. No se requiere reactivación.');
      return false;
    }
    try {
      // Consulta mínima para verificar que el schema ya no devuelve PGRST106
      const { data, error } = await supabase
        .from('user_activities')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST106') {
          console.warn('⛔ Schema aún inválido (PGRST106). Manteniendo tracking deshabilitado.');
          return false;
        }
        console.warn('⚠️ Error al verificar schema, no se reactiva:', error.message);
        return false;
      }

      console.log('✅ Schema OK. Reactivando UserActivityTracker...');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('futpro_tracking_disabled');
      }
      this.disabled = false;
      this.initializeTracker();
      return true;
    } catch (e) {
      console.warn('⚠️ Fallo en verificación de schema para reactivar:', e.message);
      return false;
    }
  }

  /**
   * 🧪 Forzar reactivación sin comprobar schema (debug)
   */
  forceReactivate() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('futpro_tracking_disabled');
    }
    this.disabled = false;
    this.initializeTracker();
    console.log('🔧 Reactivación forzada ejecutada.');
    return true;
  }
}

// Crear instancia global
const userActivityTracker = new UserActivityTracker();

// Exponer helper global para facilitar pruebas desde DevTools
if (typeof window !== 'undefined') {
  window.futproReactivateTracking = () => userActivityTracker.reactivateIfSchemaOk();
  window.futproForceReactivateTracking = () => userActivityTracker.forceReactivate();
}

export default userActivityTracker;