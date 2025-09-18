import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST,
  port: import.meta.env.SMTP_PORT,
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS
  }
});

/**
 * Envía un email usando el transporter configurado
 * @param {Object} options - { to, subject, text, html }
 * @returns {Promise<{success: boolean, info?: any, error?: string}>}
 */
export async function sendEmail(options) {
  if (!options.to || !options.subject || (!options.text && !options.html)) {
    if (window.futProApp?.showToast) {
      window.futProApp.showToast({
        type: 'error',
        title: 'Error de Email',
        message: 'Faltan parámetros obligatorios',
        icon: '⚠️',
        duration: 5000
      });
    }
    if (window.futProApp?.showModal) {
      window.futProApp.showModal({
        title: 'Error de Email',
        content: 'Faltan parámetros obligatorios',
        icon: '⚠️',
        actions: [{ label: 'Cerrar', type: 'primary' }]
      });
    }
    if (window.futProApp?.onEmailNotification) {
      window.futProApp.onEmailNotification(options.to, { type: 'error', message: 'Faltan parámetros obligatorios' });
    }
    return { success: false, error: "Faltan parámetros obligatorios" };
  }
  try {
    const info = await transporter.sendMail({
      from: import.meta.env.SMTP_USER,
      ...options
    });
    if (window.futProApp?.showToast) {
      window.futProApp.showToast({
        type: 'success',
        title: 'Email enviado',
        message: `Email enviado a ${options.to}`,
        icon: '✉️',
        duration: 4000
      });
    }
    if (window.futProApp?.onEmailNotification) {
      window.futProApp.onEmailNotification(options.to, { type: 'success', message: `Email enviado a ${options.to}` });
    }
    return { success: true, info };
  } catch (error) {
    if (window.futProApp?.showToast) {
      window.futProApp.showToast({
        type: 'error',
        title: 'Error de Email',
        message: error.message,
        icon: '⚠️',
        duration: 5000
      });
    }
    if (window.futProApp?.showModal) {
      window.futProApp.showModal({
        title: 'Error de Email',
        content: error.message,
        icon: '⚠️',
        actions: [{ label: 'Cerrar', type: 'primary' }]
      });
    }
    if (window.futProApp?.onEmailNotification) {
      window.futProApp.onEmailNotification(options.to, { type: 'error', message: error.message });
    }
    return { success: false, error: error.message };
  }
}
// Export default con API simple basada en sendEmail
const emailService = {
  enviar: async (to, subject, body) => sendEmail({ to, subject, text: body }),
};

export default emailService;