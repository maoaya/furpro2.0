// ...existing code...
import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#232323', color: '#FFD700', padding: '24px 0', textAlign: 'center', fontSize: 32, fontWeight: 'bold', boxShadow: '0 2px 12px #FFD70044', borderRadius: '0 0 18px 18px' }}>
        FutPro 2.0
      </header>
      <main style={{ padding: '32px 0', minHeight: 'calc(100vh - 120px)' }}>
        {children}
      </main>
      <footer style={{ background: '#232323', color: '#FFD70099', padding: '18px 0', textAlign: 'center', fontSize: 16, borderRadius: '18px 18px 0 0', marginTop: 32 }}>
        &copy; 2025 FutPro. Todos los derechos reservados.
      </footer>
    </div>
  );
}
// ...existing code...
