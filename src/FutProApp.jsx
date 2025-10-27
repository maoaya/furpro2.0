import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, BrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LayoutPrincipal from './components/LayoutPrincipal';

// Componentes principales
import HomePage from './pages/HomePage';
import RegistroCompleto from './pages/RegistroCompleto';
import LoginRegisterForm from './pages/LoginRegisterForm';
import AuthPageUnificada from './pages/AuthPageUnificada';
import CallbackPage from './pages/CallbackPage';
import CallbackPageOptimized from './pages/CallbackPageOptimized';
import ValidarUsuarioForm from './pages/ValidarUsuarioForm';
import TorneosPage from './pages/TorneosPage';
import UsuariosPage from './pages/UsuariosPage';
import EquiposPage from './pages/EquiposPage';
import PerfilPage from './pages/PerfilPage';

// Componentes lazy loading opcionales
const Dashboard = React.lazy(() => import('./Dashboard').catch(() => ({ default: HomePage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').catch(() => ({ default: HomePage })));

// Componente para manejar redirección post-login
function PostLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const targetPath = localStorage.getItem('postLoginRedirect');
    if (targetPath && location.pathname !== targetPath) {
      console.log(`🔄 Navegando a: ${targetPath}`);
      localStorage.removeItem('postLoginRedirect');
      navigate(targetPath, { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
}

// Componente protegido que requiere autenticación
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ Usuario no autenticado, redirigiendo a login');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a1a1a',
        color: '#FFD700',
        fontSize: '18px'
      }}>
        🚀 Cargando FutPro...
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect ya manejó la redirección
  }

  return (
    <LayoutPrincipal>
      <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando página...</div>}>
        <PostLoginRedirect />
        {children}
      </React.Suspense>
    </LayoutPrincipal>
  );
}

export default function FutProApp() {
  const { user, loading } = useAuth();
  
  console.log('🎯 FutProApp render:', loading ? 'Cargando...' : (user ? `Usuario: ${user.email}` : 'Sin usuario'));

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a1a1a',
        color: '#FFD700',
        fontSize: '18px'
      }}>
        🚀 Inicializando FutPro...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>      
        {/* Rutas públicas (sin autenticación) */}
        <Route path="/auth" element={<AuthPageUnificada />} />
        <Route path="/registro" element={<RegistroCompleto />} />
        <Route path="/registro-completo" element={<RegistroCompleto />} />
        <Route path="/login" element={<LoginRegisterForm />} />
        <Route path="/login-legacy" element={<LoginRegisterForm />} />
        
        {/* Callback para OAuth (Google/Facebook) - Versión optimizada */}
        <Route path="/auth/callback" element={<CallbackPageOptimized />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/oauth/callback" element={<CallbackPageOptimized />} />
        
        {/* Rutas protegidas principales */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        <Route path="/validar-usuario" element={
          <ProtectedRoute><ValidarUsuarioForm /></ProtectedRoute>
        } />
        
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/inicio" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
        <Route path="/equipos" element={<ProtectedRoute><EquiposPage /></ProtectedRoute>} />
        <Route path="/torneos" element={<ProtectedRoute><TorneosPage /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><UsuariosPage /></ProtectedRoute>} />
        
        {/* Ruta por defecto - Usa la nueva página de autenticación unificada */}
        <Route path="/" element={
          user ? <ProtectedRoute><HomePage /></ProtectedRoute> : <AuthPageUnificada />
        } />
        
        {/* Catch-all para rutas no encontradas */}
        <Route path="*" element={
          user ? <ProtectedRoute><HomePage /></ProtectedRoute> : <AuthPageUnificada />
        } />
      </Routes>
    </BrowserRouter>
  );
}
