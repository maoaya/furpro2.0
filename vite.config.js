import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    root: './',
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        external: ['vue'], // Excluir Vue explícitamente ya que es un proyecto React
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js']
          }
        }
      }
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
      open: true
    },
    preview: {
      port: 4173,
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    define: {
      global: 'globalThis',
      // Variables de entorno específicas para producción
      __IS_PRODUCTION__: isProduction,
      __BASE_URL__: JSON.stringify(isProduction ? 'https://futpro.vip' : 'http://localhost:5173')
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js']
    },
    // Variables de entorno que empiecen con VITE_ se incluyen automáticamente
    envPrefix: ['VITE_']
  };
});