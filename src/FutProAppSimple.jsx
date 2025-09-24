import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import FormularioRegistroSimple from './pages/FormularioRegistroSimple.jsx';
import LayoutPrincipal from './components/LayoutPrincipal';

// Componentes lazy loading
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));

// Componente protegido que requiere autenticación
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ Usuario no autenticado, redirigiendo a registro');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ 
        background: '#181818', 
        color: '#FFD700', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        Verificando autenticación...
      </div>
    );
  }

  if (!user) {
    return null; // Se redirige en el useEffect
  }

  return children;
}

export default function FutProApp() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Log del estado de autenticación
  useEffect(() => {
    console.log('🔍 FutProApp - Estado actual:', {
      user: user ? `${user.email || user.user?.email}` : 'No autenticado',
      loading,
      currentPath: location.pathname
    });
  }, [user, loading, location.pathname]);

  if (loading) {
    return (
      <div style={{
        background: '#181818',
        color: '#FFD700',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>⚽</div>
          <div>Cargando FutPro...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Formulario de registro simple */}
      <Route path="/registro" element={
        <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando registro...</div>}>
          <FormularioRegistroSimple />
        </React.Suspense>
      } />
      
      {/* Páginas protegidas con layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando...</div>}>
              <DashboardPage />
            </React.Suspense>
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando...</div>}>
              <HomePage />
            </React.Suspense>
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Ruta por defecto - siempre va al registro */}
      <Route path="/" element={
        <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando...</div>}>
          <FormularioRegistroSimple />
        </React.Suspense>
      } />
      
      {/* Catch-all */}
      <Route path="*" element={
        <React.Suspense fallback={<div style={{color:'#FFD700',padding:24}}>Cargando...</div>}>
          <FormularioRegistroSimple />
        </React.Suspense>
      } />
    </Routes>
  );
}