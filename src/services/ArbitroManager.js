// Servicio mock para árbitro
const ArbitroManager = {
  obtener: async (id) => ({ id, nombre: 'Árbitro' }),
};
export default ArbitroManager;
// Modelo de datos para árbitro
/**
 * @typedef {Object} Arbitro
 * @property {string} id
 * @property {string} nombre
 * @property {string} fotoUrl
 * @property {string} experiencia
 * @property {string[]} certificaciones
 * @property {string} contacto
 * @property {string[]} historialPartidos
 * @property {'activo'|'inactivo'} estado
 */

// Funciones CRUD básicas
export const crearArbitro = async () => {
  // Aquí iría la integración con Supabase/Firebase
  // return await supabase.from('arbitros').insert([arbitro]);
};

export const editarArbitro = async () => {
  // return await supabase.from('arbitros').update(cambios).eq('id', id);
};

export const eliminarArbitro = async () => {
  // return await supabase.from('arbitros').delete().eq('id', id);
};

export const listarArbitros = async () => {
  // return await supabase.from('arbitros').select('*');
};

export const obtenerArbitro = async () => {
  // return await supabase.from('arbitros').select('*').eq('id', id).single();
};
