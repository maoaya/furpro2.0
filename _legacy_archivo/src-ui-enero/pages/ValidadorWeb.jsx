import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function ValidadorUsuario() {
  const [tipo, setTipo] = useState('email');
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  async function validar() {
    setLoading(true);
    setResultado('');
    try {
      const res = await fetch(`${API_URL}/usuarios/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, valor })
      });
      const data = await res.json();
      setResultado(data.result || JSON.stringify(data));
    } catch (e) {
      setResultado('Error de conexión');
    }
    setLoading(false);
  }

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '500px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Validador Web</h2>
      <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', marginBottom: 16 }}>
        <option value="email">Email</option>
        <option value="usuario">Usuario</option>
        <option value="password">Contraseña</option>
      </select>
      <input
        type="text"
        value={valor}
        onChange={e => setValor(e.target.value)}
        placeholder={`Ingrese ${tipo}`}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', marginBottom: 16 }}
      />
  <Button type="button" onClick={validar} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginBottom: 16, transition: 'background 0.3s, color 0.3s' }}>{loading ? 'Validando...' : 'Validar'}</Button>
      {resultado && <div style={{ marginBottom: 16, color: resultado.includes('Error') ? '#FF4D4F' : '#52c41a', fontWeight: 'bold' }}>{resultado}</div>}
    </div>
  );
}

function EstadoServidor() {
  const [estado, setEstado] = useState('pendiente');
  const [mensaje, setMensaje] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [version, setVersion] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/ping`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setEstado('ok');
          setMensaje(data.message || 'pong');
          setTimestamp(data.timestamp || '');
          setVersion(data.version || '');
        } else {
          setEstado('error');
          setMensaje('Respuesta inesperada');
        }
      })
      .catch(() => {
        setEstado('error');
        setMensaje('No se pudo conectar al backend');
      });
  }, []);

  return (
    <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, background: estado === 'ok' ? '#e6ffed' : '#fff1f0', color: estado === 'ok' ? '#237804' : '#cf1322', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #0001' }}>
      <div>Estado del servidor: {estado === 'ok' ? 'Activo' : 'Inaccesible'}</div>
      <div style={{ fontWeight: 'normal', color: '#888', fontSize: 16 }}>
        {mensaje && <span>Mensaje: {mensaje} </span>}
        {timestamp && <span>· Última respuesta: {timestamp} </span>}
        {version && <span>· Versión: {version}</span>}
      </div>
    </div>
  );
}

const pages = [
  { key: 'validador', label: 'Validador de Usuario', content: <ValidadorUsuario /> },
  { key: 'login', label: 'Registro/Login', content: <div><h2>Registro/Login</h2><p>Página para autenticación de usuarios.</p></div> },
  { key: '404', label: 'Error 404', content: <div><h2>Error 404</h2><p>Página personalizada para rutas no encontradas.</p></div> },
  { key: 'politicas', label: 'Políticas y Términos', content: <div><h2>Políticas de Privacidad y Términos</h2><p>Información legal y de uso.</p></div> },
  { key: 'arbitros', label: 'Perfil Árbitros/Jueces', content: <div><h2>Perfil de Árbitros/Jueces</h2><p>Información y gestión de árbitros.</p></div> },
  { key: 'patrocinadores', label: 'Patrocinadores/Jugadores Invitados', content: <div><h2>Gestión de Patrocinadores/Jugadores Invitados</h2><p>Panel para gestionar patrocinadores y jugadores invitados.</p></div> },
  { key: 'configuracion', label: 'Configuración Avanzada', content: <div><h2>Configuración Avanzada</h2><p>Opciones avanzadas de usuario/equipo.</p></div> },
  { key: 'media', label: 'Administración de Media', content: <div><h2>Administración de Media</h2><p>Gestión de fotos y videos.</p></div> },
  { key: 'reportes', label: 'Reportes/Denuncias', content: <div><h2>Reportes y Denuncias</h2><p>Panel para reportar y gestionar denuncias.</p></div> },
  { key: 'soporte', label: 'Soporte Técnico Avanzado', content: <div><h2>Soporte Técnico Avanzado</h2><p>Herramientas y contacto técnico.</p></div> },
  { key: 'redes', label: 'Integración Redes Sociales', content: <div><h2>Integración con Redes Sociales</h2><p>Conexión y gestión de redes sociales.</p></div> },
  { key: 'premios', label: 'Premios/Recompensas', content: <div><h2>Gestión de Premios y Recompensas</h2><p>Panel para administrar premios y recompensas.</p></div> },
  { key: 'estadisticas', label: 'Estadísticas Históricas/Comparativas', content: <div><h2>Estadísticas Históricas y Comparativas</h2><p>Visualización y análisis avanzado.</p></div> },
  { key: 'staff', label: 'Staff/Roles', content: <div><h2>Gestión de Staff y Roles</h2><p>Panel para administrar roles y staff.</p></div> },
  { key: 'pagos', label: 'Pagos/Facturación', content: <div><h2>Gestión de Pagos y Facturación</h2><p>Panel de pagos y facturación.</p></div> },
  { key: 'invitaciones', label: 'Invitaciones/Solicitudes Detalladas', content: <div><h2>Invitaciones y Solicitudes Detalladas</h2><p>Gestión avanzada de invitaciones y solicitudes.</p></div> },
  { key: 'notificaciones', label: 'Notificaciones Avanzadas', content: <div><h2>Gestión de Notificaciones Avanzadas</h2><p>Panel de notificaciones avanzadas.</p></div> },
  { key: 'transmision', label: 'Transmisión en Vivo Avanzada', content: <div><h2>Transmisión en Vivo Avanzada</h2><p>Herramientas y panel de transmisión avanzada.</p></div> },
  { key: 'ayuda', label: 'Ayuda/Tutoriales', content: <div><h2>Ayuda y Tutoriales</h2><p>Recursos y tutoriales para usuarios.</p></div> },
  { key: 'contacto', label: 'Contacto Directo', content: <div><h2>Contacto Directo</h2><p>Formulario y opciones de contacto directo.</p></div> },
  { key: 'seguridad', label: 'Seguridad/Privacidad', content: <div><h2>Gestión de Seguridad y Privacidad</h2><p>Panel de seguridad y privacidad.</p></div> },
  // Secciones de validación avanzada
  { key: 'usabilidad', label: 'Pruebas de Usabilidad', content: <div><h2>Pruebas de Usabilidad</h2><p>Valida la experiencia de usuario (UX) y accesibilidad.</p></div> },
  { key: 'formularios', label: 'Validación de Formularios', content: <div><h2>Validación de Formularios</h2><p>Panel para probar todos los formularios del sistema.</p></div> },
  { key: 'roles', label: 'Validación de Roles y Permisos', content: <div><h2>Validación de Roles y Permisos</h2><p>Comprueba que cada tipo de usuario accede solo a lo que le corresponde.</p></div> },
  { key: 'integracion', label: 'Validación de Integración Externa', content: <div><h2>Validación de Integración Externa</h2><p>Pruebas con APIs externas (redes sociales, pagos, notificaciones).</p></div> },
  { key: 'rendimiento', label: 'Validación de Rendimiento', content: <div><h2>Validación de Rendimiento</h2><p>Panel para medir tiempos de carga y respuesta de cada página.</p></div> },
  { key: 'i18n', label: 'Validación de Internacionalización', content: <div><h2>Validación de Internacionalización</h2><p>Comprobar textos y formatos para distintos idiomas/regiones.</p></div> },
  { key: 'seguridad2', label: 'Validación de Seguridad', content: <div><h2>Validación de Seguridad</h2><p>Pruebas de vulnerabilidades básicas (inputs, autenticación, etc.).</p></div> },
  { key: 'notificaciones2', label: 'Validación de Notificaciones y Alertas', content: <div><h2>Validación de Notificaciones y Alertas</h2><p>Panel para probar mensajes y alertas del sistema.</p></div> },
  { key: 'navegacion', label: 'Validación de Navegación', content: <div><h2>Validación de Navegación</h2><p>Comprobar que todas las rutas y enlaces funcionan correctamente.</p></div> },
];

export default function ValidadorWeb() {
  const [selected, setSelected] = useState(pages[0].key);
  const currentPage = pages.find(p => p.key === selected);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#121212', color: '#E0E0E0' }}>
      <nav style={{ minWidth: 250, background: '#1E1E1E', padding: 20, borderRight: '1px solid #333' }}>
        <h3 style={{ color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Validador Web</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pages.map(page => (
            <li key={page.key}>
              <Button style={{ width: '100%', margin: '4px 0', padding: '12px', background: selected === page.key ? '#FFD700' : 'transparent', color: selected === page.key ? '#181818' : '#E0E0E0', border: '1px solid #FFD700', borderRadius: 8, fontWeight: 'medium', fontSize: 16, transition: 'background 0.3s, color 0.3s' }} onClick={() => setSelected(page.key)}>
                {page.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <main style={{ flex: 1, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <EstadoServidor />
        {currentPage?.content}
      </main>
    </div>
  );
}
