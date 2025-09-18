import React from 'react';

export default function MapaTorneos({ torneos }) {
  return (
    <div style={{margin:'16px 0'}}>
      <h4>Mapa de Torneos</h4>
      <div style={{width:'100%',height:300,border:'1px solid #ccc',borderRadius:8,background:'#e3e3e3',position:'relative'}}>
        {/* Simulación de mapa: mostrar ubicaciones como puntos */}
        {torneos.map((t, i) => (
          <div key={t.id || i} style={{position:'absolute',left:`${20+i*60}px`,top:`${100+i*30}px`,background:'#1877f2',color:'#fff',borderRadius:'50%',width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>
            {t.nombre[0]}
          </div>
        ))}
      </div>
      <div style={{marginTop:8}}>
        {torneos.map((t, i) => (
          <div key={t.id || i}><strong>{t.nombre}</strong>: {t.ubicacion} - {t.fecha}</div>
        ))}
      </div>
    </div>
  );
}
