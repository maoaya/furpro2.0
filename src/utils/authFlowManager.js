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
