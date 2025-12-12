import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import LoginRegisterForm from './pages/LoginRegisterFormClean';
import RegistroNuevo from './pages/RegistroNuevo';
import RegistroPerfil from './pages/RegistroPerfil';
import Estados from './pages/Estados';
import Amigos from './pages/Amigos';
import ConfiguracionPage from './pages/ConfiguracionPage';
import Configuracion from './pages/Configuracion';
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
import HomeInstagram from './pages/HomeInstagram';
import HomeRedirect from './pages/HomeRedirect';
import PerfilCard from './pages/PerfilCard';
import SeleccionCategoria from './pages/SeleccionCategoria';
import FormularioRegistroCompleto from './pages/FormularioRegistroCompleto';
import Logros from './pages/Logros';
import EstadisticasAvanzadasPage from './pages/EstadisticasAvanzadasPage';


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
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* HomePage es la ruta raíz SIN Layout */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas de autenticación - SIN Layout */}
        <Route path="/login" element={<AuthPageUnificada />} />
        <Route path="/registro" element={<AuthPageUnificada />} />
        <Route path="/registro-nuevo" element={<RegistroNuevo />} />
        <Route path="/seleccionar-categoria" element={<SeleccionCategoria />} />
        <Route path="/formulario-registro" element={<FormularioRegistroCompleto />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/perfil-card" element={<PerfilCard />} />
        <Route path="/registro-perfil" element={<RegistroPerfil />} />
        <Route path="/registro-google" element={<AuthPageUnificada />} />
        <Route path="/registro-facebook" element={<AuthPageUnificada />} />
        <Route path="/registro-email" element={<AuthPageUnificada />} />
        <Route path="/auth" element={<AuthPageUnificada />} />
        <Route path="/home-instagram" element={<Layout><HomeInstagram /></Layout>} />
        
        {/* Rutas principales - CON Layout */}
        {/* Redirigir /home al home definitivo estático */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<Layout><FeedPage /></Layout>} />
        <Route path="/perfil/me" element={<Layout><PerfilInstagram /></Layout>} />
        <Route path="/perfil/:userId" element={<Layout><PerfilInstagram /></Layout>} />
        <Route path="/notificaciones" element={<Layout><Notificaciones /></Layout>} />
        <Route path="/admin" element={<Layout><PageInDevelopment title="⚙️ Panel de Administración" icon="⚙️" /></Layout>} />
      <Route path="/equipo/:id" element={<Layout><EquipoDetallePage /></Layout>} />
      <Route path="/torneo/:id" element={<Layout><TorneoDetallePage /></Layout>} />
      <Route path="/usuario/:id" element={<Layout><UsuarioDetallePage /></Layout>} />
      <Route path="/ranking" element={<Layout><EstadisticasPage /></Layout>} />
      <Route path="/progreso" element={<Layout><Progreso /></Layout>} />
      <Route path="/penaltis" element={<Layout><Penaltis /></Layout>} />
      <Route path="/historial-penaltis" element={<Layout><HistorialPage /></Layout>} />
      <Route path="/ayuda" element={<Layout><PageInDevelopment title="❓ Centro de Ayuda" icon="❓" /></Layout>} />
      <Route path="/configuracion" element={<Layout><ConfiguracionPage /></Layout>} />
      <Route path="/compartir" element={<Layout><PageInDevelopment title="📤 Compartir Contenido" icon="📤" /></Layout>} />
      <Route path="/chat-sql" element={<Layout><PageInDevelopment title="💬 Chat SQL" icon="💬" /></Layout>} />
      {/* Marketplace completo */}
      <Route path="/marketplace" element={<Layout><MarketplaceCompleto /></Layout>} />
        <Route path="/logros" element={<Layout><Logros /></Layout>} />
      <Route path="/estadisticas-avanzadas" element={<Layout><EstadisticasAvanzadasPage /></Layout>} />
        <Route path="/comparativas" element={<Layout><PageInDevelopment title="📊 Comparativas" icon="📊" /></Layout>} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/tarjetas" element={<Tarjetas />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/crear-equipo" element={<CrearEquipo />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/crear-torneo" element={<CrearTorneo />} />
        <Route path="/amistoso" element={<Amistoso />} />
        <Route path="/penaltis" element={<Penaltis />} />
        <Route path="/card-fifa" element={<CardFIFA />} />
        <Route path="/sugerencias-card" element={<SugerenciasCard />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/videos" element={<VideosFeed />} />
        <Route path="/marketplace" element={<MarketplaceCompleto />} />
        <Route path="/estados" element={<Estados />} />
        <Route path="/amigos" element={<Amigos />} />
        <Route path="/transmision-en-vivo" element={<TransmisionEnVivo />} />
        <Route path="/ranking-jugadores" element={<RankingJugadoresCompleto />} />
        <Route path="/ranking-equipos" element={<RankingEquiposCompleto />} />
        <Route path="/buscar-ranking" element={<BuscarRanking />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}
