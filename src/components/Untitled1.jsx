import React, { useEffect, useState } from 'react';

const Untitled1 = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/untitled1')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error al conectar con el backend'));
  }, []);

  return (
    <div>
      <h1>Componente Untitled-1</h1>
      <p>{message}</p>
    </div>
  );
};

export default Untitled1;
