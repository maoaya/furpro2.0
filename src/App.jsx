import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SidebarMenu from './components/SidebarMenu';
import FeedPage from './pages/FeedPage';
import Perfil from './pages/Perfil';
import Notificaciones from './pages/Notificaciones';
import PageInDevelopment from './components/PageInDevelopment';
import EquipoDetallePage from './pages/EquipoDetallePage';
import TorneoDetallePage from './pages/TorneoDetallePage';
import UsuarioDetallePage from './pages/UsuarioDetallePage';
import EstadisticasPage from './pages/EstadisticasPage';
import Progreso from './pages/Progreso';
import Penaltis from './pages/Penaltis';
import HistorialPage from './pages/HistorialPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPageUnificada from './pages/AuthPageUnificada';
import LoginRegisterForm from './pages/LoginRegisterFormClean';
import RegistroNuevo from './pages/RegistroNuevo';
import RegistroPerfil from './pages/RegistroPerfil';
import Estados from './pages/Estados';
import Amigos from './pages/Amigos';
import ConfiguracionPage from './pages/ConfiguracionPage';

// import SupportPage from './pages/SupportPage';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
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
          {/* Rutas de autenticación - SIN Layout */}
          <Route path="/" element={<LoginRegisterForm />} />
          <Route path="/login" element={<AuthPageUnificada />} />
          <Route path="/registro" element={<AuthPageUnificada />} />
          <Route path="/registro-nuevo" element={<RegistroNuevo />} />
          <Route path="/seleccionar-categoria" element={<SeleccionCategoria />} />
          <Route path="/formulario-registro" element={<FormularioRegistroCompleto />} />
          <Route path="/perfil-card" element={<PerfilCard />} />
            <Route path="/registro-perfil" element={<RegistroPerfil />} />
          <Route path="/registro-google" element={<AuthPageUnificada />} />
          <Route path="/registro-facebook" element={<AuthPageUnificada />} />
          <Route path="/registro-email" element={<AuthPageUnificada />} />
          <Route path="/auth" element={<AuthPageUnificada />} />
          
          {/* Rutas principales - CON Layout */}
          {/* Redirigir /home al home definitivo estático */}
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="/feed" element={<Layout><FeedPage /></Layout>} />
          <Route path="/perfil/:userId" element={<Layout><Perfil /></Layout>} />
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
        <Route path="/marketplace" element={<Layout><PageInDevelopment title="🛒 Marketplace" icon="🛒" /></Layout>} />
          <Route path="/logros" element={<Layout><Logros /></Layout>} />
        <Route path="/estadisticas-avanzadas" element={<Layout><EstadisticasAvanzadasPage /></Layout>} />
          <Route path="/comparativas" element={<Layout><PageInDevelopment title="📊 Comparativas" icon="📊" /></Layout>} />
          <Route path="/estados" element={<Layout><Estados /></Layout>} />
          <Route path="/amigos" element={<Layout><Amigos /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
