import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import * as TournamentService from '../services/TournamentService';

export default function PartidoArbitroPanel() {
  const { partidoId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [match, setMatch] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resultado');

  // Estados formulario resultado
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [penalties, setPenalties] = useState(false);
  const [homePenalties, setHomePenalties] = useState(0);
  const [awayPenalties, setAwayPenalties] = useState(0);

  // Estados formulario sanción
  const [sanctionTeam, setSanctionTeam] = useState('home');
  const [sanctionPlayer, setSanctionPlayer] = useState('');
  const [sanctionType, setSanctionType] = useState('yellow_card');
  const [sanctionReason, setSanctionReason] = useState('');
  const [sanctionMinute, setSanctionMinute] = useState('');
  const [sanctionDescription, setSanctionDescription] = useState('');

  useEffect(() => {
    loadData();
  }, [partidoId]);

  const loadData = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Cargar partido
      const { data: matchData, error: matchError } = await supabase
        .from('tournament_matches')
        .select('*, tournaments(*)')
        .eq('id', partidoId)
        .single();

      if (matchError) throw matchError;
      setMatch(matchData);
      setTournament(matchData.tournaments);

      if (matchData.home_score !== null) setHomeScore(matchData.home_score);
      if (matchData.away_score !== null) setAwayScore(matchData.away_score);

      // Cargar equipos
      const { data: homeTeamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', matchData.home_team_id)
        .single();
      setHomeTeam(homeTeamData);

      const { data: awayTeamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', matchData.away_team_id)
        .single();
      setAwayTeam(awayTeamData);

      // Cargar jugadores de ambos equipos
      const { data: homePlayersData } = await supabase
        .from('team_members')
        .select('*, auth.users!user_id(id, email, raw_user_meta_data)')
        .eq('team_id', matchData.home_team_id);
      setHomePlayers(homePlayersData || []);

      const { data: awayPlayersData } = await supabase
        .from('team_members')
        .select('*, auth.users!user_id(id, email, raw_user_meta_data)')
        .eq('team_id', matchData.away_team_id);
      setAwayPlayers(awayPlayersData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleSubmitResult = async () => {
    if (!confirm('¿Confirmar resultado del partido?')) return;

    try {
      const pointsMode = tournament?.playoff_type === 'no_draw' ? 'no_draw' : 'standard';
      const { homePoints, awayPoints } = TournamentService.calculatePoints(
        homeScore,
        awayScore,
        penalties,
        homePenalties > awayPenalties,
        pointsMode
      );

      const { error: matchError } = await supabase
        .from('tournament_matches')
        .update({
          home_score: homeScore,
          away_score: awayScore,
          decided_by_penalties: penalties,
          home_penalties: penalties ? homePenalties : null,
          away_penalties: penalties ? awayPenalties : null,
          status: 'finished',
          finished_at: new Date().toISOString()
        })
        .eq('id', partidoId);

      if (matchError) throw matchError;

      // Actualizar tabla de posiciones
      if (match.group_id) {
        const { error: standingsError } = await supabase.rpc('update_group_standings', {
          p_group_id: match.group_id,
          p_team_id: match.home_team_id,
          p_points: homePoints,
          p_goals_for: homeScore,
          p_goals_against: awayScore
        });

        if (!standingsError) {
          await supabase.rpc('update_group_standings', {
            p_group_id: match.group_id,
            p_team_id: match.away_team_id,
            p_points: awayPoints,
            p_goals_for: awayScore,
            p_goals_against: homeScore
          });
        }
      }

      // Notificar equipos
      const captains = await Promise.all([
        supabase.from('team_members').select('user_id').eq('team_id', match.home_team_id).eq('role', 'captain').single(),
        supabase.from('team_members').select('user_id').eq('team_id', match.away_team_id).eq('role', 'captain').single()
      ]);

      for (const captain of captains) {
        if (captain.data) {
          await supabase.from('notifications').insert({
            user_id: captain.data.user_id,
            type: 'match_result',
            title: 'Resultado del partido',
            message: `${homeTeam?.name} ${homeScore} - ${awayScore} ${awayTeam?.name}`,
            data: { match_id: partidoId }
          });
        }
      }

      alert('Resultado guardado exitosamente');
      loadData();
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Error al guardar resultado: ' + error.message);
    }
  };

  const handleSubmitSanction = async () => {
    if (!sanctionPlayer || !sanctionReason) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    try {
      const teamId = sanctionTeam === 'home' ? match.home_team_id : match.away_team_id;

      const { error } = await supabase
        .from('disciplinary_sanctions')
        .insert({
          tournament_id: match.tournament_id,
          match_id: partidoId,
          player_id: sanctionPlayer,
          team_id: teamId,
          referee_id: user.id,
          sanction_type: sanctionType,
          reason: sanctionReason,
          incident_minute: sanctionMinute ? parseInt(sanctionMinute) : null,
          incident_description: sanctionDescription || null
        });

      if (error) throw error;

      // Notificar jugador
      await supabase.from('notifications').insert({
        user_id: sanctionPlayer,
        type: 'sanction',
        title: 'Sanción disciplinaria',
        message: `Has recibido una sanción: ${sanctionType.replace('_', ' ')}`,
        data: { match_id: partidoId, tournament_id: match.tournament_id }
      });

      alert('Sanción registrada exitosamente');
      setSanctionPlayer('');
      setSanctionReason('');
      setSanctionMinute('');
      setSanctionDescription('');
      setSanctionType('yellow_card');
    } catch (error) {
      console.error('Error registering sanction:', error);
      alert('Error al registrar sanción: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>Cargando...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '40px', textAlign: 'center' }}>
        <h1>Partido no encontrado</h1>
      </div>
    );
  }

  const isReferee = user && match.referee_id === user.id;
  const isOrganizer = user && tournament && tournament.creator_id === user.id;

  if (!isReferee && !isOrganizer) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '40px', textAlign: 'center' }}>
        <h1>⛔ Acceso denegado</h1>
        <p>Solo el árbitro asignado o el organizador pueden acceder a este panel</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: '#fff', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '15px' }}>⚽ Panel de Árbitro</h1>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            <strong>{homeTeam?.name}</strong> vs <strong>{awayTeam?.name}</strong>
          </div>
          <div style={{ color: '#aaa', fontSize: '0.95rem' }}>
            {tournament?.name} • {match.match_date ? new Date(match.match_date).toLocaleString() : 'Fecha por confirmar'}
          </div>
          {match.status === 'finished' && (
            <div style={{ marginTop: '15px', padding: '10px', background: '#4ade80', color: '#000', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
              ✅ Partido Finalizado: {match.home_score} - {match.away_score}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('resultado')}
            style={{
              padding: '15px 30px',
              background: activeTab === 'resultado' ? '#FFD700' : '#2a2a2a',
              color: activeTab === 'resultado' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            📊 Registrar Resultado
          </button>
          <button
            onClick={() => setActiveTab('sanciones')}
            style={{
              padding: '15px 30px',
              background: activeTab === 'sanciones' ? '#FFD700' : '#2a2a2a',
              color: activeTab === 'sanciones' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ⚠️ Registrar Sanción
          </button>
        </div>

        {/* Contenido */}
        {activeTab === 'resultado' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Registrar Resultado del Partido</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              {/* Local */}
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>{homeTeam?.name} (Local)</h3>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <span style={{ display: 'block', marginBottom: '5px' }}>Goles</span>
                  <input
                    type="number"
                    min="0"
                    value={homeScore}
                    onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '1.5rem',
                      textAlign: 'center'
                    }}
                  />
                </label>
              </div>

              {/* Visitante */}
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>{awayTeam?.name} (Visitante)</h3>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <span style={{ display: 'block', marginBottom: '5px' }}>Goles</span>
                  <input
                    type="number"
                    min="0"
                    value={awayScore}
                    onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '1.5rem',
                      textAlign: 'center'
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Penaltis */}
            <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={penalties}
                  onChange={(e) => setPenalties(e.target.checked)}
                  style={{ marginRight: '10px', width: '20px', height: '20px' }}
                />
                <span>¿Se definió por penaltis?</span>
              </label>

              {penalties && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Penaltis {homeTeam?.name}</label>
                    <input
                      type="number"
                      min="0"
                      value={homePenalties}
                      onChange={(e) => setHomePenalties(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#2a2a2a',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '1.2rem',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Penaltis {awayTeam?.name}</label>
                    <input
                      type="number"
                      min="0"
                      value={awayPenalties}
                      onChange={(e) => setAwayPenalties(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#2a2a2a',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '1.2rem',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Información sistema de puntos */}
            <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', color: '#aaa' }}>
              <strong>Sistema de puntos:</strong> {tournament?.playoff_type === 'no_draw' ? 
                'Sin empates (penaltis si hay empate, ganador 2pts, perdedor 1pt)' : 
                'Estándar (victoria 3pts, empate 1pt, derrota 0pts)'}
            </div>

            <button
              onClick={handleSubmitResult}
              disabled={match.status === 'finished'}
              style={{
                width: '100%',
                padding: '15px',
                background: match.status === 'finished' ? '#666' : '#4ade80',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: match.status === 'finished' ? 'not-allowed' : 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {match.status === 'finished' ? '✅ Resultado ya registrado' : '💾 Guardar Resultado'}
            </button>
          </div>
        )}

        {activeTab === 'sanciones' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Registrar Sanción Disciplinaria</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px' }}>Equipo *</span>
                <select
                  value={sanctionTeam}
                  onChange={(e) => {
                    setSanctionTeam(e.target.value);
                    setSanctionPlayer('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="home">{homeTeam?.name}</option>
                  <option value="away">{awayTeam?.name}</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px' }}>Jugador *</span>
                <select
                  value={sanctionPlayer}
                  onChange={(e) => setSanctionPlayer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Seleccionar jugador...</option>
                  {(sanctionTeam === 'home' ? homePlayers : awayPlayers).map(player => (
                    <option key={player.user_id} value={player.user_id}>
                      {player.users?.raw_user_meta_data?.nombre || player.users?.email}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px' }}>Tipo de Sanción *</span>
                <select
                  value={sanctionType}
                  onChange={(e) => setSanctionType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="yellow_card">🟨 Tarjeta Amarilla</option>
                  <option value="red_card">🟥 Tarjeta Roja</option>
                  <option value="1_match_ban">⛔ Suspensión 1 partido</option>
                  <option value="2_match_ban">⛔ Suspensión 2 partidos</option>
                  <option value="3_match_ban">⛔ Suspensión 3 partidos</option>
                  <option value="4_match_ban">⛔ Suspensión 4 partidos</option>
                  <option value="expulsion">🚫 Expulsión del torneo</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px' }}>Minuto (opcional)</span>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={sanctionMinute}
                  onChange={(e) => setSanctionMinute(e.target.value)}
                  placeholder="45"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px' }}>Razón *</span>
                <input
                  type="text"
                  value={sanctionReason}
                  onChange={(e) => setSanctionReason(e.target.value)}
                  placeholder="Ej: Conducta antideportiva, agresión, etc."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <span style={{ display: 'block', marginBottom: '5px' }}>Descripción del incidente (opcional)</span>
                <textarea
                  value={sanctionDescription}
                  onChange={(e) => setSanctionDescription(e.target.value)}
                  rows="4"
                  placeholder="Detalles adicionales del incidente..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </label>
            </div>

            <button
              onClick={handleSubmitSanction}
              style={{
                width: '100%',
                padding: '15px',
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              ⚠️ Registrar Sanción
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
