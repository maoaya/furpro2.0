// Punto de entrada único de la SPA FutPro
// Carga el router solo si el usuario está autenticado; sino, muestra Login/Registro

import React from 'react';
import ReactDOM from 'react-dom/client';

// Estilos globales
import './styles/tailwind.css';
import './styles/responsive.css';

// i18n
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Auth y UI
import { AuthProvider, useAuth } from './AuthContext.jsx';
import LoginRegisterForm from './LoginRegisterForm.jsx';
import AppRouter from './AppRouter';

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader" />;
  return user ? <AppRouter /> : <LoginRegisterForm />;
}

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </I18nextProvider>
    </React.StrictMode>
  );
} else {
  // Si no existe #root, mostramos un error para facilitar el diagnóstico en producción
  // eslint-disable-next-line no-console
  console.error('Elemento #root no encontrado en index.html');
}
