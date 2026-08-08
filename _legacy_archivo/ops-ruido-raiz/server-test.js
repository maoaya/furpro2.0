const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de testing y health check
app.get('/api/ping', (req, res) => {
  res.json({
    status: 'ok',
    message: 'pong',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint básico de ranking de jugadores (para testing)
app.get('/api/ranking/jugadores', (req, res) => {
  const { categoria, edadMin, edadMax, equipoId, limite = 20 } = req.query;
  
  // Datos de ejemplo para testing
  const jugadoresEjemplo = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      equipo_nombre: 'FC Barcelona',
      edad: 25,
      goles: 15,
      asistencias: 8,
      partidos_jugados: 22,
      ranking: 95.5
    },
    {
      id: 2,
      nombre: 'Carlos González',
      equipo_nombre: 'Real Madrid',
      edad: 28,
      goles: 12,
      asistencias: 10,
      partidos_jugados: 20,
      ranking: 87.3
    },
    {
      id: 3,
      nombre: 'Diego Martín',
      equipo_nombre: 'Atlético Madrid',
      edad: 22,
      goles: 8,
      asistencias: 5,
      partidos_jugados: 18,
      ranking: 78.9
    }
  ];

  let jugadoresFiltrados = jugadoresEjemplo;

  // Aplicar filtros
  if (categoria) {
    // Simular filtro por categoría
    jugadoresFiltrados = jugadoresFiltrados.filter(j => j.edad >= 18);
  }
  
  if (edadMin) {
    jugadoresFiltrados = jugadoresFiltrados.filter(j => j.edad >= parseInt(edadMin));
  }
  
  if (edadMax) {
    jugadoresFiltrados = jugadoresFiltrados.filter(j => j.edad <= parseInt(edadMax));
  }
  
  if (equipoId) {
    jugadoresFiltrados = jugadoresFiltrados.filter(j => j.id === parseInt(equipoId));
  }

  // Limitar resultados
  jugadoresFiltrados = jugadoresFiltrados.slice(0, parseInt(limite));

  res.json({
    status: 'ok',
    ranking: jugadoresFiltrados,
    total: jugadoresFiltrados.length
  });
});

// Endpoint básico de ranking de campeonatos (para testing)
app.get('/api/ranking/campeonatos', (req, res) => {
  const { categoria, estado, fechaInicioDesde, fechaInicioHasta, limite = 20 } = req.query;
  
  // Datos de ejemplo para testing
  const campeonatosEjemplo = [
    {
      id: 1,
      nombre: 'Liga Profesional 2025',
      categoria: 'Primera División',
      estado: 'activo',
      fecha_inicio: '2025-03-01',
      fecha_fin: '2025-12-15',
      total_equipos: 20,
      total_partidos: 380,
      total_visualizaciones: 25000,
      ranking: 94.7
    },
    {
      id: 2,
      nombre: 'Copa Nacional Sub-20',
      categoria: 'Sub-20',
      estado: 'finalizado',
      fecha_inicio: '2025-01-15',
      fecha_fin: '2025-06-30',
      total_equipos: 16,
      total_partidos: 64,
      total_visualizaciones: 8500,
      ranking: 82.1
    },
    {
      id: 3,
      nombre: 'Torneo Regional',
      categoria: 'Amateur',
      estado: 'programado',
      fecha_inicio: '2025-10-01',
      fecha_fin: null,
      total_equipos: 12,
      total_partidos: 0,
      total_visualizaciones: 0,
      ranking: 65.0
    }
  ];

  let campeonatosFiltrados = campeonatosEjemplo;

  // Aplicar filtros
  if (categoria) {
    campeonatosFiltrados = campeonatosFiltrados.filter(c => 
      c.categoria.toLowerCase().includes(categoria.toLowerCase())
    );
  }
  
  if (estado) {
    campeonatosFiltrados = campeonatosFiltrados.filter(c => c.estado === estado);
  }
  
  if (fechaInicioDesde) {
    campeonatosFiltrados = campeonatosFiltrados.filter(c => 
      new Date(c.fecha_inicio) >= new Date(fechaInicioDesde)
    );
  }
  
  if (fechaInicioHasta) {
    campeonatosFiltrados = campeonatosFiltrados.filter(c => 
      new Date(c.fecha_inicio) <= new Date(fechaInicioHasta)
    );
  }

  // Limitar resultados
  campeonatosFiltrados = campeonatosFiltrados.slice(0, parseInt(limite));

  res.json({
    status: 'ok',
    ranking: campeonatosFiltrados,
    total: campeonatosFiltrados.length
  });
});

// Endpoints adicionales usados por tests
app.get('/api/ranking/gender', (req, res) => {
  const gender = (req.query.gender || 'masculino').toString();
  res.json({ status: 'ok', ranking: [{ id: 1, gender, puntos: 50 }] });
});

app.get('/api/ranking/age', (req, res) => {
  const range = (req.query.range || 'infantil').toString();
  res.json({ status: 'ok', ranking: [{ id: 1, range, puntos: 30 }] });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  // marcar next como usado sin invocarlo
  void next;
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado'
  });
});

// Iniciar servidor solo si se ejecuta directamente (no en tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor de testing corriendo en puerto ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/ping`);
    console.log(`📊 Ranking jugadores: http://localhost:${PORT}/api/ranking/jugadores`);
    console.log(`🏆 Ranking campeonatos: http://localhost:${PORT}/api/ranking/campeonatos`);
  });
}

module.exports = app;