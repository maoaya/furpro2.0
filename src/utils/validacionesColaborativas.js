export function validarValidacionColaborativa(validacion) {
  if (!validacion.usuario) return 'El usuario es obligatorio.';
  if (!validacion.estado) return 'El estado es obligatorio.';
  if (!validacion.fecha) return 'La fecha es obligatoria.';
  return null;
}