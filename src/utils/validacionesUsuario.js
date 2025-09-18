export function validarUsuario(usuario) {
  if (!usuario.nombre || usuario.nombre.length < 3) return 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
  if (!usuario.email || !usuario.email.includes('@')) return 'El email es obligatorio y debe ser válido.';
  if (!usuario.rol) return 'El rol es obligatorio.';
  return null;
}