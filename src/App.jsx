import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext.jsx';
import { useAuth } from './context/AuthContext';
import SidebarMenu from './components/SidebarMenu';
import FeedPage from './pages/FeedPage';
import PerfilInstagram from './pages/PerfilInstagram';
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
import VideosFeed from './pages/VideosFeed';
import MarketplaceCompleto from './pages/MarketplaceCompleto';
import TransmisionEnVivo from './pages/TransmisionEnVivo';
import RankingJugadoresCompleto from './pages/RankingJugadoresCompleto';
import RankingEquiposCompleto from './pages/RankingEquiposCompleto';
import BuscarRanking from './pages/BuscarRanking';
import Soporte from './pages/Soporte';
import Privacidad from './pages/Privacidad';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import PerfilCard from './pages/PerfilCard';
import SeleccionCategoria from './pages/SeleccionCategoria';
import FormularioRegistroCompleto from './pages/FormularioRegistroCompleto';
import Logros from './pages/Logros';
import EstadisticasAvanzadasPage from './pages/EstadisticasAvanzadasPage';
import SeccionPlaceholder from './pages/SeccionPlaceholder';
import RegistroPerfil from './pages/RegistroPerfil';


function Layout({ children }) {
  return (
    <div style={{display:'flex',height:'100vh',background:'#181818'}}>
      <SidebarMenu />
      <main style={{flex:1,padding:'32px',overflowY:'auto',background:'#232323',color:'#FFD700', position:'relative'}}>
        {children}
        <BottomNav />
      </main>
    </div>
  );
}
function RootRoute() {
  // Decide qué mostrar en la raíz: login si no hay usuario, homepage si ya está autenticado
  const { user } = useAuth();
  return user ? <HomePage /> : <LoginFallback />;
}

// El render principal debe estar dentro de la función principal exportada
export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <Router>
          <Routes>
            {/* Raíz: muestra Login si no hay sesión, Home si autenticado */}
            <Route path="/" element={<RootRoute />} />
            {/* 🔐 FLUJO DE AUTENTICACIÓN LIMPIO */}
            <Route path="/login" element={<LoginFallback />} />
            <Route path="/registro" element={<LoginFallback />} />
            <Route path="/auth" element={<LoginFallback />} />
            <Route path="/registro-nuevo" element={<RegistroPerfil />} />
            <Route path="/registro-perfil" element={<RegistroPerfil />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/perfil-card" element={<PerfilCard />} />
        <Route path="/seccion/:slug" element={<SeccionPlaceholder />} />
        
        {/* 🏠 RUTAS PRINCIPALES - CON LAYOUT */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<Layout><FeedPage /></Layout>} />
        <Route path="/perfil/me" element={<Layout><PerfilInstagram /></Layout>} />
        <Route path="/perfil/:userId" element={<Layout><PerfilInstagram /></Layout>} />
        <Route path="/notificaciones" element={<Layout><Notificaciones /></Layout>} />
        <Route path="/admin" element={<Layout><PageInDevelopment title="⚙️ Panel Admin" icon="⚙️" /></Layout>} />
        
        {/* 🎮 JUEGOS Y MINIJUEGOS */}
        <Route path="/penaltis" element={<Layout><Penaltis /></Layout>} />
        <Route path="/card-fifa" element={<CardFIFA />} />
        <Route path="/sugerencias-card" element={<SugerenciasCard />} />
        
        {/* 🏟️ EQUIPOS Y TORNEOS */}
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/crear-equipo" element={<CrearEquipo />} />
        <Route path="/equipo/:id" element={<Layout><EquipoDetallePage /></Layout>} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/crear-torneo" element={<CrearTorneo />} />
        <Route path="/torneo/:id" element={<Layout><TorneoDetallePage /></Layout>} />
        <Route path="/amistoso" element={<Amistoso />} />
        <Route path="/tarjetas" element={<Tarjetas />} />
        
        {/* 📊 ESTADÍSTICAS Y RANKING */}
        <Route path="/ranking" element={<Layout><EstadisticasPage /></Layout>} />
        <Route path="/ranking-jugadores" element={<RankingJugadoresCompleto />} />
        <Route path="/ranking-equipos" element={<RankingEquiposCompleto />} />
        <Route path="/buscar-ranking" element={<BuscarRanking />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/estadisticas-avanzadas" element={<Layout><EstadisticasAvanzadasPage /></Layout>} />
        <Route path="/progreso" element={<Layout><Progreso /></Layout>} />
        <Route path="/historial-penaltis" element={<Layout><HistorialPage /></Layout>} />
        <Route path="/usuario/:id" element={<Layout><UsuarioDetallePage /></Layout>} />
        
        {/* 💬 COMUNICACIÓN Y SOCIAL */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/estados" element={<Estados />} />
        <Route path="/amigos" element={<Amigos />} />
        <Route path="/transmision-en-vivo" element={<TransmisionEnVivo />} />
        
        {/* 🛒 MARKETPLACE Y TIENDA */}
        <Route path="/marketplace" element={<Layout><MarketplaceCompleto /></Layout>} />
        
        {/* 📸 CONTENIDO MULTIMEDIA */}
        <Route path="/videos" element={<VideosFeed />} />
        
        {/* ⚙️ USUARIO Y CONFIGURACIÓN */}
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/configuracion" element={<Layout><ConfiguracionPage /></Layout>} />
        <Route path="/logros" element={<Layout><Logros /></Layout>} />
        
        {/* 📄 INFORMACIÓN */}
        <Route path="/ayuda" element={<Layout><PageInDevelopment title="❓ Centro de Ayuda" icon="❓" /></Layout>} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/comparativas" element={<Layout><PageInDevelopment title="📊 Comparativas" icon="📊" /></Layout>} />
        <Route path="/compartir" element={<Layout><PageInDevelopment title="📤 Compartir" icon="📤" /></Layout>} />
        <Route path="/chat-sql" element={<Layout><PageInDevelopment title="💬 Chat SQL" icon="💬" /></Layout>} />
        
        {/* ❌ CATCH-ALL (404) */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
      </Router>
      </NotificationsProvider>
    </AuthProvider>
  );
}
