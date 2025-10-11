import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function RegistroCompleto() {
  console.log('🔧 RegistroCompleto cargado (versión limpia sin duplicados)');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImagen, setPreviewImagen] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    email: '',
    password: '',
    confirmPassword: '',
    
    // Paso 2: Información personal
    nombre: '',
    apellido: '',
    edad: 18,
    telefono: '',
    pais: 'México',
    ubicacion: '',
    
    // Paso 3: Información futbolística
    posicion: '',
    experiencia: '',
    equipoFavorito: '',
    peso: '',
    
    // Paso 4: Disponibilidad
    disponibilidad: '',
    vecesJuegaPorSemana: '',
    horariosPreferidos: '',
    
    // Paso 5: Foto de perfil
    foto: null
  });

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (paso > 1 && formData.email && formData.nombre) {
        autoGuardarProgreso();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [paso, formData]);

  // Cargar progreso guardado al montar el componente
  useEffect(() => {
    const datosSalvados = localStorage.getItem('futpro_registro_progreso');
    if (datosSalvados) {
      try {
        const datos = JSON.parse(datosSalvados);
        setFormData(prev => ({ ...prev, ...datos }));
        setLastSaved(new Date().toLocaleTimeString());
      } catch (e) {
        console.log('Error cargando datos guardados:', e);
      }
    }
  }, []);

  const autoGuardarProgreso = async () => {
    if (!formData.email || !formData.nombre) return;
    
    setAutoSaving(true);
    try {
      localStorage.setItem('futpro_registro_progreso', JSON.stringify(formData));
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.log('Error auto-guardando:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-guardar cuando el usuario escriba
    if (name === 'email' || name === 'nombre' || name === 'apellido') {
      setTimeout(autoGuardarProgreso, 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!tiposPermitidos.includes(file.type)) {
        setError('Solo se permiten archivos JPG, PNG y JPEG');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo debe ser menor a 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, foto: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImagen(e.target.result);
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const validarPaso = () => {
    switch (paso) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Por favor completa todos los campos obligatorios');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return false;
        }
        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return false;
        }
        break;
      case 2:
        if (!formData.nombre || !formData.apellido || !formData.edad || !formData.telefono || !formData.ubicacion) {
          setError('Por favor completa todos los campos obligatorios');
          return false;
        }
        if (formData.edad < 16 || formData.edad > 60) {
          setError('La edad debe estar entre 16 y 60 años');
          return false;
        }
        break;
      case 3:
        if (!formData.posicion || !formData.experiencia || !formData.equipoFavorito) {
          setError('Por favor completa todos los campos obligatorios');
          return false;
        }
        break;
      case 4:
        if (!formData.disponibilidad || !formData.vecesJuegaPorSemana) {
          setError('Por favor completa todos los campos obligatorios');
          return false;
        }
        break;
      case 5:
        // La foto es opcional en el último paso
        break;
    }
    setError('');
    return true;
  };

  const siguientePaso = () => {
    if (validarPaso()) {
      setPaso(prev => Math.min(prev + 1, 5));
      autoGuardarProgreso();
    }
  };

  const pasoAnterior = () => {
    setPaso(prev => Math.max(prev - 1, 1));
  };

  const subirFoto = async () => {
    if (!formData.foto) return null;

    try {
      const fileName = `perfil_${Date.now()}_${formData.email.replace('@', '_')}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData.foto);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error subiendo foto:', error);
      throw error;
    }
  };

  const completarRegistro = async () => {
    if (!validarPaso()) return;

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Iniciando registro completo...', formData);

      // 1. Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido
          }
        }
      });

      if (authError) throw authError;

      // 2. Subir foto si existe
      let fotoUrl = null;
      if (formData.foto) {
        try {
          fotoUrl = await subirFoto();
        } catch (fotoError) {
          console.warn('Error subiendo foto, continuando sin foto:', fotoError);
        }
      }

      // 3. Crear perfil en la tabla usuarios
      const perfilData = {
        id: authData.user.id,
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: parseInt(formData.edad),
        telefono: formData.telefono,
        pais: formData.pais,
        ubicacion: formData.ubicacion,
        posicion: formData.posicion,
        experiencia: formData.experiencia,
        equipo_favorito: formData.equipoFavorito,
        peso: formData.peso ? parseInt(formData.peso) : null,
        disponibilidad: formData.disponibilidad,
        veces_juega_semana: formData.vecesJuegaPorSemana,
        horarios_preferidos: formData.horariosPreferidos,
        foto_perfil: fotoUrl,
        created_at: new Date().toISOString()
      };

      const { error: perfilError } = await supabase
        .from('usuarios')
        .insert([perfilData]);

      if (perfilError) throw perfilError;

      // 4. Limpiar datos guardados
      localStorage.removeItem('futpro_registro_progreso');
      localStorage.setItem('registroCompleto', 'true');
      localStorage.setItem('authCompleted', 'true');

      setSuccess('¡Registro completado exitosamente! Redirigiendo a tu perfil...');

      // 5. Redirección a la card de perfil
      setTimeout(() => {
        try {
          navigate('/perfil-card', { 
            replace: true, 
            state: { 
              newUser: true, 
              userData: perfilData 
            } 
          });
        } catch (navError) {
          console.warn('Error con navigate, usando window.location');
          window.location.href = '/perfil-card';
        }
      }, 2000);

    } catch (error) {
      console.error('Error en registro:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPaso = () => {
    switch (paso) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              🚀 Paso 1: Datos de Acceso
            </h2>
            
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                📧 Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                🔒 Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                🔒 Confirmar Contraseña *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              👤 Paso 2: Información Personal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  👤 Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  👤 Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  🎂 Edad *
                </label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  min="16"
                  max="60"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  📞 Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="+52 123 456 7890"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  🌍 País *
                </label>
                <select
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="México">México</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colombia">Colombia</option>
                  <option value="España">España</option>
                  <option value="Chile">Chile</option>
                  <option value="Perú">Perú</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  📍 Ciudad/Ubicación *
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="Ciudad donde juegas"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              ⚽ Paso 3: Información Futbolística
            </h2>
            
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                🎯 Posición Principal *
              </label>
              <select
                name="posicion"
                value={formData.posicion}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Selecciona tu posición</option>
                <option value="Portero">🥅 Portero</option>
                <option value="Defensa Central">🛡️ Defensa Central</option>
                <option value="Lateral Derecho">➡️ Lateral Derecho</option>
                <option value="Lateral Izquierdo">⬅️ Lateral Izquierdo</option>
                <option value="Mediocentro Defensivo">🔒 Mediocentro Defensivo</option>
                <option value="Mediocentro">⚙️ Mediocentro</option>
                <option value="Mediocentro Ofensivo">🎨 Mediocentro Ofensivo</option>
                <option value="Extremo Derecho">🚀 Extremo Derecho</option>
                <option value="Extremo Izquierdo">🚀 Extremo Izquierdo</option>
                <option value="Delantero Centro">🎯 Delantero Centro</option>
                <option value="Segundo Delantero">👑 Segundo Delantero</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                📈 Años de Experiencia *
              </label>
              <select
                name="experiencia"
                value={formData.experiencia}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Selecciona tu experiencia</option>
                <option value="Principiante (0-2 años)">🌱 Principiante (0-2 años)</option>
                <option value="Intermedio (3-5 años)">📈 Intermedio (3-5 años)</option>
                <option value="Avanzado (6-10 años)">⭐ Avanzado (6-10 años)</option>
                <option value="Experto (11+ años)">🏆 Experto (11+ años)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                ⚽ Equipo Favorito *
              </label>
              <input
                type="text"
                name="equipoFavorito"
                value={formData.equipoFavorito}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="Real Madrid, Barcelona, etc."
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                ⚖️ Peso (kg) - Opcional
              </label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                min="40"
                max="150"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="Tu peso en kg"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              📅 Paso 4: Disponibilidad
            </h2>
            
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                🕐 Disponibilidad General *
              </label>
              <select
                name="disponibilidad"
                value={formData.disponibilidad}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Selecciona tu disponibilidad</option>
                <option value="Solo fines de semana">📅 Solo fines de semana</option>
                <option value="Entre semana (tardes)">🌆 Entre semana (tardes)</option>
                <option value="Entre semana (mañanas)">🌅 Entre semana (mañanas)</option>
                <option value="Cualquier día">🎯 Cualquier día</option>
                <option value="Horarios rotativos">🔄 Horarios rotativos</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                📊 ¿Cuántas veces juegas por semana? *
              </label>
              <select
                name="vecesJuegaPorSemana"
                value={formData.vecesJuegaPorSemana}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Selecciona frecuencia</option>
                <option value="1 vez por semana">1️⃣ 1 vez por semana</option>
                <option value="2-3 veces por semana">2️⃣ 2-3 veces por semana</option>
                <option value="4-5 veces por semana">3️⃣ 4-5 veces por semana</option>
                <option value="Todos los días">🔥 Todos los días</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                ⏰ Horarios Preferidos - Opcional
              </label>
              <textarea
                name="horariosPreferidos"
                value={formData.horariosPreferidos}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="Ej: Lunes y miércoles 7pm, Sábados 10am..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              📸 Paso 5: Foto de Perfil
            </h2>
            
            <div className="text-center">
              {previewImagen ? (
                <div className="mb-6">
                  <img
                    src={previewImagen}
                    alt="Preview"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-yellow-400"
                  />
                  <p className="text-green-400 text-sm mt-2">¡Foto cargada correctamente!</p>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gray-700 flex items-center justify-center border-4 border-gray-600 mb-6">
                  <span className="text-4xl">📸</span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📷 {previewImagen ? 'Cambiar Foto' : 'Seleccionar Foto'}
              </button>

              <p className="text-gray-400 text-sm mt-4">
                Formatos: JPG, PNG • Tamaño máximo: 5MB • La foto es opcional
              </p>
            </div>

            <div className="bg-green-900 border border-green-600 rounded-lg p-4 text-center">
              <h3 className="text-green-400 font-semibold text-lg mb-2">
                🎉 ¡Casi listo!
              </h3>
              <p className="text-green-300 text-sm">
                Estás a punto de completar tu registro en FutPro. 
                Haz clic en "Completar Registro" para crear tu cuenta y acceder a tu perfil.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ⚽
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Registro FutPro
          </h1>
          <p className="text-gray-400 mt-2">Crea tu perfil profesional de fútbol</p>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  num <= paso
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(paso / 5) * 100}%` }}
            />
          </div>
          <p className="text-center text-gray-400 text-sm mt-2">
            Paso {paso} de 5
          </p>
        </div>

        {/* Auto-guardado indicator */}
        {lastSaved && (
          <div className="mb-4 text-center text-xs text-gray-500">
            {autoSaving ? (
              <span className="text-yellow-400">💾 Guardando...</span>
            ) : (
              <span>💾 Guardado automático: {lastSaved}</span>
            )}
          </div>
        )}

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg text-red-300 text-center">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-lg text-green-300 text-center">
            ✅ {success}
          </div>
        )}

        {/* Contenido del paso actual */}
        <form onSubmit={(e) => e.preventDefault()}>
          {renderPaso()}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={pasoAnterior}
              disabled={paso === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                paso === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              ← Anterior
            </button>

            {paso < 5 ? (
              <button
                type="button"
                onClick={siguientePaso}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all"
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="button"
                onClick={completarRegistro}
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                }`}
              >
                {loading ? '⏳ Registrando...' : '🚀 Completar Registro'}
              </button>
            )}
          </div>
        </form>

        {/* Botón para volver al login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-yellow-400 hover:text-yellow-300 text-sm underline transition-colors"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-xs">
            🔒 Tus datos están seguros y encriptados
          </p>
        </div>
      </div>
    </div>
  );
}