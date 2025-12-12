import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallback as stubHandleCallback } from '../../stubs/authCallbackFunctions';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    stubHandleCallback(navigate);
    console.log('[INTEGRACIÓN STUB] handleCallback ejecutado (AuthCallback.jsx)');
  }, [navigate]);

  return (
    <div style={{ color: '#FFD700', textAlign: 'center', marginTop: 80 }}>
      <h2>Procesando autenticación...</h2>
      <p>Por favor espera unos segundos.</p>
    </div>
  );
}
