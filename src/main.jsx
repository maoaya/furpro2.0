// FutPro - Red Social de Fútbol Profesional
// Clase principal de la aplicación FutPro

import LoginRegisterForm from './LoginRegisterForm.jsx';
import { AnalyticsManager } from './services/AnalyticsManager.js';
import { SearchManager } from './services/SearchManager.js';
import { AchievementManager } from './services/AchievementManager.js';
import CrearUsuarioForm from './components/CrearUsuarioForm';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';

// ...existing code...

class FutProApp {
  // ...existing code...
}

document.addEventListener('DOMContentLoaded', () => {
  window.futProApp = new FutProApp();
  window.futProApp.initVisualPanels();
});

export default FutProApp;

const MiVista = () => (
  <LoginRegisterForm />
);

// En tu router o render principal:
// <Route path="/crear-usuario" element={<CrearUsuarioForm onSuccess={()=>window.location.hash='#usuarios'} />} />

import './styles/tailwind.css';
import './styles/responsive.css';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AppRouter />
    </I18nextProvider>
  </React.StrictMode>
);
