// Punto de entrada único de la SPA FutPro
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
    // Importar dinámicamente el app shell para capturar errores de bundle
    const mod = await import('./FutProAppDefinitivo.jsx');
    const FutProAppDefinitivo = mod.default;

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <AuthProvider>
              <FutProAppDefinitivo />
            </AuthProvider>
          </BrowserRouter>
        </I18nextProvider>
      </React.StrictMode>
    );
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
