import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const gold = '#FFD700';

export default function RegistroNuevo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', nombre: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Completa email y contraseñas');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      setLoading(true);
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { nombre: formData.nombre || '' } }
      });
      if (signUpError) throw signUpError;
      setSuccess('Cuenta creada. Revisa tu correo para confirmar.');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.message || 'Error en registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#121212', border: `2px solid ${gold}`, borderRadius: 16, padding: 20 }}>
        <h2 style={{ color: gold, marginTop: 0, textAlign: 'center' }}>Registro Nuevo</h2>
        {error && <div style={{ background: '#3b0d0d', color: '#ff9b9b', border: '1px solid #ff4d4f', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ background: '#0e3323', color: '#9ff2c3', border: '1px solid #27d17c', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
          <input name="nombre" placeholder="Nombre (opcional)" value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <input name="email" type="email" required placeholder="Correo" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <input name="password" type="password" required placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <input name="confirmPassword" type="password" required placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: 12, background: '#1c1c1c', color: '#eee', border: '1px solid #333', borderRadius: 10 }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#111', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Registrando...' : 'Crear cuenta'}</button>
        </form>
      </div>
    </div>
  );
}

          <h1 style={{ color: gold, margin: 0, fontSize: '24px' }}>Registro Completo</h1>        if (!formData.email || !formData.password || !formData.confirmPassword) {

          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>          setError('Por favor completa todos los campos básicos');

            Paso {paso} de 3          return false;

          </p>        }

        </div>        if (formData.password !== formData.confirmPassword) {

          setError('Las contraseñas no coinciden');

        {/* Progress Bar */}          return false;

        <div style={{ marginBottom: '30px', background: '#333', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>        }

          <div style={{        if (formData.password.length < 6) {

            width: `${(paso / 3) * 100}%`,          setError('La contraseña debe tener al menos 6 caracteres');

            height: '100%',          return false;

            background: gold,        }

            transition: 'width 0.3s ease'        break;

          }}></div>        

        </div>      case 2:

        if (!formData.nombre || !formData.apellido || !formData.edad || !formData.telefono || !formData.ubicacion) {

        {/* Mensajes */}          setError('Por favor completa todos los campos personales');

        {error && (          return false;

          <div style={{ background: '#dc3545', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>        }

            {error}        if (formData.edad < 16 || formData.edad > 60) {

          </div>          setError('La edad debe estar entre 16 y 60 años');

        )}          return false;

        {success && (        }

          <div style={{ background: '#28a745', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>        break;

            {success}        

          </div>      case 3:

        )}        if (!formData.posicion || !formData.experiencia || !formData.equipoFavorito) {

          setError('Por favor completa la información futbolística');

        {/* Formulario */}          return false;

        <form onSubmit={handleSubmit}>        }

          {paso === 1 && (        break;

            <>        

              <h3 style={{ color: gold, marginBottom: '20px' }}>Datos de Acceso</h3>      case 4:

              <input        if (!formData.disponibilidad || !formData.vecesJuegaPorSemana) {

                type="email"          setError('Por favor completa la información de disponibilidad');

                name="email"          return false;

                value={formData.email}        }

                onChange={handleChange}        break;

                placeholder="Email"    }

                required    

                style={{    setError('');

                  width: '100%',    return true;

                  padding: '12px',  };

                  marginBottom: '16px',

                  border: '1px solid #555',  const siguientePaso = () => {

                  borderRadius: '8px',    if (validarPaso(paso)) {

                  background: '#2a2a2a',      // 🔥 TRACK STEP COMPLETION

                  color: '#fff',      formTracker.trackStepComplete(paso);

                  fontSize: '16px',      

                  boxSizing: 'border-box'      setPaso(paso + 1);

                }}      window.scrollTo(0, 0);

              />    }

              <input  };

                type="password"

                name="password"  const pasoAnterior = () => {

                value={formData.password}    // 🔥 TRACK STEP BACK

                onChange={handleChange}    tracker.track('form_step_back', { fromStep: paso, toStep: paso - 1 });

                placeholder="Contraseña"    

                required    setPaso(paso - 1);

                style={{    setError('');

                  width: '100%',    window.scrollTo(0, 0);

                  padding: '12px',  };

                  marginBottom: '16px',

                  border: '1px solid #555',  const completarRegistro = async () => {

                  borderRadius: '8px',    if (!validarPaso(4)) return;

                  background: '#2a2a2a',    

                  color: '#fff',    setLoading(true);

                  fontSize: '16px',    setError('');

                  boxSizing: 'border-box'    

                }}    // 🔥 TRACK FINAL SUBMISSION START

              />    tracker.track('registration_final_attempt', { 

              <input      step: 5, 

                type="password"      hasPhoto: !!imagenPerfil,

                name="confirmPassword"      formData: {

                value={formData.confirmPassword}        hasNombre: !!formData.nombre,

                onChange={handleChange}        hasEmail: !!formData.email,

                placeholder="Confirmar Contraseña"        hasPosicion: !!formData.posicion,

                required        hasExperiencia: !!formData.experiencia

                style={{      }

                  width: '100%',    }, true);

                  padding: '12px',    

                  marginBottom: '16px',    try {

                  border: '1px solid #555',      // 1. Crear cuenta en Supabase Auth

                  borderRadius: '8px',      const { data: authData, error: authError } = await supabase.auth.signUp({

                  background: '#2a2a2a',        email: formData.email,

                  color: '#fff',        password: formData.password,

                  fontSize: '16px',        options: {

                  boxSizing: 'border-box'          data: {

                }}            full_name: `${formData.nombre} ${formData.apellido}`,

              />            display_name: formData.nombre

            </>          }

          )}        }

      });

          {paso === 2 && (

            <>      if (authError) {

              <h3 style={{ color: gold, marginBottom: '20px' }}>Información Personal</h3>        if (authError.message?.includes('already registered')) {

              <input          setError('Este email ya está registrado. ¿Deseas iniciar sesión?');

                type="text"          

                name="nombre"          // 🔥 TRACK DUPLICATE EMAIL

                value={formData.nombre}          tracker.track('registration_duplicate_email', { 

                onChange={handleChange}            email: formData.email.substring(0, 3) + '***' 

                placeholder="Nombre"          }, true);

                required          return;

                style={{        }

                  width: '100%',        throw authError;

                  padding: '12px',      }

                  marginBottom: '16px',

                  border: '1px solid #555',      if (!authData.user) {

                  borderRadius: '8px',        throw new Error('No se pudo crear el usuario');

                  background: '#2a2a2a',      }

                  color: '#fff',

                  fontSize: '16px',      // 2. Subir foto de perfil con configuración mejorada

                  boxSizing: 'border-box'      let fotoUrl = null;

                }}      let fotoPath = null;

              />      

              <input      if (imagenPerfil) {

                type="text"        setSuccess('Subiendo foto de perfil...');

                name="apellido"        

                value={formData.apellido}        // 🔥 TRACK PHOTO UPLOAD START

                onChange={handleChange}        tracker.track('profile_photo_upload_start', { 

                placeholder="Apellido"          fileName: imagenPerfil.name,

                required          fileSize: imagenPerfil.size 

                style={{        });

                  width: '100%',        

                  padding: '12px',        // Crear nombre único para la foto

                  marginBottom: '16px',        const fileExt = imagenPerfil.name.split('.').pop().toLowerCase();

                  border: '1px solid #555',        const fileName = `perfil_${authData.user.id}_${Date.now()}.${fileExt}`;

                  borderRadius: '8px',        fotoPath = fileName;

                  background: '#2a2a2a',        

                  color: '#fff',        try {

                  fontSize: '16px',          // Subir a bucket public de avatars

                  boxSizing: 'border-box'          const { data: uploadData, error: uploadError } = await supabase.storage

                }}            .from('avatars')

              />            .upload(fileName, imagenPerfil, {

              <input              cacheControl: '3600',

                type="number"              upsert: false

                name="edad"            });

                value={formData.edad}

                onChange={handleChange}          if (uploadError) {

                placeholder="Edad"            console.warn('⚠️ Error subiendo foto:', uploadError.message);

                min="13"            // Continuar sin foto si falla

                max="100"          } else {

                style={{            // Obtener URL pública

                  width: '100%',            const { data: { publicUrl } } = supabase.storage

                  padding: '12px',              .from('avatars')

                  marginBottom: '16px',              .getPublicUrl(fileName);

                  border: '1px solid #555',            fotoUrl = publicUrl;

                  borderRadius: '8px',            console.log('✅ Foto subida exitosamente:', fotoUrl);

                  background: '#2a2a2a',          }

                  color: '#fff',        } catch (photoError) {

                  fontSize: '16px',          console.warn('⚠️ Error en proceso de foto:', photoError);

                  boxSizing: 'border-box'          // Continuar sin foto

                }}        }

              />      }

              <input

                type="tel"      // 3. Calcular puntaje inicial basado en datos del formulario

                name="telefono"      const calcularPuntajeInicial = () => {

                value={formData.telefono}        let puntaje = 50; // Base

                onChange={handleChange}        

                placeholder="Teléfono (opcional)"        // Puntos por experiencia

                style={{        switch(formData.experiencia.toLowerCase()) {

                  width: '100%',          case 'principiante': puntaje += 10; break;

                  padding: '12px',          case 'intermedio': puntaje += 25; break;

                  marginBottom: '16px',          case 'avanzado': puntaje += 40; break;

                  border: '1px solid #555',          case 'semi-profesional': puntaje += 55; break;

                  borderRadius: '8px',          case 'profesional': puntaje += 70; break;

                  background: '#2a2a2a',        }

                  color: '#fff',        

                  fontSize: '16px',        // Puntos por frecuencia de juego

                  boxSizing: 'border-box'        const frecuencia = parseInt(formData.vecesJuegaPorSemana);

                }}        if (frecuencia >= 5) puntaje += 20;

              />        else if (frecuencia >= 3) puntaje += 15;

            </>        else if (frecuencia >= 2) puntaje += 10;

          )}        else if (frecuencia >= 1) puntaje += 5;

        

          {paso === 3 && (        // Puntos por disponibilidad

            <>        if (formData.disponibilidad === 'Todos los días') puntaje += 15;

              <h3 style={{ color: gold, marginBottom: '20px' }}>Información Futbolística</h3>        else if (formData.disponibilidad === 'Flexible') puntaje += 10;

              <select        else if (formData.disponibilidad === 'Fines de semana') puntaje += 8;

                name="posicion"        else if (formData.disponibilidad === 'Entre semana') puntaje += 5;

                value={formData.posicion}        

                onChange={handleChange}        // Puntos por foto de perfil

                style={{        if (fotoUrl) puntaje += 15;

                  width: '100%',        

                  padding: '12px',        // Puntos por edad (edad ideal 20-30)

                  marginBottom: '16px',        const edad = parseInt(formData.edad);

                  border: '1px solid #555',        if (edad >= 20 && edad <= 30) puntaje += 10;

                  borderRadius: '8px',        else if (edad >= 18 && edad <= 35) puntaje += 5;

                  background: '#2a2a2a',        

                  color: '#fff',        return Math.min(puntaje, 100); // Máximo 100 puntos

                  fontSize: '16px',      };

                  boxSizing: 'border-box'

                }}      const puntajeInicial = calcularPuntajeInicial();

              >

                <option value="">Selecciona tu posición</option>      // 4. Crear perfil completo en la tabla usuarios

                <option value="Portero">Portero</option>      const perfilCompleto = {

                <option value="Defensa">Defensa</option>        id: authData.user.id,

                <option value="Mediocampista">Mediocampista</option>        email: formData.email,

                <option value="Delantero">Delantero</option>        nombre: formData.nombre,

              </select>        edad: parseInt(formData.edad),

              <select        telefono: formData.telefono,

                name="experiencia"        pais: formData.pais,

                value={formData.experiencia}        ciudad: formData.ubicacion,

                onChange={handleChange}        posicion_favorita: formData.posicion,

                style={{        nivel_habilidad: formData.experiencia.toLowerCase(),

                  width: '100%',        equipo: formData.equipoFavorito,

                  padding: '12px',        descripcion: `Jugador de ${formData.posicion}. Nivel: ${formData.experiencia}. Disponibilidad: ${formData.disponibilidad}. Juega ${formData.vecesJuegaPorSemana} veces por semana.`,

                  marginBottom: '16px',        avatar_url: fotoUrl,

                  border: '1px solid #555',        foto_path: fotoPath,

                  borderRadius: '8px',        puntaje: puntajeInicial,

                  background: '#2a2a2a',        partidos_jugados: 0,

                  color: '#fff',        victorias: 0,

                  fontSize: '16px',        derrotas: 0,

                  boxSizing: 'border-box'        goles: 0,

                }}        asistencias: 0,

              >        tarjetas_amarillas: 0,

                <option value="">Nivel de experiencia</option>        tarjetas_rojas: 0,

                <option value="Principiante">Principiante</option>        is_active: true,

                <option value="Intermedio">Intermedio</option>        email_confirmado: true,

                <option value="Avanzado">Avanzado</option>        fecha_registro: new Date().toISOString(),

                <option value="Profesional">Profesional</option>        tiene_foto: !!fotoUrl

              </select>      };

            </>

          )}      // 🔥 TRACK REGISTRATION SUCCESS FINAL

      tracker.track('registration_completed_success', {

          {/* Botones */}        userId: authData.user.id,

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>        email: authData.user.email,

            <button        hasPhoto: !!fotoUrl,

              type="button"        puntajeCalculado: puntajeInicial,

              onClick={handleBack}        steps_completed: 5,

              style={{        registration_method: 'complete_form'

                flex: 1,      }, true);

                padding: '12px',

                background: 'transparent',      const { error: profileError } = await supabase

                color: gold,        .from('usuarios')

                border: `2px solid ${gold}`,        .insert([perfilCompleto]);

                borderRadius: '8px',

                fontSize: '16px',      if (profileError) {

                cursor: 'pointer',        // 🔥 TRACK PROFILE CREATION ERROR

                fontWeight: 'bold'        tracker.track('profile_creation_error', {

              }}          error: profileError.message,

            >          userId: authData.user.id

              ← Atrás        }, true);

            </button>        throw profileError;

            <button      }

              type="submit"

              disabled={loading}      // 🔥 TRACK PROFILE CREATED SUCCESSFULLY

              style={{      tracker.track('profile_created_success', {

                flex: 2,        userId: authData.user.id,

                padding: '12px',        profileData: {

                background: loading ? '#666' : gold,          nombre: perfilCompleto.nombre,

                color: loading ? '#ccc' : black,          posicion: perfilCompleto.posicion,

                border: 'none',          experiencia: perfilCompleto.experiencia,

                borderRadius: '8px',          puntaje: puntajeInicial

                fontSize: '16px',        }

                fontWeight: 'bold',      }, true);

                cursor: loading ? 'not-allowed' : 'pointer'

              }}      // 5. Auto-login y redirección a card de perfil tipo Instagram

            >      setSuccess(`¡Usuario creado exitosamente! Puntaje inicial: ${puntajeInicial}/100. Redirigiendo a tu card de jugador...`);

              {loading ? 'Procesando...' : (paso === 3 ? 'Completar Registro' : 'Siguiente →')}      

            </button>      // Limpiar datos temporales del registro

          </div>      localStorage.removeItem('futpro_registro_progreso');

        </form>      localStorage.removeItem('tempRegistroData');

      </div>      

    </div>      // Guardar datos de sesión completos para la card

  );      const datosCard = {

}        ...perfilCompleto,

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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Edad *
            </label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
              placeholder="18"
              min="16"
              max="60"
              required
            />
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            País
          </label>
          <select
            name="pais"
            value={formData.pais}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
          >
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
        <select
          name="posicion"
          value={formData.posicion}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-400"
          required
        >
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
      </div>
    </div>
  );

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