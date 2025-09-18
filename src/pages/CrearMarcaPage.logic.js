// Lógica de marcas: ejemplo de datos y funciones
export const marcas = [
  { id: 1, nombre: "Nike" },
  { id: 2, nombre: "Adidas" },
  { id: 3, nombre: "Puma" }
];

export function agregarMarca(nuevo) {
  marcas.push(nuevo);
}
