// Servicio de notificaciones (simulado)
const notifications = [];

function sendNotification(to, message) {
  notifications.push({ to, message, date: new Date() });
  // Aquí puedes integrar push/email/in-app
}

function getNotifications(userId) {
  return notifications.filter(n => n.to === userId);
}

module.exports = { sendNotification, getNotifications };
