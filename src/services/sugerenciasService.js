// src/services/sugerenciasService.js
// Requiere un cliente de base de datos compatible (por ejemplo, knex)

async function obtenerSugerencias(db, usuarioId, videoId) {
  // Helper para enriquecer videos con datos de usuario
  async function enriquecerVideos(videos) {
    if (!videos.length) return [];
    const usuarioIds = [...new Set(videos.map(v => v.usuario_id))];
    const usuarios = await db('usuarios').whereIn('id', usuarioIds).select('id', 'nombre');
    const usuariosMap = Object.fromEntries(usuarios.map(u => [u.id, u.nombre]));
    return videos.map(v => ({
      ...v,
      usuario_nombre: usuariosMap[v.usuario_id] || '',
      // Si tienes un campo thumbnail_url en videos, lo incluye automáticamente
      thumbnail_url: v.thumbnail_url || ''
    }));
  }

  // 1. Videos de personas que sigue el usuario
  const seguidos = await db('seguidores').where({ usuario_id: usuarioId }).pluck('seguido_id');
  const videosSeguidos = seguidos.length > 0
    ? await db('videos')
        .whereIn('usuario_id', seguidos)
        .whereBetween('edad', [12, 60])
        .orderBy('fecha', 'desc')
        .limit(5)
    : [];

  // 2. Videos similares a los vistos recientemente
  const vistos = await db('historial_videos')
    .where({ usuario_id: usuarioId })
    .orderBy('fecha', 'desc')
    .limit(10)
    .pluck('video_id');
  const categoriasVistas = vistos.length > 0
    ? await db('videos')
        .whereIn('id', vistos)
        .distinct('categoria')
        .pluck('categoria')
    : [];
  const videosSimilares = categoriasVistas.length > 0
    ? await db('videos')
        .whereIn('categoria', categoriasVistas)
        .whereNot('id', videoId)
        .whereBetween('edad', [12, 60])
        .orderBy('ranking', 'desc')
        .limit(5)
    : [];

  // 3. Ranking por edad
  const rankingEdad = await db('videos')
    .whereBetween('edad', [12, 60])
    .orderBy('ranking', 'desc')
    .limit(10);

  // Unir y filtrar duplicados
  let sugerencias = [...videosSeguidos, ...videosSimilares, ...rankingEdad]
    .filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i);

  // Enriquecer con nombre de usuario y miniatura
  sugerencias = await enriquecerVideos(sugerencias);

  return sugerencias;
}

export default obtenerSugerencias;
