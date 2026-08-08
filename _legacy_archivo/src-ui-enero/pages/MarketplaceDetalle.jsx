import React from 'react';

const productosDemo = [
  { id: 1, nombre: 'Camiseta FutPro', precio: 25, disponible: true, opiniones: 4.5 },
  { id: 2, nombre: 'Balón Oficial', precio: 40, disponible: false, opiniones: 4.8 },
];

export default function MarketplaceDetalle() {
  const producto = productosDemo[0];
  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: 32, borderRadius: 16, maxWidth: 700, margin: 'auto' }}>
      <h2>Detalle de Producto/Servicio</h2>
      <div><strong>Nombre:</strong> {producto.nombre}</div>
      <div><strong>Precio:</strong> ${producto.precio}</div>
      <div><strong>Disponibilidad:</strong> {producto.disponible ? 'Disponible' : 'Agotado'}</div>
      <div><strong>Opiniones:</strong> {producto.opiniones} ⭐</div>
      <div style={{ marginTop: 18 }}>
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginRight: 8 }}>Comprar</button>
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginRight: 8 }}>Agregar a favoritos</button>
        <button style={{ background: '#FFD700', color: '#181818', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold' }}>Contactar vendedor</button>
      </div>
    </div>
  );
}
