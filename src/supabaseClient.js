
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
    console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✓ presente' : '✗ FALTA');
    console.error('   VITE_SUPABASE_ANON_KEY:', SUPABASE_KEY ? '✓ presente' : '✗ FALTA');
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
    realtime: { params: { eventsPerSecond: 0 } },
    db: { schema: 'public' }
} : {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
        storage: (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : undefined,
        storageKey: 'futpro-auth-token'
    },
    global: {
        headers: {
            'x-client-info': 'futpro-vip@2.0.0',
            'x-application-name': 'FutPro VIP'
        }
    },
    realtime: { params: { eventsPerSecond: 10 } },
    db: { schema: 'public' }
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

// Evitar múltiples instancias de GoTrueClient (warning en tests) y sesiones persistentes en Node/Jest
// Reutilizamos un singleton en globalThis y ajustamos opciones de auth cuando es entorno de test/Node.
let supabase;
try {
    const isTestEnv = typeof process !== 'undefined' && (
        process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test'
    );

    const isNodeRuntime = typeof window === 'undefined';

    const globalKey = '__futpro_supabase_client__';
    const existing = typeof globalThis !== 'undefined' ? globalThis[globalKey] : null;

    if (existing) {
        supabase = existing;
    } else {
        const options = { ...supabaseOptions };
        // En Node/Jest evitamos persistencia y autorefresh para no crear múltiples clientes de auth
        if (isNodeRuntime || isTestEnv) {
            options.auth = {
                ...options.auth,
                persistSession: false,
                autoRefreshToken: false,
                // Storage mínimo no persistente para suprimir advertencias de almacenamiento
                storage: {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {}
                },
                // Usar storageKey único por proceso para evitar colisiones
                storageKey: `sb-${Math.random().toString(36).slice(2)}`
            };
        }

        supabase = createClient(SUPABASE_URL, SUPABASE_KEY, options);
        if (typeof globalThis !== 'undefined') {
            globalThis[globalKey] = supabase;
        }
    }
} catch (e) {
    // Fallback simple si algo falla durante la inicialización
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, supabaseOptions);
}

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
