import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import supabase from './supabaseClient';
import AuthHomePage from './pages/AuthHomePage.jsx';
import RegistroPage from './pages/RegistroPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LayoutPrincipal from './components/LayoutPrincipal.jsx';

// Componente para manejar el callback de OAuth
function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Procesar callback de OAuth
    const procesarCallback = async () => {
      console.log('🔄 Procesando callback OAuth...');
      
      // Obtener parámetros de la URL
      const urlParams = new URLSearchParams(location.search);
      const hasError = urlParams.get('error');
      
      if (hasError) {
        console.error('❌ Error en OAuth callback:', hasError);
        navigate('/?error=' + hasError, { replace: true });
        return;
      }

      // Si hay una sesión, redirigir al registro para completar
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('✅ Sesión OAuth establecida, completando registro...');
        navigate('/registro?from=oauth', { replace: true });
      } else {
        console.log('⚠️ No se estableció sesión, volviendo al inicio');
        navigate('/', { replace: true });
      }
    };

    procesarCallback();
  }, [location, navigate]);

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
        <div style={{ 
          fontSize: '40px', 
          marginBottom: '20px',
          animation: 'spin 1s linear infinite'
        }}>⚽</div>
        <div>Procesando autenticación...</div>
      </div>
    </div>
  );
}

// Componente protegido
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ Usuario no autenticado, redirigiendo al inicio');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#FFD700'
      }}>
        Verificando autenticación...
      </div>
    );
  }

  if (!user) return null;

  return children;
}

export default function FutProAppCompleto() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 FutProApp - Estado:', {
      user: user ? `${user.email}` : 'No autenticado',
      loading,
      path: location.pathname
    });
  }, [user, loading, location.pathname]);

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
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'spin 1.5s linear infinite'
          }}>⚽</div>
          <div style={{ fontSize: '18px' }}>Cargando FutPro...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Página principal - AuthHomePage con OAuth */}
      <Route path="/" element={<AuthHomePage />} />
      
      {/* Página de registro completo */}
      <Route path="/registro" element={<RegistroPage />} />
      
      {/* Callback de OAuth */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Páginas protegidas */}
      <Route path="/home" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <HomePage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <DashboardPage />
          </LayoutPrincipal>
        </ProtectedRoute>
      } />
      
      {/* Catch-all */}
      <Route path="*" element={<AuthHomePage />} />
    </Routes>
  );
}