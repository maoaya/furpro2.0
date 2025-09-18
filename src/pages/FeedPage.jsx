import React, { useEffect, useState, useMemo } from 'react';
import supabase from '../supabaseClient';
import { Button } from '../components/Button';
import PromocionarPost from './PromocionarPost';
import RankingUsuarios from '../components/RankingUsuarios';
import FormNuevaPublicacion from '../components/FormNuevaPublicacion';
import ListaPublicaciones from '../components/ListaPublicaciones';
import ModalDetallePublicacion from '../components/ModalDetallePublicacion';

export default function FeedPage() {
  // Estados principales
  const [user, setUser] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [usuarioTipo, setUsuarioTipo] = useState('todos');
  const [demoValoracion, setDemoValoracion] = useState(0);
  const [demoDificultad, setDemoDificultad] = useState(0);
  const [demoGuardado, setDemoGuardado] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [promocionando, setPromocionando] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [archivados, setArchivados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // El estado 'nuevo' ahora se maneja en FormNuevaPublicacion
  const [detalle, setDetalle] = useState(null);

  // Cargar usuario y datos al montar
  useEffect(() => {
    async function fetchUser() {
      let currentUser = null;
      if (supabase.auth.getUser) {
        const { data } = await supabase.auth.getUser();
        currentUser = data?.user || null;
      } else if (supabase.auth.user) {
        currentUser = supabase.auth.user();
      }
      setUser(currentUser);
    }
    fetchUser();
    cargarPublicaciones();
    cargarRanking();
    cargarEstadisticas();
  }, []);

  // Filtrar publicaciones activas
  const filtrados = useMemo(() => {
    let arr = publicaciones;
    if (usuarioTipo !== 'todos') {
      arr = arr.filter(p => p.tipo === usuarioTipo);
    }
    if (filtro) {
      arr = arr.filter(p => p.titulo.toLowerCase().includes(filtro.toLowerCase()));
    }
    return arr;
  }, [publicaciones, usuarioTipo, filtro]);

  // Cargar publicaciones desde Supabase
  async function cargarPublicaciones() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.from('publicaciones').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPublicaciones(data.filter(p => !p.archivado));
      setArchivados(data.filter(p => p.archivado));
    } catch (e) {
      setError('Error al cargar publicaciones');
    } finally {
      setLoading(false);
    }
  }

  // Cargar ranking de usuarios por valoración promedio
  async function cargarRanking() {
    try {
      const { data, error } = await supabase.rpc('obtener_ranking_usuarios');
      if (error) {
        setRanking([]);
      } else {
        setRanking(data);
      }
    } catch {
      setRanking([]);
    }
  }

  // Cargar estadísticas de valoraciones y dificultad
  async function cargarEstadisticas() {
    try {
      const { data, error } = await supabase.from('valoraciones').select('*');
      if (error) {
        setEstadisticas(null);
        return;
      }
      // Agrupar por usuario
      const stats = {};
      data.forEach(v => {
        if (!stats[v.usuario]) stats[v.usuario] = { valoraciones: [], dificultades: [] };
        stats[v.usuario].valoraciones.push(v.valoracion);
        stats[v.usuario].dificultades.push(v.dificultad);
      });
      setEstadisticas(stats);
    } catch {
      setEstadisticas(null);
    }
  }

  // Guardar demo de valoración
  async function guardarDemo() {
    if (!usuarioTipo || demoValoracion === 0 || demoDificultad === 0) return;
    setLoading(true);
    setDemoGuardado(false);
    try {
      const { error } = await supabase.from('valoraciones').insert([
        { usuario: usuarioTipo, valoracion: demoValoracion, dificultad: demoDificultad }
      ]);
      if (error) throw error;
      setDemoGuardado(true);
      cargarRanking();
      cargarEstadisticas();
    } catch {
      setError('Error al guardar valoración');
    } finally {
      setLoading(false);
      setTimeout(() => setDemoGuardado(false), 2000);
    }
  }

  // Crear nueva publicación
  async function handleCrear() {
    if (!nuevo.titulo || !nuevo.descripcion) {
      setFeedback('Completa todos los campos');
      return;
    }
    setLoading(true);
    setFeedback('');
    try {
      const { error } = await supabase.from('publicaciones').insert([
        { titulo: nuevo.titulo, descripcion: nuevo.descripcion, tipo: usuarioTipo, archivado: false }
      ]);
      if (error) throw error;
      setFeedback('¡Publicación creada!');
      setNuevo({ titulo: '', descripcion: '' });
      setShowModal(false);
      cargarPublicaciones();
    } catch {
      setFeedback('Error al crear publicación');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(''), 2000);
    }
  }

  // Eliminar publicación
  async function handleEliminar(id) {
    if (!user) {
      setFeedback('Debes iniciar sesión para eliminar publicaciones.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('publicaciones').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      setFeedback('Publicación eliminada');
      cargarPublicaciones();
    } catch {
      setFeedback('Error al eliminar');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(''), 2000);
    }
  }

  // Archivar publicación
  async function handleArchivar(id) {
    if (!user) {
      setFeedback('Debes iniciar sesión para archivar publicaciones.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('publicaciones').update({ archivado: true }).eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      setFeedback('Publicación archivada');
      cargarPublicaciones();
    } catch {
      setFeedback('Error al archivar');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(''), 2000);
    }
  }

  // Promocionar publicación (solo muestra el modal de promoción)
  function handlePromocionar(pub) {
    setPromocionando(pub);
  }

  return (
    <div>
  {/* Ranking de usuarios por valoraciones */}
  <RankingUsuarios ranking={ranking} />
      <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
        {/* Selección de tipo de usuario para demo de primera card */}
        <div style={{ marginBottom: 18 }}>
          <span>Filtrar por tipo de usuario: </span>
          <select value={usuarioTipo} onChange={e => setUsuarioTipo(e.target.value)} style={{ borderRadius: 8, padding: 8 }}>
            <option value="todos">Todos</option>
            <option value="campeonato">Campeonato</option>
            <option value="patrocinador">Patrocinador</option>
            <option value="jugador">Jugador</option>
            <option value="arbitro">Árbitro</option>
          </select>
        </div>
        {/* Ejemplo de primera card para cada tipo de usuario */}
        <div style={{ background: '#232323', borderRadius: 12, padding: 18, marginBottom: 24 }}>
          <h3>Primera Card para {usuarioTipo !== 'todos' ? usuarioTipo.charAt(0).toUpperCase() + usuarioTipo.slice(1) : 'Selecciona un tipo'}</h3>
          {usuarioTipo === 'campeonato' && <div>Participa en el campeonato oficial. Califica la organización y dificultad del torneo.</div>}
          {usuarioTipo === 'patrocinador' && <div>Patrocina equipos y jugadores. Califica la visibilidad y el impacto de tu patrocinio.</div>}
          {usuarioTipo === 'jugador' && <div>Juega y comparte tus logros. Califica la dificultad de los partidos y tu rendimiento.</div>}
          {usuarioTipo === 'arbitro' && <div>Gestiona partidos y reglas. Califica la imparcialidad y dificultad de arbitrar.</div>}
          <div style={{ marginTop: 12 }}>
            <span style={{ fontWeight: 'bold' }}>Calificación: </span>
            {[1,2,3,4,5].map(v => (
              <span key={v} style={{ cursor: 'pointer', color: demoValoracion >= v ? '#FFD700' : '#555', fontSize: 22 }} onClick={() => setDemoValoracion(v)}>
                ★
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontWeight: 'bold' }}>Dificultad: </span>
            {['Fácil','Difícil','Muy Difícil'].map((n, i) => (
              <button key={i} style={{ background: demoDificultad === i+1 ? '#FFD700' : '#232323', color: demoDificultad === i+1 ? '#232323' : '#FFD700', border: '1px solid #FFD700', borderRadius: 8, marginRight: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setDemoDificultad(i+1)}>
                {n}
              </button>
            ))}
          </div>
          <button style={{ marginTop: 16, background: '#FFD700', color: '#232323', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }} onClick={guardarDemo}>Guardar calificación</button>
          {demoGuardado && <div style={{ color: '#FFD700', marginTop: 8 }}>¡Guardado en la base de datos!</div>}
        </div>
        {/* Estadísticas de valoraciones/dificultad por usuario */}
        <div style={{ background: '#232323', borderRadius: 12, padding: 18, marginBottom: 24 }}>
          <h3>Estadísticas de Valoraciones y Dificultad por Usuario</h3>
          {estadisticas && Object.entries(estadisticas).map(([usuario, stats]) => (
            <div key={usuario} style={{ marginBottom: 12 }}>
              <strong>{usuario}:</strong> Valoración promedio: {stats.valoraciones.length ? (stats.valoraciones.reduce((a,b)=>a+b,0)/stats.valoraciones.length).toFixed(2) : 'N/A'} | Dificultad promedio: {stats.dificultades.length ? (stats.dificultades.reduce((a,b)=>a+b,0)/stats.dificultades.length).toFixed(2) : 'N/A'}
            </div>
          ))}
          {!estadisticas && <div>No hay datos suficientes.</div>}
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Feed Social</h2>
        <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar publicación..." style={{ borderRadius: 8, padding: 8, marginBottom: 18 }} />
        {loading && <div style={{ color: '#FFD700' }}>Cargando...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {feedback && <div style={{ color: '#FFD700', marginBottom: 12 }}>{feedback}</div>}
        {!promocionando ? (
          <>
            <ListaPublicaciones
              publicaciones={filtrados}
              archivados={archivados}
              onEliminar={handleEliminar}
              onArchivar={handleArchivar}
              onPromocionar={handlePromocionar}
            />
          </>
        ) : (
          <PromocionarPost publicacion={promocionando} />
        )}
        <Button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '10px 18px', fontWeight: 'bold' }} onClick={() => setShowModal(true)}>Nueva publicación</Button>
        <FormNuevaPublicacion
          onCrear={(nuevo, resetNuevo) => {
            handleCrearCustom(nuevo, resetNuevo);
          }}
          loading={loading}
          feedback={feedback}
          show={showModal}
          onClose={() => setShowModal(false)}
          usuarioTipo={usuarioTipo}
        />
        <ModalDetallePublicacion detalle={detalle} onClose={() => setDetalle(null)} />
      </div>
    </div>
  );

  // Nueva función para manejar la creación desde el subcomponente
  async function handleCrearCustom(nuevo, resetNuevo) {
    if (!user) {
      setFeedback('Debes iniciar sesión para crear publicaciones.');
      return;
    }
    if (!nuevo.titulo || !nuevo.descripcion) {
      setFeedback('Completa todos los campos');
      return;
    }
    setLoading(true);
    setFeedback('');
    try {
      const { error } = await supabase.from('publicaciones').insert([
        { titulo: nuevo.titulo, descripcion: nuevo.descripcion, tipo: usuarioTipo, archivado: false, user_id: user.id }
      ]);
      if (error) throw error;
      setFeedback('¡Publicación creada!');
      resetNuevo({ titulo: '', descripcion: '' });
      setShowModal(false);
      cargarPublicaciones();
    } catch {
      setFeedback('Error al crear publicación');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(''), 2000);
    }
  }

}

