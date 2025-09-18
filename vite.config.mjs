import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración con code-splitting agresivo para reducir el bundle inicial
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-i18next',
      'antd',
      '@supabase/supabase-js',
      'firebase/app',
      'firebase/auth',
      'socket.io-client',
      'lodash',
      'react-toastify',
      'react-icons',
      'chart.js',
      'react-chartjs-2',
    ],
  },
  build: {
    target: 'es2018',
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) return 'react-vendor';
            if (id.includes('antd') || id.includes('react-icons') || id.includes('react-toastify')) return 'ui-vendor';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts-vendor';
            if (id.includes('@supabase')) return 'supabase-vendor';
            if (id.includes('firebase')) return 'firebase-vendor';
            if (id.includes('socket.io-client')) return 'socket-vendor';
            if (id.includes('lodash')) return 'lodash-vendor';
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
