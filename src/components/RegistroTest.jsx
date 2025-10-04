import React, { useState } from 'react';
import supabase from '../supabaseClient';

const RegistroTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('🚀 Iniciando registro simple...');
      
      // PASO 1: Intentar signup estándar
      console.log('1️⃣ Intentando signup estándar...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
          data: {
            nombre: nombre,
            full_name: nombre
          }
        }
      });

      let userId = null;
      let userEmail = null;

      if (authError) {
        console.warn('⚠️ Error en signup estándar:', authError.message);
        
        // PASO 2: Intentar función de bypass
        console.log('2️⃣ Intentando función de bypass...');
        try {
          const response = await fetch('/.netlify/functions/signup-bypass', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              password: password,
              nombre: nombre
            })
          });

          const bypassResult = await response.json();

          if (response.ok && bypassResult.success) {
            console.log('✅ Bypass exitoso');
            userId = bypassResult.user?.id;
            userEmail = bypassResult.user?.email;
            setMessage('Usuario creado vía función de bypass');
          } else {
            throw new Error(bypassResult.error || 'Error en función de bypass');
          }
        } catch (bypassError) {
          console.error('❌ Error en bypass:', bypassError.message);
          setError(`Error en registro: ${authError.message}`);
          return;
        }
      } else {
        console.log('✅ Signup estándar exitoso');
        userId = authData.user?.id;
        userEmail = authData.user?.email;
        setMessage('Usuario creado con signup estándar');
      }

      // PASO 3: Crear perfil en base de datos
      if (userId && userEmail) {
        console.log('3️⃣ Creando perfil en BD...');
        
        const profileData = {
          id: userId,
          email: userEmail,
          nombre: nombre || 'Usuario',
          apellido: '',
          rol: 'usuario',
          tipo_usuario: 'jugador',
          estado: 'activo',
          posicion: 'Por definir',
          frecuencia_juego: 1,
          pais: 'España',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: profileResult, error: profileError } = await supabase
          .from('usuarios')
          .insert([profileData])
          .select();

        if (profileError) {
          console.error('❌ Error creando perfil:', profileError.message);
          
          if (profileError.message.includes('duplicate key')) {
            setMessage(prev => prev + ' (Perfil ya existe)');
          } else if (profileError.message.includes('permission')) {
            setError('Error de permisos. Verifica las políticas RLS en Supabase.');
          } else {
            setError(`Error creando perfil: ${profileError.message}`);
          }
        } else {
          console.log('✅ Perfil creado exitosamente');
          setMessage(prev => prev + ' y perfil creado en BD');
        }
      }

      // PASO 4: Intentar login para verificar
      console.log('4️⃣ Verificando login...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
      });

      if (loginError) {
        console.warn('⚠️ No se pudo hacer login automático:', loginError.message);
        setMessage(prev => prev + ' (Login automático falló)');
      } else {
        console.log('✅ Login verificado');
        setMessage(prev => prev + ' ¡Registro completo y verificado!');
      }

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      setError(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #FFD700',
      borderRadius: '8px',
      backgroundColor: '#1a1a1a',
      color: '#fff'
    }}>
      <h2 style={{ color: '#FFD700', textAlign: 'center' }}>🧪 Test de Registro</h2>
      
      <form onSubmit={handleRegistro}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #FFD700',
              backgroundColor: '#333',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #FFD700',
              backgroundColor: '#333',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #FFD700',
              backgroundColor: '#333',
              color: '#fff'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#666' : '#FFD700',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          borderRadius: '4px'
        }}>
          ✅ {message}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f44336',
          color: '#fff',
          borderRadius: '4px'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
        <p>📝 Este componente prueba el flujo completo de registro:</p>
        <ul>
          <li>Signup en Supabase Auth</li>
          <li>Función de bypass como fallback</li>
          <li>Creación de perfil en BD</li>
          <li>Verificación de login</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistroTest;