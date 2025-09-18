// controllers/tournamentController.js
const Tournament = require('../models/Tournament');
// const { requireOrganizer } = require('../middleware/roles');

exports.createTournament = async (req, res) => {
  res.status(200).json({});
};
// Crear torneo
exports.createTournament = async (req, res) => {
  try {
    const { name, type, startDate, endDate } = req.body;
    if (!name || !type || !startDate || !endDate) {
      return res.status(400).json({ error: 'Faltan datos del torneo' });
    }
    const organizer_id = req.user?._id || req.user?.id;
    if (!organizer_id) return res.status(401).json({ error: 'No autenticado' });
    const tournament = await Tournament.create({ name, type, startDate, endDate, organizer_id });
    res.status(201).json({ tournament });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar torneos organizados por el usuario
exports.getMyTournaments = async (req, res) => {
  res.status(200).json([]);
};
// Listar torneos organizados por el usuario
exports.getMyTournaments = async (req, res) => {
  try {
    const organizer_id = req.user?._id || req.user?.id;
    if (!organizer_id) return res.status(401).json({ error: 'No autenticado' });
    const tournaments = await Tournament.find({ organizer_id });
    res.status(200).json({ tournaments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar torneo
exports.updateTournament = async (req, res) => {
  res.status(200).json({ updated: true });
};
// Editar torneo
exports.updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, startDate, endDate } = req.body;
    const organizer_id = req.user?._id || req.user?.id;
    const tournament = await Tournament.findOneAndUpdate(
      { _id: id, organizer_id },
      { name, type, startDate, endDate },
      { new: true }
    );
    if (!tournament) return res.status(404).json({ error: 'Torneo no encontrado o no autorizado' });
    res.status(200).json({ tournament });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar torneo
exports.deleteTournament = async (req, res) => {
  res.status(200).json({ deleted: true });
};
// Eliminar torneo
exports.deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const organizer_id = req.user?._id || req.user?.id;
    const tournament = await Tournament.findOneAndDelete({ _id: id, organizer_id });
    if (!tournament) return res.status(404).json({ error: 'Torneo no encontrado o no autorizado' });
    res.status(200).json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos los torneos (admin o público)
exports.getAllTournaments = async (req, res) => {
  res.status(200).json([]);
};
// Listar todos los torneos (admin o público)
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json({ tournaments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
