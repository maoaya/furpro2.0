import React, { useEffect, useState } from 'react';
import Button from './Button';
import { RankingsService } from '../services/RankingsService';

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', puntos: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    RankingsService.getRankings().then(setRankings);
  }, []);

  const handleOpenForm = (ranking = null) => {
    if (ranking) {
      setForm({ nombre: ranking.nombre, puntos: ranking.puntos });
      setEditId(ranking.id);
    } else {
      setForm({ nombre: '', puntos: '' });
      setEditId(null);
    }
    setShowForm(true);
    setFeedback('');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({ nombre: '', puntos: '' });
    setEditId(null);
    setFeedback('');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.nombre || !form.puntos) {
        setFeedback('Todos los campos son obligatorios');
        setLoading(false);
        return;
      }
      if (editId) {
        await RankingsService.updateRanking(editId, form);
        setFeedback('Ranking actualizado');
      } else {
        await RankingsService.createRanking(form);
        setFeedback('Ranking creado');
      }
      const nuevos = await RankingsService.getRankings();
      setRankings(nuevos);
      handleCloseForm();
    } catch (err) {
      setFeedback('Error al guardar');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar este ranking?')) return;
    setLoading(true);
    try {
      await RankingsService.deleteRanking(id);
      setRankings(await RankingsService.getRankings());
      setFeedback('Ranking eliminado');
    } catch {
      setFeedback('Error al eliminar');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Rankings</h2>
      <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginBottom: 24, transition: 'background 0.3s, color 0.3s' }} onClick={() => handleOpenForm()}>Crear ranking</Button>
      {feedback && <div style={{ color: '#FFD700', background: '#232323', borderRadius: 8, padding: 12, marginBottom: 16 }}>{feedback}</div>}
      <ul style={{ fontSize: 18 }}>
        {rankings.map(r => (
          <li key={r.id} style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: 20 }}>{r.nombre}</span> — Puntos: {r.puntos}
            </div>
            <div>
              <Button style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70044', cursor: 'pointer', marginLeft: 8, transition: 'background 0.3s, color 0.3s' }} onClick={() => handleOpenForm(r)}>Editar</Button>
              <Button style={{ background: '#FFD70022', color: '#FFD700', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70022', cursor: 'pointer', marginLeft: 8, transition: 'background 0.3s, color 0.3s' }} onClick={() => handleDelete(r.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#181818cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <form onSubmit={handleSubmit} style={{ background: '#232323', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #FFD70044', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24, marginBottom: 12 }}>{editId ? 'Editar ranking' : 'Crear ranking'}</h3>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
            <input name="puntos" value={form.puntos} onChange={handleChange} placeholder="Puntos" style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }} disabled={loading}>{editId ? 'Guardar cambios' : 'Crear'}</Button>
              <Button type="button" style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70044', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }} onClick={handleCloseForm}>Cancelar</Button>
            </div>
            {feedback && <div style={{ color: '#FFD700', background: '#232323', borderRadius: 8, padding: 8, marginTop: 8 }}>{feedback}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
