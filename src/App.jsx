import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext.jsx';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import FeedPage from './pages/FeedPage';
import PerfilInstagram from './pages/PerfilInstagram';
import PerfilNuevo from './pages/PerfilNuevo';
import Notificaciones from './pages/Notificaciones';
import PageInDevelopment from './components/PageInDevelopment';
import EquipoDetallePage from './pages/EquipoDetallePage';
import TorneoDetallePage from './pages/TorneoDetallePage';
import UsuarioDetallePage from './pages/UsuarioDetallePage';
import EstadisticasPage from './pages/EstadisticasPage';
import Progreso from './pages/Progreso';
import Penaltis from './pages/Penaltis';
import HistorialPage from './pages/HistorialPage';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AuthPageUnificada from './pages/AuthPageUnificada';
import Estados from './pages/Estados';
import Amigos from './pages/Amigos';
import LoginFallback from './components/LoginFallback.jsx';
import AuthCallback from './pages/auth/AuthCallback';
import EditarPerfil from './pages/EditarPerfil';
import Estadisticas from './pages/Estadisticas';
import Partidos from './pages/Partidos';
import Tarjetas from './pages/Tarjetas';
import Equipos from './pages/Equipos';
import CrearEquipo from './pages/CrearEquipo';
import Torneos from './pages/Torneos';
import CrearTorneo from './pages/CrearTorneo';
import Amistoso from './pages/Amistoso';
import CardFIFA from './pages/CardFIFA';
import SugerenciasCard from './pages/SugerenciasCard';
import Chat from './pages/Chat';
import ChatInstagram from './pages/ChatInstagram';
import VideosFeed from './pages/VideosFeed';
import MarketplaceCompleto from './pages/MarketplaceCompleto';
import LiveStreamPage from './pages/LiveStreamPage';
import RankingJugadoresCompleto from './pages/RankingJugadoresCompleto';
import RankingEquiposCompleto from './pages/RankingEquiposCompleto';
import BuscarRanking from './pages/BuscarRanking';
import Soporte from './pages/Soporte';
import Privacidad from './pages/Privacidad';
import ConfiguracionPage from './pages/ConfiguracionPage';
import HomePage from './pages/HomePage';
import PerfilCard from './pages/PerfilCard';
import SeleccionCategoria from './pages/SeleccionCategoria';
import FormularioRegistroCompleto from './pages/FormularioRegistroCompleto';
import Logros from './pages/Logros';
import EstadisticasAvanzadasPage from './pages/EstadisticasAvanzadasPage';
import SeccionPlaceholder from './pages/SeccionPlaceholder';
import RegistroPerfil from './pages/RegistroPerfil';
import LoginPage from './pages/LoginPage';
import DiagnosticoFunciones from './pages/DiagnosticoFunciones';
import MisInvitaciones from './pages/MisInvitaciones';
import ConvocarJugadores from './pages/ConvocarJugadores';
import PlantillaEquipo from './pages/PlantillaEquipo';
import SubirHistoria from './pages/SubirHistoria';
import CrearTorneoAvanzado from './pages/CrearTorneoAvanzado';
import ChatInstagramNew from './pages/ChatInstagramNew';
import PenaltisMultijugador from './pages/PenaltisMultijugador';
import CrearTorneoCompleto from './pages/CrearTorneoCompleto';
import ArbitroPanelPage from './pages/ArbitroPanelPage';
import TorneoStandingsPage from './pages/TorneoStandingsPage';
import TorneoBracketPage from './pages/TorneoBracketPage';
import NotificacionesTorneoPage from './pages/NotificacionesTorneoPage';
import CrearTorneoMejorado from './components/CrearTorneoMejorado';
import RankingMejorado from './components/RankingMejorado';
import MiEquipoMejorado from './components/MiEquipoMejorado';

// Páginas SIN TopNav + BottomNav (Login, Registro, Card, Perfil)
const EXCLUDED_ROUTES = ['/login', '/registro', '/auth', '/registro-nuevo', '/registro-perfil', '/perfil-card', '/auth/callback', '/perfil', '/perfil/me'];

function RootRoute() {
  const { user, loading } = useAuth();
  
  // Mostrar loading si está cargando
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
        <div style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>Cargando...</div>
      </div>
    );
  }
  
  // Si hay usuario, mostrar HomePage con layout
  if (user && user.email) {
    return <MainLayout><HomePage /></MainLayout>;
  }
  
  // Si no hay usuario, mostrar LoginPage
  return <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <Router>
          <Routes>
            {/* 🔐 RUTAS DE AUTENTICACIÓN - SIN LAYOUT */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<FormularioRegistroCompleto />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/registro-nuevo" element={<FormularioRegistroCompleto />} />
            <Route path="/registro-perfil" element={<RegistroPerfil />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/perfil-card" element={<PerfilCard />} />
            <Route path="/perfil" element={<PerfilNuevo />} />
            <Route path="/perfil/me" element={<PerfilNuevo />} />
            <Route path="/diagnostico-funciones" element={<MainLayout><DiagnosticoFunciones /></MainLayout>} />

            {/* 🏠 RAÍZ */}
            <Route path="/" element={<RootRoute />} />

            {/* 📱 RUTAS PRINCIPALES - CON LAYOUT */}
            <Route path="/home" element={<MainLayout><FeedPage /></MainLayout>} />
            <Route path="/feed" element={<MainLayout><FeedPage /></MainLayout>} />
            <Route path="/perfil/:userId" element={<MainLayout><PerfilInstagram /></MainLayout>} />
            <Route path="/notificaciones" element={<MainLayout><Notificaciones /></MainLayout>} />
            <Route path="/marketplace" element={<MainLayout><MarketplaceCompleto /></MainLayout>} />
            <Route path="/videos" element={<MainLayout><VideosFeed /></MainLayout>} />
            <Route path="/chat" element={<MainLayout><Chat /></MainLayout>} />
            
            {/* 🎮 JUEGOS Y MINIJUEGOS */}
            <Route path="/penaltis" element={<MainLayout><Penaltis /></MainLayout>} />
            <Route path="/card-fifa" element={<CardFIFA />} />
            <Route path="/sugerencias-card" element={<SugerenciasCard />} />
            
            {/* 🏟️ EQUIPOS Y TORNEOS */}
            <Route path="/equipos" element={<MainLayout><Equipos /></MainLayout>} />
            <Route path="/crear-equipo" element={<MainLayout><CrearEquipo /></MainLayout>} />
            <Route path="/equipo/:id" element={<MainLayout><EquipoDetallePage /></MainLayout>} />
            <Route path="/equipo/:teamId/plantilla" element={<MainLayout><PlantillaEquipo /></MainLayout>} />
            <Route path="/equipo/:teamId/plantilla-mejorada" element={<MainLayout><MiEquipoMejorado /></MainLayout>} />
            <Route path="/mi-equipo/:teamId" element={<MainLayout><MiEquipoMejorado /></MainLayout>} />
            <Route path="/convocar-jugadores/:teamId" element={<MainLayout><ConvocarJugadores /></MainLayout>} />
            <Route path="/mis-invitaciones" element={<MainLayout><MisInvitaciones /></MainLayout>} />
            <Route path="/torneos" element={<MainLayout><Torneos /></MainLayout>} />
            <Route path="/crear-torneo" element={<MainLayout><CrearTorneo /></MainLayout>} />
            <Route path="/crear-torneo-mejorado" element={<MainLayout><CrearTorneoMejorado /></MainLayout>} />
            <Route path="/crear-torneo-completo" element={<MainLayout><CrearTorneoCompleto /></MainLayout>} />
            <Route path="/torneo/:id" element={<MainLayout><TorneoDetallePage /></MainLayout>} />
            <Route path="/amistoso" element={<MainLayout><Amistoso /></MainLayout>} />
            <Route path="/tarjetas" element={<MainLayout><Tarjetas /></MainLayout>} />
            
            {/* 📊 ESTADÍSTICAS Y RANKING */}
            <Route path="/ranking" element={<MainLayout><RankingMejorado /></MainLayout>} />
            <Route path="/ranking-clasico" element={<MainLayout><EstadisticasPage /></MainLayout>} />
            <Route path="/ranking-jugadores" element={<MainLayout><RankingJugadoresCompleto /></MainLayout>} />
            <Route path="/ranking-equipos" element={<MainLayout><RankingEquiposCompleto /></MainLayout>} />
            <Route path="/buscar-ranking" element={<MainLayout><BuscarRanking /></MainLayout>} />
            <Route path="/estadisticas" element={<MainLayout><Estadisticas /></MainLayout>} />
            <Route path="/estadisticas-avanzadas" element={<MainLayout><EstadisticasAvanzadasPage /></MainLayout>} />
            <Route path="/progreso" element={<MainLayout><Progreso /></MainLayout>} />
            <Route path="/historial-penaltis" element={<MainLayout><HistorialPage /></MainLayout>} />
            <Route path="/usuario/:id" element={<MainLayout><UsuarioDetallePage /></MainLayout>} />
            
            {/* 💬 COMUNICACIÓN Y SOCIAL */}
            <Route path="/chat" element={<ChatInstagram />} />
            <Route path="/estados" element={<MainLayout><Estados /></MainLayout>} />
            <Route path="/amigos" element={<MainLayout><Amigos /></MainLayout>} />
            <Route path="/transmision-en-vivo" element={<MainLayout><LiveStreamPage /></MainLayout>} />
            <Route path="/subir-historia" element={<MainLayout><SubirHistoria /></MainLayout>} />
            
            {/* 🎯 NUEVAS CARACTERÍSTICAS: TORNEO AVANZADO, CHAT Y PENALTIS */}
            <Route path="/crear-torneo-avanzado" element={<MainLayout><CrearTorneoAvanzado /></MainLayout>} />
            <Route path="/chat-instagram-new" element={<MainLayout><ChatInstagramNew /></MainLayout>} />
            <Route path="/penaltis-multijugador" element={<MainLayout><PenaltisMultijugador /></MainLayout>} />
            <Route path="/arbitro" element={<MainLayout><ArbitroPanelPage /></MainLayout>} />
            <Route path="/torneo/:tournamentId/standings" element={<MainLayout><TorneoStandingsPage /></MainLayout>} />
            <Route path="/torneo/:tournamentId/brackets" element={<MainLayout><TorneoBracketPage /></MainLayout>} />
            <Route path="/notificaciones-torneo" element={<MainLayout><NotificacionesTorneoPage /></MainLayout>} />
            
            {/* ⚙️ USUARIO Y CONFIGURACIÓN */}
            <Route path="/editar-perfil" element={<MainLayout><EditarPerfil /></MainLayout>} />
            <Route path="/configuracion" element={<MainLayout><ConfiguracionPage /></MainLayout>} />
            <Route path="/logros" element={<MainLayout><Logros /></MainLayout>} />
            <Route path="/seccion/:slug" element={<MainLayout><SeccionPlaceholder /></MainLayout>} />
            
            {/* 📄 INFORMACIÓN */}
            <Route path="/ayuda" element={<MainLayout><PageInDevelopment title="❓ Centro de Ayuda" icon="❓" /></MainLayout>} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/comparativas" element={<MainLayout><PageInDevelopment title="📊 Comparativas" icon="📊" /></MainLayout>} />
            <Route path="/compartir" element={<MainLayout><PageInDevelopment title="📤 Compartir" icon="📤" /></MainLayout>} />
            <Route path="/chat-sql" element={<MainLayout><PageInDevelopment title="💬 Chat SQL" icon="💬" /></MainLayout>} />
            
            {/* ❌ CATCH-ALL (404) */}
            <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
          </Routes>
        </Router>
      </NotificationsProvider>
    </AuthProvider>
  );
}