import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import './Amigos.css';

const Amigos = () => {
  const { user, categoria } = useAuth();
  const [amigos, setAmigos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);

  useEffect(() => {
    if (!user) return;
    cargarAmigos();
    cargarSolicitudes();
    
    // Suscribirse a cambios en friend_requests en realtime
    const channel = supabase
      .channel(`friend_requests:${user.email}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'friend_requests', filter: `to_email=eq.${user.email}` },
        () => { cargarSolicitudes(); }
      )
      .subscribe();

    // Suscribirse a cambios en friends
    const channelFriends = supabase
      .channel(`friends:${user.email}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'friends', filter: `user_email=eq.${user.email}` },
        () => { cargarAmigos(); }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      channelFriends.unsubscribe();
    };
  }, [user]);

  const cargarAmigos = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('friends')
      .select('id, friend_id, friend_email, friend_name, created_at')
      .eq('user_email', user.email);
    if (!error && data) {
      const mapped = data.map(row => ({
        id: row.friend_id || row.id,
        nombre: row.friend_name || row.friend_email || 'Amigo',
        email: row.friend_email,
        fechaAmistad: row.created_at
      }));
      setAmigos(mapped);
    }
  };

  const cargarSolicitudes = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('friend_requests')
      .select('id, from_email, from_name, to_email, status, created_at')
      .eq('to_email', user.email)
      .eq('status', 'pending');
    if (!error && data) {
      const mapped = data.map(r => ({
        id: r.id,
        de: r.from_email,
        para: r.to_email,
        nombrePara: r.from_name || r.from_email,
        fecha: r.created_at,
        estado: r.status
      }));
      setSolicitudes(mapped);
    }
  };

  const buscarUsuarios = async () => {
    if (!busqueda.trim()) return;

    // Buscar en tabla profiles de Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name, category')
      .or(`full_name.ilike.%${busqueda}%,email.ilike.%${busqueda}%`)
      .limit(10);

    if (!error && data) {
      const filtrados = data.filter(p => p.email !== user?.email); // Excluir al mismo usuario
      const mapped = filtrados.map(p => ({
        email: p.email,
        nombre: p.full_name || p.email,
        categoria: p.category || 'general'
      }));
      setUsuariosEncontrados(mapped);
    }
  };

  const enviarSolicitud = async (usuarioEmail, nombreUsuario) => {
    if (!user) return;
    const { error } = await supabase
      .from('friend_requests')
      .insert([{
        from_email: user.email,
        from_name: user.email,
        to_email: usuarioEmail,
        status: 'pending'
      }]);
    if (!error) {
      await cargarSolicitudes();
      setUsuariosEncontrados(usuariosEncontrados.filter(u => u.email !== usuarioEmail));
      alert(`Solicitud de amistad enviada a ${nombreUsuario}`);
    }
  };

  const aceptarSolicitud = async (solicitudId) => {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud || !user) return;

    const { error: errUpdate } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', solicitudId);

    const { error: errInsert } = await supabase
      .from('friends')
      .insert([
        { user_email: user.email, friend_email: solicitud.de, friend_name: solicitud.nombrePara },
        { user_email: solicitud.de, friend_email: user.email, friend_name: user.email }
      ]);

    if (!errUpdate && !errInsert) {
      await cargarAmigos();
      await cargarSolicitudes();
      alert(`Ahora eres amigo de ${solicitud.nombrePara}`);
    }
  };

  const rechazarSolicitud = async (solicitudId) => {
    await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', solicitudId);
    await cargarSolicitudes();
  };

  const removerAmigo = async (amigoEmail) => {
    if (!user) return;
    await supabase
      .from('friends')
      .delete()
      .eq('user_email', user.email)
      .eq('friend_email', amigoEmail);
    await supabase
      .from('friends')
      .delete()
      .eq('user_email', amigoEmail)
      .eq('friend_email', user.email);
    await cargarAmigos();
  };

  return (
    <div className="amigos-container">
      <div className="amigos-header">
        <h1>Amigos</h1>
        <p>Conecta con otros jugadores de fútbol</p>
      </div>

      {/* Buscar usuarios */}
      <div className="buscar-amigos">
        <div className="busqueda-input">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o email..."
            onKeyPress={(e) => e.key === 'Enter' && buscarUsuarios()}
          />
          <button onClick={buscarUsuarios} className="btn-buscar">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Solicitudes pendientes */}
      {solicitudes.length > 0 && (
        <div className="solicitudes-section">
          <h2>Solicitudes de Amistad</h2>
          {solicitudes.map(solicitud => (
            <div key={solicitud.id} className="solicitud-card">
              <div className="solicitud-info">
                <h4>{solicitud.nombrePara}</h4>
                <p>Quiere ser tu amigo</p>
                <small>{new Date(solicitud.fecha).toLocaleDateString()}</small>
              </div>
              <div className="solicitud-actions">
                <button
                  onClick={() => aceptarSolicitud(solicitud.id)}
                  className="btn-aceptar"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  className="btn-rechazar"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados de búsqueda */}
      {usuariosEncontrados.length > 0 && (
        <div className="resultados-busqueda">
          <h2>Resultados de Búsqueda</h2>
          {usuariosEncontrados.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-info">
                <div className="avatar-placeholder">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{usuario.nombre}</h4>
                  <span className="categoria-badge">{usuario.categoria}</span>
                  <p>{usuario.email}</p>
                </div>
              </div>
              <button
                onClick={() => enviarSolicitud(usuario.email, usuario.nombre)}
                className="btn-enviar-solicitud"
              >
                Enviar Solicitud
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lista de amigos */}
      <div className="amigos-section">
        <h2>Mis Amigos ({amigos.length})</h2>
        {amigos.length === 0 ? (
          <div className="no-amigos">
            <p>Aún no tienes amigos.</p>
            <p>¡Busca otros jugadores para conectar!</p>
          </div>
        ) : (
          <div className="amigos-grid">
            {amigos.map(amigo => (
              <div key={amigo.id} className="amigo-card">
                <div className="amigo-avatar">
                  {amigo.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="amigo-info">
                  <h4>{amigo.nombre}</h4>
                  <p>Amigos desde {new Date(amigo.fechaAmistad).toLocaleDateString()}</p>
                </div>
                <div className="amigo-actions">
                  <button className="btn-mensaje">
                    <i className="fas fa-comment"></i>
                  </button>
                  <button
                    onClick={() => removerAmigo(amigo.id)}
                    className="btn-remover"
                  >
                    <i className="fas fa-user-minus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Amigos;