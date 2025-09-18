import React, { useState } from 'react';
import ArbitroForm from '../components/ArbitroForm';
import ArbitroList from '../components/ArbitroList';
import TransmisionDirectaFutpro from '../components/TransmisionDirectaFutpro';
import ArbitroPerfil from '../components/ArbitroPerfil';

export default function ArbitrosPage() {
  const [selectedArbitroId, setSelectedArbitroId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleSuccess = () => setRefreshList(r => !r);

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '1200px', margin: 'auto', display:'flex',flexDirection:'column',alignItems:'center',gap:32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Panel de Árbitros</h2>
      <ArbitroForm onSuccess={handleSuccess} />
      <ArbitroList key={refreshList} />
      <div style={{marginTop:32}}>
        <h3>Ver perfil de árbitro</h3>
        <input type="text" placeholder="ID del árbitro" value={selectedArbitroId||''} onChange={e=>setSelectedArbitroId(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700', background: '#232323', color: '#FFD700', marginRight: 12 }} />
        {selectedArbitroId && <ArbitroPerfil arbitroId={selectedArbitroId} />}
      </div>
      <div style={{marginTop:32}}>
        <h3>Funciones del Árbitro</h3>
        <ul style={{ fontSize: 18 }}>
          <li>Registrar nuevo árbitro</li>
          <li>Editar datos de árbitro</li>
          <li>Eliminar árbitro</li>
          <li>Listar todos los árbitros</li>
          <li>Consultar perfil completo de árbitro</li>
          <li>Ver historial de partidos arbitrados</li>
          <li>Filtrar árbitros por experiencia, estado, certificaciones</li>
        </ul>
      </div>
      <button style={{marginTop:32,background:'#FFD700',color:'#181818',padding:'12px 32px',borderRadius:'8px',fontWeight:'bold',fontSize:18,boxShadow:'0 2px 8px #FFD70088'}} onClick={()=>window.location.href='/'}>Ir al inicio</button>
      <TransmisionDirectaFutpro />
    </div>
  );
}
