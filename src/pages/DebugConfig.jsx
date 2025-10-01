import React from 'react';
import { getConfig } from '../config/environment';

export default function DebugConfig() {
  const config = getConfig();
  
  const checkEnvironmentVars = () => {
    return {
      VITE_AUTO_CONFIRM_SIGNUP: import.meta.env.VITE_AUTO_CONFIRM_SIGNUP,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE
    };
  };
  
  const envVars = checkEnvironmentVars();
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h2>🔧 Debug Configuración Auto-Confirm</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>📊 Estado de Configuración:</h3>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>🌍 Variables de Entorno:</h3>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>✅ Estado Auto-Confirm:</h3>
        <div style={{ 
          padding: '10px', 
          backgroundColor: config.autoConfirmSignup ? '#d4edda' : '#f8d7da',
          color: config.autoConfirmSignup ? '#155724' : '#721c24',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {config.autoConfirmSignup ? 
            '🟢 ACTIVO - Auto-confirm habilitado' : 
            '🔴 INACTIVO - Se requiere confirmación de email'
          }
        </div>
      </div>
      
      <div>
        <h3>📋 Test de URL:</h3>
        <p>Ubicación actual: <code>{window.location.href}</code></p>
        <button 
          onClick={() => window.location.href = '/registro'}
          style={{
            padding: '8px 16px',
            margin: '5px',
            backgroundColor: '#FFD700',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ir a Registro Simple
        </button>
        <button 
          onClick={() => window.location.href = '/registro-completo'}
          style={{
            padding: '8px 16px',
            margin: '5px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ir a Registro Completo
        </button>
      </div>
    </div>
  );
}