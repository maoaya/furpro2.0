import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TestPage from './pages/TestPage.jsx';
import LoginRegisterForm from './pages/LoginRegisterForm.jsx';
import RegistroCompleto from './pages/RegistroCompleto.jsx';
import RegistroFuncionando from './pages/RegistroFuncionando.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LayoutPrincipal from './components/LayoutPrincipal.jsx';
import CallbackPage from './pages/CallbackPage.jsx';
import PageInDevelopment from './components/PageInDevelopment.jsx';
import OAuthLiveTest from './pages/OAuthLiveTest.jsx';
import DebugConfig from './pages/DebugConfig.jsx';

// Componente protegido simple
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [graceMode, setGraceMode] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const registroCompleto = localStorage.getItem('registroCompleto') === 'true';
      const authCompleted = localStorage.getItem('authCompleted') === 'true';

      if (registroCompleto || authCompleted) {
        // Permitir acceso temporal mientras se establece la sesión
        if (!graceMode) {
          console.log('🟡 ProtectedRoute: modo gracia activo tras registro, permitiendo acceso temporal a la ruta protegida');
          setGraceMode(true);
          // Limpiar modo gracia si tras 2 minutos no hay sesión
          const t = setTimeout(() => {
            if (!user) {
              console.log('⏱️ Fin del modo gracia sin sesión activa. Volviendo al login.');
              setGraceMode(false);
              localStorage.removeItem('registroCompleto');
              localStorage.removeItem('authCompleted');
              navigate('/', { replace: true });
            }
          }, 120000);
          return () => clearTimeout(t);
        }
        return;
      }

      console.log('❌ Usuario no autenticado, redirigiendo al login');
      navigate('/', { replace: true });
      return;
    }

    // Usuario autenticado: limpiar marcadores y modo gracia
    if (graceMode) setGraceMode(false);
    localStorage.removeItem('registroCompleto');
    localStorage.removeItem('authCompleted');
  }, [user, loading, navigate, graceMode]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#FFD700',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚽</div>
          <div>Verificando autenticación...</div>
        </div>
      </div>
    );
  }

  if (!user && !graceMode) return null;

  return children;
}

export default function FutProAppDefinitivo() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Manejar redirección post-login y post-registro
  useEffect(() => {
    if (user) {
      const userRegistrado = localStorage.getItem('userRegistrado');
      const redirectTarget = localStorage.getItem('postLoginRedirect') || '/home';

      const shouldRedirectFrom = ['/', '/registro', '/registro-completo', '/auth/callback'];
      if (shouldRedirectFrom.includes(location.pathname)) {
        console.log(`✅ Usuario autenticado, redirigiendo a: ${redirectTarget}`);
        console.log('📝 Datos de usuario registrado:', userRegistrado);

        localStorage.removeItem('postLoginRedirect');
        navigate(redirectTarget, { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  // Log del estado
  useEffect(() => {
    console.log('🔍 FutProApp Estado:', {
      user: user ? `${user.email}` : 'No autenticado',
      loading,
      path: location.pathname
    });
  }, [user, loading, location.pathname]);

  // Pantalla de carga
  if (loading) {
    return (
      <div style={{
        background: '#1a1a1a',
        color: '#FFD700',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚽</div>
          <div style={{ fontSize: '18px' }}>Cargando FutPro...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Página de login/registro */}
      <Route path="/" element={
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <LoginRegisterForm />
        </div>
      } />
      
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
      <Route path="/registro-completo" element={<RegistroCompleto />} />
      <Route path="/debug-config" element={<DebugConfig />} />
      
      {/* Callback para OAuth */}
      <Route path="/auth/callback" element={<CallbackPage />} />

  {/* Live test de OAuth en el dominio actual */}
  <Route path="/auth/test" element={<OAuthLiveTest />} />
      
      {/* Home/Feed */}
      <Route path="/home" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <HomePage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Usuarios */}
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="👥 Gestión de Usuarios" icon="👥" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Torneos */}
      <Route path="/torneos" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🏆 Gestión de Torneos" icon="🏆" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Equipos */}
      <Route path="/equipos" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="⚽ Gestión de Equipos" icon="⚽" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Chat IA */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="💬 Chat con IA" icon="💬" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Perfil */}
      <Route path="/perfil" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="👤 Mi Perfil" icon="👤" />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Notificaciones */}
      <Route path="/notificaciones" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <PageInDevelopment title="🔔 Notificaciones" icon="🔔" />
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