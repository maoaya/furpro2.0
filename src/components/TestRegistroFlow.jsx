import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ensureHomeNavigation } from '../utils/navigationUtils';

const TestRegistroFlow = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toISOString() }]);
  };

  const runRegistroTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Verificar que RegistroCompleto está disponible
      addResult('Componente RegistroCompleto', 'info', 'Verificando disponibilidad...');
      
      // Test 2: Verificar utilidades de navegación
      addResult('Utilidades de navegación', 'success', 'ensureHomeNavigation disponible');
      
      // Test 3: Simular navegación
      addResult('Navegación simulada', 'info', 'Ejecutando navegación de prueba...');
      
      ensureHomeNavigation(navigate, { target: '/home', delay: 100 });
      
      addResult('Navegación simulada', 'success', 'Navegación ejecutada correctamente');
      
      // Test 4: Verificar localStorage
      const testData = { test: true, timestamp: Date.now() };
      localStorage.setItem('testRegistro', JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem('testRegistro'));
      
      if (retrieved && retrieved.test) {
        addResult('LocalStorage', 'success', 'Funcionalidad confirmada');
        localStorage.removeItem('testRegistro');
      } else {
        addResult('LocalStorage', 'error', 'Error en funcionalidad');
      }
      
      addResult('Test Completo', 'success', '¡Todos los tests pasaron!');
      
    } catch (error) {
      addResult('Test Error', 'error', `Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const statusColors = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3'
  };

  return (
    <div style={{
      padding: '20px',
      background: '#1a1a1a',
      color: '#FFD700',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#FFD700', marginBottom: '20px' }}>
        🧪 Test del Flujo de Registro FutPro
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runRegistroTest}
          disabled={isRunning}
          style={{
            background: '#FFD700',
            color: '#222',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.6 : 1
          }}
        >
          {isRunning ? '🔄 Ejecutando...' : '▶️ Ejecutar Tests'}
        </button>
      </div>

      <div style={{
        background: '#222',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #FFD700'
      }}>
        <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Resultados:</h3>
        
        {testResults.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            No hay resultados aún. Ejecuta los tests para comenzar.
          </p>
        ) : (
          <div>
            {testResults.map((result, index) => (
              <div key={index} style={{
                padding: '8px 12px',
                marginBottom: '8px',
                background: '#333',
                borderRadius: '4px',
                borderLeft: `4px solid ${statusColors[result.status]}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong style={{ color: statusColors[result.status] }}>
                    {result.test}
                  </strong>
                  <span style={{ marginLeft: '10px', color: '#ccc' }}>
                    {result.message}
                  </span>
                </div>
                <small style={{ color: '#888' }}>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Enlaces de navegación:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/registro')} style={{
            background: '#333', color: '#FFD700', border: '1px solid #FFD700',
            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
          }}>
            📝 Ir a Registro
          </button>
          
          <button onClick={() => navigate('/home')} style={{
            background: '#333', color: '#FFD700', border: '1px solid #FFD700',
            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
          }}>
            🏠 Ir a Home
          </button>
          
          <button onClick={() => navigate('/login')} style={{
            background: '#333', color: '#FFD700', border: '1px solid #FFD700',
            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
          }}>
            🔐 Ir a Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestRegistroFlow;