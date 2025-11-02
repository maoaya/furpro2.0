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
            <Link to="/dashboard" style={{ color: '#FFD700', marginRight: 16, fontWeight: 'bold' }}>Dashboard</Link>
            <Link to="/perfil-avanzado" style={{ color: '#FFD700', marginRight: 16, fontWeight: 'bold' }}>Perfil Avanzado</Link>
            <Link to="/usuarios" style={{ color: '#FFD700', marginRight: 16 }}>Usuarios</Link>
            <Link to="/torneos" style={{ color: '#FFD700', marginRight: 16 }}>Torneos</Link>
            <Link to="/ranking" style={{ color: '#FFD700', marginRight: 16 }}>Ranking</Link>
            <Link to="/organizador" style={{ color: '#FFD700', marginRight: 16 }}>Organizador</Link>
            <Link to="/media" style={{ color: '#FFD700', marginRight: 16 }}>Media</Link>
            <Link to="/streaming" style={{ color: '#FFD700', marginRight: 16 }}>Transmisión en Vivo</Link>
            <Link to="/historias" style={{ color: '#FFD700', marginRight: 16 }}>Historias</Link>
            <Link to="/marketplace" style={{ color: '#FFD700', marginRight: 16 }}>Marketplace</Link>
            <Link to="/configuracion" style={{ color: '#FFD700', marginRight: 16 }}>Configuración</Link>
            <Link to="/crear-logo" style={{ color: '#FFD700', marginRight: 16 }}>Crear Logo</Link>
            <Link to="/equipo-tecnico" style={{ color: '#FFD700', marginRight: 16 }}>Equipo Técnico</Link>
            <Link to="/chat" style={{ color: '#FFD700', marginRight: 16 }}>Chat</Link>
            <Link to="/grupos" style={{ color: '#FFD700', marginRight: 16 }}>Grupos</Link>
          </nav>
          <Suspense fallback={<div style={{ color: '#FFD700', padding: 32 }}>Cargando...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={React.createElement(lazy(() => import('./Dashboard')))} />
              <Route path="/perfil-avanzado" element={React.createElement(lazy(() => import('./PerfilAvanzado')))} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/torneos" element={<TorneosPage />} />
              <Route path="/equipo/:id" element={<EquipoDetallePage />} />
              <Route path="/partido/:id" element={<PartidoDetalle />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/pagos" element={<PaymentsPage />} />
              <Route path="/moderacion" element={<ModerationPage />} />
              <Route path="/historial" element={<HistorialPage />} />
              <Route path="/notificaciones" element={<NotificationsPage />} />
              <Route path="/integraciones" element={<IntegracionesPage />} />
              <Route path="/privacidad" element={<PrivacidadPage />} />
              <Route path="/configuracion" element={<ConfiguracionPage />} />
              <Route path="/organizador" element={
                <PrivateRoute roles={["admin", "organizador"]}>
                  <OrganizerDashboard />
                </PrivateRoute>
              } />
              {/* Panel de administración con subpáginas y paginación */}
              <Route path="/admin" element={
                <PrivateRoute roles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }>
                <Route path="usuarios" element={<AdminUsersPage />} />
                <Route path="pagos" element={<AdminPagosPage />} />
                <Route path="reportes" element={<AdminReportesPage />} />
                <Route path="notificaciones" element={<AdminNotificacionesPage />} />
                <Route path="estadisticas" element={<AdminEstadisticasPage />} />
                <Route path="auditoria" element={<AdminAuditoriaPage />} />
                <Route path="configuracion" element={<AdminConfiguracionPage />} />
              </Route>
              <Route path="/media" element={<MediaPage />} />
              <Route path="/streaming" element={<StreamingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/historias" element={<HistoriasPage />} />
              <Route path="/tutorial" element={<DemoTutorialPage />} />
              <Route path="/penaltis" element={<PenaltisPage />} />
              <Route path="/puntos" element={<PuntosUsuarioPage />} />
              <Route path="/amistosos" element={<PartidosAmistososPage />} />
              <Route path="/auth" element={React.createElement(lazy(() => import('./auth/AuthPage')))} />
              <Route path="/arbitro" element={<PerfilArbitroPage />} />
              <Route path="/arbitro/editar" element={<PerfilArbitroEditarPage />} />
              <Route path="/crear-logo" element={<CrearLogoPage />} />
                <Route path="/registro" element={<RegistroPage />} />
                <Route path="/recuperar-password" element={<RecuperarPassword />} />
              <Route path="/equipo-tecnico" element={<EquipoTecnicoPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/grupos" element={<GruposPage />} />
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
