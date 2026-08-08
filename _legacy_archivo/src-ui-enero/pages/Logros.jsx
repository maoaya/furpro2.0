
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { LogrosService } from '../services/LogrosService';

export default function Logros() {
  const [logros, setLogros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    LogrosService.getLogros().then(setLogros);
  }, []);

  const handleOpenForm = (logro = null) => {
    if (logro) {
      setForm({ nombre: logro.nombre, descripcion: logro.descripcion, tipo: logro.tipo });
      setEditId(logro.id);
    } else {
      setForm({ nombre: '', descripcion: '', tipo: '' });
      setEditId(null);
    }
    setShowForm(true);
    setFeedback('');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({ nombre: '', descripcion: '', tipo: '' });
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
      if (!form.nombre || !form.descripcion || !form.tipo) {
        setFeedback('Todos los campos son obligatorios');
        setLoading(false);
        return;
      }
      if (editId) {
        await LogrosService.updateLogro(editId, form);
        setFeedback('Logro actualizado');
      } else {
        await LogrosService.createLogro(form);
        setFeedback('Logro creado');
      }
      const nuevos = await LogrosService.getLogros();
      setLogros(nuevos);
      handleCloseForm();
    } catch (err) {
      setFeedback('Error al guardar');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar este logro?')) return;
    setLoading(true);
    try {
      await LogrosService.deleteLogro(id);
      setLogros(await LogrosService.getLogros());
      setFeedback('Logro eliminado');
    } catch {
      setFeedback('Error al eliminar');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Logros</h2>
      <Button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', marginBottom: 24, transition: 'background 0.3s, color 0.3s' }} onClick={() => handleOpenForm()}>Crear logro</Button>
      {feedback && <div style={{ color: '#FFD700', background: '#232323', borderRadius: 8, padding: 12, marginBottom: 16 }}>{feedback}</div>}
      <ul style={{ fontSize: 18 }}>
        {logros.map(l => (
          <li key={l.id} style={{ background: '#232323', borderRadius: 8, padding: 16, color: '#FFD700', boxShadow: '0 2px 8px #FFD70022', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: 20 }}>{l.nombre}</span> — {l.descripcion} — Tipo: {l.tipo}
            </div>
            <div>
              <Button style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70044', cursor: 'pointer', marginLeft: 8, transition: 'background 0.3s, color 0.3s' }} onClick={() => handleOpenForm(l)}>Editar</Button>
              <Button style={{ background: '#FFD70022', color: '#FFD700', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, boxShadow: '0 2px 8px #FFD70022', cursor: 'pointer', marginLeft: 8, transition: 'background 0.3s, color 0.3s' }} onClick={() => handleDelete(l.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#181818cc', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <form onSubmit={handleSubmit} style={{ background: '#232323', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #FFD70044', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 24, marginBottom: 12 }}>{editId ? 'Editar logro' : 'Crear logro'}</h3>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
            <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
            <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="Tipo" style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
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
