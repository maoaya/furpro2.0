import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const VerMiPlantilla = () => {
  const { user } = useAuth();
  const { teamId } = useParams();
  const [championship, setChampionship] = useState('futbol11');
  const [rosters, setRosters] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const championshipConfig = {
    futsal: { name: 'Futsal', positions: 5, tipos: ['Arquero', 'Defensa', 'Centrocampista', 'Delantero', 'Pivot'] },
    microfutbol: { name: 'Microfútbol', positions: 5, tipos: ['Arquero', 'Defensa', 'Centrocampista', 'Delantero', 'Pivot'] },
    futbol5: { name: 'Fútbol 5', positions: 5, tipos: ['Arquero', 'Defensa', 'Centrocampista', 'Delantero', 'Delantero'] },
    futbol6: { name: 'Fútbol 6', positions: 6, tipos: ['Arquero', 'Defensa', 'Defensa', 'Centrocampista', 'Delantero', 'Delantero'] },
    futbol7: { name: 'Fútbol 7', positions: 7, tipos: ['Arquero', 'Defensa', 'Defensa', 'Centrocampista', 'Centrocampista', 'Delantero', 'Delantero'] },
    futbol8: { name: 'Fútbol 8', positions: 8, tipos: ['Arquero', 'Defensa', 'Defensa', 'Centrocampista', 'Centrocampista', 'Centrocampista', 'Delantero', 'Delantero'] },
    futbol9: { name: 'Fútbol 9', positions: 9, tipos: ['Arquero', 'Defensa', 'Defensa', 'Centrocampista', 'Centrocampista', 'Centrocampista', 'Delantero', 'Delantero', 'Delantero'] },
    futbol10: { name: 'Fútbol 10', positions: 10, tipos: ['Arquero', 'Defensa', 'Defensa', 'Defensa', 'Centrocampista', 'Centrocampista', 'Centrocampista', 'Delantero', 'Delantero', 'Delantero'] },
    futbol11: { name: 'Fútbol 11', positions: 11, tipos: ['Arquero', 'Defensa', 'Defensa', 'Defensa', 'Centrocampista', 'Centrocampista', 'Centrocampista', 'Centrocampista', 'Delantero', 'Delantero', 'Delantero'] },
    penaltis: { name: 'Torneo de Penaltis', positions: 10, tipos: ['Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor', 'Ejecutor'] }
  };

  useEffect(() => {
    cargarPlantilla();
  }, [championship, teamId]);

  const cargarPlantilla = async () => {
    setLoading(true);
    try {
      // Obtener datos del equipo
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      setTeam(teamData);

      // Obtener plantilla del campeonato
      const { data: rosterData } = await supabase
        .from('team_rosters')
        .select('*, carfutpro!inner(nombre, apellido, avatar_url, photo_url, posicion)')
        .eq('team_id', teamId)
        .eq('championship_type', championship);

      setRosters(rosterData || []);
    } catch (err) {
      console.error('Error cargando plantilla:', err);
    } finally {
      setLoading(false);
    }
  };

  const config = championshipConfig[championship];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '20px',
      color: '#fff'
    }}>
      <h1 style={{ color: '#FFD700', marginBottom: 20, textAlign: 'center' }}>
        🏟️ Mi Plantilla - {config?.name}
      </h1>

      {/* Selector de campeonato */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 8, overflowX: 'auto', justifyContent: 'center' }}>
        {Object.entries(championshipConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setChampionship(key)}
            style={{
              background: championship === key ? '#FFD700' : 'rgba(255,215,0,0.2)',
              color: championship === key ? '#000' : '#FFD700',
              border: 'none',
              borderRadius: 6,
              padding: '8px 12px',
              fontWeight: 'bold',
              fontSize: 12,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cfg.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#FFD700' }}>⚽ Cargando plantilla...</div>
      ) : (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(24,24,24,0.8)',
          border: '2px solid #FFD700',
          borderRadius: 12,
          padding: 24
        }}>
          {/* Campo de fútbol/distribución */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(34,139,34,0.3) 0%, rgba(34,139,34,0.1) 100%)',
            border: '2px dashed #FFD700',
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            minHeight: 400,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            alignContent: 'start'
          }}>
            {Array.from({ length: config?.positions || 11 }).map((_, idx) => {
              const player = rosters.find(r => r.number === idx + 1);
              return (
                <div
                  key={idx}
                  style={{
                    background: player ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,215,0,0.1)',
                    border: '2px solid #FFD700',
                    borderRadius: 8,
                    padding: 12,
                    textAlign: 'center',
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPosition(idx + 1)}
                >
                  {player ? (
                    <>
                      <img
                        src={player.carfutpro.photo_url || player.carfutpro.avatar_url}
                        alt={player.carfutpro.nombre}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          marginBottom: 6,
                          border: '2px solid #000'
                        }}
                      />
                      <div style={{ fontWeight: 'bold', color: '#000', fontSize: 12 }}>
                        {player.carfutpro.nombre.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: 10, color: '#000', marginTop: 2 }}>
                        #{idx + 1}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>+</div>
                      <div style={{ fontSize: 10, color: '#FFD700' }}>Posición {idx + 1}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Información de plantilla */}
          <div style={{
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid #FFD700',
            borderRadius: 8,
            padding: 16
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: 12 }}>
              📋 Plantilla ({rosters.length}/{config?.positions})
            </h3>
            {rosters.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>
                No hay jugadores convocados aún.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {rosters.map((roster, idx) => (
                  <div
                    key={roster.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 10,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 6
                    }}
                  >
                    <img
                      src={roster.carfutpro.photo_url || roster.carfutpro.avatar_url}
                      alt=""
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#FFD700' }}>
                        #{roster.number} - {roster.carfutpro.nombre} {roster.carfutpro.apellido}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {roster.position || roster.carfutpro.posicion || '—'} • {roster.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerMiPlantilla;
