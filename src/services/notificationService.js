// Servicio frontend para notificaciones
async function sendNotification(to, message, token) {
  await fetch('/api/notifications/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ to, message })
  });
}

async function getNotifications(token) {
  const res = await fetch('/api/notifications', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export default { sendNotification, getNotifications };
