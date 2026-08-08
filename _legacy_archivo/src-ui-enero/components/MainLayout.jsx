import React from 'react';
// import TopNavBar from './TopNavBar'; // Deshabilitado - se usa MenuHamburguesa en HomePage
import BottomNav from './BottomNav';

export default function MainLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* <TopNavBar /> */}
      
      <main style={{
        flex: 1,
        background: '#0a0a0a',
        color: '#fff',
        overflowY: 'auto',
        paddingBottom: '80px',
        scrollBehavior: 'smooth'
      }}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
