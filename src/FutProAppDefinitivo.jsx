import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginRegisterForm from './LoginRegisterForm.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LayoutPrincipal from './components/LayoutPrincipal.jsx';

// Componente protegido simple
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ Usuario no autenticado, redirigiendo al login');
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

  if (!user) return null;

  return children;
}

export default function FutProAppDefinitivo() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Manejar redirección post-login
  useEffect(() => {
    if (user && location.pathname === '/') {
      const redirectTarget = localStorage.getItem('postLoginRedirect') || '/dashboard';
      console.log(`✅ Usuario autenticado, redirigiendo a: ${redirectTarget}`);
      localStorage.removeItem('postLoginRedirect');
      navigate(redirectTarget, { replace: true });
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
      
      {/* Home/Feed */}
      <Route path="/home" element={
        <ProtectedRoute>
          <LayoutPrincipal>
            <HomePage />
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
                onClick={() => navigate('/dashboard')}
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
                Ir al Dashboard
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