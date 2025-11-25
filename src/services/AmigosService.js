import { supabase } from '../config/supabase';
export class AmigosService {
  static async getAmigos(userId) {
    const { data, error } = await supabase.from('amigos').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  }
  static async agregarAmigo(userId, amigoId) {
    const { data, error } = await supabase.from('amigos').insert([{ user_id: userId, amigo_id: amigoId }]);
    if (error) throw error;
    return data;
  }
}
