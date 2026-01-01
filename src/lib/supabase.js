// Cliente Supabase compartido - importar desde aquí en toda la app
import { createClient } from '@supabase/supabase-js';
import { getConfig } from '../config/environment.js';

const config = getConfig();

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.error('❌ Configuración de Supabase incompleta');
  throw new Error('Variables de Supabase no configuradas');
}

// Cliente Supabase singleton
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    // El endpoint REST expone el schema 'api'. Evita 406 "schema must be ...".
    schema: 'api'
  }
});

export default supabase;
