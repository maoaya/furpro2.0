import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Funciones de navegación del menú
  const irAInicio = () => { navigate('/home'); closeMenu(); };
  const irAPerfil = () => { navigate('/perfil'); closeMenu(); };
  const editarPerfil = () => { navigate('/editar-perfil'); closeMenu(); };
  const verEstadisticas = () => { navigate('/estadisticas'); closeMenu(); };
  const verPartidos = () => { navigate('/partidos'); closeMenu(); };
  const verLogros = () => { navigate('/logros'); closeMenu(); };
  const verTarjetas = () => { navigate('/tarjetas'); closeMenu(); };
  const verEquipos = () => { navigate('/equipos'); closeMenu(); };
  const crearEquipo = () => { navigate('/crear-equipo'); closeMenu(); };
  const verTorneos = () => { navigate('/torneos'); closeMenu(); };
  const crearTorneo = () => { navigate('/crear-torneo'); closeMenu(); };
  const crearAmistoso = () => { navigate('/crear-amistoso'); closeMenu(); };
  const jugarPenaltis = () => { navigate('/penaltis'); closeMenu(); };
  const centroJuegos = () => { window.location.href = './juegos.html'; closeMenu(); };
  const verCardFutpro = () => { navigate('/card-futpro'); closeMenu(); };
  const sugerenciasCard = () => { navigate('/sugerencias-card'); closeMenu(); };
  const verNotificaciones = () => { navigate('/notificaciones'); closeMenu(); };
  const abrirChat = () => { navigate('/chat'); closeMenu(); };
  const verVideos = () => { navigate('/videos'); closeMenu(); };
  const abrirMarketplace = () => { navigate('/marketplace'); closeMenu(); };
  const verEstados = () => { navigate('/estados'); closeMenu(); };
  const verAmigos = () => { navigate('/amigos'); closeMenu(); };
  const abrirTransmisionEnVivo = () => { navigate('/transmision-vivo'); closeMenu(); };
  const rankingJugadores = () => { navigate('/ranking-jugadores'); closeMenu(); };
  const rankingEquipos = () => { navigate('/ranking-equipos'); closeMenu(); };
  const buscarRanking = () => { navigate('/buscar-ranking'); closeMenu(); };
  const abrirConfiguracion = () => { navigate('/configuracion'); closeMenu(); };
  const abrirConfiguracionCuenta = () => { window.location.href = './configuracion-cuenta.html'; closeMenu(); };
  const contactarSoporte = () => { navigate('/soporte'); closeMenu(); };
  const verPrivacidad = () => { navigate('/privacidad'); closeMenu(); };
  const cerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
    closeMenu();
  };

  return (
    <div className="futpro-layout">
      {/* HEADER */}
      <header className="futpro-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="futpro-title">FutPro</h1>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Buscar equipos, usuarios..."
              className="search-input"
            />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <button className="hamburger-btn" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* MENÚ DESPLEGABLE */}
      {menuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
            {/* SECCIÓN PRINCIPAL */}
            <div className="menu-section-title">Principal</div>
            <button className="dropdown-item" onClick={irAInicio}>
              <i className="fas fa-home"></i>
              <span>Inicio</span>
            </button>
            <button className="dropdown-item" onClick={irAPerfil}>
              <i className="fas fa-user-circle"></i>
              <span>Mi Perfil</span>
            </button>
            <button className="dropdown-item" onClick={editarPerfil}>
              <i className="fas fa-edit"></i>
              <span>Editar Perfil</span>
            </button>
            <button className="dropdown-item" onClick={verEstadisticas}>
              <i className="fas fa-chart-bar"></i>
              <span>Mis Estadísticas</span>
            </button>
            <button className="dropdown-item" onClick={verPartidos}>
              <i className="fas fa-calendar-alt"></i>
              <span>Mis Partidos</span>
            </button>
            <button className="dropdown-item" onClick={verLogros}>
              <i className="fas fa-medal"></i>
              <span>Mis Logros</span>
            </button>
            <button className="dropdown-item" onClick={verTarjetas}>
              <i className="fas fa-id-badge"></i>
              <span>Mis Tarjetas</span>
              <span className="badge-new">Nuevo</span>
            </button>

            <div className="menu-separator"></div>

            {/* SECCIÓN EQUIPOS Y TORNEOS */}
            <div className="menu-section-title">Equipos & Torneos</div>
            <button className="dropdown-item" onClick={verEquipos}>
              <i className="fas fa-users"></i>
              <span>Ver Equipos</span>
            </button>
            <button className="dropdown-item" onClick={crearEquipo}>
              <i className="fas fa-plus-square"></i>
              <span>Crear Equipo</span>
            </button>
            <button className="dropdown-item" onClick={verTorneos}>
              <i className="fas fa-trophy"></i>
              <span>Ver Torneos</span>
            </button>
            <button className="dropdown-item" onClick={crearTorneo}>
              <i className="fas fa-plus-circle"></i>
              <span>Crear Torneo</span>
            </button>
            <button className="dropdown-item" onClick={crearAmistoso}>
              <i className="fas fa-handshake"></i>
              <span>Crear Amistoso</span>
              <span className="badge-new">Nuevo</span>
            </button>

            <div className="menu-separator"></div>

            {/* SECCIÓN JUEGOS Y CARDS */}
            <div className="menu-section-title">Juegos & Cards</div>
            <button className="dropdown-item" onClick={jugarPenaltis}>
              <i className="fas fa-futbol"></i>
              <span>Juego de Penaltis</span>
            </button>
            <button className="dropdown-item" onClick={centroJuegos}>
              <i className="fas fa-gamepad"></i>
              <span>Centro de Juegos</span>
            </button>
            <button className="dropdown-item" onClick={verCardFutpro}>
              <i className="fas fa-id-card"></i>
              <span>Card Futpro</span>
            </button>
            <button className="dropdown-item" onClick={sugerenciasCard}>
              <i className="fas fa-lightbulb"></i>
              <span>Sugerencias Card</span>
            </button>

            <div className="menu-separator"></div>

            {/* SECCIÓN SOCIAL */}
            <div className="menu-section-title">Social</div>
            <button className="dropdown-item" onClick={verNotificaciones}>
              <i className="fas fa-bell"></i>
              <span>Notificaciones</span>
            </button>
            <button className="dropdown-item" onClick={abrirChat}>
              <i className="fas fa-comments"></i>
              <span>Chat</span>
            </button>
            <button className="dropdown-item" onClick={verVideos}>
              <i className="fas fa-video"></i>
              <span>Videos</span>
              <span className="badge-new">Nuevo</span>
            </button>
            <button className="dropdown-item" onClick={abrirMarketplace}>
              <i className="fas fa-store"></i>
              <span>Marketplace</span>
            </button>
            <button className="dropdown-item" onClick={verEstados}>
              <i className="fas fa-clipboard-list"></i>
              <span>Estados</span>
              <span className="badge-new">Nuevo</span>
            </button>
            <button className="dropdown-item" onClick={verAmigos}>
              <i className="fas fa-user-friends"></i>
              <span>Amigos</span>
              <span className="badge-new">Nuevo</span>
            </button>
            <button className="dropdown-item" onClick={abrirTransmisionEnVivo}>
              <i className="fas fa-broadcast-tower"></i>
              <span style={{color: '#FF1744'}}>Transmitir en Vivo</span>
            </button>

            <div className="menu-separator"></div>

            {/* SECCIÓN RANKINGS */}
            <div className="menu-section-title">Rankings</div>
            <button className="dropdown-item" onClick={rankingJugadores}>
              <i className="fas fa-list-ol"></i>
              <span>Ranking Jugadores</span>
            </button>
            <button className="dropdown-item" onClick={rankingEquipos}>
              <i className="fas fa-chart-line"></i>
              <span>Ranking Equipos</span>
            </button>
            <button className="dropdown-item" onClick={buscarRanking}>
              <i className="fas fa-search"></i>
              <span>Buscar Ranking</span>
            </button>

            <div className="menu-separator"></div>

            {/* SECCIÓN ADMINISTRACIÓN */}
            <div className="menu-section-title">Administración</div>
            <button className="dropdown-item" onClick={abrirConfiguracion}>
              <i className="fas fa-cog"></i>
              <span>Configuración</span>
              <span className="badge-react">React</span>
            </button>
            <button className="dropdown-item" onClick={abrirConfiguracionCuenta}>
              <i className="fas fa-user-cog"></i>
              <span>Configuración de Cuenta</span>
            </button>
            <button className="dropdown-item" onClick={sugerenciasCard}>
              <i className="fas fa-lightbulb"></i>
              <span>Sugerencias Card</span>
            </button>
            <button className="dropdown-item" onClick={contactarSoporte}>
              <i className="fas fa-life-ring"></i>
              <span>Soporte</span>
              <span className="badge-new">Nuevo</span>
            </button>
            <button className="dropdown-item" onClick={verPrivacidad}>
              <i className="fas fa-shield-alt"></i>
              <span>Privacidad</span>
            </button>

            <div className="menu-separator"></div>

            <button className="dropdown-item logout-btn" onClick={cerrarSesion}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="futpro-main">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="futpro-footer">
        <p>&copy; 2025 FutPro - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default MainLayout;
