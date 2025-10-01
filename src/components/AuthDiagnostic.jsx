import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

export default function AuthDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({
    supabaseConnection: 'testing',
    authService: 'testing',
    environment: 'checking',
    recommendations: []
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {
      supabaseConnection: 'testing',
      authService: 'testing',
      environment: 'checking',
      recommendations: []
    };

    // 1. Test Supabase Connection
    try {
      const { data, error } = await supabase.from('usuarios').select('count').limit(1);
      if (error) {
        results.supabaseConnection = 'error';
        results.recommendations.push('❌ Error de conexión a Supabase. Verificar variables de entorno.');
        console.error('Supabase connection error:', error);
      } else {
        results.supabaseConnection = 'ok';
        results.recommendations.push('✅ Conexión a Supabase funcionando.');
      }
    } catch (err) {
      results.supabaseConnection = 'error';
      results.recommendations.push('❌ Error crítico de conexión a Supabase.');
      console.error('Supabase critical error:', err);
    }

    // 2. Test Auth Service
    try {
      const { data: session } = await supabase.auth.getSession();
      results.authService = 'ok';
      results.recommendations.push('✅ Servicio de autenticación disponible.');
      
      if (session?.session) {
        results.recommendations.push('👤 Usuario ya autenticado.');
      } else {
        results.recommendations.push('🔓 No hay sesión activa.');
      }
    } catch (err) {
      results.authService = 'error';
      results.recommendations.push('❌ Error en servicio de autenticación.');
      console.error('Auth service error:', err);
    }

    // 3. Environment Check
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL
    };

    let envIssues = 0;
    Object.entries(envVars).forEach(([key, value]) => {
      if (!value) {
        envIssues++;
        results.recommendations.push(`❌ Variable de entorno faltante: ${key}`);
      }
    });

    if (envIssues === 0) {
      results.environment = 'ok';
      results.recommendations.push('✅ Variables de entorno configuradas.');
    } else {
      results.environment = 'error';
    }

    // 4. Network Test
    try {
      const response = await fetch(`${envVars.VITE_SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': envVars.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${envVars.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (response.status === 502) {
        results.recommendations.push('❌ Error 502: Problema de servidor en Supabase. Reintentar en unos minutos.');
      } else if (response.ok) {
        results.recommendations.push('✅ API de Supabase respondiendo correctamente.');
      } else {
        results.recommendations.push(`⚠️ API de Supabase responde con status: ${response.status}`);
      }
    } catch (err) {
      results.recommendations.push('❌ Error de red al conectar con Supabase.');
      console.error('Network test error:', err);
    }

    setDiagnostics(results);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return '#4CAF50';
      case 'error': return '#f44336';
      case 'testing':
      case 'checking':
      default: return '#FF9800';
    }
  };

  const testSignup = async () => {
    const testEmail = `test_${Date.now()}@futpro.test`;
    const testPassword = 'TestPassword123!';
    
    try {
      console.log('🧪 Probando signup con:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            nombre: 'Test User',
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        console.error('❌ Test signup error:', error);
        alert(`Error en test signup: ${error.message}`);
      } else {
        console.log('✅ Test signup exitoso:', data);
        alert('Test signup exitoso. Verificar console para detalles.');
      }
    } catch (err) {
      console.error('❌ Test signup exception:', err);
      alert(`Exception en test signup: ${err.message}`);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: '#1a1a1a',
      border: '2px solid #FFD700',
      borderRadius: '8px',
      padding: '15px',
      color: '#FFD700',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '350px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        🔍 Diagnóstico de Autenticación
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Supabase:</strong>{' '}
        <span style={{ color: getStatusColor(diagnostics.supabaseConnection) }}>
          {diagnostics.supabaseConnection}
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Auth Service:</strong>{' '}
        <span style={{ color: getStatusColor(diagnostics.authService) }}>
          {diagnostics.authService}
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Environment:</strong>{' '}
        <span style={{ color: getStatusColor(diagnostics.environment) }}>
          {diagnostics.environment}
        </span>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '11px' }}>
        <strong>Recomendaciones:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          {diagnostics.recommendations.slice(0, 5).map((rec, index) => (
            <li key={index} style={{ margin: '2px 0', color: '#ccc' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={runDiagnostics}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 8px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          🔄 Retest
        </button>
        
        <button
          onClick={testSignup}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 8px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          🧪 Test Signup
        </button>
      </div>
    </div>
  );
}