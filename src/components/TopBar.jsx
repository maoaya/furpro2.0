// TopBar con logo, búsqueda y notificaciones
import React from 'react';

export default function TopBar() {
  return (
    <header className="top-bar" role="banner" aria-label="Barra superior FutPro">
      <div className="top-bar__logo" onClick={()=>window.location.hash='#home'}>
        <img src="/assets/logo-futpro.png" alt="Logo FutPro" className="top-bar__logo-img" tabIndex={0} aria-label="Logo FutPro" />
        <span className="top-bar__logo-text" tabIndex={0} aria-label="Nombre FutPro">FutPro</span>
      </div>
      <input type="text" placeholder="Buscar..." className="top-bar__search" aria-label="Buscar"
        tabIndex={0} aria-live="polite"
        onKeyDown={e=>{if(e.key==='Enter'){window.location.hash='#search/'+e.target.value}}}
      />
      <div className="top-bar__buttons">
        <button className="top-bar__button" aria-label="Notificaciones" tabIndex={0} aria-live="polite"
          onClick={()=>window.location.hash='#notifications'}>
          <i className="fa-solid fa-bell" aria-hidden="true"></i>
          <span className="sr-only">Notificaciones</span>
        </button>
        <button className="top-bar__button" aria-label="Mensajes" tabIndex={0} aria-live="polite"
          onClick={()=>window.location.hash='#chat'}>
          <i className="fa-solid fa-envelope" aria-hidden="true"></i>
          <span className="sr-only">Mensajes</span>
        </button>
      </div>
    </header>
  );
}
