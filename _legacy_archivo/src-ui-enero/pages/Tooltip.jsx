// ...existing code...
import React from 'react';

const gold = '#FFD700';
const black = '#222';

export default function Tooltip({ text, children }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <span style={{
        visibility: text ? 'visible' : 'hidden',
        background: gold,
        color: black,
        textAlign: 'center',
        borderRadius: 6,
        padding: '6px 12px',
        position: 'absolute',
        zIndex: 1,
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: 8,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        opacity: text ? 1 : 0,
        transition: 'opacity 0.2s',
      }}>{text}</span>
    </span>
  );
}
// ...existing code...
