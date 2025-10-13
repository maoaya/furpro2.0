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
import FutProAppDefinitivo from './FutProAppDefinitivo.jsx';

// 🔧 Tracking desactivado en el arranque para evitar bloqueos de render.
// Se carga de forma perezosa y segura más tarde.
try {
  import('./trackingInit.js')
    .then(() => console.log('🧭 Tracking cargado en segundo plano'))
    .catch((e) => console.warn('⚠️ No se pudo cargar tracking:', e?.message));
} catch (e) {
  console.warn('⚠️ Error al programar carga de tracking:', e?.message);
}

console.log('🚀 FutPro iniciando (tracking lazy)...');

const container = document.getElementById('root');
if (container) {
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
} else {
  console.error('❌ No se encontró el elemento #root en el DOM');
}
