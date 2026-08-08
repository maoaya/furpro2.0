import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavigationMonitor = (onNavigate) => {
  const location = useLocation();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    const navigationEvent = {
      timestamp,
      from: sessionStorage.getItem('lastPath') || 'initial',
      to: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      // Información adicional para debugging de auth
      isAuthRelated: location.pathname.includes('auth') || location.pathname.includes('registro') ||
                    location.pathname.includes('login') || location.pathname === '/',
      sessionUser: !!localStorage.getItem('session')
    };

    // Guardar la ruta actual para la próxima navegación
    sessionStorage.setItem('lastPath', location.pathname);

    // Log del evento de navegación
    console.log('🔍 NAVIGATION MONITOR:', navigationEvent);

    // Logs específicos para autenticación
    if (navigationEvent.isAuthRelated) {
      console.log('🔐 AUTH NAVIGATION:', {
        path: navigationEvent.to,
        hasSession: navigationEvent.sessionUser,
        timestamp: navigationEvent.timestamp
      });
    }

    // Llamar callback si se proporciona
    if (onNavigate) {
      onNavigate(navigationEvent);
    }

    // Almacenar en sessionStorage para debugging
    const existingLogs = JSON.parse(sessionStorage.getItem('navigationLogs') || '[]');
    existingLogs.push(navigationEvent);
    // Mantener solo los últimos 50 logs
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }
    sessionStorage.setItem('navigationLogs', JSON.stringify(existingLogs));

  }, [location.pathname, location.search, onNavigate]);
};

// Función para obtener logs de navegación
export const getNavigationLogs = () => {
  return JSON.parse(sessionStorage.getItem('navigationLogs') || '[]');
};

// Función para limpiar logs
export const clearNavigationLogs = () => {
  sessionStorage.removeItem('navigationLogs');
  sessionStorage.removeItem('lastPath');
};