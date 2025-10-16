import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import AuthService from '../services/AuthService';

export default function RegistroCompleto() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    edad: '',
    pais: '',
    posicion: [],
    modalidad: '',
    experiencia: '',
    equipoFavorito: '',
    dias: [],
    horario: '',
    foto: null,
    fotoNombre: '',
    fotoTipo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);

  const procesarImagenCuadrada = (file) => new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
          canvas.toBlob((blob) => {
            const processedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
            resolve({ processedFile, dataUrl: canvas.toDataURL('image/jpeg', 0.8) });
          }, 'image/jpeg', 0.8);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError('Selecciona un archivo de imagen válido');
      return;
    }

    try {
      const { processedFile, dataUrl } = await procesarImagenCuadrada(file);
      if (processedFile.size > 5 * 1024 * 1024) {
        setError('La imagen procesada sigue siendo grande (>5MB). Elige otra más pequeña.');
        return;
      }
      setFormData(prev => ({ 
        ...prev, 
        foto: processedFile, 
        fotoNombre: file.name, 
        fotoTipo: file.type 
      }));
      setPreviewImagen(dataUrl);
      setError('');
    } catch (err) {
      setError('Error procesando la imagen: ' + err.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.email || !formData.password || !formData.nombre) {
      return 'Email, contraseña y nombre son obligatorios';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // 1. Registro en Supabase Auth
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            edad: formData.edad,
            pais: formData.pais,
            modalidad: formData.modalidad,
            posicion: Array.isArray(formData.posicion) ? formData.posicion.join(',') : formData.posicion,
            experiencia: formData.experiencia,
            equipoFavorito: formData.equipoFavorito,
            dias: Array.isArray(formData.dias) ? formData.dias.join(',') : formData.dias,
            horario: formData.horario
          }
        }
      });

      if (authError) throw authError;

      // 2. Subir foto si existe
      let avatarUrl = null;
      if (signUpData && signUpData.user && formData.foto) {
        const userId = signUpData.user.id;
        const fileExt = formData.foto.name.split('.').pop();
        const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, formData.foto, {
          cacheControl: '3600',
          upsert: true,
          contentType: formData.foto.type || 'image/jpeg'
        });
        if (uploadError) {
          console.warn('No se pudo subir el avatar:', uploadError.message);
        } else {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          avatarUrl = publicUrlData?.publicUrl || null;
        }
      }

      // 3. Guardar en tabla usuarios
      if (signUpData && signUpData.user) {
        const { id, email } = signUpData.user;
        await supabase.from('usuarios').insert([
          {
            id_auth: id,
            email: email,
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            edad: formData.edad,
            pais: formData.pais,
            modalidad: formData.modalidad,
            posicion: Array.isArray(formData.posicion) ? formData.posicion.join(',') : formData.posicion,
            experiencia: formData.experiencia,
            equipo_favorito: formData.equipoFavorito,
            dias: Array.isArray(formData.dias) ? formData.dias.join(',') : formData.dias,
            horario: formData.horario,
            avatar_url: avatarUrl
          }
        ]);
      }

      setSuccess('¡Registro exitoso! Redirigiendo al home...');
      localStorage.removeItem('futpro_registro_draft');
      setTimeout(() => { 
        try {
          navigate('/home');
        } catch {
          window.location.href = '/home';
        }
      }, 1000);
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error en el registro. Inténtalo de nuevo.');
    }

    setLoading(false);
  };

  // Google Auth handler
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      // Guardar draft antes de redirigir
      if (formData.email || formData.nombre) {
        const { foto, ...rest } = formData;
        localStorage.setItem('futpro_registro_draft', JSON.stringify({ ...rest, previewImagen }));
      }
      await AuthService.signInWithGoogle();
    } catch (err) {
      setError('Error con Google Auth: ' + (err.message || '')); 
    }
    setLoading(false);
  };

  // Autoguardado
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (formData.email || formData.nombre) {
        setAutoSaving(true);
        const { foto, ...rest } = formData;
        localStorage.setItem('futpro_registro_draft', JSON.stringify({
          ...rest,
          previewImagen
        }));
        setLastSaved(Date.now());
        setTimeout(() => setAutoSaving(false), 500);
      }
    }, 1000);
    return () => clearTimeout(saveTimer);
  }, [formData, previewImagen]);

  // Cargar datos guardados
  useEffect(() => {
    const saved = localStorage.getItem('futpro_registro_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { previewImagen: savedPreview, ...rest } = parsed;
        setFormData(prev => ({ ...prev, ...rest }));
        if (savedPreview) setPreviewImagen(savedPreview);
      } catch (e) {
        console.error('Error cargando datos guardados:', e);
      }
    }
  }, []);

  const inputStyle = { 
    padding: 10, 
    borderRadius: 8, 
    border: '1px solid #444', 
    background: '#111', 
    color: '#fff' 
  };

  // Modalidades
  const modalidades = [
    { value: '', label: 'Modalidad' },
    { value: 'futbol_11', label: 'Fútbol 11' },
    { value: 'futbol_10', label: 'Fútbol 10' },
    { value: 'futbol_9', label: 'Fútbol 9' },
    { value: 'futbol_8', label: 'Fútbol 8' },
    { value: 'futbol_7', label: 'Fútbol 7' },
    { value: 'futbol_6', label: 'Fútbol 6' },
    { value: 'futbol_5', label: 'Fútbol 5' },
    { value: 'futsal', label: 'Futsal' },
    { value: 'microfutbol', label: 'Microfútbol' },
    { value: 'futbol_de_salon', label: 'Fútbol de Salón' },
    { value: '1vs1', label: '1 vs 1' },
    { value: '2vs2', label: '2 vs 2' },
    { value: 'banquitas', label: 'Banquitas' }
  ];

  // Posiciones por modalidad
  const posicionesPorModalidad = {
    futbol_11: [
      'Portero', 'Lateral Derecho', 'Defensa Central', 'Lateral Izquierdo',
      'Mediocentro Defensivo', 'Mediocentro', 'Extremo Derecho', 'Extremo Izquierdo',
      'Mediapunta', 'Delantero Centro'
    ],
    futbol_7: [
      'Portero', 'Defensa', 'Lateral', 'Mediocampista', 'Delantero'
    ],
    futsal: [
      'Portero', 'Cierre', 'Ala', 'Pivot'
    ],
    microfutbol: [
      'Portero', 'Defensa', 'Armador', 'Delantero'
    ],
    banquitas: [
      'Jugador', 'Portero'
    ],
    '1vs1': ['Jugador'],
    '2vs2': ['Jugador'],
    futbol_5: ['Portero', 'Defensa', 'Ataque'],
    futbol_6: ['Portero', 'Defensa', 'Ataque'],
    futbol_8: ['Portero', 'Defensa', 'Lateral', 'Mediocampista', 'Delantero'],
    futbol_9: ['Portero', 'Defensa', 'Lateral', 'Mediocampista', 'Delantero'],
    futbol_10: ['Portero', 'Defensa', 'Lateral', 'Mediocampista', 'Delantero'],
    futbol_de_salon: ['Portero', 'Cierre', 'Ala', 'Pivot'],
    default: ['Jugador']
  };

  // Días de juego
  const diasSemana = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  // Horarios
  const horarios = [
    { value: '', label: 'Horario' },
    { value: 'madrugada', label: 'Madrugada (0-6am)' },
    { value: 'manana', label: 'Mañana (6-12am)' },
    { value: 'tarde', label: 'Tarde (12-18pm)' },
    { value: 'noche', label: 'Noche (18-24pm)' },
    { value: 'personalizado', label: 'Personalizado' }
  ];

  // Opciones de experiencia
  const opcionesExperiencia = [
    { value: '', label: 'Experiencia' },
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'profesional', label: 'Profesional' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: 12, 
        padding: 28, 
        width: '100%', 
        maxWidth: 720, 
        color: '#fff' 
      }}>
        <h2 style={{ color: '#FFD700', textAlign: 'center', marginBottom: 20 }}>
          🚀 Registro Completo - FutPro
        </h2>
        
        {error && (
          <div style={{ background: '#c62828', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#2e7d32', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input required placeholder="Nombre *" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} style={inputStyle} />
            <input placeholder="Apellido" value={formData.apellido} onChange={e => handleChange('apellido', e.target.value)} style={inputStyle} />
            <input required type="email" placeholder="Email *" value={formData.email} onChange={e => handleChange('email', e.target.value)} style={inputStyle} />
            <input type="tel" placeholder="Teléfono" value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} style={inputStyle} />
            <input required type="password" placeholder="Contraseña *" value={formData.password} onChange={e => handleChange('password', e.target.value)} style={inputStyle} />
            <input required type="password" placeholder="Confirmar contraseña *" value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} style={inputStyle} />
            <input type="number" min="10" max="100" placeholder="Edad" value={formData.edad} onChange={e => handleChange('edad', e.target.value)} style={inputStyle} />
            <input placeholder="País" value={formData.pais} onChange={e => handleChange('pais', e.target.value)} style={inputStyle} />
            <select value={formData.modalidad} onChange={e => handleChange('modalidad', e.target.value)} style={inputStyle}>
              {modalidades.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <select multiple value={formData.posicion} onChange={e => {
              const values = Array.from(e.target.selectedOptions).map(o => o.value);
              handleChange('posicion', values);
            }} style={{...inputStyle, height: 90}}>
              {(posicionesPorModalidad[formData.modalidad] || posicionesPorModalidad.default).map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <select value={formData.experiencia} onChange={e => handleChange('experiencia', e.target.value)} style={inputStyle}>
              {opcionesExperiencia.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <input placeholder="Equipo favorito" value={formData.equipoFavorito} onChange={e => handleChange('equipoFavorito', e.target.value)} style={inputStyle} />
            <select multiple value={formData.dias} onChange={e => {
              const values = Array.from(e.target.selectedOptions).map(o => o.value);
              handleChange('dias', values);
            }} style={{...inputStyle, height: 90}}>
              {diasSemana.map(dia => (
                <option key={dia.value} value={dia.value}>{dia.label}</option>
              ))}
            </select>
            <select value={formData.horario} onChange={e => handleChange('horario', e.target.value)} style={inputStyle}>
              {horarios.map(h => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#FFD700' }}>📷 Foto de perfil (opcional)</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: 8 }} />
            {previewImagen && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '2px solid #FFD700',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.35)'
                }}>
                  <img src={previewImagen} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: 12, color: '#bbb' }}>
                  <div>Archivo: {formData.fotoNombre}</div>
                  <div>Tipo: {formData.fotoTipo}</div>
                </div>
                <button type="button" onClick={() => { 
                  setPreviewImagen(null); 
                  setFormData(prev => ({ ...prev, foto: null, fotoNombre: '', fotoTipo: '' })); 
                  if (fileInputRef.current) fileInputRef.current.value = ''; 
                }} style={{ 
                  padding: '6px 10px', 
                  background: '#c62828', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  cursor: 'pointer' 
                }}>✕ Quitar</button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="submit" disabled={loading} style={{ 
              padding: '12px 18px', 
              background: loading ? '#666' : '#22c55e', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold' 
            }}>
              {loading ? '⏳ Procesando...' : '🚀 Crear Cuenta'}
            </button>
            <button type="button" onClick={handleGoogleAuth} disabled={loading} style={{ 
              padding: '12px 18px', 
              background: '#4285F4', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8 
            }}>
              <span style={{ fontSize: 18 }}>G</span> Registrarse con Google
            </button>
            <button type="button" onClick={() => { 
              try { 
                navigate('/'); 
              } catch { 
                window.location.href = '/'; 
              } 
            }} style={{ 
              padding: '12px 18px', 
              background: 'transparent', 
              color: '#FFD700', 
              border: '1px solid #FFD700', 
              borderRadius: 8, 
              cursor: 'pointer' 
            }}>← Volver al Login</button>
          </div>

          <div style={{ marginTop: 10, color: '#999', fontSize: 12, textAlign: 'center' }}>
            Auto-guardado: {autoSaving ? 'guardando...' : (lastSaved ? `último: ${new Date(lastSaved).toLocaleTimeString()}` : 'no guardado')}
          </div>
        </form>
      </div>
    </div>
  );
}