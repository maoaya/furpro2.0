import React from 'react';
import SidebarMenu from './SidebarMenu';

const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#232323' }}>
    <SidebarMenu />
    <div style={{ flex: 1, padding: 40 }}>
      {/* Barra superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ fontWeight: 'bold', fontSize: 28, color: '#FFD700' }}>FutPro ⚽</div>
        <input type="text" placeholder="Buscar..." style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', width: 200 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#FFD700', fontWeight: 'bold' }}>🔔</span>
          <span style={{ color: '#FFD700', fontWeight: 'bold' }}>👤</span>
        </div>
      </div>
      {/* Feed central */}
      {children}
    </div>
  </div>
);

export default MainLayout;
