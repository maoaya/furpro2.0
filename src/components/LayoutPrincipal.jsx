import React from 'react';

import TopBar from './TopBar';
import GlobalNav from './GlobalNav';
import BottomNav from './BottomNav';
import { useAuth } from '../AuthContext';
import LoginSocial from './LoginSocial.jsx';
import PerfilCompletoForm from './PerfilCompletoForm';

export default function LayoutPrincipal({ children }) {
  const { user } = useAuth();
  const [perfil, setPerfil] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('perfil'));
    } catch {
      return null;
    }
  });
  if (!user) {
    return <LoginSocial onLoginSuccess={() => window.location.reload()} />;
  }
  if (!perfil || !perfil.nombre) {
    return <PerfilCompletoForm user={user} onComplete={() => window.location.reload()} />;
  }
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <TopBar />
      <div style={{display:'flex',flex:1}}>
        <GlobalNav />
        <main style={{flex:1,padding:24,background:'#181818', color:'#FFD700'}}>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
