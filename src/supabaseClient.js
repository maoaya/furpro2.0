
import { createClient } from '@supabase/supabase-js';
import { getConfig } from './config/environment.js';

// Configuración robusta para producción usando environment.js
const config = getConfig();
const SUPABASE_URL = config.supabaseUrl;
const SUPABASE_KEY = config.supabaseAnonKey;

// Detectar entorno de test (Jest backend) para reducir funcionalidad que usa MessageChannel/BroadcastChannel
const isJest = typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID !== undefined;
const isNode = typeof window === 'undefined';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Variables de entorno de Supabase faltantes');
    throw new Error('Configuración de Supabase incompleta');
}


// Configuración optimizada; en tests reducimos comportamiento para evitar MESSAGEPORT/BroadcastChannel
const supabaseOptions = isJest ? {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        flowType: 'implicit', // simple en tests
        storage: undefined,
    },
    global: { headers: { 'x-client-info': 'futpro-vip@test', 'x-application-name': 'FutPro VIP Test' } },
    realtime: { params: { eventsPerSecond: 0 } }
} : {
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
    },
    realtime: { params: { eventsPerSecond: 10 } }
};

if (!isJest) {
    console.log('🔗 Inicializando Supabase Client...');
    console.log('📍 URL:', SUPABASE_URL);
    console.log('🔑 Key configurada:', SUPABASE_KEY ? 'SÍ' : 'NO');
} else {
    // Log compacto en modo test
    // Evitar saturar salida de Jest con claves repetidas
    // No imprimir la key por seguridad
    // eslint-disable-next-line no-console
    console.log('[supabase:test] init');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, supabaseOptions);

// Listener de auth sólo en entorno real (no Jest backend)
if (!isJest && !isNode) {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth State Change:', event);
        if (session) {
            console.log('✅ Usuario autenticado:', session.user.email);
        }
    });
}

export default supabase;
export { supabase };
