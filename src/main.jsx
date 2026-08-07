import React from 'react';
import ReactDOM from 'react-dom/client';

// Estilos globales
import './styles/tailwind.css';
import './styles/responsive.css';

// i18n
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

console.log('🚀 FutPro iniciando...');

const container = document.getElementById('root');

async function bootstrap() {
  if (!container) {
    console.error('❌ No se encontró el elemento #root en el DOM');
    return;
  }

  try {
    // Carga dinámica de App — permite code-splitting (sin force-import estático)
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

    // Tracking diferido: no bloquea primer paint / nav
    const deferTracking = () => {
      import('./trackingInit.js').catch(() => {});
    };
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(deferTracking, { timeout: 3000 });
    } else {
      setTimeout(deferTracking, 1500);
    }

    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js');
        console.log('🔔 Service Worker registrado', reg.scope);
      } catch (swErr) {
        console.warn('SW no registrado:', swErr?.message || swErr);
      }
    }
  } catch (err) {
    console.error('❌ Error al inicializar la app:', err);
    try {
      const overlay = document.getElementById('error-overlay');
      const content = document.getElementById('error-content');
      if (overlay && content) {
        overlay.display = 'block';
        overlay.style.display = 'block';
        content.textContent = err && err.stack ? err.stack : String(err);
      }
    } catch { /* ignore */ }
  }
}

bootstrap();
