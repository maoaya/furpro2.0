import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import TournamentService from '../services/TournamentService';
import MainLayout from '../components/MainLayout';

export default function TorneoStandingsPage() {
  const { tournamentId } = useParams();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentData();
      fetchGroups();
      subscribeToStandings();
    }
  }, [tournamentId]);

  useEffect(() => {
    if (selectedGroup) {
      fetchStandings(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchTournamentData = async () => {
    try {
      const data = await TournamentService.getTournamentById(tournamentId);
      setTournament(data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('tournament_groups')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('group_order', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setGroups(data);
        setSelectedGroup(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async (groupId) => {
    try {
      const data = await TournamentService.getGroupStandings(groupId);
      const withPositions = (data || []).map((team, index) => ({
        ...team,
        position: index + 1
      }));
      setStandings(withPositions);
    } catch (error) {
      console.error('Error fetching standings:', error);
    }
  };

  const subscribeToStandings = () => {
    if (!selectedGroup) return;

    const channel = supabase
      .channel(`standings-${selectedGroup}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_group_teams',
          filter: `group_id=eq.${selectedGroup}`
        },
        () => {
          fetchStandings(selectedGroup);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getPositionColor = (position, totalTeams) => {
    // Verde: clasificados a siguiente fase (generalmente primeros 2)
    if (position <= Math.ceil(totalTeams / 2)) {
      return 'bg-green-100 border-l-4 border-green-500';
    }
    // Rojo: eliminados
    return 'bg-red-100 border-l-4 border-red-500';
  };

  if (loading) {
    return <MainLayout><div className="p-4 text-center">Cargando tabla de posiciones...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{tournament?.name}</h1>
          <p className="text-gray-600 mt-2">
            {tournament?.category} • {tournament?.tournament_type}
          </p>
        </div>

        {/* Selector de Grupos */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedGroup === group.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Grupo {group.group_name}
            </button>
          ))}
        </div>

        {/* Tabla de Posiciones */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pos</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">PJ</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">G</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">E</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">P</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">GF</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">GC</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">DIF</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-yellow-300">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-6 text-center text-gray-500">
                      No hay equipos en este grupo
                    </td>
                  </tr>
                ) : (
                  standings.map((team) => (
                    <tr
                      key={team.id}
                      className={`${getPositionColor(team.position, standings.length)} border-b hover:bg-opacity-75 transition-all`}
                    >
                      <td className="px-4 py-3 font-bold text-lg w-12">{team.position}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {team.position}
                        </div>
                        {team.team_id ? `Equipo #${team.team_id.slice(0, 8)}` : 'Equipo'}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{team.matches_played}</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">{team.wins}</td>
                      <td className="px-4 py-3 text-center text-yellow-600 font-bold">{team.draws}</td>
                      <td className="px-4 py-3 text-center text-red-600 font-bold">{team.losses}</td>
                      <td className="px-4 py-3 text-center font-semibold">{team.goals_for}</td>
                      <td className="px-4 py-3 text-center font-semibold">{team.goals_against}</td>
                      <td className={`px-4 py-3 text-center font-bold ${
                        team.goal_difference > 0 ? 'text-green-600' : 
                        team.goal_difference < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                      </td>
                      <td className="px-4 py-3 text-center bg-yellow-200 font-bold text-lg rounded">
                        {team.points}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leyenda */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-gray-800">✅ Clasificado</p>
            <p className="text-sm text-gray-600">Avanza a siguiente fase</p>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-gray-800">❌ Eliminado</p>
            <p className="text-sm text-gray-600">No clasifica</p>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        {standings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🔝 Goleador</h3>
              <p className="text-2xl font-bold text-blue-600">
                {Math.max(...standings.map(t => t.goals_for || 0))} goles
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🟨 Disciplina</h3>
              <p className="text-sm">Total amarillas: {standings.reduce((sum, t) => sum + (t.yellow_cards || 0), 0)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🟥 Tarjetas Rojas</h3>
              <p className="text-sm">Total rojas: {standings.reduce((sum, t) => sum + (t.red_cards || 0), 0)}</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
