import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { transformSync } from 'esbuild';

export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      // Permite JSX dentro de archivos .js transformándolos ANTES del import-analysis de Vite
      {
        name: 'jsx-in-js-pre-transform',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.js')) {
            try {
              const result = transformSync(code, {
                loader: 'jsx',
                jsx: 'automatic',
                sourcemap: true
              });
              return { code: result.code, map: result.map };
            } catch (e) {
              // Si no tiene JSX válido, devolvemos undefined y Vite sigue su flujo normal
              return undefined;
            }
          }
        }
      },
      react(),
      // SPA gana sobre HTML residual (homepage-instagram, perfil.html, etc.)
      {
        name: 'fp-spa-route-priority',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const pathOnly = url.split('?')[0];
            // Nunca servir stubs HTML viejos como rutas de producto
            if (
              /homepage-instagram/i.test(pathOnly) ||
              /perfil-instagram\.html$/i.test(pathOnly) ||
              pathOnly === '/perfil.html'
            ) {
              req.url = '/index.html';
            }
            next();
          });
        },
      },
    ],
    root: './',
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: []
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
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
    // Variables de entorno que empiecen con VITE_ se incluyen automáticamente
    envPrefix: ['VITE_']
  };
});