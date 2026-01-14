/**
 * 📡 STREAMING SERVICE - Sistema de Transmisión en Vivo
 * Gestión de streams, comentarios en vivo, espectadores
 */

import { supabase } from '../config/supabaseClient';

const VALID_PROVIDERS = [
  'youtube.com', 'youtu.be', 'kick.com', 'twitch.tv', 'facebook.com', 'obs',
];

class StreamingService {
  constructor() {
    // Fallback en memoria para desarrollo local
    this.localStreams = new Map();
  }

  /**
   * Iniciar transmisión en vivo
   */
  async startLiveStream(matchId, userId, streamTitle = null) {
    try {
      const streamId = `stream_${matchId}_${Date.now()}`;
      
      // Actualizar partido con ID de stream
      const { data: match, error } = await supabase
        .from('tournament_matches')
        .update({
          stream_id: streamId,
          is_streaming: true,
          stream_started_at: new Date().toISOString(),
          stream_host_id: userId
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;

      // Crear entrada en tabla live_streams si existe
      await supabase
        .from('live_streams')
        .insert({
          stream_id: streamId,
          match_id: matchId,
          host_id: userId,
          title: streamTitle || `Transmisión en vivo - Partido ${matchId.slice(0, 8)}`,
          status: 'active',
          viewer_count: 1
        })
        .catch(() => {}); // Ignorar si tabla no existe

      return { success: true, streamId, match };
    } catch (error) {
      console.error('Error starting stream:', error);
      throw error;
    }
  }

  /**
   * Finalizar transmisión en vivo
   */
  async stopLiveStream(matchId, streamId) {
    try {
      const { data: match, error } = await supabase
        .from('tournament_matches')
        .update({
          is_streaming: false,
          stream_ended_at: new Date().toISOString()
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado en live_streams
      await supabase
        .from('live_streams')
        .update({ status: 'completed' })
        .eq('stream_id', streamId)
        .catch(() => {});

      return { success: true, match };
    } catch (error) {
      console.error('Error stopping stream:', error);
      throw error;
    }
  }

  /**
   * Obtener información de transmisión
   */
  async getLiveStreamInfo(streamId) {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select(`
          *,
          match:match_id (
            id,
            home_team:home_team_id (name, logo_url),
            away_team:away_team_id (name, logo_url),
            status
          ),
          host:host_id (nombre, apellido, avatar_url)
        `)
        .eq('stream_id', streamId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting stream info:', error);
      return null;
    }
  }

  /**
   * Obtener todas las transmisiones activas
   */
  async getActiveStreams() {
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          id,
          stream_id,
          tournament:tournament_id (name, category),
          home_team:home_team_id (name, logo_url),
          away_team:away_team_id (name, logo_url),
          score_home,
          score_away,
          stream_started_at,
          stream_host:stream_host_id (nombre, apellido, avatar_url)
        `)
        .eq('is_streaming', true)
        .order('stream_started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting active streams:', error);
      return [];
    }
  }

  /**
   * Incrementar contador de espectadores
   */
  async incrementViewerCount(streamId) {
    try {
      const { data: stream } = await supabase
        .from('live_streams')
        .select('viewer_count')
        .eq('stream_id', streamId)
        .single();

      if (!stream) return;

      const newCount = (stream.viewer_count || 0) + 1;
      await supabase
        .from('live_streams')
        .update({ viewer_count: newCount })
        .eq('stream_id', streamId);
    } catch (error) {
      console.error('Error incrementing viewers:', error);
    }
  }

  /**
   * Decrementar contador de espectadores
   */
  async decrementViewerCount(streamId) {
    try {
      const { data: stream } = await supabase
        .from('live_streams')
        .select('viewer_count')
        .eq('stream_id', streamId)
        .single();

      if (!stream) return;

      const newCount = Math.max(0, (stream.viewer_count || 1) - 1);
      await supabase
        .from('live_streams')
        .update({ viewer_count: newCount })
        .eq('stream_id', streamId);
    } catch (error) {
      console.error('Error decrementing viewers:', error);
    }
  }

  /**
   * Verificar si un partido requiere transmisión
   */
  async checkStreamingRequirement(matchId) {
    try {
      const { data: match } = await supabase
        .from('tournament_matches')
        .select('tournament_id')
        .eq('id', matchId)
        .single();

      if (!match) return { required: false, matchId };

      const { data: tournament } = await supabase
        .from('tournaments')
        .select('is_live_required')
        .eq('id', match.tournament_id)
        .single();

      return {
        required: tournament?.is_live_required || false,
        matchId
      };
    } catch (error) {
      console.error('Error checking streaming requirement:', error);
      return { required: false, matchId };
    }
  }

  /**
   * Registrar comentario en vivo
   */
  async postLiveComment(streamId, userId, comment) {
    try {
      const { data, error } = await supabase
        .from('stream_comments')
        .insert({
          stream_id: streamId,
          user_id: userId,
          content: comment,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  }

  /**
   * Obtener comentarios en vivo
   */
  async getLiveComments(streamId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('stream_comments')
        .select(`
          *,
          user:user_id (
            nombre,
            apellido,
            avatar_url
          )
        `)
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }

  /**
   * Validar URL de streaming
   */
  validateStreamUrl(url) {
    try {
      const u = new URL(url);
      return VALID_PROVIDERS.some(domain => u.hostname.includes(domain));
    } catch {
      return url === 'obs';
    }
  }

  /**
   * Obtener proveedor desde URL
   */
  getProviderFromUrl(url) {
    if (url === 'obs') return 'obs';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) return 'youtube';
      if (u.hostname.includes('kick.com')) return 'kick';
      if (u.hostname.includes('twitch.tv')) return 'twitch';
      if (u.hostname.includes('facebook.com')) return 'facebook';
      return 'otro';
    } catch {
      return 'otro';
    }
  }

  /**
   * Suscribirse a cambios en vivo (Realtime)
   */
  subscribeToLiveStream(streamId, onUpdate) {
    const channel = supabase.channel(`stream-${streamId}`);

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'live_streams',
        filter: `stream_id=eq.${streamId}`
      },
      (payload) => {
        onUpdate(payload);
      }
    ).subscribe();

    return () => supabase.removeChannel(channel);
  }

  /**
   * Obtener estadísticas de stream
   */
  async getStreamStats(streamId) {
    try {
      const { data: stream } = await supabase
        .from('live_streams')
        .select('viewer_count, created_at, status')
        .eq('stream_id', streamId)
        .single();

      const { count: totalComments } = await supabase
        .from('stream_comments')
        .select('*', { count: 'exact', head: true })
        .eq('stream_id', streamId);

      const durationMs = stream?.created_at 
        ? Date.now() - new Date(stream.created_at).getTime()
        : 0;

      return {
        streamId,
        viewerCount: stream?.viewer_count || 0,
        totalComments: totalComments || 0,
        durationMinutes: Math.floor(durationMs / 60000),
        status: stream?.status || 'unknown'
      };
    } catch (error) {
      console.error('Error getting stream stats:', error);
      return null;
    }
  }
}

export const streamingService = new StreamingService();
