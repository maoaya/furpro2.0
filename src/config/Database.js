// Adaptador mínimo de Base de Datos para NotificationManager
// Mapea a operaciones de Supabase existentes
import { supabase } from '../lib/supabase'

export class Database {
  constructor() {
    this.currentUser = null
  }

  async init() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (!error && user) this.currentUser = user
    } catch (e) {
      // opcional
    }
  }

  // Notificaciones: usar tabla 'notifications' en schema api
  async getUserNotifications(userId) {
    const uid = userId || this.currentUser?.id
    if (!uid) return []
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data || []
  }

  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
    if (error) throw error
    return data?.[0]
  }
}
