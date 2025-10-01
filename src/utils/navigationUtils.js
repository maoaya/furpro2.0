// Utilidades de navegación robustas para FutPro
// Este archivo centraliza todas las funciones de navegación para garantizar redirecciones exitosas

/**
 * Navega a HomePage de forma robusta con múltiples fallbacks
 * @param {function} navigate - Hook de navegación de React Router
 * @param {boolean} replace - Si debe reemplazar la entrada del historial
 */
export const navigateToHome = (navigate = null, replace = true) => {
  console.log('🔄 navigateToHome: Iniciando navegación a /home');
  
  // Método 1: React Router navigate (si está disponible)
  if (navigate && typeof navigate === 'function') {
    try {
      console.log('🔄 Usando React Router navigate');
      navigate('/home', { replace });
      
      // Verificar que la navegación fue exitosa después de un breve delay
      setTimeout(() => {
        if (window.location.pathname !== '/home') {
          console.warn('⚠️ React Router navigate falló, usando fallback');
          window.location.href = '/home';
        }
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('❌ Error con React Router navigate:', error);
    }
  }

  // Método 2: window.location.href (fallback directo)
  console.log('🔄 Usando window.location.href fallback');
  try {
    window.location.href = '/home';
    return true;
  } catch (error) {
    console.error('❌ Error con window.location.href:', error);
  }

  // Método 3: window.location.replace (fallback final)
  console.log('🔄 Usando window.location.replace como último recurso');
  try {
    window.location.replace('/home');
    return true;
  } catch (error) {
    console.error('❌ Error con window.location.replace:', error);
  }

  console.error('💥 Todos los métodos de navegación fallaron');
  return false;
};

/**
 * Maneja el flujo completo de autenticación exitosa
 * @param {object} userData - Datos del usuario
 * @param {function} navigate - Hook de navegación
 */
export const handleSuccessfulAuth = (userData, navigate = null) => {
  console.log('🎉 handleSuccessfulAuth: Procesando autenticación exitosa');
  
  // Marcar autenticación como completa
  markAuthenticationComplete(userData);
  
  // Navegar a HomePage
  setTimeout(() => {
    navigateToHome(navigate);
  }, 500);
  
  // Fallback adicional
  setTimeout(() => {
    if (window.location.pathname !== '/home') {
      console.log('🔄 Ejecutando fallback adicional');
      navigateToHome();
    }
  }, 2000);
};

/**
 * Marca el usuario como autenticado exitosamente
 * @param {object} userData - Datos del usuario autenticado
 */
export const markAuthenticationComplete = (userData = {}) => {
  try {
    console.log('✅ Marcando autenticación como completa');
    
    // Marcar autenticación como exitosa
    localStorage.setItem('authCompleted', 'true');
    localStorage.setItem('authTimestamp', new Date().toISOString());
    
    // Guardar datos del usuario si se proporcionan
    if (userData && Object.keys(userData).length > 0) {
      localStorage.setItem('userRegistrado', JSON.stringify({
        ...userData,
        loginTimestamp: new Date().toISOString()
      }));
    }
    
    // Limpiar redirecciones pendientes
    localStorage.removeItem('postLoginRedirect');
    
    console.log('✅ localStorage actualizado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error marcando autenticación:', error);
    return false;
  }
};

export const isUserAuthenticated = () => {
  const authCompleted = localStorage.getItem('authCompleted');
  const session = localStorage.getItem('session');
  const userRegistrado = localStorage.getItem('userRegistrado');
  
  return !!(authCompleted || session || userRegistrado);
};

export const clearAuthData = () => {
  const keysToRemove = [
    'authCompleted',
    'session', 
    'userRegistrado',
    'registroCompleto',
    'postLoginRedirect',
    'pendingProfileData',
    'tempRegistroData'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('🧹 Datos de autenticación limpiados');
};

export const setPostLoginRedirect = (path = '/home') => {
  localStorage.setItem('postLoginRedirect', path);
  localStorage.setItem('postLoginRedirectReason', 'user-action');
  console.log(`📌 Redirección post-login configurada: ${path}`);
};

export const getPostLoginRedirect = () => {
  const redirect = localStorage.getItem('postLoginRedirect');
  const reason = localStorage.getItem('postLoginRedirectReason');
  
  return {
    path: redirect || '/home',
    reason: reason || 'default'
  };
};