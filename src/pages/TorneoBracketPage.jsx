import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../config/supabase';
import TournamentService from '../services/TournamentService';
import MainLayout from '../components/MainLayout';

export default function TorneoBracketPage() {
  const { tournamentId } = useParams();
  const [brackets, setBrackets] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentData();
      fetchBrackets();
      subscribeToUpdates();
    }
  }, [tournamentId]);

  const fetchTournamentData = async () => {
    try {
      const data = await TournamentService.getTournamentById(tournamentId);
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    }
  };

  const fetchBrackets = async () => {
    try {
      const data = await TournamentService.getTournamentBrackets(tournamentId);

      if (data && data.length > 0) {
        setBrackets(data);
        
        // Obtener rondas únicas
        const uniqueRounds = [...new Set(data.map(b => b.round_name))];
        setRounds(uniqueRounds);
        
        // Seleccionar primera ronda
        if (uniqueRounds.length > 0) {
          setSelectedRound(uniqueRounds[0]);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching brackets:', error);
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`brackets-${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_brackets',
          filter: `tournament_id=eq.${tournamentId}`
        },
        () => {
          fetchBrackets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getMatchesByRound = () => {
    if (!selectedRound) return [];
    return brackets.filter(b => b.round_name === selectedRound);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return { color: 'bg-blue-100 text-blue-800', icon: '📅', label: 'Programado' };
      case 'in_progress':
        return { color: 'bg-yellow-100 text-yellow-800', icon: '🔴', label: 'En vivo' };
      case 'finished':
        return { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Finalizado' };
      case 'postponed':
        return { color: 'bg-red-100 text-red-800', icon: '⏸️', label: 'Pospuesto' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: '❓', label: status };
    }
  };

  const getWinnerStyle = (matchId, teamId, winnerId) => {
    if (!winnerId) return '';
    return teamId === winnerId ? 'font-bold text-green-600 bg-green-50' : 'opacity-50 text-gray-500';
  };

  if (loading) {
    return <MainLayout><div className="p-4 text-center">Cargando tabla de llaves...</div></MainLayout>;
  }

  if (brackets.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">{tournament?.name}</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              📋 La fase de llaves aún no ha comenzado. Los brackets se generarán automáticamente cuando se complete la fase de grupos.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentMatches = getMatchesByRound();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{tournament?.name}</h1>
          <p className="text-gray-600 mt-2">Fase de Eliminatorias</p>
        </div>

        {/* Selector de Rondas */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {rounds.map(round => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                selectedRound === round
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {round === 'octavos' && '🏆 Octavos'}
              {round === 'cuartos' && '🏆 Cuartos'}
              {round === 'semifinal' && '🏆 Semifinal'}
              {round === 'final' && '🏆 Final'}
              {round === 'tercer_lugar' && '🥉 Tercer Lugar'}
              {!['octavos', 'cuartos', 'semifinal', 'final', 'tercer_lugar'].includes(round) && round}
            </button>
          ))}
        </div>

        {/* Partidos */}
        <div className="space-y-4">
          {currentMatches.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">No hay partidos en esta ronda</p>
            </div>
          ) : (
            currentMatches.map(match => {
              const statusInfo = getStatusBadge(match.status);
              const homeTeamName = `Equipo ${match.home_team_id?.slice(0, 8) || 'TBD'}`;
              const awayTeamName = `Equipo ${match.away_team_id?.slice(0, 8) || 'TBD'}`;

              return (
                <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    {/* Encabezado */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Encuentro {match.match_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {match.match_date ? new Date(match.match_date).toLocaleString('es-ES') : 'Fecha pendiente'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>

                    {/* Marcador */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      {/* Equipo Local */}
                      <div className={`text-right p-3 rounded-lg ${getWinnerStyle(match.id, match.home_team_id, match.winner_id)}`}>
                        <p className="font-semibold">{homeTeamName}</p>
                        <p className="text-xs text-gray-600">Local</p>
                      </div>

                      {/* Resultado */}
                      <div className="text-center">
                        {match.status === 'finished' ? (
                          <div>
                            <div className="text-3xl font-bold">
                              <span className={match.home_score > match.away_score ? 'text-green-600' : ''}>
                                {match.home_score}
                              </span>
                              <span className="text-gray-400 mx-2">-</span>
                              <span className={match.away_score > match.home_score ? 'text-green-600' : ''}>
                                {match.away_score}
                              </span>
                            </div>
                            {match.decided_by_penalties && (
                              <p className="text-xs text-orange-600 font-semibold mt-1">
                                🎯 {match.home_penalties} - {match.away_penalties} (Penaltis)
                              </p>
                            )}
                            {match.winner_id && (
                              <p className="text-sm text-green-600 font-bold mt-2">✅ Ganador</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-600">vs</p>
                            {match.status === 'in_progress' && (
                              <p className="text-xs text-red-600 font-semibold mt-1">🔴 En vivo</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Equipo Visitante */}
                      <div className={`text-left p-3 rounded-lg ${getWinnerStyle(match.id, match.away_team_id, match.winner_id)}`}>
                        <p className="font-semibold">{awayTeamName}</p>
                        <p className="text-xs text-gray-600">Visitante</p>
                      </div>
                    </div>

                    {/* Detalles adicionales si está finalizado */}
                    {match.status === 'finished' && (
                      <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-1">
                        <p>📊 Goles Local: {match.home_score} | Goles Visitante: {match.away_score}</p>
                        {match.decided_by_penalties && (
                          <p>🎯 Penaltis - Local: {match.home_penalties} | Visitante: {match.away_penalties}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Estadísticas de la ronda */}
        {currentMatches.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Partidos en Ronda</p>
              <p className="text-2xl font-bold text-blue-600">{currentMatches.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Finalizados</p>
              <p className="text-2xl font-bold text-green-600">
                {currentMatches.filter(m => m.status === 'finished').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {currentMatches.filter(m => m.status !== 'finished').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
