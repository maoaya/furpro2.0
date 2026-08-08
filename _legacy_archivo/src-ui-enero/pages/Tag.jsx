// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Tag({ label, color = gold, style = {} }) {
  return (
    <span style={{ background: color, color: black, borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', ...style }}>{label}</span>
  );
}
// ...existing code...
