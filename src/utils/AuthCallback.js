// 🔄 Auth Callback Handler para FutPro
import supabase from '../supabaseClient';
// Maneja el callback de autenticación de proveedores OAuth

class AuthCallbackHandler {
    constructor() {
        this.init();
    }

    init() {
        // Verificar si estamos en una URL de callback
        if (window.location.pathname === '/auth/callback' || window.location.hash.includes('access_token')) {
            this.handleAuthCallback();
        }
    }

    async handleAuthCallback() {
        try {
            console.log('[DEBUG] 🔄 Procesando callback de autenticación...');

            // Obtener la sesión actual de Supabase
            const { data: { session }, error } = await supabase.auth.getSession();
            console.log('[DEBUG] Sesión obtenida:', session);

            if (error) {
                console.error('[DEBUG] Error obteniendo sesión:', error);
                this.redirectToError('Error de autenticación');
                return;
            }

            if (session) {
                console.log('[DEBUG] Usuario autenticado:', session.user);
                
                // Verificar si el usuario existe en nuestra base de datos
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                console.log('[DEBUG] Usuario en base de datos:', existingUser);

                // Si no existe, crear perfil
                if (!existingUser) {
                    console.log('[DEBUG] Creando perfil para usuario OAuth:', session.user.email);
                    await this.createUserFromOAuth(session.user);
                }

                // Redirigir a la aplicación
                console.log('[DEBUG] Redirigiendo a la app principal...');
                this.redirectToApp();
            } else {
                console.warn('[DEBUG] No se encontró sesión en callback');
                this.redirectToLogin('No se pudo completar la autenticación');
            }

        } catch (error) {
            console.error('[DEBUG] ❌ Error en callback de auth:', error);
            this.redirectToError(error.message);
        }
    }

    async createUserFromOAuth(user) {
        try {
            console.log('👤 Creando perfil para usuario OAuth:', user.email);

            const userData = {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                user_type: 'integrado', // Por defecto unificado
                phone: user.user_metadata?.phone || null,
                stats: {
                    rating: 500,
                    level: 'Novato',
                    matches_played: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals: 0,
                    assists: 0,
                    achievement_points: 0
                },
                achievements: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('users')
                .insert([userData]);

            if (error) {
                console.error('Error creando perfil OAuth:', error);
                throw error;
            }

            console.log('✅ Perfil OAuth creado exitosamente');

        } catch (error) {
            console.error('❌ Error creando perfil OAuth:', error);
            throw error;
        }
    }

    redirectToApp() {
        console.log('🏠 Redirigiendo a la aplicación principal');
        window.location.href = '/';
    }

    redirectToLogin(message) {
        console.log('🔐 Redirigiendo al login:', message);
        window.location.href = `/?error=${encodeURIComponent(message)}`;
    }

    redirectToError(message) {
        console.error('❌ Redirigiendo con error:', message);
        window.location.href = `/?error=${encodeURIComponent(message)}`;
    }
}

// Inicializar el handler cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AuthCallbackHandler();
});

export default AuthCallbackHandler;
