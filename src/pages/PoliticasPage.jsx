import React from 'react';

const gold = '#FFD700';
const black = '#181818';

export default function PoliticasPage() {
  return (
    <div style={{ background: black, color: gold, minHeight: '100vh', padding: 48, maxWidth: 900, margin: 'auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Políticas y Privacidad</h1>
      <div style={{ background: '#232323', borderRadius: 12, padding: 32, color: gold }}>
        <h2>Privacidad</h2>
        <p>Tu información personal y deportiva solo se usa para mejorar tu experiencia en FutPro. No compartimos tus datos con terceros.</p>
        <h2>Condiciones de uso</h2>
        <p>El uso de la plataforma implica aceptar las normas de respeto, convivencia y veracidad de la información publicada.</p>
        <h2>Datos y seguridad</h2>
        <p>Todos los datos se almacenan localmente en tu dispositivo. No hay transmisión a servidores externos.</p>
        <h2>Contacto</h2>
        <p>Para dudas o reclamos, contacta a soporte@futpro.com</p>
      </div>
    </div>
  );
}
