import React, { useState } from 'react';
import { robustSignUp, robustSignIn } from '../utils/authUtils';

const EmergencyTest502 = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [testEmail] = useState('test502-' + Date.now() + '@futpro.test');
  const [testPassword] = useState('TestPass123!');

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[Emergency502] ${message}`);
  };

  const testAnti502 = async () => {
    setLogs([]);
    addLog('🚨 INICIANDO TEST ANTI-502 DE EMERGENCIA', 'info');
    
    try {
      addLog(`📧 Email de prueba: ${testEmail}`, 'info');
      addLog(`🔐 Password: ${testPassword}`, 'info');
      
      // Test el signup robusto
      addLog('1️⃣ Ejecutando robustSignUp...', 'info');
      const result = await robustSignUp(testEmail, testPassword, {
        nombre: 'Test',
        apellido: 'Anti502'
      });
      
      if (result.success) {
        addLog(`✅ SIGNUP EXITOSO!`, 'success');
        addLog(`✅ Método usado: ${result.method}`, 'success');
        addLog(`✅ Intento: ${result.attempt}`, 'success');
        if (result.message) {
          addLog(`📝 Mensaje: ${result.message}`, 'success');
        }
        addLog(`👤 Usuario ID: ${result.data.user.id}`, 'success');
        addLog(`📧 Email confirmado: ${result.data.user.email}`, 'success');
        
        // Test navegación simulada
        addLog('2️⃣ Simulando navegación...', 'info');
        localStorage.setItem('test502-success', JSON.stringify({
          userId: result.data.user.id,
          email: result.data.user.email,
          timestamp: new Date().toISOString()
        }));
        addLog('✅ Datos guardados en localStorage', 'success');
        
        addLog('🎉 ¡ERROR 502 RESUELTO! El signup funciona.', 'success');
        
      } else {
        addLog(`❌ SIGNUP FALLÓ: ${result.error}`, 'error');
        addLog(`❌ Intento final: ${result.attempt}`, 'error');
        
        if (result.originalError) {
          addLog(`🔍 Error original: ${result.originalError.message}`, 'error');
        }
      }
      
    } catch (error) {
      addLog(`💥 ERROR INESPERADO: ${error.message}`, 'error');
    }
  };

  if (!isVisible) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000
      }}>
        <button
          onClick={() => setIsVisible(true)}
          style={{
            background: '#FF0000',
            color: 'white',
            border: 'none',
            padding: '15px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(255,0,0,0.3)',
            animation: 'pulse 2s infinite'
          }}
        >
          🚨 TEST ANTI-502
        </button>
        <style jsx>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '450px',
      maxHeight: '80vh',
      background: '#1a1a1a',
      border: '3px solid #FF0000',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      fontSize: '13px',
      zIndex: 10000,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(255,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #FF0000',
        paddingBottom: '15px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#FF0000',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          🚨 EMERGENCY ANTI-502 TEST
        </h2>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FF0000',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          ✕
        </button>
      </div>

      {/* Test Info */}
      <div style={{
        background: '#2a2a2a',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #FF6600'
      }}>
        <h3 style={{ color: '#FF6600', margin: '0 0 10px 0', fontSize: '14px' }}>
          📋 Información del Test
        </h3>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          <strong>Email:</strong> {testEmail}
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px' }}>
          <strong>Password:</strong> {testPassword}
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px', color: '#FFD700' }}>
          Este test usa las funciones robustas anti-502 con múltiples reintentos
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={testAnti502}
        style={{
          width: '100%',
          background: 'linear-gradient(45deg, #FF0000, #FF6600)',
          color: 'white',
          border: 'none',
          padding: '15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        🚀 EJECUTAR TEST ANTI-502
      </button>

      {/* Logs */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '15px',
        background: '#111'
      }}>
        <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '13px' }}>
          📊 Log en Tiempo Real:
        </h4>
        
        {logs.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic', margin: 0, fontSize: '12px' }}>
            Presiona el botón para iniciar el test...
          </p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '8px',
                padding: '8px',
                borderRadius: '4px',
                background: log.type === 'error' ? '#4a1a1a' : 
                           log.type === 'success' ? '#1a4a1a' : 
                           log.type === 'warning' ? '#4a4a1a' : '#2a2a2a',
                borderLeft: `4px solid ${
                  log.type === 'error' ? '#FF0000' : 
                  log.type === 'success' ? '#00FF00' : 
                  log.type === 'warning' ? '#FFD700' : '#00BFFF'
                }`
              }}
            >
              <span style={{ color: '#888', fontSize: '11px' }}>
                {log.timestamp}
              </span>
              <br />
              <span style={{ fontSize: '12px' }}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: '#2a2a2a',
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '11px', 
          color: '#FFD700',
          fontWeight: 'bold'
        }}>
          🎯 Este test verifica si el error 502 está resuelto
        </p>
      </div>
    </div>
  );
};

export default EmergencyTest502;