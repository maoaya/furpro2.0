// src/services/rankingJugadoresService.js
// Servicio para ranking de jugadores con filtros avanzados

async function obtenerRankingJugadores(db, filtros = {}) {
  let query = db('jugadores')
    .select([
      'jugadores.*',
      'equipos.nombre as equipo_nombre',
      'equipos.categoria as equipo_categoria'
    ])
    .leftJoin('equipos', 'jugadores.equipo_id', 'equipos.id')
    .orderBy('jugadores.ranking', 'desc');

  // Filtro por categoría
  if (filtros.categoria) {
    query = query.where('equipos.categoria', filtros.categoria);
  }

  // Filtro por edad
  if (filtros.edadMin && filtros.edadMax) {
    query = query.whereBetween('jugadores.edad', [filtros.edadMin, filtros.edadMax]);
  } else if (filtros.edadMin) {
    query = query.where('jugadores.edad', '>=', filtros.edadMin);
  } else if (filtros.edadMax) {
    query = query.where('jugadores.edad', '<=', filtros.edadMax);
  }

  // Filtro por equipo específico
  if (filtros.equipoId) {
    query = query.where('jugadores.equipo_id', filtros.equipoId);
  }

  // Filtro por equipos múltiples
  if (filtros.equipos && filtros.equipos.length > 0) {
    query = query.whereIn('jugadores.equipo_id', filtros.equipos);
  }

  // Limitar resultados
  if (filtros.limite) {
    query = query.limit(filtros.limite);
  }

  return await query;
}

async function actualizarRankingJugador(db, jugadorId) {
  const jugador = await db('jugadores').where({ id: jugadorId }).first();
  if (!jugador) return;

  // Fórmula de ranking para jugadores
  const ranking =
    (jugador.goles || 0) * 10 +
    (jugador.asistencias || 0) * 5 +
    (jugador.partidos_jugados || 0) * 2 +
    (jugador.minutos_jugados || 0) * 0.1 +
    (jugador.tarjetas_amarillas || 0) * -2 +
    (jugador.tarjetas_rojas || 0) * -10;

  await db('jugadores').where({ id: jugadorId }).update({ ranking });
}

export { obtenerRankingJugadores, actualizarRankingJugador };