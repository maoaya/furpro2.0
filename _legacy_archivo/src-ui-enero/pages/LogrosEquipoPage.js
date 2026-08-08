import React, { useState, useEffect, useContext } from 'react';
import supabase from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

const LogrosEquipoPage = () => {
  const { role, equipoId } = useContext(AuthContext);
  const [logros, setLogros] = useState([]);
  const [conexion, setConexion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar logros solo del equipo del usuario
  useEffect(() => {
    if (!equipoId) {
      setError('No tienes equipo asignado.');
      setLogros([]);
      return;
    }
    setLoading(true);
    supabase
      .from('logros_equipo')
      .select('*')
      .eq('equipoId', equipoId)
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setConexion('Error de conexión: ' + error.message);
        } else {
          setLogros(data || []);
          setConexion('Conexión exitosa a Supabase');
        }
        setLoading(false);
      });
  }, [equipoId]);

  // Agregar logro solo si admin o manager
  const agregar = async () => {
    if (role !== 'admin' && role !== 'manager') {
      setError('No tienes permisos para agregar logros.');
      return;
    }
    const nombre = prompt('Nombre del logro:');
    const descripcion = prompt('Descripción:');
    if (nombre && descripcion) {
      setLoading(true);
      const { data, error } = await supabase
        .from('logros_equipo')
        .insert([{ nombre, descripcion, equipoId }])
        .select();
      if (!error && data) setLogros(prev => [...prev, data[0]]);
      else setError(error?.message || 'Error al agregar');
      setLoading(false);
    }
  };

  // Editar logro solo si admin o manager
  const editar = async (id) => {
    if (role !== 'admin' && role !== 'manager') {
      setError('No tienes permisos para editar logros.');
      return;
    }
    const nombre = prompt('Nuevo nombre:');
    const descripcion = prompt('Nueva descripción:');
    if (nombre && descripcion) {
      setLoading(true);
      const { data, error } = await supabase
        .from('logros_equipo')
        .update({ nombre, descripcion })
        .eq('id', id)
        .eq('equipoId', equipoId)
        .select();
      if (!error && data) setLogros(prev => prev.map(l => l.id === id ? data[0] : l));
      else setError(error?.message || 'Error al editar');
      setLoading(false);
    }
  };

  // Eliminar logro solo si admin o manager
  const eliminar = async (id) => {
    if (role !== 'admin' && role !== 'manager') {
      setError('No tienes permisos para eliminar logros.');
      return;
    }
    if (!window.confirm('¿Seguro que deseas eliminar este logro?')) return;
    setLoading(true);
    const { error } = await supabase
      .from('logros_equipo')
      .delete()
      .eq('id', id)
      .eq('equipoId', equipoId);
    if (!error) setLogros(prev => prev.filter(l => l.id !== id));
    else setError(error?.message || 'Error al eliminar');
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: 'auto' }}>
      <h2>Logros del Equipo</h2>
      <div style={{ marginBottom: 16, color: conexion.includes('Error') ? 'red' : 'green' }}>{conexion}</div>
      {loading && <div style={{ color: '#FFD700' }}>Procesando...</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {(role === 'admin' || role === 'manager') && (
        <button onClick={agregar} style={{ marginBottom: 16, padding: '8px 16px' }}>Agregar logro</button>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Nombre</th>
            <th>Descripción</th>
            {(role === 'admin' || role === 'manager') && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {logros.length === 0 ? (
            <tr><td colSpan={role === 'admin' || role === 'manager' ? 3 : 2}>No hay logros</td></tr>
          ) : (
            logros.map((logro, idx) => (
              <tr key={logro.id || idx}>
                <td>{logro.nombre}</td>
                <td>{logro.descripcion}</td>
                {(role === 'admin' || role === 'manager') && (
                  <td>
                    <button onClick={() => editar(logro.id)} style={{ marginRight: 8 }}>Editar</button>
                    <button onClick={() => eliminar(logro.id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogrosEquipoPage;
