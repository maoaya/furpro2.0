import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TestPage from './pages/TestPage.jsx';
import LoginRegisterForm from './pages/LoginRegisterForm.jsx';
import RegistroFuncionando from './pages/RegistroFuncionando.jsx';
import RegistroSimple from './pages/RegistroSimple.jsx';
import RegistroCompleto from './pages/RegistroCompleto.jsx';
import RegistroTemporal from './pages/RegistroTemporal.jsx';
import PerfilCard from './pages/PerfilCard.jsx';
import HomePage from './pages/HomePage.jsx';
import HomeSimple from './pages/HomeSimple.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LayoutPrincipal from './components/LayoutPrincipal.jsx';
import CallbackPage from './pages/CallbackPage.jsx';
import PageInDevelopment from './components/PageInDevelopment.jsx';
import OAuthLiveTest from './pages/OAuthLiveTest.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';
import TorneosPage from './pages/TorneosPage.jsx';
import EquiposPage from './pages/EquiposPage.jsx';
import PartidosPage from './pages/PartidosPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import EstadisticasPage from './pages/EstadisticasPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ConfiguracionPage from './pages/ConfiguracionPage.jsx';
import { authFlowManager } from './utils/authFlowManager.js';
import supabase from './supabaseClient.js';

// Componente que verifica autenticación antes de mostrar login
function AuthAwareLoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [shouldShowLogin, setShouldShowLogin] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      console.log('🔍 AuthAwareLoginPage: Verificando estado de autenticación...');
      
      // Si ya hay usuario, navegar inmediatamente
      if (user) {
        console.log('✅ Usuario detectado, navegando a home');
        navigate('/home', { replace: true });
        return;
      }

      // Verificar indicadores de autenticación en localStorage
      const authCompleted = localStorage.getItem('authCompleted') === 'true';
      const loginSuccess = localStorage.getItem('loginSuccess') === 'true';
      const userSession = localStorage.getItem('session');
      const registroCompleto = localStorage.getItem('registroCompleto') === 'true';

      const hasAuthIndicators = authCompleted || loginSuccess || userSession || registroCompleto;

      if (hasAuthIndicators) {
        console.log('🔄 Indicadores de auth encontrados, intentando navegación...');
        console.log('📝 Indicadores:', { authCompleted, loginSuccess, hasSession: !!userSession, registroCompleto });
        
        // Intentar obtener sesión de Supabase
        try {
          const { data: session, error } = await supabase.auth.getSession();
          if (session?.session?.user && !error) {
            console.log('✅ Sesión Supabase válida encontrada, navegando a home');
            navigate('/home', { replace: true });
            return;
          } else {
            console.log('❌ Sesión Supabase inválida o error:', error);
          }
        } catch (error) {
          console.log('⚠️ Error verificando sesión Supabase:', error);
        }
        
        // Si hay indicadores pero no sesión válida, limpiar e ir a home
        console.log('🧹 Limpiando indicadores obsoletos...');
        localStorage.removeItem('authCompleted');
        localStorage.removeItem('loginSuccess');
        localStorage.removeItem('session');
        localStorage.removeItem('registroCompleto');
      }

      // Mostrar login después de verificaciones
      setChecking(false);
      setShouldShowLogin(true);
    };

    checkAuthState();
  }, [user, navigate]);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFD700'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚽</div>
          <h2>Verificando autenticación...</h2>
          <p style={{ color: '#ccc' }}>Un momento por favor</p>
        </div>
      </div>
    );
  }

  if (shouldShowLogin) {
    // Mostrar exactamente el diseño del login restaurado sin wrappers extra
    return <LoginRegisterForm />;
  }

  return null;
}

// Componente de ruta protegida
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      console.log('🔒 ProtectedRoute: Usuario no autenticado, redirigiendo a login');
      navigate('/', { replace: true, state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFD700'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚽</div>
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect se encargará de la redirección
  }

  return children;
}

// Componente principal del router
export default function FutProAppDefinitivo() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Manejar deep links y redirecciones automáticas
  useEffect(() => {
    const handleDeepLink = async () => {
      const currentPath = window.location.pathname;
      const authPaths = ['/auth/callback', '/oauth/callback', '/callback'];
      
      if (authPaths.some(path => currentPath.includes(path))) {
        console.log('🔗 Deep link de auth detectado:', currentPath);
        return; // Dejar que CallbackPage maneje
      }

      // Si ya está autenticado y en la raíz, ir a home
      if (user && currentPath === '/') {
        console.log('🏠 Usuario autenticado en raíz, navegando a home');
        navigate('/home', { replace: true });
      }
    };

    handleDeepLink();
  }, [user, navigate]);

  return (
    <Routes>
      {/* Página de login/registro - CON VERIFICACIÓN DE AUTH */}
      <Route path="/" element={<AuthAwareLoginPage />} />
      
      {/* Dashboard principal */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <DashboardPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Registro completo */}
      <Route path="/registro" element={<RegistroFuncionando />} />
      <Route path="/registro-completo" element={<RegistroTemporal />} />
      <Route path="/registro-nuevo" element={<RegistroCompleto />} />
      
      {/* Card de Perfil tipo Instagram */}
      <Route path="/perfil-card" element={
        <ProtectedRoute>
          <PerfilCard />
        </ProtectedRoute>
      } />
      
      {/* Callback para OAuth */}
      <Route path="/auth/callback" element={<CallbackPage />} />

      {/* Live test de OAuth en el dominio actual */}
      <Route path="/auth/test" element={<OAuthLiveTest />} />

      {/* Rutas públicas (sin autenticación requerida) */}
      
      {/* Políticas de Privacidad */}
      <Route path="/privacidad" element={
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: '#fff',
          padding: '20px'
        }}>
          <PageInDevelopment title="📄 Políticas de Privacidad" icon="📄" />
        </div>
      } />

      {/* Términos de Servicio */}
      <Route path="/terminos" element={
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: '#fff',
          padding: '20px'
        }}>
          <PageInDevelopment title="📋 Términos de Servicio" icon="📋" />
        </div>
      } />

      {/* Contacto */}
      <Route path="/contacto" element={
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: '#fff',
          padding: '20px'
        }}>
          <PageInDevelopment title="📞 Contacto" icon="📞" />
        </div>
      } />

      {/* Ayuda/FAQ */}
      <Route path="/ayuda" element={
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: '#fff',
          padding: '20px'
        }}>
          <PageInDevelopment title="❓ Centro de Ayuda" icon="❓" />
        </div>
      } />
      
      {/* Home/Feed (vista simple solicitada) */}
      <Route path="/home" element={
        <ProtectedRoute>
          <HomeSimple />
        </ProtectedRoute>
      } />
      
      {/* Usuarios */}
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <UsuariosPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Torneos */}
      <Route path="/torneos" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <TorneosPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Equipos */}
      <Route path="/equipos" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <EquiposPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Partidos */}
      <Route path="/partidos" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PartidosPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Ranking */}
      <Route path="/ranking" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <RankingPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Estadísticas */}
      <Route path="/estadisticas" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <EstadisticasPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Chat IA */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <ChatPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Perfil */}
      <Route path="/perfil" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PerfilPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Notificaciones */}
      <Route path="/notificaciones" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <NotificationsPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Configuración */}
      <Route path="/configuracion" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <ConfiguracionPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Búsqueda */}
      <Route path="/buscar/:query" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🔍 Resultados de Búsqueda" icon="🔍" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Rutas adicionales importantes */}
      
      {/* Admin Panel */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="⚙️ Panel de Administración" icon="⚙️" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Soporte */}
      <Route path="/soporte" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🆘 Centro de Soporte" icon="🆘" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Marketplace */}
      <Route path="/marketplace" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🛒 Marketplace" icon="🛒" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Streaming */}
      <Route path="/streaming" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="📺 Streaming en Vivo" icon="📺" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Media/Videos */}
      <Route path="/videos" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🎥 Videos y Media" icon="🎥" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Feed/Actividad */}
      <Route path="/feed" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="📰 Feed de Actividad" icon="📰" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Logros */}
      <Route path="/logros" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🏆 Mis Logros" icon="🏆" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />

      {/* Historial */}
      <Route path="/historial" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="📈 Historial de Partidos" icon="📈" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Validar usuario - página simple de confirmación */}
      <Route path="/validar-usuario" element={
        <ProtectedRoute>
          <div style={{
            minHeight: '100vh',
            background: '#1a1a1a',
            color: '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif'
          }}>
            <div style={{
              background: '#2a2a2a',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '2px solid #FFD700',
              maxWidth: '500px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>¡Registro Exitoso!</h2>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>
                Tu cuenta ha sido creada correctamente. Ya puedes acceder a todas las funcionalidades de FutPro.
              </p>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: '#FFD700',
                  color: '#1a1a1a',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Catch-all - redirige según autenticación */}
      <Route path="*" element={
        user ? (
          <ProtectedRoute>
            <LayoutPrincipal>
              <DashboardPage />
            </LayoutPrincipal>
          </ProtectedRoute>
        ) : (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LoginRegisterForm />
          </div>
        )
      } />
    </Routes>
  );
}