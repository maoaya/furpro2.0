```javascript
// ...existing code...
export function validarPartido(partido) {
  if (!partido.equipo_local || !partido.equipo_visitante) return 'Ambos equipos son obligatorios.';
  if (!partido.fecha) return 'La fecha es obligatoria.';
  if (typeof partido.marcador_local !== 'number' || typeof partido.marcador_visitante !== 'number') return 'Los marcadores deben ser números.';
  return null;
}
// ...existing code...
```