import React from 'react';

const PoliticasPage = () => (
  <div className="politicas-page" style={{ padding: '3rem', background: '#181818', color: '#FFD700', minHeight: '100vh', borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto' }}>
    <h2 style={{ fontWeight: 'bold', fontSize: 32, marginBottom: 24 }}>Políticas de Seguridad y Acceso</h2>
    <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>
      Esta sección describe las políticas de seguridad y acceso de FutPro. El uso de la plataforma está protegido mediante autenticación segura y gestión de claves API. Todos los accesos son auditados y se aplican controles estrictos para proteger la información de los usuarios.
    </p>
    <ul style={{ fontSize: '1.1rem', marginBottom: 24 }}>
      <li>Autenticación con Firebase y Supabase</li>
      <li>Gestión de claves API en entorno seguro</li>
      <li>Auditoría de accesos y acciones</li>
      <li>Protección de datos personales</li>
      <li>Actualizaciones periódicas de seguridad</li>
    </ul>
    <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>
      Para más información sobre nuestras políticas, consulte la sección de privacidad.
    </p>
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <button
        style={{
          background: '#FFD700',
          color: '#181818',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 2rem',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #FFD70088'
        }}
        onClick={() => window.location = 'mailto:xpro2025@gmail.com'}
      >
        Contactar
      </button>
      <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#FFD700' }}>
        Correo de contacto: <a href="mailto:xpro2025@gmail.com" style={{ color: '#FFD700', textDecoration: 'underline' }}>xpro2025@gmail.com</a>
      </p>
    </div>
  </div>
);

export default PoliticasPage;
