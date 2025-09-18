const PrivacidadSeguridadPage = React.lazy(() => import('./pages/PrivacidadSeguridadPage'));
import React from 'react';
const Dashboard = React.lazy(() => import('./Dashboard'));
const PerfilAvanzado = React.lazy(() => import('./PerfilAvanzado'));
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutPrincipal from './components/LayoutPrincipal';

const TransportePage = React.lazy(() => import('./pages/TransportePage'));
const CrearMarcaPage = React.lazy(() => import('./pages/CrearMarcaPage'));
const CategoriasPage = React.lazy(() => import('./pages/CategoriasPage'));
const Inicio = React.lazy(() => import('./pages/Inicio'));
const Perfil = React.lazy(() => import('./pages/Perfil'));
const Equipos = React.lazy(() => import('./pages/Equipos'));
const EquipoDetalle = React.lazy(() => import('./pages/EquipoDetalle'));
const EquipoEditar = React.lazy(() => import('./pages/EquipoEditar'));
const Torneos = React.lazy(() => import('./pages/Torneos'));
const TorneoDetalle = React.lazy(() => import('./pages/TorneoDetalle'));
const TorneoEditar = React.lazy(() => import('./pages/TorneoEditar'));
const Partidos = React.lazy(() => import('./pages/Partidos'));
const PartidoDetalle = React.lazy(() => import('./pages/PartidoDetalle'));
const PartidoEditar = React.lazy(() => import('./pages/PartidoEditar'));
const Usuarios = React.lazy(() => import('./pages/Usuarios'));
const UsuarioDetalle = React.lazy(() => import('./pages/UsuarioDetalle'));
const UsuarioEditar = React.lazy(() => import('./pages/UsuarioEditar'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const AyudaFAQ = React.lazy(() => import('./pages/AyudaFAQ'));
const Soporte = React.lazy(() => import('./pages/Soporte'));
const EstadisticasAvanzadas = React.lazy(() => import('./pages/EstadisticasAvanzadas'));
const Streaming = React.lazy(() => import('./pages/Streaming'));
const PagosMarketplace = React.lazy(() => import('./pages/PagosMarketplace'));
const InvitacionesSolicitudes = React.lazy(() => import('./pages/InvitacionesSolicitudes'));
const Historial = React.lazy(() => import('./pages/Historial'));
const IntegracionesAPI = React.lazy(() => import('./pages/IntegracionesAPI'));
const Moderacion = React.lazy(() => import('./pages/ModeracionPage'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Notificaciones = React.lazy(() => import('./pages/Notificaciones'));
const Logros = React.lazy(() => import('./pages/Logros'));
const Comparativas = React.lazy(() => import('./pages/Comparativas'));
const Progreso = React.lazy(() => import('./pages/Progreso'));
const Penaltis = React.lazy(() => import('./pages/Penaltis'));
const RecuperarPassword = React.lazy(() => import('./pages/RecuperarPassword'));
const Configuracion = React.lazy(() => import('./pages/Configuracion'));
const ValidadorWeb = React.lazy(() => import('./pages/ValidadorWeb'));
const ValidarUsuarioForm = React.lazy(() => import('./pages/ValidarUsuarioForm'));
const ValidadorWebColaborativo = React.lazy(() => import('./pages/ValidadorWebColaborativo'));
const BuscarUsuario = React.lazy(() => import('./pages/BuscarUsuario'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <LayoutPrincipal>
        <React.Suspense fallback={<div className="loader" />}> 
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/equipos/:equipoId" element={<EquipoDetalle />} />
            <Route path="/equipos/:equipoId/editar" element={<EquipoEditar />} />
            <Route path="/torneos" element={<Torneos />} />
            <Route path="/torneos/:torneoId" element={<TorneoDetalle />} />
            <Route path="/torneos/:torneoId/editar" element={<TorneoEditar />} />
            <Route path="/partidos" element={<Partidos />} />
            <Route path="/partidos/:partidoId" element={<PartidoDetalle />} />
            <Route path="/partidos/:partidoId/editar" element={<PartidoEditar />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/:usuarioId" element={<UsuarioDetalle />} />
            <Route path="/usuarios/:usuarioId/editar" element={<UsuarioEditar />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/ayuda-faq" element={<AyudaFAQ />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/estadisticas-avanzadas" element={<EstadisticasAvanzadas />} />
            <Route path="/streaming" element={<Streaming />} />
            <Route path="/pagos-marketplace" element={<PagosMarketplace />} />
            <Route path="/invitaciones-solicitudes" element={<InvitacionesSolicitudes />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/integraciones-api" element={<IntegracionesAPI />} />
            <Route path="/moderacion" element={<Moderacion />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/logros" element={<Logros />} />
            <Route path="/comparativas" element={<Comparativas />} />
            <Route path="/progreso" element={<Progreso />} />
            <Route path="/penaltis" element={<Penaltis />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/validador-web" element={<ValidadorWeb />} />
            <Route path="/validar-usuario" element={<ValidarUsuarioForm />} />
            <Route path="/validador-web-colaborativo" element={<ValidadorWebColaborativo />} />
            <Route path="/buscar-usuario" element={<BuscarUsuario />} />
            {/* Rutas modernas: Dashboard y Perfil Avanzado */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil-avanzado" element={<PerfilAvanzado />} />
            <Route path="/privacidad-seguridad" element={<PrivacidadSeguridadPage />} />
            <Route path="/transporte" element={<TransportePage />} />
            <Route path="/crear-marca" element={<CrearMarcaPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="*" element={<Inicio />} />
          </Routes>
        </React.Suspense>
      </LayoutPrincipal>
    </BrowserRouter>
  );
}
