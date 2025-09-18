// middleware/roles.js
// Middleware para validar roles

exports.requireOrganizer = (req, res, next) => {
  if (req.user && req.user.user_type === 'organizer') {
    return next();
  }
  return res.status(403).json({ error: 'Solo organizadores pueden realizar esta acción.' });
};

exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.user_type === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Solo administradores pueden realizar esta acción.' });
};
