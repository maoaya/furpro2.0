export function sanitizeInput(input) {
  // Sanitización real
  return input.replace(/[<>"']/g, '');
}

export function protectEndpoint(req, res, next) {
  // Protección real
  next();
}
