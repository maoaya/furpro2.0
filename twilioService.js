import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export async function sendSMS(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: phoneNumber,
      to: to
    });
    return response;
  } catch (error) {
    console.error('Error enviando SMS:', error);
    throw error;
  }
}

// Ejemplo de uso:
// await sendSMS('+573001234567', '¡Hola desde FutPro!');