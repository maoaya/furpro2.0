import React, { useState, useEffect, useRef } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState('');
  const feedRef = useRef();

  useEffect(() => {
    // Simular fetch de datos
    setTimeout(() => {
      setPosts(data.posts);
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

  // ...resto del componente...
}
