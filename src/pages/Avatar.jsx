// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Avatar({ src, alt = 'avatar', size = 64 }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${gold}`,
        background: black,
      }}
    />
  );
}
// ...existing code...
