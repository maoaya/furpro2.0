export function validarCredenciales({ email, password }) {
  if (!email || !email.includes('@')) return 'El email es obligatorio y debe ser válido.';
  if (!password || password.length < 6) return 'La contraseña es obligatoria y debe tener al menos 6 caracteres.';
  return null;
}