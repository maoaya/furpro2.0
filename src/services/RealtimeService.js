/**
 * REALTIME SERVICE
 * Servicio de sincronización en tiempo real con Supabase Realtime
 */

import supabase from '../supabaseClient.js';

class RealtimeService {
  constructor() {
    this.subscriptions = new Map();
    this.callbacks = new Map();
    this.isInitialized = false;
  }

  /**
   * Inicializar servicio realtime
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔄 RealtimeService: Inicializando...');
      
      // Verificar conexión a Supabase
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.warn('⚠️ Sesión no activa, realtime limitado');
      }

      this.isInitialized = true;
      console.log('✅ RealtimeService: Inicializado');
    } catch (error) {
      console.error('❌ Error inicializando realtime:', error);
    }
  }

  /**
   * Suscribirse a cambios en una tabla
   */
  subscribe(tableName, callback, filters = {}) {
    if (!this.isInitialized) {
      this.initialize();
    }

    // FP-MEM-001: nombre estable (evitar proliferar channels con Date.now)
    const filterKey = JSON.stringify(filters || {});
    const channelName = `${tableName}_${filterKey}`.slice(0, 120);

    // Reutilizar si ya existe
    if (this.subscriptions.has(channelName)) {
      this.callbacks.set(channelName, callback);
      return channelName;
    }

    try {
      let channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            ...filters
          },
          (payload) => {
            console.log(`📡 Realtime ${tableName}:`, payload);
            callback(payload);
          }
        )
        .subscribe((status) => {
          console.log(`🔌 Canal ${channelName}: ${status}`);
        });

      this.subscriptions.set(channelName, channel);
      this.callbacks.set(channelName, callback);

      console.log(`✅ Suscrito a: ${tableName}`);
      return channelName;
      
    } catch (error) {
      console.error(`❌ Error suscribiendo a ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Desuscribirse de un canal
   */
  async unsubscribe(channelName) {
    const channel = this.subscriptions.get(channelName);
    if (channel) {
      await supabase.removeChannel(channel);
      this.subscriptions.delete(channelName);
      this.callbacks.delete(channelName);
      console.log(`❌ Desuscrito de: ${channelName}`);
    }
  }

  /**
   * Desuscribirse de todos los canales
   */
  async unsubscribeAll() {
    for (const [channelName, channel] of this.subscriptions) {
      await supabase.removeChannel(channel);
    }
    this.subscriptions.clear();
    this.callbacks.clear();
    console.log('🗑️ Todas las suscripciones eliminadas');
  }

  /**
   * Escuchar mensajes de chat en tiempo real
   */
  subscribeToChat(roomId, onMessage) {
    return this.subscribe('mensajes', onMessage, {
      filter: `room_id=eq.${roomId}`
    });
  }

  /**
   * Escuchar notificaciones en tiempo real
   */
  subscribeToNotifications(userId, onNotification) {
    return this.subscribe('notificaciones', onNotification, {
      filter: `user_id=eq.${userId}`
    });
  }

  /**
   * Escuchar actualizaciones de usuarios
   */
  subscribeToUser(userId, onUpdate) {
    return this.subscribe('usuarios', onUpdate, {
      filter: `id=eq.${userId}`
    });
  }

  /**
   * Escuchar transmisiones en vivo
   */
  subscribeToLiveStreams(onStream) {
    return this.subscribe('transmisiones', onStream, {
      filter: 'status=eq.live'
    });
  }

  /**
   * Broadcast de presencia (usuarios online)
   */
  async broadcastPresence(userId, status = 'online') {
    try {
      const channel = supabase.channel('presence');
      
      await channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('👥 Usuarios online:', Object.keys(state).length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: userId,
              status,
              online_at: new Date().toISOString()
            });
          }
        });

      this.subscriptions.set('presence', channel);
      return channel;
      
    } catch (error) {
      console.error('Error en presence:', error);
      return null;
    }
  }

  /**
   * Obtener estado del servicio
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      activeSubscriptions: this.subscriptions.size,
      channels: Array.from(this.subscriptions.keys())
    };
  }
}

// Instancia singleton
const realtimeService = new RealtimeService();

export default realtimeService;
export { RealtimeService };
