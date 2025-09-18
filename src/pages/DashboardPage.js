import React from 'react';
import SocialPanel from '../components/SocialPanel';

function DashboardPage({ usuario }) {
  return (
    <div>
      <h1>Dashboard FutPro</h1>
      {usuario && <SocialPanel usuario={usuario} />}
      {/* ...otros paneles y widgets del dashboard... */}
    </div>
  );
}

export default DashboardPage;