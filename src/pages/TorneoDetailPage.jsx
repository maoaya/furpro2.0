import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import * as TournamentService from '../services/TournamentService';

export default function TorneoDetailPage() {
  const { torneoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [invitingTeams, setInvitingTeams] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [generatingBrackets, setGeneratingBrackets] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('info'); // info, teams, brackets, referees, results
  const [searchTeams, setSearchTeams] = useState('');

  useEffect(() => {
    loadTournament();
  }, [torneoId]);

  const loadTournament = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', torneoId)
        .single();

      if (error) throw error;
      setTournament(data);

      // Cargar equipos inscritos
      const { data: teamsData } = await supabase
        .from('tournament_inscriptions')
        .select('*, teams(*)')
        .eq('tournament_id', torneoId);

      setTeams(teamsData || []);

      // Cargar notificaciones no leídas
      if (user?.id) {
        const unread = await TournamentService.getUnreadTournamentNotifications(user.id);
        setNotifications(unread || []);
      }
    } catch (error) {
      console.error('Error loading tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteTeamsAndNotify = async () => {
    if (!tournament?.id) return;
    setInvitingTeams(true);

    try {
      // 1. Buscar equipos en la ciudad/país
      const { data: availableTeams } = await supabase
        .from('teams')
        .select('id, name, captain_id')
        .eq('location', tournament.location)
        .eq('country', tournament.country)
        .neq('id', user?.id)
        .limit(20);

      if (!availableTeams?.length) {
        alert('No hay equipos disponibles en esta ubicación');
        return;
      }

      // 2. Crear invitaciones
      const invitations = availableTeams.map(team => ({
        tournament_id: tournament.id,
        team_id: team.id,
        invited_by: user.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }));

      const { error: invErr } = await supabase
        .from('tournament_invitations')
        .insert(invitations);

      if (invErr) throw invErr;

      // 3. Enviar notificaciones a capitanes de equipos
      const notificationPayloads = availableTeams.map(team => ({
        user_id: team.captain_id,
        type: 'tournament_invitation',
        title: `¡Invitación a ${tournament.name}!`,
        message: `${tournament.name} te ha invitado a participar. ${tournament.location}, ${tournament.country}`,
        related_id: tournament.id,
        is_read: false,
        created_at: new Date().toISOString()
      }));

      await supabase.from('notifications').insert(notificationPayloads);

      alert(`✅ Invitaciones enviadas a ${availableTeams.length} equipos`);
      setInvitingTeams(false);
    } catch (error) {
      console.error('Error inviting teams:', error);
      alert('Error al enviar invitaciones');
      setInvitingTeams(false);
    }
  };

  const autoGenerateBrackets = async () => {
    if (!tournament?.id || teams.length < 2) {
      alert('Se necesitan al menos 2 equipos para generar brackets');
      return;
    }

    setGeneratingBrackets(true);

    try {
      // Usar TournamentService para generar grupos según el formato
      let bracketResult;

      if (tournament.tournament_format === 'league') {
        // Liga: todos contra todos
        bracketResult = await TournamentService.generateGroupFixtures(tournament.id, null, []);
      } else if (tournament.tournament_format === 'group_knockout' || tournament.tournament_format === 'repechaje') {
        // Grupos + eliminación
        const numGroups = Math.ceil(teams.length / 4); // 4 equipos por grupo aprox
        bracketResult = await TournamentService.generateGroups(tournament.id, numGroups);
      } else if (tournament.tournament_format === 'knockout') {
        // Eliminación directa
        bracketResult = await TournamentService.getTournamentBrackets(tournament.id, 1);
      }

      // Actualizar estado de torneo a "in_progress"
      await supabase
        .from('tournaments')
        .update({ status: 'in_progress' })
        .eq('id', tournament.id);

      alert('✅ Brackets generados automáticamente');
      setGeneratingBrackets(false);
      loadTournament();
    } catch (error) {
      console.error('Error generating brackets:', error);
      alert('Error al generar brackets');
      setGeneratingBrackets(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    await TournamentService.markNotificationAsRead(notificationId);
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  if (loading) return <div style={{ padding: 20, color: '#FFD700' }}>Cargando...</div>;
  if (!tournament) return <div style={{ padding: 20, color: '#FFD700' }}>Torneo no encontrado</div>;

  const isCreator = user?.id === tournament.creator_id;
  const teamsAtMaxCapacity = teams.length >= tournament.max_teams;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/torneos')}
          style={{
            background: 'transparent',
            border: '2px solid #FFD700',
            color: '#FFD700',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Volver
        </button>

        {/* Header */}
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '2px solid #FFD700'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', color: '#FFD700' }}>
                🏆 {tournament.name}
              </h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '1.1rem' }}>
                📍 {tournament.location}, {tournament.country} • {tournament.category}
              </p>
            </div>
            <div style={{
              textAlign: 'right',
              background: 'rgba(255, 215, 0, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #FFD700'
            }}>
              <p style={{ margin: '0 0 4px 0', color: '#FFD700', fontWeight: 'bold' }}>Estado</p>
              <p style={{ margin: 0, fontSize: '1.2rem' }}>
                {tournament.status === 'draft' && '📝 Borrador'}
                {tournament.status === 'open' && '🔓 Abierto'}
                {tournament.status === 'in_progress' && '⚽ En Progreso'}
                {tournament.status === 'finished' && '✅ Finalizado'}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
                {teams.length}/{tournament.max_teams} equipos
              </p>
            </div>
          </div>

          {/* Notificaciones */}
          {notifications.length > 0 && (
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: '#dc3545',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              🔔 {notifications.length} notificaciones nuevas
            </button>
          )}

          {showNotifications && notifications.length > 0 && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: '1px solid #dc3545'
            }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  padding: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '4px'
                }}>
                  <div>
                    <strong>{notif.title}</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#ccc' }}>
                      {notif.message}
                    </p>
                  </div>
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    style={{
                      background: 'transparent',
                      color: '#FFD700',
                      border: '1px solid #FFD700',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginLeft: '12px'
                    }}
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Acciones del creador */}
          {isCreator && tournament.status === 'draft' && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={inviteTeamsAndNotify}
                disabled={invitingTeams}
                style={{
                  background: '#007bff',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {invitingTeams ? '📤 Enviando...' : '📤 Invitar equipos automáticamente'}
              </button>

              <button
                onClick={autoGenerateBrackets}
                disabled={generatingBrackets || !teamsAtMaxCapacity}
                style={{
                  background: teamsAtMaxCapacity ? '#28a745' : '#666',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: teamsAtMaxCapacity ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                {generatingBrackets ? '⚙️ Generando...' : '🎯 Auto-generar brackets'}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '2px solid #FFD700',
          overflowX: 'auto'
        }}>
          {['info', 'teams', 'brackets', 'referees', 'results'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? '#FFD700' : 'transparent',
                color: tab === t ? '#000' : '#FFD700',
                border: 'none',
                padding: '12px 20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderBottom: tab === t ? '3px solid #FFD700' : 'none'
              }}
            >
              {t === 'info' && '📋 Información'}
              {t === 'teams' && `👥 Equipos (${teams.length})`}
              {t === 'brackets' && '🎯 Brackets'}
              {t === 'referees' && '👨‍⚖️ Árbitros'}
              {t === 'results' && '📊 Resultados'}
            </button>
          ))}
        </div>

        {/* TAB: INFO */}
        {tab === 'info' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #444'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>📋 Información del Torneo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <strong>Descripción</strong>
                <p>{tournament.description || 'Sin descripción'}</p>
              </div>
              <div>
                <strong>Formato</strong>
                <p>{tournament.tournament_format}</p>
              </div>
              <div>
                <strong>Tipo de Playoff</strong>
                <p>{tournament.playoff_type || 'N/A'}</p>
              </div>
              <div>
                <strong>Rango de Edades</strong>
                <p>{tournament.min_age} - {tournament.max_age} años</p>
              </div>
              <div>
                <strong>Máximo de Equipos</strong>
                <p>{tournament.max_teams}</p>
              </div>
              <div>
                <strong>Jugadores por Equipo</strong>
                <p>{tournament.max_players_per_team}</p>
              </div>
              <div>
                <strong>Registro</strong>
                <p>
                  {tournament.registration_type === 'free' ? '🆓 Gratis' : `💰 ${tournament.registration_fee} ${tournament.currency}`}
                </p>
              </div>
              <div>
                <strong>Transmisión en Vivo</strong>
                <p>{tournament.is_live_required ? '📡 Requerida' : '📡 Opcional'}</p>
              </div>
              {tournament.start_date && (
                <div>
                  <strong>Inicio</strong>
                  <p>{new Date(tournament.start_date).toLocaleDateString()}</p>
                </div>
              )}
              {tournament.end_date && (
                <div>
                  <strong>Fin</strong>
                  <p>{new Date(tournament.end_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            {tournament.rules && (
              <div style={{ marginTop: '20px' }}>
                <strong>Reglas</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{tournament.rules}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: TEAMS */}
        {tab === 'teams' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #444'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>👥 Equipos Inscritos ({teams.length}/{tournament.max_teams})</h2>
            
            <input
              type="text"
              placeholder="Buscar equipos..."
              value={searchTeams}
              onChange={(e) => setSearchTeams(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                background: '#1a1a1a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#fff'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {teams
                .filter(t => !searchTeams || t.teams?.name?.toLowerCase().includes(searchTeams.toLowerCase()))
                .map(inscription => (
                  <div key={inscription.id} style={{
                    background: 'rgba(255, 215, 0, 0.05)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #FFD700'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#FFD700' }}>⚽ {inscription.teams?.name}</h4>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#aaa' }}>
                      Capitán: {inscription.teams?.captain_name || 'N/A'}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#aaa' }}>
                      Jugadores: {inscription.teams?.players?.length || 0}
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                      Inscrito: {new Date(inscription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: BRACKETS */}
        {tab === 'brackets' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #444'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>🎯 Brackets y Fixtures</h2>
            <p>Los brackets se generarán automáticamente cuando se complete el máximo de equipos.</p>
          </div>
        )}

        {/* TAB: REFEREES */}
        {tab === 'referees' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #444'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>👨‍⚖️ Asignación de Árbitros</h2>
            {isCreator ? (
              <p>Puedes asignar árbitros a los partidos una vez se generen los brackets.</p>
            ) : (
              <p>Solo el organizador puede asignar árbitros.</p>
            )}
          </div>
        )}

        {/* TAB: RESULTS */}
        {tab === 'results' && (
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #444'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>📊 Resultados</h2>
            <p>Los resultados se mostrarán aquí una vez los árbitros registren los goles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
