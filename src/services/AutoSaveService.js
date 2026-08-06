/**
 * AUTO-SAVE SERVICE
 * Servicio de auto-guardado tipo redes sociales (Instagram/TikTok)
 * Guarda automáticamente cada 3 segundos
 */

class AutoSaveService {
  constructor() {
    this.saveInterval = 3000; // 3 segundos como redes sociales
    this.batchSize = 10;
    this.queue = [];
    this.isProcessing = false;
    this.lastSave = null;
    this._intervalId = null;
    
    // Iniciar auto-guardado automático
    this.startAutoSave();
  }

  /**
   * Agregar dato a la cola de auto-guardado
   */
  add(categoria, data, accion = 'crear') {
    const timestamp = new Date().toISOString();
    const userId = this.getUserId();
    
    const item = {
      categoria,
      data: { ...data, timestamp, userId, accion },
      queued: Date.now()
    };
    
    this.queue.push(item);
    console.log(`📝 AutoSave: Agregado a cola - ${categoria}`, item);

    // Si la cola está llena, guardar inmediatamente
    if (this.queue.length >= this.batchSize) {
      this.processBatch();
    }

    return item;
  }

  /**
   * Iniciar proceso automático
   */
  startAutoSave() {
    // FP-MEM-001: un solo interval; evitar fugas al re-iniciar
    if (this._intervalId) clearInterval(this._intervalId);
    this._intervalId = setInterval(() => {
      if (this.queue.length > 0 && !this.isProcessing) {
        this.processBatch();
      }
    }, this.saveInterval);
    
    console.log('✅ AutoSave: Iniciado (cada 3s)');
  }

  stopAutoSave() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Procesar lote de guardado
   */
  async processBatch() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      for (const item of batch) {
        await this.saveToStorage(item.categoria, item.data);
      }

      this.lastSave = new Date();
      console.log(`💾 AutoSave: Guardados ${batch.length} items`, this.lastSave);
      
      // Notificar guardado exitoso
      this.notifySuccess(batch.length);
      
    } catch (error) {
      console.error('❌ Error en auto-guardado:', error);
      // Re-agregar a la cola si falla
      this.queue.unshift(...batch);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Guardar en localStorage
   */
  async saveToStorage(categoria, data) {
    try {
      const key = `futpro_${categoria}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Evitar duplicados
      if (!Array.isArray(existing)) {
        existing = [];
      }
      
      existing.push(data);
      
      // Limitar tamaño (últimos 1000 items)
      const limited = existing.slice(-1000);
      
      localStorage.setItem(key, JSON.stringify(limited));
      
      // También guardar en historial completo
      this.saveToHistory(categoria, data);
      
      return true;
    } catch (error) {
      console.error(`Error guardando ${categoria}:`, error);
      throw error;
    }
  }

  /**
   * Guardar en historial completo
   */
  saveToHistory(categoria, data) {
    try {
      const historial = JSON.parse(localStorage.getItem('futpro_historial_completo') || '[]');
      historial.push({
        categoria,
        ...data,
        saved_at: new Date().toISOString()
      });
      
      // Últimos 5000 eventos
      const limited = historial.slice(-5000);
      localStorage.setItem('futpro_historial_completo', JSON.stringify(limited));
    } catch (e) {
      console.warn('Error en historial:', e);
    }
  }

  /**
   * Obtener ID de usuario
   */
  getUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('futpro_user') || '{}');
      if (!user.id) {
        user.id = 'user_' + Date.now();
        localStorage.setItem('futpro_user', JSON.stringify(user));
      }
      return user.id;
    } catch {
      return 'user_' + Date.now();
    }
  }

  /**
   * Notificar guardado exitoso
   */
  notifySuccess(count) {
    // Dispatch evento para UI
    window.dispatchEvent(new CustomEvent('autosave:success', {
      detail: { count, timestamp: this.lastSave }
    }));
  }

  /**
   * Obtener estado del servicio
   */
  getStatus() {
    return {
      queueSize: this.queue.length,
      isProcessing: this.isProcessing,
      lastSave: this.lastSave,
      saveInterval: this.saveInterval
    };
  }

  /**
   * Forzar guardado inmediato
   */
  async forceSave() {
    return this.processBatch();
  }

  /**
   * Limpiar cola
   */
  clearQueue() {
    this.queue = [];
    console.log('🗑️ AutoSave: Cola limpiada');
  }
}

// Instancia singleton
const autoSaveService = new AutoSaveService();

export default autoSaveService;
export { AutoSaveService };
