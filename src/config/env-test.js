// Configuración de variables de entorno para pruebas y desarrollo
// Este archivo permite definir los valores de Supabase y callbacks para Node/Jest

process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tu-url.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';
process.env.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://tu-url.supabase.co/auth/v1/callback';
process.env.FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || 'https://tu-url.supabase.co/auth/v1/callback';

// Puedes agregar más variables si lo necesitas
