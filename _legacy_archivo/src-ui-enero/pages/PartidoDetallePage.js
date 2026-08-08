import React, { useState } from 'react';
import ComentariosPartido from '../components/ComentariosPartido';
import LikeButton from '../components/LikeButton';

const partidoMock = {
  id: 1,
  equipoA: 'Tigres',
  equipoB: 'Leones',
  fecha: '2025-08-24',
  likes: 10,
  comentarios: [
    { usuario: 'Juan', texto: '¡Gran partido!' },
    { usuario: 'Maria', texto: 'Muy emocionante.' }
  ]
};

function PartidoDetallePage() {
  const [likes, setLikes] = useState(partidoMock.likes);
  const [comentarios, setComentarios] = useState(partidoMock.comentarios);

  const handleLike = () => setLikes((l) => l + 1);
  const handleComentar = (usuario, texto) => setComentarios((prev) => [...prev, { usuario, texto }]);

  return (
    <div className="partido-detalle-page">
      <h2>Partido: {partidoMock.equipoA} vs {partidoMock.equipoB}</h2>
      <p>Fecha: {partidoMock.fecha}</p>
      <LikeButton likes={likes} onLike={handleLike} />
      <ComentariosPartido partidoId={partidoMock.id} comentarios={comentarios} onComentar={handleComentar} />
    </div>
  );
}

export default PartidoDetallePage;
