
import { createClient } from '@supabase/supabase-js';

// Configuración robusta para producción
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Variables de entorno de Supabase faltantes');
    throw new Error('Configuración de Supabase incompleta');
}

// Configuración optimizada para evitar errores 502
const supabaseOptions = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Configuración específica para evitar errores 502
        flowType: 'pkce',
        storage: window.localStorage,
        storageKey: 'futpro-auth-token',
        debug: false
    },
    global: {
        headers: {
            'x-client-info': 'futpro-vip@2.0.0',
            'x-application-name': 'FutPro VIP'
        }
    },
    // Configuración de red robusta
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    },
    // Configuración de reintento para evitar 502
    db: {
        schema: 'public'
    }
};

console.log('🔗 Inicializando Supabase Client...');
console.log('📍 URL:', SUPABASE_URL);
console.log('🔑 Key configurada:', SUPABASE_KEY ? 'SÍ' : 'NO');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, supabaseOptions);

// Test de conexión inicial
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth State Change:', event);
    if (session) {
        console.log('✅ Usuario autenticado:', session.user.email);
    }
});

export default supabase;
