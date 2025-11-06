// 📊 Funciones de base de datos
// (Eliminado el bloque duplicado de dbOperations para evitar la redeclaración)

 // 🗄️ Configuración de Supabase para FutPro
// ⚠️ DEPRECADO: Usar src/supabaseClient.js en su lugar para evitar instancias duplicadas

// Re-exportar la instancia única desde supabaseClient.js
export { default as supabase, supabaseConfigured } from '../supabaseClient.js';
export { default } from '../supabaseClient.js';

// Utilidad para obtener variables de entorno con fallback
export function getEnv(key, fallback = '') {
  // Preferir import.meta.env en cliente (Vite) y caer a process.env en server
  const viteVal = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) ||
                  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env['VITE_' + key])
  const nodeVal = typeof process !== 'undefined' ? process.env[key] : undefined;
  return viteVal || nodeVal || fallback;
}

// Pequeña utilidad para detectar si el endpoint de Supabase está alcanzable desde el cliente.
// Evita tormentas de errores cuando hay problemas de DNS/red del usuario.
export async function detectSupabaseOnline(timeoutMs = 4000) {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    // health endpoint público (puede devolver opaque en no-cors, nos basta que no explote)
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/health`;
    await fetch(url, { method: 'GET', mode: 'no-cors', signal: controller.signal });
    clearTimeout(t);
    if (typeof window !== 'undefined') window.__SUPABASE_ONLINE__ = true;
    return true;
  } catch (_) {
    if (typeof window !== 'undefined') window.__SUPABASE_ONLINE__ = false;
    return false;
  }
}

// 🔐 Configuración de autenticación
export const authConfig = {
  providers: ['google', 'facebook'],
  // Para Supabase email flows (registro/reset), usar la callback de Supabase o tu dominio
  // Sugerido: URL de callback de Supabase (no del dominio) para evitar redirect_uri_mismatch
  redirectTo: SUPABASE_URL && SUPABASE_URL !== 'https://TU_SUPABASE_URL.supabase.co'
    ? `${SUPABASE_URL}/auth/v1/callback`
    : (typeof window !== 'undefined' ? window.location.origin : ''),
  scopes: {
    google: 'email profile',
    facebook: 'email,public_profile'
  }
}

// ...existing code...

// 📊 Funciones de base de datos
export const dbOperations = {
  // � Seguidores/Seguidos
  async getUserFollowers(userId) {
    const { data, error } = await supabase
      .from('followers')
      .select('follower_id, users:follower_id(id, name, avatar_url)')
      .eq('followed_id', userId);
    if (error) throw error;
    return data.map(f => f.users);
  },

  async getUserFollowing(userId) {
    const { data, error } = await supabase
      .from('followers')
      .select('followed_id, users:followed_id(id, name, avatar_url)')
      .eq('follower_id', userId);
    if (error) throw error;
    return data.map(f => f.users);
  },

  async isFollowing(followerId, followedId) {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('followed_id', followedId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async addFollower(followerId, followedId) {
    const { data, error } = await supabase
      .from('followers')
      .insert([{ follower_id: followerId, followed_id: followedId }]);
    if (error) throw error;
    return data;
  },

  async removeFollower(followerId, followedId) {
    const { data, error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('followed_id', followedId);
    if (error) throw error;
    return data;
  },
  // �👤 Usuarios
  async createUser(userData) {
    // Validación avanzada
    if (!userData.email || !userData.name) throw new Error("Email y nombre son obligatorios");
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    if (error) throw new Error(`Error creando usuario: ${error.message}`);
    return data[0];
  },

  async getUserById(id) {
    if (!id) throw new Error("ID de usuario requerido");
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(`Error obteniendo usuario: ${error.message}`);
    return data;
  },

  async updateUserProfile(id, updates) {
    if (!id) throw new Error("ID de usuario requerido");
    if (!updates || Object.keys(updates).length === 0) throw new Error("No hay datos para actualizar");
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw new Error(`Error actualizando perfil: ${error.message}`);
    return data[0];
  },

  // Subir avatar de usuario
  async uploadAvatar(userId, file) {
    if (!userId || !file) throw new Error("Usuario y archivo requeridos");
    const fileName = `avatars/${userId}_${Date.now()}.${file.name.split('.').pop()}`;
  const { error } = await supabase.storage.from('avatars').upload(fileName, file);
  if (error) throw new Error(`Error subiendo avatar: ${error.message}`);
    const url = supabase.storage.from('avatars').getPublicUrl(fileName).publicUrl;
    // Actualizar perfil con URL de avatar
    await dbOperations.updateUserProfile(userId, { avatar_url: url });
    return url;
  },

  // Buscar usuarios por nombre
  async searchUsersByName(name) {
    if (!name || name.length < 2) throw new Error("Nombre demasiado corto");
    const { error } = await supabase
      .from('users')
      .select('*')
      .ilike('name', `%${name}%`);
    if (error) throw new Error(`Error buscando usuarios: ${error.message}`);
    return [];
  },

  // Enviar notificación push
  async sendPushNotification(userId, title, body) {
    if (!userId || !title || !body) throw new Error("Datos incompletos para notificación");
    // Buscar token push del usuario
    const { data, error } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', userId)
      .single();
    if (error) throw new Error(`Error obteniendo token push: ${error.message}`);
    if (!data || !data.token) throw new Error("Usuario sin token push registrado");
    // Aquí deberías integrar con tu servicio de notificaciones (ej: Firebase Cloud Messaging)
    // Ejemplo: await sendFCM(data.token, title, body);
    return { success: true, token: data.token };
  },

  // Validar token de sesión
  async validateSessionToken(token) {
    if (!token) throw new Error("Token requerido");
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw new Error(`Token inválido: ${error.message}`);
    return data;
  },

  async searchUsers(query, filters = {}) {
    let queryBuilder = supabase
      .from('users')
      .select('id, name, avatar_url, position, user_type, stats')
      .ilike('name', `%${query}%`)
    if (filters.userType) {
      queryBuilder = queryBuilder.eq('user_type', filters.userType)
    }
    if (filters.position) {
      queryBuilder = queryBuilder.eq('position', filters.position)
    }
    const { data, error } = await queryBuilder.limit(20)
    if (error) throw error
    return data
  },

  // 👥 Equipos
  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getTeamsByUser(userId) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('captain_id', userId)
    if (error) throw error
    return data
  },

  async joinTeam(teamId, playerId) {
    const { data, error } = await supabase
      .rpc('join_team', { team_id: teamId, player_id: playerId })
    if (error) throw error
    return data
  },

  // 🏆 Torneos
  async createTournament(tournamentData) {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([tournamentData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getTournaments(filters = {}) {
    let queryBuilder = supabase
      .from('tournaments')
      .select('*, organizer:organizer_id(name, avatar_url)')
      .order('created_at', { ascending: false })
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status)
    }
    if (filters.type) {
      queryBuilder = queryBuilder.eq('tournament_type', filters.type)
    }
    const { data, error } = await queryBuilder.limit(20)
    if (error) throw error
    return data
  },

  async registerTeamInTournament(tournamentId, teamId) {
    const { data, error } = await supabase
      .rpc('register_team_tournament', { 
        tournament_id: tournamentId, 
        team_id: teamId 
      })
    if (error) throw error
    return data
  },

  // ⚽ Partidos
  async createMatch(matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getMatches(filters = {}) {
    let queryBuilder = supabase
      .from('matches')
      .select(`
        *,
        team1:team1_id(name, logo_url),
        team2:team2_id(name, logo_url),
        tournament:tournament_id(name),
        referee:referee_id(name)
      `)
      .order('match_date', { ascending: true })
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status)
    }
    if (filters.tournamentId) {
      queryBuilder = queryBuilder.eq('tournament_id', filters.tournamentId)
    }
    const { data, error } = await queryBuilder.limit(50)
    if (error) throw error
    return data
  },

  async updateMatchScore(matchId, team1Score, team2Score, stats = {}) {
    const { data, error } = await supabase
      .from('matches')
      .update({
        team1_score: team1Score,
        team2_score: team2Score,
        stats: stats,
        status: 'finished',
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .select()
    if (error) throw error
    return data[0]
  },

  // 📝 Posts y Social
  async createPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:user_id(name, avatar_url, user_type)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return data
  },

  async likePost(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }])
      .select()
    if (error) throw error
    return data[0]
  },

  async unlikePost(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    if (error) throw error
    return data
  },

  // 💬 Comentarios
  async addComment(commentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_id(name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },

  // 🔔 Notificaciones
  async createNotification(notificationData) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getNotifications(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data
  },

  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
    if (error) throw error
    return data[0]
  },

  async updateUserRole(userId, role) {
    return await supabase.from('users').update({ user_type: role }).eq('id', userId);
  }
}

// 📂 Gestión de archivos
export const storageOperations = {
  async uploadAvatar(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })
    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    return urlData.publicUrl
  },

  async uploadTeamLogo(file, teamId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${teamId}/logo.${fileExt}`
    const { error } = await supabase.storage
      .from('team-logos')
      .upload(fileName, file, { upsert: true })
    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('team-logos')
      .getPublicUrl(fileName)
    return urlData.publicUrl
  },

  async uploadPostMedia(file, postId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${postId}/media.${fileExt}`
    const { error } = await supabase.storage
      .from('post-media')
      .upload(fileName, file)
    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('post-media')
      .getPublicUrl(fileName)
    return urlData.publicUrl
  }
}

// 🔄 Suscripciones en tiempo real
export const realtimeSubscriptions = {
  subscribeToMatches(callback) {
    return supabase
      .channel('matches')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'matches' 
        }, 
        callback
      )
      .subscribe()
  },

  subscribeToNotifications(userId, callback) {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  },

  subscribeToChat(chatId, callback) {
    return supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, 
        callback
      )
      .subscribe()
  },

  unsubscribe(subscription) {
    if (subscription) {
      subscription.unsubscribe()
    }
  }
}


