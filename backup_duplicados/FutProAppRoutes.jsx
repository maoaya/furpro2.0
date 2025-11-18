import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ========== COMPONENTES CRÍTICOS DEL FLUJO ==========
import LoginRegisterFormClean from './pages/LoginRegisterFormClean.jsx';
import SeleccionCategoria from './pages/SeleccionCategoria.jsx';
import FormularioRegistroCompleto from './pages/FormularioRegistroCompleto.jsx';
import PerfilCard from './pages/PerfilCard.jsx';

// ========== PÁGINAS PRINCIPALES DEL MENÚ ==========
import Chat from './pages/Chat.jsx';
import MarketplaceDetalle from './pages/MarketplaceDetalle.jsx';
import Notificaciones from './pages/Notificaciones.jsx';
import VideosPage from './pages/VideosPage.jsx';
import Estados from './pages/Estados.jsx';
import Amigos from './pages/Amigos.jsx';

// ========== RANKINGS ==========
import RankingEquiposPage from './pages/RankingEquiposPage.jsx';
import RankingJugadoresPage from './pages/RankingJugadoresPage.jsx';

// ========== EQUIPOS Y TORNEOS ==========
import Equipos from './pages/Equipos.jsx';
import Torneos from './pages/Torneos.jsx';

// ========== JUEGOS Y CARDS ==========
import Penaltis from './pages/Penaltis.jsx';
import CarFutPro from './pages/CarFutPro.jsx';
import SugerenciasCardPage from './pages/SugerenciasCardPage.jsx';

// ========== SOCIAL ==========
import Perfil from './pages/Perfil.jsx';
import EstadisticasPage from './pages/EstadisticasPage.jsx';
import Logros from './pages/Logros.jsx';
import TarjetasPage from './pages/TarjetasPage.jsx';

// ========== ADMINISTRACIÓN ==========
import Configuracion from './pages/Configuracion.jsx';
import PoliticasPage from './pages/PoliticasPage.jsx';
import PrivacidadPage from './pages/PrivacidadPage.jsx';
import Soporte from './pages/Soporte.jsx';

// ========== COMPONENTES DE LAYOUT ==========
import MainLayout from './pages/MainLayout.jsx';
import NotFound from './pages/NotFound.jsx';

// ========== CONTEXTOS ==========
import { AuthProvider } from './pages/auth/AuthContext.jsx';

function FutProApp() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========== FLUJO DE AUTENTICACIÓN ========== */}
          <Route path="/" element={<LoginRegisterFormClean />} />
          <Route path="/seleccionar-categoria" element={<SeleccionCategoria />} />
          <Route path="/formulario-registro" element={<FormularioRegistroCompleto />} />
          <Route path="/perfil-card" element={<PerfilCard />} />

          {/* ========== HOMEPAGE (REDIRIGE A HTML) ========== */}
          <Route path="/home" element={<Navigate to="/homepage-instagram.html" replace />} />

          {/* ========== PÁGINAS CON LAYOUT ========== */}
          <Route path="/" element={<MainLayout />}>
          {/* SECCIÓN SOCIAL */}
            <Route path="chat" element={<Chat />} />
            <Route path="marketplace" element={<MarketplaceDetalle />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="notificaciones" element={<Notificaciones />} />
            <Route path="estados" element={<Estados />} />
            <Route path="amigos" element={<Amigos />} />
            <Route path="estados" element={<Estados />} />
            <Route path="amigos" element={<Amigos />} />

            {/* SECCIÓN RANKINGS */}
            <Route path="ranking-jugadores" element={<RankingJugadoresPage />} />
            <Route path="ranking-equipos" element={<RankingEquiposPage />} />

            {/* SECCIÓN EQUIPOS Y TORNEOS */}
            <Route path="equipos" element={<Equipos />} />
            <Route path="torneos" element={<Torneos />} />

            {/* SECCIÓN JUEGOS Y CARDS */}
            <Route path="penaltis" element={<Penaltis />} />
            <Route path="card-futpro" element={<CarFutPro />} />
            <Route path="sugerencias-card" element={<SugerenciasCardPage />} />

            {/* SECCIÓN PERFIL */}
            <Route path="perfil" element={<Perfil />} />
            <Route path="estadisticas" element={<EstadisticasPage />} />
            <Route path="logros" element={<Logros />} />
            <Route path="tarjetas" element={<TarjetasPage />} />

            {/* SECCIÓN ADMINISTRACIÓN */}
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="politicas" element={<PoliticasPage />} />
            <Route path="privacidad" element={<PrivacidadPage />} />
            <Route path="soporte" element={<Soporte />} />
          </Route>

          {/* ========== PÁGINA 404 ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default FutProApp;