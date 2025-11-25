import React, { useEffect, useState } from 'react';
import { MarketplaceService } from '../services/MarketplaceService';

export default function Marketplace() {
  const [productos, setProductos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    MarketplaceService.getProductos().then(setProductos);
  }, []);

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const nuevo = { titulo, descripcion, precio: parseFloat(precio) };
      await MarketplaceService.crearProducto(nuevo);
      setTitulo(''); setDescripcion(''); setPrecio('');
      const actualizados = await MarketplaceService.getProductos();
      setProductos(actualizados);
    } catch (err) {
      setError('Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0002' }}>
      <h1 style={{ color: '#FFD700', textAlign: 'center' }}>Marketplace</h1>
      <form onSubmit={handleCrearProducto} style={{ marginBottom: 24 }}>
        <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#232323', padding: '8px 16px', borderRadius: 8 }}>Publicar producto</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {productos.map(p => (
          <li key={p.id} style={{ background: '#232323', color: '#FFD700', marginBottom: 12, borderRadius: 8, padding: 12 }}>
            <strong>{p.titulo}</strong> - ${p.precio}
            <div>{p.descripcion}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
