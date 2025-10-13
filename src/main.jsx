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
import LoginFallback from './components/LoginFallback.jsx';

// 🔧 Tracking: carga perezosa y segura después del primer render
const scheduleLazyTracking = () => {
  try {
    // Darle un respiro al hilo principal antes de cargar
    setTimeout(() => {
      // Intentar con el wrapper trackingInit (backward compatible)
      import('./trackingInit.js').then(mod => {
        console.log('🧭 Tracking (wrapper) cargado en segundo plano');
        if (mod?.default?.initialize) {
          mod.default.initialize?.();
        }
      }).catch(async (e) => {
        console.warn('⚠️ No se pudo cargar tracking wrapper, probando inicializador directo:', e?.message);
        try {
          const m = await import('./services/TrackingInitializer.js');
          if (m?.default?.initialize) {
            await m.default.initialize();
            console.log('🧭 Tracking (directo) inicializado');
          }
        } catch (e2) {
          console.warn('⚠️ Falló tracking directo:', e2?.message);
        }
      });
    }, 1000); // Aumentamos el delay para asegurar que React se cargue primero
  } catch (e) {
    console.warn('⚠️ Error al programar carga de tracking:', e?.message);
  }
};

console.log('🚀 FutPro iniciando (tracking lazy)...');

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  
  // Intentar render normal primero
  try {
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
    console.log('✅ App principal renderizada');
  } catch (error) {
    console.error('❌ Error renderizando app principal, usando fallback:', error);
    // Fallback: render básico sin dependencias complejas
    root.render(<LoginFallback />);
  }
  
  // Solo cargar tracking después de que React esté completamente renderizado
  setTimeout(scheduleLazyTracking, 2000);
} else {
  console.error('❌ No se encontró el elemento #root en el DOM');
}
