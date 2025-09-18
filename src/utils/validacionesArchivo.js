export function validarArchivo(archivo) {
  if (!archivo.nombre || archivo.nombre.length < 3) return 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
  if (!archivo.tipo) return 'El tipo de archivo es obligatorio.';
  if (!archivo.url) return 'La URL del archivo es obligatoria.';
  return null;
}