// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Select({ value, onChange, options = [], style = {} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: 8,
        borderRadius: 6,
        border: `1px solid ${black}`,
        background: gold,
        color: black,
        ...style
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
// ...existing code...
