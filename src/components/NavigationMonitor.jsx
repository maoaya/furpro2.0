import React, { useState, useEffect } from 'react';
import { getNavigationLogs, clearNavigationLogs } from '../hooks/useNavigationMonitor';

export default function NavigationMonitor() {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // Actualizar logs cada segundo
    const interval = setInterval(() => {
      setLogs(getNavigationLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    clearNavigationLogs();
    setLogs([]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#FFD700',
          color: '#000',
          padding: '10px 15px',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onClick={() => setIsVisible(true)}
      >
        🔍 Monitor ({logs.length})
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '500px',
        background: 'rgba(0,0,0,0.95)',
        color: '#FFD700',
        border: '2px solid #FFD700',
        borderRadius: '10px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 15px',
          borderBottom: '1px solid #FFD700',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#FFD700',
          color: '#000',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>🔍 Monitor de Navegación</span>
        <div>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            style={{
              background: autoScroll ? '#000' : '#666',
              color: '#FFD700',
              border: 'none',
              padding: '2px 8px',
              borderRadius: '3px',
              marginRight: '5px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Auto
          </button>
          <button
            onClick={handleClearLogs}
            style={{
              background: '#ff4757',
              color: '#fff',
              border: 'none',
              padding: '2px 8px',
              borderRadius: '3px',
              marginRight: '5px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Limpiar
          </button>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: '#666',
              color: '#fff',
              border: 'none',
              padding: '2px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Logs */}
      <div
        id="logs-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          fontSize: '11px',
          fontFamily: 'monospace'
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>
            No hay logs de navegación
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '8px',
                padding: '8px',
                background: index % 2 === 0 ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.05)',
                borderRadius: '4px',
                border: '1px solid rgba(255,215,0,0.2)'
              }}
            >
              <div style={{ color: '#FFD700', fontWeight: 'bold', marginBottom: '4px' }}>
                {formatTimestamp(log.timestamp)}
              </div>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ color: '#ff6b6b' }}>Desde:</span> {log.from}
              </div>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ color: '#4ecdc4' }}>Hacia:</span> {log.to}
              </div>
              {log.search && (
                <div style={{ marginBottom: '2px', color: '#95a5a6' }}>
                  Query: {log.search}
                </div>
              )}
              {log.state && (
                <div style={{ marginBottom: '2px', color: '#f39c12' }}>
                  State: {JSON.stringify(log.state)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer con estadísticas */}
      <div
        style={{
          padding: '8px 15px',
          borderTop: '1px solid #FFD700',
          background: 'rgba(255,215,0,0.1)',
          fontSize: '10px',
          textAlign: 'center'
        }}
      >
        Total de navegaciones: {logs.length} |
        Última: {logs.length > 0 ? formatTimestamp(logs[logs.length - 1].timestamp) : 'N/A'}
      </div>
    </div>
  );
}