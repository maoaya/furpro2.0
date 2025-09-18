// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Card({ title, children, actions }) {
  return (
    <div style={{ background: gold, color: black, borderRadius: 16, boxShadow: '0 2px 12px #0006', padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div>{actions}</div>
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
// ...existing code...
