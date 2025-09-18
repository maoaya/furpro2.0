import React, { useState } from 'react';

const icons = {
  fire: '🔥',
  ball: '⚽',
  deflated: '🏐'
};

const LikeButton = ({ mediaId }) => {
  const [type, setType] = useState('ball');
  const [count, setCount] = useState(0);

  const handleLike = async () => {
    setCount(count + 1);
    const token = localStorage.getItem('token');
    await fetch('/api/media/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ mediaId, type })
    });
  };

  return (
    <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="fire">Balón de fuego</option>
        <option value="ball">Balón</option>
        <option value="deflated">Balón desinflado</option>
      </select>
      <button onClick={handleLike} style={{fontSize:'2rem'}}>{icons[type]}</button>
      <span>{count}</span>
    </div>
  );
};

export default LikeButton;
