// src/services/rankingService.js
// Servicio para actualizar el ranking de un video según la fórmula personalizada

async function actualizarRanking(db, videoId) {
  const video = await db('videos').where({ id: videoId }).first();
  if (!video) return;

  const ranking =
    (video.visualizaciones || 0) * 1 +
    (video.likes || 0) * 3 +
    (video.comentarios || 0) * 5 +
    (video.compartidos || 0) * 10;

  await db('videos').where({ id: videoId }).update({ ranking });
}

export default actualizarRanking;
