// routes/tournamentRoutes.js
const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { requireOrganizer } = require('../middleware/roles');

// Crear torneo (solo organizador)
router.post('/', requireOrganizer, tournamentController.createTournament);
// Listar torneos del organizador
router.get('/mine', requireOrganizer, tournamentController.getMyTournaments);
// Editar torneo (solo organizador)
router.put('/:id', requireOrganizer, tournamentController.updateTournament);
// Eliminar torneo (solo organizador)
router.delete('/:id', requireOrganizer, tournamentController.deleteTournament);
// Listar todos los torneos (público o admin)
router.get('/', tournamentController.getAllTournaments);

module.exports = router;
