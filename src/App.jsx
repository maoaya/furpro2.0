import React, { Suspense, lazy, startTransition } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext.jsx';
import MainLayout from './components/MainLayout';

// Eager: rutas críticas de primer paint / auth (FP-BUNDLE-001)
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AuthCallback from './pages/auth/AuthCallback';
import PerfilNuevo from './pages/PerfilNuevo';
import FeedPage from './pages/FeedPage';
import MarketplaceCompleto from './pages/MarketplaceCompleto';
import Notificaciones from './pages/Notificaciones';

// Lazy: resto de rutas — carga bajo demanda para nav ~instantánea
const PageInDevelopment = lazy(() => import('./components/PageInDevelopment'));
const EquipoDetallePage = lazy(() => import('./pages/EquipoDetallePage'));
const TorneoDetallePage = lazy(() => import('./pages/TorneoDetallePage'));
const UsuarioDetallePage = lazy(() => import('./pages/UsuarioDetallePage'));
const EstadisticasPage = lazy(() => import('./pages/EstadisticasPage'));
const Progreso = lazy(() => import('./pages/Progreso'));
const Penaltis = lazy(() => import('./pages/Penaltis'));
const HistorialPage = lazy(() => import('./pages/HistorialPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const Estados = lazy(() => import('./pages/Estados'));
const Amigos = lazy(() => import('./pages/Amigos'));
const EditarPerfil = lazy(() => import('./pages/EditarPerfil'));
const Estadisticas = lazy(() => import('./pages/Estadisticas'));
const Tarjetas = lazy(() => import('./pages/Tarjetas'));
const Equipos = lazy(() => import('./pages/Equipos'));
const CrearEquipo = lazy(() => import('./pages/CrearEquipo'));
const Torneos = lazy(() => import('./pages/Torneos'));
const CrearTorneo = lazy(() => import('./pages/CrearTorneo'));
const Amistoso = lazy(() => import('./pages/Amistoso'));
const CardFIFA = lazy(() => import('./pages/CardFIFA'));
const SugerenciasCard = lazy(() => import('./pages/SugerenciasCard'));
const Chat = lazy(() => import('./pages/Chat'));
const VideosFeed = lazy(() => import('./pages/VideosFeed'));
const LiveStreamPage = lazy(() => import('./pages/LiveStreamPage'));
const RankingJugadoresCompleto = lazy(() => import('./pages/RankingJugadoresCompleto'));
const RankingEquiposCompleto = lazy(() => import('./pages/RankingEquiposCompleto'));
const BuscarRanking = lazy(() => import('./pages/BuscarRanking'));
const Soporte = lazy(() => import('./pages/Soporte'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const ConfiguracionPage = lazy(() => import('./pages/ConfiguracionPage'));
const PerfilCard = lazy(() => import('./pages/PerfilCard'));
const FormularioRegistroCompleto = lazy(() => import('./pages/FormularioRegistroCompleto'));
const Logros = lazy(() => import('./pages/Logros'));
const EstadisticasAvanzadasPage = lazy(() => import('./pages/EstadisticasAvanzadasPage'));
const SeccionPlaceholder = lazy(() => import('./pages/SeccionPlaceholder'));
const RegistroPerfil = lazy(() => import('./pages/RegistroPerfil'));
const DiagnosticoFunciones = lazy(() => import('./pages/DiagnosticoFunciones'));
const MisInvitaciones = lazy(() => import('./pages/MisInvitaciones'));
const ConvocarJugadores = lazy(() => import('./pages/ConvocarJugadores'));
const PlantillaEquipo = lazy(() => import('./pages/PlantillaEquipo'));
const SubirHistoria = lazy(() => import('./pages/SubirHistoria'));
const CrearTorneoAvanzado = lazy(() => import('./pages/CrearTorneoAvanzado'));
const ChatInstagramNew = lazy(() => import('./pages/ChatInstagramNew'));
const PenaltisMultijugador = lazy(() => import('./pages/PenaltisMultijugador'));
const CrearTorneoCompleto = lazy(() => import('./pages/CrearTorneoCompleto'));
const ArbitroPanelPage = lazy(() => import('./pages/ArbitroPanelPage'));
const TorneoStandingsPage = lazy(() => import('./pages/TorneoStandingsPage'));
const TorneoBracketPage = lazy(() => import('./pages/TorneoBracketPage'));
const NotificacionesTorneoPage = lazy(() => import('./pages/NotificacionesTorneoPage'));
const CrearTorneoMejorado = lazy(() => import('./components/CrearTorneoMejorado'));
const RankingMejorado = lazy(() => import('./components/RankingMejorado'));
const MiEquipoMejorado = lazy(() => import('./components/MiEquipoMejorado'));
const PerfilInstagram = lazy(() => import('./pages/PerfilInstagram'));

function RouteFallback() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '40vh', background: '#0a0a0a', color: '#FFD700', fontWeight: 700
    }}>
      Cargando…
    </div>
  );
}

function withLayout(node) {
  return <MainLayout>{node}</MainLayout>;
}

function LazyPage({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function RootRoute() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
        <div style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>Cargando...</div>
      </div>
    );
  }

  // Home siempre (guest ve mercado + CTA login; sesión ve feed completo)
  return withLayout(<HomePage />);
}

/** Prefetch de chunks críticos en idle para nav percibida ~instantánea */
function PrefetchCriticalChunks() {
  React.useEffect(() => {
    const run = () => {
      startTransition(() => {
        import('./pages/Chat');
        import('./pages/VideosFeed');
        import('./pages/Amigos');
        import('./pages/Torneos');
        import('./pages/Equipos');
      });
    };
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(run, { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, 1200);
    return () => clearTimeout(t);
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <Router>
          <PrefetchCriticalChunks />
          <Routes>
            {/* Auth — eager */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/perfil" element={<PerfilNuevo />} />
            <Route path="/perfil/me" element={<PerfilNuevo />} />

            <Route path="/registro" element={<LazyPage><FormularioRegistroCompleto /></LazyPage>} />
            <Route path="/registro-nuevo" element={<LazyPage><FormularioRegistroCompleto /></LazyPage>} />
            <Route path="/registro-perfil" element={<LazyPage><RegistroPerfil /></LazyPage>} />
            <Route path="/perfil-card" element={<LazyPage><PerfilCard /></LazyPage>} />
            <Route path="/diagnostico-funciones" element={withLayout(<LazyPage><DiagnosticoFunciones /></LazyPage>)} />

            <Route path="/" element={<RootRoute />} />

            {/* Principales — eager donde más se navega */}
            <Route path="/home" element={withLayout(<FeedPage />)} />
            <Route path="/feed" element={withLayout(<FeedPage />)} />
            <Route path="/notificaciones" element={withLayout(<Notificaciones />)} />
            <Route path="/marketplace" element={withLayout(<MarketplaceCompleto />)} />
            {/* Alias mercado de fichajes */}
            <Route path="/mercado" element={withLayout(<MarketplaceCompleto />)} />
            <Route path="/mercado/*" element={withLayout(<MarketplaceCompleto />)} />

            <Route path="/perfil/:userId" element={withLayout(<LazyPage><PerfilInstagram /></LazyPage>)} />
            <Route path="/videos" element={withLayout(<LazyPage><VideosFeed /></LazyPage>)} />
            <Route path="/chat" element={withLayout(<LazyPage><Chat /></LazyPage>)} />

            <Route path="/penaltis" element={withLayout(<LazyPage><Penaltis /></LazyPage>)} />
            <Route path="/card-fifa" element={<LazyPage><CardFIFA /></LazyPage>} />
            <Route path="/sugerencias-card" element={<LazyPage><SugerenciasCard /></LazyPage>} />

            <Route path="/equipos" element={withLayout(<LazyPage><Equipos /></LazyPage>)} />
            <Route path="/crear-equipo" element={withLayout(<LazyPage><CrearEquipo /></LazyPage>)} />
            <Route path="/equipo/:id" element={withLayout(<LazyPage><EquipoDetallePage /></LazyPage>)} />
            <Route path="/equipo/:teamId/plantilla" element={withLayout(<LazyPage><PlantillaEquipo /></LazyPage>)} />
            <Route path="/equipo/:teamId/plantilla-mejorada" element={withLayout(<LazyPage><MiEquipoMejorado /></LazyPage>)} />
            <Route path="/mi-equipo/:teamId" element={withLayout(<LazyPage><MiEquipoMejorado /></LazyPage>)} />
            <Route path="/convocar-jugadores/:teamId" element={withLayout(<LazyPage><ConvocarJugadores /></LazyPage>)} />
            <Route path="/mis-invitaciones" element={withLayout(<LazyPage><MisInvitaciones /></LazyPage>)} />
            <Route path="/torneos" element={withLayout(<LazyPage><Torneos /></LazyPage>)} />
            <Route path="/crear-torneo" element={withLayout(<LazyPage><CrearTorneo /></LazyPage>)} />
            <Route path="/crear-torneo-mejorado" element={withLayout(<LazyPage><CrearTorneoMejorado /></LazyPage>)} />
            <Route path="/crear-torneo-completo" element={withLayout(<LazyPage><CrearTorneoCompleto /></LazyPage>)} />
            <Route path="/torneo/:id" element={withLayout(<LazyPage><TorneoDetallePage /></LazyPage>)} />
            <Route path="/amistoso" element={withLayout(<LazyPage><Amistoso /></LazyPage>)} />
            <Route path="/tarjetas" element={withLayout(<LazyPage><Tarjetas /></LazyPage>)} />

            <Route path="/ranking" element={withLayout(<LazyPage><RankingMejorado /></LazyPage>)} />
            <Route path="/ranking-clasico" element={withLayout(<LazyPage><EstadisticasPage /></LazyPage>)} />
            <Route path="/ranking-jugadores" element={withLayout(<LazyPage><RankingJugadoresCompleto /></LazyPage>)} />
            <Route path="/ranking-equipos" element={withLayout(<LazyPage><RankingEquiposCompleto /></LazyPage>)} />
            <Route path="/buscar-ranking" element={withLayout(<LazyPage><BuscarRanking /></LazyPage>)} />
            <Route path="/estadisticas" element={withLayout(<LazyPage><Estadisticas /></LazyPage>)} />
            <Route path="/estadisticas-avanzadas" element={withLayout(<LazyPage><EstadisticasAvanzadasPage /></LazyPage>)} />
            <Route path="/progreso" element={withLayout(<LazyPage><Progreso /></LazyPage>)} />
            <Route path="/historial-penaltis" element={withLayout(<LazyPage><HistorialPage /></LazyPage>)} />
            <Route path="/usuario/:id" element={withLayout(<LazyPage><UsuarioDetallePage /></LazyPage>)} />

            <Route path="/estados" element={withLayout(<LazyPage><Estados /></LazyPage>)} />
            <Route path="/amigos" element={withLayout(<LazyPage><Amigos /></LazyPage>)} />
            <Route path="/transmision-en-vivo" element={withLayout(<LazyPage><LiveStreamPage /></LazyPage>)} />
            <Route path="/subir-historia" element={withLayout(<LazyPage><SubirHistoria /></LazyPage>)} />

            <Route path="/crear-torneo-avanzado" element={withLayout(<LazyPage><CrearTorneoAvanzado /></LazyPage>)} />
            <Route path="/chat-instagram-new" element={withLayout(<LazyPage><ChatInstagramNew /></LazyPage>)} />
            <Route path="/penaltis-multijugador" element={withLayout(<LazyPage><PenaltisMultijugador /></LazyPage>)} />
            <Route path="/arbitro" element={withLayout(<LazyPage><ArbitroPanelPage /></LazyPage>)} />
            <Route path="/torneo/:tournamentId/standings" element={withLayout(<LazyPage><TorneoStandingsPage /></LazyPage>)} />
            <Route path="/torneo/:tournamentId/brackets" element={withLayout(<LazyPage><TorneoBracketPage /></LazyPage>)} />
            <Route path="/notificaciones-torneo" element={withLayout(<LazyPage><NotificacionesTorneoPage /></LazyPage>)} />

            <Route path="/editar-perfil" element={withLayout(<LazyPage><EditarPerfil /></LazyPage>)} />
            <Route path="/configuracion" element={withLayout(<LazyPage><ConfiguracionPage /></LazyPage>)} />
            <Route path="/logros" element={withLayout(<LazyPage><Logros /></LazyPage>)} />
            <Route path="/seccion/:slug" element={withLayout(<LazyPage><SeccionPlaceholder /></LazyPage>)} />

            <Route path="/ayuda" element={withLayout(<LazyPage><PageInDevelopment title="❓ Centro de Ayuda" icon="❓" /></LazyPage>)} />
            <Route path="/soporte" element={<LazyPage><Soporte /></LazyPage>} />
            <Route path="/privacidad" element={<LazyPage><Privacidad /></LazyPage>} />
            <Route path="/comparativas" element={withLayout(<LazyPage><PageInDevelopment title="📊 Comparativas" icon="📊" /></LazyPage>)} />
            <Route path="/compartir" element={withLayout(<LazyPage><PageInDevelopment title="📤 Compartir" icon="📤" /></LazyPage>)} />
            <Route path="/chat-sql" element={withLayout(<LazyPage><PageInDevelopment title="💬 Chat SQL" icon="💬" /></LazyPage>)} />

            <Route path="*" element={withLayout(<LazyPage><NotFoundPage /></LazyPage>)} />
          </Routes>
        </Router>
      </NotificationsProvider>
    </AuthProvider>
  );
}
