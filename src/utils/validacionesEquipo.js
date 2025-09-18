```javascript
// ...existing code...
export function validarEquipo(equipo) {
  if (!equipo.nombre || equipo.nombre.length < 3) return 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
  if (!equipo.ciudad || equipo.ciudad.length < 3) return 'La ciudad es obligatoria y debe tener al menos 3 caracteres.';
  return null;
}
// ...existing code...
```