import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import FormularioRegistroSimple from './pages/FormularioRegistroSimple.jsx';
import LayoutPrincipal from './components/LayoutPrincipal';

// Componentes lazy loading
const Dashboard = React.lazy(() => import('./Dashboard'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));

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
    <Routes>      
      {/* Rutas públicas (sin autenticación) */}
      <Route path="/registro" element={
        <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando registro...</div>}>
          <RegistroPage />
        </React.Suspense>
      } />
      
      <Route path="/registro-simple" element={
        <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando registro...</div>}>
          <RegistroSimple />
        </React.Suspense>
      } />
      
      {/* Callback para OAuth (Google/Facebook) */}
      <Route path="/auth/callback" element={
        <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Procesando autenticación...</div>}>
          <AuthCallback />
        </React.Suspense>
      } />
      
      {/* Rutas protegidas principales */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      
      <Route path="/validar-usuario" element={
        <ProtectedRoute><ValidarUsuarioForm /></ProtectedRoute>
      } />
      
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/equipos" element={<ProtectedRoute><Equipos /></ProtectedRoute>} />
      
      {/* Ruta por defecto */}
      <Route path="/" element={
        user ? <ProtectedRoute><HomePage /></ProtectedRoute> : (
          <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando...</div>}>
            <AuthHomePage />
          </React.Suspense>
        )
      } />
      
      {/* Catch-all para rutas no encontradas */}
      <Route path="*" element={
        user ? <ProtectedRoute><HomePage /></ProtectedRoute> : (
          <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando...</div>}>
            <AuthHomePage />
          </React.Suspense>
        )
      } />
    </Routes>
  );
}
