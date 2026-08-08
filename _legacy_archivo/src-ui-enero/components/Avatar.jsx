import React from 'react';

export default function Avatar({ src, alt, size=48 }) {
  return (
    <img src={src} alt={alt} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover'}} />
  );
}
