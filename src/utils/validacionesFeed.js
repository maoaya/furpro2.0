export function validarFeedItem(item) {
  if (!item.titulo || item.titulo.length < 3) return 'El título es obligatorio y debe tener al menos 3 caracteres.';
  if (!item.descripcion || item.descripcion.length < 5) return 'La descripción es obligatoria y debe tener al menos 5 caracteres.';
  if (!item.fecha) return 'La fecha es obligatoria.';
  return null;
}