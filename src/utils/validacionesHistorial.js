export function validarHistorial(historial) {
  if (!historial.accion) return 'La acción es obligatoria.';
  if (!historial.fecha) return 'La fecha es obligatoria.';
  return null;
}