import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

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
    experiencia: '',
    equipoFavorito: '',
    disponibilidad: '',
    foto: null,
    fotoNombre: '',
    fotoTipo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImagen, setPreviewImagen] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      // Guardar archivo y metadatos para posterior subida (tipo Instagram)
      setFormData(prev => ({ 
        ...prev, 
        foto: file,
        fotoNombre: file.name,
        fotoTipo: file.type
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImagen(e.target.result);
      reader.readAsDataURL(file);
    }
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
            posicion: Array.isArray(formData.posicion) ? formData.posicion.join(',') : formData.posicion,
            experiencia: formData.experiencia,
            equipoFavorito: formData.equipoFavorito,
            disponibilidad: formData.disponibilidad
          }
        }
      });

      if (authError) throw authError;

      // 2. Guardar usuario en tabla 'usuarios' (si existe la tabla)
      // Solo si el usuario fue creado correctamente
      let avatarUrl = null;
      // 2.a Subir foto a Supabase Storage tipo Instagram (si el usuario subió imagen)
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

      if (signUpData && signUpData.user) {
        const { id, email } = signUpData.user;
        // 2.b Guardar registro en tabla usuarios, incluyendo url del avatar (si existe)
        await supabase.from('usuarios').insert([
          {
            id_auth: id,
            email: email,
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            edad: formData.edad,
            pais: formData.pais,
            posicion: Array.isArray(formData.posicion) ? formData.posicion.join(',') : formData.posicion,
            experiencia: formData.experiencia,
            equipo_favorito: formData.equipoFavorito,
            disponibilidad: formData.disponibilidad,
            avatar_url: avatarUrl
          }
        ]);
      }

      setSuccess('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
      localStorage.removeItem('futpro_registro_draft');
      // Redirigir inmediatamente a la homepage
      setTimeout(() => { navigate('/'); }, 1500);
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error en el registro. Inténtalo de nuevo.');
    }

    setLoading(false);
  };

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (formData.email || formData.nombre) {
        setAutoSaving(true);
        const { foto, ...rest } = formData;
        // Guardar solo metadatos y preview para evitar exceder storage y errores de serialización
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

  // Opciones enriquecidas
  const opcionesPosicion = [
    { value: '', label: 'Posición' },
    { value: 'portero', label: 'Portero' },
    { value: 'defensa_central', label: 'Defensa Central' },
    { value: 'lateral_derecho', label: 'Lateral Derecho' },
    { value: 'lateral_izquierdo', label: 'Lateral Izquierdo' },
    { value: 'mediocentro_defensivo', label: 'Mediocentro Defensivo' },
    { value: 'mediocentro', label: 'Mediocentro' },
    { value: 'mediapunta', label: 'Mediapunta' },
    { value: 'extremo_derecho', label: 'Extremo Derecho' },
    { value: 'extremo_izquierdo', label: 'Extremo Izquierdo' },
    { value: 'delantero_centro', label: 'Delantero Centro' }
  ];

  const opcionesExperiencia = [
    { value: '', label: 'Experiencia' },
    { value: 'principiante', label: 'Principiante (0-1 años)' },
    { value: 'amateur', label: 'Amateur (1-3 años)' },
    { value: 'intermedio', label: 'Intermedio (3-5 años)' },
    { value: 'avanzado', label: 'Avanzado (5-8 años)' },
    { value: 'semi_profesional', label: 'Semi-profesional (8-10 años)' },
    { value: 'profesional', label: 'Profesional (10+ años)' }
  ];

  const opcionesDisponibilidad = [
    { value: '', label: 'Disponibilidad' },
    { value: 'lun_mie_vie_tarde', label: 'Lun, Mié, Vie (tarde)' },
    { value: 'mar_jue_noche', label: 'Mar, Jue (noche)' },
    { value: 'fin_de_semana_manana', label: 'Sáb, Dom (mañana)' },
    { value: 'fin_de_semana_tarde', label: 'Sáb, Dom (tarde)' },
    { value: 'todos_los_dias', label: 'Todos los días' },
    { value: 'personalizado', label: 'Personalizado' }
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
            <select multiple value={formData.posicion} onChange={e => {
              const values = Array.from(e.target.selectedOptions).map(o => o.value);
              handleChange('posicion', values);
            }} style={{...inputStyle, height: 90}}>
              {opcionesPosicion.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <select value={formData.experiencia} onChange={e => handleChange('experiencia', e.target.value)} style={inputStyle}>
              {opcionesExperiencia.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <input placeholder="Equipo favorito" value={formData.equipoFavorito} onChange={e => handleChange('equipoFavorito', e.target.value)} style={inputStyle} />
            <select value={formData.disponibilidad} onChange={e => handleChange('disponibilidad', e.target.value)} style={inputStyle}>
              {opcionesDisponibilidad.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
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
                <button type="button" onClick={() => { setPreviewImagen(null); setFormData(prev => ({ ...prev, foto: null, fotoNombre: '', fotoTipo: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ padding: '6px 10px', background: '#c62828', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✕ Quitar</button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ padding: '12px 18px', background: loading ? '#666' : '#22c55e', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{loading ? '⏳ Procesando...' : '🚀 Crear Cuenta'}</button>
            <button type="button" onClick={() => { try { navigate('/'); } catch { window.location.href = '/'; } }} style={{ padding: '12px 18px', background: 'transparent', color: '#FFD700', border: '1px solid #FFD700', borderRadius: 8, cursor: 'pointer' }}>← Volver al Login</button>
          </div>

          <div style={{ marginTop: 10, color: '#999', fontSize: 12, textAlign: 'center' }}>
            Auto-guardado: {autoSaving ? 'guardando...' : (lastSaved ? `último: ${new Date(lastSaved).toLocaleTimeString()}` : 'no guardado')}
          </div>
        </form>
      </div>
    </div>
  );
}
 