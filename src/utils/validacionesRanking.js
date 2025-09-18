export function validarRanking(ranking) {
  if (!ranking.equipo) return 'El equipo es obligatorio.';
  if (typeof ranking.puntos !== 'number') return 'Los puntos deben ser numéricos.';
  return null;
}