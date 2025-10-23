// Configuración global para Jest en modo watch y mocks automáticos

// Variables de entorno para Jest
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://example-project.supabase.co';
process.env.VITE_GOOGLE_CLIENT_ID = '760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com';
// Usar un valor dummy en tests; nunca claves reales en el repo
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'DUMMY_SUPABASE_ANON_KEY';
process.env.VITE_FACEBOOK_CLIENT_ID = '';

// Los mocks automáticos se deben definir en cada archivo de test ESM.