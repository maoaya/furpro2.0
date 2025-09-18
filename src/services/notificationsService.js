// MOCK notificationsService para entorno de test
import { sendEmail } from './emailService.js';
const notificationsService = {
  notificar: async () => true,
};

export default notificationsService;

export async function enviarNotificacionPush(subscription, payload, userId) {
  try {
    // Simulate sending push notification
    // Add your push notification logic here

    // Hook global para IU
    if (window.futProApp?.onPushNotification) {
      window.futProApp.onPushNotification(userId, payload);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function enviarNotificacionEmail(to, subject, text, html, payload = {}) {
  if (!to || !subject || (!text && !html)) {
    return { success: false, error: 'Parámetros de email faltantes' };
  }
  try {
    // Usa el emailService si está disponible; si no, simula
    let info = { simulated: true };
    try {
      const res = await sendEmail({ to, subject, text, html });
      if (res?.success) info = res.info ?? { via: 'emailService' };
    } catch (_) {
      // mantener info simulado si falla
    }

    // UI hooks (optional, if running in browser context)
  if (typeof window !== 'undefined' && window.futProApp?.showToast) {
      window.futProApp.showToast({
        type: 'info',
        title: 'Notificación Email',
        message: payload.message,
        icon: payload.icon,
        duration: 4000
      });
    }
  if (typeof window !== 'undefined' && window.futProApp?.showModal && payload.type === 'error') {
      window.futProApp.showModal({
        title: 'Error Email',
        content: payload.message,
        icon: payload.icon || '⚠️',
        actions: [{ label: 'Cerrar', type: 'primary' }]
      });
    }
    // Hook global para IU
  if (typeof window !== 'undefined' && window.futProApp?.onEmailNotification) {
      window.futProApp.onEmailNotification(to, payload);
    }

    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
}