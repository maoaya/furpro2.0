import React, { useState } from 'react';
import supabase from '../supabaseClient';

const CATEGORIAS = [
  {
    nombre: 'Seguridad/Login',
    funciones: [
      { schema: 'public', name: 'es_usuario_bloqueado' },
      { schema: 'public', name: 'verificar_intentos_login' },
      { schema: 'public', name: 'registrar_intento_fallido' },
      { schema: 'public', name: 'escanear_palabras_prohibidas' }
    ]
  },
  {
    nombre: 'Publicaciones',
    funciones: [
      { schema: 'public', name: 'incrementar_likes_publicacion' },
      { schema: 'public', name: 'decrementar_likes_publicacion' },
      { schema: 'public', name: 'incrementar_comentarios_publicacion' },
      { schema: 'public', name: 'decrementar_comentarios_publicacion' }
    ]
  },
  {
    nombre: 'Cards/Tiers',
    funciones: [
      { schema: 'public', name: 'calcular_tier_card' },
      { schema: 'public', name: 'agregar_puntos_jugador' },
      { schema: 'public', name: 'agregar_puntos_card' },
      { schema: 'public', name: 'actualizar_card_tier' },
      { schema: 'public', name: 'obtener_puntos_jugador' },
      { schema: 'public', name: 'calcular_progreso_tier' },
      { schema: 'public', name: 'puede_subir_tier' }
    ]
  },
  {
    nombre: 'Equipos',
    funciones: [
      { schema: 'public', name: 'auto_add_team_captain' },
      { schema: 'public', name: 'validate_lineup_size' },
      { schema: 'public', name: 'get_available_players' },
      { schema: 'public', name: 'actualizar_fans_count' },
      { schema: 'public', name: 'calcular_puntaje_equipo' },
      { schema: 'public', name: 'obtener_card_equipo_completa' }
    ]
  },
  {
    nombre: 'Moderación',
    funciones: [
      { schema: 'moderation_content', name: 'advanced_check_forbidden' },
      { schema: 'moderation_content', name: 'add_forbidden_word' },
      { schema: 'moderation_content', name: 'log_incident' }
    ]
  },
  {
    nombre: 'Actividad/Tracking',
    funciones: [
      { schema: 'public', name: 'get_user_activity_stats' },
      { schema: 'public', name: 'get_user_activity_timeline' },
      { schema: 'public', name: 'cleanup_old_activities' }
    ]
  },
  {
    nombre: 'Verificación Sistema',
    funciones: [
      { schema: 'public', name: 'verificar_tabla_existe' },
      { schema: 'public', name: 'verificar_funcion_existe' },
      { schema: 'public', name: 'verificar_rls_activo' },
      { schema: 'public', name: 'obtener_estado_sistema' },
      { schema: 'public', name: 'generar_reporte_completo' }
    ]
  }
];

// Funciones de lectura seguras para probar con parámetros
const PRUEBAS_FUNCIONALES = [
  {
    categoria: 'Cards',
    nombre: 'calcular_tier_card',
    params: { puntos: 150 },
    esperado: 'bronce'
  },
  {
    categoria: 'Tablas',
    nombre: 'verificar_tabla_existe',
    params: { p_schema: 'public', p_tabla: 'carfutpro' },
    esperado: 'existe: true'
  },
  {
    categoria: 'Tablas',
    nombre: 'verificar_tabla_existe',
    params: { p_schema: 'api', p_tabla: 'usuarios' },
    esperado: 'existe: true'
  }
];

const TABLAS_RLS = [
  { schema: 'public', tabla: 'carfutpro' },
  { schema: 'public', tabla: 'usuarios' },
  { schema: 'public', tabla: 'equipos' },
  { schema: 'public', tabla: 'posts' },
  { schema: 'public', tabla: 'friends' },
  { schema: 'public', tabla: 'card_player' }
];

export default function DiagnosticoFunciones() {
  const [estadoSistema, setEstadoSistema] = useState([]);
  const [resultados, setResultados] = useState({});
  const [pruebasFuncionales, setPruebasFuncionales] = useState([]);
  const [estadoRLS, setEstadoRLS] = useState([]);
  const [probados, setProbados] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Resumen de páginas: qué está y qué falta (alto nivel)
  const PAGINAS_RESUMEN = [
    {
      pagina: 'HomePage',
      listo: ['Feed con posts', 'Followers/Sugeridos', 'Realtime posts/likes/comments', 'Subir stories', 'Búsqueda general'],
      falta: ['Unificar likes vs post_likes', 'Normalizar notifications/notificaciones', 'Paginación y estados vacíos']
    },
    {
      pagina: 'PerfilInstagram',
      listo: ['Perfil tipo feed', 'Posts usuario', 'Followers/Following'],
      falta: ['Consolidar friends vs amigos', 'Paginación/infinitescroll', 'Manejo de errores visible']
    },
    {
      pagina: 'Perfil',
      listo: ['Datos usuario', 'Equipos/Torneos asociados', 'Posts del usuario'],
      falta: ['Unificar users vs usuarios', 'Edición validada', 'Consistencia de avatar']
    },
    {
      pagina: 'CrearEquipo',
      listo: ['Creación de equipo', 'Subida de media', 'Inserción en teams'],
      falta: ['RLS de teams', 'Validación de duplicados', 'Roles/captain']
    },
    {
      pagina: 'Torneos/TorneoDetalle',
      listo: ['Detalle de torneo', 'Equipos', 'Partidos', 'CRUD parcial'],
      falta: ['Políticas organizadores', 'Reglas de actualización/borrado seguro']
    },
    {
      pagina: 'PartidoDetalle',
      listo: ['Consulta y eliminación de partido'],
      falta: ['RLS para DELETE', 'Auditoría de cambios']
    },
    {
      pagina: 'Media/MediaDetalle',
      listo: ['Listado y borrado de media'],
      falta: ['Bucket storage y RLS consistente']
    },
    {
      pagina: 'Marketplace',
      listo: ['Productos destacados', 'Ordenación', 'Sugerencias al feed'],
      falta: ['Unificar products vs marketplace/orders', 'RLS de vendedores', 'Estados de pago']
    },
    {
      pagina: 'Chat/Soporte',
      listo: ['Lectura e inserción de mensajes/soporte'],
      falta: ['Realtime de grupos', 'Permisos por grupo', 'Tipado de mensajes']
    },
    {
      pagina: 'VideosFeed',
      listo: ['Feed de video', 'Friends→Posts→Card', 'Livestreams'],
      falta: ['Normalizar livestreams/transmisiones', 'Reproductor mejorado']
    },
    {
      pagina: 'Notificaciones',
      listo: ['Lectura/gestión básica'],
      falta: ['Unificación notifications/notificaciones', 'Contador unread consistente']
    },
    {
      pagina: 'Amigos',
      listo: ['Listado, follow/unfollow'],
      falta: ['Unificar friends/amigos en una fuente', 'Vistas o alias si se necesitan ambos']
    }
  ];

  // Tablas referenciadas y duplicados a consolidar
  const TABLAS_REFERENCIADAS = [
    { grupo: 'Usuarios/Perfiles', tablas: ['usuarios', 'users', 'carfutpro', 'avatars', 'user_points', 'user_cards'] },
    { grupo: 'Social/Feed', tablas: ['posts', 'likes', 'post_likes', 'comments', 'stories', 'feed', 'promociones'] },
    { grupo: 'Relaciones', tablas: ['friends', 'api.friends', 'amigos'] },
    { grupo: 'Notificaciones', tablas: ['notifications', 'notificaciones'] },
    { grupo: 'Equipos/Torneos/Partidos', tablas: ['equipos', 'teams', 'torneos', 'tournaments', 'partidos'] },
    { grupo: 'Media/Contenido', tablas: ['media', 'formularios'] },
    { grupo: 'Chat/Mensajes', tablas: ['chat_groups', 'group_locations', 'messages', 'mensajes', 'user_locations'] },
    { grupo: 'Marketplace/Lives', tablas: ['products', 'marketplace', 'marketplace_orders', 'livestreams', 'transmisiones', 'live_streams'] },
    { grupo: 'Moderación/Reportes', tablas: ['reportes', 'reportes_generales', 'reportes_moderacion', 'contenido_revisar', 'apelaciones_sancion'] },
    { grupo: 'Tracking/Analytics', tablas: ['user_activities', 'api.user_activities', 'analytics_events'] }
  ];

  const verificarFuncion = async (schema, nombre) => {
    try {
      const proc = `${schema}.verificar_funcion_existe`;
      const { data, error } = await supabase.rpc(proc, { p_schema: schema, p_funcion: nombre });
      if (error) {
        return { existe: false, detalle: error.message };
      }
      const existe = Array.isArray(data) ? (data[0]?.existe ?? false) : !!data?.existe;
      return { existe: !!existe, detalle: 'OK' };
    } catch (e) {
      return { existe: false, detalle: e.message };
    }
  };

  const ejecutarDiagnostico = async () => {
    setCargando(true);
    setProbados(false);
    const acumulado = {};

    // 1) Estado general (public.obtener_estado_sistema)
    try {
      const { data, error } = await supabase.rpc('obtener_estado_sistema');
      if (!error) setEstadoSistema(Array.isArray(data) ? data : []);
    } catch (_) {}

    // 2) Verificar funciones por categorías
    for (const cat of CATEGORIAS) {
      acumulado[cat.nombre] = {};
      for (const f of cat.funciones) {
        const res = await verificarFuncion(f.schema, f.name);
        acumulado[cat.nombre][`${f.schema}.${f.name}`] = res;
      }
    }
    setResultados(acumulado);

    // 3) Pruebas funcionales con parámetros
    const resPruebas = [];
    for (const prueba of PRUEBAS_FUNCIONALES) {
      try {
        const { data, error } = await supabase.rpc(prueba.nombre, prueba.params);
        resPruebas.push({
          ...prueba,
          exito: !error,
          resultado: error ? error.message : JSON.stringify(data).substring(0, 100),
          data
        });
      } catch (e) {
        resPruebas.push({ ...prueba, exito: false, resultado: e.message });
      }
    }
    setPruebasFuncionales(resPruebas);

    // 4) Verificar RLS por tabla
    const rlsEstados = [];
    for (const t of TABLAS_RLS) {
      try {
        const { data, error } = await supabase.rpc('verificar_rls_activo', {
          p_schema: t.schema,
          p_tabla: t.tabla
        });
        if (!error && data && data.length > 0) {
          const row = data[0];
          rlsEstados.push({
            tabla: `${t.schema}.${t.tabla}`,
            rls_activo: row.rls_activo ?? false,
            policies_count: row.policies_count ?? 0
          });
        } else {
          rlsEstados.push({ tabla: `${t.schema}.${t.tabla}`, rls_activo: false, policies_count: 0 });
        }
      } catch (_) {
        rlsEstados.push({ tabla: `${t.schema}.${t.tabla}`, rls_activo: false, policies_count: 0 });
      }
    }
    setEstadoRLS(rlsEstados);

    setProbados(true);
    setCargando(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: 24 }}>
      <h1 style={{ color: '#FFD700' }}>🧪 Diagnóstico de Funciones SQL</h1>
      <p style={{ color: '#ccc' }}>Verifica existencia y estado de funciones clave en Supabase.</p>

      <button
        onClick={ejecutarDiagnostico}
        disabled={cargando}
        style={{
          background: cargando ? '#666' : 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#000', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 800,
          cursor: cargando ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,215,0,0.3)'
        }}
      >{cargando ? '⏳ Verificando...' : '▶ Ejecutar diagnóstico'}</button>

      {estadoSistema.length > 0 && (
        <div style={{ marginTop: 20, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
          <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>Estado General del Sistema</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {estadoSistema.map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: 6 }}>
                <span style={{ color: '#ccc' }}>{row.componente}</span>
                <span style={{ color: row.estado?.startsWith('✅') ? '#00ff88' : '#ff3366' }}>{row.estado}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {probados && (
        <div style={{ marginTop: 20 }}>
          {Object.entries(resultados).map(([categoria, funcs]) => (
            <div key={categoria} style={{ marginBottom: 16, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
              <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>{categoria}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {Object.entries(funcs).map(([fname, res]) => (
                  <div key={fname} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc' }}>{fname}</span>
                    <span style={{ color: res.existe ? '#00ff88' : '#ff3366' }}>{res.existe ? '✅ Existe' : '❌ No existe'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {pruebasFuncionales.length > 0 && (
        <div style={{ marginTop: 20, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
          <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>Pruebas Funcionales (con parámetros)</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {pruebasFuncionales.map((p, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #222', paddingBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#ccc', fontWeight: 600 }}>{p.nombre}()</span>
                  <span style={{ color: p.exito ? '#00ff88' : '#ff3366' }}>{p.exito ? '✅ OK' : '❌ Error'}</span>
                </div>
                <div style={{ fontSize: 11, color: '#666' }}>Params: {JSON.stringify(p.params)}</div>
                <div style={{ fontSize: 11, color: '#888' }}>Resultado: {p.resultado}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {estadoRLS.length > 0 && (
        <div style={{ marginTop: 20, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
          <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>Estado RLS por Tabla</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {estadoRLS.map((r, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: 6 }}>
                <span style={{ color: '#ccc' }}>{r.tabla}</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ color: r.rls_activo ? '#00ff88' : '#ff3366' }}>
                    RLS: {r.rls_activo ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                  <span style={{ color: r.policies_count > 0 ? '#00ccff' : '#888' }}>
                    Políticas: {r.policies_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de páginas: lo que está y lo que falta */}
      <div style={{ marginTop: 20, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
        <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>Diagnóstico de Páginas (Lo que está vs Lo que falta)</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {PAGINAS_RESUMEN.map((p) => (
            <div key={p.pagina} style={{ borderBottom: '1px solid #222', paddingBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#ccc', fontWeight: 700 }}>{p.pagina}</span>
                <span style={{ color: '#00ccff' }}>Estado</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ color: '#00ff88', fontWeight: 600, marginBottom: 4 }}>✅ Ya está</div>
                  <ul style={{ marginLeft: 16 }}>
                    {p.listo.map((l, idx) => (
                      <li key={idx} style={{ color: '#9fd9b3', fontSize: 13 }}>{l}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ color: '#ffcc00', fontWeight: 600, marginBottom: 4 }}>🧩 Falta</div>
                  <ul style={{ marginLeft: 16 }}>
                    {p.falta.map((f, idx) => (
                      <li key={idx} style={{ color: '#e7d796', fontSize: 13 }}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablas referenciadas y duplicados */}
      <div style={{ marginTop: 20, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
        <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>Tablas Referenciadas y Duplicados</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {TABLAS_REFERENCIADAS.map((g, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid #222', paddingBottom: 8 }}>
              <div style={{ color: '#ccc', fontWeight: 600, marginBottom: 6 }}>{g.grupo}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {g.tablas.map((t) => (
                  <span key={t} style={{ background: '#222', color: '#ddd', padding: '4px 8px', borderRadius: 6, border: '1px solid #333' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>Sugerencia: elegir estándar (ej. inglés en public) y exponer VIEWS en api para compatibilidad.</div>
      </div>

      {/* Enlaces a documentación generada */}
      <div style={{ marginTop: 20, background: '#111', border: '1px solid #333', borderRadius: 12, padding: 12 }}>
        <div style={{ color: '#FFD700', fontWeight: 700, marginBottom: 8 }}>Documentación Relacionada</div>
        <ul style={{ marginLeft: 16 }}>
          <li style={{ color: '#9ac7ff' }}>INVENTARIO_SQL_FUNCIONES.md</li>
          <li style={{ color: '#9ac7ff' }}>GUIA_CORRECCION_ERRORES.md</li>
          <li style={{ color: '#9ac7ff' }}>FIX_HOMEPAGE_TRACKING_ERRORS.sql</li>
        </ul>
        <div style={{ color: '#888', fontSize: 12, marginTop: 6 }}>Abre estos archivos en el repo para detalles.</div>
      </div>

      <div style={{ marginTop: 24, color: '#888', fontSize: 12 }}>
        Nota: Esta verificación usa funciones de sistema sin efectos secundarios. Las pruebas funcionales validan firmas y ejecución básica.
      </div>
    </div>
  );
}
