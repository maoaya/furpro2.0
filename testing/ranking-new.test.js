const request = require('supertest');
const app = require('../server-test.js');

describe('API Ranking Tests', () => {
  
  describe('GET /api/ping', () => {
    test('debería responder con status 200 y datos correctos', async () => {
      const res = await request(app)
        .get('/api/ping')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'pong');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version', '1.0.0');
      
      // Verificar que timestamp es una fecha válida
      expect(new Date(res.body.timestamp)).toBeInstanceOf(Date);
      expect(new Date(res.body.timestamp).getTime()).not.toBeNaN();
    });

    test('debería responder rápidamente', async () => {
      const start = Date.now();
      await request(app)
        .get('/api/ping')
        .expect(200);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(200);
    });
  });

  describe('GET /api/ranking/jugadores', () => {
    test('debería devolver lista de jugadores sin filtros', async () => {
      const res = await request(app)
        .get('/api/ranking/jugadores')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('ranking');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.ranking)).toBe(true);
      expect(res.body.ranking.length).toBeGreaterThan(0);
      
      // Verificar estructura de cada jugador
      const jugador = res.body.ranking[0];
      expect(jugador).toHaveProperty('id');
      expect(jugador).toHaveProperty('nombre');
      expect(jugador).toHaveProperty('equipo_nombre');
      expect(jugador).toHaveProperty('edad');
      expect(jugador).toHaveProperty('goles');
      expect(jugador).toHaveProperty('asistencias');
      expect(jugador).toHaveProperty('partidos_jugados');
      expect(jugador).toHaveProperty('ranking');
    });

    test('debería filtrar por edad mínima', async () => {
      const res = await request(app)
        .get('/api/ranking/jugadores?edadMin=25')
        .expect(200);

      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.ranking)).toBe(true);
      
      // Verificar que todos los jugadores tienen edad >= 25
      res.body.ranking.forEach(jugador => {
        expect(jugador.edad).toBeGreaterThanOrEqual(25);
      });
    });

    test('debería limitar resultados', async () => {
      const res = await request(app)
        .get('/api/ranking/jugadores?limite=2')
        .expect(200);

      expect(res.body.status).toBe('ok');
      expect(res.body.ranking.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/ranking/campeonatos', () => {
    test('debería devolver lista de campeonatos sin filtros', async () => {
      const res = await request(app)
        .get('/api/ranking/campeonatos')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('ranking');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.ranking)).toBe(true);
      expect(res.body.ranking.length).toBeGreaterThan(0);
      
      // Verificar estructura de cada campeonato
      const campeonato = res.body.ranking[0];
      expect(campeonato).toHaveProperty('id');
      expect(campeonato).toHaveProperty('nombre');
      expect(campeonato).toHaveProperty('categoria');
      expect(campeonato).toHaveProperty('estado');
      expect(campeonato).toHaveProperty('fecha_inicio');
      expect(campeonato).toHaveProperty('total_equipos');
      expect(campeonato).toHaveProperty('total_partidos');
      expect(campeonato).toHaveProperty('total_visualizaciones');
      expect(campeonato).toHaveProperty('ranking');
    });

    test('debería filtrar por estado', async () => {
      const res = await request(app)
        .get('/api/ranking/campeonatos?estado=activo')
        .expect(200);

      expect(res.body.status).toBe('ok');
      
      // Verificar que todos los campeonatos tienen estado 'activo'
      res.body.ranking.forEach(campeonato => {
        expect(campeonato.estado).toBe('activo');
      });
    });

    test('debería limitar resultados', async () => {
      const res = await request(app)
        .get('/api/ranking/campeonatos?limite=2')
        .expect(200);

      expect(res.body.status).toBe('ok');
      expect(res.body.ranking.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Error Handling', () => {
    test('debería devolver 404 para rutas no existentes', async () => {
      const res = await request(app)
        .get('/api/ruta-inexistente')
        .expect(404);

      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('message', 'Endpoint no encontrado');
    });

    test('debería manejar parámetros inválidos graciosamente', async () => {
      const res = await request(app)
        .get('/api/ranking/jugadores?edadMin=abc&limite=xyz')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('ranking');
    });
  });
});