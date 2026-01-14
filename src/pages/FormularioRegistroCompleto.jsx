import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function FormularioRegistroCompleto() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pasoActual, setPasoActual] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Credenciales
    email: '',
    password: '',
    confirmPassword: '',
    // Paso 2: Datos Personales
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
    ciudad: '',
    pais: '',
    peso: '',
    altura: '',
    // Paso 3: Info Futbolística
    categoria: 'masculina',
    posicion: 'Flexible',
    nivelHabilidad: 'Principiante',
    equipoFavorito: '',
    piernaDominante: 'Derecha',
    disponibilidadJuego: 'Fines de semana',
    frecuenciaJuego: '1-2',
    objetivoDeportivo: '',
    redesSociales: '',
    // Árbitro
    licenseNumber: '',
    certificationLevel: 'Regional',
    experienceYears: '' ,
    // Paso 4: Foto
    avatarUrl: '',
    fotoFile: null
  });

  const calcularPuntaje = (nivel) => {
    switch (nivel) {
      case 'Elite': return 90;
      case 'Profesional': return 85;
      case 'Avanzado': return 78;
      case 'Intermedio': return 70;
      case 'Principiante':
      default:
        return 60;
    }
  };

  // Cargar categoría desde navegación
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('categoria') || localStorage.getItem('selectedCategoria');
    if (cat) {
      setFormData(prev => ({ ...prev, categoria: cat }));
    }
  }, [location]);

  // Autocompletar ciudad y país por IP
  useEffect(() => {
    const fillFromIp = async () => {
      try {
        console.log('🌍 Intentando detectar ubicación por IP...');
        
        // Crear AbortController para timeouts
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          // Intentar con ipapi.co primero (HTTPS)
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (data.city || data.country_name) {
              setFormData(prev => ({
                ...prev,
                ciudad: prev.ciudad || data.city || '',
                pais: prev.pais || data.country_name || '',
                lat: prev.lat || data.latitude || null,
                lon: prev.lon || data.longitude || null,
                region: prev.region || data.region || data.region_code || ''
              }));
              console.log('✅ Ubicación detectada (ipapi.co):', data.city, data.country_name);
              return;
            }
          }
        } catch (e) {
          clearTimeout(timeoutId);
          console.warn('⚠️ ipapi.co no disponible:', e.message);
        }

        // Fallback: usar ipwho.is (HTTPS)
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 8000);
        try {
          const res2 = await fetch('https://ipwho.is/?fields=city,country', { signal: controller2.signal });
          clearTimeout(timeoutId2);
          if (res2.ok) {
            const data = await res2.json();
            if (data.city || data.country) {
              setFormData(prev => ({
                ...prev,
                ciudad: prev.ciudad || data.city || '',
                pais: prev.pais || data.country || '',
                lat: prev.lat || data.latitude || null,
                lon: prev.lon || data.longitude || null,
                region: prev.region || data.region || data.region_code || ''
              }));
              console.log('✅ Ubicación detectada (ipwho.is):', data.city, data.country);
              return;
            }
          }
        } catch (e) {
          clearTimeout(timeoutId2);
          console.warn('⚠️ ipwho.is no disponible:', e.message);
        }
        
        console.log('⚠️ No se pudo detectar ubicación por IP, campos manuales');
      } catch (error) {
        console.warn('⚠️ Error general en geolocalización:', error);
      }
    };
    fillFromIp();
  }, []);

  // Acción manual para detectar ubicación si el auto no funciona
  const detectarUbicacionPorIp = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          ciudad: data.city || prev.ciudad || '',
          pais: data.country_name || prev.pais || ''
        }));
        return;
      }
    } catch {}
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 8000);
      const res2 = await fetch('https://ipwho.is/?fields=city,country', { signal: controller2.signal });
      clearTimeout(timeoutId2);
      if (res2.ok) {
        const data = await res2.json();
        setFormData(prev => ({
          ...prev,
          ciudad: data.city || prev.ciudad || '',
          pais: data.country || prev.pais || ''
        }));
      }
    } catch {}
  };

  // Persistir todos los datos de perfil para que Card y registro los lean (incluye peso, categoría, ubicación, foto, pie, edad, estatura)
  useEffect(() => {
    persistProfileDraft();
  }, [formData]);

  const persistProfileDraft = () => {
    const estaturaM = formData.altura ? Number(formData.altura) / 100 : '';
    const pieDominante = formData.piernaDominante || '';
    const pesoKg = formData.peso ? Number(formData.peso) : '';
    const draft = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      ciudad: formData.ciudad,
      pais: formData.pais,
      lat: formData.lat || null,
      lon: formData.lon || null,
      region: formData.region || '',
      edad: formData.edad,
      peso: pesoKg,
      altura: formData.altura,
      estatura: estaturaM,
      categoria: formData.categoria,
      posicion: formData.posicion, // Agregar sin _favorita para AuthCallback
      posicion_favorita: formData.posicion,
      nivel_habilidad: formData.nivelHabilidad,
      equipo: formData.equipoFavorito, // Agregar sin _favorito para AuthCallback
      equipo_favorito: formData.equipoFavorito,
      pierna_dominante: pieDominante,
      pie: pieDominante,
      disponibilidad_juego: formData.disponibilidadJuego,
      frecuencia_juego: formData.frecuenciaJuego,
      objetivo_deportivo: formData.objetivoDeportivo,
      redes_sociales: formData.redesSociales,
      puntaje: calcularPuntaje(formData.nivelHabilidad),
      puntos_totales: calcularPuntaje(formData.nivelHabilidad),
        avatar_url: formData.avatarUrl?.startsWith('data:') ? null : formData.avatarUrl, // Solo guardar si es URL externa
        license_number: formData.licenseNumber,
        certification_level: formData.certificationLevel,
        experience_years: formData.experienceYears
    };
    
    try {
      localStorage.setItem('pendingProfileData', JSON.stringify(draft));
      localStorage.setItem('draft_carfutpro', JSON.stringify(draft));
      console.log('✅ Datos guardados para OAuth');
    } catch (e) {
      console.error('Error guardando:', e);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log('🚀 Iniciando registro con Google...');
      // Guardar contexto de origen/objetivo para el callback
      localStorage.setItem('post_auth_origin', 'formulario_registro');
      localStorage.setItem('post_auth_target', '/perfil-card');      
      
      // Guardar SOLO datos de texto sin imagen base64 para evitar exceder cuota
      persistProfileDraft();
      await loginWithGoogle();
    } catch (error) {
      console.error('❌ Error en Google OAuth:', error);
      // Si es error de CAPTCHA, intentar bypass
      if (error?.message?.includes('captcha') || error?.message?.includes('verification')) {
        console.log('⚠️ Error de CAPTCHA detectado, intenta desactivar CAPTCHA en Supabase Dashboard');
        alert('Error: CAPTCHA habilitado en Supabase.\n\nSolución:\n1. Ve a tu dashboard de Supabase\n2. Authentication → Email\n3. Desactiva "Enable Captcha protection"\n4. Reintenra');
      } else {
        alert('Error en registro con Google: ' + (error?.message || 'Intenta de nuevo'));
      }
    }
  };

  const handleFinalizarRegistro = async () => {
    try {
      console.log('🚀 Finalizando registro con email/password...');
      
      // Validaciones finales
      if (!formData.nombre || !formData.apellido) {
        alert('Por favor completa tu nombre y apellido');
        return;
      }

      // Registrar usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            avatar_url: formData.avatarUrl
          }
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('No se pudo obtener el ID de usuario');

      // Guardar perfil en carfutpro
      const estaturaM = formData.altura ? Number(formData.altura) / 100 : null;
      const pesoKg = formData.peso ? Number(formData.peso) : null;
      const pieDominante = formData.piernaDominante?.toLowerCase() || 'derecho';
      
      const payload = {
        user_id: userId,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        ciudad: formData.ciudad,
        pais: formData.pais,
        posicion: formData.posicion,
        nivel_habilidad: formData.nivelHabilidad,
        equipo: formData.equipoFavorito || '—',
        avatar_url: formData.avatarUrl || `https://i.pravatar.cc/300?u=${userId}`,
        edad: formData.edad ? Number(formData.edad) : null,
        peso: pesoKg,
        pie: pieDominante,
        estatura: estaturaM,
        categoria: formData.categoria,
        pierna_dominante: pieDominante,
        disponibilidad_juego: formData.disponibilidadJuego,
        puntos_totales: 0,
        card_tier: 'Bronce',
        partidos_ganados: 0,
        entrenamientos: 0,
        amistosos: 0,
        puntos_comportamiento: 0,
        ultima_actualizacion: new Date().toISOString()
      };

      const { data: profileData, error: profileError } = await supabase
        .from('carfutpro')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (profileError) throw profileError;

      // Si se registró como Árbitro, guardar en tournament_referees
      if (formData.posicion === 'Árbitro') {
        const refPayload = {
          user_id: userId,
          license_number: formData.licenseNumber || null,
          certification_level: formData.certificationLevel || null,
          experience_years: formData.experienceYears ? Number(formData.experienceYears) : null,
          available: true,
          availability_schedule: null
        };
        try {
          await supabase
            .from('tournament_referees')
            .upsert(refPayload, { onConflict: 'user_id' });
        } catch (refError) {
          console.warn('⚠️ No se pudo guardar árbitro:', refError.message);
        }
      }

      // Preparar datos para la card
      const cardData = {
        id: profileData.id,
        categoria: profileData.categoria,
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        ciudad: profileData.ciudad,
        pais: profileData.pais || formData.pais,
        posicion_favorita: profileData.posicion || formData.posicion,
        posicion: profileData.posicion || formData.posicion,
        nivel_habilidad: profileData.nivel_habilidad,
        puntaje: profileData.puntos_totales || 0,
        puntos_totales: profileData.puntos_totales || 0,
        card_tier: profileData.card_tier || 'Bronce',
        equipo: profileData.equipo || '—',
        fecha_registro: new Date().toISOString(),
        esPrimeraCard: true,
        avatar_url: profileData.avatar_url || formData.avatarUrl || '',
        pie: profileData.pie || pieDominante || null,
        edad: profileData.edad || (formData.edad ? Number(formData.edad) : null),
        peso: profileData.peso || pesoKg,
        estatura: profileData.estatura || estaturaM
      };

      // Guardar en localStorage para la card (múltiples copias de seguridad)
      try {
        localStorage.setItem('futpro_user_card_data', JSON.stringify(cardData));
        localStorage.setItem('show_first_card', 'true');
        localStorage.setItem('pendingProfileData', JSON.stringify({
          nombre: profileData.nombre,
          apellido: profileData.apellido,
          ciudad: profileData.ciudad,
          pais: profileData.pais,
          posicion: profileData.posicion,
          nivel_habilidad: profileData.nivel_habilidad,
          equipo: profileData.equipo,
          avatar_url: profileData.avatar_url,
          edad: profileData.edad,
          peso: profileData.peso,
          pie: profileData.pie,
          estatura: profileData.estatura,
          categoria: profileData.categoria
        }));
        
        // También guardar el usuario básico
        localStorage.setItem('futpro_user', JSON.stringify({
          id: userId,
          nombre: profileData.nombre,
          apellido: profileData.apellido,
          email: formData.email,
          avatar: profileData.avatar_url,
          posicion: profileData.posicion
        }));
        
        console.log('✅ Registro completado exitosamente');
        console.log('✅ CardData guardado:', cardData);
        console.log('✅ PendingProfileData guardado');
        console.log('✅ Usuario guardado en futpro_user');
        console.log('✅ Navegando a /perfil-card...');
        
        // Navegar a la card
        navigate('/perfil-card', { 
          state: { 
            cardData,
            fromRegistro: true,
            timestamp: Date.now()
          } 
        });
      } catch (saveError) {
        console.error('❌ Error guardando en localStorage:', saveError);
        // Intentar navegar de todas formas
        navigate('/perfil-card', { state: { cardData } });
      }
      
    } catch (error) {
      console.error('❌ Error en registro:', error);
      alert('Error al completar el registro: ' + (error?.message || 'Intenta de nuevo'));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, fotoFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const siguientePaso = () => {
    if (pasoActual < 4) setPasoActual(pasoActual + 1);
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) setPasoActual(pasoActual - 1);
  };

  const validarPaso1 = () => {
    if (!formData.email || !formData.password) {
      alert('Por favor completa email y contraseña');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const validarPaso2 = () => {
    if (!formData.nombre || !formData.apellido) {
      alert('Por favor completa nombre y apellido');
      return false;
    }
    return true;
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    marginBottom: '16px',
    borderRadius: '10px',
    border: '2px solid #444',
    background: '#1a1a1a',
    color: '#FFD700',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonPrimaryStyle = {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const buttonSecondaryStyle = {
    padding: '12px 24px',
    background: '#444',
    color: '#FFD700',
    border: '2px solid #666',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        maxWidth: '600px',
        width: '100%',
        background: '#222',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        border: '2px solid #333'
      }}>
        {/* Header con progreso */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            color: '#FFD700',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
          }}>
            ⚽ Registro FutPro
          </h1>
          <p style={{ color: '#999', fontSize: '16px', marginBottom: '24px' }}>
            Paso {pasoActual} de 4
          </p>
          
          {/* Barra de progreso */}
          <div style={{ 
            width: '100%',
            height: '6px',
            background: '#333',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(pasoActual / 4) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              transition: 'width 0.3s ease',
              borderRadius: '10px'
            }} />
          </div>
        </div>

        {/* PASO 1: Credenciales */}
        {pasoActual === 1 && (
          <div>
            <h2 style={{ color: '#FFD700', fontSize: '24px', marginBottom: '24px', fontWeight: 'bold' }}>
              🔐 Credenciales de Acceso
            </h2>
            <input
              type="email"
              placeholder="✉️ Correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              type="password"
              placeholder="🔒 Contraseña (mínimo 6 caracteres)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              type="password"
              placeholder="🔒 Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p style={{ color: '#ff4444', fontSize: '14px', marginTop: '-12px', marginBottom: '12px' }}>
                ⚠️ Las contraseñas no coinciden
              </p>
            )}
          </div>
        )}

        {/* PASO 2: Datos Personales */}
        {pasoActual === 2 && (
          <div>
            <h2 style={{ color: '#FFD700', fontSize: '24px', marginBottom: '24px', fontWeight: 'bold' }}>
              👤 Datos Personales
            </h2>
            <input
              placeholder="📝 Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              placeholder="📝 Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              type="number"
              placeholder="⚖️ Peso (kg)"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            
            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Categoría *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={selectStyle}
            >
               <option value="masculina">🔵 Masculina</option>
              <option value="femenina">🔴 Femenina</option>
              <option value="infantil masculina">👦 Infantil Masculina</option>
              <option value="infantil femenina">👧 Infantil Femenina</option>
            </select>
            
            <input
              type="number"
              placeholder="📏 Altura (cm)"
              value={formData.altura}
              onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <div style={{ color: '#999', fontSize: '13px', margin: '-8px 0 12px 4px' }}>
              📍 La ubicación se detecta automáticamente por IP, puedes editarla.
            </div>
            <input
              type="tel"
              placeholder="📱 Teléfono (opcional)"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              placeholder="🏙️ Ciudad"
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              placeholder="🌍 País"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <input
              type="number"
              placeholder="🎂 Edad (mínimo 8 años)"
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              min="8"
              max="99"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Pierna dominante
            </label>
            <select
              value={formData.piernaDominante}
              onChange={(e) => setFormData({ ...formData, piernaDominante: e.target.value })}
              style={selectStyle}
            >
              <option value="Derecha">🦵 Derecha</option>
              <option value="Izquierda">🦶 Izquierda</option>
              <option value="Ambidiestra">🔁 Ambidiestra</option>
            </select>
            <button
              type="button"
              onClick={detectarUbicacionPorIp}
              style={{
                ...buttonSecondaryStyle,
                width: '100%',
                marginTop: '8px'
              }}
            >
              📍 Detectar ubicación por IP
            </button>
          </div>
        )}

        {/* PASO 3: Info Futbolística */}
        {pasoActual === 3 && (
          <div>
            <h2 style={{ color: '#FFD700', fontSize: '24px', marginBottom: '24px', fontWeight: 'bold' }}>
              ⚽ Información Futbolística
            </h2>

            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', marginTop: '0px', fontSize: '14px', fontWeight: 'bold' }}>
              Posición Favorita
            </label>
            <select
              value={formData.posicion}
              onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
              style={selectStyle}
            >
              <optgroup label="⚽ Fútbol 11">
                <option value="Flexible">🔄 Flexible / Polivalente</option>
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
              </optgroup>
              <optgroup label="🏐 Futsal">
                <option value="Portero Futsal">🥅 Portero</option>
                <option value="Ala Derecha">➡️ Ala Derecha</option>
                <option value="Ala Izquierda">⬅️ Ala Izquierda</option>
                <option value="Pivote">🎯 Pivote</option>
                <option value="Cierre">🔒 Cierre</option>
              </optgroup>
            </select>

            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Nivel de Habilidad
            </label>
            <select
              value={formData.nivelHabilidad}
              onChange={(e) => setFormData({ ...formData, nivelHabilidad: e.target.value })}
              style={selectStyle}
            >
              <option value="Principiante">🌱 Principiante</option>
              <option value="Intermedio">⚡ Intermedio</option>
              <option value="Avanzado">🔥 Avanzado</option>
              <option value="Profesional">⭐ Profesional</option>
              <option value="Elite">👑 Elite</option>
            </select>

            <input
              placeholder="🏆 Equipo Favorito"
              value={formData.equipoFavorito}
              onChange={(e) => setFormData({ ...formData, equipoFavorito: e.target.value })}
              style={{...inputStyle, marginTop: '16px'}}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />

            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Disponibilidad de juego
            </label>
            <select
              value={formData.disponibilidadJuego}
              onChange={(e) => setFormData({ ...formData, disponibilidadJuego: e.target.value })}
              style={selectStyle}
            >
              <option value="Fines de semana">🗓️ Fines de semana</option>
              <option value="Entre semana">📅 Entre semana</option>
              <option value="Cualquier día">✅ Cualquier día</option>
              <option value="Por coordinar">⏱️ Por coordinar</option>
            </select>

            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              ¿Cuántas veces juegas a la semana?
            </label>
            <select
              value={formData.frecuenciaJuego}
              onChange={(e) => setFormData({ ...formData, frecuenciaJuego: e.target.value })}
              style={selectStyle}
            >
              <option value="1-2">1-2 veces por semana</option>
              <option value="3-4">3-4 veces por semana</option>
              <option value="5-6">5-6 veces por semana</option>
              <option value="Todos los días">Todos los días</option>
              <option value="Ocasional">Ocasional / Variable</option>
            </select>

            <textarea
              placeholder="🎯 Objetivo deportivo (p.ej., mejorar resistencia, fichar en equipo, jugar torneos)"
              value={formData.objetivoDeportivo}
              onChange={(e) => setFormData({ ...formData, objetivoDeportivo: e.target.value })}
              style={{
                ...inputStyle,
                minHeight: '90px',
                resize: 'vertical',
                lineHeight: '1.4'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />

            <input
              placeholder="🌐 Redes sociales (Instagram/TikTok/YouTube)"
              value={formData.redesSociales}
              onChange={(e) => setFormData({ ...formData, redesSociales: e.target.value })}
              style={{...inputStyle, marginTop: '8px'}}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>
        )}

        {/* PASO 4: Foto de Perfil */}
        {pasoActual === 4 && (
          <div>
            <h2 style={{ color: '#FFD700', fontSize: '24px', marginBottom: '24px', fontWeight: 'bold' }}>
              📸 Foto de Perfil
            </h2>
            
            {formData.avatarUrl && (
              <div style={{ 
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <img 
                  src={formData.avatarUrl} 
                  alt="Preview" 
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #FFD700',
                    boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)'
                  }}
                />
              </div>
            )}

            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Subir foto desde tu dispositivo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '10px',
                border: '2px dashed #444',
                background: '#1a1a1a',
                color: '#FFD700',
                cursor: 'pointer'
              }}
            />

            <label style={{ color: '#FFD700', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              O ingresa una URL de imagen
            </label>
            <input
              type="url"
              placeholder="🔗 https://ejemplo.com/foto.jpg"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />

            <div style={{
              marginTop: '32px',
              padding: '20px',
              background: '#1a1a1a',
              borderRadius: '12px',
              border: '2px solid #333'
            }}>
              <p style={{ color: '#FFD700', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
                ✅ ¡Último paso!
              </p>
              <p style={{ color: '#999', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                Completa tu perfil o continúa con tu cuenta de Google para usar tu foto de perfil automáticamente
              </p>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div style={{ 
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {pasoActual > 1 && (
            <button 
              onClick={pasoAnterior}
              style={buttonSecondaryStyle}
              onMouseOver={(e) => {
                e.target.style.background = '#555';
                e.target.style.borderColor = '#FFD700';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#444';
                e.target.style.borderColor = '#666';
              }}
            >
              ← Anterior
            </button>
          )}
          
          {pasoActual < 4 && (
            <button 
              onClick={() => {
                if (pasoActual === 1 && !validarPaso1()) return;
                if (pasoActual === 2 && !validarPaso2()) return;
                siguientePaso();
              }}
              style={{
                ...buttonPrimaryStyle,
                marginLeft: pasoActual === 1 ? 0 : 'auto'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
              }}
            >
              Siguiente →
            </button>
          )}

          {pasoActual === 4 && (
            <button
              onClick={handleGoogleSignup}
              style={{
                ...buttonPrimaryStyle,
                background: '#4285F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginLeft: 'auto'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 16px rgba(66, 133, 244, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          )}
        </div>

        {/* Indicador de pasos */}
        <div style={{ 
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {[1, 2, 3, 4].map((paso) => (
            <div
              key={paso}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: paso === pasoActual ? '#FFD700' : '#444',
                transition: 'all 0.3s',
                boxShadow: paso === pasoActual ? '0 0 12px rgba(255, 215, 0, 0.5)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
