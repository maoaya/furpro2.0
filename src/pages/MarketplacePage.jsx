// import supabase from '../supabaseClient';

// Ejemplo de borrado y tiempo real para marketplace
// const handleBorrarJugador = async (id) => { /* ... */ };
// const handleBorrarEquipo = async (id) => { /* ... */ };

// React.useEffect(() => {
//   // Suscripción a cambios en marketplace
// }, []);

import React, { useState } from 'react';

export default function MarketplacePage() {
  const [productos, setProductos] = useState(() => {
    return JSON.parse(localStorage.getItem('marketplace') || '[]');
  });
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '', descripcion: '', imagen: '' });
  const [preview, setPreview] = useState('');
  const [filtro, setFiltro] = useState('');
  const [detalle, setDetalle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPago, setShowPago] = useState(false);
  const [pago, setPago] = useState({ metodo: '', monto: '' });
  const [pagoFeedback, setPagoFeedback] = useState('');

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = e => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.precio) return;
    const producto = { ...nuevo, imagen: preview, id: Date.now() };
    const nuevos = [producto, ...productos];
    setProductos(nuevos);
    localStorage.setItem('marketplace', JSON.stringify(nuevos));
    setNuevo({ nombre: '', precio: '', descripcion: '', imagen: '' });
    setPreview('');
  };

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));

  // Compartir producto
  const [copiadoId, setCopiadoId] = useState(null);
  const urlProducto = id => `${window.location.origin}/marketplace/${id}`;
  const handleCompartir = async (producto) => {
    const url = urlProducto(producto.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: producto.nombre,
          text: producto.descripcion,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopiadoId(producto.id);
      setTimeout(() => setCopiadoId(null), 1500);
    }
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', paddingBottom: 90 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#181818', borderBottom: '2px solid #FFD700', padding: '18px 32px', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontWeight: 'bold', fontSize: 28 }}>Marketplace</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar producto..." style={{ padding: 6, borderRadius: 8, border: '1px solid #FFD700', background: '#181818', color: '#FFD700', fontSize: 15, width: 140 }} />
          <button style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: 26, cursor: 'pointer' }} title="Notificaciones">
            <span role="img" aria-label="notificaciones">🔔</span>
          </button>
        </div>
      </header>
      <div style={{ margin: '32px 0', textAlign: 'center' }}>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '14px 32px', fontWeight: 'bold', fontSize: 20, cursor: 'pointer', marginRight: 24 }}>Vender producto</button>
        <button onClick={() => setShowPago(true)} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '14px 32px', fontWeight: 'bold', fontSize: 20, cursor: 'pointer' }}>Pagar publicidad</button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} style={{ background: '#232323', borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center', maxWidth: 900, margin: 'auto' }}>
          <input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre del producto" style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700' }} />
          <input name="precio" value={nuevo.precio} onChange={handleChange} placeholder="Precio" style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700', width: 90 }} />
          <input name="descripcion" value={nuevo.descripcion} onChange={handleChange} placeholder="Descripción" style={{ padding: 8, borderRadius: 6, border: '1px solid #FFD700', width: 180 }} />
          <input type="file" accept="image/*" onChange={handleFile} />
          {preview && <img src={preview} alt="preview" style={{ width: 60, borderRadius: 8 }} />}
          <button type="submit" style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Publicar</button>
        </form>
      )}
      {showPago && (
        <div style={{ background: '#232323', borderRadius: 12, padding: 32, margin: 'auto', maxWidth: 400, color: '#FFD700', marginBottom: 32 }}>
          <h3 style={{ marginBottom: 18 }}>Pagar Publicidad</h3>
          <label>Método de pago:<br />
            <select value={pago.metodo} onChange={e => setPago({ ...pago, metodo: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }}>
              <option value="">Selecciona</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="paypal">PayPal</option>
              <option value="efectivo">Efectivo</option>
            </select>
          </label>
          <label>Monto:<br />
            <input value={pago.monto} onChange={e => setPago({ ...pago, monto: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, marginBottom: 12 }} placeholder="$" />
          </label>
          <button onClick={() => { setPagoFeedback('¡Pago simulado exitoso!'); setTimeout(() => { setPagoFeedback(''); setShowPago(false); }, 1500); }} style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 18 }}>Pagar</button>
          <button onClick={() => setShowPago(false)} style={{ background: 'none', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 28px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', marginTop: 18, marginLeft: 12 }}>Cancelar</button>
          {pagoFeedback && <div style={{ color: '#FFD700', marginTop: 16 }}>{pagoFeedback}</div>}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {filtrados.length === 0 && <div>No hay productos publicados.</div>}
        {filtrados.map(p => (
          <div key={p.id} style={{ background: '#232323', borderRadius: 12, padding: 16, width: 220, boxShadow: '0 2px 12px #FFD70033' }}>
            {p.imagen && <img src={p.imagen} alt={p.nombre} style={{ width: '100%', borderRadius: 8, marginBottom: 8, border: '2px solid #FFD700' }} />}
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{p.nombre}</div>
            <div style={{ color: '#FFD700cc', fontSize: 15, margin: '6px 0' }}>{p.descripcion}</div>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>Precio: ${p.precio}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setDetalle(p)}>Ver</button>
              <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleCompartir(p)}>Compartir</button>
            </div>
            <div style={{ fontSize: 12, color: '#FFD70099', marginTop: 4 }}>
              URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlProducto(p.id)}</span>
              {copiadoId === p.id && <span style={{ color: '#FFD700', marginLeft: 8 }}>¡Enlace copiado!</span>}
            </div>
          </div>
        ))}
      </div>
      {detalle && (
        <div style={{ background: '#232323', color: '#FFD700', borderRadius: 12, padding: 32, marginTop: 24, boxShadow: '0 2px 12px #FFD70033' }}>
          <h3>Detalle de Producto</h3>
          {detalle.imagen && <img src={detalle.imagen} alt={detalle.nombre} style={{ width: 120, borderRadius: 8, marginBottom: 12, border: '2px solid #FFD700' }} />}
          <div><strong>Nombre:</strong> {detalle.nombre}</div>
          <div><strong>Precio:</strong> ${detalle.precio}</div>
          <div><strong>Descripción:</strong> {detalle.descripcion}</div>
          <div style={{ fontSize: 13, color: '#FFD70099', margin: '10px 0' }}>URL: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{urlProducto(detalle.id)}</span></div>
          <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12, cursor: 'pointer' }} onClick={() => handleCompartir(detalle)}>Compartir</button>
          {copiadoId === detalle.id && <span style={{ color: '#FFD700', marginLeft: 8 }}>¡Enlace copiado!</span>}
          <button style={{ background: '#FFD700', color: '#181818', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', marginTop: 12, marginLeft: 12, cursor: 'pointer' }} onClick={() => setDetalle(null)}>Cerrar</button>
        </div>
      )}
      {/* Barra de navegación inferior fija */}
      <nav style={{ position: 'fixed', left: 0, bottom: 0, width: '100vw', background: '#181818', borderTop: '2px solid #FFD700', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 64, zIndex: 30 }}>
        <a href="/" style={{ color: '#FFD700', textDecoration: 'none', fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span role="img" aria-label="home">🏠</span>
          <span style={{ fontSize: 12 }}>Home</span>
        </a>
        <a href="/marketplace" style={{ color: '#FFD700', textDecoration: 'none', fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span role="img" aria-label="ofertas">💼</span>
          <span style={{ fontSize: 12 }}>Marketplace</span>
        </a>
        <a href="/streaming" style={{ color: '#FFD700', textDecoration: 'none', fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span role="img" aria-label="tv">📺</span>
          <span style={{ fontSize: 12 }}>TV</span>
        </a>
        <a href="/calendario" style={{ color: '#FFD700', textDecoration: 'none', fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span role="img" aria-label="calendario">📅</span>
          <span style={{ fontSize: 12 }}>Calendario</span>
        </a>
      </nav>
    </div>
  );
}
