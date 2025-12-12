import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function MarketplaceCompleto() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(10000);
  const [categoria, setCategoria] = useState('todos');
  const [ubicacion, setUbicacion] = useState('todos');
  const [ordenar, setOrdenar] = useState('recientes');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProductos();

    // Suscripción realtime para nuevos productos y cambios en stock
    const channel = supabase
      .channel('marketplace:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_items' }, () => {
        loadProductos();
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, []);

  const loadProductos = async () => {
    try {
      // Intentar cargar desde Supabase primero
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setProductos(data.map(item => ({
          id: item.id,
          titulo: item.name || item.title,
          descripcion: item.description,
          precio: item.price,
          imagen: item.image_url || 'https://via.placeholder.com/300',
          categoria: item.category || 'equipamiento',
          ubicacion: item.location || 'Ubicación no especificada',
          vendedor: {
            nombre: item.seller_name || 'Vendedor',
            avatar: '👤',
            rating: 4.5
          },
          fecha: new Date(item.created_at),
          stock: item.stock || 1
        })));
        return;
      }
    } catch (err) {
      console.log('Tabla marketplace_items no existe, usando datos de ejemplo');
    }

    // Fallback: Productos de ejemplo
    const productosData = [
      {
        id: 1,
        titulo: 'Botines Nike Mercurial',
        descripcion: 'Talla 42, muy buen estado, poco uso',
        precio: 8500,
        imagen: 'https://picsum.photos/300/300?random=1',
        categoria: 'calzado',
        ubicacion: 'Barcelona',
        vendedor: {
          nombre: 'Lucia Martínez',
          avatar: '👤',
          rating: 4.8
        },
        fecha: new Date('2024-12-10')
      },
      {
        id: 2,
        titulo: 'Pelota Adidas',
        descripcion: 'Pelota oficial de fútbol 11',
        precio: 3200,
        imagen: 'https://picsum.photos/300/300?random=2',
        categoria: 'equipamiento',
        ubicacion: 'Madrid',
        vendedor: {
          nombre: 'Carlos FC',
          avatar: '👤',
          rating: 4.5
        },
        fecha: new Date('2024-12-11')
      },
      {
        id: 3,
        titulo: 'Camiseta FC Barcelona',
        descripcion: 'Original 2023/24, talla M',
        precio: 6500,
        imagen: 'https://picsum.photos/300/300?random=3',
        categoria: 'ropa',
        ubicacion: 'Barcelona',
        vendedor: {
          nombre: 'Team Lions',
          avatar: '🦁',
          rating: 5.0
        },
        fecha: new Date('2024-12-09')
      },
      {
        id: 4,
        titulo: 'Espinilleras Puma',
        descripcion: 'Nuevas, sin uso',
        precio: 1500,
        imagen: 'https://picsum.photos/300/300?random=4',
        categoria: 'proteccion',
        ubicacion: 'Valencia',
        vendedor: {
          nombre: 'Sofia López',
          avatar: '👤',
          rating: 4.2
        },
        fecha: new Date('2024-12-12')
      },
      {
        id: 5,
        titulo: 'Guantes de portero Adidas',
        descripcion: 'Talla 9, excelente agarre',
        precio: 4200,
        imagen: 'https://picsum.photos/300/300?random=5',
        categoria: 'equipamiento',
        ubicacion: 'Sevilla',
        vendedor: {
          nombre: 'Mateo García',
          avatar: '👤',
          rating: 4.7
        },
        fecha: new Date('2024-12-08')
      },
      {
        id: 6,
        titulo: 'Bolsa deportiva Nike',
        descripcion: 'Grande, con compartimentos',
        precio: 2800,
        imagen: 'https://picsum.photos/300/300?random=6',
        categoria: 'accesorios',
        ubicacion: 'Barcelona',
        vendedor: {
          nombre: 'Ana Rodríguez',
          avatar: '👤',
          rating: 4.9
        },
        fecha: new Date('2024-12-11')
      }
    ];

    setProductos(productosData);
  };

  const filteredProductos = productos.filter(p => {
    const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase()) ||
                       p.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchPrecio = p.precio >= precioMin && p.precio <= precioMax;
    const matchCategoria = categoria === 'todos' || p.categoria === categoria;
    const matchUbicacion = ubicacion === 'todos' || p.ubicacion === ubicacion;

    return matchSearch && matchPrecio && matchCategoria && matchUbicacion;
  }).sort((a, b) => {
    if (ordenar === 'precio_asc') return a.precio - b.precio;
    if (ordenar === 'precio_desc') return b.precio - a.precio;
    if (ordenar === 'recientes') return b.fecha - a.fecha;
    return 0;
  });

  const handleContactar = (producto) => {
    navigate(`/chat?user=${producto.vendedor.nombre}`);
  };

  const handleComprar = (producto) => {
    alert(`Iniciar proceso de compra de: ${producto.titulo}`);
    // Implementar Stripe/proceso de pago
  };

  return (
    <div style={styles.container}>
      {/* Header con búsqueda */}
      <div style={styles.header}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <button 
          style={styles.filterBtn}
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filtros
        </button>
        <button 
          style={styles.sellBtn}
          onClick={() => navigate('/crear-producto')}
        >
          ➕ Vender
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Precio</label>
            <div style={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min"
                value={precioMin}
                onChange={e => setPrecioMin(Number(e.target.value))}
                style={styles.priceInput}
              />
              <span style={styles.separator}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={precioMax}
                onChange={e => setPrecioMax(Number(e.target.value))}
                style={styles.priceInput}
              />
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Categoría</label>
            <select 
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              style={styles.select}
            >
              <option value="todos">Todas</option>
              <option value="calzado">Calzado</option>
              <option value="ropa">Ropa</option>
              <option value="equipamiento">Equipamiento</option>
              <option value="proteccion">Protección</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Ubicación</label>
            <select 
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              style={styles.select}
            >
              <option value="todos">Todas</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Madrid">Madrid</option>
              <option value="Valencia">Valencia</option>
              <option value="Sevilla">Sevilla</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Ordenar por</label>
            <select 
              value={ordenar}
              onChange={e => setOrdenar(e.target.value)}
              style={styles.select}
            >
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid de productos */}
      <div style={styles.grid}>
        {filteredProductos.map(producto => (
          <div 
            key={producto.id} 
            style={styles.card}
            onClick={() => setSelectedProduct(producto)}
          >
            <div style={styles.imageContainer}>
              <img src={producto.imagen} alt={producto.titulo} style={styles.image} />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.titulo}>{producto.titulo}</h3>
              <p style={styles.descripcion}>{producto.descripcion}</p>
              <div style={styles.precio}>${producto.precio}</div>
              <div style={styles.ubicacionBadge}>📍 {producto.ubicacion}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredProductos.length === 0 && (
        <div style={styles.empty}>
          <p>No se encontraron productos</p>
        </div>
      )}

      {/* Modal detalle producto */}
      {selectedProduct && (
        <div style={styles.modal} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              style={styles.closeBtn}
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <img 
              src={selectedProduct.imagen} 
              alt={selectedProduct.titulo} 
              style={styles.modalImage} 
            />

            <div style={styles.modalBody}>
              <h2 style={styles.modalTitulo}>{selectedProduct.titulo}</h2>
              <div style={styles.modalPrecio}>${selectedProduct.precio}</div>
              
              <p style={styles.modalDescripcion}>{selectedProduct.descripcion}</p>

              <div style={styles.vendedorInfo}>
                <div style={styles.vendedorAvatar}>{selectedProduct.vendedor.avatar}</div>
                <div>
                  <div style={styles.vendedorNombre}>{selectedProduct.vendedor.nombre}</div>
                  <div style={styles.vendedorRating}>⭐ {selectedProduct.vendedor.rating}</div>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button 
                  style={styles.btnContactar}
                  onClick={() => handleContactar(selectedProduct)}
                >
                  💬 Contactar vendedor
                </button>
                <button 
                  style={styles.btnComprar}
                  onClick={() => handleComprar(selectedProduct)}
                >
                  💳 Comprar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    paddingBottom: 80
  },
  header: {
    padding: 16,
    background: '#1a1a1a',
    display: 'flex',
    gap: 8,
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  searchInput: {
    flex: 1,
    padding: 12,
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14
  },
  filterBtn: {
    padding: '12px 16px',
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer'
  },
  sellBtn: {
    padding: '12px 16px',
    background: '#FFD700',
    border: 'none',
    borderRadius: 8,
    color: '#0a0a0a',
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer'
  },
  filtersPanel: {
    padding: 16,
    background: '#1a1a1a',
    borderBottom: '1px solid #333'
  },
  filterGroup: {
    marginBottom: 16
  },
  filterLabel: {
    display: 'block',
    marginBottom: 8,
    fontSize: 12,
    color: '#aaa',
    fontWeight: 'bold'
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  priceInput: {
    flex: 1,
    padding: 8,
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14
  },
  separator: {
    color: '#aaa'
  },
  select: {
    width: '100%',
    padding: 12,
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 8,
    padding: 8
  },
  card: {
    background: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    cursor: 'pointer'
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: '100%',
    background: '#2a2a2a'
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardContent: {
    padding: 12
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  descripcion: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4
  },
  ubicacionBadge: {
    fontSize: 11,
    color: '#888'
  },
  empty: {
    textAlign: 'center',
    padding: 64,
    color: '#aaa'
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 16
  },
  modalContent: {
    background: '#1a1a1a',
    borderRadius: 16,
    maxWidth: 500,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: '#fff',
    fontSize: 20,
    cursor: 'pointer',
    zIndex: 10
  },
  modalImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover'
  },
  modalBody: {
    padding: 24
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  modalPrecio: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16
  },
  modalDescripcion: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 1.5,
    marginBottom: 24
  },
  vendedorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    background: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 24
  },
  vendedorAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24
  },
  vendedorNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  vendedorRating: {
    fontSize: 12,
    color: '#FFD700'
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  btnContactar: {
    padding: 16,
    background: 'transparent',
    border: '2px solid #FFD700',
    borderRadius: 12,
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnComprar: {
    padding: 16,
    background: '#FFD700',
    border: 'none',
    borderRadius: 12,
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
