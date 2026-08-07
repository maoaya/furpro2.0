import React from 'react';
import { useNavigate } from 'react-router-dom';

const gold = '#FFD700';
const dark = '#141414';

/**
 * Franja "Mercado de fichajes" en Home — CTA a /marketplace|/mercado
 */
export default function HomeMercadoFichajes({ productos = [], loading = false, schemaUnavailable = false }) {
  const navigate = useNavigate();

  return (
    <section
      aria-label="Mercado de fichajes"
      style={{
        marginBottom: 28,
        border: `1px solid ${gold}55`,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #12100a 0%, #1a1a1a 55%, #0d0d0d 100%)',
        padding: '14px 14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ color: gold, fontWeight: 800, fontSize: 15, letterSpacing: 0.2 }}>
            Mercado de fichajes
          </div>
          <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
            Ofertas y productos destacados
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          style={{
            background: gold,
            color: '#0a0a0a',
            border: 'none',
            borderRadius: 10,
            padding: '8px 12px',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Ver mercado
        </button>
      </div>

      {loading && (
        <div style={{ color: '#888', fontSize: 13, padding: '8px 0' }}>Cargando ofertas…</div>
      )}

      {!loading && schemaUnavailable && (
        <div style={{ color: '#888', fontSize: 13, padding: '8px 0' }}>
          Mercado temporalmente no disponible. Prueba más tarde.
        </div>
      )}

      {!loading && !schemaUnavailable && productos.length === 0 && (
        <div style={{ color: '#888', fontSize: 13, padding: '8px 0' }}>
          No hay ofertas activas ahora. Sé el primero en publicar.
          <button
            type="button"
            onClick={() => navigate('/marketplace')}
            style={{
              display: 'block',
              marginTop: 10,
              background: 'transparent',
              border: `1px solid ${gold}`,
              color: gold,
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Ir al marketplace
          </button>
        </div>
      )}

      {!loading && productos.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 4,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {productos.map((p) => {
            const img = Array.isArray(p.images) ? p.images[0] : (p.image || p.images);
            const price = p.price != null ? `$${p.price} ${p.currency || 'USD'}` : 'Consultar';
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate('/marketplace')}
                style={{
                  flex: '0 0 148px',
                  textAlign: 'left',
                  background: dark,
                  border: `1px solid ${gold}33`,
                  borderRadius: 12,
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <div
                  style={{
                    height: 88,
                    background: `#222 url(${img || ''}) center/cover no-repeat`,
                  }}
                />
                <div style={{ padding: '8px 10px 10px' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: gold,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.title || 'Oferta'}
                  </div>
                  <div style={{ fontSize: 11, color: '#ccc', marginTop: 2 }}>{price}</div>
                  <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>
                    {p.category || p.city || p.location || 'Fichaje'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
