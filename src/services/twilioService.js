// MOCK de Twilio para entorno de test/desarrollo
// Exporta funciones dummy para evitar errores de importación

export function sendSMS() {
  // No hace nada en entorno de test
  return Promise.resolve('SMS simulado (mock)');
}

export const enviarSMS = sendSMS;