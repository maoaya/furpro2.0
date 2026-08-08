import React, { useState, useEffect } from 'react';
import OrganizerLayout from './OrganizerLayout';
import axios from 'axios';

export default function EditMatchPage() {
  const [matches, setMatches] = useState([]);
  const [editing, setEditing] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/matches').then(res => setMatches(res.data));
  }, []);

  useEffect(() => {
    if (editing?.id) {
      axios.get('/api/notifications?matchId=' + editing.id).then(res => setHistory(res.data));
    }
  }, [editing]);

  const handleEdit = (match) => setEditing(match);

  const handleSave = async (e) => {
    e.preventDefault();
    const { date, result, injured } = e.target;
    await axios.put(`/api/matches/${editing.id}`, {
      date: date.value,
      result: result.value,
      injuredPlayers: injured.value.split(',').map(p => p.trim()).filter(Boolean)
    });
    // Notificación automática a usuarios del campeonato
    await axios.post('/api/notifications', {
      title: 'Actualización de partido',
      message: `El partido ${editing.team1} vs ${editing.team2} ha sido actualizado. Nueva fecha: ${date.value}, Resultado: ${result.value}`,
      matchId: editing.id
    });
    // Notificar jugadores lesionados
    if (injured.value) {
      const lesionados = injured.value.split(',').map(p => p.trim()).filter(Boolean);
      for (const jugador of lesionados) {
        await axios.post('/api/notifications', {
          title: 'Lesión registrada',
          message: `El jugador ${jugador} ha sido reportado como lesionado en el partido ${editing.team1} vs ${editing.team2}.`,
          matchId: editing.id,
          player: jugador
        });
      }
    }
    // Recordatorio automático (simulado)
    setTimeout(async () => {
      await axios.post('/api/notifications', {
        title: 'Recordatorio de partido',
        message: `Recuerda que el partido ${editing.team1} vs ${editing.team2} es en 1 hora. Confirma tu asistencia en la app.`,
        matchId: editing.id
      });
    }, 1000); // Simula envío 1 hora antes
    setEditing(null);
    // Actualizar lista
    const res = await axios.get('/api/matches');
    setMatches(res.data);
  };

  return (
    <OrganizerLayout title="Editar Horarios y Resultados">
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            {match.team1} vs {match.team2} - {match.date} - Resultado: {match.result || 'Sin resultado'}
            <button onClick={() => handleEdit(match)}>Editar</button>
          </li>
        ))}
      </ul>
      {editing && (
        <>
          <form onSubmit={handleSave}>
            <label>Fecha y hora:</label>
            <input type="datetime-local" name="date" defaultValue={editing.date} />
            <label>Resultado:</label>
            <input type="text" name="result" defaultValue={editing.result || ''} />
            <label>Jugadores lesionados (separados por coma):</label>
            <input type="text" name="injured" />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
          </form>
          <h3>Confirmación de asistencia</h3>
          <ul>
            {(editing.players || []).map(player => (
              <li key={player.id}>
                {player.name} - {attendance[player.id] ? 'Confirmado' : 'Pendiente'}
                <button onClick={() => setAttendance(a => ({ ...a, [player.id]: true }))}>Confirmar</button>
              </li>
            ))}
          </ul>
          <h3>Historial de notificaciones</h3>
          <ul>
            {history.map(n => (
              <li key={n.id}><strong>{n.title}</strong>: {n.message} <span>({n.date})</span></li>
            ))}
          </ul>
        </>
      )}
    </OrganizerLayout>
  );
}
