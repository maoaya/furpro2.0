import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const ConfiguracionCuenta = () => {
  const navigate = useNavigate();
  // FP-AUTH-002: sin getUser local
  const { user, loading: authLoading } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  
  // Formularios
  const [mostrarCambiarContraseña, setMostrarCambiarContraseña] = useState(false);
  const [mostrarCambiarUbicacion, setMostrarCambiarUbicacion] = useState(false);
  const [mostrarCambiarPrivacidad, setMostrarCambiarPrivacidad] = useState(false);
  const [mostrarEliminarCuenta, setMostrarEliminarCuenta] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    contraseñaActual: '',
    contraseñaNueva: '',
    confirmarContraseña: '',
    ubicacion: '',
    privacidad: 'publica',
    confirmacionEliminar: ''
  });

  useEffect(() => {
    if (authLoading) return;
    cargarUsuario();
  }, [user?.id, authLoading]);

  const cargarUsuario = async () => {
    try {
      if (!user) {
        navigate('/');
        return;
      }
      
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setUsuario(data);
        setFormData(prev => ({
          ...prev,
          ubicacion: data.ubicacion || '',
          privacidad: data.privacidad || 'publica'
        }));
      }
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      setError('Error al cargar datos del usuario');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 1️⃣ CAMBIAR CONTRASEÑA
  const handleCambiarContraseña = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    if (formData.contraseñaNueva !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.contraseñaNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.contraseñaNueva
      });

      if (updateError) throw updateError;

      setMensaje('✅ Contraseña actualizada correctamente');
      setFormData(prev => ({
        ...prev,
        contraseñaActual: '',
        contraseñaNueva: '',
        confirmarContraseña: ''
      }));
      setMostrarCambiarContraseña(false);
    } catch (err) {
      setError('Error al cambiar la contraseña: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ CAMBIAR UBICACIÓN
  const handleCambiarUbicacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    if (!formData.ubicacion.trim()) {
      setError('Ingresa una ubicación válida');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ ubicacion: formData.ubicacion })
        .eq('id', usuario.id);

      if (updateError) throw updateError;

      setUsuario(prev => ({ ...prev, ubicacion: formData.ubicacion }));
      setMensaje('✅ Ubicación actualizada correctamente');
      setMostrarCambiarUbicacion(false);
    } catch (err) {
      setError('Error al cambiar la ubicación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ CAMBIAR PRIVACIDAD
  const handleCambiarPrivacidad = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ privacidad: formData.privacidad })
        .eq('id', usuario.id);

      if (updateError) throw updateError;

      setUsuario(prev => ({ ...prev, privacidad: formData.privacidad }));
      setMensaje(`✅ Privacidad cambiada a: ${formData.privacidad === 'publica' ? 'Pública' : 'Privada'}`);
      setMostrarCambiarPrivacidad(false);
    } catch (err) {
      setError('Error al cambiar privacidad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ ELIMINAR CUENTA
  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.confirmacionEliminar !== 'ELIMINAR') {
      setError('Debes escribir "ELIMINAR" para confirmar');
      setLoading(false);
      return;
    }

    try {
      // Primero eliminar datos de la BD
      const { error: deleteUserError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuario.id);

      if (deleteUserError) throw deleteUserError;

      // Luego eliminar cuenta de autenticación
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(usuario.id);
      
      if (deleteAuthError) {
        // Si falla la eliminación del auth, intentar logout al menos
        await supabase.auth.signOut();
      }

      setMensaje('✅ Cuenta eliminada correctamente');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Error al eliminar cuenta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ CERRAR SESIÓN
  const handleCerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      setError('Error al cerrar sesión: ' + err.message);
    }
  };

  const estilos = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      color: '#fff'
    },
    titulo: {
      fontSize: '28px',
      marginBottom: '30px',
      color: '#FFD700',
      textAlign: 'center'
    },
    seccion: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      borderLeft: '4px solid #FFD700'
    },
    botonPrincipal: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      backgroundColor: '#FFD700',
      color: '#000',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    formulario: {
      marginTop: '15px',
      padding: '15px',
      backgroundColor: '#3a3a3a',
      borderRadius: '6px'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#444',
      color: '#fff',
      border: '1px solid #FFD700',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#444',
      color: '#fff',
      border: '1px solid #FFD700',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    botonAccion: {
      padding: '10px 15px',
      marginRight: '10px',
      backgroundColor: '#FFD700',
      color: '#000',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    botonCancelar: {
      padding: '10px 15px',
      backgroundColor: '#666',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    botonPeligro: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: '10px'
    },
    botonLogout: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#ff6b35',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '20px'
    },
    mensaje: {
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '6px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    mensajeExito: {
      backgroundColor: '#28a745',
      color: '#fff'
    },
    mensajeError: {
      backgroundColor: '#dc3545',
      color: '#fff'
    }
  };

  return (
    <div style={estilos.container}>
      <h1 style={estilos.titulo}>⚙️ Configuración de Cuenta</h1>

      {mensaje && (
        <div style={{ ...estilos.mensaje, ...estilos.mensajeExito }}>
          {mensaje}
        </div>
      )}

      {error && (
        <div style={{ ...estilos.mensaje, ...estilos.mensajeError }}>
          {error}
        </div>
      )}

      {/* SECCIÓN 1: CAMBIAR CONTRASEÑA */}
      <div style={estilos.seccion}>
        <button
          onClick={() => setMostrarCambiarContraseña(!mostrarCambiarContraseña)}
          style={estilos.botonPrincipal}
        >
          🔐 Cambiar Contraseña
        </button>
        
        {mostrarCambiarContraseña && (
          <form onSubmit={handleCambiarContraseña} style={estilos.formulario}>
            <input
              type="password"
              name="contraseñaActual"
              placeholder="Contraseña actual"
              value={formData.contraseñaActual}
              onChange={handleInputChange}
              style={estilos.input}
              required
            />
            <input
              type="password"
              name="contraseñaNueva"
              placeholder="Contraseña nueva"
              value={formData.contraseñaNueva}
              onChange={handleInputChange}
              style={estilos.input}
              required
            />
            <input
              type="password"
              name="confirmarContraseña"
              placeholder="Confirmar contraseña"
              value={formData.confirmarContraseña}
              onChange={handleInputChange}
              style={estilos.input}
              required
            />
            <div>
              <button type="submit" style={estilos.botonAccion} disabled={loading}>
                {loading ? '⏳ Procesando...' : '✅ Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setMostrarCambiarContraseña(false)}
                style={estilos.botonCancelar}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECCIÓN 2: CAMBIAR UBICACIÓN */}
      <div style={estilos.seccion}>
        <button
          onClick={() => setMostrarCambiarUbicacion(!mostrarCambiarUbicacion)}
          style={estilos.botonPrincipal}
        >
          📍 Cambiar Ubicación
        </button>
        
        {mostrarCambiarUbicacion && (
          <form onSubmit={handleCambiarUbicacion} style={estilos.formulario}>
            <p style={{ marginTop: 0, color: '#ccc' }}>
              Ubicación actual: <strong>{usuario?.ubicacion || 'No especificada'}</strong>
            </p>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ej: Madrid, España"
              value={formData.ubicacion}
              onChange={handleInputChange}
              style={estilos.input}
              required
            />
            <div>
              <button type="submit" style={estilos.botonAccion} disabled={loading}>
                {loading ? '⏳ Procesando...' : '✅ Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setMostrarCambiarUbicacion(false)}
                style={estilos.botonCancelar}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECCIÓN 3: CAMBIAR PRIVACIDAD */}
      <div style={estilos.seccion}>
        <button
          onClick={() => setMostrarCambiarPrivacidad(!mostrarCambiarPrivacidad)}
          style={estilos.botonPrincipal}
        >
          🔒 Cambiar Privacidad
        </button>
        
        {mostrarCambiarPrivacidad && (
          <form onSubmit={handleCambiarPrivacidad} style={estilos.formulario}>
            <p style={{ marginTop: 0, color: '#ccc' }}>
              Privacidad actual: <strong>{usuario?.privacidad === 'publica' ? '🌍 Pública' : '🔒 Privada'}</strong>
            </p>
            <select
              name="privacidad"
              value={formData.privacidad}
              onChange={handleInputChange}
              style={estilos.select}
            >
              <option value="publica">🌍 Pública - Cualquiera puede verme</option>
              <option value="privada">🔒 Privada - Solo amigos pueden verme</option>
            </select>
            <div>
              <button type="submit" style={estilos.botonAccion} disabled={loading}>
                {loading ? '⏳ Procesando...' : '✅ Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setMostrarCambiarPrivacidad(false)}
                style={estilos.botonCancelar}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECCIÓN 4: ELIMINAR CUENTA */}
      <div style={estilos.seccion}>
        <button
          onClick={() => setMostrarEliminarCuenta(!mostrarEliminarCuenta)}
          style={estilos.botonPeligro}
        >
          🗑️ Eliminar Cuenta
        </button>
        
        {mostrarEliminarCuenta && (
          <form onSubmit={handleEliminarCuenta} style={estilos.formulario}>
            <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
              ⚠️ Atención: Esta acción es irreversible. Se eliminarán todos tus datos.
            </p>
            <p style={{ color: '#ccc', fontSize: '14px' }}>
              Escribe "ELIMINAR" para confirmar:
            </p>
            <input
              type="text"
              name="confirmacionEliminar"
              placeholder="ELIMINAR"
              value={formData.confirmacionEliminar}
              onChange={handleInputChange}
              style={estilos.input}
              required
            />
            <div>
              <button
                type="submit"
                style={{ ...estilos.botonAccion, backgroundColor: '#dc3545' }}
                disabled={loading}
              >
                {loading ? '⏳ Eliminando...' : '🗑️ Eliminar Permanentemente'}
              </button>
              <button
                type="button"
                onClick={() => setMostrarEliminarCuenta(false)}
                style={estilos.botonCancelar}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECCIÓN 5: CERRAR SESIÓN */}
      <button
        onClick={handleCerrarSesion}
        style={estilos.botonLogout}
      >
        🚪 Cerrar Sesión
      </button>
    </div>
  );
};

export default ConfiguracionCuenta;
    console.log('[INTEGRACIÓN STUB] handleEliminar ejecutado (ConfiguracionCuenta.jsx)');
    setLoading(false);
  };
  const handleLogoutClick = async () => {
    setLoading(true);
    await stubHandleLogout(navigate);
    setFeedback('Sesión cerrada (stub)');
    console.log('[INTEGRACIÓN STUB] handleLogout ejecutado (ConfiguracionCuenta.jsx)');
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', minHeight: '100vh', color: '#FFD700', padding: 48, borderRadius: '18px', boxShadow: '0 2px 12px #FFD70044', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Configuración de Cuenta</h2>
      {feedback && <div style={{ color: '#FFD700', background: '#232323', borderRadius: 8, padding: 12, marginBottom: 16 }}>{feedback}</div>}
      <form onSubmit={handlePasswordSubmit} style={{ marginBottom: 24 }}>
        <label>Nueva contraseña:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar contraseña</button>
      </form>
      <form onSubmit={handleUbicacionSubmit} style={{ marginBottom: 24 }}>
        <label>Ubicación:</label>
        <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar ubicación</button>
      </form>
      <form onSubmit={handlePrivacidadSubmit} style={{ marginBottom: 24 }}>
        <label>Privacidad:</label>
        <select value={privacidad} onChange={e => setPrivacidad(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1px solid #FFD700', fontSize: 18, marginBottom: 8 }}>
          <option value="publico">Público</option>
          <option value="privado">Privado</option>
        </select>
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70088', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cambiar privacidad</button>
      </form>
      <button onClick={handleEliminarClick} disabled={loading} style={{ background: '#FFD70022', color: '#FFD700', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70022', cursor: 'pointer', marginBottom: 24, transition: 'background 0.3s, color 0.3s' }}>Eliminar cuenta</button>
      <button onClick={handleLogoutClick} disabled={loading} style={{ background: '#232323', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, boxShadow: '0 2px 8px #FFD70044', cursor: 'pointer', transition: 'background 0.3s, color 0.3s' }}>Cerrar sesión</button>
    </div>
  );
}
