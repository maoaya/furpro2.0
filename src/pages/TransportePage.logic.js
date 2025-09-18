// Lógica de transporte: ejemplo de datos y funciones
export const transportes = [
  { id: 1, nombre: "Bus", capacidad: 50 },
  { id: 2, nombre: "Van", capacidad: 15 },
  { id: 3, nombre: "Auto", capacidad: 4 }
];

export function agregarTransporte(nuevo) {
  transportes.push(nuevo);
}
