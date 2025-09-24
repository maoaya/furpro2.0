import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../supabaseClient';
import FutproLogo from '../components/FutproLogo.jsx';
import { conexionEfectiva } from '../services/conexionEfectiva.js';
import { flujoCompletoRegistro } from '../services/flujoCompletoRegistro.js';

// CSS para animación de giro
const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inyectar CSS en el head
if (!document.head.querySelector('#spin-animation')) {
  const style = document.createElement('style');
  style.id = 'spin-animation';
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

export default function RegistroPage({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    edad: 18,
    peso: '',
    ciudad: '',
    pais: 'España',
    posicion: 'Delantero',
    frecuencia_juego: 'Semanal',
    avatar_url: null,
    rol: 'usuario',
    tipo_usuario: 'jugador', // jugador, patrocinador, organizador (solo para rol usuario)
    funciones_adicionales: [] // funciones adicionales para usuarios
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaving, setAutoSaving] = useState(false);
  const [showOAuthStep, setShowOAuthStep] = useState(false);

  // Verificar estado OAuth y recuperar datos al cargar la página
  useEffect(() => {
    const verificarEstadoInicial = async () => {
      console.log('🔍 VERIFICANDO ESTADO INICIAL DEL REGISTRO...');
      
      try {
        const estado = await flujoCompletoRegistro.verificarEstadoRegistro();
        console.log('📊 Estado del registro:', estado);
        
        if (estado.estado === 'completo') {
          console.log('✅ Usuario ya registrado completamente, redirigiendo...');
          setMsg('¡Ya tienes una cuenta! Redirigiendo al dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        
        if (estado.estado === 'oauth_incompleto') {
          console.log('⚠️ OAuth exitoso, completando registro...');
          setMsg('OAuth exitoso! Completa tu perfil para terminar el registro.');
          
          // Pre-llenar datos del OAuth si están disponibles
          if (estado.usuarioOAuth) {
            const oauthData = estado.usuarioOAuth;
            setForm(prev => ({
              ...prev,
              nombre: oauthData.user_metadata?.full_name || oauthData.email.split('@')[0],
              avatar_url: oauthData.user_metadata?.avatar_url || null
            }));
          }
        }
        
      } catch (error) {
        console.error('❌ Error verificando estado inicial:', error);
      }
      
      // Recuperar datos temporales como fallback
      const progressData = localStorage.getItem('registroProgreso');
      const tempData = localStorage.getItem('tempRegistroData');
      
      if (progressData) {
        try {
          const parsedProgress = JSON.parse(progressData);
          console.log('🔄 Recuperando progreso guardado:', parsedProgress);
          setForm(prev => ({ ...prev, ...parsedProgress }));
          setCurrentStep(parsedProgress.step || 1);
        } catch (error) {
          console.error('❌ Error al recuperar progreso:', error);
        }
      } else if (tempData) {
        try {
          const parsedData = JSON.parse(tempData);
          console.log('🔄 Recuperando datos temporales del registro:', parsedData);
          setForm(prev => ({ ...prev, ...parsedData }));
        } catch (error) {
          console.error('❌ Error al recuperar datos temporales:', error);
        }
      }
    };
    
    verificarEstadoInicial();
  }, [navigate]);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 RegistroPage - Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        setMsg('¡Registro completado! Redirigiendo al formulario de inscripción...');
        onRegisterSuccess && onRegisterSuccess(session.user);

        // Redirigir al formulario de validación después de un breve delay
        setTimeout(() => {
          navigate('/validar-usuario');
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, onRegisterSuccess]);

  const handleChange = e => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    
    // Guardar temporalmente en localStorage mientras edita
    localStorage.setItem('tempRegistroData', JSON.stringify(newForm));
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
      // Verificar si el bucket existe
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('⚠️ No se puede acceder al storage, continuando sin imagen');
        return null;
      }

      const avatarBucket = buckets.find(bucket => bucket.name === 'avatars');
      
      if (!avatarBucket) {
        console.warn('⚠️ Bucket "avatars" no existe, continuando sin imagen');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.warn('⚠️ Error subiendo imagen, continuando sin imagen:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.warn('⚠️ Error en uploadImage, continuando sin imagen:', error);
      return null;
    }
  };

  const validateForm = () => {
    if (!form.nombre.trim()) return 'El nombre es obligatorio';
    if (!form.edad || form.edad < 8 || form.edad > 100) return 'La edad debe estar entre 8 y 100 años';
    if (!form.peso || form.peso < 20 || form.peso > 200) return 'El peso debe estar entre 20 y 200 kg';
    if (!form.ciudad.trim()) return 'La ciudad es obligatoria';
    if (!form.pais.trim()) return 'El país es obligatorio';
    if (!form.posicion) return 'La posición es obligatoria';
    if (!form.frecuencia_juego) return 'La frecuencia de juego es obligatoria';
    if (!form.rol) return 'Debes seleccionar un rol';
    return null;
  };

  // Función para limpiar datos después de registro exitoso
  const limpiarDatosTemporales = () => {
    localStorage.removeItem('registroProgreso');
    localStorage.removeItem('tempRegistroData');
    console.log('🧹 Datos temporales limpiados');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('🚀 SUBMIT INICIADO - Datos del formulario:', form);

    const validationError = validateForm();
    if (validationError) {
      console.error('❌ Error de validación:', validationError);
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setMsg('Procesando registro...');

    try {
      // Subir imagen si existe
      let avatarUrl = null;
      if (form.avatar_url && typeof form.avatar_url === 'object') {
        console.log('📸 Subiendo imagen de perfil...');
        avatarUrl = await uploadImage(form.avatar_url);
        console.log('✅ Imagen subida:', avatarUrl);
      }

      // Preparar datos del perfil
      const profileData = {
        nombre: form.nombre.trim(),
        edad: parseInt(form.edad),
        peso: form.peso ? parseFloat(form.peso) : null,
        ciudad: form.ciudad.trim(),
        pais: form.pais.trim(),
        posicion: form.posicion.trim(),
        frecuencia_juego: form.frecuencia_juego,
        avatar_url: avatarUrl || form.avatar_url || null,
        rol: form.rol,
        tipo_usuario: form.tipo_usuario || 'jugador',
        funciones_adicionales: form.funciones_adicionales || []
      };

      console.log('📋 Datos del perfil preparados:', profileData);

      // Verificar si hay OAuth activo y completar registro
      const estado = await flujoCompletoRegistro.verificarEstadoRegistro();
      
      if (estado.estado === 'oauth_incompleto') {
        console.log('🔗 OAuth detectado, completando registro...');
        setMsg('Completando registro con OAuth...');
        
        const resultado = await flujoCompletoRegistro.completarRegistroPostOAuth(profileData);
        
        if (resultado.success) {
          setMsg(`✅ ${resultado.message}! Redirigiendo al dashboard...`);
          limpiarDatosTemporales();
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          
        } else {
          throw new Error(resultado.error);
        }
        
      } else {
        // No hay OAuth, mostrar opciones OAuth
        console.log('⚠️ No hay OAuth activo, mostrando opciones...');
        localStorage.setItem('pendingProfileData', JSON.stringify(profileData));
        setMsg('¡Perfil completado! Ahora selecciona tu método de registro:');
        setShowOAuthStep(true);
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      setError(error.message || 'Error al procesar el registro');
      setLoading(false);
    }
  };

  // Funciones para OAuth - CONEXIÓN REAL Y EFECTIVA
  const handleGoogleAuth = async () => {
    setLoading(true);
    setMsg('🚀 Estableciendo conexión real con Google...');
    
    try {
      console.log('🔗 INICIANDO CONEXIÓN EFECTIVA CON GOOGLE...');
      const resultado = await conexionEfectiva.registrarConGoogle();
      
      if (resultado.success) {
        setMsg('✅ ¡Conexión establecida! Redirigiendo a Google...');
        // La redirección se maneja automáticamente
      } else {
        setError(`Error en conexión: ${resultado.error}`);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error estableciendo conexión efectiva:', error);
      setError('Error al establecer conexión con Google');
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    setMsg('🚀 Estableciendo conexión real con Facebook...');
    
    try {
      console.log('🔗 INICIANDO CONEXIÓN EFECTIVA CON FACEBOOK...');
      const resultado = await conexionEfectiva.registrarConFacebook();
      
      if (resultado.success) {
        setMsg('✅ ¡Conexión establecida! Redirigiendo a Facebook...');
        // La redirección se maneja automáticamente
      } else {
        setError(`Error en conexión: ${resultado.error}`);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error estableciendo conexión efectiva:', error);
      setError('Error al establecer conexión con Facebook');
      setLoading(false);
    }
  };

  const nextStep = () => {
    console.log(`🔄 nextStep llamado. currentStep actual: ${currentStep}`);
    
    // Validación del paso 1
    if (currentStep === 1) {
      console.log('📝 Validando paso 1:', { nombre: form.nombre, edad: form.edad });
      if (!form.nombre.trim()) {
        setError('El nombre es obligatorio para continuar');
        console.log('❌ Error: nombre vacío');
        return;
      }
      if (!form.edad || form.edad < 8 || form.edad > 100) {
        setError('La edad debe estar entre 8 y 100 años');
        console.log('❌ Error: edad inválida');
        return;
      }
    }
    
    // Validación del paso 2
    if (currentStep === 2) {
      console.log('📝 Validando paso 2:', { pais: form.pais, posicion: form.posicion });
      if (!form.pais.trim()) {
        setError('El país es obligatorio para continuar');
        console.log('❌ Error: país vacío');
        return;
      }
      if (!form.posicion.trim()) {
        setError('La posición es obligatoria para continuar');
        console.log('❌ Error: posición vacía');
        return;
      }
    }
    
    setError(''); // Limpiar errores si la validación pasa
    if (currentStep < 3) {
      console.log(`✅ Validación pasada. Avanzando del paso ${currentStep} al paso ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('⚠️ Ya estás en el último paso (3)');
    }
  };

  const completarPerfil = async () => {
    console.log('🔥 COMPLETAR PERFIL CLICKEADO - Formulario:', form);
    await handleSubmit({ preventDefault: () => {} });
  };

  // Función para guardar automáticamente en cada paso
  const guardarProgreso = async () => {
    const progressData = {
      ...form,
      step: currentStep,
      timestamp: new Date().toISOString()
    };
    
    // Solo guardar si hay datos significativos
    const hasSignificantData = form.nombre || form.email || 
                              form.pais || form.posicion || 
                              form.edad || currentStep > 1;
    
    if (hasSignificantData) {
      setAutoSaving(true);
      localStorage.setItem('registroProgreso', JSON.stringify(progressData));
      console.log(`💾 Progreso guardado automáticamente - Paso ${currentStep}`, 
                  { datos: Object.keys(form).filter(key => form[key]).length });
      
      // Mostrar indicador por un momento
      setTimeout(() => setAutoSaving(false), 1000);
    }
  };

  // Auto-guardar cuando cambia el paso
  useEffect(() => {
    if (currentStep > 1) {
      guardarProgreso();
    }
  }, [currentStep]);

  // Auto-guardar cuando cambian los datos importantes
  useEffect(() => {
    if (form.nombre || form.edad || form.pais || form.posicion) {
      const timeoutId = setTimeout(() => {
        guardarProgreso();
      }, 1000); // Guardar después de 1 segundo de inactividad

      return () => clearTimeout(timeoutId);
    }
  }, [form.nombre, form.edad, form.pais, form.posicion, currentStep]);

  const prevStep = () => {
    // No permitir ir hacia atrás desde el paso 3 si ya se completó el perfil
    if (currentStep === 3 && msg.includes('Perfil guardado')) {
      console.log('⚠️ No se puede ir hacia atrás después de guardar el perfil');
      return;
    }
    
    if (currentStep > 1) {
      console.log(`🔙 Retrocediendo del paso ${currentStep} al paso ${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
      setError(''); // Limpiar errores al cambiar de paso
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      color: '#FFD700',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(255, 215, 0, 0.1)',
        border: '2px solid #FFD700',
        maxWidth: '600px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Logo y título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FutproLogo size={80} />
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '20px 0 10px 0',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Crear Perfil FutPro
          </h1>
          <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
            Completa tu perfil para generar tu card inicial
          </p>
        </div>

        {/* Indicador de progreso */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          gap: '10px'
        }}>
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              style={{
                width: '35px',
                height: '4px',
                background: step <= currentStep ? '#FFD700' : '#333',
                borderRadius: '2px',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Paso 1: Información básica */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
                📋 Información Personal
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Nombre Completo *
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Edad *
                    </label>
                    <input
                      name="edad"
                      type="number"
                      value={form.edad}
                      onChange={handleChange}
                      placeholder="8"
                      min="8"
                      max="100"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Peso (kg) *
                    </label>
                    <input
                      name="peso"
                      type="number"
                      value={form.peso}
                      onChange={handleChange}
                      placeholder="25"
                      min="20"
                      max="200"
                      step="0.1"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Ciudad *
                    </label>
                    <input
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                      placeholder="Tu ciudad"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      País *
                    </label>
                    <input
                      name="pais"
                      value={form.pais}
                      onChange={handleChange}
                      placeholder="Tu país"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Información de fútbol */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
                ⚽ Información de Fútbol
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Posición Favorita *
                  </label>
                  <select
                    name="posicion"
                    value={form.posicion}
                    onChange={handleChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Selecciona tu posición</option>
                    <option value="portero">Portero</option>
                    <option value="defensa">Defensa</option>
                    <option value="mediocampista">Mediocampista</option>
                    <option value="delantero">Delantero</option>
                    <option value="ala">Ala</option>
                    <option value="central">Central</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    ¿Cuántas veces juegas por semana? *
                  </label>
                  <select
                    name="frecuencia_juego"
                    value={form.frecuencia_juego}
                    onChange={handleChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Selecciona frecuencia</option>
                    <option value="1">1 vez por semana</option>
                    <option value="2">2 veces por semana</option>
                    <option value="3">3 veces por semana</option>
                    <option value="4">4 veces por semana</option>
                    <option value="5">5 veces por semana</option>
                    <option value="6-7">6-7 veces por semana</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Foto de perfil y cuenta */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
                📸 Foto de Perfil & Cuenta
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Foto de perfil */}
                <div style={{ textAlign: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Foto de Perfil (Opcional)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      border: '3px solid #FFD700',
                      margin: '0 auto 15px',
                      background: previewImage ? `url(${previewImage})` : '#333',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {!previewImage && '📷'}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Haz clic para seleccionar imagen
                  </p>
                </div>

                {/* Mensaje sobre registro social */}
                <div style={{ 
                  background: 'rgba(255, 215, 0, 0.1)', 
                  border: '2px solid #FFD700', 
                  borderRadius: '10px', 
                  padding: '20px', 
                  textAlign: 'center',
                  marginTop: '20px'
                }}>
                  <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>
                    🔐 Registro Social
                  </h4>
                  <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.4 }}>
                    Una vez completes tu perfil, podrás registrarte usando tu cuenta de <strong>Google</strong> o <strong>Facebook</strong>.
                    <br />
                    ¡No necesitas crear contraseñas adicionales!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Selección de Rol */}
          {currentStep === 4 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ color: '#FFD700', marginBottom: '20px', textAlign: 'center' }}>
                👥 Selecciona tu Rol
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Selección de rol principal */}
                <div>
                  <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ¿Cuál es tu rol principal en FutPro? *
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {/* Tarjeta Usuario */}
                    <div
                      onClick={() => setForm({...form, rol: 'usuario'})}
                      style={{
                        padding: '20px',
                        border: form.rol === 'usuario' ? '3px solid #FFD700' : '2px solid #444',
                        borderRadius: '12px',
                        background: form.rol === 'usuario' 
                          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)'
                          : 'rgba(40, 40, 40, 0.8)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚽</div>
                      <h4 style={{ 
                        color: form.rol === 'usuario' ? '#FFD700' : '#fff',
                        fontSize: '1.2rem',
                        marginBottom: '8px',
                        fontWeight: 'bold'
                      }}>
                        Usuario Jugador
                      </h4>
                      <p style={{ 
                        color: form.rol === 'usuario' ? '#FFA500' : '#ccc',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        Juega partidos, genera cards, participa en torneos y sube de nivel
                      </p>
                    </div>

                    {/* Tarjeta Árbitro */}
                    <div
                      onClick={() => setForm({...form, rol: 'arbitro'})}
                      style={{
                        padding: '20px',
                        border: form.rol === 'arbitro' ? '3px solid #FFD700' : '2px solid #444',
                        borderRadius: '12px',
                        background: form.rol === 'arbitro' 
                          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)'
                          : 'rgba(40, 40, 40, 0.8)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔶</div>
                      <h4 style={{ 
                        color: form.rol === 'arbitro' ? '#FFD700' : '#fff',
                        fontSize: '1.2rem',
                        marginBottom: '8px',
                        fontWeight: 'bold'
                      }}>
                        Árbitro
                      </h4>
                      <p style={{ 
                        color: form.rol === 'arbitro' ? '#FFA500' : '#ccc',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        Arbitra partidos, valida resultados y mantiene el fair play
                      </p>
                    </div>
                  </div>
                </div>

                {/* Funciones adicionales para usuarios */}
                {form.rol === 'usuario' && (
                  <div style={{
                    background: 'rgba(255, 215, 0, 0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #FFD700'
                  }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '15px', 
                      fontWeight: 'bold',
                      color: '#FFD700'
                    }}>
                      ¿También te interesa ser? (Opcional)
                    </label>
                    
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {[
                        { key: 'organizador', label: 'Organizador de Torneos', icon: '🏆' },
                        { key: 'entrenador', label: 'Entrenador de Equipos', icon: '📋' },
                        { key: 'scout', label: 'Scout/Cazatalentos', icon: '🔍' },
                        { key: 'analista', label: 'Analista de Datos', icon: '📊' }
                      ].map(funcion => (
                        <label 
                          key={funcion.key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={form.funciones_adicionales?.includes(funcion.key) || false}
                            onChange={(e) => {
                              const funciones = form.funciones_adicionales || [];
                              if (e.target.checked) {
                                setForm({
                                  ...form,
                                  funciones_adicionales: [...funciones, funcion.key]
                                });
                              } else {
                                setForm({
                                  ...form,
                                  funciones_adicionales: funciones.filter(f => f !== funcion.key)
                                });
                              }
                            }}
                            style={{
                              width: '18px',
                              height: '18px',
                              accentColor: '#FFD700'
                            }}
                          />
                          <span style={{ fontSize: '1.2rem' }}>{funcion.icon}</span>
                          <span style={{ color: '#fff', fontSize: '1rem' }}>{funcion.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información para árbitros */}
                {form.rol === 'arbitro' && (
                  <div style={{
                    background: 'rgba(255, 215, 0, 0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #FFD700'
                  }}>
                    <h4 style={{ color: '#FFD700', marginBottom: '15px' }}>
                      🔶 Funciones del Árbitro
                    </h4>
                    <ul style={{ color: '#ccc', lineHeight: '1.6', paddingLeft: '20px' }}>
                      <li>Validar resultados de partidos</li>
                      <li>Gestionar tarjetas y sanciones</li>
                      <li>Supervisar fair play</li>
                      <li>Generar reportes de partidos</li>
                      <li>Mediar en conflictos deportivos</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navegación entre pasos */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
            gap: '15px'
          }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                style={navButtonStyle}
              >
                ← Anterior
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                style={{ ...navButtonStyle, marginLeft: 'auto' }}
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="button"
                disabled={loading || !form.rol}
                onClick={completarPerfil}
                style={{
                  ...submitButtonStyle,
                  opacity: (!form.rol) ? 0.6 : 1,
                  cursor: (!form.rol) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '⏳ Guardando Perfil...' : '🎯 Completar Perfil'}
              </button>
            )}
          </div>

          {/* Mensajes */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(255, 71, 87, 0.1)',
              border: '1px solid #ff4757',
              borderRadius: '8px',
              color: '#ff4757',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {msg && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(0, 184, 148, 0.1)',
              border: '1px solid #00b894',
              borderRadius: '8px',
              color: '#00b894',
              textAlign: 'center'
            }}>
              ✅ {msg}
            </div>
          )}

          {/* Indicador de auto-guardado */}
          {autoSaving && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid #FFD700',
              borderRadius: '6px',
              color: '#FFD700',
              textAlign: 'center',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
              Guardando progreso automáticamente...
            </div>
          )}

        </form>

        {/* Sección de OAuth - aparece después de completar el perfil */}
        {showOAuthStep && (
          <div style={{
            marginTop: '30px',
            padding: '30px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: '15px', fontSize: '1.5rem' }}>
              🔐 Completa tu Registro
            </h3>
            <p style={{ color: '#ccc', marginBottom: '25px', lineHeight: '1.5' }}>
              Tu perfil está listo. Ahora conecta con tu cuenta de Google o Facebook para completar el registro:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
              {/* Botón Google */}
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                style={{
                  padding: '15px 20px',
                  background: '#4285f4',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                🔵 Continuar con Google
              </button>

              {/* Botón Facebook */}
              <button
                onClick={handleFacebookAuth}
                disabled={loading}
                style={{
                  padding: '15px 20px',
                  background: '#1877f2',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                🔷 Continuar con Facebook
              </button>
            </div>

            <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '20px' }}>
              Al continuar, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Estilos
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '2px solid #FFD700',
  background: 'rgba(255, 255, 255, 0.05)',
  color: '#FFD700',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer'
};

const navButtonStyle = {
  padding: '12px 24px',
  background: 'transparent',
  border: '2px solid #FFD700',
  borderRadius: '8px',
  color: '#FFD700',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const submitButtonStyle = {
  padding: '15px 30px',
  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
  border: 'none',
  borderRadius: '8px',
  color: '#000',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginLeft: 'auto',
  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
};
