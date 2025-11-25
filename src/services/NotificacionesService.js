import { supabase } from '../config/supabase';
export class NotificacionesService {
  static async getNotificaciones(userId) {
    const { data, error } = await supabase.from('notificaciones').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  }
}
