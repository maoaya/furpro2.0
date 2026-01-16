/**
 * StoryService.js - Gestión de historias de usuarios (Stories)
 * Similar a Facebook/Instagram stories con TTL de 24 horas
 */

import { supabase } from '../config/supabase';

export class StoryService {
  /**
   * Crear una nueva historia
   */
  static async createStory({ userId, imageUrl, caption = null }) {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { data, error } = await supabase
        .from('user_stories')
        .insert([{
          user_id: userId,
          image_url: imageUrl,
          caption,
          expires_at: expiresAt.toISOString()
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating story:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener historias de un usuario
   */
  static async getUserStories(userId) {
    try {
      const { data, error } = await supabase
        .from('user_stories')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user stories:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener todas las historias activas (para feed)
   */
  static async getActiveStories(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('user_stories')
        .select('*, usuarios!user_stories_user_id_fkey(nombre, apellido, avatar_url), story_views(id)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data.map(story => ({
          ...story,
          views_count: story.story_views.length
        }))
      };
    } catch (error) {
      console.error('Error fetching active stories:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Marcar historia como visualizada
   */
  static async viewStory(storyId, viewerId) {
    try {
      const { data, error } = await supabase
        .from('story_views')
        .insert([{
          story_id: storyId,
          viewer_user_id: viewerId
        }])
        .select();

      if (error && error.code !== '23505') throw error; // Ignorar duplicados
      return { success: true };
    } catch (error) {
      console.error('Error marking story as viewed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuarios que vieron una historia
   */
  static async getStoryViewers(storyId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('story_views')
        .select('*, usuarios!story_views_viewer_user_id_fkey(nombre, apellido, avatar_url)')
        .eq('story_id', storyId)
        .order('viewed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching story viewers:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar una historia
   */
  static async deleteStory(storyId) {
    try {
      const { error } = await supabase
        .from('user_stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting story:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subir imagen a Storage para historia
   */
  static async uploadStoryImage(file, userId) {
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from('stories')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName);

      return { success: true, url: urlData.publicUrl, path: data.path };
    } catch (error) {
      console.error('Error uploading story image:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar historias expiradas (ejecutar periódicamente)
   */
  static async cleanExpiredStories() {
    try {
      const { error } = await supabase
        .rpc('clean_expired_stories');

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error cleaning expired stories:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener contador de nuevas historias para el usuario
   */
  static async getNewStoriesCount(userId, lastCheckTime) {
    try {
      const { count, error } = await supabase
        .from('user_stories')
        .select('id', { count: 'exact' })
        .gt('created_at', lastCheckTime)
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Error getting new stories count:', error);
      return { success: false, error: error.message };
    }
  }
}
