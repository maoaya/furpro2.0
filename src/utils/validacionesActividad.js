export function validarActividad(actividad) {
  if (!actividad.usuario) return 'El usuario es obligatorio.';
  if (!actividad.accion) return 'La acción es obligatoria.';
  if (!actividad.fecha) return 'La fecha es obligatoria.';
  return null;
}