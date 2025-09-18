// src/services/rankingCampeonatosService.js
// Servicio para ranking de campeonatos con filtros

async function obtenerRankingCampeonatos(db, filtros = {}) {
  let query = db('campeonatos')
    .select([
      'campeonatos.*',
      db.raw('COUNT(participaciones.equipo_id) as equipos_participantes'),
      db.raw('COUNT(partidos.id) as total_partidos')
    ])
    .leftJoin('participaciones', 'campeonatos.id', 'participaciones.campeonato_id')
    .leftJoin('partidos', 'campeonatos.id', 'partidos.campeonato_id')
    .groupBy('campeonatos.id')
    .orderBy('campeonatos.ranking', 'desc');

  // Filtro por categoría
  if (filtros.categoria) {
    query = query.where('campeonatos.categoria', filtros.categoria);
  }

  // Filtro por estado (activo, finalizado, etc.)
  if (filtros.estado) {
    query = query.where('campeonatos.estado', filtros.estado);
  }

  // Filtro por fecha
  if (filtros.fechaInicio && filtros.fechaFin) {
    query = query.whereBetween('campeonatos.fecha_inicio', [filtros.fechaInicio, filtros.fechaFin]);
  }

  // Limitar resultados
  if (filtros.limite) {
    query = query.limit(filtros.limite);
  }

  return await query;
}

async function actualizarRankingCampeonato(db, campeonatoId) {
  const campeonato = await db('campeonatos').where({ id: campeonatoId }).first();
  if (!campeonato) return;

  // Obtener estadísticas del campeonato
  const stats = await db('campeonatos')
    .select([
      db.raw('COUNT(DISTINCT participaciones.equipo_id) as equipos_participantes'),
      db.raw('COUNT(DISTINCT partidos.id) as total_partidos'),
      db.raw('SUM(partidos.visualizaciones) as total_visualizaciones')
    ])
    .leftJoin('participaciones', 'campeonatos.id', 'participaciones.campeonato_id')
    .leftJoin('partidos', 'campeonatos.id', 'partidos.campeonato_id')
    .where('campeonatos.id', campeonatoId)
    .first();

  // Fórmula de ranking para campeonatos
  const ranking =
    (stats.equipos_participantes || 0) * 50 +
    (stats.total_partidos || 0) * 10 +
    (stats.total_visualizaciones || 0) * 1 +
    (campeonato.duracion_dias || 0) * 2;

  await db('campeonatos').where({ id: campeonatoId }).update({ ranking });
}

export { obtenerRankingCampeonatos, actualizarRankingCampeonato };