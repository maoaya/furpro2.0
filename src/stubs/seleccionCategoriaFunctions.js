// Stubs para SeleccionCategoria.jsx
export function handleSelect(value) {
  // Implementación real: selecciona categoría
  console.log(`[STUB] Categoría seleccionada: ${value}`);
}

export function handleConfirm(selected, navigate) {
  // Implementación real: guarda categoría y navega
  console.log(`[STUB] Confirmando categoría: ${selected}`);
  if (navigate) navigate(`/formulario-registro?categoria=${encodeURIComponent(selected)}`);
}

export async function handleGoogleLogin(selected) {
  // Implementación real: inicia OAuth con Google
  console.log(`[STUB] Iniciando OAuth Google con categoría: ${selected}`);
}
