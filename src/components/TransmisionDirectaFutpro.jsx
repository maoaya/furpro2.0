import React, { useState } from 'react';
import TransmitirPanel from './TransmitirPanel';
import PublicidadTira from './PublicidadTira';

const publicidadesEjemplo = [
  { marca: 'Nike', texto: '¡Descuentos en balones!', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { marca: 'Adidas', texto: 'Nueva camiseta oficial', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { marca: 'Gatorade', texto: 'Recarga tu energía', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Gatorade_logo.svg' }
];

const ComentariosPanel = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [likes, setLikes] = useState(0);
  const [balonFuego, setBalonFuego] = useState(0);

  const handleComentar = () => {
    if (nuevoComentario.trim()) {
      setComentarios([...comentarios, nuevoComentario]);
      setNuevoComentario('');
    }
  };

  return (
    <div style={{ background: '#181818', color: '#FFD700', padding: '1.5rem', borderRadius: '12px', maxWidth: '500px', margin: '2rem auto', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Comentarios</h3>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Escribe tu comentario..."
          value={nuevoComentario}
          onChange={e => setNuevoComentario(e.target.value)}
          style={{ width: '70%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #FFD700', marginRight: '8px', fontSize: '1rem' }}
        />
        <button
          style={{ background: '#FFD700', color: '#111', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
          onClick={handleComentar}
        >
          Comentar
        </button>
      </div>
      <ul>
        {comentarios.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <span style={{ marginRight: 16 }}>Likes: {likes}</span>
        <span>Balón de Fuego: {balonFuego}</span>
      </div>
    </div>
  );
};

const TransmisionDirectaFutpro = () => (
  <div>
    <TransmitirPanel />
    <PublicidadTira publicidades={publicidadesEjemplo} />
    <ComentariosPanel />
  </div>
);

export default TransmisionDirectaFutpro;
