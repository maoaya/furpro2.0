import React from 'react';
import NotificacionesPanel from './NotificacionesPanel';
import CampanasPanel from './CampanasPanel';
import ProgramacionPanel from './ProgramacionPanel';
import RankingEstadisticasPanel from './RankingEstadisticasPanel';
import PagosPanel from './PagosPanel';
import ModeracionPanel from './ModeracionPanel';
import MarketplacePanel from './MarketplacePanel';
import TransmisionesPanel from './TransmisionesPanel';
import ConfiguracionPanel from './ConfiguracionPanel';

export default function SocialPanel({ usuario }) {
  const usuarioMock = {
    notificaciones: undefined,
    campanas: undefined,
    partidos: undefined,
    estadisticas: undefined,
    pagos: undefined,
    reportes: undefined,
    productos: undefined,
    transmisiones: undefined,
    nombre: 'Juan Pérez',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    seguidores: ['maria', 'pedro', 'lucas'],
    fotos: [
      'https://images.unsplash.com/photo-1',
      'https://images.unsplash.com/photo-2',
      'https://images.unsplash.com/photo-3'
    ],
    comentarios: [
      { usuario: 'maria', texto: '¡Gran perfil!' },
      { usuario: 'lucas', texto: 'Te sigo desde el torneo.' }
    ],
    likes: 34
  };
  const user = usuario || usuarioMock;
  const notificaciones = user.notificaciones;
  const campanas = user.campanas;
  const partidos = user.partidos;
  const estadisticas = user.estadisticas;
  const pagos = user.pagos;
  const reportes = user.reportes;
  const productos = user.productos;
  const transmisiones = user.transmisiones;

  return (
    <div className="social-panel" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16, margin: '24px 0' }}>
      <h3>Panel Social Completo</h3>
      <NotificacionesPanel notificaciones={notificaciones} />
      <CampanasPanel campanas={campanas} />
      <ProgramacionPanel partidos={partidos} />
      <RankingEstadisticasPanel estadisticas={estadisticas} />
      <PagosPanel pagos={pagos} />
      <ModeracionPanel reportes={reportes} />
      <MarketplacePanel productos={productos} />
      <TransmisionesPanel transmisiones={transmisiones} />
      <ConfiguracionPanel usuario={user} />
    </div>
  );
}
