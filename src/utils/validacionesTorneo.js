```javascript
// ...existing code...
export function validarTorneo(torneo) {
  if (!torneo.nombre || torneo.nombre.length < 3) return 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
  if (!torneo.fecha) return 'La fecha es obligatoria.';
  if (!['activo', 'finalizado', 'pendiente'].includes(torneo.estado)) return 'El estado no es válido.';
  return null;
}
// ...existing code...
```