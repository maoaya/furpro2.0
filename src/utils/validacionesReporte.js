export function validarReporte(reporte) {
  if (!reporte.tipo) return 'El tipo de reporte es obligatorio.';
  if (!reporte.fecha) return 'La fecha es obligatoria.';
  if (!reporte.estado) return 'El estado es obligatorio.';
  return null;
}