import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import { getConfig } from '../config/environment.js';
import { handleSuccessfulAuth } from '../utils/navigationUtils.js';
import { robustSignUp, robustSignIn, createUserProfile } from '../utils/authUtils.js';
import { registrarUsuarioCompleto } from '../utils/registroCompleto.js';
import { authFlowManager, handleAuthenticationSuccess, handleCompleteRegistration } from '../utils/authFlowManager.js';

const AuthPageUnificada = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(false); // CAMBIAR A FALSE POR DEFECTO (MOSTRAR REGISTRO)
  const [showEmailForm, setShowEmailForm] = useState(true); // CAMBIAR A TRUE (MOSTRAR FORMULARIO SIEMPRE)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Detectar tipo de registro basado en la ruta
  const registroTipo = location.pathname.includes('google') ? 'google' :
                      location.pathname.includes('facebook') ? 'facebook' :
                      location.pathname.includes('email') ? 'email' : 'general';
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    edad: '',
    peso: '',
    telefono: '',
    posicion: '',
    equipoFavorito: '',
    experiencia: '',
    ubicacion: '',
    pais: '',
    disponibilidad: '',
    vecesJuegaPorSemana: '',
    foto: null
  });

  // NO redirigir automáticamente - dejar que el usuario use el formulario de login
  // La redirección ocurrirá después del login exitoso en las funciones handleEmailLogin/handleEmailRegister
  useEffect(() => {
    // Limpiar flags de localStorage que podrían causar redirecciones no deseadas
    if (!user) {
      localStorage.removeItem('authCompleted');
      localStorage.removeItem('loginSuccess');
    }
    
    // Solo logging, sin redirección automática
    if (user) {
      const categoria = user?.user_metadata?.categoria || user?.categoria;
      console.log('✅ Usuario ya autenticado detectado:', user.email, 'Categoría:', categoria);
      console.log('ℹ️ Usuario puede estar visitando la página - NO redirigir automáticamente');
    }
  }, [user]);

  // Efecto eliminado - causaba redirecciones automáticas no deseadas
  // La redirección debe ocurrir SOLO después de un login exitoso, no al cargar la página

  // Función ELIMINADA - No debe haber navegación automática
  // La redirección ocurre en handleEmailLogin y handleEmailRegister después del login exitoso

  // REGISTRO CON EMAIL Y PASSWORD
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.email || !formData.password || !formData.nombre || !formData.apellido || 
          !formData.edad || !formData.telefono || !formData.posicion || !formData.experiencia || 
          !formData.ubicacion || !formData.disponibilidad) {
        setError('Por favor completa todos los campos obligatorios marcados con *');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Validaciones específicas adicionales
      if (formData.edad < 16 || formData.edad > 60) {
        setError('La edad debe estar entre 16 y 60 años');
        return;
      }

      if (formData.telefono.length < 10) {
        setError('El teléfono debe tener al menos 10 dígitos');
        return;
      }

      console.log('📝 Iniciando registro con AuthFlowManager mejorado...');
      setSuccess('Creando cuenta...');

      // Usar el nuevo manager de flujo completo
      const resultado = await handleCompleteRegistration({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido?.trim() || '',
        edad: parseInt(formData.edad),
        telefono: formData.telefono.trim(),
        posicion: formData.posicion,
        equipoFavorito: formData.equipoFavorito?.trim() || '',
        experiencia: formData.experiencia,
        ubicacion: formData.ubicacion.trim(),
        disponibilidad: formData.disponibilidad
      }, navigate);

      if (!resultado.success) {
        console.error('❌ Error en registro completo:', resultado.error);
        setError(`Error en registro: ${resultado.error}`);
        return;
      }

      // Éxito - el manager se encarga de la navegación
      console.log('✅ Registro y navegación completados');
      setSuccess(resultado.message || 'Cuenta creada exitosamente! Redirigiendo...');

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      setError(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON EMAIL Y PASSWORD
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.email || !formData.password) {
        setError('Por favor completa email y contraseña');
        return;
      }

      console.log('🔐 Iniciando sesión con email...');
      setSuccess('Iniciando sesión...');

      // Usar función robusta de login
      const loginResult = await robustSignIn(formData.email, formData.password);

      if (!loginResult.success) {
        console.error('❌ Error en login robusto:', loginResult.error);
        setError(`Error de login: ${loginResult.error}`);
        return;
      }

      console.log('✅ Login exitoso con email/password');
      setSuccess('¡Login exitoso! Redirigiendo...');

      // Usar el nuevo AuthFlowManager para manejo post-login
      const userData = {
        id: loginResult.data.user.id,
        email: loginResult.data.user.email,
        nombre: loginResult.data.user.user_metadata?.nombre || 'Usuario',
        apellido: loginResult.data.user.user_metadata?.apellido || ''
      };

      // Usar el nuevo manager para navegación robusta
      const resultado = await handleAuthenticationSuccess(loginResult.data.user, navigate, userData);
      
      if (!resultado.success) {
        console.log('⚠️ Problema con AuthFlowManager, usando fallback');
        handleSuccessfulAuth(userData, navigate);
      }    } catch (error) {
      console.error('💥 Error inesperado en login:', error);
      setError(`Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON GOOGLE
  const handleGoogleAuth = async () => {
    console.log('[OAuth] handleGoogleAuth llamado');
    setLoading(true);
    setError('');
    setSuccess('Google auth...');

    try {
      console.log('🔐 Iniciando autenticación con Google...');
      
      // Si estamos en la ruta específica de Google, ir directo al OAuth
      if (registroTipo === 'google') {
        const config = getConfig();
        console.log('[OAuth] redirectTo:', `${window.location.origin}/auth/callback`);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });

        if (error) {
          console.error('❌ Error OAuth Google:', error);
          setError(`Error Google: ${error.message}`);
        } else {
          console.log('🔄 Redirigiendo a Google...');
          setSuccess('Redirigiendo a Google...');
          // Log extra para depuración
          console.log('[OAuth] Redirección iniciada correctamente');
        }
      } else {
        // Si no, navegar a la ruta específica
        navigate('/registro-google');
      }
    } catch (error) {
      console.error('💥 Error inesperado Google:', error);
      setError(`Error Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON FACEBOOK
  const handleFacebookAuth = async () => {
    setLoading(true);
    setError('');
    setSuccess('Facebook auth...');

    try {
      console.log('🔐 Iniciando autenticación con Facebook...');
      
      // Si estamos en la ruta específica de Facebook, ir directo al OAuth
      if (registroTipo === 'facebook') {
        const config = getConfig();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook'
        });

        if (error) {
          console.error('❌ Error OAuth Facebook:', error);
          setError(`Error Facebook: ${error.message}`);
        } else {
          console.log('🔄 Redirigiendo a Facebook...');
          setSuccess('Redirigiendo a Facebook...');
        }
      } else {
        // Si no, navegar a la ruta específica
        navigate('/registro-facebook');
      }
    } catch (error) {
      console.error('💥 Error inesperado Facebook:', error);
      setError(`Error Facebook: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'foto' && files) {
      setFormData({
        ...formData,
        foto: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#222',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        border: '2px solid #FFD700',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#FFD700', 
            fontSize: '32px', 
            fontWeight: 'bold',
            margin: '0 0 10px 0'
          }}>
            ⚽ FutPro
          </h1>
          <h2 style={{ 
            color: '#FFD700', 
            fontSize: '24px',
            margin: '0 0 10px 0'
          }}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          
          {/* Información sobre las funciones de la app para nuevos usuarios */}
          {!isLogin && (
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid #FFD700',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '15px',
              textAlign: 'left'
            }}>
              <h4 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '16px' }}>
                🎯 Con tu cuenta podrás:
              </h4>
              <ul style={{ color: '#ccc', fontSize: '14px', margin: '0', paddingLeft: '20px' }}>
                <li>🏆 Crear y unirte a equipos</li>
                <li>📅 Organizar partidos y campeonatos</li>
                <li>💬 Chat con jugadores y equipos</li>
                <li>📍 Encontrar jugadores cerca de ti</li>
                <li>📊 Estadísticas y rankings</li>
                <li>🎮 Marketplace de equipamiento</li>
              </ul>
            </div>
          )}
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: '#F44336',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#4CAF50',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* Botones OAuth */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: '#db4437',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            🔐 {registroTipo === 'google' ? 'Continuar con Google' : 'Registro rápido con Google'}
          </button>

          <button
            onClick={handleFacebookAuth}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3b5998',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}
          >
            📘 {registroTipo === 'facebook' ? 'Continuar con Facebook' : 'Registro rápido con Facebook'}
          </button>

          {/* Botón para formulario completo con email */}
          {!isLogin && (
            <p style={{ 
              color: '#999', 
              fontSize: '12px', 
              textAlign: 'center', 
              margin: '10px 0 0 0' 
            }}>
              💡 Con OAuth solo necesitas confirmar algunos datos adicionales
            </p>
          )}
        </div>

        {/* Formulario completo - SIEMPRE VISIBLE */}
        {true && (
          <>
            {/* Divisor */}
            <div style={{
              textAlign: 'center',
              color: '#FFD700',
              margin: '20px 0',
              position: 'relative'
            }}>
              <span style={{
                background: '#222',
                padding: '0 15px',
                fontSize: '14px'
              }}>
                Formulario completo de registro
              </span>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                height: '1px',
                background: '#FFD700',
                zIndex: '-1'
              }} />
            </div>

            <form onSubmit={isLogin ? handleEmailLogin : handleEmailRegister}>
              {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  👤 Información Personal
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre *"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido *"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="number"
                    name="edad"
                    placeholder="Edad *"
                    value={formData.edad}
                    onChange={handleInputChange}
                    required
                    min="16"
                    max="60"
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="number"
                    name="peso"
                    placeholder="Peso (kg) *"
                    value={formData.peso}
                    onChange={handleInputChange}
                    required
                    min="40"
                    max="150"
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono *"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ciudad *"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '2',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="text"
                    name="pais"
                    placeholder="País *"
                    value={formData.pais}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Subir foto */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#FFD700', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    📷 Foto de perfil
                  </label>
                  <input
                    type="file"
                    name="foto"
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              {/* SECCIÓN 2: INFORMACIÓN FUTBOLÍSTICA */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  ⚽ Información Futbolística
                </h3>
                
                <select
                  name="posicion"
                  value={formData.posicion}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona tu posición *</option>
                  <optgroup label="🥅 Portería">
                    <option value="portero">Portero</option>
                  </optgroup>
                  <optgroup label="🛡️ Defensa">
                    <option value="defensa-central">Defensa Central</option>
                    <option value="lateral-derecho">Lateral Derecho</option>
                    <option value="lateral-izquierdo">Lateral Izquierdo</option>
                    <option value="libero">Líbero</option>
                  </optgroup>
                  <optgroup label="⚡ Mediocampo">
                    <option value="mediocentro-defensivo">Mediocentro Defensivo</option>
                    <option value="mediocentro-central">Mediocentro Central</option>
                    <option value="mediocentro-ofensivo">Mediocentro Ofensivo</option>
                    <option value="extremo-derecho">Extremo Derecho</option>
                    <option value="extremo-izquierdo">Extremo Izquierdo</option>
                    <option value="enganche">Enganche</option>
                  </optgroup>
                  <optgroup label="🎯 Delantero">
                    <option value="delantero-centro">Delantero Centro</option>
                    <option value="segundo-delantero">Segundo Delantero</option>
                    <option value="falso-nueve">Falso 9</option>
                  </optgroup>
                  <optgroup label="🔄 Múltiples">
                    <option value="multiple">Múltiples posiciones</option>
                  </optgroup>
                </select>

                <select
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Nivel de experiencia *</option>
                  <option value="principiante">🌱 Principiante (0-1 años)</option>
                  <option value="amateur">⚽ Amateur (2-5 años)</option>
                  <option value="intermedio">🏆 Intermedio (5-10 años)</option>
                  <option value="avanzado">🥇 Avanzado (10+ años)</option>
                  <option value="profesional">👑 Profesional/Ex-profesional</option>
                </select>

                <select
                  name="vecesJuegaPorSemana"
                  value={formData.vecesJuegaPorSemana}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">¿Cuántas veces juegas por semana? *</option>
                  <option value="1">1 vez por semana</option>
                  <option value="2">2 veces por semana</option>
                  <option value="3">3 veces por semana</option>
                  <option value="4">4 veces por semana</option>
                  <option value="5">5 veces por semana</option>
                  <option value="6">6 veces por semana</option>
                  <option value="7">7 veces por semana</option>
                  <option value="mas-7">Más de 7 veces por semana</option>
                </select>

                <input
                  type="text"
                  name="equipoFavorito"
                  placeholder="Equipo favorito (opcional)"
                  value={formData.equipoFavorito}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <select
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Disponibilidad de horarios *</option>
                  <option value="mananas">🌅 Mañanas (6:00 - 12:00)</option>
                  <option value="tardes">🌞 Tardes (12:00 - 18:00)</option>
                  <option value="noches">🌙 Noches (18:00 - 23:00)</option>
                  <option value="fines_semana">📅 Solo fines de semana</option>
                  <option value="flexible">🔄 Horario flexible</option>
                </select>
              </div>

              {/* SECCIÓN 3: CREDENCIALES */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  🔐 Credenciales de acceso
                </h3>

                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña *"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña *"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#999' : '#FFD700',
                  color: '#222',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '20px',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? '⏳ Procesando...' : '🏆 Crear mi perfil FutPro completo'}
              </button>
              
              {/* Información adicional para registro */}
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid #4CAF50',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: '#4CAF50', 
                  fontSize: '14px', 
                  margin: '0',
                  fontWeight: 'bold'
                }}>
                  ✅ Perfil completo • Mejor matchmaking • Datos seguros
                </p>
              </div>

              {/* Toggle entre login y registro */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFD700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {isLogin ? 
                    '¿No tienes cuenta? Regístrate aquí' : 
                    '¿Ya tienes cuenta? Inicia sesión aquí'
                  }
                </button>
              </div>
            </form>
          </>
        )}

        {/* Formulario */}
        <form onSubmit={isLogin ? handleEmailLogin : handleEmailRegister}>
          {!isLogin && (
            <>
              {/* Información Personal */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  👤 Información Personal
                </h3>
                
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre *"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
                
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido *"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    name="edad"
                    placeholder="Edad *"
                    value={formData.edad}
                    onChange={handleInputChange}
                    required
                    min="16"
                    max="60"
                    style={{
                      flex: '1',
                      padding: '12px',
                      marginBottom: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono *"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: '2',
                      padding: '12px',
                      marginBottom: '12px',
                      background: '#333',
                      border: '1px solid #555',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <input
                  type="text"
                  name="ubicacion"
                  placeholder="Ciudad/Ubicación *"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Información Futbolística */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                  ⚽ Información Futbolística
                </h3>
                
                <select
                  name="posicion"
                  value={formData.posicion}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona tu posición *</option>
                  <option value="portero">🥅 Portero</option>
                  <option value="defensa">🛡️ Defensa</option>
                  <option value="mediocampo">⚡ Mediocampo</option>
                  <option value="delantero">🎯 Delantero</option>
                  <option value="multiple">🔄 Múltiples posiciones</option>
                </select>

                <select
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Nivel de experiencia *</option>
                  <option value="principiante">🌱 Principiante</option>
                  <option value="amateur">⚽ Amateur</option>
                  <option value="intermedio">🏆 Intermedio</option>
                  <option value="avanzado">🥇 Avanzado</option>
                  <option value="profesional">👑 Profesional</option>
                </select>

                <input
                  type="text"
                  name="equipoFavorito"
                  placeholder="Equipo favorito (opcional)"
                  value={formData.equipoFavorito}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />

                <select
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#333',
                    border: '1px solid #555',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Disponibilidad de horarios *</option>
                  <option value="mananas">🌅 Mañanas</option>
                  <option value="tardes">🌞 Tardes</option>
                  <option value="noches">🌙 Noches</option>
                  <option value="fines_semana">📅 Solo fines de semana</option>
                  <option value="flexible">🔄 Horario flexible</option>
                </select>
              </div>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: '#333',
              border: '1px solid #555',
              borderRadius: '6px',
              color: 'white',
              fontSize: '16px'
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña *"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: '#333',
              border: '1px solid #555',
              borderRadius: '6px',
              color: 'white',
              fontSize: '16px'
            }}
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Contraseña *"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: '#333',
                border: '1px solid #555',
                borderRadius: '6px',
                color: 'white',
                fontSize: '16px'
              }}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#999' : '#FFD700',
              color: '#222',
              border: 'none',
              borderRadius: '6px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ Procesando...' : 
             isLogin ? '🔐 Iniciar Sesión' : '📝 Crear mi cuenta FutPro'}
          </button>
          
          {/* Información adicional para registro */}
          {!isLogin && (
            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid #4CAF50',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#4CAF50', 
                fontSize: '14px', 
                margin: '0',
                fontWeight: 'bold'
              }}>
                ✅ Cuenta 100% gratuita • Sin publicidad • Datos seguros
              </p>
            </div>
          )}
        </form>

        {/* Toggle entre login y registro */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                nombre: '',
                apellido: '',
                edad: '',
                telefono: '',
                posicion: '',
                equipoFavorito: '',
                experiencia: '',
                ubicacion: '',
                disponibilidad: ''
              });
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFD700',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 
              '¿No tienes cuenta? Regístrate aquí' : 
              '¿Ya tienes cuenta? Inicia sesión aquí'
            }
          </button>
        </div>

        {loading && (
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            color: '#FFD700',
            fontSize: '14px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid #FFD700',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <p style={{ margin: '10px 0 0 0' }}>Procesando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPageUnificada;