```javascript
// ...existing code...
export function validarReporteModeracion(reporte) {
  if (!reporte.usuario) return 'El usuario es obligatorio.';
  if (!reporte.motivo || reporte.motivo.length < 3) return 'El motivo es obligatorio y debe tener al menos 3 caracteres.';
  if (!['pendiente', 'resuelto', 'rechazado'].includes(reporte.estado)) return 'El estado no es válido.';
  return null;
}
// ...existing code...
```