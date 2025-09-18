// MOCK moderationService para entorno de test
async function reportContent(contentId, reason) {
  return { ok: true, contentId, reason };
}

async function getReports() {
  return [ { id: 1, content: 'Contenido Mock', reason: 'dummy', status: 'pending' } ];
}

async function removeContent(id) {
  return { ok: true, id };
}

export default { reportContent, getReports, removeContent };
