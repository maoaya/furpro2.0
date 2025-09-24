import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppRouter from './pages/AppRouter';
import TorneosPage from './pages/TorneosPage';
import ChatPage from './components/ChatPage';
import ChatSQLPage from './pages/ChatSQLPage';
import BuscarMisCampeonatosPage from './pages/BuscarMisCampeonatosPage';
import CompartirContenidoPage from './pages/CompartirContenidoPage';
import MarketplacePage from './pages/MarketplacePage';
import ArbitrosPage from './pages/ArbitrosPage';
import PoliticasPage from './pages/PoliticasPage';
import PoliticasPrivacidad from './pages/PoliticasPrivacidad';
import JugadoresPatrocinadoresPage from './pages/JugadoresPatrocinadoresPage';
import QuienesSomosPage from './pages/QuienesSomosPage';
// import NotFoundPage from './pages/NotFoundPage';
import PerfilPage from './pages/PerfilPage.jsx';
import EquiposPage from './pages/EquiposPage.jsx';
import EquipoDetallePage from './pages/EquipoDetallePage.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';
// Placeholders para nuevas rutas avanzadas
const HistorialEquipo = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Historial de equipo</div>;
const HistorialTorneo = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Historial de torneo</div>;
const HistorialUsuario = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Historial de usuario</div>;
const ReportesGenerales = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Reportes generales</div>;
const FeedDetalle = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Detalle de publicación</div>;
const FeedNuevo = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Crear nueva publicación</div>;
const DashboardGeneral = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Dashboard general</div>;
const DashboardAdmin = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Dashboard de administración</div>;
const IntegracionDetalle = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Detalle de integración</div>;
// const ApiDoc = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Documentación/prueba de API</div>;
const SoporteChat = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Chat de soporte</div>;
// const AyudaFAQ = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Preguntas frecuentes</div>;
const MarketplaceDetalle = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Detalle de producto/servicio</div>;
// const PagosHistorial = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Historial de pagos</div>;
const ModeracionReportes = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Reportes de moderación</div>;
// const AdminUsuarios = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Gestión de usuarios</div>;
const NotificacionDetalle = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Detalle de notificación</div>;
const ActividadReciente = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Actividad reciente</div>;
const StreamingDetalle = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Detalle de transmisión</div>;
const MediaDetalle = () => <div style={{ color: '#FFD700', background: '#181818', padding: 32 }}>Detalle de archivo multimedia</div>;
import EquipoEditarPage from './pages/EquipoEditarPage';
import TorneoEditarPage from './pages/TorneoEditarPage';
import PartidoDetallePage from './pages/PartidoDetallePage';
import PartidoEditarPage from './pages/PartidoEditarPage';
import UsuarioEditarPage from './pages/UsuarioEditarPage';
import AdminPanelPage from './pages/AdminPanelPage';
import RankingDashboard from './components/RankingDashboard.jsx';

export default function FutProRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppRouter />} />
        <Route path="/perfil" element={<PerfilPage usuario="demo" />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/equipos/:equipoId" element={<EquipoDetallePage />} />
        <Route path="/equipos/:equipoId/editar" element={<EquipoEditarPage />} />
        <Route path="/torneos" element={<TorneosPage />} />
        <Route path="/torneos/:torneoId" element={<div>Detalle de torneo</div>} />
        <Route path="/torneos/:torneoId/editar" element={<TorneoEditarPage />} />
        <Route path="/partidos" element={<div>Listado de partidos</div>} />
        <Route path="/partidos/:partidoId" element={<PartidoDetallePage />} />
        <Route path="/partidos/:partidoId/editar" element={<PartidoEditarPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/usuarios/:usuarioId" element={<div>Detalle de usuario</div>} />
        <Route path="/usuarios/:usuarioId/editar" element={<UsuarioEditarPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/ranking" element={<RankingDashboard />} />
        <Route path="/organizador" element={<div>Dashboard organizador</div>} />
        <Route path="/media" element={<div>Galería multimedia</div>} />
        <Route path="/streaming" element={<div>Streaming</div>} />
        <Route path="/feed" element={<div>Feed social</div>} />
        <Route path="/estadisticas" element={<div>Estadísticas</div>} />
        <Route path="/estadisticas-avanzadas" element={<div>Estadísticas avanzadas</div>} />
        <Route path="/pagos" element={<div>Pagos</div>} />
        <Route path="/pagos-marketplace" element={<div>Marketplace de pagos</div>} />
        <Route path="/moderacion" element={<div>Moderación</div>} />
        <Route path="/historial" element={<div>Historial</div>} />
        <Route path="/notificaciones" element={<div>Notificaciones</div>} />
        <Route path="/integraciones" element={<div>Integraciones</div>} />
        <Route path="/integraciones-api" element={<div>Integraciones API</div>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/chat-sql" element={<ChatSQLPage />} />
        <Route path="/campeonatos" element={<BuscarMisCampeonatosPage />} />
        <Route path="/compartir" element={<CompartirContenidoPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/arbitros" element={<ArbitrosPage />} />
        <Route path="/arbitros/:id" element={<div>Detalle de árbitro</div>} />
        <Route path="/politicas" element={<PoliticasPage />} />
        <Route path="/privacidad" element={<PoliticasPrivacidad />} />
        <Route path="/patrocinadores" element={<JugadoresPatrocinadoresPage />} />
        <Route path="/quienes-somos" element={<QuienesSomosPage />} />
        <Route path="/ayuda" element={<div>Ayuda y FAQ</div>} />
        <Route path="/soporte" element={<div>Soporte</div>} />
        <Route path="/logros" element={<div>Logros</div>} />
        <Route path="/comparativas" element={<div>Comparativas</div>} />
        <Route path="/progreso" element={<div>Progreso</div>} />
        <Route path="/recuperar-password" element={<div>Recuperar contraseña</div>} />
        <Route path="/configuracion" element={<div>Configuración</div>} />
        <Route path="/validar-usuario" element={<div>Validar usuario</div>} />
        <Route path="/validador-web-colaborativo" element={<div>Validador colaborativo</div>} />
        <Route path="/equipos/:equipoId/historial" element={<HistorialEquipo />} />
        <Route path="/torneos/:torneoId/historial" element={<HistorialTorneo />} />
        <Route path="/usuarios/:usuarioId/historial" element={<HistorialUsuario />} />
        <Route path="/reportes" element={<ReportesGenerales />} />
        <Route path="/feed/:postId" element={<FeedDetalle />} />
        <Route path="/feed/nuevo" element={<FeedNuevo />} />
        <Route path="/dashboard" element={<DashboardGeneral />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/integraciones/:id" element={<IntegracionDetalle />} />
        <Route path="/soporte/chat" element={<SoporteChat />} />
        <Route path="/marketplace/:itemId" element={<MarketplaceDetalle />} />
        <Route path="/moderacion/reportes" element={<ModeracionReportes />} />
        <Route path="/notificaciones/:id" element={<NotificacionDetalle />} />
        <Route path="/actividad" element={<ActividadReciente />} />
        <Route path="/streaming/:id" element={<StreamingDetalle />} />
        <Route path="/media/:id" element={<MediaDetalle />} />
      </Routes>
    </Router>
  );
}
