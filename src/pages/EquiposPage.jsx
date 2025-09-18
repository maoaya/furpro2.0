import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const gold = '#FFD700';
const black = '#222';

export default function EquiposPage() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [nuevo, setNuevo] = useState({ nombre: '', ciudad: '' });
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('equipos').select('*');
    if (error) setError(error.message);
    else setEquipos(data);
    setLoading(false);
  };

  const filtrados = equipos.filter(e => e.nombre.toLowerCase().includes(filtro.toLowerCase()));

  const handleCrear = async () => {
    setLoading(true);
    const { error } = await supabase.from('equipos').insert([nuevo]);
    if (error) setFeedback('Error al crear equipo');
    else setFeedback('Equipo creado');
    setShowModal(false);
    setNuevo({ nombre: '', ciudad: '' });
    cargarEquipos();
    setLoading(false);
  };

  const handleVer = (e) => {
    setDetalle(e);
  };

  const handleEliminar = async (id) => {
    setLoading(true);
    const { error } = await supabase.from('equipos').delete().eq('id', id);
    if (error) setFeedback('Error al eliminar equipo');
    else setFeedback('Equipo eliminado');
    cargarEquipos();
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Listado de Equipos</h2>
      <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar equipo..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: '#FFD700' }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
      <table style={{ width: '100%', background: '#232323', borderRadius: 8, marginBottom: 24 }}>
        <thead>
          <tr style={{ color: '#FFD700' }}>
            <th>Nombre</th><th>Ciudad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(e => (
            <tr key={e.id}>
              <td>{e.nombre}</td><td>{e.ciudad}</td>
              <td>
                <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold', marginRight: 8 }} onClick={() => handleVer(e)}>Ver</Button>
                <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 6, padding: '4px 10px', fontWeight: 'bold' }} onClick={() => handleEliminar(e.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }} onClick={() => setShowModal(true)}>Nuevo equipo</Button>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#181818cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, minWidth: 320 }}>
            <h3>Crear equipo</h3>
            <input value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Nombre" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
            <input value={nuevo.ciudad} onChange={e => setNuevo({ ...nuevo, ciudad: e.target.value })} placeholder="Ciudad" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={handleCrear}>Crear</Button>
              <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
      {detalle && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Detalle de Equipo</h3>
          <div><strong>Nombre:</strong> {detalle.nombre}</div>
          <div><strong>Ciudad:</strong> {detalle.ciudad}</div>
          <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12 }} onClick={() => setDetalle(null)}>Cerrar</Button>
        </div>
      )}
    </div>
  );
}