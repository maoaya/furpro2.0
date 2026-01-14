import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthService';
import RefereeService from '../services/RefereeService';
import MainLayout from '../components/MainLayout';

export default function ArbitroPanelPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    home_score: 0,
    away_score: 0,
    home_penalties: null,
    away_penalties: null,
    decided_by_penalties: false,
    goals: [],
    assists: [],
    yellow_cards: [],
    red_cards: [],
    recommended_sanctions: [],
    observations: ''
  });

  useEffect(() => {
    fetchAssignedMatches();
  }, [user?.id]);

  const fetchAssignedMatches = async () => {
    if (!user?.id) return;
    
    try {
      const data = await RefereeService.getRefereeAssignedMatches(user.id, {});
      const upcoming = (data || []).filter(match => match.status !== 'finished');
      setMatches(upcoming);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    setReportData(prev => ({
      ...prev,
      goals: [...prev.goals, { player_id: '', team_id: '', minute: 0, type: 'normal' }]
    }));
  };

  const handleAddAssist = () => {
    setReportData(prev => ({
      ...prev,
      assists: [...prev.assists, { player_id: '', team_id: '', minute: 0 }]
    }));
  };

  const handleAddYellowCard = () => {
    setReportData(prev => ({
      ...prev,
      yellow_cards: [...prev.yellow_cards, { player_id: '', team_id: '', minute: 0, reason: '' }]
    }));
  };

  const handleAddRedCard = () => {
    setReportData(prev => ({
      ...prev,
      red_cards: [...prev.red_cards, { player_id: '', team_id: '', minute: 0, reason: '', type: 'direct' }]
    }));
  };

  const handleAddSanction = () => {
    setReportData(prev => ({
      ...prev,
      recommended_sanctions: [...prev.recommended_sanctions, { player_id: '', matches: 1, reason: '' }]
    }));
  };

  const handleUpdateGoal = (index, field, value) => {
    const newGoals = [...reportData.goals];
    newGoals[index][field] = value;
    setReportData(prev => ({ ...prev, goals: newGoals }));
  };

  const handleUpdateAssist = (index, field, value) => {
    const newAssists = [...reportData.assists];
    newAssists[index][field] = value;
    setReportData(prev => ({ ...prev, assists: newAssists }));
  };

  const handleUpdateYellowCard = (index, field, value) => {
    const newCards = [...reportData.yellow_cards];
    newCards[index][field] = value;
    setReportData(prev => ({ ...prev, yellow_cards: newCards }));
  };

  const handleUpdateRedCard = (index, field, value) => {
    const newCards = [...reportData.red_cards];
    newCards[index][field] = value;
    setReportData(prev => ({ ...prev, red_cards: newCards }));
  };

  const handleUpdateSanction = (index, field, value) => {
    const newSanctions = [...reportData.recommended_sanctions];
    newSanctions[index][field] = value;
    setReportData(prev => ({ ...prev, recommended_sanctions: newSanctions }));
  };

  const handleSubmitReport = async () => {
    if (!selectedMatch) return;

    try {
      await RefereeService.createRefereeReport(selectedMatch.id, user.id, {
        homeScore: reportData.home_score,
        awayScore: reportData.away_score,
        decidedByPenalties: reportData.decided_by_penalties,
        homeWonPenalties: reportData.home_penalties > reportData.away_penalties,
        homeYellowCards: reportData.yellow_cards?.length || 0,
        homeRedCards: reportData.red_cards?.filter(card => card.team_id === selectedMatch.home_team_id).length || 0,
        awayYellowCards: reportData.yellow_cards?.length || 0,
        awayRedCards: reportData.red_cards?.filter(card => card.team_id === selectedMatch.away_team_id).length || 0,
        incidents: reportData.observations,
        notes: reportData.observations,
        playerStats: reportData.goals?.map(goal => ({
          player_id: goal.player_id,
          goals: 1,
          yellow_cards: 0,
          red_cards: 0
        })) || []
      });

      alert('Reporte enviado correctamente');
      setSelectedMatch(null);
      setReportData({
        home_score: 0,
        away_score: 0,
        home_penalties: null,
        away_penalties: null,
        decided_by_penalties: false,
        goals: [],
        assists: [],
        yellow_cards: [],
        red_cards: [],
        recommended_sanctions: [],
        observations: ''
      });
      fetchAssignedMatches();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error al enviar el reporte');
    }
  };

  if (loading) return <MainLayout><div className="p-4">Cargando partidos...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Árbitro</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Partidos asignados */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Partidos Asignados</h2>
            <div className="space-y-2">
              {matches.length === 0 ? (
                <p className="text-gray-500">No hay partidos asignados</p>
              ) : (
                matches.map(match => (
                  <button
                    key={match.id}
                    onClick={() => {
                      setSelectedMatch(match);
                      setReportData({
                        home_score: match.home_score || 0,
                        away_score: match.away_score || 0,
                        home_penalties: match.home_penalties,
                        away_penalties: match.away_penalties,
                        decided_by_penalties: match.decided_by_penalties || false,
                        goals: [],
                        assists: [],
                        yellow_cards: [],
                        red_cards: [],
                        recommended_sanctions: [],
                        observations: ''
                      });
                    }}
                    className={`w-full p-3 rounded text-left ${
                      selectedMatch?.id === match.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{match.tournament?.name}</div>
                    <div className="text-sm">
                      {new Date(match.match_date).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-xs">
                      {match.status === 'scheduled' && '📅 Programado'}
                      {match.status === 'in_progress' && '🔴 En vivo'}
                      {match.status === 'finished' && '✅ Finalizado'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Formulario de reporte */}
          {selectedMatch && (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                Reporte - {selectedMatch.tournament?.name}
              </h2>

              {/* Resultado del partido */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Resultado Final</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goles Local</label>
                    <input
                      type="number"
                      min="0"
                      value={reportData.home_score}
                      onChange={(e) => setReportData(prev => ({ ...prev, home_score: parseInt(e.target.value) || 0 }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Goles Visitante</label>
                    <input
                      type="number"
                      min="0"
                      value={reportData.away_score}
                      onChange={(e) => setReportData(prev => ({ ...prev, away_score: parseInt(e.target.value) || 0 }))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                {/* Penaltis */}
                <div className="mb-4">
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={reportData.decided_by_penalties}
                      onChange={(e) => setReportData(prev => ({ ...prev, decided_by_penalties: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Definido por penaltis</span>
                  </label>
                  
                  {reportData.decided_by_penalties && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Penaltis Local</label>
                        <input
                          type="number"
                          min="0"
                          value={reportData.home_penalties || 0}
                          onChange={(e) => setReportData(prev => ({ ...prev, home_penalties: parseInt(e.target.value) || 0 }))}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Penaltis Visitante</label>
                        <input
                          type="number"
                          min="0"
                          value={reportData.away_penalties || 0}
                          onChange={(e) => setReportData(prev => ({ ...prev, away_penalties: parseInt(e.target.value) || 0 }))}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Goles */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Goles</h3>
                  <button
                    onClick={handleAddGoal}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    + Gol
                  </button>
                </div>
                <div className="space-y-3">
                  {reportData.goals.map((goal, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Player ID"
                        value={goal.player_id}
                        onChange={(e) => handleUpdateGoal(idx, 'player_id', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Minuto"
                        min="0"
                        max="120"
                        value={goal.minute}
                        onChange={(e) => handleUpdateGoal(idx, 'minute', parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <select
                        value={goal.type}
                        onChange={(e) => handleUpdateGoal(idx, 'type', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="penalty">Penal</option>
                        <option value="own_goal">Autogol</option>
                      </select>
                      <button
                        onClick={() => setReportData(prev => ({
                          ...prev,
                          goals: prev.goals.filter((_, i) => i !== idx)
                        }))}
                        className="bg-red-500 text-white rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asistencias */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Asistencias</h3>
                  <button
                    onClick={handleAddAssist}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    + Asistencia
                  </button>
                </div>
                <div className="space-y-3">
                  {reportData.assists.map((assist, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Player ID"
                        value={assist.player_id}
                        onChange={(e) => handleUpdateAssist(idx, 'player_id', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Minuto"
                        min="0"
                        max="120"
                        value={assist.minute}
                        onChange={(e) => handleUpdateAssist(idx, 'minute', parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => setReportData(prev => ({
                          ...prev,
                          assists: prev.assists.filter((_, i) => i !== idx)
                        }))}
                        className="bg-red-500 text-white rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjetas amarillas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">🟨 Tarjetas Amarillas</h3>
                  <button
                    onClick={handleAddYellowCard}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    + Amarilla
                  </button>
                </div>
                <div className="space-y-3">
                  {reportData.yellow_cards.map((card, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Player ID"
                        value={card.player_id}
                        onChange={(e) => handleUpdateYellowCard(idx, 'player_id', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Minuto"
                        min="0"
                        value={card.minute}
                        onChange={(e) => handleUpdateYellowCard(idx, 'minute', parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Razón"
                        value={card.reason}
                        onChange={(e) => handleUpdateYellowCard(idx, 'reason', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => setReportData(prev => ({
                          ...prev,
                          yellow_cards: prev.yellow_cards.filter((_, i) => i !== idx)
                        }))}
                        className="bg-red-500 text-white rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjetas rojas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">🟥 Tarjetas Rojas</h3>
                  <button
                    onClick={handleAddRedCard}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    + Roja
                  </button>
                </div>
                <div className="space-y-3">
                  {reportData.red_cards.map((card, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      <input
                        type="text"
                        placeholder="Player ID"
                        value={card.player_id}
                        onChange={(e) => handleUpdateRedCard(idx, 'player_id', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Minuto"
                        min="0"
                        value={card.minute}
                        onChange={(e) => handleUpdateRedCard(idx, 'minute', parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Razón"
                        value={card.reason}
                        onChange={(e) => handleUpdateRedCard(idx, 'reason', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <select
                        value={card.type}
                        onChange={(e) => handleUpdateRedCard(idx, 'type', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="direct">Directa</option>
                        <option value="second_yellow">Doble amarilla</option>
                      </select>
                      <button
                        onClick={() => setReportData(prev => ({
                          ...prev,
                          red_cards: prev.red_cards.filter((_, i) => i !== idx)
                        }))}
                        className="bg-red-500 text-white rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sanciones recomendadas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">⚖️ Sanciones Recomendadas</h3>
                  <button
                    onClick={handleAddSanction}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                  >
                    + Sanción
                  </button>
                </div>
                <div className="space-y-3">
                  {reportData.recommended_sanctions.map((sanction, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Player ID"
                        value={sanction.player_id}
                        onChange={(e) => handleUpdateSanction(idx, 'player_id', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <select
                        value={sanction.matches}
                        onChange={(e) => handleUpdateSanction(idx, 'matches', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="1">1 fecha</option>
                        <option value="2">2 fechas</option>
                        <option value="3">3 fechas</option>
                        <option value="4">4 fechas</option>
                        <option value="expulsion">Expulsión total</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Razón"
                        value={sanction.reason}
                        onChange={(e) => handleUpdateSanction(idx, 'reason', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => setReportData(prev => ({
                          ...prev,
                          recommended_sanctions: prev.recommended_sanctions.filter((_, i) => i !== idx)
                        }))}
                        className="bg-red-500 text-white rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Observaciones</h3>
                <textarea
                  value={reportData.observations}
                  onChange={(e) => setReportData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Comentarios adicionales del partido..."
                  className="w-full border rounded px-3 py-2 h-24"
                />
              </div>

              {/* Botón submit */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitReport}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                >
                  📤 Enviar Reporte
                </button>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 bg-gray-400 text-white font-bold py-3 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
