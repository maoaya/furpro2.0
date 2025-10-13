/**
 * 🚀 INICIALIZADOR DEL SISTEMA DE TRACKING
 * Se ejecuta automáticamente al cargar la aplicación
 */

import userActivityTracker from './services/UserActivityTracker.js';
import { getConfig } from './config/environment.js';

class FutProTrackingInitializer {
  constructor() {
    this.initialized = false;
    this.config = null;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🔥 Inicializando sistema de tracking FutPro...');
      
      // Obtener configuración
      this.config = getConfig();
      
      // Verificar que estamos en el navegador
      if (this.config.isNode) {
        console.log('⚠️ Tracking no disponible en servidor');
        return;
      }

      // Configurar tracking según el entorno
      if (this.config.tracking?.enabled) {
        console.log('📊 Configurando tracking automático...');
        
        // Establecer configuraciones del tracker
        userActivityTracker.autoSaveInterval = this.config.tracking.autoSaveInterval || 3000;
        userActivityTracker.batchSize = this.config.tracking.batchSize || 10;
        userActivityTracker.retryAttempts = this.config.tracking.retryAttempts || 3;
        
        // Track inicialización de la app
        userActivityTracker.trackAction('app_initialization', {
          timestamp: new Date().toISOString(),
          environment: this.config.isProduction ? 'production' : 'development',
          url: window.location.href,
          userAgent: navigator.userAgent.substring(0, 100),
          screen: {
            width: window.screen.width,
            height: window.screen.height
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }, false);

        console.log('✅ Sistema de tracking inicializado correctamente');
      } else {
        console.log('⚠️ Tracking deshabilitado en configuración');
      }

      this.initialized = true;
      
      // Event listener para cleanup al cerrar
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });

    } catch (error) {
      console.error('❌ Error inicializando tracking:', error);
    }
  }

  cleanup() {
    if (userActivityTracker && typeof userActivityTracker.destroy === 'function') {
      userActivityTracker.destroy();
    }
  }

  // Método para verificar si el tracking está funcionando
  getStatus() {
    return {
      initialized: this.initialized,
      tracker: userActivityTracker ? userActivityTracker.getStats() : null,
      config: this.config
    };
  }
}

// Crear instancia global
const trackingInitializer = new FutProTrackingInitializer();

// Nota: no auto-inicializar en import para evitar bloquear el primer render. Se inicializa explícitamente desde main/AuthContext.

export default trackingInitializer;