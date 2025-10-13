/**
 * 🔥 INICIALIZADOR AUTOMÁTICO DEL SISTEMA DE TRACKING
 * Se auto-ejecuta al cargar la aplicación
 */

import userActivityTracker from './UserActivityTracker.js';
import { getConfig } from '../config/environment.js';

class TrackingInitializer {
  constructor() {
    this.initialized = false;
    this.config = null;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.config = getConfig();
      
      console.log('🔥 Inicializando sistema de tracking...');
      
      // Verificar si el tracking está habilitado
      if (!this.config.tracking?.enabled) {
        console.log('⚠️ Tracking deshabilitado en configuración');
        return;
      }

      // Establecer configuración del tracker
      userActivityTracker.isOnline = navigator.onLine;
      
      // Track inicialización del sistema
      userActivityTracker.trackAction('system_init', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100),
        url: window.location.href,
        referrer: document.referrer,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }, true);

      // Configurar eventos globales
      this.setupGlobalTracking();
      
      // Track page load inicial
      userActivityTracker.trackPageView(window.location.pathname, document.referrer);
      
      this.initialized = true;
      console.log('✅ Sistema de tracking inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando tracking:', error);
    }
  }

  setupGlobalTracking() {
    // Track errores globales
    window.addEventListener('error', (event) => {
      userActivityTracker.trackAction('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack?.substring(0, 500),
        timestamp: new Date().toISOString()
      }, true);
    });

    // Track errores de promesas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
      userActivityTracker.trackAction('unhandled_promise_rejection', {
        reason: event.reason?.toString().substring(0, 500),
        timestamp: new Date().toISOString()
      }, true);
    });

    // Track cambios de URL (para SPAs)
    let currentUrl = window.location.href;
    const urlChangeObserver = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        userActivityTracker.trackPageView(window.location.pathname, document.referrer);
      }
    });
    
    urlChangeObserver.observe(document, { subtree: true, childList: true });

    // Track clicks en elementos importantes
    document.addEventListener('click', (event) => {
      const target = event.target;
      
      // Solo trackear clicks en botones, links y elementos interactivos
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.role === 'button' ||
          target.type === 'submit' ||
          target.classList.contains('clickable')) {
        
        const buttonText = target.textContent?.trim().substring(0, 50) || 
                          target.value?.substring(0, 50) || 
                          target.alt?.substring(0, 50) || 
                          'unknown';
        
        userActivityTracker.trackButtonClick(
          target.tagName.toLowerCase(),
          buttonText,
          {
            className: target.className,
            id: target.id,
            url: window.location.pathname
          }
        );
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
        
        if (scrollPercentage > maxScrollDepth && scrollPercentage % 25 === 0) {
          maxScrollDepth = scrollPercentage;
          userActivityTracker.trackScrollDepth(scrollPercentage, window.location.pathname);
        }
      }, 100);
    }, { passive: true });

    // Track tiempo en página
    let pageStartTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - pageStartTime;
      userActivityTracker.trackAction('page_time', {
        page: window.location.pathname,
        timeSpent: timeOnPage,
        timestamp: new Date().toISOString()
      }, true);
    });

    // Track visibilidad de página (como Instagram)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        userActivityTracker.trackAction('page_hidden', {
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        });
      } else {
        userActivityTracker.trackAction('page_visible', {
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        });
        pageStartTime = Date.now(); // Reset timer
      }
    });

    // Track conexión/desconexión
    window.addEventListener('online', () => {
      userActivityTracker.isOnline = true;
      userActivityTracker.trackAction('connection_restored', {
        timestamp: new Date().toISOString()
      }, true);
    });

    window.addEventListener('offline', () => {
      userActivityTracker.isOnline = false;
      userActivityTracker.trackAction('connection_lost', {
        timestamp: new Date().toISOString()
      }, true);
    });
  }

  // Método para establecer usuario cuando se loguee
  setUser(user) {
    if (this.initialized) {
      userActivityTracker.setUser(user);
      
      // Track que el usuario fue establecido
      userActivityTracker.trackAction('user_session_established', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      }, true);
    }
  }

  // Método para obtener estadísticas
  getStats() {
    return userActivityTracker.getStats();
  }

  // Método para limpiar al logout
  cleanup() {
    userActivityTracker.trackAction('user_session_ended', {
      timestamp: new Date().toISOString()
    }, true);
  }
}

// Crear instancia global pero NO auto-inicializar para evitar efectos secundarios en importación
const trackingInitializer = new TrackingInitializer();

export default trackingInitializer;