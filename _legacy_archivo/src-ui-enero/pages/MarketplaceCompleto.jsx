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
  const [ciudad, setCiudad] = useState('');
  const [ordenar, setOrdenar] = useState('recientes');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [distanciaMax, setDistanciaMax] = useState(100); // km

  useEffect(() => {
    loadProductos();
    obtenerUbicacionUsuario();

    const channel = supabase
      .channel('marketplace:all')
      .on('postgres_changes', { event: '*', schema: 'api', table: 'products' }, () => {
        loadProductos();
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, [search, precioMin, precioMax, categoria, ciudad, ordenar]);

  const obtenerUbicacionUsuario = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLon(pos.coords.longitude);
        },
        (err) => console.log('Ubicación no disponible:', err.message)
      );
    }
  };

  const loadProductos = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*, seller:carfutpro!seller_id(nombre, apellido, avatar_url)')
        .eq('is_active', true);

      // Filtros de búsqueda
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
      }
      if (categoria !== 'todos') {
        query = query.eq('category', categoria);
      }
      if (ciudad.trim()) {
        query = query.ilike('city', `%${ciudad}%`);
      }
      if (precioMin > 0) {
        query = query.gte('price', precioMin);
      }
      if (precioMax < 10000) {
        query = query.lte('price', precioMax);
      }

      // Ordenamiento
      switch (ordenar) {
        case 'precio-bajo':
          query = query.order('price', { ascending: true });
          break;
        case 'precio-alto':
          query = query.order('price', { ascending: false });
          break;
        case 'popularidad':
          query = query.order('views', { ascending: false });
          break;
        case 'recientes':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      // Calcular distancia si hay ubicación del usuario
      let formatted = (data || []).map(item => ({
        id: item.id,
        titulo: item.title,
        descripcion: item.description,
        precio: item.price,
        imagen: item.images?.[0] || 'https://via.placeholder.com/300',
        categoria: item.category || 'equipamiento',
        ubicacion: item.location || item.city || 'Ubicación no especificada',
        ciudad: item.city,
        vendedor: {
          nombre: item.seller?.nombre ? `${item.seller.nombre} ${item.seller.apellido || ''}`.trim() : 'Vendedor',
          avatar: item.seller?.avatar_url || '👤',
          rating: 4.5
        },
        fecha: new Date(item.created_at),
        stock: item.stock || 0,
        views: item.views || 0,
        favorites: item.favorites || 0,
        latitude: item.latitude,
        longitude: item.longitude,
        distancia: null
      }));

      // Calcular distancia si ambas coordenadas existen
      if (userLat && userLon) {
        formatted = formatted.map(prod => {
          if (prod.latitude && prod.longitude) {
            const dist = calcularDistancia(userLat, userLon, prod.latitude, prod.longitude);
            return { ...prod, distancia: dist };
          }
          return prod;
        });

        // Filtrar por distancia máxima
        formatted = formatted.filter(p => !p.distancia || p.distancia <= distanciaMax);

        // Ordenar por distancia si se seleccionó
        if (ordenar === 'distancia') {
          formatted.sort((a, b) => (a.distancia || 999) - (b.distancia || 999));
        }
      }

      setProductos(formatted);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setProductos([]);
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
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
