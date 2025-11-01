import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { useAuth } from '../context/AuthContext.jsx';
import { useActivityTracker, useFormTracker, useUploadTracker } from '../hooks/useActivityTracker';
import '../styles/registro-animations.css';

const RegistroNuevo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  
  // Estado del formulario paso a paso
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // 🔥 TRACKING HOOKS - AUTOGUARDADO TIPO REDES SOCIALES
  const tracker = useActivityTracker();
  const formTracker = useFormTracker('registro_completo', paso);
  const { trackUpload } = useUploadTracker();

  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    email: '',
    password: '',
    confirmPassword: '',
    
    // Paso 2: Información personal
    nombre: '',
    apellido: '',
  edad: 8,
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

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (paso > 1 && formData.email && formData.nombre) {
        autoGuardarProgreso();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [paso, formData]);

  // Cargar datos guardados al iniciar
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
    setError('');
    
    // 🔥 TRACK FIELD INPUT AUTOMÁTICAMENTE (COMO REDES SOCIALES)
    formTracker.trackField(name, value);
    
    // Auto-guardar después de cambios importantes
    if (name === 'email' || name === 'nombre' || name === 'apellido') {
      setTimeout(() => autoGuardarProgreso(), 2000);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPerfil(file);
      setFormData(prev => ({ ...prev, foto: file }));
      
      // 🔥 TRACK PHOTO UPLOAD AUTOMÁTICAMENTE
      trackUpload(file, 'profile_registration');
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImagen(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validarPaso = (numeroPaso) => {
    switch (numeroPaso) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Por favor completa todos los campos básicos');
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
          setError('Por favor completa todos los campos personales');
          return false;
        }
        if (formData.edad < 16 || formData.edad > 60) {
          setError('La edad debe estar entre 16 y 60 años');
          return false;
        }
        break;
        
      case 3:
        if (!formData.posicion || !formData.experiencia || !formData.equipoFavorito) {
          setError('Por favor completa la información futbolística');
          return false;
        }
        break;
        
      case 4:
        if (!formData.disponibilidad || !formData.vecesJuegaPorSemana) {
          setError('Por favor completa la información de disponibilidad');
          return false;
        }
        break;
    }
    
    setError('');
    return true;
  };

  const siguientePaso = () => {
    if (validarPaso(paso)) {
      // 🔥 TRACK STEP COMPLETION
      formTracker.trackStepComplete(paso);
      
      setPaso(paso + 1);
      window.scrollTo(0, 0);
    }
  };

  const pasoAnterior = () => {
    // 🔥 TRACK STEP BACK
    tracker.track('form_step_back', { fromStep: paso, toStep: paso - 1 });
    
    setPaso(paso - 1);
    setError('');
    window.scrollTo(0, 0);
  };

  const completarRegistro = async () => {
    if (!validarPaso(4)) return;
    
    setLoading(true);
    setError('');
    
    // 🔥 TRACK FINAL SUBMISSION START
    tracker.track('registration_final_attempt', { 
      step: 5, 
      hasPhoto: !!imagenPerfil,
      formData: {
        hasNombre: !!formData.nombre,
        hasEmail: !!formData.email,
        hasPosicion: !!formData.posicion,
        hasExperiencia: !!formData.experiencia
      }
    }, true);
    
    try {
      // 1. Crear cuenta en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.nombre} ${formData.apellido}`,
            display_name: formData.nombre
          }
        }
      });

      if (authError) {
        if (authError.message?.includes('already registered')) {
          setError('Este email ya está registrado. ¿Deseas iniciar sesión?');
          
          // 🔥 TRACK DUPLICATE EMAIL
          tracker.track('registration_duplicate_email', { 
            email: formData.email.substring(0, 3) + '***' 
          }, true);
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // 2. Subir foto de perfil con configuración mejorada
      let fotoUrl = null;
      let fotoPath = null;
      
      if (imagenPerfil) {
        setSuccess('Subiendo foto de perfil...');
        
        // 🔥 TRACK PHOTO UPLOAD START
        tracker.track('profile_photo_upload_start', { 
          fileName: imagenPerfil.name,
          fileSize: imagenPerfil.size 
        });
        
        // Crear nombre único para la foto
        const fileExt = imagenPerfil.name.split('.').pop().toLowerCase();
        const fileName = `perfil_${authData.user.id}_${Date.now()}.${fileExt}`;
        fotoPath = fileName;
        
        try {
          // Subir a bucket public de avatars
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, imagenPerfil, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.warn('⚠️ Error subiendo foto:', uploadError.message);
            // Continuar sin foto si falla
          } else {
            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            fotoUrl = publicUrl;
            console.log('✅ Foto subida exitosamente:', fotoUrl);
          }
        } catch (photoError) {
          console.warn('⚠️ Error en proceso de foto:', photoError);
          // Continuar sin foto
        }
      }

      // 3. Calcular puntaje inicial basado en datos del formulario
      const calcularPuntajeInicial = () => {
        let puntaje = 50; // Base
        
        // Puntos por experiencia
        switch(formData.experiencia.toLowerCase()) {
          case 'principiante': puntaje += 10; break;
          case 'intermedio': puntaje += 25; break;
          case 'avanzado': puntaje += 40; break;
          case 'semi-profesional': puntaje += 55; break;
          case 'profesional': puntaje += 70; break;
        }
        
        // Puntos por frecuencia de juego
        const frecuencia = parseInt(formData.vecesJuegaPorSemana);
        if (frecuencia >= 5) puntaje += 20;
        else if (frecuencia >= 3) puntaje += 15;
        else if (frecuencia >= 2) puntaje += 10;
        else if (frecuencia >= 1) puntaje += 5;
        
        // Puntos por disponibilidad
        if (formData.disponibilidad === 'Todos los días') puntaje += 15;
        else if (formData.disponibilidad === 'Flexible') puntaje += 10;
        else if (formData.disponibilidad === 'Fines de semana') puntaje += 8;
        else if (formData.disponibilidad === 'Entre semana') puntaje += 5;
        
        // Puntos por foto de perfil
        if (fotoUrl) puntaje += 15;
        
        // Puntos por edad (edad ideal 20-30)
        const edad = parseInt(formData.edad);
        if (edad >= 20 && edad <= 30) puntaje += 10;
        else if (edad >= 18 && edad <= 35) puntaje += 5;
        
        return Math.min(puntaje, 100); // Máximo 100 puntos
      };

      const puntajeInicial = calcularPuntajeInicial();

      // 4. Crear perfil completo en la tabla usuarios
      const perfilCompleto = {
        id: authData.user.id,
        email: formData.email,
        nombre: formData.nombre,
        edad: parseInt(formData.edad),
        telefono: formData.telefono,
        pais: formData.pais,
        ciudad: formData.ubicacion,
        posicion_favorita: formData.posicion,
        nivel_habilidad: formData.experiencia.toLowerCase(),
        equipo: formData.equipoFavorito,
        descripcion: `Jugador de ${formData.posicion}. Nivel: ${formData.experiencia}. Disponibilidad: ${formData.disponibilidad}. Juega ${formData.vecesJuegaPorSemana} veces por semana.`,
        avatar_url: fotoUrl,
        foto_path: fotoPath,
        puntaje: puntajeInicial,
        partidos_jugados: 0,
        victorias: 0,
        derrotas: 0,
        goles: 0,
        asistencias: 0,
        tarjetas_amarillas: 0,
        tarjetas_rojas: 0,
        is_active: true,
        email_confirmado: true,
        fecha_registro: new Date().toISOString(),
        tiene_foto: !!fotoUrl
      };

      // 🔥 TRACK REGISTRATION SUCCESS FINAL
      tracker.track('registration_completed_success', {
        userId: authData.user.id,
        email: authData.user.email,
        hasPhoto: !!fotoUrl,
        puntajeCalculado: puntajeInicial,
        steps_completed: 5,
        registration_method: 'complete_form'
      }, true);

      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([perfilCompleto]);

      if (profileError) {
        // 🔥 TRACK PROFILE CREATION ERROR
        tracker.track('profile_creation_error', {
          error: profileError.message,
          userId: authData.user.id
        }, true);
        throw profileError;
      }

      // 🔥 TRACK PROFILE CREATED SUCCESSFULLY
      tracker.track('profile_created_success', {
        userId: authData.user.id,
        profileData: {
          nombre: perfilCompleto.nombre,
          posicion: perfilCompleto.posicion,
          experiencia: perfilCompleto.experiencia,
          puntaje: puntajeInicial
        }
      }, true);

      // 5. Auto-login y redirección a card de perfil tipo Instagram
      setSuccess(`¡Usuario creado exitosamente! Puntaje inicial: ${puntajeInicial}/100. Redirigiendo a tu card de jugador...`);
      
      // Limpiar datos temporales del registro
      localStorage.removeItem('futpro_registro_progreso');
      localStorage.removeItem('tempRegistroData');
      
      // Guardar datos de sesión completos para la card
      const datosCard = {
        ...perfilCompleto,
        puntajeCalculado: puntajeInicial,
        tipoCard: 'jugador',
        fechaCreacion: new Date().toISOString(),
        esPrimeraCard: true,
        categoria: puntajeInicial >= 80 ? 'Élite' : puntajeInicial >= 60 ? 'Avanzado' : puntajeInicial >= 40 ? 'Intermedio' : 'Principiante'
      };
      
      localStorage.setItem('futpro_user_profile', JSON.stringify(datosCard));
      localStorage.setItem('futpro_user_card_data', JSON.stringify(datosCard));
      localStorage.setItem('registration_completed', 'true');
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('registroCompleto', 'true');
      localStorage.setItem('authCompleted', 'true');
      localStorage.setItem('loginSuccess', 'true');
      localStorage.setItem('show_first_card', 'true');
      
      // Marcar que debe ir a la card de perfil después del login
      localStorage.setItem('postLoginRedirect', '/perfil-card');
      localStorage.setItem('postLoginRedirectReason', 'primera-card-creada');
      
      console.log('🎉 USUARIO CREADO EXITOSAMENTE - Redirigiendo a Card de Perfil...');
      console.log('👤 Usuario ID:', authData.user.id);
      console.log('📧 Email:', authData.user.email);
      console.log('⭐ Puntaje inicial:', puntajeInicial);
      console.log('🏆 Categoría:', datosCard.categoria);
      console.log('📋 Perfil completo guardado');
      
      // Redirección inmediata a la card de perfil
      const redirectToCard = () => {
        console.log('🎯 Ejecutando redirección a Card de Perfil...');
        try {
          navigate('/perfil-card', { replace: true, state: { newUser: true, cardData: datosCard } });
          console.log('✅ Redirección a card ejecutada con React Router');
        } catch (navError) {
          console.warn('⚠️ React Router falló, usando window.location...');
          window.location.href = '/perfil-card';
        }
      };
      
      // Función de redirección robusta al home como fallback
      const redirectToHome = () => {
        console.log('🏠 Ejecutando redirección al home...');
        try {
          navigate('/home', { replace: true });
          console.log('✅ Redirección al home ejecutada con React Router');
        } catch (navError) {
          console.warn('⚠️ React Router al home falló, usando window.location...');
          try {
            window.location.href = '/home';
            console.log('✅ Redirección al home con window.location');
          } catch (windowError) {
            console.error('❌ Error total en redirección:', windowError);
            window.location.href = window.location.origin + '/home';
          }
        }
      };
      
      // Redirección inmediata a card de perfil (principal)
      setTimeout(redirectToCard, 1500);
      
      // Fallback a card si la primera redirección falla
      setTimeout(() => {
        if (window.location.pathname !== '/perfil-card') {
          console.log('🔄 Ejecutando fallback de redirección a card...');
          window.location.replace('/perfil-card');
        }
      }, 3000);
      
      // Fallback final al home si todo falla
      setTimeout(() => {
        if (window.location.pathname !== '/perfil-card' && window.location.pathname !== '/home') {
          console.log('🔄 Ejecutando redirección final al home como último recurso...');
          redirectToHome();
        }
      }, 5000);

    } catch (error) {
      console.error('Error en registro:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPaso1 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
        🚀 Datos de Acceso
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contraseña *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
            placeholder="Repite tu contraseña"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderPaso2 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
        👤 Información Personal
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Apellido *
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
              placeholder="Tu apellido"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Edad *</label>
            <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300" placeholder="8" min="8" max="70" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
              placeholder="+52 55 1234 5678"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
          <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300" required>
            <option value="">Selecciona categoría</option>
            <option value="masculino_infantil">Masculino Infantil</option>
            <option value="femenina_infantil">Femenina Infantil</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
          <select name="pais" value={formData.pais} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300">
            <option value="México">🇲🇽 México</option>
            <option value="España">🇪🇸 España</option>
            <option value="Argentina">🇦🇷 Argentina</option>
            <option value="Colombia">🇨🇴 Colombia</option>
            <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
            <option value="Otro">🌍 Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ciudad/Ubicación *
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
            placeholder="Ciudad de México, CDMX"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderPaso3 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
        ⚽ Paso 3: Tu Perfil Futbolístico
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Posición Preferida *
        </label>
        <select name="posicion" value={formData.posicion} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400" required>
          <option value="">Selecciona tu posición</option>
          <option value="Portero">🥅 Portero</option>
          <option value="Defensa Central">🛡️ Defensa Central</option>
          <option value="Lateral Derecho">➡️ Lateral Derecho</option>
          <option value="Lateral Izquierdo">⬅️ Lateral Izquierdo</option>
          <option value="Mediocampista Defensivo">🔒 Mediocampista Defensivo</option>
          <option value="Mediocampista Central">⚖️ Mediocampista Central</option>
          <option value="Mediocampista Ofensivo">🎯 Mediocampista Ofensivo</option>
          <option value="Extremo Derecho">🏃‍♂️ Extremo Derecho</option>
          <option value="Extremo Izquierdo">🏃‍♂️ Extremo Izquierdo</option>
          <option value="Delantero Centro">⚽ Delantero Centro</option>
          <option value="Flexible">🔄 Flexible (varias posiciones)</option>
          <option value="Microfutbol">🏟️ Microfútbol</option>
          <option value="Futsal">🏟️ Futsal</option>
          <option value="Micro">🏟️ Micro</option>
          <option value="Otra">⚡ Otra</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nivel de Experiencia *
        </label>
        <select
          name="experiencia"
          value={formData.experiencia}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
          required
        >
          <option value="">Selecciona tu nivel</option>
          <option value="Principiante">🌱 Principiante (0-1 años)</option>
          <option value="Intermedio">🔥 Intermedio (2-5 años)</option>
          <option value="Avanzado">⭐ Avanzado (5+ años)</option>
          <option value="Semi-profesional">🏆 Semi-profesional</option>
          <option value="Profesional">👑 Profesional</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Equipo Favorito *
        </label>
        <input
          type="text"
          name="equipoFavorito"
          value={formData.equipoFavorito}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
          placeholder="Real Madrid, Barcelona, América..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Peso (kg) - Opcional
        </label>
        <input
          type="number"
          name="peso"
          value={formData.peso}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
          placeholder="70"
          min="40"
          max="150"
        />
      </div>
    </div>
  );

  const renderPaso4 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
        📅 Paso 4: Tu Disponibilidad
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Días Disponibles *
        </label>
        <select
          name="disponibilidad"
          value={formData.disponibilidad}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
          required
        >
          <option value="">Selecciona tus días</option>
          <option value="Entre semana">🗓️ Entre semana (Lunes-Viernes)</option>
          <option value="Fines de semana">🎉 Fines de semana</option>
          <option value="Todos los días">⭐ Todos los días</option>
          <option value="Flexible">🔄 Flexible</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ¿Cuántas veces juegas por semana? *
        </label>
        <select
          name="vecesJuegaPorSemana"
          value={formData.vecesJuegaPorSemana}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
          required
        >
          <option value="">Selecciona frecuencia</option>
          <option value="1">1 vez por semana</option>
          <option value="2">2 veces por semana</option>
          <option value="3">3 veces por semana</option>
          <option value="4">4 veces por semana</option>
          <option value="5">5+ veces por semana</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Horarios Preferidos - Opcional
        </label>
        <select
          name="horariosPreferidos"
          value={formData.horariosPreferidos}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
        >
          <option value="">Sin preferencia</option>
          <option value="Mañanas">🌅 Mañanas (6:00 - 12:00)</option>
          <option value="Tardes">🌞 Tardes (12:00 - 18:00)</option>
          <option value="Noches">🌙 Noches (18:00 - 23:00)</option>
        </select>
      </div>
    </div>
  );

  const renderPaso5 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
        📸 Foto de Perfil
      </h2>
      
      <div className="text-center">
        <div className="relative mb-6">
          {previewImagen ? (
            <div className="relative inline-block">
              <img
                src={previewImagen}
                alt="Preview"
                className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full mx-auto bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-4 border-dashed border-gray-600 mb-4 hover:border-yellow-400 transition-all duration-300 cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <span className="text-6xl text-gray-500">👤</span>
            </div>
          )}
          
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 hover:opacity-20 transition-opacity duration-300 cursor-pointer"
               onClick={() => fileInputRef.current?.click()}></div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImagenChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">📷</span>
              {previewImagen ? 'Cambiar Foto' : 'Seleccionar Foto'}
            </span>
          </button>
          
          <p className="text-gray-400 text-sm">
            Opcional: Puedes subir una foto ahora o hacerlo más tarde desde tu perfil
          </p>
          
          <div className="flex justify-center space-x-2 text-xs text-gray-500">
            <span>📏 Máx: 5MB</span>
            <span>•</span>
            <span>🖼️ JPG, PNG</span>
            <span>•</span>
            <span>📐 Cuadrada preferible</span>
          </div>
        </div>
        {/* Botón Google registro al final */}
        <div className="mt-8">
          <button type="button" onClick={handleGoogleRegister} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
            <span style={{fontSize:'22px'}}>🔗</span> Registrarse con Google
          </button>
        </div>
      </div>
    </div>
  );
// ...existing code...
// Función para registro con Google
const handleGoogleRegister = async () => {
  setLoading(true);
  try {
    // Usar Supabase OAuth para Google
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/home',
      },
    });
    if (error) throw error;
    // Autoguardado en localStorage
    localStorage.setItem('futpro_registro_google', 'true');
  } catch (error) {
    setError('Error con Google: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animaciones de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping"></div>
      </div>

      <div className="bg-gray-900 bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-700 relative z-10">
        {/* Header mejorado */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
              ⚽
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            FutPro Premium
          </h1>
          <p className="text-gray-400 mt-2">Tu plataforma de fútbol profesional</p>
        </div>

        {/* Progreso mejorado */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-yellow-400 font-semibold text-sm">
              Paso {paso} de 5
            </span>
            <span className="text-gray-400 text-xs">
              {Math.round((paso / 5) * 100)}% completado
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 ease-in-out shadow-lg"
              style={{ width: `${(paso / 5) * 100}%` }}
            ></div>
          </div>

          {/* Indicador de auto-guardado */}
          {(autoSaving || lastSaved) && (
            <div className="flex items-center justify-center mt-2">
              {autoSaving ? (
                <span className="text-yellow-400 text-xs flex items-center">
                  <span className="animate-spin mr-1">⏳</span>
                  Guardando automáticamente...
                </span>
              ) : (
                <span className="text-green-400 text-xs flex items-center">
                  <span className="mr-1">✅</span>
                  Guardado {lastSaved}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Contenido del paso actual con animaciones */}
        <div className="mb-8 transform transition-all duration-500 ease-in-out">
          {paso === 1 && renderPaso1()}
          {paso === 2 && renderPaso2()}
          {paso === 3 && renderPaso3()}
          {paso === 4 && renderPaso4()}
          {paso === 5 && renderPaso5()}
        </div>

        {/* Mensajes mejorados */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-sm animate-shake">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 p-4 rounded-lg mb-6 text-sm animate-pulse">
            <div className="flex items-center">
              <span className="text-xl mr-2">🎉</span>
              {success}
            </div>
          </div>
        )}

        {/* Botones de navegación mejorados */}
        <div className="flex justify-between items-center">
          <button
            onClick={pasoAnterior}
            disabled={paso === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              paso === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105 shadow-lg'
            }`}
          >
            ← Anterior
          </button>

          {paso < 5 ? (
            <button
              onClick={siguientePaso}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={completarRegistro}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 font-bold disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">🚀</span>
                  ¡Crear Mi Cuenta!
                </span>
              )}
            </button>
          )}
        </div>

        {/* Link para ir a login mejorado */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-yellow-400 hover:text-yellow-300 text-sm underline transition-colors duration-300"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>

        {/* Footer con confianza */}
        <div className="text-center mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-xs">
            🔒 Tus datos están seguros y encriptados
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistroNuevo;