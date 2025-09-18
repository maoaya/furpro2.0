import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransmisionDirectaFutpro from '../components/TransmisionDirectaFutpro';
import supabase from '../supabaseClient';

export default function MarketplacePage() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('marketplace')
                    .select('*')
                    .order('fecha', { ascending: false });
                if (!mounted) return;
                if (error) setError(error.message);
                else setProductos(data || []);
            } catch (e) {
                if (mounted) setError(String(e.message || e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleContactarVendedor = (vendedorId) => {
        navigate(`/chat/${vendedorId}`);
    };

    if (loading) return <div className="loader" />;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div className="marketplace-page" style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: '32px' }}>
            <h2><i className="fas fa-fire"></i> Ven On Fire - Marketplace FutPro</h2>
            <p style={{ color: '#fff', marginBottom: '24px' }}>Descubre lo que venden otros usuarios en tu zona: camisetas, balones, accesorios, servicios y más.</p>
            <div className="productos-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                {productos && productos.length > 0 ? (
                    productos.map((prod) => (
                        <div key={prod.id} className="producto-card" style={{ background: '#232323', border: '2px solid #FFD700', borderRadius: '12px', padding: '18px', width: '260px' }}>
                            <img src={prod.imagen} alt={prod.titulo} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                            <h3 style={{ color: '#FFD700' }}>{prod.titulo}</h3>
                            <p style={{ color: '#fff' }}>{prod.descripcion}</p>
                            <div style={{ margin: '12px 0', fontWeight: 'bold', color: '#FFD700' }}>Precio: ${prod.precio}</div>
                            <button className="btn btn-primary" style={{ background: '#FFD700', color: '#181818', width: '100%' }} onClick={() => handleContactarVendedor(prod.vendedorId)}>Contactar vendedor</button>
                        </div>
                    ))
                ) : (
                    <div className="marketplace-empty">No hay productos publicados aún.</div>
                )}
            </div>
            <button style={{ marginTop: 32, background: '#FFD700', color: '#181818', padding: '12px 32px', borderRadius: '8px', fontWeight: 'bold' }} onClick={() => navigate('/')}>Ir al inicio</button>
            <TransmisionDirectaFutpro />
        </div>
    );
}
