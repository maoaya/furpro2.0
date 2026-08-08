import React, { useState } from 'react';

export default function ConvocatoriaEquipo({ equipo, onConvocar }) {
  const [mensaje, setMensaje] = useState('');
  const [convocatorias, setConvocatorias] = useState([]);

  const handleConvocar = () => {
    if (mensaje.trim()) {
      const nueva = { equipo, mensaje, fecha: new Date().toISOString() };
      setConvocatorias([...convocatorias, nueva]);
      setMensaje('');
      if (onConvocar) onConvocar();
    }
  };

  return (
    <div style={{margin:'16px 0'}}>
      <h4>Convocatoria de Equipo</h4>
      <input type="text" value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Mensaje de convocatoria..." style={{width:'70%'}} />
      <button onClick={handleConvocar}>Publicar convocatoria</button>
      <ul>
        {convocatorias.map((c, i) => (
          <li key={i}><strong>{c.equipo}:</strong> {c.mensaje} <span style={{color:'#888',fontSize:12}}>{new Date(c.fecha).toLocaleString()}</span></li>
        ))}
      </ul>
    </div>
  );
}
