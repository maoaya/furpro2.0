import { supabase } from '../config/supabase';
export class MarketplaceService {
  static async getProductos() {
    const { data, error } = await supabase.from('marketplace').select('*');
    if (error) throw error;
    return data;
  }
  static async crearProducto(producto) {
    const { data, error } = await supabase.from('marketplace').insert([producto]);
    if (error) throw error;
    return data;
  }
}
