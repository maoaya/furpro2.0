
import { createClient } from '@supabase/supabase-js';



// Vite expone las variables de entorno como import.meta.env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.warn('⚠️ No se encontraron las variables de entorno de Supabase. Revisa tu archivo .env y asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_KEY definidas.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
