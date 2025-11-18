import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioRegistroSimple from './pages/FormularioRegistroSimple.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import LayoutPrincipal from './components/LayoutPrincipal.jsx';

export default function AppRouterSimple() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Página de registro sin layout */}
          <Route path="/registro" element={<FormularioRegistroSimple />} />
          
          {/* Páginas con layout principal */}
          <Route path="/home" element={
            <LayoutPrincipal>
              <HomePage />
            </LayoutPrincipal>
          } />
          
          <Route path="/dashboard" element={
            <LayoutPrincipal>
              <DashboardPage />
            </LayoutPrincipal>
          } />
          
          {/* Ruta por defecto - va al registro */}
          <Route path="/" element={<FormularioRegistroSimple />} />
          <Route path="*" element={<FormularioRegistroSimple />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}