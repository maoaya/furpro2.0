// Servicio mock para calificación de árbitro
const CalificacionArbitroManager = {
  calificar: async () => true,
};
export default CalificacionArbitroManager;
// Modelo de datos para calificación de árbitro
/**
 * @typedef {Object} CalificacionArbitro
 * @property {string} id
 * @property {string} arbitroId
 * @property {string} torneoId
 * @property {{ jugadorId: string, calificacion: number }[]} jugadorCalificaciones
 * @property {{ equipoId: string, calificacion: number }[]} equipoCalificaciones
 * @property {{ organizadorId: string, calificacion: number }} organizadorCalificacion
 * @property {string} fecha
 */

// Función para guardar calificación en Supabase/Firebase
export const guardarCalificacionArbitro = async () => {
  // return await supabase.from('calificaciones_arbitro').insert([calificacion]);
};

// Función para obtener jugadores/equipos/organizador de un torneo
export const obtenerDatosTorneo = async () => {
  // return await supabase.from('torneos').select('*').eq('id', torneoId).single();
};
