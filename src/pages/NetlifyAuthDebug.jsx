import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';

export default function NetlifyAuthDebug() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({});
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[NetlifyDebug] ${message}`);
  };

  useEffect(() => {
    const collectDebugInfo = async () => {
      addLog('Iniciando debug para Netlify...');
      
      const info = {
        // Información del entorno
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        origin: window.location.origin,
        isNetlify: window.location.hostname.includes('netlify') || window.location.hostname.includes('futpro.vip'),
        
        // Estado de autenticación del contexto
        hasUser: !!user,
        userEmail: user?.email || 'No disponible',
        authLoading: loading,
        
        // Estado de localStorage
        authCompleted: localStorage.getItem('authCompleted'),
        loginSuccess: localStorage.getItem('loginSuccess'),
        registroCompleto: localStorage.getItem('registroCompleto'),
        userSession: localStorage.getItem('session'),
        userEmail_ls: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId'),
        
        // Timestamp
        timestamp: new Date().toISOString()
      };

      // Verificar sesión de Supabase
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        info.supabaseSession = !!session;
        info.supabaseUser = session?.user?.email || 'No disponible';
        info.supabaseError = error?.message || 'Sin error';
        addLog(`Sesión Supabase: ${session ? 'Activa' : 'Inactiva'}`);
      } catch (error) {
        info.supabaseError = error.message;
        addLog(`Error verificando Supabase: ${error.message}`);
      }

      setDebugInfo(info);
      addLog('Debug info recolectada');
    };

    collectDebugInfo();
  }, [user, loading]);

  const forceNavigation = () => {
    addLog('Forzando navegación a /home...');
    
    // Establecer todos los marcadores
    localStorage.setItem('authCompleted', 'true');
    localStorage.setItem('loginSuccess', 'true');
    
    if (user) {
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('session', JSON.stringify(user));
    }

    // Navegación forzada
    setTimeout(() => {
      window.location.href = '/home';
    }, 1000);
  };

  const clearAllAuth = () => {
    addLog('Limpiando todos los datos de autenticación...');
    
    const keysToRemove = [
      'authCompleted', 'loginSuccess', 'registroCompleto', 'session',
      'userEmail', 'userId', 'postLoginRedirect', 'userRegistrado'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    addLog(`${keysToRemove.length} claves eliminadas`);
    
    // Recargar página
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const testSupabaseAuth = async () => {
    addLog('Probando autenticación de Supabase...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@futpro.com',
        password: 'test123456'
      });
      
      if (error) {
        addLog(`Error en test auth: ${error.message}`);
      } else {
        addLog(`Test auth exitoso: ${data.user?.email}`);
      }
    } catch (error) {
      addLog(`Error en test auth: ${error.message}`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#FFD700',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: '#181818',
        padding: '30px',
        borderRadius: '15px',
        border: '2px solid #FFD700'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🔍 Debug Autenticación Netlify
        </h1>

        {/* Información del entorno */}
        <div style={{
          background: '#222',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '10px',
          borderLeft: '4px solid #FFD700'
        }}>
          <h3>🌐 Información del Entorno</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            <div>🏠 Hostname: {debugInfo.hostname}</div>
            <div>📍 Pathname: {debugInfo.pathname}</div>
            <div>🌐 Origin: {debugInfo.origin}</div>
            <div>☁️ Es Netlify: {debugInfo.isNetlify ? '✅ Sí' : '❌ No'}</div>
          </div>
        </div>

        {/* Estado de autenticación */}
        <div style={{
          background: '#222',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '10px',
          borderLeft: `4px solid ${debugInfo.hasUser ? '#28a745' : '#dc3545'}`
        }}>
          <h3>🔐 Estado de Autenticación</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            <div>👤 Tiene Usuario: {debugInfo.hasUser ? '✅ Sí' : '❌ No'}</div>
            <div>📧 Email Usuario: {debugInfo.userEmail}</div>
            <div>⏳ Cargando: {debugInfo.authLoading ? '✅ Sí' : '❌ No'}</div>
            <div>🗃️ Sesión Supabase: {debugInfo.supabaseSession ? '✅ Activa' : '❌ Inactiva'}</div>
            <div>📧 Email Supabase: {debugInfo.supabaseUser}</div>
            <div>❌ Error Supabase: {debugInfo.supabaseError}</div>
          </div>
        </div>

        {/* Estado de localStorage */}
        <div style={{
          background: '#222',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '10px',
          borderLeft: '4px solid #17a2b8'
        }}>
          <h3>💾 Estado de localStorage</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            <div>✅ authCompleted: {debugInfo.authCompleted || 'No presente'}</div>
            <div>🎯 loginSuccess: {debugInfo.loginSuccess || 'No presente'}</div>
            <div>📝 registroCompleto: {debugInfo.registroCompleto || 'No presente'}</div>
            <div>👤 userSession: {debugInfo.userSession ? 'Presente' : 'No presente'}</div>
            <div>📧 userEmail: {debugInfo.userEmail_ls || 'No presente'}</div>
            <div>🆔 userId: {debugInfo.userId || 'No presente'}</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          margin: '30px 0'
        }}>
          <button 
            onClick={forceNavigation}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🚀 Forzar Navegación
          </button>

          <button 
            onClick={clearAllAuth}
            style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🧹 Limpiar Todo
          </button>

          <button 
            onClick={testSupabaseAuth}
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔑 Test Supabase
          </button>

          <button 
            onClick={() => navigate('/home')}
            style={{
              background: '#FFD700',
              color: '#000',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🏠 Ir a Home
          </button>
        </div>

        {/* Log de eventos */}
        <div style={{
          background: '#222',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '10px',
          borderLeft: '4px solid #ffc107'
        }}>
          <h3>📊 Log de Eventos</h3>
          <div style={{
            background: '#333',
            padding: '15px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '11px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  {log}
                </div>
              ))
            ) : (
              <div style={{ color: '#666' }}>No hay eventos registrados...</div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div style={{
          background: '#222',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '10px',
          borderLeft: '4px solid #6f42c1'
        }}>
          <h3>ℹ️ Información Adicional</h3>
          <div style={{ fontSize: '12px' }}>
            <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
            <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...</div>
            <div><strong>Cookies Habilitadas:</strong> {navigator.cookieEnabled ? 'Sí' : 'No'}</div>
            <div><strong>LocalStorage Disponible:</strong> {typeof(Storage) !== "undefined" ? 'Sí' : 'No'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}