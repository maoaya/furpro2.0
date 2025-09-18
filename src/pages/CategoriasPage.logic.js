// Lógica de categorías: ejemplo de datos y funciones
export const categorias = [
  { id: 1, nombre: "Ropa" },
  { id: 2, nombre: "Calzado" },
  { id: 3, nombre: "Accesorios" }
];

export function agregarCategoria(nuevo) {
  categorias.push(nuevo);
}
