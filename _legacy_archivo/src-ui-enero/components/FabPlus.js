// Botón flotante “+” para crear contenido
import React, { useState } from 'react';
import Modal from './Modal'; // Asegúrate de crear este componente

export default function FabPlus() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="fab-plus"
        onClick={()=>setShowModal(true)}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3>¿Qué quieres crear?</h3>
          <button className="fab-option" onClick={()=>{window.location.hash='#media-upload';setShowModal(false);}}><i className="fa-solid fa-image"></i> Post</button>
          <button className="fab-option" onClick={()=>{window.location.hash='#match-management';setShowModal(false);}}><i className="fa-solid fa-futbol"></i> Partido</button>
          <button className="fab-option" onClick={()=>{window.location.hash='#team-management';setShowModal(false);}}><i className="fa-solid fa-users"></i> Club</button>
          <button className="fab-option" onClick={()=>{window.location.hash='#tournament-creator';setShowModal(false);}}><i className="fa-solid fa-trophy"></i> Torneo</button>
          <button className="cancelar" onClick={()=>setShowModal(false)}>Cancelar</button>
        </Modal>
      )}
    </>
  );
}
