// Cliente Supabase para Node.js (backend)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️ No se encontraron las variables de entorno de Supabase. Revisa tu archivo .env y asegúrate de tener SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY/ANON_KEY definidas.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
