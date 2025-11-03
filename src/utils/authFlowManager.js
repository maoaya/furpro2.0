// AuthFlowManager: función para manejar éxito de autenticación OAuth
export async function handleAuthenticationSuccess(user, navigate, options = {}) {
	try {
		// Guardar datos mínimos en localStorage
		localStorage.setItem('futpro_user', JSON.stringify(user));
		localStorage.setItem('authCompleted', 'true');
		// Navegación robusta
		if (navigate) {
			navigate('/home', { replace: true });
		} else {
			window.location.href = '/home';
		}
		return { success: true };
	} catch (error) {
		console.error('Error en handleAuthenticationSuccess:', error);
		return { success: false, error };
	}
}

// Implementación mínima de un gestor de flujo de autenticación para compatibilidad
class AuthFlowManager {
  async handlePostLoginFlow(user, navigate = null, additionalData = {}) {
    try {
      // Persistir señal de éxito de login y datos mínimos
      localStorage.setItem('futpro_user', JSON.stringify(user || {}));
      localStorage.setItem('authCompleted', 'true');
      localStorage.setItem('loginSuccess', 'true');

      // Navegación resiliente
      if (navigate) {
        try {
          navigate('/home', { replace: true });
        } catch {
          navigate('/homepage-instagram.html', { replace: true });
        }
      } else {
        // Fallback duro si no hay navigate disponible
        try {
          window.location.href = '/home';
        } catch {
          window.location.href = '/homepage-instagram.html';
        }
      }
      return { success: true };
    } catch (error) {
      console.error('AuthFlowManager.handlePostLoginFlow error:', error);
      return { success: false, error: error?.message || String(error) };
    }
  }

  async handleCompleteRegistrationFlow(formData, navigate = null) {
    try {
      // Señal mínima de registro completo (la creación de perfiles reales puede ocurrir en servicios específicos)
      localStorage.setItem('registrationCompleted', 'true');

      if (navigate) {
        try {
          navigate('/home', { replace: true });
        } catch {
          navigate('/homepage-instagram.html', { replace: true });
        }
      }
      return { success: true, message: 'Registro completo' };
    } catch (error) {
      console.error('AuthFlowManager.handleCompleteRegistrationFlow error:', error);
      return { success: false, error: error?.message || String(error) };
    }
  }
}

// Instancia singleton del manager y exports de compatibilidad
const authFlowManagerInstance = new AuthFlowManager();
export { authFlowManagerInstance as authFlowManager };
export default authFlowManagerInstance;

// Función de utilidad para registro completo que delega al manager
export async function handleCompleteRegistration(formData, navigate = null) {
  return await authFlowManagerInstance.handleCompleteRegistrationFlow(formData, navigate);
}
