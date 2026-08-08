import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Estilos globales
import './styles/tailwind.css';
import './styles/responsive.css';

// i18n
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Auth y UI
import { AuthProvider } from './context/AuthContext';

// 🔥 INICIALIZAR TRACKING AUTOMÁTICO
import './trackingInit.js';

console.log('🚀 FutPro iniciando con tracking automático activado...');

const container = document.getElementById('root');

async function bootstrap() {
  if (!container) {
    console.error('❌ No se encontró el elemento #root en el DOM');
    return;
  }

  try {
    // Usar App.jsx como punto de entrada principal para la SPA
    const mod = await import('./App.jsx');
    const App = mod.default;

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </React.StrictMode>
    );

    // Registrar Service Worker para futuras push notifications
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js')
        console.log('🔔 Service Worker registrado', reg.scope)
      } catch (swErr) {
        console.warn('SW no registrado:', swErr?.message || swErr)
      }
    }
  } catch (err) {
    console.error('❌ Error al inicializar la app:', err);
    try {
      const overlay = document.getElementById('error-overlay');
      const content = document.getElementById('error-content');
      if (overlay && content) {
        overlay.style.display = 'block';
        content.textContent = err && err.stack ? err.stack : String(err);
      }
    } catch (e) { /* ignore */ }
  }
}

bootstrap();

// Import estático para forzar a Vite a incluir todos los módulos de la app en el build
import './App.jsx';
import './App.jsx';
