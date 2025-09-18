import { supabase } from '../config/supabase.js';

export const obtenerPartidosPorArbitro = async (arbitroId) => {
  // Consulta a la base de datos para obtener partidos donde arbitroId esté asignado
  // Ejemplo con Supabase:
  const { data, error } = await supabase
    .from('partidos')
    .select('*')
    .eq('arbitroId', arbitroId);
  if (error) return [];
  return data || [];
};
