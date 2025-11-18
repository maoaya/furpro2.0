const DashboardPage = lazy(() => import('./DashboardPage'));
const ArbitroFuncionesPage = lazy(() => import('./ArbitroFuncionesPage'));
const CrearLogoPage = lazy(() => import('./CrearLogoPage'));
const EquipoTecnicoPage = lazy(() => import('./EquipoTecnicoPage'));
const ChatPage = lazy(() => import('./ChatPage'));
const GruposPage = lazy(() => import('./GruposPage'));
const PenaltisPage = lazy(() => import('./PenaltisPage'));
const PuntosUsuarioPage = lazy(() => import('./PuntosUsuarioPage'));
const PartidosAmistososPage = lazy(() => import('./PartidosAmistososPage'));
const PerfilArbitroPage = lazy(() => import('./PerfilArbitroPage'));
const PerfilArbitroEditarPage = lazy(() => import('./PerfilArbitroEditarPage'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminUsersPage = lazy(() => import('./admin/AdminUsersPage'));
const AdminPagosPage = lazy(() => import('./admin/AdminPagosPage'));
const AdminReportesPage = lazy(() => import('./admin/AdminReportesPage'));
const AdminNotificacionesPage = lazy(() => import('./admin/AdminNotificacionesPage'));
const AdminEstadisticasPage = lazy(() => import('./admin/AdminEstadisticasPage'));
const AdminAuditoriaPage = lazy(() => import('./admin/AdminAuditoriaPage'));
const AdminConfiguracionPage = lazy(() => import('./admin/AdminConfiguracionPage'));
import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { RoleProvider } from '../context/RoleContext';
import { useNavigationMonitor } from '../hooks/useNavigationMonitor';
import NavigationMonitor from '../components/NavigationMonitor';

const RegistroPage = lazy(() => import('./RegistroPage'));
const RecuperarPassword = lazy(() => import('./RecuperarPassword'));

// Importa páginas principales (usar lazy para optimizar)
const HomePage = lazy(() => import('./HomePage'));
const UsuariosPage = lazy(() => import('./UsuariosPage'));
const TorneosPage = lazy(() => import('./TorneosPage'));
const EquipoDetallePage = lazy(() => import('./EquipoDetallePage'));
const PartidoDetalle = lazy(() => import('./PartidoDetalle'));
const RankingPage = lazy(() => import('./RankingPage'));
const PaymentsPage = lazy(() => import('./PaymentsPage'));
const ModerationPage = lazy(() => import('./ModerationPage'));
const HistorialPage = lazy(() => import('./HistorialPage'));
const NotificationsPage = lazy(() => import('./NotificationsPage'));
const IntegracionesPage = lazy(() => import('./IntegracionesPage'));
const PrivacidadPage = lazy(() => import('./PrivacidadPage'));
const ConfiguracionPage = lazy(() => import('./ConfiguracionPage'));
const OrganizerDashboard = lazy(() => import('./OrganizerDashboard'));
const MediaPage = lazy(() => import('./MediaPage'));
const StreamingPage = lazy(() => import('./LiveStreamPage'));
const MarketplacePage = lazy(() => import('./MarketplacePage'));
const HistoriasPage = lazy(() => import('./HistoriasPage'));
const DemoTutorialPage = lazy(() => import('./DemoTutorialPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));

// Rutas protegidas por rol
function PrivateRoute({ children, roles }) {
  const { user, role } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (roles && !roles.includes(role)) return <Navigate to="/" />;
  return children;
}

export default function AppRouter() {
  const { user } = React.useContext(AuthContext);
  const location = window.location.pathname;
  const navigate = require('react-router-dom').useNavigate?.() || (() => {});

  // Monitoreo de navegación
  useNavigationMonitor((navigationEvent) => {
    // Aquí puedes agregar lógica adicional para procesar eventos de navegación
    if (navigationEvent.to.includes('/registro') && navigationEvent.from !== navigationEvent.to) {
      console.log('🚨 USUARIO ACCEDIÓ A PÁGINA DE REGISTRO');
    }
    if (navigationEvent.from.includes('/registro') && navigationEvent.to !== navigationEvent.from) {
      console.log('🚨 USUARIO SALIÓ DE PÁGINA DE REGISTRO hacia:', navigationEvent.to);
    }
  });

  React.useEffect(() => {
    if (user && location === '/') {
      navigate('/home');
    }
  }, [user, location, navigate]);
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <nav style={{ background: '#222', color: '#FFD700', padding: 16, display: 'flex', gap: 18 }}>
            <Link to="/" style={{ color: '#FFD700', marginRight: 16 }}>Inicio</Link>
            <Link to="/seleccionar-categoria" style={{ color: '#FFD700', marginRight: 16 }}>Categoría</Link>
            <Link to="/formulario-registro" style={{ color: '#FFD700', marginRight: 16 }}>Registro</Link>
            <Link to="/perfil-card" style={{ color: '#FFD700', marginRight: 16 }}>Perfil Card</Link>
            <Link to="/home" style={{ color: '#FFD700', marginRight: 16 }}>Home</Link>
            <Link to="/chat" style={{ color: '#FFD700', marginRight: 16 }}>Chat</Link>
            <Link to="/equipos" style={{ color: '#FFD700', marginRight: 16 }}>Equipos</Link>
            <Link to="/torneo" style={{ color: '#FFD700', marginRight: 16 }}>Torneo</Link>
            <Link to="/amistoso" style={{ color: '#FFD700', marginRight: 16 }}>Amistoso</Link>
            <Link to="/juegos" style={{ color: '#FFD700', marginRight: 16 }}>Juegos</Link>
            <Link to="/penaltis" style={{ color: '#FFD700', marginRight: 16 }}>Penaltis</Link>
            <Link to="/sugerencias-card" style={{ color: '#FFD700', marginRight: 16 }}>Sugerencias Card</Link>
            <Link to="/notificaciones" style={{ color: '#FFD700', marginRight: 16 }}>Notificaciones</Link>
            <Link to="/videos" style={{ color: '#FFD700', marginRight: 16 }}>Videos</Link>
            <Link to="/marketplace" style={{ color: '#FFD700', marginRight: 16 }}>Marketplace</Link>
            <Link to="/estados" style={{ color: '#FFD700', marginRight: 16 }}>Estados</Link>
            <Link to="/amigos" style={{ color: '#FFD700', marginRight: 16 }}>Amigos</Link>
            <Link to="/ranking" style={{ color: '#FFD700', marginRight: 16 }}>Ranking</Link>
            <Link to="/buscar-ranking" style={{ color: '#FFD700', marginRight: 16 }}>Buscar Ranking</Link>
            <Link to="/configuracion" style={{ color: '#FFD700', marginRight: 16 }}>Configuración</Link>
            <Link to="/soporte" style={{ color: '#FFD700', marginRight: 16 }}>Soporte</Link>
            <Link to="/privacidad" style={{ color: '#FFD700', marginRight: 16 }}>Privacidad</Link>
          </nav>
          <Suspense fallback={<div style={{ color: '#FFD700', padding: 32 }}>Cargando...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/seleccionar-categoria" element={<SeleccionCategoria />} />
              <Route path="/formulario-registro" element={<FormularioRegistroCompleto />} />
              <Route path="/perfil-card" element={<PerfilCard />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/equipos" element={<Equipos />} />
              <Route path="/torneo" element={<Torneos />} />
              <Route path="/amistoso" element={<AmistososPanel />} />
              <Route path="/juegos" element={<Juegos />} />
              <Route path="/penaltis" element={<PenaltisPage />} />
              <Route path="/sugerencias-card" element={<SugerenciasCardPage />} />
              <Route path="/notificaciones" element={<NotificacionesPanel />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/marketplace" element={<MarketplacePanel />} />
              <Route path="/estados" element={<Estados />} />
              <Route path="/amigos" element={<AmigosPanel />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/buscar-ranking" element={<RankingPage />} />
              <Route path="/configuracion" element={<ConfiguracionPanel />} />
              <Route path="/soporte" element={<ContactarSoporte />} />
              <Route path="/privacidad" element={<PrivacidadPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          {/* Monitor de navegación para debugging */}
          <NavigationMonitor />
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
}
