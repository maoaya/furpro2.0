import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Bar } from 'react-chartjs-2';
import PerfilUsuario from '../components/PerfilUsuario';
import '../components/PerfilUsuario.css';

export default function RankingJugadoresPage() {
  const [ranking, setRanking] = useState([]);
  const [categoria, setCategoria] = useState('sub12');
  const categorias = ['sub12','sub13','sub14','sub15','sub16','sub17','sub18','sub20','mayores'];

  useEffect(() => {
    async function cargarRanking() {
      const { data, error } = await supabase.from('jugadores').select('*').eq('categoria', categoria);
      if (!error && data) {
        const rankingArr = data.map(j => ({
          id: j.id,
          nombre: j.nombre,
          valoracion: j.valoracion || 0,
          mejores_momentos: j.mejores_momentos || [],
          estadisticas: j.estadisticas || {},
        })).sort((a,b) => b.valoracion - a.valoracion);
        setRanking(rankingArr);
      }
    }
    cargarRanking();
  }, [categoria]);

  const chartData = {
    labels: ranking.map(j => j.nombre),
    datasets: [{
      label: 'Valoración',
      data: ranking.map(j => j.valoracion),
      backgroundColor: '#FFD700',
    }],
  };

  // Lógica de niveles y tarjetas para jugadores FutPro
  // Puedes mover esto a un archivo utils o manager si lo prefieres

  const TARJETAS_NIVELES = [
    { nivel: 2, puntos: 500 },
    { nivel: 3, puntos: 1500 },
    { nivel: 4, puntos: 5000 },
    { nivel: 5, puntos: 10000 },
  ];

  function calcularPuntosJugador({ partidos, goles, campeonatosGanados, amistososGanados }) {
    const puntosPartidosYGoles = (partidos + goles) * 0.5;
    const puntosCampeonatos = campeonatosGanados * 50;
    const puntosAmistosos = amistososGanados * 0.25;
    return puntosPartidosYGoles + puntosCampeonatos + puntosAmistosos;
  }

  function obtenerNivelTarjeta(puntos) {
    let nivel = 1;
    for (const t of TARJETAS_NIVELES) {
      if (puntos >= t.puntos) nivel = t.nivel;
    }
    return nivel;
  }

  function esLeyenda({ partidos, goles }) {
    return partidos >= 5000 && goles >= 5000;
  }

  // Lógica de calificación para equipos, jugadores, árbitros, jueces, organizadores y patrocinadores

  // Calificación de equipos
  function calcularPuntosEquipo({ victorias, partidosGanados, amistososGanados }) {
    // Puedes ajustar los valores según la importancia
    return victorias * 2 + partidosGanados * 1.5 + amistososGanados * 0.5;
  }

  // Calificación de árbitros y jueces
  function calcularPuntosArbitroJuez({ partidosDirigidos, campeonatosDirigidos, calificacionesRecibidas }) {
    return partidosDirigidos * 1 + campeonatosDirigidos * 10 + calificacionesRecibidas.reduce((a, b) => a + b, 0);
  }

  // Calificación de organizador de campeonato
  function calcularPuntosOrganizador({ campeonatosOrganizados, equiposParticipantes, feedbackRecibido }) {
    return campeonatosOrganizados * 20 + equiposParticipantes * 2 + feedbackRecibido.reduce((a, b) => a + b, 0);
  }

  // Calificación de patrocinadores
  function calcularPuntosPatrocinador({ campeonatosPatrocinados, equiposPatrocinados, impacto }) {
    return campeonatosPatrocinados * 15 + equiposPatrocinados * 5 + impacto;
  }

  // Breadcrumbs y navegación global FutPro
  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Ranking Jugadores', path: '/ranking-jugadores' },
    { label: 'Ranking Equipos', path: '/ranking-equipos' },
    { label: 'Programación', path: '/programacion' },
    { label: 'Perfil', path: '/perfil' },
    { label: 'Torneos', path: '/torneos' },
    // ...agrega más rutas si es necesario
  ];

  function BreadcrumbsNav() {
    return (
      <nav className="breadcrumbs-nav" style={{ margin: '16px 0', fontSize: '1rem' }}>
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.path}>
            <Link to={crumb.path} style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>{crumb.label}</Link>
            {idx < breadcrumbs.length - 1 && <span style={{ color: '#222', margin: '0 8px' }}>/</span>}
          </span>
        ))}
      </nav>
    );
  }

  // Ejemplo de usuario para demo (reemplaza por datos reales de tu backend)
  const usuarioDemo = {
    nombre: 'Juan Pérez',
    fotoPerfil: 'https://randomuser.me/api/portraits/men/32.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    bio: 'Delantero apasionado, siempre buscando el gol.',
    ubicacion: 'Madrid',
    equipo: 'FutPro FC',
    rol: 'Jugador',
    nivel: 4,
    partidos: 5200,
    goles: 5100,
    logros: ['MVP Torneo 2024', 'Máximo goleador', 'Leyenda FutPro'],
    seguidores: ['Ana', 'Luis', 'Carlos'],
    seguidos: ['FutPro FC', 'Torneos Madrid'],
    posts: [
      { tipo: 'foto', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b', descripcion: 'Golazo en la final' },
      { tipo: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', descripcion: 'Mejor jugada' },
    ],
    menciones: ['@FutProFC', '@TorneoMadrid'],
    titulos: ['Campeón Liga 2023', 'Leyenda FutPro'],
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <nav style={{ marginBottom: 18 }}>
        <Link to="/" style={{ color: '#FFD700', fontWeight: 'bold', marginRight: 12 }}>Inicio</Link>
        <span style={{ color: '#FFD700' }}> / </span>
        <Link to="/ranking-jugadores" style={{ color: '#FFD700', fontWeight: 'bold', marginRight: 12 }}>Ranking Jugadores</Link>
        <span style={{ color: '#FFD700' }}> / </span>
        <Link to="/ranking-equipos" style={{ color: '#FFD700', marginRight: 12 }}>Ranking Equipos</Link>
        <span style={{ color: '#FFD700' }}> / </span>
        <Link to="/programacion-partidos" style={{ color: '#FFD700' }}>Programación Partidos</Link>
      </nav>
      <BreadcrumbsNav />
      <h2>Ranking de Jugadores por Categoría</h2>
      <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ borderRadius: 8, padding: 8, marginBottom: 18 }}>
        {categorias.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
      </select>
      <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
        {ranking.map(j => {
          const puntos = calcularPuntosJugador(j.estadisticas);
          const nivelTarjeta = obtenerNivelTarjeta(puntos);
          const leyenda = esLeyenda(j.estadisticas);
          return (
            <li key={j.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
              <h3>{j.nombre}</h3>
              <div>Valoración: {j.valoracion}</div>
              <div>Estadísticas: {JSON.stringify(j.estadisticas)}</div>
              <div>Mejores momentos:</div>
              <ul>{j.mejores_momentos.map((m, idx) => <li key={idx}>{m}</li>)}</ul>
              <div>Nivel de tarjeta: {nivelTarjeta}</div>
              {leyenda && <div style={{ color: 'red' }}>¡Leyenda!</div>}
            </li>
          );
        })}
      </ul>
      <PerfilUsuario usuario={usuarioDemo} />
      {/* Puedes mostrar las menciones y títulos como cards aparte: */}
      <div className="perfil-menciones-titulos" style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
        {usuarioDemo.menciones.map((m, idx) => (
          <div key={idx} className="card-mencion" style={{ background: '#FFD700', color: '#222', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold' }}>{m}</div>
        ))}
        {usuarioDemo.titulos.map((t, idx) => (
          <div key={idx} className="card-titulo" style={{ background: '#222', color: '#FFD700', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold' }}>{t}</div>
        ))}
      </div>
    </div>
  );
}
