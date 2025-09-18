import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div style={{
      position:'fixed',top:0,left:0,right:0,bottom:0,
      background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000
    }}>
      <div style={{background:'#fff',padding:24,borderRadius:12,minWidth:300}}>
        <button style={{float:'right'}} onClick={onClose}>Cerrar</button>
        {children}
      </div>
    </div>
  );
}
