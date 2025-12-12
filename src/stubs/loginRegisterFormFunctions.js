// Stubs para LoginRegisterFormClean.jsx
export async function handleLoginSocial(provider) {
  // Implementación real: inicia OAuth con Supabase
  console.log(`[STUB] Iniciando OAuth con ${provider}`);
}

export async function handleSubmitEmail(email, password, isRegister, categoria) {
  // Implementación real: registro/login con Supabase y draft
  console.log(`[STUB] Registro/Login con email: ${email}, isRegister: ${isRegister}, categoria: ${categoria}`);
}

export function goHome(navigate) {
  // Implementación real: navegación SPA
  console.log('[STUB] Redirigiendo a home');
  if (navigate) navigate('/home');
}
