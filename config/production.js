// Configuración específica para servidor de producción
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const productionConfig = {
  // Configuración del servidor
  port: process.env.PORT || 80,
  host: '0.0.0.0',
  
  // Paths importantes
  staticPath: join(__dirname, 'dist'),
  fallbackPath: join(__dirname, 'dist', 'index.html'),
  
  // CORS para producción
  corsOptions: {
    origin: [
      'https://futpro.vip',
      'https://www.futpro.vip'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // Configuración SSL
  ssl: {
    enabled: process.env.SSL_ENABLED === 'true',
    certPath: process.env.SSL_CERT_PATH,
    keyPath: process.env.SSL_KEY_PATH
  },
  
  // URLs importantes
  urls: {
    base: 'https://futpro.vip',
    oauth: {
      callback: 'https://futpro.vip/auth/callback',
      premium: 'https://futpro.vip/auth/callback-premium'
    }
  },
  
  // Configuración de headers de seguridad
  securityHeaders: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://qqrxetxcglwrejtblwut.supabase.co wss://qqrxetxcglwrejtblwut.supabase.co https://accounts.google.com https://graph.facebook.com; frame-src https://accounts.google.com https://www.facebook.com;"
  }
};

export default productionConfig;