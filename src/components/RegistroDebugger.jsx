import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegistroDebugger = () => {
  const [logs, setLogs] = useState([]);
  const [testEmail, setTestEmail] = useState('test' + Date.now() + '@futpro.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[RegistroDebugger] ${timestamp} - ${type.toUpperCase()}: ${message}`);
  };

  const clearLogs = () => setLogs([]);

  // Test completo del flujo de registro
  const testRegistroCompleto = async () => {
    clearLogs();
    addLog('🧪 INICIANDO TEST COMPLETO DE REGISTRO', 'info');
    
    try {
      // 1. Test de conexión Supabase
      addLog('1️⃣ Verificando conexión Supabase...', 'info');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('usuarios')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        addLog(`❌ Error de conexión: ${connectionError.message}`, 'error');
        return;
      }
      addLog('✅ Conexión Supabase OK', 'success');

      // 2. Test de signup
      addLog('2️⃣ Probando signup...', 'info');
      const signUpOptions = {
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true
        }
      };

      const { data: authData, error: authError } = await supabase.auth.signUp(signUpOptions);
      
      if (authError) {
        addLog(`❌ Error en signup: ${authError.message}`, 'error');
        
        // Test de fallback
        addLog('3️⃣ Probando método de fallback (login)...', 'info');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (loginError) {
          addLog(`❌ Fallback también falló: ${loginError.message}`, 'error');
          return;
        } else {
          addLog('✅ Fallback login funcionó', 'success');
        }
      } else {
        addLog('✅ Signup exitoso', 'success');
        
        if (authData.user) {
          addLog(`👤 Usuario creado: ${authData.user.email}`, 'success');
          
          // 3. Test de creación de perfil
          addLog('3️⃣ Creando perfil en tabla usuarios...', 'info');
          const perfilData = {
            id: authData.user.id,
            email: testEmail,
            nombre: 'Test',
            apellido: 'Usuario',
            rol: 'usuario',
            tipo_usuario: 'jugador',
            estado: 'activo',
            posicion: 'Por definir',
            frecuencia_juego: 1,
            pais: 'España',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data: profileData, error: profileError } = await supabase
            .from('usuarios')
            .insert([perfilData])
            .select();

          if (profileError) {
            addLog(`⚠️ Error creando perfil: ${profileError.message}`, 'warning');
          } else {
            addLog('✅ Perfil creado exitosamente', 'success');
          }

          // 4. Test de navegación
          addLog('4️⃣ Simulando navegación...', 'info');
          
          // Simular guardado en localStorage
          localStorage.setItem('userRegistrado', JSON.stringify({
            id: authData.user.id,
            email: testEmail,
            nombre: 'Test',
            registrado: true,
            timestamp: new Date().toISOString()
          }));
          
          localStorage.setItem('authCompleted', 'true');
          localStorage.setItem('loginSuccess', 'true');
          
          addLog('✅ Datos guardados en localStorage', 'success');
          addLog('✅ Test de registro completado exitosamente', 'success');
          
          // Limpiar usuario de prueba
          addLog('🧹 Limpiando usuario de prueba...', 'info');
          await supabase.auth.signOut();
          
        } else {
          addLog('❌ No se recibió objeto user del signup', 'error');
        }
      }

    } catch (error) {
      addLog(`💥 Error inesperado: ${error.message}`, 'error');
    }
  };

  // Test específico de navegación
  const testNavegacion = () => {
    addLog('🧭 PROBANDO NAVEGACIÓN DIRECTA', 'info');
    
    try {
      addLog('Intentando navigate("/home")...', 'info');
      navigate('/home');
      addLog('✅ Navigate ejecutado', 'success');
    } catch (error) {
      addLog(`❌ Error en navigate: ${error.message}`, 'error');
      
      addLog('Probando window.location.href...', 'info');
      window.location.href = '/home';
    }
  };

  // Verificar estado actual
  const verificarEstado = () => {
    addLog('🔍 VERIFICANDO ESTADO ACTUAL', 'info');
    
    addLog(`Usuario en context: ${user ? user.email : 'null'}`, user ? 'success' : 'warning');
    addLog(`authCompleted: ${localStorage.getItem('authCompleted')}`, 'info');
    addLog(`loginSuccess: ${localStorage.getItem('loginSuccess')}`, 'info');
    addLog(`userRegistrado: ${localStorage.getItem('userRegistrado') ? 'Existe' : 'No existe'}`, 'info');
    addLog(`URL actual: ${window.location.pathname}`, 'info');
  };

  useEffect(() => {
    verificarEstado();
  }, [user]);

  if (!isVisible) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={() => setIsVisible(true)}
          style={{
            background: '#FF6B35',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🧪 Debug Registro
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '500px',
      background: '#2a2a2a',
      border: '2px solid #FF6B35',
      borderRadius: '10px',
      padding: '15px',
      color: 'white',
      fontSize: '12px',
      zIndex: 9999,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #444',
        paddingBottom: '10px'
      }}>
        <h3 style={{ margin: 0, color: '#FF6B35' }}>🧪 Debug Registro</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FF6B35',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="email"
          placeholder="Email de prueba"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '5px',
            marginBottom: '5px',
            border: '1px solid #555',
            borderRadius: '3px',
            background: '#333',
            color: 'white',
            fontSize: '11px'
          }}
        />
        <input
          type="password"
          placeholder="Password de prueba"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '5px',
            border: '1px solid #555',
            borderRadius: '3px',
            background: '#333',
            color: 'white',
            fontSize: '11px'
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={testRegistroCompleto}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            flex: 1
          }}
        >
          🧪 Test Completo
        </button>
        <button
          onClick={testNavegacion}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            flex: 1
          }}
        >
          🧭 Test Navegación
        </button>
        <button
          onClick={verificarEstado}
          style={{
            background: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            flex: 1
          }}
        >
          🔍 Verificar Estado
        </button>
        <button
          onClick={clearLogs}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            flex: 1
          }}
        >
          🗑️ Limpiar
        </button>
      </div>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #444',
        borderRadius: '5px',
        padding: '10px',
        background: '#1a1a1a'
      }}>
        {logs.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic', margin: 0 }}>
            Presiona un botón para iniciar el debugging...
          </p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '5px',
                padding: '3px 6px',
                borderRadius: '3px',
                background: log.type === 'error' ? '#4a1a1a' : 
                           log.type === 'success' ? '#1a4a1a' : 
                           log.type === 'warning' ? '#4a4a1a' : '#2a2a2a',
                borderLeft: `3px solid ${
                  log.type === 'error' ? '#f44336' : 
                  log.type === 'success' ? '#4CAF50' : 
                  log.type === 'warning' ? '#FF9800' : '#2196F3'
                }`
              }}
            >
              <span style={{ color: '#888', fontSize: '10px' }}>
                {log.timestamp}
              </span>
              <br />
              <span style={{ fontSize: '11px' }}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistroDebugger;