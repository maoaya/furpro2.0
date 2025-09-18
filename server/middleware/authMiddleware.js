// Middleware de autenticación y autorización por rol/permisos
const jwt = require('jsonwebtoken');
const roles = {
  organizador: ['media:upload', 'media:view', 'chat:all', 'stream:start', 'stream:view', 'moderate'],
  jugador: ['media:view', 'chat:all', 'stream:view'],
  staff: ['media:view', 'chat:staff', 'stream:view'],
  espectador: ['media:view', 'chat:general', 'stream:view']
};

function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  // Permitir token de prueba en entorno de test
  if (token === 'TOKEN_DE_PRUEBA' && process.env.NODE_ENV === 'test') {
    req.user = {
      id: 1,
      role: 'organizador',
      email: 'test@futpro.com',
      nombre: 'Test User'
    };
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(permission) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles[role]?.includes(permission)) {
      return res.status(403).json({ error: 'No permission' });
    }
    next();
  };
}

module.exports = { authenticate, authorize, requireAuth: authenticate };
