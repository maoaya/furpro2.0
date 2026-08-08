import React from 'react';

const Button = ({ children, onClick, style = {}, ...props }) => (
  <button
    onClick={onClick}
    style={{
      background: 'linear-gradient(90deg, #FFD700 0%, #222 100%)',
      color: '#222',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      margin: '6px',
      ...style
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;

export { Button };
