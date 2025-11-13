// Utilidad de navegación aislada para facilitar mocking en tests
export function redirectTo(url) {
  // En entorno jsdom/Jest simplemente llamará a assign
  if (typeof window !== 'undefined' && window.location && typeof window.location.assign === 'function') {
    window.location.assign(url);
  } else {
    // Fallback por si se ejecuta en entorno no navegador
    // eslint-disable-next-line no-console
    console.warn('redirectTo fallback:', url);
  }
}
