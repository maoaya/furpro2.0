import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import * as TournamentService from '../services/TournamentService';

export default function TorneoDetalleCompleto() {
  const { torneoId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [sanctions, setSanctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTeams, setInviteTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    loadData();
    subscribeToUpdates();
  }, [torneoId]);

  const loadData = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Cargar torneo
      const tournamentData = await TournamentService.getTournamentById(torneoId);
      setTournament(tournamentData);

      // Cargar equipos registrados
      const { data: registrations } = await supabase
        .from('tournament_registrations')
        .select('*, teams(*)')
        .eq('tournament_id', torneoId);
      setTeams(registrations || []);

      // Cargar partidos
      const matchesData = await TournamentService.getTournamentMatches(torneoId);
      setMatches(matchesData);

      // Cargar sanciones
      const { data: sanctionsData } = await supabase
        .from('disciplinary_sanctions')
        .select('*, auth.users!player_id(email), teams(name)')
        .eq('tournament_id', torneoId);
      setSanctions(sanctionsData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`tournament-${torneoId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tournament_registrations',
        filter: `tournament_id=eq.${torneoId}`
      }, () => loadData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const handleInviteTeams = async () => {
    const { data: allTeams } = await supabase
      .from('teams')
      .select('*')
      .eq('location', tournament?.location)
      .limit(50);
    
    setInviteTeams(allTeams || []);
    setShowInviteModal(true);
  };

  const sendInvitations = async () => {
    try {
      const invitations = selectedTeams.map(teamId => ({
        tournament_id: torneoId,
        team_id: teamId,
        invited_by: user.id,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('tournament_invitations')
        .insert(invitations);

      if (error) throw error;

      // Enviar notificaciones
      for (const teamId of selectedTeams) {
        const { data: captains } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', teamId)
          .eq('role', 'captain');

        if (captains && captains.length > 0) {
          await supabase.from('notifications').insert({
            user_id: captains[0].user_id,
            type: 'tournament_invitation',
            title: `Invitación a torneo: ${tournament.name}`,
            message: `Has sido invitado a participar en ${tournament.name}`,
            data: { tournament_id: torneoId }
          });
        }
      }

      alert(`${selectedTeams.length} invitaciones enviadas`);
      setShowInviteModal(false);
      setSelectedTeams([]);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Error al enviar invitaciones');
    }
  };

  const handleGenerateGroups = async () => {
    if (!confirm('¿Generar grupos automáticamente? Esto distribuirá los equipos registrados.')) return;

    try {
      const numGroups = Math.ceil(teams.length / 4);
      await TournamentService.generateGroups(torneoId, numGroups);
      alert('Grupos generados exitosamente');
      loadData();
    } catch (error) {
      console.error('Error generating groups:', error);
      alert('Error al generar grupos: ' + error.message);
    }
  };

  const isCreator = user && tournament && user.id === tournament.creator_id;
  const isFull = tournament && teams.length >= tournament.max_teams;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.5rem' }}>Cargando torneo...</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '40px', textAlign: 'center' }}>
        <h1>Torneo no encontrado</h1>
        <button onClick={() => navigate('/torneos')} style={{ marginTop: '20px', padding: '12px 24px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Ver torneos
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: '#fff', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#FFD700', margin: '0 0 10px 0' }}>{tournament.name}</h1>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.95rem', color: '#aaa' }}>
                <span>📍 {tournament.location}, {tournament.country}</span>
                <span>🏆 {tournament.category}</span>
                <span>👥 {teams.length}/{tournament.max_teams} equipos</span>
                <span style={{ color: isFull ? '#4ade80' : '#fbbf24' }}>
                  {isFull ? '✅ Completo' : '⏳ Inscripciones abiertas'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {isCreator && (
                <>
                  <button onClick={handleInviteTeams} style={{ padding: '12px 20px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    📧 Invitar equipos
                  </button>
                  {isFull && (
                    <button onClick={handleGenerateGroups} style={{ padding: '12px 20px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      🎲 Generar grupos
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #444' }}>
            {['info', 'equipos', 'partidos', 'sanciones'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: activeTab === tab ? '#FFD700' : '#aaa',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #FFD700' : 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'info' ? 'ℹ️ Información' :
                 tab === 'equipos' ? `👥 Equipos (${teams.length})` :
                 tab === 'partidos' ? `⚽ Partidos (${matches.length})` :
                 `⚠️ Sanciones (${sanctions.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'info' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Información del Torneo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p><strong>Categoría:</strong> {tournament.category}</p>
                <p><strong>Edades:</strong> {tournament.min_age} - {tournament.max_age} años</p>
                <p><strong>Formato:</strong> {tournament.tournament_format}</p>
                <p><strong>Equipos máximos:</strong> {tournament.max_teams}</p>
                <p><strong>Jugadores por equipo:</strong> {tournament.max_players_per_team}</p>
              </div>
              <div>
                <p><strong>Inscripción:</strong> {tournament.registration_fee > 0 ? `${tournament.registration_fee} ${tournament.currency}` : 'Gratis'}</p>
                <p><strong>Transmisión en vivo:</strong> {tournament.is_live_required ? 'Obligatoria ⚠️' : 'Opcional'}</p>
                <p><strong>Inicio:</strong> {new Date(tournament.start_date).toLocaleDateString()}</p>
                <p><strong>Fin:</strong> {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'Por definir'}</p>
                <p><strong>Estado:</strong> <span style={{ color: tournament.status === 'open' ? '#4ade80' : '#fbbf24' }}>{tournament.status}</span></p>
              </div>
            </div>
            {tournament.rules && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#1a1a1a', borderRadius: '8px' }}>
                <strong>Reglas:</strong>
                <p style={{ marginTop: '10px', color: '#ccc' }}>{tournament.rules}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'equipos' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Equipos Registrados ({teams.length})</h2>
            {teams.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>No hay equipos registrados aún</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {teams.map(reg => (
                  <div key={reg.id} style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #444' }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '10px' }}>{reg.teams?.name || 'Equipo sin nombre'}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Estado: <span style={{ color: reg.status === 'accepted' ? '#4ade80' : '#fbbf24' }}>{reg.status}</span></p>
                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Registrado: {new Date(reg.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'partidos' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Calendario de Partidos ({matches.length})</h2>
            {matches.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>No hay partidos programados. Genera grupos primero.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {matches.map(match => (
                  <div key={match.id} style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {match.home_team_name} vs {match.away_team_name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px' }}>
                        {match.match_date ? new Date(match.match_date).toLocaleString() : 'Fecha por confirmar'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {match.status === 'finished' ? (
                        <div style={{ fontSize: '1.5rem', color: '#FFD700' }}>
                          {match.home_score} - {match.away_score}
                        </div>
                      ) : (
                        <span style={{ color: '#fbbf24' }}>{match.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sanciones' && (
          <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Sanciones Disciplinarias ({sanctions.length})</h2>
            {sanctions.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>No hay sanciones registradas</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sanctions.map(sanction => (
                  <div key={sanction.id} style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #dc3545' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong style={{ color: '#dc3545' }}>{sanction.sanction_type.replace('_', ' ').toUpperCase()}</strong>
                      <span style={{ color: '#aaa' }}>{sanction.teams?.name}</span>
                    </div>
                    <p><strong>Jugador:</strong> {sanction.users?.email || 'N/A'}</p>
                    <p><strong>Razón:</strong> {sanction.reason}</p>
                    {sanction.incident_minute && <p><strong>Minuto:</strong> {sanction.incident_minute}'</p>}
                    <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '10px' }}>
                      {new Date(sanction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de invitaciones */}
        {showInviteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#2a2a2a', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
              <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>Invitar Equipos de {tournament.location}</h2>
              <div style={{ marginBottom: '20px' }}>
                {inviteTeams.map(team => (
                  <label key={team.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', background: selectedTeams.includes(team.id) ? '#444' : '#1a1a1a', marginBottom: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeams([...selectedTeams, team.id]);
                        } else {
                          setSelectedTeams(selectedTeams.filter(id => id !== team.id));
                        }
                      }}
                      style={{ marginRight: '10px' }}
                    />
                    <span>{team.name}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowInviteModal(false)} style={{ padding: '10px 20px', background: '#666', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button onClick={sendInvitations} disabled={selectedTeams.length === 0} style={{ padding: '10px 20px', background: selectedTeams.length > 0 ? '#FFD700' : '#666', color: '#000', border: 'none', borderRadius: '8px', cursor: selectedTeams.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                  Enviar {selectedTeams.length} invitaciones
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
