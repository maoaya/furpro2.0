import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFlowManager, handleCompleteRegistration, handleAuthenticationSuccess } from '../utils/authFlowManager.js';
import supabase from '../supabaseClient.js';

const AuthFlowTester = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setStatus('Probando registro completo...');

    try {
      const resultado = await handleCompleteRegistration({
        email: `test${Date.now()}@futpro.com`,
        password: 'test123456',
        nombre: 'Test',
        apellido: 'Usuario'
      }, navigate);

      setStatus(resultado.success ? 
        '✅ Registro exitoso' : 
        `❌ Error: ${resultado.error}`
      );
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setStatus('Probando login...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@futpro.com',
        password: 'admin123'
      });

      if (error) {
        setStatus(`❌ Error login: ${error.message}`);
        return;
      }

      const resultado = await handleAuthenticationSuccess(data.user, navigate);
      setStatus(resultado.success ? 
        '✅ Login y navegación exitosos' : 
        `❌ Error navegación: ${resultado.error}`
      );
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testNavigation = async () => {
    setLoading(true);
    setStatus('Probando navegación directa...');

    try {
      const result = await authFlowManager.executeRobustNavigation(navigate);
      setStatus(result ? '✅ Navegación exitosa' : '❌ Navegación falló');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#1a1a1a',
      border: '2px solid #FFD700',
      borderRadius: '10px',
      padding: '20px',
      zIndex: 9999,
      maxWidth: '300px',
      color: '#fff'
    }}>
      <h3 style={{ color: '#FFD700', margin: '0 0 15px 0', fontSize: '16px' }}>
        🔧 AuthFlow Tester
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={testRegistration}
          disabled={loading}
          style={{
            background: '#FFD700',
            color: '#000',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? '...' : 'Test Registro'}
        </button>

        <button 
          onClick={testLogin}
          disabled={loading}
          style={{
            background: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? '...' : 'Test Login'}
        </button>

        <button 
          onClick={testNavigation}
          disabled={loading}
          style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? '...' : 'Test Navegación'}
        </button>
      </div>

      {status && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#333',
          borderRadius: '5px',
          fontSize: '11px',
          wordBreak: 'break-word'
        }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default AuthFlowTester;