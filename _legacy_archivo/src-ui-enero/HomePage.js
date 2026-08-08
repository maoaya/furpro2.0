import React, { useState, useEffect } from 'react';
import mediaService from './services/mediaService';
import LikeButton from './components/LikeButton';

const likeTypes = [
  { key: 'fire', label: 'Balón de fuego' },
  { key: 'ball', label: 'Balón normal' },
  { key: 'deflated', label: 'Balón desinflado' }
];

function HomePage() {
  const [gallery, setGallery] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('total');
  const [showTop, setShowTop] = useState(false);
  const TOP_N = 5;

  useEffect(() => {
    mediaService.getGallery().then(setGallery);
  }, []);

  // Filtrar y ordenar
  const filteredGallery = gallery.filter(item => {
    if (filterType === 'all') return true;
    return item.likes && item.likes[filterType] > 0;
  });

  const sortedGallery = [...filteredGallery].sort((a, b) => {
    if (sortType === 'total') {
      const totalA = Object.values(a.likes || {}).reduce((acc, v) => acc + v, 0);
      const totalB = Object.values(b.likes || {}).reduce((acc, v) => acc + v, 0);
      return totalB - totalA;
    } else {
      return (b.likes?.[sortType] || 0) - (a.likes?.[sortType] || 0);
    }
  });

  const galleryToShow = showTop ? sortedGallery.slice(0, TOP_N) : sortedGallery;

  const handleReport = (mediaId) => {
    void mediaId; // marcar arg como usado
    // Aquí iría la lógica real de reporte
    alert('¡Contenido reportado!');
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Página de Inicio</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <label>Filtrar por tipo de like: </label>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">Todos</option>
          {likeTypes.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
        <label>Ordenar por: </label>
        <select value={sortType} onChange={e => setSortType(e.target.value)}>
          <option value="total">Total de likes</option>
          {likeTypes.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
        <label>
          <input type="checkbox" checked={showTop} onChange={e => setShowTop(e.target.checked)} /> Mostrar solo Top {TOP_N}
        </label>
      </div>
      <div className="gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {galleryToShow.map(item => (
          <div key={item.id} className="media-item" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #ccc', padding: 16, textAlign: 'center', position: 'relative' }}>
            <img src={item.url} alt={item.title} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{item.title}</div>
            <div style={{ marginBottom: 8 }}>
              {likeTypes.map(t => (
                <span key={t.key} style={{ marginRight: 8, fontSize: 14 }}>
                  {t.label}: <b>{item.likes && item.likes[t.key] ? item.likes[t.key] : 0}</b>
                </span>
              ))}
            </div>
            <LikeButton mediaId={item.id} />
            <button onClick={() => handleReport(item.id)} style={{ position: 'absolute', top: 8, right: 8, background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>Reportar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;