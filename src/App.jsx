import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SidebarMenu from './components/SidebarMenu';
import FeedPage from './pages/FeedPage';
import PerfilPage from './pages/PerfilPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import EquipoDetallePage from './pages/EquipoDetallePage';
import TorneoDetallePage from './pages/TorneoDetallePage';
import UsuarioDetallePage from './pages/UsuarioDetallePage';
import RankingPage from './pages/RankingPage';
import ProgresoPage from './pages/ProgresoPage';
import PenaltisPage from './pages/PenaltisPage';
import HistorialPenaltisPage from './pages/HistorialPenaltisPage';
import AyudaFAQPage from './pages/AyudaFAQPage';
import ConfiguracionUsuarioPage from './pages/ConfiguracionUsuarioPage';
import CompartirContenidoPage from './pages/CompartirContenidoPage';
import ChatSQLPage from './pages/ChatSQLPage';
import MarketplacePage from './pages/MarketplacePage';
import LogrosPage from './pages/LogrosPage';
import EstadisticasAvanzadasPage from './pages/EstadisticasAvanzadasPage';
import ComparativasPage from './pages/ComparativasPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPageUnificada from './pages/AuthPageUnificada';
import AuthCallback from './pages/AuthCallback';
import LoginRegisterForm from './pages/LoginRegisterForm';
import RegistroNuevo from './pages/RegistroNuevo';

// import SupportPage from './pages/SupportPage';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import HomeRedirect from './pages/HomeRedirect';

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
          <Route path="/registro-google" element={<AuthPageUnificada />} />
          <Route path="/registro-facebook" element={<AuthPageUnificada />} />
          <Route path="/registro-email" element={<AuthPageUnificada />} />
          <Route path="/auth" element={<AuthPageUnificada />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Rutas principales - CON Layout */}
          {/* Redirigir /home al home definitivo estático */}
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="/feed" element={<Layout><FeedPage /></Layout>} />
          <Route path="/perfil/:userId" element={<Layout><PerfilPage /></Layout>} />
          <Route path="/notificaciones" element={<Layout><NotificationsPage /></Layout>} />
          <Route path="/admin" element={<Layout><AdminPanelPage /></Layout>} />
        <Route path="/equipo/:id" element={<Layout><EquipoDetallePage /></Layout>} />
        <Route path="/torneo/:id" element={<Layout><TorneoDetallePage /></Layout>} />
        <Route path="/usuario/:id" element={<Layout><UsuarioDetallePage /></Layout>} />
        <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
        <Route path="/progreso" element={<Layout><ProgresoPage /></Layout>} />
        <Route path="/penaltis" element={<Layout><PenaltisPage /></Layout>} />
        <Route path="/historial-penaltis" element={<Layout><HistorialPenaltisPage /></Layout>} />
        <Route path="/ayuda" element={<Layout><AyudaFAQPage /></Layout>} />
        <Route path="/configuracion" element={<Layout><ConfiguracionUsuarioPage /></Layout>} />
        <Route path="/compartir" element={<Layout><CompartirContenidoPage /></Layout>} />
        <Route path="/chat-sql" element={<Layout><ChatSQLPage /></Layout>} />
        <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
        <Route path="/logros" element={<Layout><LogrosPage /></Layout>} />
        <Route path="/estadisticas-avanzadas" element={<Layout><EstadisticasAvanzadasPage /></Layout>} />
          <Route path="/comparativas" element={<Layout><ComparativasPage /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}// Test unitario básico
import { render, screen } from '@testing-library/react';
describe('App', () => {
  it('renderiza el layout y SidebarMenu', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
