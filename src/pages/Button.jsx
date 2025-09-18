// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Button({ children, onClick, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: gold,
        color: black,
        border: 'none',
        borderRadius: 8,
        padding: '10px 18px',
        fontWeight: 'bold',
        ...style
      }}
    >
      {children}
    </button>
  );
}
// ...existing code...
