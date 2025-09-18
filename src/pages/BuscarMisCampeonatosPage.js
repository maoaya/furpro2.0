
import React from 'react';
import MapaTorneos from '../components/MapaTorneos';

const misCampeonatos = [
  { id: 'c1', nombre: 'Mi Copa 1', ubicacion: 'Bogotá', fecha: '2025-08-15' },
  { id: 'c2', nombre: 'Mi Liga 2', ubicacion: 'Cali', fecha: '2025-09-10' },
];

function BuscarMisCampeonatosPage() {
  return (
    <div style={{maxWidth:800,margin:'auto',padding:32}}>
      <h2>Buscar mis campeonatos</h2>
      <MapaTorneos torneos={misCampeonatos} />
      <button style={{marginTop:32,background:'#FFD700',color:'#181818',padding:'12px 32px',borderRadius:'8px',fontWeight:'bold'}} onClick={()=>window.location.href='/'}>Ir al inicio</button>
    </div>
  );
}

export default BuscarMisCampeonatosPage;
