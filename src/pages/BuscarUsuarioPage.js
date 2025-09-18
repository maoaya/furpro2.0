// (Removed duplicate and incomplete component and export statements)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import NotificacionesPanel from '../components/NotificacionesPanel';
import CampanasPanel from '../components/CampanasPanel';
import ProgramacionPanel from '../components/ProgramacionPanel';
import RankingEstadisticasPanel from '../components/RankingEstadisticasPanel';
import PagosPanel from '../components/PagosPanel';
import ModeracionPanel from '../components/ModeracionPanel';
import MarketplacePanel from '../components/MarketplacePanel';
import TransmisionesPanel from '../components/TransmisionesPanel';
import ConfiguracionPanel from '../components/ConfiguracionPanel';
import SocialPanel from '../components/SocialPanel';

const PAGE_SIZE = 10;

export default function BuscarUsuarioPage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [rol, setRol] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  async function handleBuscar(e) {
    if (e) e.preventDefault();
    // Búsqueda real en Supabase con filtros y paginación
    const from = (pagina - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let queryBuilder = supabase
      .from('usuarios')
      .select('id, nombre, usuario, fotoPerfil, ciudad, rol', { count: 'exact' })
      .ilike('nombre', `%${query}%`);
    if (ciudad) queryBuilder = queryBuilder.eq('ciudad', ciudad);
    if (rol) queryBuilder = queryBuilder.eq('rol', rol);
    const { data, error, count } = await queryBuilder.range(from, to);
    if (!error) {
      setResultados(data);
      setTotal(count || 0);
    } else {
      setResultados([]);
      setTotal(0);
    }
  }

  function handleClickPerfil(id) {
    navigate(`/perfil/${id}`);
  }
  function handlePaginaChange(delta) {
    setPagina(p => Math.max(1, p + delta));
  }
  // Fetch results when page, city, role, or query changes
  useEffect(() => {
    handleBuscar();
    // eslint-disable-next-line
  }, [pagina, ciudad, rol, query]);

  // Simulación de datos para los paneles (reemplaza por datos reales)
  const notificaciones = [{ mensaje: 'Nuevo mensaje de Juan', fecha: '23/08/2025' }];
  const campanas = [{ titulo: 'Promo Premium', fecha: '22/08/2025' }];
  const partidos = [{ equipoA: 'FutPro FC', equipoB: 'Madrid United', fecha: '24/08/2025' }];
  const estadisticas = { data: [], options: {} };
  const pagos = [{ descripcion: 'Suscripción Premium', monto: 9.99 }];
  const reportes = [{ motivo: 'Spam', fecha: '21/08/2025' }];
  const productos = [{ nombre: 'Camiseta FutPro', precio: 29.99 }];
  const transmisiones = [{ titulo: 'Final en vivo', fecha: '23/08/2025' }];
  const usuario = { nombre: 'Demo', email: 'demo@futpro.com', privacidad: false, redes: [{ nombre: 'Instagram', usuario: '@futpro' }] };

  return (
    <div style={{ maxWidth: 600, margin: '32px auto' }}>
      <h2>Buscar usuario</h2>
      <form onSubmit={handleBuscar} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Nombre, usuario, email..."
          style={{ padding: '8px', width: '60%' }}
        />
        <select value={ciudad} onChange={e => setCiudad(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="">Ciudad</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          {/* Agrega más ciudades según tu base */}
        </select>
        <select value={rol} onChange={e => setRol(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="">Rol</option>
          <option value="Jugador">Jugador</option>
          {/* Agrega más roles si es necesario */}
        </select>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {resultados.map(u => (
          <li key={u.id} style={{ marginBottom: 12, background: '#f7f7f7', borderRadius: 8, padding: 12, cursor: 'pointer' }} onClick={() => handleClickPerfil(u.id)}>
            <img src={u.fotoPerfil || 'https://via.placeholder.com/40'} alt={u.nombre} style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12, verticalAlign: 'middle' }} />
            <span style={{ fontWeight: 'bold', color: '#222' }}>{u.nombre}</span>
            <span style={{ color: '#FFD700', marginLeft: 8 }}>@{u.usuario}</span>
            <span style={{ marginLeft: 8, color: '#555' }}>{u.ciudad}</span>
            <span style={{ marginLeft: 8, color: '#222', fontWeight: 'bold' }}>{u.rol}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" onClick={() => handlePaginaChange(-1)} disabled={pagina === 1}>Anterior</button>
        <span>Página {pagina} / {Math.ceil(total / PAGE_SIZE) || 1}</span>
        <button type="button" onClick={() => handlePaginaChange(1)} disabled={pagina * PAGE_SIZE >= total}>Siguiente</button>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Integración con otros módulos</h3>
        <p>Puedes filtrar y navegar a perfiles de jugadores, organizadores, árbitros, etc. desde aquí y conectar con módulos de equipos, torneos y ranking.</p>
      </div>
      {/* Paneles integrados */}
      <NotificacionesPanel notificaciones={notificaciones} />
      <CampanasPanel campanas={campanas} />
      <ProgramacionPanel partidos={partidos} />
      <RankingEstadisticasPanel estadisticas={estadisticas} />
      <PagosPanel pagos={pagos} />
      <ModeracionPanel reportes={reportes} />
      <MarketplacePanel productos={productos} />
      <TransmisionesPanel transmisiones={transmisiones} />
      <ConfiguracionPanel usuario={usuario} />
      <SocialPanel usuario={usuario} />
    </div>
  );
}
