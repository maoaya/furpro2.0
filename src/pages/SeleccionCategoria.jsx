import React from 'react';
import { useNavigate } from 'react-router-dom';

const categorias = [
  { value: 'infantil_femenina', label: 'Infantil Femenina' },
  { value: 'infantil_masculina', label: 'Infantil Masculina' },
  { value: 'femenina', label: 'Femenina' },
  { value: 'masculina', label: 'Masculina' },
];

export default function SeleccionCategoria() {
  const navigate = useNavigate();

  const handleSelect = (value) => {
    // Redirige al registro con la categoría seleccionada en el estado y como querystring para deep-linking
    navigate(`/registro-nuevo?categoria=${encodeURIComponent(value)}`, {
      state: { categoria: value }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#121212', border: '2px solid #FFD700', borderRadius: 16, padding: 20 }}>
        <h1 style={{ color: '#FFD700', margin: 0, marginBottom: 8, textAlign: 'center' }}>Selecciona tu categoría</h1>
        <p style={{ color: '#bbb', marginTop: 0, textAlign: 'center' }}>Usaremos esta información para crear tu perfil, tu card y activar el autoguardado.</p>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {categorias.map((c) => (
            <button
              key={c.value}
              onClick={() => handleSelect(c.value)}
              style={{
                width: '100%',
                padding: 14,
                background: 'linear-gradient(135deg,#2a2a2a,#1a1a1a)',
                color: '#eee',
                border: '1px solid #333',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#FFD700', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
