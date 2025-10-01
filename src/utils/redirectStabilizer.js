// Utilidad para estabilizar la redirección a /home incluso si el contexto tarda
// Uso: ensureHomeNavigation(navigate)

export function ensureHomeNavigation(navigate, opts = {}) {
  const {
    target = '/home',
    immediate = true,
    softDelayMs = 600,
    hardDelayMs = 2000,
  } = opts;

  try {
    // Marcas que usan ProtectedRoute para conceder "modo gracia"
    localStorage.setItem('registroCompleto', 'true');
    localStorage.setItem('authCompleted', 'true');
    localStorage.setItem('postLoginRedirect', target);

    if (immediate && typeof navigate === 'function') {
      navigate(target, { replace: true });
    }

    // Reintento suave por si el Router aún no montó la ruta
    setTimeout(() => {
      try {
        if (typeof navigate === 'function') navigate(target, { replace: true });
      } catch {}
    }, softDelayMs);

    // Reintento duro a nivel de ventana si algo bloquea el Router
    setTimeout(() => {
      try {
        if (window?.location?.pathname !== target) {
          window.location.assign(target);
        }
      } catch {}
    }, hardDelayMs);
  } catch (e) {
    // Último recurso
    try { window.location.assign(target); } catch {}
  }
}
