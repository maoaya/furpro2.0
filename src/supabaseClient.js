
import { createClient } from '@supabase/supabase-js';
import { getConfig } from './config/environment.js';

// Configuración robusta para producción usando environment.js
const config = getConfig();
const SUPABASE_URL = config.supabaseUrl;
const SUPABASE_KEY = config.supabaseAnonKey;

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
        storage: (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : undefined,
        storageKey: 'futpro-auth-token'
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
    }
    // NO incluir db.schema aquí - se especificará por query cuando sea necesario
};

console.log('🔗 Inicializando Supabase Client (único)...');
console.log('📍 URL:', SUPABASE_URL);
console.log('🔑 Key configurada:', SUPABASE_KEY ? 'SÍ' : 'NO');

// Cliente único para TODO (Auth + DB)
// Para queries al schema 'api', usar: supabase.schema('api').from('table')
// Para queries al schema 'public', usar: supabase.from('table')
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, supabaseOptions);

// Export del mismo cliente con nombre alternativo para compatibilidad
export const supabaseAuth = supabase;

// Test de conexión inicial
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth State Change:', event);
    if (session) {
        console.log('✅ Usuario autenticado:', session.user.email);
    }
});

export default supabase;
