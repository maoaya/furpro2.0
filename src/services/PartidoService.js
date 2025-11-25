import { supabase } from '../config/supabase';
export class PartidoService {
  static async getPartidos() {
    const { data, error } = await supabase.from('partidos').select('*');
    if (error) throw error;
    return data;
  }
}
