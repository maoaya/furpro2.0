import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function ConfiguracionAvanzada() {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarConfig();
  }, []);

  const cargarConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('configuracion').select('*');
    if (error) setError(error.message);
    else setConfig(data);
    setLoading(false);
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', minHeight: '100vh', padding: 32 }}>
      <h2 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Configuración Avanzada</h2>
      {loading && <div style={{ color: '#FFD700' }}>Cargando configuración...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {config.map(c => (
          <li key={c.id} style={{ background: '#232323', borderRadius: 8, marginBottom: 18, padding: 18 }}>
            <div><strong>Clave:</strong> {c.clave}</div>
            <div><strong>Valor:</strong> {c.valor}</div>
            <div><strong>Descripción:</strong> {c.descripcion}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
