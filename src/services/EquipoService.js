import { supabase } from '../config/supabase';
export class EquipoService {
  static async getEquipos() {
    const { data, error } = await supabase.from('equipos').select('*');
    if (error) throw error;
    return data;
  }
}
