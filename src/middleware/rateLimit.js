// Middleware básico de rate limit para Express
// Limita a 100 peticiones por IP cada 15 minutos

const rateLimitMap = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_REQUESTS = 100;

export function apiLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    entry = { count: 1, start: now };
    rateLimitMap.set(ip, entry);
  } else {
    entry.count++;
  }

  if (entry.count > MAX_REQUESTS) {
    res.status(429).json({ error: 'Demasiadas peticiones, intenta más tarde.' });
  } else {
    next();
  }
}
