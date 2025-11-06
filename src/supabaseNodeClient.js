// Cliente Supabase para Node.js (backend)
// ⚠️ NOTA: Para evitar instancias duplicadas, este archivo ahora re-exporta
// la instancia centralizada de supabaseClient.js con opciones de Node.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️ No se encontraron las variables de entorno de Supabase. Revisa tu archivo .env y asegúrate de tener SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY/ANON_KEY definidas.');
}

// Crear instancia con configuración específica de Node.js
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // NOTA: No especificar db.schema - usar default de Supabase
  // El error PGRST106 indica que 'public' no es válido en PostgREST v12+
  auth: {
    persistSession: false, // En backend no necesitamos persistir sesiones
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

module.exports = supabase;
