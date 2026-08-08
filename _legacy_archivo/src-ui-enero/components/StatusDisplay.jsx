import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StatusDisplay = () => {
  const { user, loading, userProfile, role } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const addLog = (message, type = 'info') => {
      setLogs(prev => [...prev, {
        message,
        type,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    addLog('🚀 StatusDisplay iniciado', 'success');
    
    if (loading) {
      addLog('⏳ Cargando autenticación...', 'warning');
    } else if (user) {
      addLog(`✅ Usuario autenticado: ${user.email}`, 'success');
      if (userProfile) {
        addLog(`👤 Perfil cargado: ${userProfile.nombre}`, 'success');
      }
    } else {
      addLog('❌ No hay usuario autenticado', 'error');
    }
  }, [user, loading, userProfile]);

  const authData = {
    user: user ? { id: user.id, email: user.email } : null,
    userProfile: userProfile ? { nombre: userProfile.nombre, rol: userProfile.rol } : null,
    role,
    loading,
    localStorage: {
      authCompleted: localStorage.getItem('authCompleted'),
      session: localStorage.getItem('session') ? 'presente' : 'ausente',
      userRegistrado: localStorage.getItem('userRegistrado') ? 'presente' : 'ausente'
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#1a1a1a',
      border: '2px solid #FFD700',
      borderRadius: '8px',
      padding: '15px',
      color: '#FFD700',
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>
        🔍 Estado del Sistema
      </h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Estado Actual:</strong>
        <div style={{ 
          color: user ? '#4CAF50' : (loading ? '#FF9800' : '#F44336'),
          fontWeight: 'bold'
        }}>
          {loading ? '⏳ Cargando...' : user ? '✅ Autenticado' : '❌ No autenticado'}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Logs:</strong>
        <div style={{ 
          maxHeight: '150px', 
          overflowY: 'auto',
          background: '#222',
          padding: '5px',
          borderRadius: '4px',
          marginTop: '5px'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{
              color: log.type === 'success' ? '#4CAF50' : 
                     log.type === 'error' ? '#F44336' : 
                     log.type === 'warning' ? '#FF9800' : '#2196F3',
              fontSize: '11px',
              marginBottom: '2px'
            }}>
              [{log.timestamp}] {log.message}
            </div>
          ))}
        </div>
      </div>

      <details>
        <summary style={{ cursor: 'pointer', color: '#FFD700' }}>
          📊 Datos Detallados
        </summary>
        <pre style={{
          background: '#222',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          overflow: 'auto',
          marginTop: '5px'
        }}>
          {JSON.stringify(authData, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default StatusDisplay;