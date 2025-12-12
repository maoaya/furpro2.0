// Stubs para HomePage.jsx
export async function fetchGalleryAndComments() {
  // Implementación real: carga galería y comentarios
  console.log('[STUB] Cargando galería y comentarios');
  return [];
}

export async function fetchUsuario() {
  // Implementación real: carga perfil usuario
  console.log('[STUB] Cargando usuario');
  return {};
}

export async function handleLike(mediaId) {
  // Implementación real: like a publicación
  console.log(`[STUB] Like a publicación ${mediaId}`);
}

export async function handleShare(id) {
  // Implementación real: compartir publicación
  console.log(`[STUB] Compartir publicación ${id}`);
}

export async function handleComment(pubId, text) {
  // Implementación real: comentar publicación
  console.log(`[STUB] Comentar en publicación ${pubId}: ${text}`);
}

export function handleAccion(accion, navigate) {
  // Implementación real: navegación menú
  console.log(`[STUB] Acción menú: ${accion}`);
  if (navigate) navigate('/' + accion);
}
