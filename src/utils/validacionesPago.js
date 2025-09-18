```javascript
// ...existing code...
export function validarPago(pago) {
  if (!pago.usuario) return 'El usuario es obligatorio.';
  if (typeof pago.monto !== 'number' || pago.monto <= 0) return 'El monto debe ser un número positivo.';
  if (!pago.fecha) return 'La fecha es obligatoria.';
  return null;
}
// ...existing code...
```