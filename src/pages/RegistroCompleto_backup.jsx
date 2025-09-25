import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import FutproLogo from '../components/FutproLogo.jsx';

const gold = '#FFD700';
const black = '#222';
const darkCard = '#1a1a1a';

export default function RegistroCompleto() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    edad: 18,
    peso: '',
    ciudad: '',
    pais: 'España',
    posicion: 'Delantero',
    frecuencia_juego: 'Semanal',
    avatar_url: null,
    rol: 'usuario',
    tipo_usuario: 'jugador'
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }

      setForm({ ...form, avatar_url: file });

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.warn('⚠️ Error subiendo imagen:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.warn('⚠️ Error en upload:', error);
      return null;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validar paso 1: Información básica
      if (!form.nombre?.trim()) {
        setError('El nombre es obligatorio');
        return;
      }
      if (!form.email?.trim()) {
        setError('El email es obligatorio');
        return;
      }
      if (!form.password) {
        setError('La contraseña es obligatoria');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (form.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError('Por favor ingresa un email válido');
        return;
      }
    }

    if (currentStep === 2) {
      // Validar paso 2: Información deportiva
      if (!form.posicion) {
        setError('La posición es obligatoria');
        return;
      }
      if (!form.frecuencia_juego) {
        setError('La frecuencia de juego es obligatoria');
        return;
      }
      if (form.edad < 13 || form.edad > 60) {
        setError('La edad debe estar entre 13 y 60 años');
        return;
      }
      if (form.peso && (form.peso < 30 || form.peso > 150)) {
        setError('El peso debe estar entre 30 y 150 kg');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      // Validaciones finales
      if (!form.nombre || !form.email || !form.password) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      // Paso 1: Subir imagen primero si existe
      let avatarUrl = null;
      if (form.avatar_url && typeof form.avatar_url === 'object') {
        console.log('📸 Subiendo imagen de perfil...');
        setMsg('Subiendo imagen de perfil...');
        avatarUrl = await uploadImage(form.avatar_url);
        if (!avatarUrl) {
          console.warn('⚠️ No se pudo subir la imagen, continuando sin ella...');
        }
      }

      // Paso 2: Registrar usuario en Supabase Auth
      console.log('📧 Registrando usuario en Supabase Auth...');
      setMsg('Creando cuenta de usuario...');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nombre: form.nombre,
            edad: parseInt(form.edad),
            posicion: form.posicion
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) {
        console.error('❌ Error en Auth:', authError);
        // Manejar errores específicos de captcha
        if (authError.message?.includes('captcha') || authError.message?.includes('verification')) {
          setError('Error de verificación. Por favor intenta nuevamente en unos minutos.');
        } else if (authError.message?.includes('already registered')) {
          setError('Este email ya está registrado. ¿Quieres iniciar sesión?');
        } else {
          setError(`Error de registro: ${authError.message}`);
        }
        setLoading(false);
        return;
      }

      console.log('✅ Usuario registrado en Auth:', authData.user?.email);

      // Paso 3: Crear perfil completo en tabla usuarios
      console.log('👤 Creando perfil en base de datos...');
      setMsg('Completando perfil de jugador...');
      
      const perfilData = {
        id: authData.user.id,
        nombre: form.nombre.trim(),
        email: form.email.toLowerCase().trim(),
        edad: parseInt(form.edad) || null,
        peso: form.peso ? parseFloat(form.peso) : null,
        ciudad: form.ciudad?.trim() || null,
        pais: form.pais?.trim() || 'España',
        posicion: form.posicion,
        frecuencia_juego: form.frecuencia_juego,
        avatar_url: avatarUrl,
        rol: form.rol,
        tipo_usuario: form.tipo_usuario,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: perfilError } = await supabase
        .from('usuarios')
        .insert([perfilData]);

      if (perfilError) {
        console.error('❌ Error creando perfil:', perfilError);
        setError(`Error creando perfil: ${perfilError.message}. Contacta soporte.`);
        setLoading(false);
        return;
      }

      console.log('✅ REGISTRO COMPLETADO EXITOSAMENTE');
      setMsg('¡Registro exitoso! Te hemos enviado un email de verificación. Serás redirigido al login...');
      
      // Limpiar datos temporales
      localStorage.removeItem('tempRegistroData');
      localStorage.removeItem('registroProgreso');
      
        // Redirigir después de 4 segundos
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 4000);    } catch (error) {
      console.error('💥 Error inesperado:', error);
      setError(`Error inesperado: ${error.message}. Por favor intenta nuevamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: darkCard,
        border: `2px solid ${gold}`,
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5)`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FutproLogo size={80} />
          <h1 style={{ color: gold, marginTop: '20px', marginBottom: '10px' }}>
            Registro Completo FutPro
          </h1>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            Paso {currentStep} de 3 - Completa tu perfil de jugador
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: '#333',
          height: '6px',
          borderRadius: '3px',
          marginBottom: '30px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: gold,
            height: '100%',
            width: `${(currentStep / 3) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: '#ff4444',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ❌ {error}
          </div>
        )}

        {msg && (
          <div style={{
            background: '#22c55e',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ✅ {msg}
          </div>
        )}

        {/* Mensaje adicional para el último paso */}
        {currentStep === 3 && (
          <div style={{
            background: '#1a365d',
            color: gold,
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            border: `1px solid ${gold}`
          }}>
            🏆 ¡Último paso! Completa tu ubicación y foto de perfil
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PASO 1: Información básica */}
          {currentStep === 1 && (
            <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #ff4444',
            color: '#ff8888',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {msg && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            color: '#88ffaa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PASO 1: Datos básicos */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ color: gold, marginBottom: '20px' }}>Información Básica</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Confirmar contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    placeholder="Repite tu contraseña"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: gold,
                  color: black,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* PASO 2: Información deportiva */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ color: gold, marginBottom: '20px' }}>Información Deportiva</h3>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={form.edad}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    min="13"
                    max="60"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="peso"
                    value={form.peso}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    placeholder="70"
                    min="30"
                    max="150"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Posición preferida
                </label>
                <select
                  name="posicion"
                  value={form.posicion}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                >
                  <option value="Portero">Portero</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  ¿Con qué frecuencia juegas?
                </label>
                <select
                  name="frecuencia_juego"
                  value={form.frecuencia_juego}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid #444`,
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                >
                  <option value="Diario">Diario</option>
                  <option value="Varias veces por semana">Varias veces por semana</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quincenal">Quincenal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Ocasional">Ocasional</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    flex: 2,
                    padding: '15px',
                    background: gold,
                    color: black,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Foto y ubicación */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ color: gold, marginBottom: '20px' }}>Foto y Ubicación</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                  Foto de perfil (opcional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div style={{
                  border: `2px dashed #444`,
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
                      <p style={{ color: '#ccc' }}>Click para subir foto</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                    placeholder="Tu ciudad"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: gold, display: 'block', marginBottom: '8px' }}>
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={form.pais}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #444`,
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  ← Anterior
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '15px',
                    background: loading ? '#666' : gold,
                    color: black,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Registrando...' : 'Completar Registro ✅'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Volver al login */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#ccc', fontSize: '14px' }}>
            ¿Ya tienes cuenta?{' '}
            <span
              onClick={() => navigate('/')}
              style={{
                color: gold,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}