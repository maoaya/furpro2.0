/**
 * PostService.js - Gestión de posts/publicaciones de usuarios
 * Maneja creación, lectura, actualización y eliminación de posts
 */

import { supabase } from '../config/supabase';

export class PostService {
  /**
   * Crear un nuevo post
   */
  static async createPost({ userId, content, imageUrl = null, videoUrl = null }) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          user_id: userId,
          content,
          image_url: imageUrl,
          video_url: videoUrl
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener todos los posts del usuario
   */
  static async getUserPosts(userId, limit = 20, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('posts')
        .select('*, usuarios!posts_user_id_fkey(nombre, apellido, avatar_url), post_likes(id), post_comments(id)', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: data.map(post => ({
          ...post,
          likes_count: post.post_likes.length,
          comments_count: post.post_comments.length
        })),
        total: count
      };
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener feed de posts (siguiendo)
   */
  static async getFeed(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, usuarios!posts_user_id_fkey(nombre, apellido, avatar_url), post_likes(id), post_comments(id)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        success: true,
        data: data.map(post => ({
          ...post,
          likes_count: post.post_likes.length,
          comments_count: post.post_comments.length,
          is_liked: post.post_likes.some(like => like.user_id === userId)
        }))
      };
    } catch (error) {
      console.error('Error fetching feed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar post
   */
  static async updatePost(postId, { content, imageUrl, videoUrl }) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          content,
          image_url: imageUrl,
          video_url: videoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar post (soft delete)
   */
  static async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_deleted: true })
        .eq('id', postId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Dar like a un post
   */
  static async likePost(postId, userId) {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .insert([{
          post_id: postId,
          user_id: userId
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Remover like de un post
   */
  static async unlikePost(postId, userId) {
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error unliking post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener likes de un post
   */
  static async getPostLikes(postId, limit = 10) {
    try {
      const { data, error, count } = await supabase
        .from('post_likes')
        .select('*, usuarios!post_likes_user_id_fkey(nombre, apellido, avatar_url)', { count: 'exact' })
        .eq('post_id', postId)
        .limit(limit);

      if (error) throw error;
      return { success: true, data, total: count };
    } catch (error) {
      console.error('Error fetching post likes:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Agregar comentario a post
   */
  static async addComment(postId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: userId,
          content
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener comentarios de un post
   */
  static async getPostComments(postId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, usuarios!post_comments_user_id_fkey(nombre, apellido, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar comentario
   */
  static async deleteComment(commentId) {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de un post
   */
  static async getPostStats(postId) {
    try {
      const likes = await supabase
        .from('post_likes')
        .select('id', { count: 'exact' })
        .eq('post_id', postId);

      const comments = await supabase
        .from('post_comments')
        .select('id', { count: 'exact' })
        .eq('post_id', postId);

      return {
        success: true,
        likes_count: likes.count || 0,
        comments_count: comments.count || 0
      };
    } catch (error) {
      console.error('Error fetching post stats:', error);
      return { success: false, error: error.message };
    }
  }
}
