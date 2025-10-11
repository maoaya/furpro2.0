// Configuración global para Jest en modo watch y mocks automáticos

// Variables de entorno para Jest
process.env.VITE_SUPABASE_URL = 'https://qqrxetxcglwrejtblwut.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnhldHhjZ2x3cmVqdGJsd3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MzQwMTQsImV4cCI6MjA0MTQxMDAxNH0.WaJRwm3fGSoOZzYpU5xhMc82rP6FqJKM52kQGYlXJz8';
process.env.VITE_GOOGLE_CLIENT_ID = '760210878835-bnl2k6qfb4vuhm9v6fqpj1dqh5kul6d8.apps.googleusercontent.com';
process.env.VITE_FACEBOOK_CLIENT_ID = '';

// Los mocks automáticos se deben definir en cada archivo de test ESM.