import React, { useState, useRef, useEffect } from 'react';import React, { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';import { useNavigate } from 'react-router-dom';

import supabase from '../supabaseClient';import supabase from '../supabaseClient';

import { useAuth } from '../context/AuthContext.jsx';import { useAuth } from '../context/AuthContext.jsx';

import '../styles/registro-animations.css';import '../styles/registro-animations.css';



const gold = '#FFD700';const gold = '#FFD700';

const black = '#222';const black = '#222';



const RegistroNuevo = () => {const RegistroNuevo = () => {

  const navigate = useNavigate();  const navigate = useNavigate();

  const fileInputRef = useRef(null);  const fileInputRef = useRef(null);

  const { user } = useAuth();  const { user } = useAuth();



  const [loading, setLoading] = useState(false);  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');  const [success, setSuccess] = useState('');

  const [paso, setPaso] = useState(1);  const [paso, setPaso] = useState(1);

  const [imagenPerfil, setImagenPerfil] = useState(null);  const [imagenPerfil, setImagenPerfil] = useState(null);

  const [previewImagen, setPreviewImagen] = useState(null);  const [previewImagen, setPreviewImagen] = useState(null);

  const [autoSaving, setAutoSaving] = useState(false);  const [autoSaving, setAutoSaving] = useState(false);

  const [lastSaved, setLastSaved] = useState(null);  const [lastSaved, setLastSaved] = useState(null);



  const [formData, setFormData] = useState({  const [formData, setFormData] = useState({

    // Paso 1: Datos básicos    // Paso 1: Datos básicos

    email: '',    email: '',

    password: '',    password: '',

    confirmPassword: '',    confirmPassword: '',

        

    // Paso 2: Información personal    // Paso 2: Información personal

    nombre: '',    nombre: '',

    apellido: '',    apellido: '',

    edad: 18,    edad: 18,

    telefono: '',    telefono: '',

    pais: 'México',    pais: 'México',

    ubicacion: '',    ubicacion: '',

        

    // Paso 3: Información futbolística    // Paso 3: Información futbolística

    posicion: '',    posicion: '',

    experiencia: '',    experiencia: '',

    equipoFavorito: '',    equipoFavorito: '',

    peso: '',    peso: '',

        

    // Paso 4: Disponibilidad    // Paso 4: Disponibilidad

    disponibilidad: '',    disponibilidad: '',

    vecesJuegaPorSemana: '',    vecesJuegaPorSemana: '',

    horariosPreferidos: '',    horariosPreferidos: '',

        

    // Paso 5: Foto de perfil    // Paso 5: Foto de perfil

    foto: null    foto: null

  });  });



  // Redirigir si ya está autenticado  // Redirigir si ya está autenticado

  useEffect(() => {  useEffect(() => {

    if (user) {    if (user) {

      navigate('/home');      navigate('/home');

    }    }

  }, [user, navigate]);  }, [user, navigate]);



  // Auto-guardado cada 30 segundos  // Auto-guardado cada 30 segundos

  useEffect(() => {  useEffect(() => {

    const autoSaveInterval = setInterval(() => {    const autoSaveInterval = setInterval(() => {

      if (paso > 1 && formData.email && formData.nombre) {      if (paso > 1 && formData.email && formData.nombre) {

        autoGuardarProgreso();        autoGuardarProgreso();

      }      }

    }, 30000);    }, 30000);



    return () => clearInterval(autoSaveInterval);    return () => clearInterval(autoSaveInterval);

  }, [paso, formData]);  }, [paso, formData]);



  // Cargar datos guardados al iniciar  // Cargar datos guardados al iniciar

  useEffect(() => {  useEffect(() => {

    const datosSalvados = localStorage.getItem('futpro_registro_progreso');    const datosSalvados = localStorage.getItem('futpro_registro_progreso');

    if (datosSalvados) {    if (datosSalvados) {

      try {      try {

        const datos = JSON.parse(datosSalvados);        const datos = JSON.parse(datosSalvados);

        setFormData(prev => ({ ...prev, ...datos }));        setFormData(prev => ({ ...prev, ...datos }));

        setLastSaved(new Date().toLocaleTimeString());        setLastSaved(new Date().toLocaleTimeString());

      } catch (e) {      } catch (e) {

        console.log('Error cargando datos guardados:', e);        console.log('Error cargando datos guardados:', e);

      }      }

    }    }

  }, []);  }, []);



  const autoGuardarProgreso = async () => {  const autoGuardarProgreso = async () => {

    if (!formData.email || !formData.nombre) return;    if (!formData.email || !formData.nombre) return;

        

    setAutoSaving(true);    setAutoSaving(true);

    try {    try {

      localStorage.setItem('futpro_registro_progreso', JSON.stringify(formData));      localStorage.setItem('futpro_registro_progreso', JSON.stringify(formData));

      setLastSaved(new Date().toLocaleTimeString());      setLastSaved(new Date().toLocaleTimeString());

    } catch (error) {    } catch (error) {

      console.log('Error auto-guardando:', error);      console.log('Error auto-guardando:', error);

    } finally {    } finally {

      setAutoSaving(false);      setAutoSaving(false);

    }    }

  };  };



  const handleInputChange = (e) => {  const handleInputChange = (e) => {

    const { name, value } = e.target;    const { name, value } = e.target;

    setFormData(prev => ({    setFormData(prev => ({

      ...prev,      ...prev,

      [name]: value      [name]: value

    }));    }));

    setError('');

  };    if (paso > 1) {    setError('');



  const handleImagenChange = (e) => {      setPaso(paso - 1);    

    const file = e.target.files[0];

    if (file) {      setError('');    // 🔥 TRACK FIELD INPUT AUTOMÁTICAMENTE (COMO REDES SOCIALES)

      if (file.size > 5000000) {

        setError('La imagen no debe superar 5MB');    } else {    formTracker.trackField(name, value);

        return;

      }      navigate('/');    

      setImagenPerfil(file);

      const reader = new FileReader();    }    // Auto-guardar después de cambios importantes

      reader.onloadend = () => {

        setPreviewImagen(reader.result);  };    if (name === 'email' || name === 'nombre' || name === 'apellido') {

      };

      reader.readAsDataURL(file);      setTimeout(() => autoGuardarProgreso(), 2000);

      setError('');

    }  return (    }

  };

    <div style={{  };

  const validarPaso = (pasoActual) => {

    setError('');      minHeight: '100vh',



    switch (pasoActual) {      background: `linear-gradient(135deg, ${black} 0%, #333 100%)`,  const handleImagenChange = (e) => {

      case 1:

        if (!formData.email || !formData.password || !formData.confirmPassword) {      display: 'flex',    const file = e.target.files[0];

          setError('Por favor completa todos los campos básicos');

          return false;      alignItems: 'center',    if (file) {

        }

        if (formData.password !== formData.confirmPassword) {      justifyContent: 'center',      setImagenPerfil(file);

          setError('Las contraseñas no coinciden');

          return false;      fontFamily: 'Arial, sans-serif',      setFormData(prev => ({ ...prev, foto: file }));

        }

        if (formData.password.length < 6) {      padding: '20px'      

          setError('La contraseña debe tener al menos 6 caracteres');

          return false;    }}>      // 🔥 TRACK PHOTO UPLOAD AUTOMÁTICAMENTE

        }

        break;      <div style={{      trackUpload(file, 'profile_registration');

      

      case 2:        background: '#1a1a1a',      

        if (!formData.nombre || !formData.apellido || !formData.edad || !formData.telefono || !formData.ubicacion) {

          setError('Por favor completa todos los campos personales');        border: `2px solid ${gold}`,      // Crear preview

          return false;

        }        borderRadius: '20px',      const reader = new FileReader();

        if (formData.edad < 16 || formData.edad > 60) {

          setError('La edad debe estar entre 16 y 60 años');        padding: '40px',      reader.onload = (e) => setPreviewImagen(e.target.result);

          return false;

        }        maxWidth: '500px',      reader.readAsDataURL(file);

        break;

                width: '100%',    }

      case 3:

        if (!formData.posicion || !formData.experiencia || !formData.equipoFavorito) {        boxShadow: `0 10px 30px rgba(255, 215, 0, 0.3)`  };

          setError('Por favor completa la información futbolística');

          return false;      }}>

        }

        break;        {/* Header */}  const validarPaso = (numeroPaso) => {

        

      case 4:        <div style={{ marginBottom: '30px', textAlign: 'center' }}>    switch (numeroPaso) {

        if (!formData.disponibilidad || !formData.vecesJuegaPorSemana) {

          setError('Por favor completa la información de disponibilidad');          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚽</div>      case 1:

          return false;

        }          <h1 style={{ color: gold, margin: 0, fontSize: '24px' }}>Registro Completo</h1>        if (!formData.email || !formData.password || !formData.confirmPassword) {

        break;

    }          <p style={{ color: '#ccc', margin: '5px 0 0 0', fontSize: '14px' }}>          setError('Por favor completa todos los campos básicos');

    

    setError('');            Paso {paso} de 3          return false;

    return true;

  };          </p>        }



  const siguientePaso = () => {        </div>        if (formData.password !== formData.confirmPassword) {

    if (validarPaso(paso)) {

      setPaso(paso + 1);          setError('Las contraseñas no coinciden');

      window.scrollTo(0, 0);

    }        {/* Progress Bar */}          return false;

  };

        <div style={{ marginBottom: '30px', background: '#333', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>        }

  const pasoAnterior = () => {

    setPaso(paso - 1);          <div style={{        if (formData.password.length < 6) {

    setError('');

    window.scrollTo(0, 0);            width: `${(paso / 3) * 100}%`,          setError('La contraseña debe tener al menos 6 caracteres');

  };

            height: '100%',          return false;

  const completarRegistro = async () => {

    if (!validarPaso(4)) return;            background: gold,        }

    

    setLoading(true);            transition: 'width 0.3s ease'        break;

    setError('');

          }}></div>        

    try {

      // 1. Crear usuario en Supabase Auth        </div>      case 2:

      const { data: authData, error: authError } = await supabase.auth.signUp({

        email: formData.email,        if (!formData.nombre || !formData.apellido || !formData.edad || !formData.telefono || !formData.ubicacion) {

        password: formData.password,

        options: {        {/* Mensajes */}          setError('Por favor completa todos los campos personales');

          data: {

            nombre: formData.nombre,        {error && (          return false;

            apellido: formData.apellido

          }          <div style={{ background: '#dc3545', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>        }

        }

      });            {error}        if (formData.edad < 16 || formData.edad > 60) {



      if (authError) throw authError;          </div>          setError('La edad debe estar entre 16 y 60 años');



      if (!authData.user) {        )}          return false;

        throw new Error('Error creando usuario');

      }        {success && (        }



      // 2. Subir imagen de perfil si existe          <div style={{ background: '#28a745', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>        break;

      let fotoUrl = null;

      if (imagenPerfil) {            {success}        

        const fileExt = imagenPerfil.name.split('.').pop();

        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;          </div>      case 3:

        const filePath = `avatars/${fileName}`;

        )}        if (!formData.posicion || !formData.experiencia || !formData.equipoFavorito) {

        const { error: uploadError } = await supabase.storage

          .from('avatars')          setError('Por favor completa la información futbolística');

          .upload(filePath, imagenPerfil);

        {/* Formulario */}          return false;

        if (!uploadError) {

          const { data: { publicUrl } } = supabase.storage        <form onSubmit={handleSubmit}>        }

            .from('avatars')

            .getPublicUrl(filePath);          {paso === 1 && (        break;

          fotoUrl = publicUrl;

        }            <>        

      }

              <h3 style={{ color: gold, marginBottom: '20px' }}>Datos de Acceso</h3>      case 4:

      // 3. Crear perfil en tabla usuarios

      const { error: profileError } = await supabase              <input        if (!formData.disponibilidad || !formData.vecesJuegaPorSemana) {

        .from('usuarios')

        .insert([{                type="email"          setError('Por favor completa la información de disponibilidad');

          id: authData.user.id,

          email: formData.email,                name="email"          return false;

          nombre: formData.nombre,

          apellido: formData.apellido,                value={formData.email}        }

          edad: formData.edad,

          telefono: formData.telefono,                onChange={handleChange}        break;

          pais: formData.pais,

          ubicacion: formData.ubicacion,                placeholder="Email"    }

          posicion: formData.posicion,

          experiencia: formData.experiencia,                required    

          equipo_favorito: formData.equipoFavorito,

          peso: formData.peso,                style={{    setError('');

          disponibilidad: formData.disponibilidad,

          veces_juega_semana: formData.vecesJuegaPorSemana,                  width: '100%',    return true;

          horarios_preferidos: formData.horariosPreferidos,

          foto_url: fotoUrl,                  padding: '12px',  };

          created_at: new Date().toISOString()

        }]);                  marginBottom: '16px',



      if (profileError) throw profileError;                  border: '1px solid #555',  const siguientePaso = () => {



      // 4. Limpiar localStorage                  borderRadius: '8px',    if (validarPaso(paso)) {

      localStorage.removeItem('futpro_registro_progreso');

                  background: '#2a2a2a',      // 🔥 TRACK STEP COMPLETION

      setSuccess('¡Registro completado! Revisa tu correo para confirmar tu cuenta.');

                        color: '#fff',      formTracker.trackStepComplete(paso);

      setTimeout(() => {

        navigate('/');                  fontSize: '16px',      

      }, 2000);

                  boxSizing: 'border-box'      setPaso(paso + 1);

    } catch (error) {

      console.error('Error en registro:', error);                }}      window.scrollTo(0, 0);

      setError(error.message || 'Error al completar el registro');

    } finally {              />    }

      setLoading(false);

    }              <input  };

  };

                type="password"

  const handleSubmit = (e) => {

    e.preventDefault();                name="password"  const pasoAnterior = () => {

    if (paso < 5) {

      siguientePaso();                value={formData.password}    // 🔥 TRACK STEP BACK

    } else {

      completarRegistro();                onChange={handleChange}    tracker.track('form_step_back', { fromStep: paso, toStep: paso - 1 });

    }

  };                placeholder="Contraseña"    



  const inputStyle = {                required    setPaso(paso - 1);

    width: '100%',

    padding: '12px',                style={{    setError('');

    marginBottom: '16px',

    border: '1px solid #555',                  width: '100%',    window.scrollTo(0, 0);

    borderRadius: '8px',

    background: '#2a2a2a',                  padding: '12px',  };

    color: '#fff',

    fontSize: '16px',                  marginBottom: '16px',

    boxSizing: 'border-box'

  };                  border: '1px solid #555',  const completarRegistro = async () => {



  const buttonStyle = {                  borderRadius: '8px',    if (!validarPaso(4)) return;

    width: '100%',

    padding: '14px',                  background: '#2a2a2a',    

    border: 'none',

    borderRadius: '8px',                  color: '#fff',    setLoading(true);

    fontSize: '16px',

    fontWeight: 'bold',                  fontSize: '16px',    setError('');

    cursor: 'pointer',

    transition: 'all 0.3s ease',                  boxSizing: 'border-box'    

    marginTop: '10px'

  };                }}    // 🔥 TRACK FINAL SUBMISSION START



  return (              />    tracker.track('registration_final_attempt', { 

    <div style={{

      minHeight: '100vh',              <input      step: 5, 

      background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',

      display: 'flex',                type="password"      hasPhoto: !!imagenPerfil,

      alignItems: 'center',

      justifyContent: 'center',                name="confirmPassword"      formData: {

      padding: '20px'

    }}>                value={formData.confirmPassword}        hasNombre: !!formData.nombre,

      <div style={{

        width: '100%',                onChange={handleChange}        hasEmail: !!formData.email,

        maxWidth: '500px',

        background: black,                placeholder="Confirmar Contraseña"        hasPosicion: !!formData.posicion,

        border: `2px solid ${gold}`,

        borderRadius: '16px',                required        hasExperiencia: !!formData.experiencia

        padding: '40px',

        boxShadow: `0 10px 40px rgba(255, 215, 0, 0.2)`                style={{      }

      }}>

        {/* Header */}                  width: '100%',    }, true);

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>

          <h1 style={{ color: gold, margin: 0, fontSize: '28px', fontWeight: 'bold' }}>                  padding: '12px',    

            Registro Completo

          </h1>                  marginBottom: '16px',    try {

          <p style={{ color: '#ccc', margin: '8px 0 0 0', fontSize: '14px' }}>

            Paso {paso} de 5                  border: '1px solid #555',      // 1. Crear cuenta en Supabase Auth

          </p>

        </div>                  borderRadius: '8px',      const { data: authData, error: authError } = await supabase.auth.signUp({



        {/* Barra de progreso */}                  background: '#2a2a2a',        email: formData.email,

        <div style={{ 

          marginBottom: '30px',                   color: '#fff',        password: formData.password,

          background: '#333', 

          borderRadius: '10px',                   fontSize: '16px',        options: {

          height: '8px', 

          overflow: 'hidden'                   boxSizing: 'border-box'          data: {

        }}>

          <div style={{                }}            full_name: `${formData.nombre} ${formData.apellido}`,

            width: `${(paso / 5) * 100}%`,

            height: '100%',              />            display_name: formData.nombre

            background: `linear-gradient(90deg, ${gold} 0%, #ffd700 100%)`,

            transition: 'width 0.3s ease',            </>          }

            borderRadius: '10px'

          }}></div>          )}        }

        </div>

      });

        {/* Auto-save indicator */}

        {lastSaved && (          {paso === 2 && (

          <div style={{ 

            textAlign: 'right',             <>      if (authError) {

            fontSize: '12px', 

            color: '#888',               <h3 style={{ color: gold, marginBottom: '20px' }}>Información Personal</h3>        if (authError.message?.includes('already registered')) {

            marginBottom: '10px' 

          }}>              <input          setError('Este email ya está registrado. ¿Deseas iniciar sesión?');

            {autoSaving ? '💾 Guardando...' : `✓ Guardado: ${lastSaved}`}

          </div>                type="text"          

        )}

                name="nombre"          // 🔥 TRACK DUPLICATE EMAIL

        {/* Mensajes */}

        {error && (                value={formData.nombre}          tracker.track('registration_duplicate_email', { 

          <div style={{ 

            background: '#dc3545',                 onChange={handleChange}            email: formData.email.substring(0, 3) + '***' 

            color: '#fff', 

            padding: '12px',                 placeholder="Nombre"          }, true);

            borderRadius: '8px', 

            marginBottom: '20px',                 required          return;

            fontSize: '14px' 

          }}>                style={{        }

            {error}

          </div>                  width: '100%',        throw authError;

        )}

                          padding: '12px',      }

        {success && (

          <div style={{                   marginBottom: '16px',

            background: '#28a745', 

            color: '#fff',                   border: '1px solid #555',      if (!authData.user) {

            padding: '12px', 

            borderRadius: '8px',                   borderRadius: '8px',        throw new Error('No se pudo crear el usuario');

            marginBottom: '20px', 

            fontSize: '14px'                   background: '#2a2a2a',      }

          }}>

            {success}                  color: '#fff',

          </div>

        )}                  fontSize: '16px',      // 2. Subir foto de perfil con configuración mejorada



        {/* Formulario */}                  boxSizing: 'border-box'      let fotoUrl = null;

        <form onSubmit={handleSubmit}>

          {/* PASO 1: Datos de Acceso */}                }}      let fotoPath = null;

          {paso === 1 && (

            <>              />      

              <h3 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>

                Datos de Acceso              <input      if (imagenPerfil) {

              </h3>

              <input                type="text"        setSuccess('Subiendo foto de perfil...');

                type="email"

                name="email"                name="apellido"        

                value={formData.email}

                onChange={handleInputChange}                value={formData.apellido}        // 🔥 TRACK PHOTO UPLOAD START

                placeholder="Email"

                required                onChange={handleChange}        tracker.track('profile_photo_upload_start', { 

                style={inputStyle}

              />                placeholder="Apellido"          fileName: imagenPerfil.name,

              <input

                type="password"                required          fileSize: imagenPerfil.size 

                name="password"

                value={formData.password}                style={{        });

                onChange={handleInputChange}

                placeholder="Contraseña"                  width: '100%',        

                required

                style={inputStyle}                  padding: '12px',        // Crear nombre único para la foto

              />

              <input                  marginBottom: '16px',        const fileExt = imagenPerfil.name.split('.').pop().toLowerCase();

                type="password"

                name="confirmPassword"                  border: '1px solid #555',        const fileName = `perfil_${authData.user.id}_${Date.now()}.${fileExt}`;

                value={formData.confirmPassword}

                onChange={handleInputChange}                  borderRadius: '8px',        fotoPath = fileName;

                placeholder="Confirmar Contraseña"

                required                  background: '#2a2a2a',        

                style={inputStyle}

              />                  color: '#fff',        try {

            </>

          )}                  fontSize: '16px',          // Subir a bucket public de avatars



          {/* PASO 2: Información Personal */}                  boxSizing: 'border-box'          const { data: uploadData, error: uploadError } = await supabase.storage

          {paso === 2 && (

            <>                }}            .from('avatars')

              <h3 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>

                Información Personal              />            .upload(fileName, imagenPerfil, {

              </h3>

              <input              <input              cacheControl: '3600',

                type="text"

                name="nombre"                type="number"              upsert: false

                value={formData.nombre}

                onChange={handleInputChange}                name="edad"            });

                placeholder="Nombre"

                required                value={formData.edad}

                style={inputStyle}

              />                onChange={handleChange}          if (uploadError) {

              <input

                type="text"                placeholder="Edad"            console.warn('⚠️ Error subiendo foto:', uploadError.message);

                name="apellido"

                value={formData.apellido}                min="13"            // Continuar sin foto si falla

                onChange={handleInputChange}

                placeholder="Apellido"                max="100"          } else {

                required

                style={inputStyle}                style={{            // Obtener URL pública

              />

              <input                  width: '100%',            const { data: { publicUrl } } = supabase.storage

                type="number"

                name="edad"                  padding: '12px',              .from('avatars')

                value={formData.edad}

                onChange={handleInputChange}                  marginBottom: '16px',              .getPublicUrl(fileName);

                placeholder="Edad"

                min="16"                  border: '1px solid #555',            fotoUrl = publicUrl;

                max="60"

                required                  borderRadius: '8px',            console.log('✅ Foto subida exitosamente:', fotoUrl);

                style={inputStyle}

              />                  background: '#2a2a2a',          }

              <input

                type="tel"                  color: '#fff',        } catch (photoError) {

                name="telefono"

                value={formData.telefono}                  fontSize: '16px',          console.warn('⚠️ Error en proceso de foto:', photoError);

                onChange={handleInputChange}

                placeholder="Teléfono"                  boxSizing: 'border-box'          // Continuar sin foto

                required

                style={inputStyle}                }}        }

              />

              <select              />      }

                name="pais"

                value={formData.pais}              <input

                onChange={handleInputChange}

                style={inputStyle}                type="tel"      // 3. Calcular puntaje inicial basado en datos del formulario

              >

                <option value="México">México</option>                name="telefono"      const calcularPuntajeInicial = () => {

                <option value="Argentina">Argentina</option>

                <option value="España">España</option>                value={formData.telefono}        let puntaje = 50; // Base

                <option value="Colombia">Colombia</option>

                <option value="Chile">Chile</option>                onChange={handleChange}        

                <option value="Otro">Otro</option>

              </select>                placeholder="Teléfono (opcional)"        // Puntos por experiencia

              <input

                type="text"                style={{        switch(formData.experiencia.toLowerCase()) {

                name="ubicacion"

                value={formData.ubicacion}                  width: '100%',          case 'principiante': puntaje += 10; break;

                onChange={handleInputChange}

                placeholder="Ciudad/Ubicación"                  padding: '12px',          case 'intermedio': puntaje += 25; break;

                required

                style={inputStyle}                  marginBottom: '16px',          case 'avanzado': puntaje += 40; break;

              />

            </>                  border: '1px solid #555',          case 'semi-profesional': puntaje += 55; break;

          )}

                  borderRadius: '8px',          case 'profesional': puntaje += 70; break;

          {/* PASO 3: Información Futbolística */}

          {paso === 3 && (                  background: '#2a2a2a',        }

            <>

              <h3 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>                  color: '#fff',        

                Información Futbolística

              </h3>                  fontSize: '16px',        // Puntos por frecuencia de juego

              <select

                name="posicion"                  boxSizing: 'border-box'        const frecuencia = parseInt(formData.vecesJuegaPorSemana);

                value={formData.posicion}

                onChange={handleInputChange}                }}        if (frecuencia >= 5) puntaje += 20;

                required

                style={inputStyle}              />        else if (frecuencia >= 3) puntaje += 15;

              >

                <option value="">Selecciona Posición</option>            </>        else if (frecuencia >= 2) puntaje += 10;

                <option value="Portero">Portero</option>

                <option value="Defensa">Defensa</option>          )}        else if (frecuencia >= 1) puntaje += 5;

                <option value="Mediocampista">Mediocampista</option>

                <option value="Delantero">Delantero</option>        

              </select>

              <select          {paso === 3 && (        // Puntos por disponibilidad

                name="experiencia"

                value={formData.experiencia}            <>        if (formData.disponibilidad === 'Todos los días') puntaje += 15;

                onChange={handleInputChange}

                required              <h3 style={{ color: gold, marginBottom: '20px' }}>Información Futbolística</h3>        else if (formData.disponibilidad === 'Flexible') puntaje += 10;

                style={inputStyle}

              >              <select        else if (formData.disponibilidad === 'Fines de semana') puntaje += 8;

                <option value="">Nivel de Experiencia</option>

                <option value="Principiante">Principiante</option>                name="posicion"        else if (formData.disponibilidad === 'Entre semana') puntaje += 5;

                <option value="Intermedio">Intermedio</option>

                <option value="Avanzado">Avanzado</option>                value={formData.posicion}        

                <option value="Profesional">Profesional</option>

              </select>                onChange={handleChange}        // Puntos por foto de perfil

              <input

                type="text"                style={{        if (fotoUrl) puntaje += 15;

                name="equipoFavorito"

                value={formData.equipoFavorito}                  width: '100%',        

                onChange={handleInputChange}

                placeholder="Equipo Favorito"                  padding: '12px',        // Puntos por edad (edad ideal 20-30)

                required

                style={inputStyle}                  marginBottom: '16px',        const edad = parseInt(formData.edad);

              />

              <input                  border: '1px solid #555',        if (edad >= 20 && edad <= 30) puntaje += 10;

                type="number"

                name="peso"                  borderRadius: '8px',        else if (edad >= 18 && edad <= 35) puntaje += 5;

                value={formData.peso}

                onChange={handleInputChange}                  background: '#2a2a2a',        

                placeholder="Peso (kg)"

                min="40"                  color: '#fff',        return Math.min(puntaje, 100); // Máximo 100 puntos

                max="150"

                style={inputStyle}                  fontSize: '16px',      };

              />

            </>                  boxSizing: 'border-box'

          )}

                }}      const puntajeInicial = calcularPuntajeInicial();

          {/* PASO 4: Disponibilidad */}

          {paso === 4 && (              >

            <>

              <h3 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>                <option value="">Selecciona tu posición</option>      // 4. Crear perfil completo en la tabla usuarios

                Disponibilidad

              </h3>                <option value="Portero">Portero</option>      const perfilCompleto = {

              <select

                name="disponibilidad"                <option value="Defensa">Defensa</option>        id: authData.user.id,

                value={formData.disponibilidad}

                onChange={handleInputChange}                <option value="Mediocampista">Mediocampista</option>        email: formData.email,

                required

                style={inputStyle}                <option value="Delantero">Delantero</option>        nombre: formData.nombre,

              >

                <option value="">Disponibilidad General</option>              </select>        edad: parseInt(formData.edad),

                <option value="Mañanas">Mañanas</option>

                <option value="Tardes">Tardes</option>              <select        telefono: formData.telefono,

                <option value="Noches">Noches</option>

                <option value="Fines de semana">Fines de semana</option>                name="experiencia"        pais: formData.pais,

                <option value="Flexible">Flexible</option>

              </select>                value={formData.experiencia}        ciudad: formData.ubicacion,

              <select

                name="vecesJuegaPorSemana"                onChange={handleChange}        posicion_favorita: formData.posicion,

                value={formData.vecesJuegaPorSemana}

                onChange={handleInputChange}                style={{        nivel_habilidad: formData.experiencia.toLowerCase(),

                required

                style={inputStyle}                  width: '100%',        equipo: formData.equipoFavorito,

              >

                <option value="">¿Cuántas veces juegas por semana?</option>                  padding: '12px',        descripcion: `Jugador de ${formData.posicion}. Nivel: ${formData.experiencia}. Disponibilidad: ${formData.disponibilidad}. Juega ${formData.vecesJuegaPorSemana} veces por semana.`,

                <option value="1">1 vez</option>

                <option value="2">2 veces</option>                  marginBottom: '16px',        avatar_url: fotoUrl,

                <option value="3">3 veces</option>

                <option value="4+">4 o más veces</option>                  border: '1px solid #555',        foto_path: fotoPath,

              </select>

              <input                  borderRadius: '8px',        puntaje: puntajeInicial,

                type="text"

                name="horariosPreferidos"                  background: '#2a2a2a',        partidos_jugados: 0,

                value={formData.horariosPreferidos}

                onChange={handleInputChange}                  color: '#fff',        victorias: 0,

                placeholder="Horarios Preferidos (ej: Lunes 18:00, Miércoles 19:00)"

                style={inputStyle}                  fontSize: '16px',        derrotas: 0,

              />

            </>                  boxSizing: 'border-box'        goles: 0,

          )}

                }}        asistencias: 0,

          {/* PASO 5: Foto de Perfil */}

          {paso === 5 && (              >        tarjetas_amarillas: 0,

            <>

              <h3 style={{ color: gold, marginBottom: '20px', fontSize: '20px' }}>                <option value="">Nivel de experiencia</option>        tarjetas_rojas: 0,

                Foto de Perfil

              </h3>                <option value="Principiante">Principiante</option>        is_active: true,

              <div style={{ 

                textAlign: 'center',                 <option value="Intermedio">Intermedio</option>        email_confirmado: true,

                marginBottom: '20px' 

              }}>                <option value="Avanzado">Avanzado</option>        fecha_registro: new Date().toISOString(),

                {previewImagen ? (

                  <img                 <option value="Profesional">Profesional</option>        tiene_foto: !!fotoUrl

                    src={previewImagen} 

                    alt="Preview"               </select>      };

                    style={{ 

                      width: '150px',             </>

                      height: '150px', 

                      borderRadius: '50%',           )}      // 🔥 TRACK REGISTRATION SUCCESS FINAL

                      objectFit: 'cover',

                      border: `3px solid ${gold}`,      tracker.track('registration_completed_success', {

                      marginBottom: '15px'

                    }}           {/* Botones */}        userId: authData.user.id,

                  />

                ) : (          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>        email: authData.user.email,

                  <div style={{

                    width: '150px',            <button        hasPhoto: !!fotoUrl,

                    height: '150px',

                    borderRadius: '50%',              type="button"        puntajeCalculado: puntajeInicial,

                    background: '#333',

                    display: 'flex',              onClick={handleBack}        steps_completed: 5,

                    alignItems: 'center',

                    justifyContent: 'center',              style={{        registration_method: 'complete_form'

                    margin: '0 auto 15px',

                    border: `2px dashed ${gold}`                flex: 1,      }, true);

                  }}>

                    <span style={{ color: '#888', fontSize: '14px' }}>                padding: '12px',

                      Sin foto

                    </span>                background: 'transparent',      const { error: profileError } = await supabase

                  </div>

                )}                color: gold,        .from('usuarios')

                <input

                  type="file"                border: `2px solid ${gold}`,        .insert([perfilCompleto]);

                  ref={fileInputRef}

                  onChange={handleImagenChange}                borderRadius: '8px',

                  accept="image/*"

                  style={{ display: 'none' }}                fontSize: '16px',      if (profileError) {

                />

                <button                cursor: 'pointer',        // 🔥 TRACK PROFILE CREATION ERROR

                  type="button"

                  onClick={() => fileInputRef.current?.click()}                fontWeight: 'bold'        tracker.track('profile_creation_error', {

                  style={{

                    ...buttonStyle,              }}          error: profileError.message,

                    background: '#444',

                    color: '#fff'            >          userId: authData.user.id

                  }}

                >              ← Atrás        }, true);

                  {previewImagen ? 'Cambiar Foto' : 'Subir Foto (Opcional)'}

                </button>            </button>        throw profileError;

                <p style={{ 

                  color: '#888',             <button      }

                  fontSize: '12px', 

                  marginTop: '10px'               type="submit"

                }}>

                  Formatos: JPG, PNG. Máx 5MB              disabled={loading}      // 🔥 TRACK PROFILE CREATED SUCCESSFULLY

                </p>

              </div>              style={{      tracker.track('profile_created_success', {

            </>

          )}                flex: 2,        userId: authData.user.id,



          {/* Botones de navegación */}                padding: '12px',        profileData: {

          <div style={{ 

            display: 'flex',                 background: loading ? '#666' : gold,          nombre: perfilCompleto.nombre,

            gap: '10px', 

            marginTop: '30px'                 color: loading ? '#ccc' : black,          posicion: perfilCompleto.posicion,

          }}>

            {paso > 1 && (                border: 'none',          experiencia: perfilCompleto.experiencia,

              <button

                type="button"                borderRadius: '8px',          puntaje: puntajeInicial

                onClick={pasoAnterior}

                disabled={loading}                fontSize: '16px',        }

                style={{

                  ...buttonStyle,                fontWeight: 'bold',      }, true);

                  background: '#555',

                  color: '#fff',                cursor: loading ? 'not-allowed' : 'pointer'

                  flex: 1

                }}              }}      // 5. Auto-login y redirección a card de perfil tipo Instagram

              >

                Anterior            >      setSuccess(`¡Usuario creado exitosamente! Puntaje inicial: ${puntajeInicial}/100. Redirigiendo a tu card de jugador...`);

              </button>

            )}              {loading ? 'Procesando...' : (paso === 3 ? 'Completar Registro' : 'Siguiente →')}      

            <button

              type="submit"            </button>      // Limpiar datos temporales del registro

              disabled={loading}

              style={{          </div>      localStorage.removeItem('futpro_registro_progreso');

                ...buttonStyle,

                background: `linear-gradient(135deg, ${gold} 0%, #ffed4e 100%)`,        </form>      localStorage.removeItem('tempRegistroData');

                color: black,

                flex: paso > 1 ? 1 : 2,      </div>      

                opacity: loading ? 0.7 : 1

              }}    </div>      // Guardar datos de sesión completos para la card

            >

              {loading ? 'Procesando...' : paso === 5 ? 'Completar Registro' : 'Siguiente'}  );      const datosCard = {

            </button>

          </div>}        ...perfilCompleto,

        </form>

        puntajeCalculado: puntajeInicial,

        {/* Link a login */}        tipoCard: 'jugador',

        <div style={{         fechaCreacion: new Date().toISOString(),

          textAlign: 'center',         esPrimeraCard: true,

          marginTop: '20px'         categoria: puntajeInicial >= 80 ? 'Élite' : puntajeInicial >= 60 ? 'Avanzado' : puntajeInicial >= 40 ? 'Intermedio' : 'Principiante'

        }}>      };

          <p style={{ color: '#888', fontSize: '14px' }}>      

            ¿Ya tienes cuenta?{' '}      localStorage.setItem('futpro_user_profile', JSON.stringify(datosCard));

            <button      localStorage.setItem('futpro_user_card_data', JSON.stringify(datosCard));

              type="button"      localStorage.setItem('registration_completed', 'true');

              onClick={() => navigate('/')}      localStorage.setItem('user_authenticated', 'true');

              style={{      localStorage.setItem('registroCompleto', 'true');

                background: 'none',      localStorage.setItem('authCompleted', 'true');

                border: 'none',      localStorage.setItem('loginSuccess', 'true');

                color: gold,      localStorage.setItem('show_first_card', 'true');

                cursor: 'pointer',      

                textDecoration: 'underline',      // Marcar que debe ir a la card de perfil después del login

                fontSize: '14px'      localStorage.setItem('postLoginRedirect', '/perfil-card');

              }}      localStorage.setItem('postLoginRedirectReason', 'primera-card-creada');

            >      

              Inicia sesión      console.log('🎉 USUARIO CREADO EXITOSAMENTE - Redirigiendo a Card de Perfil...');

            </button>      console.log('👤 Usuario ID:', authData.user.id);

          </p>      console.log('📧 Email:', authData.user.email);

        </div>      console.log('⭐ Puntaje inicial:', puntajeInicial);

      </div>      console.log('🏆 Categoría:', datosCard.categoria);

    </div>      console.log('📋 Perfil completo guardado');

  );      

};      // Redirección inmediata a la card de perfil

      const redirectToCard = () => {

export default RegistroNuevo;        console.log('🎯 Ejecutando redirección a Card de Perfil...');

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