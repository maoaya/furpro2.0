import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './Amigos.css';

const Amigos = () => {
  const { user, categoria } = useAuth();
  const [amigos, setAmigos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);

  useEffect(() => {
    cargarAmigos();
    cargarSolicitudes();
  }, [user]);

  const cargarAmigos = () => {
    const amigosGuardados = JSON.parse(localStorage.getItem('futpro_amigos') || '[]');
    setAmigos(amigosGuardados);
  };

  const cargarSolicitudes = () => {
    const solicitudesGuardadas = JSON.parse(localStorage.getItem('futpro_solicitudes_amistad') || '[]');
    setSolicitudes(solicitudesGuardadas);
  };

  const buscarUsuarios = () => {
    if (!busqueda.trim()) return;

    // Simular búsqueda de usuarios (en producción sería una API call)
    const usuariosSimulados = [
      { id: 1, nombre: 'Carlos Rodríguez', email: 'carlos@email.com', categoria: 'masculina' },
      { id: 2, nombre: 'María García', email: 'maria@email.com', categoria: 'femenina' },
      { id: 3, nombre: 'Juan Pérez', email: 'juan@email.com', categoria: 'infantil_masculina' },
      { id: 4, nombre: 'Ana López', email: 'ana@email.com', categoria: 'infantil_femenina' }
    ];

    const resultados = usuariosSimulados.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    setUsuariosEncontrados(resultados);
  };

  const enviarSolicitud = (usuarioId, nombreUsuario) => {
    const nuevaSolicitud = {
      id: Date.now(),
      de: user?.email || 'Usuario',
      para: usuarioId,
      nombrePara: nombreUsuario,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };

    const solicitudesActualizadas = [...solicitudes, nuevaSolicitud];
    setSolicitudes(solicitudesActualizadas);
    localStorage.setItem('futpro_solicitudes_amistad', JSON.stringify(solicitudesActualizadas));

    // Remover de usuarios encontrados
    setUsuariosEncontrados(usuariosEncontrados.filter(u => u.id !== usuarioId));

    alert(`Solicitud de amistad enviada a ${nombreUsuario}`);
  };

  const aceptarSolicitud = (solicitudId) => {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) return;

    // Agregar a amigos
    const nuevoAmigo = {
      id: solicitud.para,
      nombre: solicitud.nombrePara,
      email: solicitud.para,
      fechaAmistad: new Date().toISOString()
    };

    const amigosActualizados = [...amigos, nuevoAmigo];
    setAmigos(amigosActualizados);
    localStorage.setItem('futpro_amigos', JSON.stringify(amigosActualizados));

    // Remover solicitud
    const solicitudesActualizadas = solicitudes.filter(s => s.id !== solicitudId);
    setSolicitudes(solicitudesActualizadas);
    localStorage.setItem('futpro_solicitudes_amistad', JSON.stringify(solicitudesActualizadas));

    alert(`Ahora eres amigo de ${solicitud.nombrePara}`);
  };

  const rechazarSolicitud = (solicitudId) => {
    const solicitudesActualizadas = solicitudes.filter(s => s.id !== solicitudId);
    setSolicitudes(solicitudesActualizadas);
    localStorage.setItem('futpro_solicitudes_amistad', JSON.stringify(solicitudesActualizadas));
  };

  const removerAmigo = (amigoId) => {
    const amigosActualizados = amigos.filter(a => a.id !== amigoId);
    setAmigos(amigosActualizados);
    localStorage.setItem('futpro_amigos', JSON.stringify(amigosActualizados));
  };

  return (
    <div className="amigos-container">
      <div className="amigos-header">
        <h1>Amigos</h1>
        <p>Conecta con otros jugadores de fútbol</p>
      </div>

      {/* Buscar usuarios */}
      <div className="buscar-amigos">
        <div className="busqueda-input">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o email..."
            onKeyPress={(e) => e.key === 'Enter' && buscarUsuarios()}
          />
          <button onClick={buscarUsuarios} className="btn-buscar">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Solicitudes pendientes */}
      {solicitudes.length > 0 && (
        <div className="solicitudes-section">
          <h2>Solicitudes de Amistad</h2>
          {solicitudes.map(solicitud => (
            <div key={solicitud.id} className="solicitud-card">
              <div className="solicitud-info">
                <h4>{solicitud.nombrePara}</h4>
                <p>Quiere ser tu amigo</p>
                <small>{new Date(solicitud.fecha).toLocaleDateString()}</small>
              </div>
              <div className="solicitud-actions">
                <button
                  onClick={() => aceptarSolicitud(solicitud.id)}
                  className="btn-aceptar"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  className="btn-rechazar"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados de búsqueda */}
      {usuariosEncontrados.length > 0 && (
        <div className="resultados-busqueda">
          <h2>Resultados de Búsqueda</h2>
          {usuariosEncontrados.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-info">
                <div className="avatar-placeholder">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{usuario.nombre}</h4>
                  <span className="categoria-badge">{usuario.categoria}</span>
                  <p>{usuario.email}</p>
                </div>
              </div>
              <button
                onClick={() => enviarSolicitud(usuario.id, usuario.nombre)}
                className="btn-enviar-solicitud"
              >
                Enviar Solicitud
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lista de amigos */}
      <div className="amigos-section">
        <h2>Mis Amigos ({amigos.length})</h2>
        {amigos.length === 0 ? (
          <div className="no-amigos">
            <p>Aún no tienes amigos.</p>
            <p>¡Busca otros jugadores para conectar!</p>
          </div>
        ) : (
          <div className="amigos-grid">
            {amigos.map(amigo => (
              <div key={amigo.id} className="amigo-card">
                <div className="amigo-avatar">
                  {amigo.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="amigo-info">
                  <h4>{amigo.nombre}</h4>
                  <p>Amigos desde {new Date(amigo.fechaAmistad).toLocaleDateString()}</p>
                </div>
                <div className="amigo-actions">
                  <button className="btn-mensaje">
                    <i className="fas fa-comment"></i>
                  </button>
                  <button
                    onClick={() => removerAmigo(amigo.id)}
                    className="btn-remover"
                  >
                    <i className="fas fa-user-minus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Amigos;