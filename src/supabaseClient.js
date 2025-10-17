
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
    },
    // Configuración de reintento para evitar 502
    db: {
        // Supabase REST en producción expone el esquema 'api' (no 'public')
        // Esto evita errores 406 (PGRST106: The schema must be one of...)
        schema: 'api'
    }
};

// Opciones SIN restricción de schema para operaciones de autenticación
// Necesario porque OAuth necesita acceder a auth.users, no a api.*
const authOnlyOptions = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : undefined,
        storageKey: 'futpro-auth-token'
    },
    global: {
        headers: {
            'x-client-info': 'futpro-vip@2.0.0',
            'x-application-name': 'FutPro VIP'
        }
    }
    // NO incluimos db.schema para permitir acceso a auth.users
};

console.log('🔗 Inicializando Supabase Client...');
console.log('📍 URL:', SUPABASE_URL);
console.log('🔑 Key configurada:', SUPABASE_KEY ? 'SÍ' : 'NO');

// Cliente principal con schema 'api' para operaciones de base de datos
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, supabaseOptions);

// Cliente especial para Auth sin restricción de schema
export const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_KEY, authOnlyOptions);

// Test de conexión inicial
supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth State Change:', event);
    if (session) {
        console.log('✅ Usuario autenticado:', session.user.email);
    }
});

export default supabase;
