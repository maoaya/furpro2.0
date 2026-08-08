import React, { useState } from 'react';
import io from 'socket.io-client';
const socket = io('https://futpro.vip'); // Ajusta la URL según tu backend

export default function SorteoPartidos({ equipos, onSave }) {
  const [partidos, setPartidos] = useState([]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('18:00');
  const [duracion, setDuracion] = useState(60); // minutos

  // Generar partidos y horarios automáticamente
  const generarSorteo = () => {
    let emparejamientos = [];
    for (let i = 0; i < equipos.length; i += 2) {
      if (equipos[i+1]) {
        emparejamientos.push({
          equipoA: equipos[i],
          equipoB: equipos[i+1],
        });
      }
    }
    // Asignar horarios
    let partidosConHorario = [];
    let horaActual = horaInicio;
    emparejamientos.forEach((p) => {
      partidosConHorario.push({
        ...p,
        hora: horaActual,
        fecha: new Date().toISOString().slice(0,10),
      });
      // Calcular siguiente hora
      let [h, m] = horaActual.split(':').map(Number);
      m += duracion;
      h += Math.floor(m/60);
      m = m%60;
      let siguiente = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      if (siguiente > horaFin) siguiente = horaInicio;
      horaActual = siguiente;
    });
    setPartidos(partidosConHorario);
    socket.emit('partidosActualizados', partidosConHorario);
    if (onSave) onSave(partidosConHorario);
  };

  // Editar partido
  const editarPartido = (index, campo, valor) => {
    const nuevos = [...partidos];
    nuevos[index][campo] = valor;
    setPartidos(nuevos);
    socket.emit('partidosActualizados', nuevos);
    if (onSave) onSave(nuevos);
  };

  return (
    <div style={{margin:'24px 0'}}>
      <h3>Sorteo y Asignación Automática de Partidos</h3>
      <div style={{marginBottom:8}}>
        <label>Hora inicio:</label>
        <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
        <label style={{marginLeft:8}}>Hora fin:</label>
        <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
        <label style={{marginLeft:8}}>Duración (min):</label>
        <input type="number" value={duracion} min={10} max={180} onChange={e => setDuracion(Number(e.target.value))} />
        <button onClick={generarSorteo} style={{marginLeft:12}}>Generar Sorteo</button>
      </div>
      <table border="1" cellPadding="6" style={{width:'100%',marginTop:12}}>
        <thead>
          <tr>
            <th>Equipo A</th>
            <th>Equipo B</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {partidos.map((p, index) => (
            <tr key={index}>
              <td>{p.equipoA}</td>
              <td>{p.equipoB}</td>
              <td><input type="date" value={p.fecha} onChange={e => editarPartido(index,'fecha',e.target.value)} /></td>
              <td><input type="time" value={p.hora} onChange={e => editarPartido(index,'hora',e.target.value)} /></td>
              <td><button onClick={() => editarPartido(index,'edit',true)}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
