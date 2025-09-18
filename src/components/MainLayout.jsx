import React, { useState } from 'react';
import GlobalNav from './GlobalNav';

export default function MainLayout({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="main-layout">
      <GlobalNav open={navOpen} onToggle={() => setNavOpen(!navOpen)} />
      <div className="main-content" style={{ marginLeft: navOpen ? 220 : 0, transition: 'margin 0.2s' }}>
        {children}
      </div>
    </div>
  );
}
