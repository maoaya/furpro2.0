// Servicio de moderación de contenido
const reports = [];

function reportContent(contentId, reason, reporter) {
  reports.push({ contentId, reason, reporter, date: new Date() });
}

function getReports() {
  return reports;
}

function removeContent(/* contentId */) {
  // Aquí lógica para eliminar de la base de datos
  // Ejemplo: Media, mensajes, etc.
}

module.exports = { reportContent, getReports, removeContent };
