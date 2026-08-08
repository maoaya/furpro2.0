// Removed unused import and duplicate component/export
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
      <div style={{ marginBottom: '1rem' }}>
        {comentarios.length === 0 ? (
          <div style={{ color: '#888' }}>No hay comentarios aún.</div>
        ) : (
          comentarios.map((c, idx) => (
            <div key={idx} style={{ background: '#222', color: '#FFD700', borderRadius: '6px', padding: '0.5rem', marginBottom: '6px' }}>{c}</div>
          ))
        )}
      </div>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => setLikes(likes + 1)} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer' }}>
          <i className="fas fa-thumbs-up"></i> {likes}
        </button>
        <button onClick={() => setBalonFuego(balonFuego + 1)} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '1.5rem', cursor: 'pointer' }}>
          <i className="fas fa-futbol"></i><span style={{ color: 'red', marginLeft: '4px', fontWeight: 'bold' }}>🔥</span> {balonFuego}
        </button>
      </div>
    </div>
  );
};

const TransmisionDirectaFutpro = () => {
  const [transmitiendo, setTransmitiendo] = useState(false);
  const [enlace, setEnlace] = useState('');

  const iniciar = () => {
    setTransmitiendo(true);
    setEnlace('https://futpro.live/stream/12345');
  };
  const finalizar = () => {
    setTransmitiendo(false);
    setEnlace('');
  };
  const compartir = () => {
    if (enlace) window.alert('Enlace copiado: ' + enlace);
  };

  return (
    <div>
      <div style={{ padding: 32, maxWidth: 500, margin: 'auto' }}>
        <h2>Transmisión Directa FutPro</h2>
        <div style={{ marginBottom: 16 }}>
          {!transmitiendo ? (
            <button onClick={iniciar} style={{ padding: '8px 16px' }}>Iniciar transmisión</button>
          ) : (
            <>
              <button onClick={finalizar} style={{ padding: '8px 16px', marginRight: 8 }}>Finalizar transmisión</button>
              <button onClick={compartir} style={{ padding: '8px 16px' }}>Compartir enlace</button>
              <div style={{ marginTop: 16 }}>
                <b>Enlace de transmisión:</b> <span>{enlace}</span>
              </div>
            </>
          )}
        </div>
        <p>{transmitiendo ? 'Transmisión en curso...' : 'No hay transmisión activa.'}</p>
      </div>
      <TransmitirPanel />
      <ComentariosPanel />
      <PublicidadTira publicidades={publicidadesEjemplo} />
    </div>
  );
};

export default TransmisionDirectaFutpro;
