import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import useArbitrosSocket from '../hooks/useArbitrosSocket';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ArbitroList() {
  const [arbitros, setArbitros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('experiencia');

  // Integración con sockets para actualización instantánea
  useArbitrosSocket((lista) => {
    setArbitros(lista);
    setLoading(false);
  });

  // Filtros y ordenamiento
  let filtrados = Array.isArray(arbitros) ? arbitros.filter(a =>
    (a.nombre?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (a.experiencia?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (a.estado?.toLowerCase() || '').includes(filtro.toLowerCase())
  ) : [];
  if (orden === 'experiencia') {
    filtrados = filtrados.sort((a, b) => parseInt(b.experiencia) - parseInt(a.experiencia));
  } else if (orden === 'partidos') {
    filtrados = filtrados.sort((a, b) => (b.historialPartidos?.length || 0) - (a.historialPartidos?.length || 0));
  } else if (orden === 'calificacion') {
    filtrados = filtrados.sort((a, b) => (b.calificacionPromedio || 0) - (a.calificacionPromedio || 0));
  }

  if (loading) return <div>Cargando árbitros...</div>;
  if (!filtrados.length) return <div>No hay árbitros registrados.</div>;

  // Datos para gráfico de partidos arbitrados y calificación promedio
  const barData = {
    labels: filtrados.map(a => a.nombre),
    datasets: [
      {
        label: 'Partidos Arbitrados',
        data: filtrados.map(a => a.historialPartidos?.length || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Calificación Promedio',
        data: filtrados.map(a => a.calificacionPromedio || 0),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Lista de Árbitros</h2>
      <div style={{marginBottom:16}}>
        <input
          type="text"
          placeholder="Buscar árbitro, experiencia o estado..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{marginRight:8,padding:4}}
        />
        <select value={orden} onChange={e => setOrden(e.target.value)} style={{padding:4}}>
          <option value="experiencia">Ordenar por experiencia</option>
          <option value="partidos">Ordenar por partidos arbitrados</option>
          <option value="calificacion">Ordenar por calificación promedio</option>
        </select>
      </div>
      <Bar data={barData} options={{responsive:true, plugins:{legend:{display:true}}}} />
      <ul>
        {filtrados.map(a => (
          <li key={a.id}>
            {a.fotoUrl ? (
              <img src={a.fotoUrl} alt={a.nombre} style={{width:40, height:40, borderRadius:'50%'}} />
            ) : (
              <div style={{width:40, height:40, borderRadius:'50%', background:'#ccc', display:'inline-block', marginRight:8}} />
            )}
            <strong>{a.nombre || 'Sin nombre'}</strong> - {a.experiencia || 'Sin experiencia'} - Estado: {a.estado || 'Sin estado'} - Calificación: {a.calificacionPromedio || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}
