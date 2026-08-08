// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Input({ value, onChange, placeholder = '', type = 'text', style = {} }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      style={{
        padding: 8,
        borderRadius: 6,
        border: `1px solid ${black}`,
        background: gold,
        color: black,
        ...style
      }}
    />
  );
}
// ...existing code...
