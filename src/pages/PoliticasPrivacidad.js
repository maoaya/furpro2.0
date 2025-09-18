import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PoliticasPrivacidad() {
  const navigate = useNavigate();
  return (
    <div className="politicas-privacidad" style={{ padding: '3rem', background: '#181818', color: '#FFD700', minHeight: '100vh', fontSize: '1.1rem', borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '900px', margin: 'auto' }}>
      <h1 style={{ fontWeight: 'bold', fontSize: 32, marginBottom: 24 }}>Política de Privacidad y Seguridad</h1>
      <p><strong>Última actualización:</strong> 8 de agosto de 2025</p>
      <p>
        Este Aviso de Privacidad para FutPro describe cómo y por qué podríamos acceder, recopilar, almacenar, usar y/o compartir su información personal cuando utiliza nuestros servicios, incluyendo sitio web, app móvil y cualquier interacción con FutPro.
      </p>
      <h2 style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 32 }}>Resumen de Puntos Clave</h2>
      <ul>
        <li>Solo procesamos información personal necesaria para operar y mejorar nuestros servicios.</li>
        <li>No procesamos información sensible ni recopilamos datos de terceros.</li>
        <li>La seguridad de sus datos es prioridad, pero ninguna tecnología es 100% segura.</li>
        <li>Usted tiene derechos de acceso, rectificación y eliminación de sus datos.</li>
        <li>Puede contactarnos en <a href="mailto:mauroayala759@gmail.com" style={{ color: '#FFD700', textDecoration: 'underline' }}>mauroayala759@gmail.com</a> para ejercer sus derechos.</li>
      </ul>
      <h2 style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 32 }}>Tabla de Contenido</h2>
      <ol>
        <li>¿Qué información recopilamos?</li>
        <li>¿Cómo procesamos su información?</li>
        <li>¿En qué bases legales nos basamos?</li>
        <li>¿Cuándo y con quién compartimos su información?</li>
        <li>¿Utilizamos cookies y tecnologías de seguimiento?</li>
        <li>¿Cómo manejamos sus inicios de sesión sociales?</li>
        <li>¿Durante cuánto tiempo conservamos su información?</li>
        <li>¿Cómo mantenemos segura su información?</li>
        <li>¿Cuáles son sus derechos de privacidad?</li>
        <li>Controles para las funciones de no seguimiento</li>
        <li>¿Residentes de EE.UU. tienen derechos específicos?</li>
        <li>¿Otras regiones tienen derechos específicos?</li>
        <li>¿Hacemos actualizaciones a este aviso?</li>
        <li>¿Cómo puede contactarnos?</li>
        <li>¿Cómo puede revisar, actualizar o eliminar sus datos?</li>
      </ol>
      <h2 style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 32 }}>¿Qué información recopilamos?</h2>
      <p>Recopilamos información personal que usted nos proporciona voluntariamente al registrarse, participar en actividades, o comunicarse con nosotros. Esto incluye nombres, correos electrónicos, contraseñas y datos de contacto. No procesamos información sensible.</p>
      <h2 style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 32 }}>¿Cómo procesamos su información?</h2>
      <p>Procesamos su información para crear cuentas, gestionar pedidos, facilitar comunicación entre usuarios y proteger intereses vitales. Solo con su consentimiento explícito previo.</p>
      <h2 style={{ color: '#FFD700', fontWeight: 'bold', marginTop: 32 }}>¿En qué bases legales nos basamos?</h2>
      <button style={{marginTop:'32px',background:'#FFD700',color:'#181818',border:'none',borderRadius:'8px',padding:'0.8em 2em',fontWeight:'bold',fontSize:'1.1em',cursor:'pointer'}} onClick={()=>navigate('/')}>Ir al inicio</button>
      <p>Solo procesamos su información personal cuando tenemos una razón legal válida: consentimiento, ejecución de contrato, obligaciones legales o intereses vitales.</p>
      <h2>¿Cuándo y con quién compartimos su información?</h2>
      <p>Podemos compartir información con proveedores de servicios externos, siempre bajo contrato y protección de datos. No vendemos ni compartimos datos con terceros para fines comerciales.</p>
      <h2>¿Utilizamos cookies y tecnologías de seguimiento?</h2>
      <p>Utilizamos cookies y tecnologías similares para mejorar la seguridad y funcionalidad. Puede rechazar ciertas cookies en la configuración de su navegador.</p>
      <h2>¿Cómo manejamos sus inicios de sesión sociales?</h2>
      <p>Si usa redes sociales para registrarse, recibimos información básica de perfil. Revise la política de privacidad de su proveedor de red social.</p>
      <h2>¿Durante cuánto tiempo conservamos su información?</h2>
      <p>Conservamos su información solo el tiempo necesario para los fines descritos, o según lo exija la ley.</p>
      <h2>¿Cómo mantenemos segura su información?</h2>
      <p>Implementamos medidas técnicas y organizativas razonables para proteger sus datos, pero ninguna tecnología es 100% segura.</p>
      <h2>¿Cuáles son sus derechos de privacidad?</h2>
      <p>Usted puede acceder, rectificar, eliminar o retirar su consentimiento sobre sus datos personales. Para ejercer sus derechos, contáctenos.</p>
      <h2>Controles para las funciones de no seguimiento</h2>
      <p>No respondemos a señales DNT actualmente, pero puede configurar su navegador para limitar el seguimiento.</p>
      <h2>¿Residentes de EE.UU. tienen derechos específicos?</h2>
      <p>Los residentes de ciertos estados tienen derechos adicionales de acceso, corrección y eliminación de datos.</p>
      <h2>¿Otras regiones tienen derechos específicos?</h2>
      <p>Residentes de la UE, Reino Unido, Suiza, Canadá y Nueva Zelanda tienen derechos adicionales según la legislación local.</p>
      <h2>¿Hacemos actualizaciones a este aviso?</h2>
      <p>Actualizaremos este aviso según sea necesario para cumplir con la ley. Revise periódicamente para estar informado.</p>
      <h2>¿Cómo puede contactarnos?</h2>
      <p>Correo: <a href="mailto:mauroayala759@gmail.com">mauroayala759@gmail.com</a><br />Dirección: calle 80 f 40, apartamento 1501, Bogotá, Colombia</p>
      <h2>¿Cómo puede revisar, actualizar o eliminar sus datos?</h2>
      <p>Solicite acceso, actualización o eliminación de sus datos enviando una solicitud a nuestro correo.</p>
    </div>
  );
}
