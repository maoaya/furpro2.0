import React from 'react';

export default function FutproLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#FFD700" stroke="#232323" strokeWidth="4" />
      <text x="32" y="38" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#232323" fontFamily="Arial, sans-serif">FP</text>
      <circle cx="32" cy="32" r="18" fill="none" stroke="#232323" strokeWidth="2" />
      <circle cx="32" cy="32" r="8" fill="#232323" />
    </svg>
  );
}
