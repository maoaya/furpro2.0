import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import TeamCard from '../components/TeamCard';
import SeleccionarAlineacion from '../components/SeleccionarAlineacion';
import TeamStatsService from '../services/TeamStatsService';

/**
 * Página de ejemplo que muestra cómo integrar:
 * - Team Card con stats calculadas
 * - Selector de alineación para torneos
 * - Inscripción a torneos con validación
 */
export default function EquipoTorneosPage() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    loadData();
  }, [teamId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar equipo
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      // Calcular stats completas del equipo
      const stats = await TeamStatsService.getCompleteTeamStats(teamId);
      
      setTeam({ ...teamData, stats });
      setTeamStats(stats);

      // Cargar torneos disponibles
      const { data: availableTournaments, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'open')
        .order('start_date', { ascending: true });

      if (tournamentsError) throw tournamentsError;
      setTournaments(availableTournaments || []);

      // Cargar torneos inscritos
      const { data: enrolledTournaments, error: enrolledError } = await supabase
        .from('tournament_teams')
        .select(`
          *,
          tournament:tournaments(*)
        `)
        .eq('team_id', teamId);

      if (enrolledError) throw enrolledError;
      setMyTournaments(enrolledTournaments || []);

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollTournament = async (tournament) => {
    try {
      // 1. Inscribir equipo al torneo
      const { error: enrollError } = await supabase
        .from('tournament_teams')
        .insert([{
          tournament_id: tournament.id,
          team_id: teamId,
          status: 'confirmed'
        }]);

      if (enrollError) throw enrollError;

      // 2. Abrir modal para seleccionar alineación
      setSelectedTournament(tournament);
      setShowLineupModal(true);

    } catch (error) {
      console.error('Error inscribiendo equipo:', error);
      alert('Error al inscribir el equipo al torneo');
    }
  };

  const handleLineupSaved = async (lineupData) => {
    console.log('Alineación guardada:', lineupData);
    setShowLineupModal(false);
    loadData(); // Recargar datos
    alert('✅ ¡Equipo inscrito y alineación guardada!');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFD700'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
          <div style={{ fontSize: '20px' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '48px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              {team?.name}
            </h1>
            <p style={{ color: '#aaa', fontSize: '16px' }}>
              Gestiona las inscripciones y alineaciones de tu equipo
            </p>
          </div>
          <button
            onClick={() => navigate(`/equipo/${teamId}`)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '2px solid #FFD700',
              color: '#FFD700',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ← Volver al equipo
          </button>
        </div>

        {/* Team Card Preview */}
        <div style={{
          marginBottom: '48px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <TeamCard 
            team={team} 
            size="large" 
            showStats={true}
            onClick={() => navigate(`/equipo/${teamId}`)}
          />
        </div>

        {/* Stats Breakdown */}
        {teamStats && (
          <div style={{
            background: '#181818',
            border: '2px solid #FFD700',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '16px', fontSize: '20px' }}>
              📊 Desglose del OVR ({teamStats.ovr})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#0a0a0a', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', color: '#3498DB', fontWeight: 'bold' }}>
                  {teamStats.breakdown?.playerAvg || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  Promedio Jugadores
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#0a0a0a', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', color: '#FFD700', fontWeight: 'bold' }}>
                  +{teamStats.breakdown?.tournamentBonus || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  Bonus Torneos
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#0a0a0a', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', color: '#2ECC71', fontWeight: 'bold' }}>
                  +{teamStats.breakdown?.winRateBonus || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  Bonus Win Rate
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#0a0a0a', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', color: '#E74C3C', fontWeight: 'bold' }}>
                  +{teamStats.breakdown?.streakBonus || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                  Bonus Racha
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mis Torneos */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '28px' }}>
            🏆 Mis Torneos ({myTournaments.length})
          </h2>
          {myTournaments.length === 0 ? (
            <div style={{
              background: '#181818',
              border: '2px dashed #FFD700',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              color: '#aaa'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
              <p style={{ fontSize: '18px' }}>
                Aún no estás inscrito en ningún torneo
              </p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Explora los torneos disponibles más abajo e inscríbete
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {myTournaments.map(enrollment => (
                <div
                  key={enrollment.id}
                  style={{
                    background: '#181818',
                    border: '2px solid #FFD700',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onClick={() => navigate(`/torneo/${enrollment.tournament.id}`)}
                >
                  <h3 style={{ color: '#FFD700', marginBottom: '12px' }}>
                    {enrollment.tournament.name}
                  </h3>
                  <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>
                    {enrollment.tournament.type} • {enrollment.tournament.format}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTournament(enrollment.tournament);
                        setShowLineupModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ⚽ Alineación
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Torneos Disponibles */}
        <div>
          <h2 style={{ color: '#FFD700', marginBottom: '24px', fontSize: '28px' }}>
            🌟 Torneos Disponibles ({tournaments.length})
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {tournaments.map(tournament => {
              const isEnrolled = myTournaments.some(e => e.tournament_id === tournament.id);
              
              return (
                <div
                  key={tournament.id}
                  style={{
                    background: '#181818',
                    border: isEnrolled ? '2px solid #2ECC71' : '2px solid #333',
                    borderRadius: '16px',
                    padding: '24px',
                    opacity: isEnrolled ? 0.6 : 1
                  }}
                >
                  {isEnrolled && (
                    <div style={{
                      background: '#2ECC71',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      ✅ YA INSCRITO
                    </div>
                  )}
                  <h3 style={{ color: '#FFD700', marginBottom: '12px' }}>
                    {tournament.name}
                  </h3>
                  <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
                    📅 {new Date(tournament.start_date).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>
                    {tournament.type} • {tournament.format || '11v11'}
                  </p>
                  {!isEnrolled && (
                    <button
                      onClick={() => handleEnrollTournament(tournament)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ➕ Inscribir Equipo
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Selección de Alineación */}
      {showLineupModal && selectedTournament && (
        <SeleccionarAlineacion
          teamId={teamId}
          tournamentId={selectedTournament.id}
          tournamentFormat={selectedTournament.format || '11v11'}
          onClose={() => setShowLineupModal(false)}
          onSave={handleLineupSaved}
        />
      )}
    </div>
  );
}
