import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { enviarNotificacionPush, enviarNotificacionEmail } from '../services/notificationsService';
import { AuthContext } from '../context/AuthContext';
import ProfileManager from '../services/ProfileManager';

const tabs = [
  'Actividad',
  'Equipos',
  'Torneos',
  'Logros',
  'Marketplace',
  'Seguidores',
];

function getUserPushSubscription(userId) {
  if (window.futProApp?.getPushSubscription) {
    return window.futProApp.getPushSubscription(userId);
  }
  const sub = localStorage.getItem('futpro_push_subscription');
  if (sub) {
    try { return JSON.parse(sub); } catch { return null; }
  }
  return null;
}

async function enviarNotificacion(tipo, mensaje, email, userId) {
  if (tipo === 'push' && userId) {
    const subscription = getUserPushSubscription(userId);
    if (subscription) {
      await enviarNotificacionPush(subscription, { title: 'FutPro', message: mensaje, icon: '⚽' });
    } else {
      toast.info('Activa las notificaciones push en tu navegador para recibir avisos en tiempo real.', { icon: '🔔', style: { background: '#222', color: '#FFD700' } });
    }
  }
  if (tipo === 'email' && email) {
    await enviarNotificacionEmail(email, 'FutPro Notificación', mensaje, `<b>${mensaje}</b>`);
  }
}

function validarPerfil(data) {
  const errores = {};
  if (!data.full_name || data.full_name.trim().length < 3) {
    errores.full_name = 'El nombre debe tener al menos 3 caracteres.';
  }
  if (data.bio && data.bio.length > 200) {
    errores.bio = 'La biografía no puede superar 200 caracteres.';
  }
  return errores;
}

function validarProducto(data) {
  const errores = {};
  if (!data.nombre || data.nombre.trim().length < 2) {
    errores.nombre = 'El nombre del producto es obligatorio.';
  }
  if (!data.precio || isNaN(data.precio) || Number(data.precio) <= 0) {
    errores.precio = 'El precio debe ser un número positivo.';
  }
  if (data.descripcion && data.descripcion.length > 120) {
    errores.descripcion = 'La descripción no puede superar 120 caracteres.';
  }
  return errores;
}
export default function PerfilAvanzado() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [tab, setTab] = useState(tabs[0]);
  const [posts, setPosts] = useState([]);
  const [teams] = useState([]);
  const [tournaments] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [marketErrors, setMarketErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [pushActiva, setPushActiva] = useState(() => !!getUserPushSubscription(user?.id));

  async function activarPush() {
    if (window.futProApp?.subscribePush) {
      const sub = await window.futProApp.subscribePush(user?.id);
      if (sub) {
        localStorage.setItem('futpro_push_subscription', JSON.stringify(sub));
        setPushActiva(true);
        toast.success('¡Notificaciones push activadas!', { icon: '🔔', style: { background: '#181818', color: '#FFD700' } });
      } else {
        toast.error('No se pudo activar push. Revisa permisos del navegador.');
      }
    } else {
      toast.info('Tu navegador no soporta notificaciones push o falta integración.');
    }
  }
  // Estados duplicados eliminados

  useEffect(() => {
    if (!user) return;
    const pm = new ProfileManager(/* database, firebase, uiManager: proveer según arquitectura */);
    pm.loadProfile(user.id).then(() => {
      setProfile(pm.currentProfile);
      setPosts(pm.posts);
      setAchievements(pm.achievements);
      setFollowers(Array.from(pm.followers));
      setFollowing(Array.from(pm.following));
      // TODO: conectar equipos, torneos, marketplace
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-lg p-8">
        {/* Cabecera perfil */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <img src={profile?.avatar_url || "/assets/avatar-default.png"} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile?.full_name || 'Usuario'}</h1>
            <p className="text-yellow-300 font-semibold">{profile?.position || 'Jugador'}</p>
            <p className="mt-2 text-gray-300">Biografía: {profile?.bio || 'Sin biografía.'} <button onClick={()=>setShowEditModal(true)} className="text-blue-400 underline ml-2">Editar</button></p>
            <div className="flex gap-4 mt-4 flex-wrap">
              <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300">Seguir</button>
              <button className="bg-gray-700 text-yellow-300 font-bold py-2 px-4 rounded hover:bg-gray-600">Mensaje</button>
              {!pushActiva && (
                <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 animate-pulse" onClick={activarPush} type="button">
                  Activar notificaciones push
                </button>
              )}
              {pushActiva && (
                <span className="text-green-400 font-bold flex items-center gap-1"><span className="animate-ping inline-block w-2 h-2 bg-green-400 rounded-full"></span>Push activo</span>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700 mb-6">
          {tabs.map(t => (
            <button
              key={t}
              className={`py-2 px-4 font-semibold rounded-t ${tab === t ? 'bg-gray-800 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Contenido de cada tab */}
        <div className="min-h-[200px]">
          {tab === 'Actividad' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Actividad reciente</h2>
              <ul className="space-y-2">
                {posts.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin actividad reciente</li> : posts.map(post => (
                  <li key={post.id} className="bg-gray-800 rounded p-2">{post.texto || post.content}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'Equipos' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Mis equipos</h2>
              <ul className="space-y-2">
                {teams.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin equipos</li> : teams.map(equipo => (
                  <li key={equipo.id} className="bg-gray-800 rounded p-2">{equipo.nombre}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'Torneos' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Torneos jugados</h2>
              <ul className="space-y-2">
                {tournaments.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin torneos</li> : tournaments.map(torneo => (
                  <li key={torneo.id} className="bg-gray-800 rounded p-2">{torneo.name}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'Logros' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Logros y medallas</h2>
              <ul className="space-y-2">
                {achievements.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin logros</li> : achievements.map(logro => (
                  <li key={logro.id} className="bg-gray-800 rounded p-2">{logro.name}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'Marketplace' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Mis productos</h2>
              <ul className="space-y-2">
                {marketItems.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin productos</li> : marketItems.map(item => (
                  <li key={item.id} className="bg-gray-800 rounded p-2">{item.nombre} - ${item.precio}</li>
                ))}
              </ul>
              <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300" onClick={()=>setShowMarketModal(true)}>Publicar producto</button>
            </div>
          )}
          {tab === 'Seguidores' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Seguidores</h2>
              <ul className="space-y-2">
                {followers.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin seguidores</li> : followers.map(f => (
                  <li key={f.id} className="bg-gray-800 rounded p-2">@{f.nombre || f.username}</li>
                ))}
              </ul>
              <h2 className="text-xl font-bold mt-6 mb-2">Seguidos</h2>
              <ul className="space-y-2">
                {following.length === 0 ? <li className="bg-gray-800 rounded p-2">Sin seguidos</li> : following.map(f => (
                  <li key={f.id} className="bg-gray-800 rounded p-2">@{f.nombre || f.username}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Modal edición perfil */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-lg shadow-2xl animate-slideUp">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 animate-pulse">¡Edita tu perfil y destaca!</h2>
              {successMsg && <div className="mb-4 text-green-400 font-bold animate-bounce">{successMsg}</div>}
              <form onSubmit={async e => {
                e.preventDefault();
                setFormErrors({});
                setSuccessMsg('');
                setLoading(true);
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                const errores = validarPerfil(data);
                if (Object.keys(errores).length > 0) {
                  setFormErrors(errores);
                  setLoading(false);
                  toast.error('Por favor revisa los campos marcados. ¡Queremos que tu perfil sea perfecto!');
                  return;
                }
                try {
                  const pm = new ProfileManager();
                  await pm.saveProfile({ ...profile, ...data });
                  setProfile(prev => ({ ...prev, ...data }));
                  setSuccessMsg('¡Tus cambios se guardaron y tu perfil brilla más!');
                  toast.success('¡Perfil actualizado con éxito!', { icon: '⚽', style: { background: '#181818', color: '#FFD700', fontWeight: 'bold' } });
                  await enviarNotificacion('push', 'Tu perfil ha sido actualizado. ¡Sigue brillando!', profile?.email, user?.id);
                  await enviarNotificacion('email', 'Tu perfil en FutPro fue actualizado correctamente.', profile?.email, user?.id);
                  setTimeout(()=>{ setShowEditModal(false); setSuccessMsg(''); }, 1500);
                } catch (err) {
                  toast.error('Ocurrió un error inesperado. Intenta de nuevo.');
                }
                setLoading(false);
              }}>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Nombre completo</label>
                  <input name="full_name" defaultValue={profile?.full_name || ''} className="w-full p-2 rounded bg-gray-800 text-white" required />
                  {formErrors.full_name && <div className="text-red-400 text-sm mt-1">{formErrors.full_name}</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Biografía</label>
                  <textarea name="bio" defaultValue={profile?.bio || ''} className="w-full p-2 rounded bg-gray-800 text-white" rows={3} />
                  {formErrors.bio && <div className="text-red-400 text-sm mt-1">{formErrors.bio}</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Posición</label>
                  <select name="position" defaultValue={profile?.position || ''} className="w-full p-2 rounded bg-gray-800 text-white">
                    <option value="">Seleccionar...</option>
                    <option value="goalkeeper">Portero</option>
                    <option value="defender">Defensa</option>
                    <option value="midfielder">Centrocampista</option>
                    <option value="forward">Delantero</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Nivel de habilidad</label>
                  <select name="skill_level" defaultValue={profile?.skill_level || ''} className="w-full p-2 rounded bg-gray-800 text-white">
                    <option value="">Seleccionar...</option>
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                    <option value="professional">Profesional</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" className="bg-gray-700 text-yellow-300 font-bold py-2 px-4 rounded hover:bg-gray-600" onClick={()=>setShowEditModal(false)} disabled={loading}>Cancelar</button>
                  <button type="submit" className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal marketplace */}
        {showMarketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-lg shadow-2xl animate-slideUp">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 animate-pulse">¡Publica tu producto y llega a más jugadores!</h2>
              {successMsg && <div className="mb-4 text-green-400 font-bold animate-bounce">{successMsg}</div>}
              <form onSubmit={async e => {
                e.preventDefault();
                setMarketErrors({});
                setSuccessMsg('');
                setLoading(true);
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                const errores = validarProducto(data);
                if (Object.keys(errores).length > 0) {
                  setMarketErrors(errores);
                  setLoading(false);
                  toast.error('¡Revisa los campos! Queremos que tu producto destaque.');
                  return;
                }
                try {
                  setMarketItems(prev => [...prev, { ...data, id: Date.now() }]);
                  setSuccessMsg('¡Tu producto ya está visible para toda la comunidad!');
                  toast.success('¡Producto publicado con éxito!', { icon: '🛒', style: { background: '#181818', color: '#FFD700', fontWeight: 'bold' } });
                  await enviarNotificacion('push', '¡Nuevo producto publicado en tu marketplace!', profile?.email, user?.id);
                  await enviarNotificacion('email', 'Tu producto en FutPro fue publicado correctamente.', profile?.email, user?.id);
                  setTimeout(()=>{ setShowMarketModal(false); setSuccessMsg(''); }, 1500);
                } catch (err) {
                  toast.error('Ocurrió un error inesperado. Intenta de nuevo.');
                }
                setLoading(false);
              }}>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Nombre del producto</label>
                  <input name="nombre" className="w-full p-2 rounded bg-gray-800 text-white" required />
                  {marketErrors.nombre && <div className="text-red-400 text-sm mt-1">{marketErrors.nombre}</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Precio</label>
                  <input name="precio" type="number" className="w-full p-2 rounded bg-gray-800 text-white" required />
                  {marketErrors.precio && <div className="text-red-400 text-sm mt-1">{marketErrors.precio}</div>}
                </div>
                <div className="mb-4">
                  <label className="block text-yellow-300 mb-1">Descripción</label>
                  <textarea name="descripcion" className="w-full p-2 rounded bg-gray-800 text-white" rows={2} />
                  {marketErrors.descripcion && <div className="text-red-400 text-sm mt-1">{marketErrors.descripcion}</div>}
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" className="bg-gray-700 text-yellow-300 font-bold py-2 px-4 rounded hover:bg-gray-600" onClick={()=>setShowMarketModal(false)} disabled={loading}>Cancelar</button>
                  <button type="submit" className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300" disabled={loading}>{loading ? 'Publicando...' : 'Publicar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
