import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TestPage from './pages/TestPage.jsx';
import LoginRegisterForm from './pages/LoginRegisterForm.jsx';
import RegistroFuncionando from './pages/RegistroFuncionando.jsx';
import RegistroNuevo from './pages/RegistroNuevo.jsx';
import RegistroTemporal from './pages/RegistroTemporal.jsx';
import PerfilCard from './pages/PerfilCard.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LayoutPrincipal from './components/LayoutPrincipal.jsx';
import CallbackPage from './pages/CallbackPage.jsx';
import PageInDevelopment from './components/PageInDevelopment.jsx';
import OAuthLiveTest from './pages/OAuthLiveTest.jsx';
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
          const { data: { session }, error } = await supabase.auth.getSession();
          if (session?.user) {
            console.log('✅ Sesión Supabase válida encontrada, navegando...');
            navigate('/home', { replace: true });
            return;
          }
        } catch (error) {
          console.log('⚠️ Error verificando sesión Supabase:', error);
        }

        // Si hay indicadores pero no sesión, forzar navegación inmediatamente
        const isNetlify = window.location.hostname.includes('netlify') || window.location.hostname.includes('futpro.vip');
        if (isNetlify) {
          console.log('🌐 Netlify detectado con indicadores de auth, navegando inmediatamente...');
          navigate('/home', { replace: true });
          
          // Fallback con window.location
          setTimeout(() => {
            window.location.href = '/home';
          }, 500);
          
          // Mostrar mensaje temporal
          setChecking(false);
          setShouldShowLogin(false);
          return;
        }

        // Para localhost, dar más tiempo
        setTimeout(() => {
          if (!user) {
            console.log('⏱️ Timeout alcanzado, mostrando login');
            setChecking(false);
            setShouldShowLogin(true);
          }
        }, 5000);
      } else {
        // No hay indicadores de auth, mostrar login
        console.log('❌ No hay indicadores de autenticación, mostrando login');
        setChecking(false);
        setShouldShowLogin(true);
      }
    };

    checkAuthState();
  }, [user, navigate]);

  // Pantalla de verificación
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        color: '#FFD700'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚽</div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Verificando autenticación...</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            {window.location.hostname.includes('netlify') || window.location.hostname.includes('futpro.vip') ? 
              'Entorno Netlify detectado' : 'Entorno local'}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de navegación en proceso (solo para Netlify con indicadores)
  if (!shouldShowLogin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        color: '#FFD700'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>¡Autenticación detectada!</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>Redirigiendo al HomePage...</div>
        </div>
      </div>
    );
  }

  // Mostrar formulario de login
  return (
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
  );
}

// Componente protegido simple - MEJORADO
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [graceMode, setGraceMode] = useState(false);
  const [lastCheck, setLastCheck] = useState(0);

  useEffect(() => {
    if (loading) return;
    const now = Date.now();
    if (now - lastCheck < 1000) return;
    setLastCheck(now);
    // Log visual y de consola
    const logDiv = document.createElement('div');
    logDiv.style.position = 'fixed';
    logDiv.style.top = '10px';
    logDiv.style.right = '10px';
    logDiv.style.background = '#FFD700';
    logDiv.style.color = '#222';
    logDiv.style.padding = '12px 20px';
    logDiv.style.borderRadius = '10px';
    logDiv.style.zIndex = '99999';
    logDiv.style.fontWeight = 'bold';
    logDiv.style.boxShadow = '0 2px 12px #FFD70055';
    logDiv.innerText = user ? `🔒 ProtectedRoute: Usuario autenticado (${user.email})` : '🔒 ProtectedRoute: Usuario NO autenticado';
    document.body.appendChild(logDiv);
    setTimeout(() => { logDiv.remove(); }, 3500);
    // ...existing logic...
    if (!user) {
      const registroCompleto = localStorage.getItem('registroCompleto') === 'true';
      const authCompleted = localStorage.getItem('authCompleted') === 'true';
      const loginSuccess = localStorage.getItem('loginSuccess') === 'true';
      const userSession = localStorage.getItem('session');
      const hasAuthIndicators = registroCompleto || authCompleted || loginSuccess || userSession;
      if (hasAuthIndicators) {
        console.log('🟡 ProtectedRoute: Indicadores de auth encontrados, activando modo gracia');
        console.log('📝 Indicadores:', { registroCompleto, authCompleted, loginSuccess, hasSession: !!userSession });
        if (!graceMode) {
          setGraceMode(true);
          supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (session?.user) {
              console.log('✅ Sesión Supabase encontrada durante modo gracia');
            } else {
              console.log('⚠️ No se encontró sesión Supabase en modo gracia');
            }
          }).catch((authError) => {
            console.log('⚠️ Error verificando sesión Supabase:', authError);
          });
          const graceTimeout = window.location.hostname.includes('netlify') ? 180000 : 120000;
          const timeoutId = setTimeout(() => {
            if (!user) {
              console.log('⏱️ Fin del modo gracia - timeout alcanzado');
              setGraceMode(false);
              localStorage.removeItem('registroCompleto');
              localStorage.removeItem('authCompleted');
              localStorage.removeItem('loginSuccess');
              navigate('/', { replace: true });
            }
          }, graceTimeout);
          return () => clearTimeout(timeoutId);
        }
        return;
      }
      console.log('❌ Usuario no autenticado y sin indicadores, redirigiendo al login');
      navigate('/', { replace: true });
      return;
    }
    if (graceMode) {
      console.log('✅ Usuario autenticado, desactivando modo gracia');
      setGraceMode(false);
    }
    localStorage.removeItem('registroCompleto');
    localStorage.removeItem('authCompleted');
  }, [user, loading, navigate, graceMode, lastCheck]);

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

  // Mostrar contenido si hay usuario O si está en modo gracia
  if (!user && !graceMode) {
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
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔒</div>
          <div>Redirigiendo al login...</div>
        </div>
      </div>
    );
  }

  // Renderizar con indicador visual si está en modo gracia
  if (graceMode && !user) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid #FFD700',
          padding: '8px 16px',
          textAlign: 'center',
          color: '#FFD700',
          fontSize: '12px',
          zIndex: 9999
        }}>
          🟡 Estableciendo sesión... {user ? 'Usuario detectado' : 'Esperando autenticación'}
        </div>
        <div style={{ paddingTop: '40px' }}>
          {children}
        </div>
      </div>
    );
  }

  return children;
}

export default function FutProAppDefinitivo() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificación agresiva para Netlify - NUEVA
  useEffect(() => {
    const isNetlify = window.location.hostname.includes('netlify') || window.location.hostname.includes('futpro.vip');
    
    if (isNetlify) {
      // En Netlify, verificar indicadores inmediatamente sin esperar al usuario
      const authCompleted = localStorage.getItem('authCompleted') === 'true';
      const loginSuccess = localStorage.getItem('loginSuccess') === 'true';
      const userSession = localStorage.getItem('session');
      const registroCompleto = localStorage.getItem('registroCompleto') === 'true';
      const hasAuthIndicators = authCompleted || loginSuccess || userSession || registroCompleto;
      const shouldRedirectFrom = ['/', '/registro', '/registro-completo', '/auth/callback'];
      if (hasAuthIndicators && shouldRedirectFrom.includes(location.pathname)) {
        console.log('🌐 NETLIFY: Indicadores de auth detectados, navegando inmediatamente');
        console.log('📝 Indicadores:', { authCompleted, loginSuccess, hasSession: !!userSession, registroCompleto });
        // Redirección ultra-agresiva
        setTimeout(() => {
          try {
            navigate('/home', { replace: true });
          } catch (err) {
            console.warn('⚠️ navigate falló, usando window.location.href');
            window.location.href = '/home';
          }
          setTimeout(() => {
            if (window.location.pathname !== '/home') {
              window.location.href = '/home';
            }
          }, 1000);
        }, 500);
      }
    }
  }, [location.pathname]);

  // Manejar redirección post-login y post-registro - MEJORADO
  useEffect(() => {
    if (user) {
      const shouldRedirectFrom = ['/', '/registro', '/registro-completo', '/auth/callback'];
      if (shouldRedirectFrom.includes(location.pathname)) {
        console.log(`✅ Usuario autenticado, usando AuthFlowManager para navegación...`);
        // Usar AuthFlowManager para navegación robusta
        authFlowManager.executeRobustNavigation(navigate)
          .then(() => {
            console.log('🎯 Navegación exitosa con AuthFlowManager');
            localStorage.removeItem('postLoginRedirect');
            localStorage.removeItem('registroCompleto');
            localStorage.removeItem('authPending');
          })
          .catch((error) => {
            console.warn('⚠️ Error con AuthFlowManager, usando fallback:', error);
            const redirectTarget = localStorage.getItem('postLoginRedirect') || '/home';
            setTimeout(() => {
              try {
                navigate(redirectTarget, { replace: true });
              } catch (navError) {
                window.location.href = redirectTarget;
              }
              setTimeout(() => {
                if (window.location.pathname !== redirectTarget) {
                  window.location.href = redirectTarget;
                }
              }, 1000);
            }, 500);
          });
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
      <Route path="/registro-nuevo" element={<RegistroNuevo />} />
      
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