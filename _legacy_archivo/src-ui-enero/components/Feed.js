import React, { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';
import SkeletonFeed from './SkeletonFeed';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(false);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const feedRef = useRef();

  useEffect(() => {
    // Simular fetch de datos
    setTimeout(() => {
      const mock = [
        { id: 1, titulo: 'Golazo', descripcion: 'Tremendo gol desde fuera del área', imageUrl: 'https://via.placeholder.com/600x400' },
        { id: 2, titulo: 'Tapada', descripcion: 'Atajada espectacular del portero', imageUrl: 'https://via.placeholder.com/600x400' }
      ];
      setPosts(mock);
      setLoading(false);
    }, 1200);
  }, []);

  // Swipe vertical
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    let startY = null;
    const handleTouchStart = e => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = e => {
      if (startY === null) return;
      const endY = e.changedTouches[0].clientY;
      if (endY < startY - 50 && current < filteredItems.length - 1) setCurrent(c => c + 1);
      if (endY > startY + 50 && current > 0) setCurrent(c => c - 1);
      startY = null;
    };
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [current, posts.length, search]);

  const filteredItems = posts?.filter(item =>
    (item.titulo?.toLowerCase().includes(search.toLowerCase()) ||
     item.descripcion?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <SkeletonFeed />;
  if (error) return <div className="error">Error cargando el feed.</div>;
  if (!filteredItems.length) return <div className="empty">No hay publicaciones.</div>;

  return (
    <div ref={feedRef} className="feed-vertical" style={{height:'100vh',overflow:'hidden',background:'#181818'}}>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar usuarios, páginas..."
        style={{
          padding: 10,
          borderRadius: 10,
          border: '2px solid #FFD700',
          background: '#232323',
          color: '#FFD700',
          width: 320,
          fontSize: 18,
          outline: 'none',
          boxShadow: '0 2px 8px #FFD70022',
        }}
      />
      <PostCard post={filteredItems[current]} index={current} total={filteredItems.length}
        onComment={()=>window.location.hash='#comments/'+filteredItems[current].id}
        onLike={()=>window.location.hash='#like/'+filteredItems[current].id}
        onShare={()=>window.location.hash='#share/'+filteredItems[current].id}
      />
    </div>
  );
}
