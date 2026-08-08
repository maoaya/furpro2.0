import React from 'react';

export default function Formulario({ onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} style={{margin:16}}>
      {children}
    </form>
  );
}
