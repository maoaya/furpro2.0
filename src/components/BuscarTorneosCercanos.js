import React, { useState } from 'react';

export default function BuscarTorneosCercanos({ torneos, onNotificar }) {
  const [ubicacion, setUbicacion] = useState('');
  const [resultados, setResultados] = useState([]);
  const [filtros, setFiltros] = useState({ fecha: '', tipo: '', premio: '' });

  // Buscar por GPS
  const handleGPS = () => {
    if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(() => {
        // const { latitude, longitude } = pos.coords; // no usados
        // Simulación: filtrar torneos con lat/lng cercanos (aquí solo por nombre)
        const filtrados = torneos.filter(t => t.ubicacion?.toLowerCase().includes('bogotá'));
        setResultados(filtrados);
        if (filtrados.length > 0 && onNotificar) {
          onNotificar(`¡Hay ${filtrados.length} torneo(s) cerca de tu ubicación GPS!`);
        }
      });
    }
  };

  // Buscar manual y por filtros
  const handleBuscar = () => {
    let filtrados = torneos.filter(t => t.ubicacion?.toLowerCase().includes(ubicacion.toLowerCase()));
    if (filtros.fecha) filtrados = filtrados.filter(t => t.fecha === filtros.fecha);
    if (filtros.tipo) filtrados = filtrados.filter(t => t.tipo === filtros.tipo);
    if (filtros.premio) filtrados = filtrados.filter(t => t.premio === filtros.premio);
    setResultados(filtrados);
    if (filtrados.length > 0 && onNotificar) {
      onNotificar(`¡Hay ${filtrados.length} torneo(s) según tu búsqueda!`);
    }
  };

  return (
    <div style={{margin:'16px 0'}}>
      <h4>Buscar Torneos Cercanos</h4>
      <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Ciudad, barrio, zona..." style={{width:'40%'}} />
      <button onClick={handleBuscar}>Buscar</button>
      <button onClick={handleGPS} style={{marginLeft:8}}>Usar ubicación GPS</button>
      <div style={{margin:'8px 0'}}>
        <label>Fecha:</label>
        <input type="date" value={filtros.fecha} onChange={e => setFiltros(f => ({...f, fecha: e.target.value}))} />
        <label style={{marginLeft:8}}>Tipo:</label>
        <select value={filtros.tipo} onChange={e => setFiltros(f => ({...f, tipo: e.target.value}))}>
          <option value="">Todos</option>
          <option value="knockout">Eliminación directa</option>
          <option value="liga">Liga</option>
        </select>
        <label style={{marginLeft:8}}>Premio:</label>
        <select value={filtros.premio} onChange={e => setFiltros(f => ({...f, premio: e.target.value}))}>
          <option value="">Todos</option>
          <option value="con_premio">Con premio</option>
          <option value="sin_premio">Sin premio</option>
        </select>
      </div>
      <ul>
        {resultados.map((t, i) => (
          <li key={t.id || i}><strong>{t.nombre}</strong> - {t.ubicacion} - {t.fecha}</li>
        ))}
      </ul>
    </div>
  );
}
