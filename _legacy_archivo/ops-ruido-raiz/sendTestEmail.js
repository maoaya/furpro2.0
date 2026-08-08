require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const mailOptions = {
  from: process.env.SMTP_USER,
  to: 'destinatario@correo.com', // Cambia esto por el correo de destino
  subject: 'Prueba de envío de correo',
  text: '¡Este es un correo de prueba enviado desde FutPro!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error al enviar correo:', error);
  }
  console.log('Correo enviado:', info.response);
});