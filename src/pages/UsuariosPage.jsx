import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import supabase from '../supabaseClient';
import './UsuariosPage.css';

// Ejemplo de tiempo real con Supabase (usuarios)
// Se mantiene, pero se asegura que cargarUsuarios esté definido antes de usarlo
// Se mueve dentro del componente para evitar error de scope

const gold = '#FFD700';
const black = '#222';

export default function UsuariosPage() {
  const { user, role } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '' });
  const [detalleUsuario, setDetalleUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = window.ReactRouterDOM.useNavigate ? window.ReactRouterDOM.useNavigate() : null;

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Validación de email
  const validarEmail = (email) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  // Validación de nombre
  const validarNombre = (nombre) => {
    return nombre.trim().length > 0;
  };

  // Cargar usuarios desde Supabase
  const cargarUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) setError('Error al cargar usuarios');
    else setUsuarios(data);
    setLoading(false);
  };

  // Filtro avanzado por nombre y email (memoizado)
  const filtrados = useMemo(() => {
    return usuarios.filter(u =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [usuarios, filtro]);
  // Borrar usuario en Supabase (solo admin)
  const handleBorrar = async (id) => {
    if (role !== 'admin') {
      setFeedback('No tienes permisos para borrar usuarios');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) setFeedback('Error al borrar usuario');
    else {
      setFeedback('Usuario borrado exitosamente');
      setUsuarios(prev => prev.filter(u => u.id !== id));
    }
    setLoading(false);
  };

  // Crear usuario en Supabase (validación y solo admin)
  const handleCrear = async () => {
    if (role !== 'admin') {
      setFeedback('No tienes permisos para crear usuarios');
      return;
    }
    if (!validarNombre(nuevoUsuario.nombre)) {
      setFeedback('El nombre es obligatorio');
      return;
    }
    if (!validarEmail(nuevoUsuario.email)) {
      setFeedback('Email inválido');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from('usuarios').insert([nuevoUsuario]).select();
    if (error) setFeedback('Error al crear usuario');
    else {
      setFeedback('Usuario creado exitosamente');
      setUsuarios(prev => [...prev, ...(data || [])]);
    }
    setShowModal(false);
    setNuevoUsuario({ nombre: '', email: '' });
    setLoading(false);
  };

  const handleVer = (usuario) => {
    setDetalleUsuario(usuario);
    setEditando(false);
    if (navigate) navigate(`/usuario/${usuario.id}`);
  };

  const handleEditar = (usuario) => {
    setDetalleUsuario(usuario);
    setEditando(true);
    setNuevoUsuario({ nombre: usuario.nombre, email: usuario.email });
    if (navigate) navigate(`/usuario/${usuario.id}/editar`);
  };

  // Editar usuario en Supabase (validación y solo admin)
  const handleActualizar = async () => {
    if (role !== 'admin') {
      setFeedback('No tienes permisos para editar usuarios');
      return;
    }
    if (!validarNombre(nuevoUsuario.nombre)) {
      setFeedback('El nombre es obligatorio');
      return;
    }
    if (!validarEmail(nuevoUsuario.email)) {
      setFeedback('Email inválido');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from('usuarios').update(nuevoUsuario).eq('id', detalleUsuario.id).select();
    if (error) setFeedback('Error al actualizar usuario');
    else {
      setFeedback('Usuario actualizado');
      setUsuarios(prev => prev.map(u => u.id === detalleUsuario.id ? { ...u, ...nuevoUsuario } : u));
    }
    setEditando(false);
    setDetalleUsuario(null);
    setLoading(false);
  };

  // Eliminar usuario (solo admin)
  const handleEliminar = async (id) => {
    if (role !== 'admin') {
      setFeedback('No tienes permisos para eliminar usuarios');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) setFeedback('Error al eliminar usuario');
    else {
      setFeedback('Usuario eliminado');
      setUsuarios(prev => prev.filter(u => u.id !== id));
    }
    setLoading(false);
  };

  // Suscripción a cambios en tiempo real (dentro del componente)
  useEffect(() => {
    const subscription = supabase
      .channel('usuarios-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, payload => {
        cargarUsuarios();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Listado de Usuarios</h2>
      <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar usuario..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
      {loading && <div style={{ color: '#FFD700' }}>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
      {/* Aquí puedes agregar una tabla si lo deseas, pero el listado ya está en <ul> */}
      {/* Ejemplo de tabla de usuarios */}
      <table style={{ width: '100%', background: '#232323', color: '#FFD700', borderRadius: 12, marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ padding: 12 }}>Nombre</th>
            <th style={{ padding: 12 }}>Email</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(usuario => (
            <tr key={usuario.id}>
              <td style={{ padding: 12 }}>{usuario.nombre}</td>
              <td style={{ padding: 12 }}>{usuario.email}</td>
              <td style={{ padding: 12 }}>
                <Button onClick={() => handleVer(usuario)} style={{ marginRight: 8 }}>Ver</Button>
                <Button onClick={() => handleEditar(usuario)} style={{ marginRight: 8 }}>Editar</Button>
                <Button onClick={() => handleEliminar(usuario.id)} style={{ background: 'red', color: '#fff' }}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, minWidth: 320 }}>
        <h3>Crear usuario</h3>
        <input value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} placeholder="Nombre" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={handleCrear}>Crear</Button>
          <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setShowModal(false)}>Cancelar</Button>
        </div>
      </div>
      {detalleUsuario && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Detalle de Usuario</h3>
          <div><strong>Nombre:</strong> {detalleUsuario.nombre}</div>
          <div><strong>Email:</strong> {detalleUsuario.email}</div>
          {/* Aquí puedes agregar historial, logros, actividad, comentarios, etc. */}
          <div style={{ marginTop: 18 }}>
            <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginRight: 8 }} onClick={() => setEditando(true)}>Editar</Button>
            <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setDetalleUsuario(null)}>Cerrar</Button>
          </div>
        </div>
      )}
      {editando && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24 }}>
          <h3>Editar Usuario</h3>
          <input value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} placeholder="Nombre" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
          <input value={nuevoUsuario.email} onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} placeholder="Email" style={{ borderRadius: 8, padding: 8, marginBottom: 12, width: '100%' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={handleActualizar}>Actualizar</Button>
            <Button style={{ background: '#232323', color: '#FFD700', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }} onClick={() => setEditando(false)}>Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Listado de usuarios con filtro, tabla/cards y acciones
// Consulta datos desde Supabase/API
// Botón para crear nuevo usuario (modal)
// Detalle de usuario con acciones (editar, eliminar, compartir, comentar)
// Visualización de historial, logros, actividad
// Formulario de edición/creación con validaciones y feedback visual
// Paneles/Dashboard con KPIs y gráficos