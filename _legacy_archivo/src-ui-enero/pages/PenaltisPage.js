import React, { useEffect, useState } from 'react';
import PenaltyGamePanel from '../components/PenaltyGamePanel';
import '../components/PenaltyGamePanel.css';
import RangoProgresoPanel from '../components/RangoProgresoPanel';
import '../components/RangoProgresoPanel.css';
import LogrosPanel from '../components/LogrosPanel';
import '../components/LogrosPanel.css';
import supabase from '../supabaseClient';

const usuarioDemo = {
  nombre: 'Juan Pérez',
  pais: 'Colombia',
  posicion: 'Delantero',
  foto: 'https://randomuser.me/api/portraits/men/32.jpg',
  goles: 24,
  asistencias: 12,
  partidos: 30,
  victorias: 18,
  tarjetas: 3,
  faltas: 7,
  mvp: 5,
  puntos: 0,
  club: 'Atlético Nacional',
  categoria: 'Sub-23',
  nivel: 'Profesional',
  edad: 22,
  penaltis: 0,
  penaltisFallados: 0,
  penaltisAtajados: 0
};

const logrosDemo = [
  { nombre: 'Goleador', descripcion: 'Anotó 5 goles en penaltis.' },
  { nombre: 'Imbatible', descripcion: 'No falló ningún penalti en una ronda.' }
];

// Función para guardar sesión en la base de datos
async function guardarSesionEnDB(usuarioId, tipo = 'login') {
  try {
    await supabase.from('sesiones').insert([
      {
        usuario_id: usuarioId,
        tipo_evento: tipo,
        fecha: new Date().toISOString(),
        ip: window?.location?.hostname || '',
        user_agent: navigator?.userAgent || '',
      }
    ]);
  } catch (err) {
    console.error('Error guardando sesión en DB:', err);
  }
}

export default function PenaltisPage(props) {
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);
  const [usuario, setUsuario] = useState(usuarioDemo);
  const [logros, setLogros] = useState(logrosDemo);

  const handleScore = (round, dir, kDir) => {
    setScore(s => s + (dir !== kDir ? 1 : 0));
    setUsuario(u => ({
      ...u,
      puntos: (u.puntos || 0) + (dir !== kDir ? 10 : 0),
      goles: u.goles + (dir !== kDir ? 1 : 0),
      penaltis: (u.penaltis || 0) + 1,
      penaltisFallados: (u.penaltisFallados || 0) + (dir === kDir ? 1 : 0),
      penaltisAtajados: (u.penaltisAtajados || 0) + (dir === kDir ? 1 : 0)
    }));
    if (dir !== kDir && score + 1 === 5) setLogros(l => [...l, { nombre: 'Goleador', descripcion: 'Anotó 5 goles en penaltis.' }]);
    if (dir === kDir && score === 0) setLogros(l => [...l, { nombre: 'Atajador', descripcion: 'Atajó el primer penalti.' }]);
  };

  useEffect(() => {
    // Suponiendo que tienes el usuario en contexto o props
    const usuarioId = props.usuarioId || (window.futProApp?.authService?.currentUser?.id);
    if (usuarioId) {
      guardarSesionEnDB(usuarioId, 'penaltis_page');
    }
  }, []);

  return (
    <div style={{background:'#181818',minHeight:'100vh',padding:'48px',color:'#FFD700'}}>
      <h2>Juego de Penaltis</h2>
      {!showGame && (
        <button style={{background:'#FFD700',color:'#232323',border:'none',borderRadius:'8px',padding:'12px 32px',fontWeight:'bold',fontSize:'1.1em',cursor:'pointer'}} onClick={()=>setShowGame(true)}>
          Iniciar juego
        </button>
      )}
      {showGame && (
        <PenaltyGamePanel onExit={()=>setShowGame(false)} onScore={handleScore} />
      )}
      <div style={{marginTop:'32px'}}>
        <RangoProgresoPanel usuario={usuario} ritmoPartidos={2} />
        <LogrosPanel logros={logros} />
        <div style={{marginTop:24}}>
          <a href="/historial-penaltis" style={{background:'#FFD700',color:'#232323',border:'none',borderRadius:'8px',padding:'12px 32px',fontWeight:'bold',fontSize:'1.1em',cursor:'pointer',textDecoration:'none'}}>Ver historial de penaltis</a>
        </div>
      </div>
    </div>
  );
}
