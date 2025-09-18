import { useState, useEffect } from 'react';
import supabase from '../supabaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function TorneosPage() {
  const [torneos, setTorneos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevoTorneo, setNuevoTorneo] = useState({ nombre: '', fecha: '' });
  const [detalleTorneo, setDetalleTorneo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    cargarTorneos();
  }, []);

  // Cargar torneos desde Supabase
  const cargarTorneos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('torneos').select('*');
    if (error) setError(error.message);
    else setTorneos(data);
    setLoading(false);
  };

  // Filtro avanzado por nombre y fecha
  const filtrados = torneos.filter(t =>
    t.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    t.fecha.toLowerCase().includes(filtro.toLowerCase())
  );
  // Borrar torneo en Supabase (consolidado en handleEliminar)

  // Crear torneo en Supabase
  const handleCrear = async () => {
    setLoading(true);
    const { error } = await supabase.from('torneos').insert([nuevoTorneo]);
    if (error) setFeedback('Error al crear torneo');
    else setFeedback('Torneo creado exitosamente');
    setShowModal(false);
    setNuevoTorneo({ nombre: '', fecha: '' });
    cargarTorneos();
    setLoading(false);
  };

  const navigate = useNavigate();

  const handleVer = (torneo) => {
    setDetalleTorneo(torneo);
    setEditando(false);
    if (navigate) navigate(`/torneo/${torneo.id}`);
  };

  const handleEditar = (torneo) => {
    setDetalleTorneo(torneo);
    setEditando(true);
    setNuevoTorneo({ nombre: torneo.nombre, fecha: torneo.fecha });
    if (navigate) navigate(`/torneo/${torneo.id}/editar`);
  };

  // Editar torneo en Supabase
  const handleActualizar = async () => {
    setLoading(true);
    const { error } = await supabase.from('torneos').update(nuevoTorneo).eq('id', detalleTorneo.id);
    if (error) setFeedback('Error al actualizar torneo');
    else setFeedback('Torneo actualizado');
    setEditando(false);
    setDetalleTorneo(null);
    cargarTorneos();
    setLoading(false);
  };

  // (Eliminado: función duplicada handleEliminar)

  const handleEliminar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('torneos').delete().eq('id', id);
    if (error) setFeedback('Error al eliminar torneo');
    else setFeedback('Torneo eliminado');
    await cargarTorneos();
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Listado de Torneos</h2>
      <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar torneo..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: '#FFD700' }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
  <table style={{ width: '100%', background: '#232323', borderRadius: 8, marginBottom: 24 }}>
        <thead>
          <tr style={{ color: '#FFD700' }}>
            <th>Nombre</th><th>Fecha</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(t => (
            <tr key={t.id}>
              <td>{t.nombre}</td><td>{t.fecha}</td>
              <td>
                <button style={{ background: '#FFD700', color: '#181818', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold', marginRight: 8 }} onClick={() => handleVer(t)}>Ver</button>
                <button style={{ background: '#FFD700', color: '#181818', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold', marginRight: 8 }} onClick={() => handleEditar(t)}>Editar</button>
                <button style={{ background: '#232323', color: '#FFD700', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} onClick={() => handleEliminar(t.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }} onClick={() => setShowModal(true)}>Nuevo torneo</button>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#181818cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, minWidth: 320 }}>
            <h3>Crear torneo</h3>
            <input value={nuevoTorneo.nombre} onChange={e => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })} placeholder="Nombre" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
            <input value={nuevoTorneo.fecha} onChange={e => setNuevoTorneo({ ...nuevoTorneo, fecha: e.target.value })} placeholder="Fecha" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={handleCrear}>Crear</button>
              <button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {detalleTorneo && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Detalle de Torneo</h3>
          <div><strong>Nombre:</strong> {detalleTorneo.nombre}</div>
          <div><strong>Fecha:</strong> {detalleTorneo.fecha}</div>
          {/* Aquí puedes agregar historial, logros, actividad, comentarios, etc. */}
          <div style={{ marginTop: 18 }}>
            <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginRight: 8 }} onClick={() => setEditando(true)}>Editar</button>
            <button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setDetalleTorneo(null)}>Cerrar</button>
          </div>
        </div>
      )}
      {editando && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Editar Torneo</h3>
          <input value={nuevoTorneo.nombre} onChange={e => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })} placeholder="Nombre" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
          <input value={nuevoTorneo.fecha} onChange={e => setNuevoTorneo({ ...nuevoTorneo, fecha: e.target.value })} placeholder="Fecha" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={handleActualizar}>Actualizar</button>
            <button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Listado de torneos con filtro, tabla/cards y acciones
// Consulta datos desde Supabase/API
// Botón para crear nuevo torneo (modal)
// Detalle de torneo con acciones (editar, eliminar, compartir, comentar)
// Visualización de historial, logros, actividad
// Formulario de edición/creación con validaciones y feedback visual
// Paneles/Dashboard con KPIs y gráficos