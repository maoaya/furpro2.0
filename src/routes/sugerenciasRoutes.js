import express from 'express';
import obtenerSugerencias from '../services/sugerenciasService.js';
import db from '../config/db.js'; // Ajusta la ruta según tu config de base de datos

const router = express.Router();

// Endpoint: GET /api/sugerencias?usuarioId=1&videoId=10&edad=25
router.get('/sugerencias', async (req, res) => {
  try {
    const usuarioId = parseInt(req.query.usuarioId, 10);
    const videoId = parseInt(req.query.videoId, 10);
    const edadUsuario = parseInt(req.query.edad, 10);
    if (!usuarioId || !videoId || !edadUsuario) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }
    const sugerencias = await obtenerSugerencias(db, usuarioId, videoId, edadUsuario);
    res.json({ status: 'ok', sugerencias });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

export default router;
