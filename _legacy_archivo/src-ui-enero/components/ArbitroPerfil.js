import React, { useEffect, useState } from 'react';
import { obtenerArbitro } from '../services/ArbitroManager';
import { obtenerPartidosPorArbitro } from '../services/PartidoManager';
import { Radar } from 'react-chartjs-2';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ArbitroPerfil({ arbitroId }) {
  const [arbitro, setArbitro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partidos, setPartidos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [partidoDetalle, setPartidoDetalle] = useState(null);

  useEffect(() => {
    async function fetchArbitro() {
      setLoading(true);
      const res = await obtenerArbitro(arbitroId);
      setArbitro(res?.data || null);
      setLoading(false);
    }
    if (arbitroId) fetchArbitro();
  }, [arbitroId]);

  useEffect(() => {
    async function fetchPartidos() {
      if (arbitroId) {
        const lista = await obtenerPartidosPorArbitro(arbitroId);
        setPartidos(lista);
      }
    }
    fetchPartidos();
  }, [arbitroId]);

  if (loading) return <div>Cargando perfil...</div>;
  if (!arbitro) return <div>Árbitro no encontrado.</div>;

  // Datos para gráfico radar de desempeño
  const radarData = {
    labels: ['Experiencia', 'Partidos Arbitrados', 'Certificaciones', 'Calificación Promedio'],
    datasets: [
      {
        label: 'Desempeño',
        data: [
          parseInt(arbitro.experiencia) || 0,
          arbitro.historialPartidos?.length || 0,
          arbitro.certificaciones?.length || 0,
          arbitro.calificacionPromedio || 0,
        ],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 40, borderRadius: 18, boxShadow: '0 4px 24px #FFD70044', maxWidth: 700, margin: 'auto' }}>
      <img src={arbitro.fotoUrl} alt={arbitro.nombre} style={{width:100,height:100,borderRadius:'50%',objectFit:'cover'}} />
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>{arbitro.nombre}</h2>
      <Radar data={radarData} options={{responsive:true, plugins:{legend:{display:false}}}} />
      <p><strong>Experiencia:</strong> {arbitro.experiencia}</p>
      <p><strong>Certificaciones:</strong> {arbitro.certificaciones?.join(', ')}</p>
      <p><strong>Contacto:</strong> {arbitro.contacto}</p>
      <p><strong>Estado:</strong> {arbitro.estado}</p>
      <h3>Historial de Partidos Asignados</h3>
      <div style={{ marginBottom: 24 }}>
        <label style={{ marginRight: 8 }}>Filtrar por fecha:</label>
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ marginRight: 8, padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #FFD700', background: '#232323', color: '#FFD700' }} />
        <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, marginLeft: 12, cursor: 'pointer' }}>Filtrar</button>
      </div>
      <ul>
        {partidos.filter(p => {
          if (fechaInicio && p.fecha < fechaInicio) return false;
          if (fechaFin && p.fecha > fechaFin) return false;
          return true;
        }).length === 0 ? (
          <li>No tiene partidos asignados en el rango.</li>
        ) : (
          partidos.filter(p => {
            if (fechaInicio && p.fecha < fechaInicio) return false;
            if (fechaFin && p.fecha > fechaFin) return false;
            return true;
          }).map((p, i) => (
            <li key={p.id || i} style={{ cursor:'pointer', textDecoration:'underline', color:'#FFD700' }} onClick={() => setPartidoDetalle(p)}>
              Ver detalle de partido #{p.id || i}
            </li>
          ))
        )}
      </ul>
      {/* Detalles del partido seleccionado */}
      {partidoDetalle && (
        <div style={{ marginTop: 24, background: '#232323', color: '#FFD700', padding: 16, borderRadius: 8 }}>
          <h3>Detalle del partido</h3>
          <pre>{JSON.stringify(partidoDetalle, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
