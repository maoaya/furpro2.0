import React, { useEffect, useState } from 'react';

// Cambia la URL según tu entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://futpro.vip/api';

export default function SugerenciasVideos({ usuarioId, videoId, edad }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuarioId || !videoId || !edad) return;
    setLoading(true);
    fetch(`${API_URL}/sugerencias?usuarioId=${usuarioId}&videoId=${videoId}&edad=${edad}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setSugerencias(data.sugerencias);
          setError('');
        } else {
          setError(data.error || 'Error al obtener sugerencias');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo conectar al backend');
        setLoading(false);
      });
  }, [usuarioId, videoId, edad]);

  if (loading) return <div>Cargando sugerencias...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!sugerencias.length) return <div>No hay sugerencias disponibles.</div>;

  return (
    <div>
      <h3>Sugerencias para ti</h3>
      <ul>
        {sugerencias.map(video => (
          <li key={video.id}>
            <strong>{video.titulo}</strong> (Edad: {video.edad})<br />
            Categoría: {video.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}
