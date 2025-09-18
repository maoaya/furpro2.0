import express from 'express';
import { obtenerRankingJugadores, actualizarRankingJugador } from '../services/rankingJugadoresService.js';
import { obtenerRankingCampeonatos, actualizarRankingCampeonato } from '../services/rankingCampeonatosService.js';
import db from '../config/db.js';

const router = express.Router();

// Endpoint: GET /api/ranking/jugadores?categoria=sub20&edadMin=18&edadMax=25&equipoId=5&limite=10
router.get('/ranking/jugadores', async (req, res) => {
  try {
    const filtros = {
      categoria: req.query.categoria,
      edadMin: req.query.edadMin ? parseInt(req.query.edadMin) : null,
      edadMax: req.query.edadMax ? parseInt(req.query.edadMax) : null,
      equipoId: req.query.equipoId ? parseInt(req.query.equipoId) : null,
      equipos: req.query.equipos ? req.query.equipos.split(',').map(id => parseInt(id)) : null,
      limite: req.query.limite ? parseInt(req.query.limite) : 50
    };

    const ranking = await obtenerRankingJugadores(db, filtros);
    res.json({ status: 'ok', ranking });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Endpoint: GET /api/ranking/campeonatos?categoria=profesional&estado=activo&limite=20
router.get('/ranking/campeonatos', async (req, res) => {
  try {
    const filtros = {
      categoria: req.query.categoria,
      estado: req.query.estado,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      limite: req.query.limite ? parseInt(req.query.limite) : 50
    };

    const ranking = await obtenerRankingCampeonatos(db, filtros);
    res.json({ status: 'ok', ranking });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Endpoint: POST /api/ranking/jugadores/:id/actualizar
router.post('/ranking/jugadores/:id/actualizar', async (req, res) => {
  try {
    const jugadorId = parseInt(req.params.id);
    await actualizarRankingJugador(db, jugadorId);
    res.json({ status: 'ok', message: 'Ranking actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Endpoint: POST /api/ranking/campeonatos/:id/actualizar
router.post('/ranking/campeonatos/:id/actualizar', async (req, res) => {
  try {
    const campeonatoId = parseInt(req.params.id);
    await actualizarRankingCampeonato(db, campeonatoId);
    res.json({ status: 'ok', message: 'Ranking actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

export default router;